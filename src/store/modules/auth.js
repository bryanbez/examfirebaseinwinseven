import {
	fbaseAuthentication,
	searchUsername,
	createUser,
	fetchUserType
} from "@/firebase";
import router from "../../routes/routes";

const state = {
	user_email: "",
	is_email_verified: false,
	user_key: "",
	errorMsg: "",
	user_type: "guest"
};

const getters = {};

const actions = {
	async loginUserAct({ commit, dispatch }, loginInfo) {
		fbaseAuthentication
			.signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
			.then(data => {
				commit("SET_USER_EMAIL", data.user.email);
				commit("SET_IS_EMAIL_VERIFIED", data.user.emailVerified);
				commit("SET_USER_KEY", data.user.uid);
				console.log(data.user.email);
				dispatch("getUserType", data.user.email);
				dispatch("profileModule/getProfileInfo", data.user.email);
				router.push("/");
			})
			.catch(err => {
				commit("SET_ERROR_MSG", err.message);
			});
	},
	async logoutUser({ commit }) {
		fbaseAuthentication
			.signOut()
			.then(data => {
				console.log(data);
				window.localStorage.removeItem("vuex");
				commit("SET_USER_EMAIL", null);
				commit("SET_IS_EMAIL_VERIFIED", null);
				commit("SET_USER_KEY", null);
				commit("SET_USER_TYPE", "guest");

				router.push("/login");
			})
			.catch(err => {
				commit("SET_ERROR_MSG", err.message);
			});
	},
	async registerUser({ commit, dispatch }, userInfo) {
		if ((await searchUsername(userInfo.username)) == false) {
			console.log("dup username");
			commit("SET_ERROR_MSG", "Username already exists");
			return;
		} else {
			await createUser({ ...userInfo });
			fbaseAuthentication
				.createUserWithEmailAndPassword(userInfo.email, userInfo.password)
				.then(data => {
					commit("SET_USER_EMAIL", data.user.email);
					commit("SET_IS_EMAIL_VERIFIED", data.user.emailVerified);
					commit("SET_USER_KEY", data.user.uid);
					dispatch("getUserType", data.user.email);
					router.push("/");
				})
				.catch(err => {
					commit("SET_ERROR_MSG", err.message);
				});
		}
	},
	async getUserType({ commit, state }) {
		const fetchUserTypeValue = await fetchUserType(state.user_email);
		if (fetchUserTypeValue == "") {
			commit("SET_USER_TYPE", "guest");
		} else {
			commit("SET_USER_TYPE", fetchUserTypeValue[0].userInfo);
		}
	},

	async clearErrorMessage({ commit }) {
		commit("SET_ERROR_MSG", "");
	}
};

const mutations = {
	SET_ERROR_MSG: (state, error) => (state.errorMsg = error),
	SET_USER_EMAIL: (state, email) => (state.user_email = email),
	SET_IS_EMAIL_VERIFIED: (state, isVerified) =>
		(state.is_email_verified = isVerified),
	SET_USER_KEY: (state, uid) => (state.user_key = uid),
	SET_USER_TYPE: (state, msg) => (state.user_type = msg)
};

export default {
	state,
	getters,
	actions,
	mutations
};
