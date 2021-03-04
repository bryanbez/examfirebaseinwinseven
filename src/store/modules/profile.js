import {
	fetchProfileInfoOfUser,
	updateProfileInfoOfUser,
	fbaseStorageService
} from "@/firebase";
// import router from "../../routes/routes";

const state = {
	profileInfo: [],
	updateMsg: "",
	uploadImageMsg: "",
	imageDetails: []
};

const getters = {};

const actions = {
	async getProfileInfo({ commit, state }, user_email) {
		const profileInfo = await fetchProfileInfoOfUser(user_email);
		commit("SET_PROFILE_INFO", profileInfo);
		if (state.profileInfo[0].userInfo.profile_pic == "") {
			let onloadImageDetails = {
				image:
					"https://firebasestorage.googleapis.com/v0/b/examwebsite-ecaf0.appspot.com/o/images%2Fno-image-png-2.png?alt=media&token=e8ab5ecc-347a-4fd1-a185-a8c696616506",
				name: state.profileInfo[0].userInfo.profile_pic
			};
			commit("SET_IMAGE_DETAILS", onloadImageDetails);
		} else {
			await fbaseStorageService
				.child("images/" + state.profileInfo[0].userInfo.profile_pic)
				.getDownloadURL()
				.then(url => {
					let onloadImageDetails = {
						image: url,
						name: state.profileInfo[0].userInfo.profile_pic
					};
					commit("SET_IMAGE_DETAILS", onloadImageDetails);
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	async updateProfileInfo({ commit, dispatch }, profile_info) {
		await updateProfileInfoOfUser(profile_info);
		dispatch("uploadImageOnStorage");
		commit("SET_UPDATE_MSG", "Updating...");
		setTimeout(() => {
			commit("SET_UPDATE_MSG", "Profile Updated");
			setTimeout(() => {
				commit("SET_UPDATE_MSG", "");
			}, 3000);
		}, 5000);
	},

	clearUpdateMsg({ commit }) {
		commit("SET_UPDATE_MSG", "");
	},
	putInfoInImageDetails({ commit }, imageInfo) {
		commit("SET_IMAGE_DETAILS", imageInfo);
	},
	async uploadImageOnStorage({ state }) {
		await fbaseStorageService
			.child("images/" + state.imageDetails.name)
			.putString(state.imageDetails.image, "data_url");
		await fbaseStorageService
			.child("images/" + state.imageDetails.name)
			.getDownloadURL()
			.then(url => {
				state.imageDetails.image = url;
			});
		return true;
	},
	clearAllInProfileAfterLogout({ commit }) {
		commit("SET_PROFILE_INFO", "");
		commit("SET_UPDATE_MSG", "");
		commit("SET_UPLOAD_MSG", "");
		commit("SET_IMAGE_DETAILS", "");
	}
};

const mutations = {
	SET_PROFILE_INFO: (state, profile) => (state.profileInfo = profile),
	SET_UPDATE_MSG: (state, message) => (state.updateMsg = message),
	SET_UPLOAD_MSG: (state, message) => (state.uploadImageMsg = message),
	SET_IMAGE_DETAILS: (state, response) => (state.imageDetails = response)
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
