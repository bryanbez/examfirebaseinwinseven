<template>
	<div>
		<div class="container mt-5 mb-5">
			<div class="row">
				<div class="col col-sm-12 col-lg-11">
					<h3>Edit Profile</h3>
				</div>
				<div class="col col-sm-12 col-lg-1">
					<router-link class="btn btn-outline-danger" to="/profile">
						Back
					</router-link>
				</div>
			</div>

			<div class="row">
				<div class="col col-sm-12 col-lg-12">
					<div class="alert alert-info" v-show="updateMessage">
						<div class="row">
							<div class="col col-sm-12 col-lg-1">
								<div
									class="spinner-border text-secondary"
									role="status"
									v-show="updateMessage == 'Updating...'"
								>
									<span class="sr-only"></span>
								</div>
							</div>
							<div class="col col-sm-12 col-lg-11">
								{{ updateMessage }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col col-sm-12 col-md-4 mb-3">
					<label for=""> Profile Pic </label>
					<input
						type="file"
						class="form-control mb-4"
						@change="uploadImage"
					/>
					<img :src="imageInfo.image" class="img-thumbnail" alt="" />
				</div>
				<div class="col col-sm-12 col-md-8 form-row">
					<form @submit.prevent="updateProfile()">
						<label for=""> First Name </label>
						<input
							type="text"
							class="form-control mb-2"
							v-model="profileInfo[0].userInfo.first_name"
						/>
						<label for=""> Last Name </label>
						<input
							type="text"
							class="form-control mb-2"
							v-model="profileInfo[0].userInfo.last_name"
						/>
						<label for=""> Middle Initial </label>
						<input
							type="text"
							class="form-control mb-2"
							v-model="profileInfo[0].userInfo.middle_initial"
						/>
						<label for=""> Birthday </label>
						<input
							type="date"
							class="form-control mb-2"
							v-model="profileInfo[0].userInfo.birthday"
						/>
						<label for=""> Email </label>
						<input
							type="text"
							class="form-control mb-2"
							v-model="profileInfo[0].userInfo.email"
						/>

						<input
							type="submit"
							value="Update Profile"
							class="btn btn-outline-primary"
						/>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onUnmounted, onMounted } from "vue";
// import { fbaseStorageService } from "@/firebase";
export default {
	setup() {
		const storeModule = useStore();

		const profileInfo = computed(
			() => storeModule.state.profileModule.profileInfo
		);

		const updateMessage = computed(
			() => storeModule.state.profileModule.updateMsg
		);

		const getUserEmail = computed(
			() => storeModule.state.authModule.user_email
		);

		const imageInfo = computed(
			() => storeModule.state.profileModule.imageDetails
		);

		function updateProfile() {
			storeModule.dispatch(
				"profileModule/updateProfileInfo",
				profileInfo.value
			);
		}

		function generateRandomNumandLetters() {
			var chars =
				"0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var string_length = 6;
			let randKey = "";
			for (var i = 0; i < string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randKey += chars.substring(rnum, rnum + 1);
			}
			return randKey;
		} // to be moved in vuex

		function uploadImage(event) {
			var fileReader = new FileReader();
			let imageName = "profilepic" + generateRandomNumandLetters();
			fileReader.readAsDataURL(event.target.files[0]);
			fileReader.onload = event => {
				profileInfo.value[0].userInfo.profile_pic = imageName;
				let extractImageInfo = {
					name: imageName,
					image: event.target.result
				};
				storeModule.dispatch(
					"profileModule/putInfoInImageDetails",
					extractImageInfo
				);
			};
		}

		onMounted([
			storeModule.dispatch(
				"profileModule/getProfileInfo",
				getUserEmail.value
			)
		]);
		onUnmounted([
			storeModule.dispatch("profileModule/putInfoInImageDetails", ""),
			storeModule.dispatch("profileModule/clearUpdateMsg")
		]);

		return {
			profileInfo,
			updateProfile,
			uploadImage,
			updateMessage,
			imageInfo
		};
	}
};
</script>

<style></style>
