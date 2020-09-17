<template>
	<v-app>
		<Drawer />
		<Bar />

		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>
	import Bar from "./components/Base/Bar";
	import Drawer from "./components/Base/Drawer";

	export default {
		name: "App",

		components: {
			Bar,
			Drawer
		},

		data: () => ({
			//
		}),
		mounted() {
			// check if there is a token in local storage
			if (this.$store.state.token) {
				this.$store.dispatch('getUserProfile')
			}
			// if there is save it to state
			// try to retreive profile
			// if that succeeds OK
			// if not, clear the token from local storage and remove it from the state

		}
	};
</script>
