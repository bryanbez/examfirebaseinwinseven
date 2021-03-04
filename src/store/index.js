import { createStore } from "vuex";
import ExamModule from "./modules/exam";
import AuthModule from "./modules/auth";
import ProfileModule from "./modules/profile";
import createPersistedState from "vuex-persistedstate";

export default createStore({
	modules: {
		examModule: ExamModule,
		authModule: AuthModule,
		profileModule: ProfileModule
	},
	plugins: [createPersistedState()] // for local/ session storage of web browser
});
