<template>
	<v-expansion-panel @change="destroyMap" v-model="content">
		<v-expansion-panel-header @click="createMap">
			<v-row align="center" justify="center" no-gutters>
				<v-col>
					<v-icon
						:color="
							event.status == 'accepted'
								? 'success'
								: event.proposer._id.$oid ==
								  $store.state.userProfile._id.$oid
								? 'accent'
								: 'warning'
						"
						>{{
							event.status == "accepted"
								? "mdi-calendar-check-outline"
								: "mdi-calendar-question"
						}}</v-icon
					>
				</v-col>
				<v-col>{{ formatDate(event.time.$date) }}</v-col>
				<v-col>{{ formatTime(event.time.$date) }}</v-col>
				<v-col>{{ otherUser.first_name }}</v-col>
				<v-col>{{ travelDistance }} miles away</v-col>
				<v-col>Directions Link</v-col>
			</v-row>
		</v-expansion-panel-header>

		<v-expansion-panel-content class="py-0 my-0">
			<v-divider></v-divider>

			<v-row
				v-if="!editting"
				justify="center"
				align="center"
				class="text-center"
			>
				<v-col cols="4"
					><v-btn color="error" @click="declineEvent">{{
						status == "Invited" ? "Decline" : "Cancel"
					}}</v-btn></v-col
				>
				<v-col cols="4"
					><v-btn
						v-if="status == 'Invited'"
						color="success"
						@click="acceptEvent"
						>Accept</v-btn
					></v-col
				>
				<v-col cols="4"
					><v-btn color="accent" @click="initEditEvent">{{
						status == "Invited" ? "Counter" : "Amend"
					}}</v-btn></v-col
				>
			</v-row>
			<v-row v-else justify="center" align="center" class="text-center">
				<v-col cols="4"
					><v-btn color="success" @click="updateEvent"
						>Suggest New Details</v-btn
					></v-col
				>
				<v-col cols="4"
					><v-btn color="warning" @click="cancelEditEvent"
						>Stop editing</v-btn
					></v-col
				>
			</v-row>

			<v-row
				v-if="editting"
				justify="center"
				align="center"
				class="text-center"
				><v-col cols="4">
					<v-datetime-picker label="When?" v-model="time">
						<template slot="dateIcon">
							<v-icon>mdi-calendar</v-icon>
						</template>
						<template slot="timeIcon">
							<v-icon>mdi-clock</v-icon>
						</template>
					</v-datetime-picker>
				</v-col></v-row
			>
			<v-card height="300" class="pa-1 mt-3" rounded elevation="8">
				<v-card
					:id="`event-map-${event._id.$oid}`"
					height="292"
					rounded
					elevation="4"
				></v-card>
			</v-card>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	// const axios = require("axios");
	const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
	import moment from "moment";

	export default {
		props: ["event"],
		data() {
			return {
				content: false,
				test: "",
				dialog: false,
				map: "",
				editting: false,
				location: {
					type: "Point",
					coordinates: []
				},
				time: ""
			};
		},
		computed: {
			otherUser() {
				return this.event.invited._id.$oid ==
					this.$store.state.userProfile._id.$oid
					? this.event.proposer
					: this.event.invited;
			},
			travelDistance() {
				return (
					Math.round(
						this.getDistanceFromLatLonInMiles(
							this.$store.state.userProfile.location.coordinates[1],
							this.$store.state.userProfile.location.coordinates[0],
							this.event.location.coordinates[1],
							this.event.location.coordinates[0]
						) * 10
					) / 10
				);
			},
			status() {
				if (this.event.status == "accepted") {
					return "Confirmed";
				} else if (
					this.event.invited._id.$oid ==
					this.$store.state.userProfile._id.$oid
				) {
					return "Invited";
				}
				return "Pending";
			}
		},
		methods: {
			acceptEvent() {
				console.log("accepting event");
				this.$store
					.dispatch("acceptEvent", this.event._id.$oid)
					.then(response => {
						console.log(response);
						this.$emit("close");
					})
					.catch(err => console.log(err));
			},
			declineEvent() {
				console.log("declining event");
				this.$store
					.dispatch("declineEvent", this.event._id.$oid)
					.then(response => {
						console.log(response);
						this.$emit("close");
					})
					.catch(err => console.log(err));
			},
			updateEvent() {
				console.log("sending counter offer!");
				this.$store
					.dispatch("updateEvent", {
						id: this.event._id.$oid,
						details: {
							time: moment
								.utc(this.time)
								.format("YYYY-MM-DD HH:mm:ss"),
							location: this.location,
							proposer: this.$store.state.userProfile._id.$oid,
							invited: this.otherUser._id.$oid
						}
					})
					.then(response => {
						console.log(response);
						this.$emit("close");
					})
					.catch(err => console.log(err));
			},
			initEditEvent() {
				this.editting = true;
				// add map event listener
				this.location.coordinates = this.event.location.coordinates;
				this.time = moment(this.event.time.$date)._d;
				this.addMapClickListener();
			},
			cancelEditEvent() {
				this.editting = false;
				// remove map event listener
				this.location.coordinates = [];
				this.time = "";
				this.removeMapClickListener();
				this.removeMapMarkers();
				this.addMapMarker(
					{
						lng: this.event.location.coordinates[0],
						lat: this.event.location.coordinates[1]
					},
					"#43AA8B",
					"proposed-marker"
				);
			},
			destroyMap() {
				console.log(this.content);
				console.log("destroying map", this.event._id.$oid);
			},
			createMap() {
				setTimeout(() => {
					// retreieve access token
					mapboxgl.accessToken = this.$store.state.mapboxKey;
					// create map
					this.map = new mapboxgl.Map({
						container: `event-map-${this.event._id.$oid}`,
						style: "mapbox://styles/mapbox/outdoors-v11",
						center: this.event.location.coordinates,
						zoom: 12
					});

					// Adds basic zoom and rotate control
					const nav = new mapboxgl.NavigationControl();
					this.map.addControl(nav, "top-right");

					// this.map.on(
					// 	"load",
					// 	setTimeout(() => this.map.resize(), 2000)
					// );

					// event location marker
					this.addMapMarker(
						{
							lng: this.event.location.coordinates[0],
							lat: this.event.location.coordinates[1]
						},
						"#43AA8B",
						"proposed-marker"
					);

					this.addMapMarker(
						{
							lng: this.otherUser.location.coordinates[0],
							lat: this.otherUser.location.coordinates[1]
						},
						"#277DA1"
					);

					this.addMapMarker(
						{
							lng: this.$store.state.userProfile.location
								.coordinates[0],
							lat: this.$store.state.userProfile.location
								.coordinates[1]
						},
						"#F8961E"
					);
				}, 100);
			},
			setLocationCoordinates(lngLat) {
				this.location.coordinates = [
					Math.round(lngLat.lng * 10000) / 10000,
					Math.round(lngLat.lat * 10000) / 10000
				];
			},
			onClickMarkerAdder(e) {
				// When user clicks on the map, the location is stored in a data variable
				this.setLocationCoordinates(e.lngLat);

				// Remove any old markers on the map that they previously set
				this.removeMapMarkers();

				// Add the new marker
				this.addMapMarker(e.lngLat, "#43AA8B", "proposed-marker");
			},
			addMapClickListener() {
				this.map.on("click", this.onClickMarkerAdder);
			},
			removeMapClickListener() {
				this.map.off("click", this.onClickMarkerAdder);
			},
			removeMapMarkers() {
				const oldMarkers = document.querySelectorAll('.proposed-marker');
				if (oldMarkers) {
					oldMarkers.forEach(el => el.parentElement.removeChild(el));
				}
			},
			addMapMarker(lngLat, color, className = "") {
				let marker = new mapboxgl.Marker({ color })
					.setLngLat(lngLat)
					.addTo(this.map);
				if (className != "") {
					marker.getElement().classList.add(className);
				}
			},
			formatDate($date) {
				return new moment($date).format("dddd, Do MMM");
			},
			formatTime($date) {
				return new moment($date).format("HH:mm");
			},
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
			}
		}
	};
</script>