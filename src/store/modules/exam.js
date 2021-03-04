import {
	loadExams,
	fetchSingleExam,
	updateExam,
	deleteExam,
	loadExamsByTeacher,
	searchExamCode,
	requestExamToTeacher,
	getStatusOfRequestExam,
	fetchRequestedExamFb,
	removeExamRequestFb,
	loadStudentsByExamCodeOfTeacher,
	acceptExamRequestFb,
	loadExamsInStudent,
	saveExamTaken,
	fetchSingleExamByExamId,
	fetchStudentExamTakenById,
	saveExamResultFb,
	fetchExamResultByRequestId
} from "@/firebase";
import router from "../../routes/routes";

const getDefaultState = () => {
	return {
		questionRows: [{}],
		examList: [],
		examListStudent: [],
		singleExam: [],
		queryMessage: "",
		searchResult: [],
		requestExamMsg: "",
		requestStatus: "",
		listOfRequestedExam: [],
		studentsEnrollPerExamCode: [],
		singleExamToCompareStudentSide: [],
		listTotalScoreOfStudent: [],
		listSingleExamResult: []
	};
};

const state = getDefaultState();

const getters = {};

const actions = {
	addQuestion({ commit }, arrayQuestionInfo) {
		commit("ADD_QUESTION_INFO", arrayQuestionInfo);
	},
	removeQuestionNumber({ state }, questionNumber) {
		for (var i = 0; i < state.questionRows.length; i++) {
			if (state.questionRows[i].uniqueId == questionNumber) {
				state.questionRows.splice(i, 1);
			}
		}
	},
	async fetchAllExams({ commit }) {
		let fetchListFromDb = await loadExams();
		commit("PUSH_EXAM_LIST_ARR", fetchListFromDb);
	},
	async fetchAllExamsInTeacher({ commit }, queryArr) {
		let fetchExamListByTeacherEmail = await loadExamsByTeacher(queryArr);
		commit("PUSH_EXAM_LIST_ARR", fetchExamListByTeacherEmail.value);
	},
	async fetchAllExamsInStudent({ commit }, queryArr) {
		// current
		let fetchExamListByTeacherEmail = await loadExamsInStudent(queryArr);
		let fetchRequestedExam = await fetchRequestedExamFb(queryArr);
		let arrExamInfoAndRequestInfo = {
			exam_info: fetchExamListByTeacherEmail.value,
			request_info: fetchRequestedExam
		};

		commit("PUSH_EXAM_LIST_ARR_IN_STUDENT", arrExamInfoAndRequestInfo);
	},
	async fetchAllExamsByExamCode({ commit }, queryArr) {
		let fetchExamListByCode = await loadStudentsByExamCodeOfTeacher(queryArr);
		commit("PUSH_EXAM_LIST_BY_EXAMCODE_ARR", fetchExamListByCode);
	},
	async getSingleExamInfo({ commit }, docId) {
		let singleExamInfo = await fetchSingleExam(docId);
		commit("PUSH_SINGLE_EXAM_INFO", singleExamInfo);
	},
	async updateExam({ commit }, updatedExamAndDocid) {
		let updateExamInfo = await updateExam(updatedExamAndDocid);
		commit("EXAM_MESSAGE", updateExamInfo);
	},
	async removeExam({ commit }, docid) {
		let deleteExamInfo = await deleteExam(docid);
		commit("EXAM_MESSAGE", deleteExamInfo);
	},
	async searchExamCodeAction({ commit }, examCode) {
		let fetchResultOfSearchedCode = await searchExamCode(examCode);

		commit("PUT_SEARCH_RESULT", fetchResultOfSearchedCode);
	},
	async requestToTakeExam({ commit, dispatch }, exam_info) {
		let requestExam = await requestExamToTeacher(exam_info);
		dispatch("fetchAllRequestedExamByStudentId", exam_info.student_id);
		commit("REQUEST_MESSAGE", requestExam);
		setTimeout(() => {
			dispatch("getStatusOfRequestExam", exam_info);
			commit("REQUEST_MESSAGE", "");
		}, 3000);
	},
	async getStatusOfRequestExam({ commit }, requestInfo) {
		let getRequestInfo = await getStatusOfRequestExam(requestInfo);
		commit("STATUS_OF_REQUEST", getRequestInfo);
	},
	async fetchAllRequestedExamByStudentId({ commit }, student_id) {
		let listOfExamsRequested = [];
		let studentIdQuery = {
			field: "student_id",
			value: student_id
		};
		let fetchAllRequestedExam = await fetchRequestedExamFb(studentIdQuery);
		if (fetchAllRequestedExam == "") {
			commit("PUT_ALL_REQUESTED_EXAM_BY_STUDENT_ID", "");
		} else {
			fetchAllRequestedExam.forEach(value => {
				searchExamCode(value.examCode).then(result => {
					listOfExamsRequested.push({
						requestID: value.requestID,
						examCode: value.examCode,
						examTitle: result[0].examTitle,
						dateRequested: value.dateRequested,
						status: value.status_of_request
					});
				});
			});
		}

		setTimeout(() => {
			commit("PUT_ALL_REQUESTED_EXAM_BY_STUDENT_ID", listOfExamsRequested);
		}, 3000);
	},
	async cancelExamRequestAction({ commit, dispatch }, request_info) {
		console.log(request_info.student_id);
		await removeExamRequestFb(request_info.requestExamCode).then(() => {
			commit("EXAM_MESSAGE", "Request Exam Cancelled");
			dispatch("fetchAllRequestedExamByStudentId", request_info.student_id);
			setTimeout(() => {
				commit("EXAM_MESSAGE", "");
			}, 3000);
		});
	},
	async acceptRequestToTakeExam({ commit }, requestId) {
		let acceptExam = await acceptExamRequestFb(requestId);
		commit("EXAM_MESSAGE", acceptExam);
		setTimeout(() => {
			commit("EXAM_MESSAGE", "");
		}, 3000);
	},
	async submitExamToTeacher({ commit }, examContent) {
		let submitExamMessage = await saveExamTaken(examContent);
		commit("EXAM_MESSAGE", submitExamMessage);
		setTimeout(() => {
			commit("EXAM_MESSAGE", "");
			router.push("/exams");
		}, 3000);
	},
	async fetchSingleExamByCode({ commit }, examcode) {
		//commit("SINGLE_EXAM_INFO_TO_COMPARE_STUDENT_SIDE", "");
		let fetchSingleExamId = await fetchSingleExamByExamId(examcode);
		let fetchExamTakenInfoById = await fetchStudentExamTakenById(
			fetchSingleExamId
		);
		commit(
			"SINGLE_EXAM_INFO_TO_COMPARE_STUDENT_SIDE",
			fetchExamTakenInfoById
		);
	},
	async getTotalScores({ commit }, examInfo) {
		let resultInfo = {
			total_items: 0,
			right_answers: 0,
			wrong_answers: 0
		};
		examInfo[0].examContent.forEach(element => {
			if (element.questionResult != "") {
				resultInfo.total_items++;
			}
			if (element.questionResult == "right") {
				resultInfo.right_answers++;
			}
			if (element.questionResult == "wrong") {
				resultInfo.wrong_answers++;
			}
		});
		commit("SET_SCORES_INFO", resultInfo);
	},
	async saveExamResult({ commit }, examResultInfo) {
		const examResult = await saveExamResultFb(examResultInfo);
		commit("EXAM_MESSAGE", examResult);
		setTimeout(() => {
			commit("EXAM_MESSAGE", "");
		}, 3000);
	},
	async fetchExamResultByReqId({ commit }, nameAndReqId) {
		let fetchResult = await fetchExamResultByRequestId(nameAndReqId);
		console.log(fetchResult);
		commit("PUT_SINGLE_RESULT_INFO", fetchResult);
	},
	emptyListExams({ commit }) {
		commit("PUT_ALL_REQUESTED_EXAM_BY_STUDENT_ID", []);
	},
	clearSingleExamArr({ commit }) {
		commit("PUSH_SINGLE_EXAM_INFO", "");
	},
	clearQueryMessage({ commit }) {
		commit("EXAM_MESSAGE", "");
	},
	emptyQuestionList({ commit }) {
		commit("REMOVE_ALL_QUESTIONS", "");
	},
	// clearAllInExamAfterLogout({ commit }) {
	// 	commit("ADD_QUESTION_INFO", "");
	// 	commit("PUSH_EXAM_LIST_ARR", "");
	// 	commit("PUSH_SINGLE_EXAM_INFO", "");
	// 	commit("EXAM_MESSAGE", "");
	// 	commit("REMOVE_ALL_QUESTIONS", "");
	// 	commit("PUT_SEARCH_RESULT", "");
	// 	commit("REQUEST_MESSAGE", "");
	// 	commit("STATUS_OF_REQUEST", "");
	// 	commit("PUT_ALL_REQUESTED_EXAM_BY_STUDENT_ID", "");
	// 	commit("PUSH_EXAM_LIST_BY_EXAMCODE_ARR", "");
	// }
	clearAllInExamAfterLogout({ commit }) {
		commit("RESET_STATE");
	}
};

