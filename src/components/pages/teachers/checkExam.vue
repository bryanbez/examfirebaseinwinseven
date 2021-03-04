<template>
	<div>
		<div class="container mt-5">
			<div class="row">
				<div class="col col-sm-12 col-lg-9">
					<h3>Checking Exam</h3>
					<p>
						Indentification Type of Questions must confirm if the answer
						is right or wrong.
					</p>
				</div>
				<div class="col col-sm-12 col-lg-1">
					<button
						type="button"
						class="btn btn-primary"
						data-bs-toggle="modal"
						data-bs-target="#modalSubmitExamResult"
						@click="fetchTotalScores()"
					>
						Submit
					</button>
				</div>
				<div class="col col-sm-12 col-lg-1">
					<button
						type="button"
						class="btn btn-danger"
						@click="backToManageExams()"
					>
						Back
					</button>
				</div>
			</div>
			<!-- Modal -->
			<div
				class="modal fade"
				id="modalSubmitExamResult"
				tabindex="-1"
				aria-labelledby="modalSubmitExamResult"
				aria-hidden="true"
			>
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="modalSubmitExamResultLabel">
								Submit Result
							</h5>
							<button
								type="button"
								class="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div class="modal-body">
							<div
								class="alert alert-secondary"
								v-if="getSavedExamResultMsg != ''"
							>
								{{ getSavedExamResultMsg }}
							</div>
							<br />
							<p>Please Check if the result is correct</p>

							<p>
								Name: {{ profileInfo[0].userInfo.last_name }},
								{{ profileInfo[0].userInfo.first_name }}
								{{ profileInfo[0].userInfo.middle_initial }}
							</p>

							<hr />
							<p>Exam Title: {{ examInfo.examTitle }}</p>
							<hr />
							<p>Correct Items: {{ getScoresInfo.right_answers }}</p>
							<hr />
							<p>Wrong Items: {{ getScoresInfo.wrong_answers }}</p>
							<hr />
							<p>Total Items: {{ getScoresInfo.total_items }}</p>
							<hr />
						</div>
						<div class="modal-footer">
							<button
								type="button"
								class="btn btn-secondary"
								data-bs-dismiss="modal"
							>
								Close
							</button>
							<button
								type="button"
								class="btn btn-primary"
								@click="saveExamResultOnFb()"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
			<!-- End of Modal -->
			<hr />
			<div class="row">
				<div class="col-sm-12 col-lg-16">
					Exam Title: {{ examInfo.examTitle }}
				</div>
				<div class="col-sm-12 col-lg-16">
					Student Name: {{ profileInfo[0].userInfo.last_name }},
					{{ profileInfo[0].userInfo.first_name }}
					{{ profileInfo[0].userInfo.middle_initial }}
				</div>
			</div>
			<hr />
			<div class="row">
				<div class="col col-sm-12 col-lg-12">
					<table class="table">
						<thead>
							<tr>
								<th>Question</th>
								<th>Exam Answer</th>
								<th>Student Answer</th>
								<th>Result</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="singleItem in getExamAnswers[0].examContent"
								:key="singleItem.questionId"
							>
								<td>{{ singleItem.question }}</td>
								<td>
									{{ singleItem.questionAnswer }}
								</td>
								<td>{{ singleItem.studentAnswer }}</td>

								<td v-if="singleItem.questiontype == 'identification'">
									<input
										type="text"
										class="form-control"
										v-model="singleItem.questionResult"
										placeholder="input if right or wrong"
									/>
								</td>
								<td v-if="singleItem.questiontype != 'identification'">
									{{ singleItem.questionResult }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default {
	setup() {
		const storeModule = useStore();

		const route = useRoute();
		const router = useRouter();

		const passedExamId = route.params.examcode;

		const getExamAnswers = computed(
			() => storeModule.state.examModule.singleExamToCompareStudentSide[0]
		);

		const examInfo = computed(
			() => storeModule.state.examModule.singleExam[0]
		);

		const profileInfo = computed(
			() => storeModule.state.profileModule.profileInfo
		);

		const getScoresInfo = computed(
			() => storeModule.state.examModule.listTotalScoreOfStudent
		);

		const getSavedExamResultMsg = computed(
			() => storeModule.state.examModule.queryMessage
		);

		function fetchTotalScores() {
			storeModule.dispatch("getTotalScores", getExamAnswers.value);
		}

		function saveExamResultOnFb() {
			let examResultInfo = {
				request_exam_id: route.params.request_id,
				total_items: getScoresInfo.value.total_items,
				correct_items: getScoresInfo.value.right_answers,
				wrong_items: getScoresInfo.value.wrong_answers
			};
			storeModule.dispatch("saveExamResult", examResultInfo);
		}

		function backToManageExams() {
			if (confirm("Are you sure to back to previous page? ")) {
				router.push("/managerequestexam");
			}
		}

		onMounted([
			storeModule.dispatch("fetchSingleExamByCode", passedExamId),
			storeModule.dispatch("clearQueryMessage"),
			storeModule.dispatch(
				"getSingleExamInfo",
				getExamAnswers.value[0].exam_id
			),
			
		]);

		return {
			getExamAnswers,
			profileInfo,
			examInfo,
			fetchTotalScores,
			getScoresInfo,
			saveExamResultOnFb,
			getSavedExamResultMsg,
			backToManageExams
		};
	}
};
</script>

<style></style>
