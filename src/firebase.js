import firebase from "firebase";
import { ref, onUnmounted } from "vue";

const config = {
	apiKey: "AIzaSyAQnE5eFUouv2Q_VjGokFMepMof6pw_NOU",
	authDomain: "examwebsite-ecaf0.firebaseapp.com",
	projectId: "examwebsite-ecaf0",
	storageBucket: "examwebsite-ecaf0.appspot.com",
	messagingSenderId: "670482408913",
	appId: "1:670482408913:web:7fc9ad43c2681e68cb2cf0",
	measurementId: "G-Y167YP3GTG"
};

const initializeFirebaseApp = firebase.initializeApp(config);

const db = initializeFirebaseApp.firestore();
const usersdb = db.collection("users");
const examsdb = db.collection("exams");
const requestexamdb = db.collection("request_exam");
const studentTakenExam = db.collection("studentExamTaken");
const examResultsDb = db.collection("exam_result_in_requested");

export const fbaseAuthentication = initializeFirebaseApp.auth();
export const fbaseStorageService = initializeFirebaseApp.storage().ref();

// users

export const createUser = user => {
	return usersdb.add(user);
};

export const getUser = async id => {
	const user = await usersdb.doc(id).get();
	return user.exists ? user.data() : null;
};

export const searchUsername = async username => {
	const isExistUsername = await usersdb
		.where("username", "==", username)
		.get()
		.then(querySnapshot => {
			return querySnapshot.size;
		});

	return isExistUsername == 0 ? true : false;
};

export const updateUser = function(id, user) {
	return usersdb.doc(id).update(user);
};

export const deleteUser = id => {
	return usersdb.doc(id).delete();
};

export const fetchUserType = async user_email => {
	const store_user_type = ref([]);

	await usersdb
		.where("email", "==", user_email)
		.get()
		.then(querySnapshot => {
			store_user_type.value = querySnapshot.docs.map(doc => ({
				userInfo: doc.data()["user_type"]
			}));
		});
	return store_user_type.value;
};

export const fetchProfileInfoOfUser = async user_email => {
	const profileInfoArr = ref([]);
	await usersdb
		.where("email", "==", user_email)
		.get()
		.then(querySnapshot => {
			profileInfoArr.value = querySnapshot.docs.map(doc => ({
				id: doc.id,
				userInfo: doc.data()
			}));
		});
	return profileInfoArr;
};

export const updateProfileInfoOfUser = async profileInfo => {
	return usersdb
		.doc(profileInfo[0].id)
		.update(profileInfo[0].userInfo)
		.then(() => {
			return "Profile Updated!";
		})
		.catch(error => {
			return "Error updating profile" + error;
		});
};

// update list when data changes
export const useLoadUsers = function() {
	const users = ref([]);
	const close = usersdb.onSnapshot(snapshot => {
		users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	});
	onUnmounted(close);
	return users;
};

// exams

export const createExam = exam => {
	return examsdb.add(exam);
};

export const loadExams = function() {
	const examList = ref([]);
	const close = examsdb.onSnapshot(snapshot => {
		examList.value = snapshot.docs.map(doc => ({
			id: doc.id,
			examInfo: doc.data()
		}));
	});
	onUnmounted(close);
	return examList;
};

export const loadExamsByTeacher = async arrQuery => {
	const examListByTeacherEmail = ref([]);
	await examsdb
		.where(arrQuery.field, "==", arrQuery.value)
		.get()
		.then(querySnapshot => {
			examListByTeacherEmail.value = querySnapshot.docs.map(doc => ({
				id: doc.id,
				userInfo: doc.data()
			}));
		});
	return examListByTeacherEmail;
};

export const loadExamsInStudent = async arrQuery => {
	const examContent = ref([]);
	await examsdb
		.where(arrQuery.field, "==", arrQuery.value)
		.get()
		.then(querySnapshot => {
			examContent.value = querySnapshot.docs.map(doc => ({
				id: doc.id,
				examTitle: doc.data()["examTitle"],
				examContent: doc.data()["examContent"]
			}));
		});

	// examContent.value.forEach(value => {
	// 	value.examContent.forEach(questions => {
	// 		delete questions["answer"];
	// 	});
	// });

	return examContent;
};

