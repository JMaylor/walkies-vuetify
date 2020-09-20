<template>
	<v-container fluid>
		<v-row>
			{{ user.dogs.length }} dogs
		</v-row>
		<v-btn @click="$emit('open')" color="accent">{{ user.first_name }}</v-btn>
	</v-container>
</template>
<script>
	export default {
		props: ["user"],
		methods: {
			popupClicked() {
				console.log('clicked')
				alert("clicked");
			}
		}
	};
</script>