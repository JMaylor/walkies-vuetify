<template>
	<div class="home">
		<HelloWorld />
	</div>
</template>

<script>
	// @ is an alias to /src
	import HelloWorld from "@/components/HelloWorld.vue";

	export default {
		name: "Home",
		components: {
			HelloWorld
		},
		beforeCreate() {
			if (this.$store.state.token) {
				this.$router.push("/profile/events");
			}
		}
	};
</script>
