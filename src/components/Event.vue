<template>
	<v-expansion-panel hide-actions>
		<v-expansion-panel-header @click="createMap">
			<v-row align="center" justify="center" no-gutters>
				<v-col>
					<v-icon
						:color="event.status == 'accepted' ? 'success' : event.proposer._id.$oid == $store.state.userProfile._id.$oid ? 'accent' : 'warning'"
					>{{ event.status == 'accepted' ? 'mdi-calendar-check-outline' : 'mdi-calendar-question' }}</v-icon>
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
			<v-card height="300" class="pa-1 mt-3" rounded elevation="8">
				<v-card :id="`event-map-${event._id.$oid}`" height="292" rounded elevation="4"></v-card>
			</v-card>
			<!-- <v-row class="d-flex justify-space-around">
			<v-btn color="info" class="mt-3">Edit</v-btn>
			<v-dialog v-model="dialog" persistent max-width="290">
			<template v-slot:activator="{ on, attrs }">
			<v-btn color="error" class="mt-3" v-bind="attrs" v-on="on">Remove</v-btn>
			</template>
			<v-card>
			<v-card-title class="headline">Are you sure?</v-card-title>
			<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="green darken-1" text @click="dialog = false">Cancel</v-btn>
			<v-btn color="green darken-1" text @click="removeDog">Yes</v-btn>
			</v-card-actions>
			</v-card>
			</v-dialog>
			</v-row>-->
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
				dialog: false,
				map: ""
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
			}
		},
		methods: {
			createMap() {
				this.$nextTick(() => {
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

					this.map.on(
						"load",
						setTimeout(() => this.map.resize(), 100)
					);

					this.addMapMarker({
						lng: this.event.location.coordinates[0],
						lat: this.event.location.coordinates[1]
					} ,"#43AA8B")

					this.addMapMarker({
						lng: this.otherUser.location.coordinates[0],
						lat: this.otherUser.location.coordinates[1]
					} ,"#277DA1")

					this.addMapMarker({
						lng: this.$store.state.userProfile.location.coordinates[0],
						lat: this.$store.state.userProfile.location.coordinates[1]
					} ,"#F8961E")

					

					// Add click listener
					// this.addMapClickListener();
				});
			},
			removeMapMarkers() {
				const oldMarker = document.querySelector(".mapboxgl-marker");
				if (oldMarker) {
					oldMarker.parentElement.removeChild(oldMarker);
				}
			},
			addMapMarker(lngLat, color) {
				new mapboxgl.Marker({ color })
					.setLngLat(lngLat)
					.addTo(this.map);
			},
			formatDate($date) {
				return new moment($date).format("dddd, Do MMM");
			},
			formatTime($date) {
				return new moment($date).format("HH: mm");
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