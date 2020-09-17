<template>
	<v-btn @click="popupClicked">{{ info }}</v-btn>
</template>
<script>
	export default {
		props: ["info"],
		methods: {
			popupClicked() {
				alert("Learn more clicked");
			}
		}
	};
</script>