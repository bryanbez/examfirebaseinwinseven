import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import LoginForm from "../components/partials/forms/loginform";
import RegisterForm from "../components/partials/forms/registerform";
import Homepage from "../components/pages/homepage";
import CreateExam from "../components/pages/teachers/createExam";
import ViewExam from "../components/pages/teachers/viewexamdetails";
import ViewExamInfo from "../components/partials/forms/viewExamNoInputs";
import EditExam from "../components/pages/teachers/editExamContent";
import ManageExam from "../components/pages/teachers/manageExams";
import ProfilePage from "../components/pages/profile";
import EditProfilePage from "../components/partials/forms/profileForm";
import PageNotFound from "../components/pages/PageNotFound";
import ExamsStudent from "../components/pages/students/exam";
import ManageExamRequests from "../components/pages/teachers/managerequestedexam";
import TakeExam from "../components/partials/forms/studentExamForm";
import CheckingPage from "../components/pages/teachers/checkExam";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "Homepage",
			component: Homepage,
			beforeEnter: (to, from, next) => {
				if (
					store.state.authModule.user_key === null ||
					store.state.authModule.user_key === ""
				)
					next({ name: "LoginForm" });
				else next();
			}
		},
		{
			path: "/login",
			name: "LoginForm",
			component: LoginForm,
			beforeEnter: (to, from, next) => {
				if (
					store.state.authModule.user_key != null ||
					store.state.authModule.user_key === ""
				)
					next({ name: "Homepage" });
				else next();
			}
		},
		{
			path: "/register",
			name: "RegisterForm",
			component: RegisterForm,
			beforeEnter: (to, from, next) => {
				if (
					store.state.authModule.user_key != null ||
					store.state.authModule.user_key === ""
				)
					next({ name: "Homepage" });
				else next();
			}
		},
		{
			path: "/viewexaminfo/:docid",
			name: "ViewExamInfo",
			component: ViewExamInfo
		},

		// teachers
		{
			path: "/profile",
			name: "ProfilePage",
			component: ProfilePage
		},
		{
			path: "/editprofile",
			name: "EditProfilePage",
			component: EditProfilePage
		},
		{
			path: "/manageexams",
			name: "ManageExam",
			component: ManageExam
		},
		{
			path: "/createexam",
			name: "CreateExam",
			component: CreateExam
		},
		{
			path: "/viewexams",
			name: "ViewExam",
			component: ViewExam
		},
		{
			path: "/editexam/:docid",
			name: "EditExamInfo",
			component: EditExam
		},
		{
			path: "/managerequestexam",
			name: "ManageExamRequests",
			component: ManageExamRequests
		},
		{
			path: "/managerequestexam/:request_id/:examcode/check",
			name: "CheckingPage",
			component: CheckingPage
		},
		// students
		{
			path: "/exams",
			name: "ExamsStudent",
			component: ExamsStudent
		},
		{
			path: "/exams/:examcode/take",
			name: "TakeExam",
			component: TakeExam
		},
		// 404 page
		{
			path: "/:pathMatch(.*)*",
			component: PageNotFound
		}
	]
});

export default router;