export const loadStudentsByExamCodeOfTeacher = async arrQuery => {
	// teacher_email

	const examCodesOfTeacher = ref([]);
	const studentsEnrolledInExamCode = ref([]);
	await examsdb
		.where(arrQuery.field, "==", arrQuery.value)
		.get()
		.then(querySnapshot => {
			examCodesOfTeacher.value = querySnapshot.docs.map(doc => ({
				examCode: doc.data()["exam_code"]
			}));
		});

	examCodesOfTeacher.value.forEach(value => {
		fetchStudentsByExamCode(value.examCode).then(result => {
			if (result == 0) {
				return;
			} else {
				result.forEach(singleItem => {
					getUser(singleItem.student_id).then(userInfo => {
						studentsEnrolledInExamCode.value.push({
							requestId: singleItem.requestID,
							examCode: singleItem.examCode,
							student_name:
								userInfo.last_name +
								", " +
								userInfo.first_name +
								" " +
								userInfo.middle_initial +
								".",
							dateRequested: singleItem.dateRequested,
							timeRequested: singleItem.timeRequested,
							status: singleItem.status_of_request
						});
					});
				});
			}
		});
	});

	return studentsEnrolledInExamCode.value;
};

export const fetchSingleExam = async id => {
	// by document id
	const singleExam = await examsdb.doc(id).get();
	return singleExam.exists ? singleExam.data() : null;
};

export const fetchSingleExamByExamId = async examCode => {
	// by exam code
	const getDocId = ref("");
	await examsdb
		.where("exam_code", "==", examCode)
		.get()
		.then(querySnapshot => {
			getDocId.value = querySnapshot.docs.map(doc => ({
				id: doc.id
			}));
		});
	return getDocId.value;
};

export const fetchStudentExamTakenById = async docId => {
	let getStudentAnswers = ref([]);
	await studentTakenExam
		.where("exam_id", "==", docId[0].id)
		.get()
		.then(querySnapshot => {
			getStudentAnswers.value = querySnapshot.docs.map(doc => ({
				id: doc.id,
				examContent: doc.data()["question_content"],
				student_id: doc.data()["student_id"],
				exam_id: doc.data()["exam_id"]
			}));
		});

	getStudentAnswers.value[0]["examContent"].forEach(value => {
		if (value.questiontype == "multiplechoice") {
			if (
				value.questionAnswer.toUpperCase() ==
				value.studentAnswer.toUpperCase()
			) {
				value.questionResult = "right";
				return;
			} else {
				value.questionResult = "wrong";
				return;
			}
		}
		if (value.questiontype == "trueorfalse") {
			if (
				value.questionAnswer.toLowerCase() ==
				value.studentAnswer.toLowerCase()
			) {
				value.questionResult = "right";
				return;
			} else {
				value.questionResult = "wrong";
				return;
			}
		}
		if (value.questiontype == "identification") {
			return;
		}
	});

	console.log(getStudentAnswers.value);

	return getStudentAnswers.value;
};

export const updateExam = function(examInfoToUpdate) {
	return examsdb
		.doc(examInfoToUpdate.docId)
		.update(examInfoToUpdate.updateExam)
		.then(() => {
			return "Exam Updated!";
		})
		.catch(error => {
			return "Error updating exam" + error;
		});
};

export const deleteExam = id => {
	return examsdb
		.doc(id)
		.delete()
		.then(() => {
			return "Exam Deleted!";
		});
};

export const searchExamCode = async examcode => {
	const searchResult = ref([]);
	await examsdb
		.where("exam_code", "==", examcode)
		.get()
		.then(querySnapshot => {
			searchResult.value = querySnapshot.docs.map(doc => ({
				exam_id: doc.id,
				dateCreated: doc.data()["dateCreated"],
				examTitle: doc.data()["examTitle"],
				teacher_email: doc.data()["teacher_email"]
			}));
		});
	return searchResult.value;
};

// request exam db

export const getStatusOfRequestExam = async studentInfo => {
	let fetchRequestStatus = ref([]);
	await requestexamdb
		.where("exam_code", "==", studentInfo.exam_code)
		.where("student_id", "==", studentInfo.student_id)
		.get()
		.then(querySnapshot => {
			fetchRequestStatus.value = querySnapshot.docs.map(doc => ({
				request_status: doc.data()["status_of_request"]
			}));
		});
	if (fetchRequestStatus.value.length == 0) {
		return "notfound";
	} else {
		return fetchRequestStatus.value[0].request_status;
	}
};

export const requestExamToTeacher = requestInfo => {
	return requestexamdb
		.add(requestInfo)
		.then(() => {
			return "Exam Request Success. Please wait for confirmation";
		})
		.catch(error => {
			return "There was a problem requesting exam" + error;
		});
};

