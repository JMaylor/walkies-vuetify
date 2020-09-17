<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="8" md="4">
				<h2 class="display-1">Login</h2>
				<v-form ref="form" v-model="valid" @submit.prevent="submit">
					<v-row>
						<!-- Email -->
						<v-col cols="12">
							<v-text-field
								v-model="user.email"
								:rules="emailRules"
								label="E-mail"
								prepend-icon="mdi-email"
								required
							></v-text-field>
						</v-col>

						<!-- Password -->
						<v-col cols="12">
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
					</v-row>

					<v-row>
						<v-btn :disabled="!valid" color="success" class="mx-4" @click="submit">Login</v-btn>
					</v-row>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	const axios = require("axios");

	export default {
		data: () => ({
			valid: false,
			user: {
				email: "",
				password: ""
			},
			emailRules: [
				v => !!v || "Required",
				v => /.+@.+\..+/.test(v) || "Not a valid e-mail"
			],
			passwordRules: [v => !!v || "Required"],
			showPassword: false
		}),

		methods: {
			submit() {
				console.log("submit");
				axios
					.post(`${this.$store.state.baseURL}auth/login`, this.user)
					.then(response => {
						this.$store.dispatch("storeToken", response.data.token);
					})
					.catch(error => {
						console.log(error);
					});
			},
			reset() {
				this.$refs.form.reset();
			}
		},
		mounted() {}
	};
</script>