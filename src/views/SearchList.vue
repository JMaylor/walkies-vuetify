<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col align="center">
				<h2 class="display-1">Search for Walkies!</h2>
			</v-col>
		</v-row>

		<v-row v-if="users.length > 0" justify="center">
			<v-col cols="12" md="8"><v-expansion-panels popout>
			
			<User v-for="user in users" :key="user._id.$oid" :user="user" />
			</v-expansion-panels></v-col>
		</v-row>
	</v-container>
</template>

<script>
	const axios = require("axios");
	import User from "@/components/User"

	export default {
		components: {
			User
		},
		data: () => ({
			distance: 10,
			map: "",
			users: []
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
				this.users = users
			}
		},
		mounted() {
			this.searchUsers();
		}
	};
</script>