const mutations = {
	ADD_QUESTION_INFO: (state, question) => state.questionRows.push(question),
	PUSH_EXAM_LIST_ARR: (state, examListArr) => (state.examList = examListArr),
	PUSH_EXAM_LIST_ARR_IN_STUDENT: (state, examList) =>
		(state.examListStudent = examList),
	PUSH_SINGLE_EXAM_INFO: (state, response) => [
		(state.singleExam = []),
		state.singleExam.push(response)
	],
	EXAM_MESSAGE: (state, response) => (state.queryMessage = response),
	REMOVE_ALL_QUESTIONS: state => (state.questionRows = [{}]),
	PUT_SEARCH_RESULT: (state, response) => (state.searchResult = response),
	REQUEST_MESSAGE: (state, response) => (state.requestExamMsg = response),
	STATUS_OF_REQUEST: (state, response) => (state.requestStatus = response),
	PUT_ALL_REQUESTED_EXAM_BY_STUDENT_ID: (state, response) => {
		state.listOfRequestedExam = response;
	},
	PUSH_EXAM_LIST_BY_EXAMCODE_ARR: (state, exams) =>
		(state.studentsEnrollPerExamCode = exams),
	SINGLE_EXAM_INFO_TO_COMPARE_STUDENT_SIDE: (state, response) => [
		(state.singleExamToCompareStudentSide = []),
		state.singleExamToCompareStudentSide.push(response)
	],
	SET_SCORES_INFO: (state, response) => {
		state.listTotalScoreOfStudent = response;
	},
	PUT_SINGLE_RESULT_INFO: (state, response) => {
		state.listSingleExamResult = response;
	},
	RESET_STATE: state => {
		Object.assign(state, getDefaultState());
	}
	//REMOVE_QUESTION: (state, questionNumber) => ({ })
};

export default {
	state,
	getters,
	actions,
	mutations
};
