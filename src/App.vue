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
		beforeMount() {
			// check if there is a token in local storage
			if (this.$store.state.token) {
				// try to retreive profile
				this.$store.dispatch('getUserProfile')
			}
			// if there is save it to state

			// try to retreive profile
			// if that succeeds OK
			// if not, clear the token from local storage and remove it from the state

		}
	};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
#app {
	background-color: #277ca10e;
}

.walkies-brand {
	font-family: Pacifico, cursive;
}

</style>