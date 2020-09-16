<template>
	<v-navigation-drawer v-model="$store.state.drawer" app>
		<v-list nav dense>
			<div v-for="(link, i) in links" :key="i">
				<v-list-item
					v-if="!link.subLinks"
					:to="link.to"
					class="v-list-item"
				>
					<v-list-item-icon>
						<v-icon>{{ link.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-title v-text="link.text" />
				</v-list-item>

				<v-list-group v-else :key="link.text" no-action :prepend-icon="link.icon" :value="true">
					<template v-slot:activator>
						<v-list-item-title>{{ link.text }}</v-list-item-title>
					</template>

					<v-list-item v-for="sublink in link.subLinks" :to="sublink.to" :key="sublink.text">
						<v-list-item-icon>
							<v-icon>{{ sublink.icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{ sublink.text }}</v-list-item-title>
					</v-list-item>
				</v-list-group>
			</div>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
	export default {
		data() {
			return {
				links: [
					{
						to: "/",
						icon: "mdi-home",
						text: "Home"
					},
					{
						icon: "mdi-account",
						text: "Profile",
						subLinks: [
							{
								to: "/profile/dogs",
								icon: 'mdi-dog-side',
								text: "Your Dogs",
							},
							{
								to: "/profile/events",
								icon: 'mdi-calendar',
								text: "Events",
							},
							{
								to: "/account",
								icon: 'mdi-account-details',
								text: "Account Details",
							}
						]
					},
					{
						to: "/register",
						icon: "mdi-account-plus",
						text: "Register"
					},
					{
						to: "/login",
						icon: "mdi-login",
						text: "Login"
					},
				]
			};
		}
	};
</script>
