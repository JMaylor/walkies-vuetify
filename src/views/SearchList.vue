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
					@end="searchUsers"
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
				><v-expansion-panels popout>
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
						age <= this.ages[1]
					);
				});
			}
		},
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
				this.users = users;
			}
		},
		mounted() {
			this.searchUsers();
		}
	};
</script>