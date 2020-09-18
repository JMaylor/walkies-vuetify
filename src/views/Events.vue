<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col align="center">
				<h2 class="display-1">Events</h2>
			</v-col>
		</v-row>
		<v-row align="center" justify="center">
			<v-col cols="4" md="3">
				<v-combobox
					v-model="statuses"
					:items="['Confirmed', 'Invited', 'Pending']"
					label="Statuses"
					multiple
				>
				</v-combobox>
			</v-col>
		</v-row>

		<v-row
			v-if="$store.state.userProfile"
			align="center"
			justify="center"
			no-gutters
		>
			<v-expansion-panels>
				<Event
					v-for="event in filteredEvents"
					:key="event._id.$oid"
					:event="event"
				/>
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
		data: () => ({
			statuses: ["Confirmed", "Invited"]
		}),
		computed: {
			filteredEvents() {
				const events = this.$store.state.userProfile.events;
				let confirmedEvents = [];
				let invitedEvents = [];
				let pendingEvents = [];
				if (this.statuses.includes("Confirmed")) {
					confirmedEvents = events.filter(
						event => event.status == "accepted"
					);
				}
				if (this.statuses.includes("Invited")) {
					invitedEvents = events.filter(
						event =>
							event.status == "pending" &&
							event.invited._id.$oid ==
								this.$store.state.userProfile._id.$oid
					);
				}
				if (this.statuses.includes("Pending")) {
					pendingEvents = events.filter(
						event =>
							event.status == "pending" &&
							event.proposer._id.$oid ==
								this.$store.state.userProfile._id.$oid
					);
				}
				return confirmedEvents
					.concat(invitedEvents, pendingEvents)
					.sort((x, y) => x.time.$date - y.time.$date);
			}
		},
		methods: {},
		beforeMount() {
			this.$store.dispatch("getUserProfile");
		}
	};
</script>