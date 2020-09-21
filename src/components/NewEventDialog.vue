<template>
	<v-dialog v-model="dialog" max-width="500">
		<template v-slot:activator="{ on, attrs }">
			<v-btn color="primary" class="mt-3" v-bind="attrs" v-on="on"
				>Go Walkies!</v-btn
			>
		</template>
		<v-card v-if="user._id">
			<v-card-title class="headline">Arrange</v-card-title>
			<v-card-text>
				<v-container>
					<v-form :value="formValid">
						<v-row>
							<v-col cols="12">
								<v-datetime-picker
									label="When?"
									required
									v-model="datetime"
									:datePickerProps="datePickerProps"
								>
									<template slot="dateIcon">
										<v-icon>mdi-calendar</v-icon>
									</template>
									<template slot="timeIcon">
										<v-icon>mdi-clock</v-icon>
									</template>
								</v-datetime-picker>
							</v-col>
							<v-col cols="12">
								<v-card
									height="300"
									class="pa-1"
									rounded
									elevation="8"
								>
									<v-card
										:id="`event-map-${user._id.$oid}`"
										height="292"
										rounded
										elevation="4"
									></v-card>
									<v-btn
										color="info"
										dark
										absolute
										top
										left
										fab
										@click="requestLocation"
									>
										<v-icon>mdi-crosshairs-gps</v-icon>
									</v-btn>
								</v-card>
							</v-col>
						</v-row>
					</v-form>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="warning" @click="dialog = false">Cancel</v-btn>
				<v-btn
					color="secondary"
					:disabled="!formValid"
					@click="sendInvite"
					>Send Invite</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import moment from "moment";
	import axios from "axios";
	import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

	export default {
		props: ["user"],
		data() {
			return {
				dialog: false,
				datePickerProps: {
					min: new moment()
						.add(1, "d")
						.toISOString()
						.substr(0, 10),
					required: true,
					rules: [v => !!v || "Required"]
				},
				timePickerProps: {},
				datetime: null,
				location: {
					type: "Point",
					coordinates: []
				}
			};
		},
		computed: {
			formValid() {
				return this.datetime && this.location.coordinates.length == 2;
			}
		},
		watch: {
			user: function() {
				this.dialog = true;
				this.$nextTick(() => {
					this.createMap();
				});
			}
		},
		methods: {
			createMap() {
				// retreieve access token
				mapboxgl.accessToken = this.$store.state.mapboxKey;
				// create map
				this.map = new mapboxgl.Map({
					container: `event-map-${this.user._id.$oid}`,
					style: "mapbox://styles/mapbox/outdoors-v11",
					// Center is London-ish area by default
					center: [-0.496934, 51.437032],
					// Zoom up close if user accepted giving coordinates
					zoom: 5
				});

				// Adds basic zoom and rotate control
				const nav = new mapboxgl.NavigationControl();
				this.map.addControl(nav, "top-right");

				// Add click listener
				this.addMapClickListener();
			},
			addMapClickListener() {
				// When user clicks on the map, the location is stored in a data variable
				this.map.on("click", e => {
					this.setLocationCoordinates(e.lngLat);

					// Remove any old markers on the map that they previously set
					this.removeMapMarkers();

					// Add the new marker
					this.addMapMarker(e.lngLat);
				});
			},
			removeMapMarkers() {
				const oldMarker = document.querySelector(".suggested-location-marker");
				if (oldMarker) {
					oldMarker.parentElement.removeChild(oldMarker);
				}
			},
			addMapMarker(lngLat) {
				new mapboxgl.Marker({ color: "#577590" })
					.setLngLat(lngLat)
					.addTo(this.map)
					.getElement().classList.add('suggested-location-marker')
			},
			setLocationCoordinates(lngLat) {
				this.location.coordinates = [
					Math.round(lngLat.lng * 10000) / 10000,
					Math.round(lngLat.lat * 10000) / 10000
				];
			},
			sendInvite() {
				console.log("sending invite");
				axios
					.post(
						`${this.$store.state.baseURL}events`,
						{
							invited: this.user._id.$oid,
							location: this.location,
							time: moment
								.utc(this.datetime)
								.format("YYYY-MM-DD HH:mm:ss")
						},
						{
							headers: {
								Authorization: `Bearer ${this.$store.state.token}`
							}
						}
					)
					.then(response => console.log(response))
					.catch(error => console.log(error));

				this.dialog = false;
			},
			requestLocation() {
				// Request to get the user's current location
				window.navigator.geolocation.getCurrentPosition(position => {
					// get the latitude and longitude returned
					const lat = position.coords.latitude;
					const lng = position.coords.longitude;

					// set the location data
					this.setLocationCoordinates({
						lng,
						lat
					});

					// remove old markers from map
					this.removeMapMarkers();
					// add marker on map for their location
					this.addMapMarker({
						lng: lng,
						lat: lat
					});

					// fly there on the map
					this.map.flyTo({
						center: [lng, lat],
						zoom: 12
					});
				}, null);
			}
		}
	};
</script>

<style scoped>
</style>