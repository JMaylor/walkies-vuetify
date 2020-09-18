<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col align="center">
				<h2 class="display-1">Manage your pack</h2>
			</v-col>
		</v-row>

		<v-row v-if="$store.state.userProfile">
			<v-expansion-panels>
				<v-dialog v-model="dialog" max-width="600px">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							color="info"
							v-bind="attrs"
							v-on="on"
							dark
							absolute
							top
							left
							fab
						>
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</template>
					<v-card>
						<v-card-title>
							<span class="headline">Add a dog!</span>
						</v-card-title>
						<v-card-text>
							<v-container>
								<v-form v-model="valid">
									<v-text-field
										label="Name"
										prepend-icon="mdi-dog"
										:rules="existsRules"
										v-model="dog.name"
										required
									></v-text-field>
									<v-select
										:rules="existsRules"
										v-model="dog.breed"
										:items="breedOptions"
										prepend-icon="mdi-dog-side"
										label="Breed"
										required
									></v-select>
									<v-menu
										ref="menu"
										v-model="menu"
										:close-on-content-click="false"
										:return-value.sync="dog.date_of_birth"
										transition="scale-transition"
										offset-y
										min-width="290px"
									>
										<template
											v-slot:activator="{ on, attrs }"
										>
											<v-text-field
												v-model="dog.date_of_birth"
												chips
												:rules="existsRules"
												small-chips
												label="Month of Birth"
												prepend-icon="mdi-calendar"
												readonly
												required
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-date-picker
											type="month"
											landscape
											v-model="dog.date_of_birth"
											:max="maxDate"
											no-title
											reactive
											required
											scrollable
											color="secondary"
										>
											<v-spacer></v-spacer>
											<v-btn
												text
												color="primary"
												@click="menu = false"
												>Cancel</v-btn
											>
											<v-btn
												text
												color="primary"
												@click="
													$refs.menu.save(
														dog.date_of_birth
													)
												"
												>OK</v-btn
											>
										</v-date-picker>
									</v-menu>
								</v-form>
							</v-container>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								color="warning"
								@click="
									dialog = false;
									editing = false;
								"
								>Close</v-btn
							>
							<v-btn
								v-if="editing"
								:disabled="!valid"
								color="success"
								@click="editDog"
								>Save</v-btn
							>
							<v-btn
								v-else
								:disabled="!valid"
								color="success"
								@click="addDog"
								>Save</v-btn
							>
						</v-card-actions>
					</v-card>
				</v-dialog>

				<Dog
					v-for="dog in $store.state.userProfile.dogs"
					:key="dog._id.$oid"
					:dog="dog"
					v-on:edit="startEdit(dog)"
				/>
			</v-expansion-panels>
		</v-row>
	</v-container>
</template>

<script>
	import Dog from "@/components/Dog";
	import moment from "moment";

	export default {
		components: {
			Dog
		},
		data: () => ({
			dialog: false,
			dog: {
				id: "",
				name: "",
				breed: "",
				date_of_birth: ""
			},
			editing: false,
			breedOptions: [
				"Border Collie",
				"Cocker Spaniel",
				"Dachshund",
				"German Shepherd",
				"Labrador",
				"Other"
			],
			existsRules: [v => !!v || "Required"],
			menu: false,
			maxDate: new Date().toISOString().substr(0, 10),
			valid: false
		}),
		methods: {
			addDog() {
				this.dialog = false;
				this.$store.dispatch("addDog", this.dog);
				this.dog = {
					name: "",
					breed: "",
					date_of_birth: ""
				};
			},
			startEdit(dog) {
				console.log("editting dog");
				console.log(dog);
				this.editing = true;
				this.dialog = true;
				this.dog = {
					id: dog._id.$oid,
					name: dog.name,
					breed: dog.breed,
					date_of_birth: moment(dog.date_of_birth.$date).format(
						"YYYY-MM-DD"
					)
				};
			},
			editDog() {
				console.log("editting your existing doggo");
				this.dialog = false;
				this.editing = false;
				this.$store.dispatch("editDog", this.dog);
				this.dog = {
					name: "",
					breed: "",
					date_of_birth: ""
				};
			}
		},
	};
</script>