<template>
	<v-app-bar app color="primary" dark>
		<v-app-bar-nav-icon @click.stop="$store.commit('toggleDrawer')"></v-app-bar-nav-icon>
		<v-toolbar-title>Walkies</v-toolbar-title>

		<v-spacer></v-spacer>

		<v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
			<span class="mr-2">Latest Release</span>
			<v-icon>mdi-open-in-new</v-icon>
		</v-btn>
	</v-app-bar>
</template>