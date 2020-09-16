<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="8" md="6">
				<h2 class="display-1">Register</h2>
				<v-form
					ref="register-form"
					@focus="showError = false"
					v-model="valid"
					@submit.prevent="register()"
				>
					<v-row>
						<!-- First Name -->
						<v-col cols="12" md="6">
							<v-text-field
								v-model="user.first_name"
								:rules="nameRules"
								label="First Name"
								prepend-icon="mdi-account"
								required
							></v-text-field>
						</v-col>

						<!-- Last Name -->
						<v-col cols="12" md="6">
							<v-text-field
								v-model="user.last_name"
								:rules="nameRules"
								label="Last Name"
								prepend-icon="mdi-tree"
								required
							></v-text-field>
						</v-col>

						<!-- Email -->
						<v-col cols="12" md="6">
							<v-text-field
								v-model="user.email"
								:rules="emailRules"
								label="E-mail"
								prepend-icon="mdi-email"
								required
							></v-text-field>
						</v-col>

						<!-- Password -->
						<v-col cols="12" md="6">
							<v-text-field
								v-model="user.password"
								:rules="passwordRules"
								label="Password"
								prepend-icon="mdi-key"
								required
								:type="showPassword ? 'text' : 'password'"
								:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="showPassword = !showPassword"
							></v-text-field>
						</v-col>

						<!-- Date of Birth -->
						<v-col cols="12" md="6">
							<v-menu
								ref="menu"
								v-model="menu"
								:close-on-content-click="false"
								:return-value.sync="user.date_of_birth"
								transition="scale-transition"
								offset-y
								min-width="290px"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="user.date_of_birth"
										chips
										:rules="existsRules"
										small-chips
										label="Date of Birth"
										prepend-icon="mdi-calendar"
										readonly
										required
										v-bind="attrs"
										v-on="on"
									></v-text-field>
								</template>
								<v-date-picker
									landscape
									v-model="user.date_of_birth"
									:max="maxDate"
									no-title
									reactive
									required
									scrollable
									color="secondary"
								>
									<v-spacer></v-spacer>
									<v-btn text color="primary" @click="menu = false">Cancel</v-btn>
									<v-btn text color="primary" @click="$refs.menu.save(user.date_of_birth)">OK</v-btn>
								</v-date-picker>
							</v-menu>
						</v-col>

						<!-- Gender -->
						<v-col cols="12" md="6">
							<v-select
								:rules="existsRules"
								v-model="user.gender"
								prepend-icon="mdi-gender-male-female"
								:items="genders"
								label="Gender"
								required
							></v-select>
						</v-col>

						<!-- Location -->
						<v-col cols="12">
							<v-text-field
								v-model="user.location.coordinates"
								label="Location"
								required
								:rules="locationRules"
							>
								<v-icon slot="prepend" @click="requestLocation" color="info">mdi-crosshairs-gps</v-icon>
							</v-text-field>
						</v-col>
						<v-col cols="12">
							<v-card height="300" class="pa-1" rounded elevation="8">
								<v-card id="register-map" height="292" rounded elevation="4"></v-card>
								<v-btn v-show="!hidden" color="info" dark absolute top left fab @click="requestLocation">
									<v-icon>mdi-crosshairs-gps</v-icon>
								</v-btn>
							</v-card>
						</v-col>
					</v-row>
					<v-row v-if="showError">
						<v-alert type="error">This e-mail address is already in use.</v-alert>
					</v-row>

					<v-row>
						<v-btn :disabled="!valid" color="success" class="mx-4" @click="submit">Register</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="accent" class="mx-4" @click="reset">Reset Form</v-btn>
					</v-row>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	const axios = require("axios");
	const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

	// setting up 18 years ago for use in date picker restrictions.
	const maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() - 18);

	export default {
		data: () => ({
			valid: true,
			user: {
				first_name: "",
				last_name: "",
				gender: "",
				email: "",
				date_of_birth: "",
				password: "",
				location: {
					type: "Point",
					coordinates: []
				}
			},
			genders: ["Male", "Female"],
			nameRules: [
				v => !!v || "Required",
				v => (v && v.length <= 16) || "Cannot be longer than 16 characters"
			],
			emailRules: [
				v => !!v || "Required",
				v => /.+@.+\..+/.test(v) || "Not a valid e-mail"
			],
			locationRules: [
				v => !!v || "Required",
				v => (v && v.length == 2) || "Required"
			],
			passwordRules: [
				v => !!v || "Required",
				v =>
					/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
						v
					) ||
					"Minimum 8 characters, including letters, numbers and special characters."
			],
			existsRules: [v => !!v || "Required"],
			menu: false,
			maxDate: maxDate.toISOString().substr(0, 10),

			showPassword: false,
			showError: false,
			map: ""
		}),

		methods: {
			submit() {
				console.log("submit");
				axios
					.post(`${this.$store.state.baseURL}auth/signup`, this.user)
					.then(response => {
						this.$store.dispatch("storeToken", response.data.token);
					})
					.catch((this.showError = true));
			},
			reset() {
				this.$refs["register-form"].reset();
			},
			createMap() {
				// retreieve access token
				mapboxgl.accessToken = this.$store.state.mapboxKey;
				// create map
				this.map = new mapboxgl.Map({
					container: "register-map",
					style: "mapbox://styles/mapbox/outdoors-v11",
					// Center is London-ish area by default
					center: [-0.496934, 51.437032],
					// Zoom up close if user accepted giving coordinates
					zoom: 5
				});

				// Adds basic zoom and rotate control
				const nav = new mapboxgl.NavigationControl();
				this.map.addControl(nav, "top-right");

				// Add click listener
				this.addMapClickListener();
			},
			setLocationCoordinates(lngLat) {
				this.user.location.coordinates = [
					Math.round(lngLat.lng * 10000) / 10000,
					Math.round(lngLat.lat * 10000) / 10000
				];
			},
			addMapClickListener() {
				// When user clicks on the map, the location is stored in a data variable
				this.map.on("click", e => {
					this.setLocationCoordinates(e.lngLat);

					// Remove any old markers on the map that they previously set
					const oldMarker = document.querySelector(".mapboxgl-marker");
					if (oldMarker) {
						oldMarker.parentElement.removeChild(oldMarker);
					}

					// Add the new marker
					this.addMapMarker(e.lngLat);
				});
			},
			removeMapMarkers() {
				const oldMarker = document.querySelector(".mapboxgl-marker");
				if (oldMarker) {
					oldMarker.parentElement.removeChild(oldMarker);
				}
			},
			addMapMarker(lngLat) {
				// First remove any old markers
				this.removeMapMarkers();

				// Then add new one
				new mapboxgl.Marker({ color: "#43AA8B" })
					.setLngLat(lngLat)
					.addTo(this.map);
			},
			requestLocation() {
				// Request to get the user's current location
				window.navigator.geolocation.getCurrentPosition(position => {
					// get the latitude and longitude returned
					const lat = position.coords.latitude;
					const lng = position.coords.longitude;

					// set the location data
					this.setLocationCoordinates({
						lng,
						lat
					});

					// add marker on map for their location
					this.addMapMarker({
						lng: lng,
						lat: lat
					});

					// fly there on the map
					this.map.flyTo({
						center: [lng, lat],
						zoom: 12
					});
				}, null);
			}
		},
		mounted() {
			this.createMap();
		}
	};
</script>