<template>
	<v-container fluid>
		<v-row align="center" justify="center">
			<v-col align="center">
				<h2 class="display-1">Manage your pack</h2>
			</v-col>
		</v-row>

		<v-row v-if="$store.state.userProfile">
			<v-expansion-panels popout>
				<v-btn v-show="!hidden" color="info" dark absolute top left fab>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
				<Dog v-for="dog in $store.state.userProfile.dogs" :key="dog._id.$oid" :dog="dog" />
			</v-expansion-panels>
		</v-row>
	</v-container>
</template>

<script>
	import Dog from "@/components/Dog";
	export default {
		components: {
			Dog
		},
		data: () => ({}),
		beforeMount() {
			this.$store.dispatch("getUserProfile");
		}
	};
</script>