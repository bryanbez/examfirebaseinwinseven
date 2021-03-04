<template>
	<div>
		<div class="container">
			<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
				<a class="navbar-brand m-2" href="#"> Online Exam System </a>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div
					class="collapse navbar-collapse"
					id="navbarNav"
					v-if="getUserUid === null"
				>
					<ul class="navbar-nav">
						<li class="nav-item active">
							<router-link to="/login" class="nav-link">
								Login
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/register" class="nav-link">
								Register
							</router-link>
						</li>
					</ul>
				</div>
				<div
					class="collapse navbar-collapse"
					id="navbarNav"
					v-if="getUserUid !== null"
				>
					<ul
						class="navbar-nav mr-auto"
						v-show="getUserTypeOfLoggedInUser == 'student'"
					>
						<li class="nav-item active">
							<router-link to="/" class="nav-link">
								Homepage
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/exams" class="nav-link">
								Exams
							</router-link>
						</li>
						<li class="nav-item dropdown">
							<a
								class="nav-link"
								id="navbarDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								More
							</a>
							<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
								<li>
									<router-link to="/profile" class="dropdown-item">
										Profile
									</router-link>
								</li>
								<li>
									<a class="dropdown-item" @click="logoutUser()">
										Logout ({{ getEmail }})
									</a>
								</li>
							</ul>
						</li>
					</ul>

					<ul
						class="navbar-nav mr-auto"
						v-show="getUserTypeOfLoggedInUser == 'teacher'"
					>
						<li class="nav-item active">
							<router-link to="/" class="nav-link">
								Homepage
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/manageexams" class="nav-link">
								Manage Exams
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/managerequestexam" class="nav-link">
								Manage Request Exam
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/" class="nav-link">
								Messages
							</router-link>
						</li>
						<li class="nav-item dropdown">
							<a
								class="nav-link"
								id="navbarDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								More
							</a>
							<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
								<li>
									<router-link to="/profile" class="dropdown-item">
										Profile
									</router-link>
								</li>
								<li>
									<a class="dropdown-item" @click="logoutUser()">
										Logout ({{ getEmail }})
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	</div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
export default {
	setup() {
		const storeModule = useStore();
		const getUserUid = computed(() => storeModule.state.authModule.user_key);
		const getEmail = computed(() => storeModule.state.authModule.user_email);

		const getUserTypeOfLoggedInUser = computed(
			() => storeModule.state.authModule.user_type
		);

		function logoutUser() {
			storeModule.dispatch("profileModule/clearAllInProfileAfterLogout");
			storeModule.dispatch("clearAllInExamAfterLogout");
			storeModule.dispatch("logoutUser");
		}

		onMounted([storeModule.dispatch("getUserType")]);

		return { getUserUid, getEmail, logoutUser, getUserTypeOfLoggedInUser };
	}
};
</script>

<style>
a {
	cursor: pointer;
}
</style>
