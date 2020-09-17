<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col align="center">
				<h2 class="display-1">Events</h2>
			</v-col>
		</v-row>

		<v-row v-if="$store.state.userProfile" align="center" justify="center" no-gutters>
			<v-expansion-panels popout>
				<Event v-for="event in $store.state.userProfile.events" :key="event._id.$oid" :event="event" />
			</v-expansion-panels>
		</v-row>
	</v-container>
</template>

<script>
	import Event from "@/components/Event";
	// const axios = require("axios");

	export default {
		components: {
			Event
		},
		data: () => ({}),
		// computed: {
		// 	events() {
		// 		return this.$store.state.userProfile.events.sort(
		// 			(x, y) => x.time.$date - y.time.$date
		// 		);
		// 	}
		// },
		methods: {},
		beforeMount() {
			this.$store.dispatch("getUserProfile");
		}
	};
</script>