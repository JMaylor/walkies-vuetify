<template>
	<v-card class="mx-auto">
		<v-card-title>
			<v-icon :color="user.gender == 'Male' ? 'blue' : 'pink'">{{
				user.gender == "Male" ? "mdi-gender-male" : "mdi-gender-female"
			}}</v-icon>
			{{ user.first_name }}
		</v-card-title>

		<v-card-subtitle> {{ displayAge(user) }} old </v-card-subtitle>

		<v-card-actions>
			<v-btn text
				><v-icon :color="user.dogs.length > 0 ? 'primary' : 'grey'"
					>mdi-dog</v-icon
				>
				{{ user.dogs.length }}</v-btn
			>

			<v-btn color="purple" text @click="$emit('open')">
				Meetup
			</v-btn>
		</v-card-actions>

	</v-card>
</template>
<script>
	const moment = require("moment");
	export default {
		props: ["user"],
		data() {
			return {
				dogHeaders: [
					{ text: "Name", value: "name" },
					{ text: "Breed", value: "breed" },
					{ text: "Age", value: "date_of_birth" }
				]
			};
		},
		methods: {
			popupClicked() {
				console.log("clicked");
				alert("clicked");
			},
			displayAge(dog) {
				return moment().diff(dog.date_of_birth.$date, "years") < 1
					? `${moment().diff(dog.date_of_birth.$date, "months")} months`
					: `${moment().diff(dog.date_of_birth.$date, "years")} years`;
			}
		},
		computed: {
			hasEventPending() {
				return (
					this.$store.state.userProfile.events.filter(
						x =>
							x.invited._id.$oid == this.user._id.$oid ||
							x.proposer._id.$oid == this.user._id.$oid
					).length > 0
				);
			}
		}
	};
</script>