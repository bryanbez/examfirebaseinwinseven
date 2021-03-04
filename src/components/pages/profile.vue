<template>
	<div>
		<div class="container mt-4">
			<div class="row">
				<div class="col col-sm-12 ">
					<h3>Profile</h3>
				</div>
			</div>
			<div class="row mt-5">
				<div class="col col-sm-12 col-lg-6">
					<div class="card" style="width: 25rem;">
						<img
							:src="imageInfo.image"
							class="card-img-top mt-2 img-thumbnail"
							alt=""
						/>
						<div class="card-body">
							<h5
								class="card-title"
								v-if="
									profileInfo[0].userInfo.last_name != '' &&
										profileInfo[0].userInfo.first_name != '' &&
										profileInfo[0].userInfo.middle_initial != ''
								"
							>
								{{ profileInfo[0].userInfo.last_name }},
								{{ profileInfo[0].userInfo.first_name }}
								{{ profileInfo[0].userInfo.middle_initial }}.
							</h5>
							<h5 class="card-title" v-else>
								Update your profile to display your name.
							</h5>
							<ul class="list-group list-group-flush">
								<li class="list-group-item">
									{{ profileInfo[0].userInfo.email }}
								</li>
								<li class="list-group-item">
									{{ profileInfo[0].userInfo.birthday }}
								</li>
								<li class="list-group-item">
									{{ profileInfo[0].userInfo.user_type }}
								</li>
							</ul>
							<div class="card-footer d-grid gap-2">
								<router-link
									class="btn btn-outline-secondary"
									to="/editprofile"
									>Edit Profile</router-link
								>
							</div>
						</div>
					</div>
				</div>
				<div class="col col-sm-12 col-lg-6">
					<h3>Recent Exams</h3>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
	setup() {
		const storeModule = useStore();

		const profileInfo = computed(
			() => storeModule.state.profileModule.profileInfo
		);

		// const getUserEmail = computed(
		// 	() => storeModule.state.authModule.user_email
		// );

		const imageInfo = computed(
			() => storeModule.state.profileModule.imageDetails
		);

		// onMounted([
		// 	storeModule.dispatch(
		// 		"profileModule/getProfileInfo",
		// 		getUserEmail.value
		// 	)
		// ]);

		return { profileInfo, imageInfo };
	}
};
</script>

<style></style>
