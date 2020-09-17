<template>
	<v-row align="center" justify="center">
		<v-col cols="4" md="3">
			<v-subheader class="pl-0">Distance (miles)</v-subheader>
			<v-slider
				prepend-icon="mdi-map-marker-distance"
				v-model="distance"
				min="1"
				thumb-size="24"
				max="10"
				thumb-label="always"
			></v-slider>
		</v-col>
		<v-col cols="4" md="3">
			<v-combobox
				v-model="genders"
				:items="['Male', 'Female']"
				label="Genders"
				multiple
			>
			</v-combobox>
		</v-col>
		<v-col cols="4" md="3">
			<v-subheader class="pl-0">Ages</v-subheader>
			<v-range-slider dense min="18" max="99" thumb-label v-model="ages"></v-range-slider>
		</v-col>
	</v-row>
</template>

<script>
	export default {
		data() {
			return {
				genders: ["Male", "Female"],
				ages: [18, 99],
				distance: 10
			};
		}
	};
</script>