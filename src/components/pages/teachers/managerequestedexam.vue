<template>
	<div>
		<div class="container mt-5">
			<div class="row">
				<div class="col col-sm-12">
					<h3>Manage Request Exams</h3>
				</div>
			</div>
			<div class="row">
				<table class="table">
					<thead>
						<tr>
							<th>Date And Time Requested</th>
							<th>Student Name</th>
							<th>Status</th>
							<th colspan="2">Options</th>
						</tr>
					</thead>

					<tbody>
						<tr
							v-for="singleRequestStudent in studentsPerExamCode"
							:key="singleRequestStudent.exam_code"
						>
							<td>
								{{ singleRequestStudent.dateRequested }}
								{{ singleRequestStudent.timeRequested }}
							</td>

							<td>{{ singleRequestStudent.student_name }}</td>
							<td class="text-uppercase fw-bold">
								{{ singleRequestStudent.status }}
							</td>
							<td v-show="singleRequestStudent.status == 'pending'">
								<button
									class="btn btn-outline-success"
									@click="
										acceptRequest(singleRequestStudent.requestId)
									"
								>
									Approved
								</button>
							</td>
							<td v-show="singleRequestStudent.status == 'pending'">
								<button
									class="btn btn-outline-danger"
									@click="
										rejectRequest(singleRequestStudent.requestId)
									"
								>
									Reject
								</button>
							</td>
							<td v-show="singleRequestStudent.status == 'accepted'">
								<button class="btn btn-outline-primary">
									View Progress
								</button>
							</td>
							<td v-show="singleRequestStudent.status == 'checking'">
								<router-link
									:to="{
										name: 'CheckingPage',
										params: {
											examcode: singleRequestStudent.examCode,
											request_id: singleRequestStudent.requestId
										}
									}"
									class="btn btn-outline-secondary"
								>
									Check Exam
								</router-link>
							</td>
							<td v-show="singleRequestStudent.status == 'checked'">
								<button
									class="btn btn-outline-success"
									data-bs-toggle="modal"
									data-bs-target="#modalShowExamResult"
									@click="showGrades(singleRequestStudent.requestId)"
								>
									Check Grade
								</button>
								<modalShowGrade />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import modalShowGrade from "../../partials/modals/resultInfo";
//import { , onMounted, onUnmounted } from "vue";
export default {
	components: {
		modalShowGrade
	},
	setup() {
		const storeModule = useStore();

		const getEmail = computed(() => storeModule.state.authModule.user_email);

		let queryArrInFetch = {
			field: "teacher_email",
			value: getEmail.value
		};

		const fetchListOfExam = computed(
			() => storeModule.state.examModule.examList
		);

		const studentsPerExamCode = computed(
			() => storeModule.state.examModule.studentsEnrollPerExamCode
		);

		function acceptRequest(requestId) {
			if (confirm("Are you sure to accept this request exam? ")) {
				storeModule.dispatch("acceptRequestToTakeExam", requestId);
				storeModule.dispatch("fetchAllExamsByExamCode", queryArrInFetch);
			}
		}

		function showGrades(requestId) {
			let nameAndReqId = {
				name: studentsPerExamCode.value[0].student_name,
				requestId: requestId
			};
			storeModule.dispatch("fetchExamResultByReqId", nameAndReqId);
		}

		onMounted([
			storeModule.dispatch("fetchAllExamsInTeacher", queryArrInFetch),
			storeModule.dispatch("fetchAllExamsByExamCode", queryArrInFetch)
		]);
		return {
			fetchListOfExam,
			studentsPerExamCode,
			acceptRequest,
			showGrades
		};
	}
};
</script>

<style></style>
