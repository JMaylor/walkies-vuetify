<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col align="center">
				<h2 class="display-1">Events</h2>
			</v-col>
		</v-row>
		<v-row align="center" justify="center" v-if="$store.state.userProfile.events.length > 0">
			<v-col cols="12" md="6" xl="4">
				<v-combobox
					v-model="statuses"
					:items="['Confirmed', 'Invited', 'Pending']"
					label="Statuses"
					multiple
				>
					<template v-slot:selection="data">
						<v-chip outlined>
							<v-icon
								:color="
									data.item == 'Confirmed'
										? 'success'
										: data.item == 'Pending'
										? 'accent'
										: 'warning'
								"
								>{{
									data.item == "Confirmed"
										? "mdi-calendar-check-outline"
										: "mdi-calendar-question"
								}}</v-icon
							>
							{{ data.item }}
						</v-chip>
					</template>
				</v-combobox>
			</v-col>
		</v-row>

		<v-row
			v-if="$store.state.userProfile"
			align="center"
			justify="center"
			no-gutters
		>
			<v-expansion-panels
				v-model="openedPanel"
				v-if="$store.state.userProfile.events.length > 0"
			>
				<Event
					v-for="event in filteredEvents"
					:key="event._id.$oid"
					:event="event"
					v-on:close="openedPanel = null"
				/>
			</v-expansion-panels>
			<v-col cols="12" md="6" xl="4" v-else class="text-center"
				>You don't have any events upcoming. Why not invite someone for
				a walk?<br /><v-chip
					class="ma-2"
					color="secondary"
					text-color="white"
					to="/search/list"
				>
					<v-avatar left>
						<v-icon>mdi-paw</v-icon>
					</v-avatar>
					List Search</v-chip
				><br /><v-chip
					class="ma-2"
					color="secondary"
					text-color="white"
					to="/search/map"
				>
					<v-avatar left>
						<v-icon>mdi-map</v-icon>
					</v-avatar>
					Map Search</v-chip
				></v-col
			>
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
			statuses: ["Confirmed", "Invited", "Pending"],
			openedPanel: null
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
		methods: {
			closePanels() {
				console.log("closing panels");
				this.op;
			}
		}
	};
</script>