export const fetchRequestedExamFb = async arrQuery => {
	const listResults = ref([]);
	await requestexamdb
		.where(arrQuery.field, "==", arrQuery.value)
		.get()
		.then(querySnapshot => {
			listResults.value = querySnapshot.docs.map(doc => ({
				requestID: doc.id,
				dateRequested: doc.data()["dateRequested"],
				examCode: doc.data()["exam_code"],
				student_id: doc.data()["student_id"],
				status_of_request: doc.data()["status_of_request"]
			}));
		});
	return listResults.value;
};

export const fetchStudentsByExamCode = async examCode => {
	const listStudentsByExamCode = ref([]);
	await requestexamdb
		.where("exam_code", "==", examCode)
		.get()
		.then(querySnapshot => {
			listStudentsByExamCode.value = querySnapshot.docs.map(doc => ({
				requestID: doc.id,
				dateRequested: doc.data()["dateRequested"],
				timeRequested: doc.data()["timeRequested"],
				examCode: doc.data()["exam_code"],
				student_id: doc.data()["student_id"],
				status_of_request: doc.data()["status_of_request"]
			}));
		});
	if (listStudentsByExamCode.value.length == 0) {
		return 0;
	} else {
		return listStudentsByExamCode.value;
	}
};

export const removeExamRequestFb = async requestExamCode => {
	const toDeleteDocument = requestexamdb.where(
		"exam_code",
		"==",
		requestExamCode
	);
	toDeleteDocument.get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			doc.ref.delete();
		});
	});
};

export const acceptExamRequestFb = async requestId => {
	const toAcceptExam = await requestexamdb
		.doc(requestId)
		.update({
			status_of_request: "accepted"
		})
		.then(() => {
			return "Request Exam Approved";
		});

	return toAcceptExam;
};

// calculate exam taken

export const saveExamTaken = async submitExam => {
	let studentAnswer = [];
	let toSubmitExamDetails = [];
	let dateTime = new Date();

	submitExam.exam_info[0].examContent.forEach(question => {
		if (question.uniqueId == undefined && question.answer == undefined) {
			// for question no. 0 because array starts from zero.
			return "";
		}
		studentAnswer.push({
			questiontype: question.question_type,
			question: question.question,
			questionId: question.uniqueId,
			studentAnswer: question.yourAnswer,
			questionAnswer: question.answer,
			questionResult: ""
		});
	});
	toSubmitExamDetails = {
		student_id: submitExam.request_info[0].student_id,
		exam_id: submitExam.exam_info[0].id,
		question_content: studentAnswer,
		dateAndTimeSubmitted:
			dateTime.getMonth() +
			1 +
			"-" +
			dateTime.getDate() +
			"-" +
			dateTime.getFullYear() +
			" " +
			dateTime.getHours() +
			":" +
			dateTime.getMinutes() +
			":" +
			dateTime.getSeconds()
	};

	// fetch doc id of selected requested exam
	let storedDocIdOfRequestedExam = "";
	await requestexamdb
		.where("student_id", "==", submitExam.request_info[0].student_id)
		.where("exam_code", "==", submitExam.request_info[0].examCode)
		.get()
		.then(querySnapshot => {
			querySnapshot.forEach(doc => {
				storedDocIdOfRequestedExam = doc.id;
			});
		});

	// update status of take exam to checking in
	await requestexamdb.doc(storedDocIdOfRequestedExam).update({
		status_of_request: "checking"
	});

	// add the student answers in the student exam taken
	await studentTakenExam
		.add(toSubmitExamDetails)
		.then(() => {
			return "Exam Successfully Submit. Please wait to teacher to check.";
		})
		.catch(error => {
			return "There was an error submitting the exam" + error;
		});
};

// save exam result

export const saveExamResultFb = async examResultInfo => {
	await requestexamdb.doc(examResultInfo.request_exam_id).update({
		status_of_request: "checked"
	});

	return await examResultsDb
		.add(examResultInfo)
		.then(() => {
			return "Exam Result Info Saved";
		})
		.catch(error => {
			return "There was an error saving result" + error;
		});
};

// fetch exam result by request id

export const fetchExamResultByRequestId = async studNameAndReqId => {
	let arrResultExamInfo = [];
	if (studNameAndReqId.name == "" && studNameAndReqId.requestId == "") {
		return null;
	} else {
		await examResultsDb
			.where("request_exam_id", "==", studNameAndReqId.requestId)
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(doc => {
					arrResultExamInfo.push(doc.data());
				});
			});
		arrResultExamInfo.push({ stud_name: studNameAndReqId.name });

		return arrResultExamInfo;
	}
};
