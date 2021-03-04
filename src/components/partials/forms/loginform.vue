<template>
	<div>
		<div class="container d-flex justify-content-center mt-5">
			<div class="card" style="width: 30em;">
				<div class="card-title m-3">
					<h3>Login Form</h3>
				</div>
				<div class="card-content m-3">
					<form @submit.prevent="loginUser()">
						<label for="">Email</label>
						<input
							type="email"
							class="form-control mb-3"
							v-model="loginCredentials.email"
						/>
						<span class="error"> </span>

						<label for="">Password</label>
						<input
							type="password"
							class="form-control mb-3"
							v-model="loginCredentials.password"
						/>
						<span class="error"> </span>

						<input
							type="submit"
							value="Login"
							class="form-control bg-primary mb-2 text-white"
						/>
						<router-link
							to="/register"
							class="form-control mb-2 btn btn-success"
						>
							Register
						</router-link>
					</form>

					<div class="alert alert-danger" v-show="loginErrorMsg">
						{{ loginErrorMsg }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, onUnmounted } from "vue";
/* eslint-disable */
import { useStore } from "vuex";
export default {
	setup() {
		// const router = useRouter();

		const storeModule = useStore();

		const loginErrorMsg = computed(
			() => storeModule.state.authModule.errorMsg
		);

		let loginCredentials = {
			email: "",
			password: ""
		};

		function loginUser() {
			return storeModule.dispatch("loginUserAct", loginCredentials);
		}

		onUnmounted([storeModule.dispatch("clearErrorMessage")]);

		return {
			loginCredentials,
			loginUser,
			loginErrorMsg
		};
	}
};
</script>

<style></style>
