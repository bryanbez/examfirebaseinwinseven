<template>
	<div>
		<div class="container d-flex justify-content-center">
			<div class="card" style="width: 30em;">
				<div class="card-title m-3">
					<h3>Register Form</h3>
				</div>
				<div class="card-content m-3">
					<form @submit.prevent="registerUser">
						<label for="">Email</label>
						<input
							type="email"
							class="form-control mb-3"
							v-model="registerCredentials.email"
						/>
						<span class="error"> </span>
						<!-- <label for="">Birthday</label>
                <input type="date" class="form-control mb-3" v-model="registerCredentials.birthday">
                <span class="error"> </span> -->
						<label for="">Your Username</label>
						<input
							type="text"
							class="form-control mb-3"
							v-model="registerCredentials.username"
						/>
						<span class="error"> </span>
						<label for="">Your Password</label>
						<input
							type="password"
							class="form-control mb-3"
							v-model="registerCredentials.password"
						/>
						<span class="error"> </span>

						<input
							type="submit"
							value="Register"
							class="form-control bg-primary mb-2 text-white"
						/>
					</form>
					<div class="alert alert-danger" v-show="registerErrorMsg">
						{{ registerErrorMsg }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
import { useStore } from "vuex";
import { computed, onUnmounted } from "vue";
export default {
	setup() {
		const storeModule = useStore();

		const registerErrorMsg = computed(
			() => storeModule.state.authModule.errorMsg
		);

		let registerCredentials = {
			username: "",
			password: "",
			email: "",
			profile_pic: "",
			birthday: "",
			first_name: "",
			last_name: "",
			middle_initial: "",
			user_type: "student"
		};

		const registerUser = async () => {
			storeModule.dispatch("registerUser", registerCredentials);
		};

		onUnmounted([storeModule.dispatch("clearErrorMessage")]);

		return {
			registerCredentials,
			registerUser,
			registerErrorMsg
		};
	}
};
</script>

<style></style>
