<template>
	<div>
		<div class="container">
			<h3>Homepage</h3>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
// import { useStore } from "vuex";
// import { computed, onMounted } from "vue";
import registerform from "../partials/forms/registerform";
export default {
	components: {
		registerform
	},
	setup() {
		// const storeModule = useStore();
		// const getLoginInfo = computed(
		// 	() => storeModule.state.authModule.user_key
		// );
		// onMounted([console.log(getLoginInfo)]);
	}
};
</script>

<style></style>
