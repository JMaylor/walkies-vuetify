<template>
	<v-expansion-panel hide-actions>
		<v-expansion-panel-header>
			<v-row align="center" justify="center" no-gutters>
				<v-col>
					<v-avatar size="72" class="mr-3">
						<img alt="Avatar" src="https://placedog.net/300?random" />
					</v-avatar>
					<strong v-html="dog.name"></strong>
				</v-col>

				<v-col>{{ dog.breed }}</v-col>
			</v-row>
		</v-expansion-panel-header>

		<v-expansion-panel-content class="py-0 my-0">
			<v-divider></v-divider>
			<v-row class="d-flex justify-space-around">
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
			</v-row>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	const axios = require("axios");

	export default {
		props: ["dog"],
		data() {
			return {
				dialog: false
			};
		},
		methods: {
			removeDog() {
				this.dialog = false;
				axios.delete(
					`${this.$store.state.baseURL}dogs/${this.dog._id.$oid}`,
					{
						headers: {
							Authorization: `Bearer ${this.$store.state.token}`
						}
					}
				);
			}
		}
	};
</script>