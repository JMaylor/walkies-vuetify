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
				></v-slider>
			</v-col>
			<v-col cols="4" md="3">
				<v-combobox
					v-model="genders"
					:items="['Male', 'Female']"
					label="Genders"
					multiple
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
				></v-range-slider>
			</v-col>
		</v-row>

		<v-row v-if="users.length > 0" justify="center">
			<v-col cols="12" md="9"
				><v-badge
					class="ml-4 mt-3"
					left
					color="accent"
					icon="mdi-calendar-alert"
					><small
						>*Indicates an event is already pending with this
						user</small
					></v-badge
				><v-expansion-panels>
					<User
						v-for="user in filteredUsers"
						:key="user._id.$oid"
						:user="user"
					/>
				</v-expansion-panels>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	const axios = require("axios");
	import moment from "moment";
	import User from "@/components/User";

	export default {
		components: {
			User
		},
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
						distance: 10
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
		mounted() {
			this.searchUsers();
		}
	};
</script>