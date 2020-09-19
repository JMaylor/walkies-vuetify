<template>
	<v-container fluid class="py-0">
		<v-row class="text-center my-0">
			<v-col class="pa-0 notice">
				<v-dialog v-model="dialog" width="500">
					<template v-slot:activator="{ on, attrs }">
						<span v-bind="attrs" v-on="on"
							>Please see here for extra advice during the
							COVID-19 (Coronavirus) pandemic.</span
						>
					</template>
					<v-card>
						<v-card-title class="headline grey lighten-2">
							COVID Advice
						</v-card-title>

						<v-card-text>
							<p class="mt-2">
								Please make sure to follow
								<a
									href="https://www.gov.uk/coronavirus"
									target="_blank"
									>government advice</a
								>
								when using Walkies.
							</p>

							<p>
								Lorem ipsum dolor sit amet, consectetur
								adipiscing elit, sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation
								ullamco laboris nisi ut aliquip ex ea commodo
								consequat. Duis aute irure dolor in
								reprehenderit in voluptate velit esse cillum
								dolore eu fugiat nulla pariatur. Excepteur sint
								occaecat cupidatat non proident, sunt in culpa
								qui officia deserunt mollit anim id est laborum.
							</p>
						</v-card-text>

						<v-divider></v-divider>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="primary" text @click="dialog = false">
								OK
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row class="text-center hero" mt-0 justify="start">
			<v-col class="ma-4" cols="12" md="4">
				<h1 class="display-2 font-weight-bold mb-3 white--text">
					<span class="walkies-brand">Walkies</span><br />Puppy play,
					without the pay.
				</h1>
				<v-chip
					class="ma-2"
					color="secondary"
					text-color="white"
					to="/register"
				>
					<v-avatar left>
						<v-icon>mdi-paw</v-icon>
					</v-avatar>
					Get started today! </v-chip
				><br />
				<span class="white--text">Already have an account?</span>
				<v-chip
					class="ma-2"
					color="accent"
					text-color="white"
					to="/login"
				>
					<v-avatar left>
						<v-icon>mdi-login</v-icon>
					</v-avatar>
					Login! </v-chip
				><br />
			</v-col>
		</v-row>

		<v-row class="text-center" ma-0 pa-0 justify="start">
			<v-col cols="12" md="6">
				<v-card class="py-12 px-4" color="grey lighten-5" flat>
					<v-avatar color="primary darken-4" size="88">
						<v-icon large color="white">mdi-paw</v-icon>
					</v-avatar>

					<v-card-title
						class="justify-center font-weight-black text-uppercase"
						>Title</v-card-title
					>
					<v-card-text class="subtitle-1">text</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card class="py-12 px-4" color="grey lighten-5" flat>

					<v-card-text class="subtitle-1">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente quidem ducimus modi atque perspiciatis libero, dicta delectus! Totam praesentium esse labore nisi maiores accusamus assumenda corporis, libero cupiditate! Rerum, ducimus?</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		data: () => ({
			dialog: false,
		})
	};
</script>

<style scoped>
	.hero {
		background: url("https://images.unsplash.com/photo-1537123547273-e59f4f437f1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
	}

	.notice {
		background: #43aa8b46;
		text-decoration: underline;
	}
</style>