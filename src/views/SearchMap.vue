<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col align="center">
				<h2 class="display-1">Search for Walkies!</h2>
			</v-col>
		</v-row>

		<v-row align="center" justify="center">
			<v-col cols="4" md="3">
				<v-subheader class="pl-0">Distance (miles)</v-subheader>
				<v-slider
					prepend-icon="mdi-map-marker-distance"
					v-model="distance"
					min="1"
					thumb-size="24"
					max="10"
					thumb-label="always"
					@end="refreshMarkers"
				></v-slider>
			</v-col>
			<v-col cols="4" md="3">
				<v-combobox
					v-model="genders"
					:items="['Male', 'Female']"
					label="Genders"
					multiple
					@change="refreshMarkers"
				>
				</v-combobox>
			</v-col>
			<v-col cols="4" md="3">
				<v-subheader class="pl-0">Ages</v-subheader>
				<v-range-slider
					dense
					min="18"
					max="99"
					thumb-label
					v-model="ages"
					@end="refreshMarkers"
				></v-range-slider>
			</v-col>
		</v-row>

		<v-card height="60vh" class="pa-1 mt-3" rounded elevation="8">
			<v-card id="search-map" height="calc(60vh - 8px)" rounded elevation="4"></v-card>
		</v-card>
	</v-container>
</template>

<script>
	const axios = require("axios");
	const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
	import moment from "moment";
	import Vue from "vue";
	import UserPopup from "@/components/UserPopup";

	const UserPopupClass = Vue.extend(UserPopup);

	export default {
		data: () => ({
			genders: ["Male", "Female"],
			ages: [18, 99],
			distance: 10,
			map: "",
			users: []
		}),
		computed: {
			filteredUsers() {
				return this.users.filter(x => {
					const age = moment().diff(x.date_of_birth.$date, "years");
					return (
						this.genders.includes(x.gender) &&
						age >= this.ages[0] &&
						age <= this.ages[1] &&
						this.calcDistance(x) < this.distance
					);
				});
			}
		},
		methods: {
			calcDistance(user) {
				return (
					Math.round(
						this.getDistanceFromLatLonInMiles(
							this.$store.state.userProfile.location.coordinates[1],
							this.$store.state.userProfile.location.coordinates[0],
							user.location.coordinates[1],
							user.location.coordinates[0]
						) * 10
					) / 10
				);
			},
			async searchUsers() {
				const searchResults = await axios.post(
					`${this.$store.state.baseURL}user/search`,
					{
						distance: 20
					},
					{
						headers: {
							Authorization: `Bearer ${this.$store.state.token}`
						}
					}
				);

				const users = searchResults.data.users;
				users.forEach((user, userIndex) => {
					users[userIndex] = JSON.parse(user);
					users[userIndex].dogs.forEach((dog, dogIndex) => {
						users[userIndex].dogs[dogIndex] = JSON.parse(dog);
					});
				});
				this.users = users;

				this.addSearchResultMarkers();
			},
			createMap() {
				// retreieve access token
				mapboxgl.accessToken = this.$store.state.mapboxKey;
				// create map
				this.map = new mapboxgl.Map({
					container: "search-map",
					style: "mapbox://styles/mapbox/outdoors-v11",
					// Center is London-ish area by default
					center: [-0.496934, 51.437032],
					// Zoom up close if user accepted giving coordinates
					zoom: 10
				});

				// Adds basic zoom and rotate control
				const nav = new mapboxgl.NavigationControl();
				this.map.addControl(nav, "top-right");

				// Add marker for user
				// const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
				// 	'<div id="vue-popup-content"></div>'
				// );
				this.addMapMarker(
					{
						lng: this.$store.state.userProfile.location.coordinates[0],
						lat: this.$store.state.userProfile.location.coordinates[1]
					},
					"#F8961E"
				);

				new UserPopupClass({
					propsData: {
						info: this.$store.state.userProfile.last_name
					}
				});
				// popupInstance.$mount("#vue-popup-content");
			},
			removeMapMarkers() {
				const oldMarkers = document.querySelectorAll(
					".search-result-marker"
				);
				if (oldMarkers) {
					oldMarkers.forEach(el => el.parentElement.removeChild(el));
				}
			},
			addMapMarker(lngLat, color, className, popup) {
				const marker = new mapboxgl.Marker({ color }).setLngLat(lngLat);
				if (popup) {
					marker.setPopup(popup);
				}
				marker.addTo(this.map);
				if (className) {
					marker.getElement().classList.add(className);
				}
			},
			refreshMarkers() {
				this.removeMapMarkers();
				this.addSearchResultMarkers();
			},
			addSearchResultMarkers() {
				this.$nextTick(() => {
					this.filteredUsers.forEach(user => {
						const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
							`<button type="button" class="v-btn v-btn--contained theme--light v-size--default secondary"><span class="v-btn__content">${user.first_name}</span></button>`
						);
						this.addMapMarker(
							{
								lng: user.location.coordinates[0],
								lat: user.location.coordinates[1]
							},
							"#43AA8B",
							"search-result-marker",
							popup
						);
					});
				});
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
		},
		created() {
			this.searchUsers();
		},
		mounted() {
			if (this.$store.state.userProfile) {
				this.createMap();
				this.searchUsers();
			} else {
				this.$store.watch(
					() => this.$store.state.userProfile,
					async () => {
						this.createMap();
						this.searchUsers();
					}
				);
			}
		}
	};
</script>