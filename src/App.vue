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
		})
	};
</script>
