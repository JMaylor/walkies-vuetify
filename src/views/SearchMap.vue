<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="8" md="4">
				<h2 class="display-1">Search</h2>
			</v-col>
		</v-row>
		<v-card height="300" class="pa-1 mt-3" rounded elevation="8">
			<v-card id="search-map" height="292" rounded elevation="4"></v-card>
		</v-card>
	</v-container>
</template>

<script>
	const axios = require("axios");
	const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
	import Vue from "vue";
	import UserPopup from "@/components/UserPopup";

	const UserPopupClass = Vue.extend(UserPopup);

	export default {
		data: () => ({
			distance: 1,
			map: ""
		}),
		methods: {
			async searchUsers() {
				const searchResults = await axios.post(
					`${this.$store.state.baseURL}user/search`,
					{
						distance: this.distance
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
				users.forEach(user => {
					const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
						`<button type="button" class="v-btn v-btn--contained theme--light v-size--default secondary"><span class="v-btn__content">${user.first_name}</span></button>`
					);
					this.addMapMarker(
						{
							lng: user.location.coordinates[0],
							lat: user.location.coordinates[1]
						},
						"#43AA8B",
						popup
					);
				});
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
				const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
					'<div id="vue-popup-content"></div>'
				);
				this.addMapMarker(
					{
						lng: this.$store.state.userProfile.location.coordinates[0],
						lat: this.$store.state.userProfile.location.coordinates[1]
					},
					"#F8961E",
					popup
				);
				const popupInstance = new UserPopupClass({
					propsData: {
						info: this.$store.state.userProfile.last_name
					}
				});
				popupInstance.$mount('#vue-popup-content');

			},
			addMapMarker(lngLat, color, popup) {
				new mapboxgl.Marker({ color })
					.setLngLat(lngLat)
					.setPopup(popup)
					.addTo(this.map);
			}
		},
		mounted() {
			this.createMap();
			this.searchUsers();
		}
	};
</script>