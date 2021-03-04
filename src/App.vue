<template>
	<NavbarApp />
	<router-view> </router-view>
</template>

<script>
/* eslint-disable */
import NavbarApp from "./components/partials/navbar";
export default {
	name: "App",
	components: {
		NavbarApp
	}
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.css";
</style>
