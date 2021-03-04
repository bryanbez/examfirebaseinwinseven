<template>
	<div>
		<div class="container mt-5">
			<div class="row">
				<div class="col col-sm-12 col-lg-10">
					<h3>Your Exams</h3>
				</div>
				<div class="col col-sm-12 col-lg-2">
					<button
						class="btn btn-outline-primary"
						data-bs-toggle="modal"
						data-bs-target="#requestExamModal"
					>
						Request Exam
					</button>
				</div>
			</div>

			<div v-show="examMessage != ''" class="alert alert-success">
				{{ examMessage }}
			</div>
			<div v-show="null">{{ fetchListOfRequestedExam }}</div>
			<!-- weird, do not remove hahaha it not update the table content when adding and removing exam when remove the code above this comment -->
			<div class="row">
				<div class="col col-sm-12">
					<table class="table" v-show="fetchListOfRequestedExam != 0">
						<thead>
							<tr>
								<th>Date Requested</th>
								<th>Exam Title</th>
								<th>Status</th>
								<th>Options</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="singleExam in fetchListOfRequestedExam"
								:key="singleExam.id"
							>
								<td>{{ singleExam.dateRequested }}</td>
								<td>{{ singleExam.examTitle }}</td>
								<td>{{ singleExam.status }}</td>
								<td>
									<button
										class="btn btn-outline-danger"
										v-show="singleExam.status == 'pending'"
										@click="cancelExamRequest(singleExam.examCode)"
									>
										Cancel Request
									</button>
									<router-link
										:to="{
											name: 'TakeExam',
											params: { examcode: singleExam.examCode }
										}"
										class="btn btn-outline-success"
										v-show="singleExam.status == 'accepted'"
									>
										Take Exam
									</router-link>

									<button
										class="btn btn-outline-secondary"
										v-show="singleExam.status == 'checked'"
										data-bs-toggle="modal"
										data-bs-target="#modalShowExamResult"
										@click="showGrades(singleExam.requestID)"
									>
										Check Exam Result
									</button>
									<examResultModal />
								</td>
							</tr>
						</tbody>
					</table>
					<div
						class="col col-sm-12"
						v-show="fetchListOfRequestedExam.length == 0"
					>
						<h3 class="alert alert-secondary text-center">
							No Exam Requested
						</h3>
					</div>
				</div>
			</div>
		</div>

		<div class="modal" tabindex="-1" id="requestExamModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Request Exam</h5>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div class="modal-body">
						<label for="">Input Exam Code</label>
						<input
							type="text"
							class="form-control"
							@keyup="searchExamCode()"
							v-model="examCodeToRequest"
						/>
						<br />
						<div class="alert alert-info" v-show="requestExamMessage">
							{{ requestExamMessage }}
						</div>
						<div class="card">
							<div
								class="card-body"
								v-for="examResult in searchCodeResult"
								:key="examResult.exam_id"
							>
								<h5>Exam Title: {{ examResult.examTitle }}</h5>
								<hr />
								<p>Date Created: {{ examResult.dateCreated }}</p>
								<hr />
								<p>
									Teacher Email:
									{{ examResult.teacher_email }}
								</p>
								<hr />
								<button
									v-show="requestExamStatus == 'notfound'"
									class="btn btn-outline-success"
									@click="requestExam()"
								>
									Request
								</button>
								<div
									class="alert alert-secondary"
									v-show="requestExamStatus == 'pending'"
								>
									Status: {{ requestExamStatus }}
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button
							type="button"
							class="btn btn-secondary"
							data-bs-dismiss="modal"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import examResultModal from "../../partials/modals/resultInfo";
import { ref, computed, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";
export default {
	components: {
		examResultModal
	},
	setup() {
		const storeModule = useStore();

		let examCodeToRequest = ref("");
		let searchCodeResult = computed(
			() => storeModule.state.examModule.searchResult
		);

		const profileInfo = computed(
			() => storeModule.state.profileModule.profileInfo
		);

		const requestExamMessage = computed(
			() => storeModule.state.examModule.requestExamMsg
		);

		const requestExamStatus = computed(
			() => storeModule.state.examModule.requestStatus
		);

		const fetchListOfRequestedExam = computed(
			() => storeModule.state.examModule.listOfRequestedExam
		);

		const examMessage = computed(
			() => storeModule.state.examModule.queryMessage
		);

		function showGrades(requestId) {
			let nameAndReqId = {
				name:
					profileInfo.value[0].userInfo.last_name +
					", " +
					profileInfo.value[0].userInfo.first_name +
					" " +
					profileInfo.value[0].userInfo.middle_initial,
				requestId: requestId
			};
			//console.log(nameAndReqId);
			storeModule.dispatch("fetchExamResultByReqId", nameAndReqId);
		}

		function searchExamCode() {
			let searchQuery = {
				exam_code: examCodeToRequest.value,
				student_id: profileInfo.value[0].id
			};
			storeModule.dispatch("getStatusOfRequestExam", searchQuery);
			storeModule.dispatch("searchExamCodeAction", examCodeToRequest.value);
		}

		function requestExam() {
			let dateTimeNow = new Date();
			let requestExamInfo = ref({
				dateRequested:
					dateTimeNow.getMonth() +
					1 +
					"-" +
					dateTimeNow.getDate() +
					"-" +
					dateTimeNow.getFullYear(),
				timeRequested:
					dateTimeNow.getHours() +
					":" +
					dateTimeNow.getMinutes() +
					":" +
					dateTimeNow.getSeconds(),
				exam_code: examCodeToRequest.value,
				status_of_request: "pending",
				student_id: profileInfo.value[0].id
			});
			storeModule.dispatch("requestToTakeExam", requestExamInfo.value);
		}

		function cancelExamRequest(request_id) {
			let toRemoveRequest = {
				requestExamCode: request_id,
				student_id: profileInfo.value[0].id
			};

			if (confirm("Are you sure to cancel this exam request? ")) {
				storeModule.dispatch("cancelExamRequestAction", toRemoveRequest);
			}
		}

		onMounted([
			storeModule.dispatch(
				"fetchAllRequestedExamByStudentId",
				profileInfo.value[0].id
			)
		]);

		onUnmounted([
			storeModule.dispatch("searchExamCodeAction", "")
			//storeModule.dispatch("emptyListExams", "")
		]);

		return {
			fetchListOfRequestedExam,
			examCodeToRequest,
			searchCodeResult,
			searchExamCode,
			requestExam,
			requestExamMessage,
			requestExamStatus,
			cancelExamRequest,
			examMessage,
			profileInfo,
			showGrades
		};
	}
};
</script>

<style></style>
