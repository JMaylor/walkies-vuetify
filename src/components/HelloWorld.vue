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
		<v-row class="text-center hero py-16" mt-0 justify="start">
			<v-col cols="12" md="6">
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
					Login!
				</v-chip>
			</v-col>
		</v-row>

		<v-row class="text-center" ma-0 pa-0 justify="start">
			<v-col
				cols="12"
				md="4"
				v-for="(feature, i) in features"
				:key="i"
				class="d-flex flex-column"
			>
				<v-card
					class="elevation-5 flex d-flex flex-column"
					color="grey lighten-5"
				>
					<v-card-subtitle
						><v-avatar color="primary darken-4" size="88">
							<v-icon large dark color="white">{{
								feature.icon
							}}</v-icon>
						</v-avatar></v-card-subtitle
					>

					<v-card-title
						class="justify-center font-weight-black text-uppercase"
						>{{ feature.title }}</v-card-title
					>
					<v-card-text v-html="feature.text"></v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		data: () => ({
			dialog: false,
			features: [
				{
					icon: "mdi-new-box",
					title: "New Features",
					text:
						"This some <e>amazing</e>, eye-catching filler text! Your eyes are </b>totally drawn</b> to this section and you'll probably read it then click this <a href='#'>totally real link</a>"
				},
				{
					icon: "mdi-star",
					title: "Partner",
					text:
						"We have partnered with another completely real company, Munchywoofs. They sell all kinds of dog food, and have a product that is specifically suited to taking on walks because it doesn't upset your dog's stomach if they run around with a full belly of the stuff!</a>"
				},
				{
					icon: "mdi-newspaper",
					title: "The Newspaper",
					text:
						"Here is some fake filler content about this one time when Walkies was featured in a completely authentic newspaper."
				}
			]
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