<template>
	<v-navigation-drawer v-model="$store.state.drawer" app>
		<v-layout align-left justify-space-between column fill-height
			><v-list nav dense>
				<div v-for="(link, i) in links" :key="i">
					<v-list-item
						v-if="!link.subLinks && isShown(link)"
						:to="link.to"
						class="v-list-item"
					>
						<v-list-item-icon>
							<v-icon color="accent">{{ link.icon }}</v-icon>
						</v-list-item-icon>

						<v-list-item-title v-text="link.text" />
					</v-list-item>

					<v-list-group
						v-else-if="isShown(link)"
						:key="link.text"
						no-action
						:prepend-icon="link.icon"
						:value="true"
					>
						<template v-slot:prepend-icon>
							<v-icon color="accent">{{ link.icon }}</v-icon>
						</template>
						<template v-slot:activator>
							<v-list-item-title>{{
								link.text
							}}</v-list-item-title>
						</template>

						<v-list-item
							v-for="sublink in link.subLinks"
							:to="sublink.to"
							:key="sublink.text"
						>
							<v-list-item-icon>
								<v-icon color="accent">{{ sublink.icon }}</v-icon>
							</v-list-item-icon>
							<v-list-item-title>{{
								sublink.text
							}}</v-list-item-title>
						</v-list-item>
					</v-list-group>
				</div>
			</v-list>
			<v-list dense v-if="$store.state.token">
				<v-list-item class="v-list-item" @click="$store.dispatch('logout')">
					<v-list-item-icon>
						<v-icon color="accent">mdi-logout</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Logout</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-layout>
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
						text: "Home",
						show: true
					},
					{
						icon: "mdi-account",
						text: "Profile",
						show: 'in',
						subLinks: [
							{
								to: "/profile/dogs",
								icon: "mdi-dog-side",
								text: "Your Dogs"
							},
							{
								to: "/profile/events",
								icon: "mdi-calendar",
								text: "Your Events"
							},
							{
								to: "/account",
								icon: "mdi-account-details",
								text: "Account Details"
							}
						]
					},
					{
						to: "/register",
						icon: "mdi-account-plus",
						text: "Register",
						show: 'out',
					},
					{
						to: "/login",
						icon: "mdi-login",
						text: "Login",
						show: 'out',
					},
					{
						icon: "mdi-magnify",
						text: "Search",
						show: 'in',
						subLinks: [
							{
								to: "/search/map",
								icon: "mdi-map-marker-multiple",
								text: "Map"
							},
							{
								to: "/search/list",
								icon: "mdi-table-search",
								text: "List"
							}
						]
					}
				],
				bottomLinks: []
			};
		},
		methods: {
			isShown (link) {
				if (link.show == true) {
					return true;
				} else if ((link.show == 'in' && this.$store.state.token) || (link.show == 'out' && !this.$store.state.token)) {
					return true
				}
				return false;
			}
		}
	};
</script>
