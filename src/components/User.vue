<template>
	<v-expansion-panel hide-actions>
		<v-expansion-panel-header>
			<v-row align="center" justify="center" no-gutters>
				<v-col>
					<v-icon :color="user.gender == 'Male' ? 'blue' : 'pink'">{{
						user.gender == "Male"
							? "mdi-gender-male"
							: "mdi-gender-female"
					}}</v-icon>
					<strong v-html="user.first_name"></strong>
				</v-col>
				<v-col>{{ displayAge(user) }} old</v-col>

				<v-col>
					<v-icon :color="user.dogs.length > 0 ? 'primary' : 'grey'"
						>mdi-dog</v-icon
					>
					{{ user.dogs.length }}
				</v-col>
				<v-col>{{ travelDistance }} miles away</v-col>
			</v-row>
		</v-expansion-panel-header>

		<v-expansion-panel-content class="py-0 my-0">
			<v-divider></v-divider>
			<v-row v-if="user.dogs.length > 0" class="mt-2" justify="center">
				<v-data-table
					hide-default-footer
					dense
					caption="Dogs"
					:headers="headers"
					:items="user.dogs"
					class="elevation-1"
				>
					<template v-slot:[`item.date_of_birth`]="{ item }">{{
						displayAge(item)
					}}</template>
				</v-data-table>
			</v-row>
			<v-row class="d-flex justify-space-around">
				<v-dialog v-model="dialog" max-width="500">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							color="primary"
							class="mt-3"
							v-bind="attrs"
							v-on="on"
							>Go Walkies!</v-btn
						>
					</template>
					<v-card>
						<v-card-title class="headline">Arrange</v-card-title>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-datetime-picker
											label="When?"
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
										<label>Where?</label>
										<v-card
											height="300"
											class="pa-1"
											rounded
											elevation="8"
										>
											<v-card
												:id="
													`event-map-${user._id.$oid}`
												"
												height="292"
												rounded
												elevation="4"
											></v-card>
										</v-card>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								color="grey"
								
								@click="dialog = false"
								>Cancel</v-btn
							>
							<v-btn color="secondary" @click="sendInvite">Send Invite</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-row>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
	const moment = require("moment");
	export default {
		props: ["user"],
		data() {
			return {
				dialog: false,
				headers: [
					{ text: "Name", value: "name" },
					{ text: "Breed", value: "breed" },
					{ text: "Age", value: "date_of_birth" }
				],
				datePickerProps: {
					min: new moment()
						.add(1, "d")
						.toISOString()
						.substr(0, 10)
				},
				timePickerProps: {},
				datetime: null,
				location: {
					type: "Point",
					coordinates: []
				},
				map: ""
			};
		},
		watch: {
			dialog(visible) {
				if (visible) {
					console.log("opened");
					this.$nextTick(() => {
						this.createMap();
					});
				}
			}
		},
		computed: {
			travelDistance() {
				return (
					Math.round(
						this.getDistanceFromLatLonInMiles(
							this.$store.state.userProfile.location.coordinates[0],
							this.$store.state.userProfile.location.coordinates[1],
							this.user.location.coordinates[0],
							this.user.location.coordinates[1]
						) * 10
					) / 10
				);
			}
		},
		methods: {
			deg2rad(deg) {
				return deg * (Math.PI / 180);
			},
			getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
				var R = 3963.2; // Radius of the earth in miles
				var dLat = this.deg2rad(lat2 - lat1);
				var dLon = this.deg2rad(lon2 - lon1);
				var a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(this.deg2rad(lat1)) *
						Math.cos(this.deg2rad(lat2)) *
						Math.sin(dLon / 2) *
						Math.sin(dLon / 2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				var d = R * c; // Distance in miles
				return d;
			},
			displayAge(dog) {
				return moment().diff(dog.date_of_birth.$date, "years") < 1
					? `${moment().diff(dog.date_of_birth.$date, "months")} months`
					: `${moment().diff(dog.date_of_birth.$date, "years")} years`;
			},
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
				const oldMarker = document.querySelector(".mapboxgl-marker");
				if (oldMarker) {
					oldMarker.parentElement.removeChild(oldMarker);
				}
			},
			addMapMarker(lngLat) {
				new mapboxgl.Marker({ color: "#43AA8B" })
					.setLngLat(lngLat)
					.addTo(this.map);
			},
			setLocationCoordinates(lngLat) {
				this.location.coordinates = [
					Math.round(lngLat.lng * 10000) / 10000,
					Math.round(lngLat.lat * 10000) / 10000
				];
			},
			sendInvite() {
				console.log('sending invite')
				this.dialog = false;
			}
		}
	};
</script>