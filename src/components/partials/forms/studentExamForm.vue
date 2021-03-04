<template>
	<div>
		<div
			class="container mt-5"
			v-for="(value, idx) in getExamDetails.exam_info"
			:key="idx"
		>
			<div class="row" id="title">
				<div class="col col-sm-12 col-lg-9">
					<h3 class="tw-bold">{{ value.examTitle }}</h3>
				</div>
				<div class="col col-sm-12 col-lg-2">
					<button class="btn btn-outline-primary" @click="doneExam()">
						Submit Exam
					</button>
				</div>
				<div class="col col-sm-12 col-lg-1">
					<button class="btn btn-outline-danger" @click="backToExamList()">
						Back
					</button>
				</div>
			</div>
			<div class="row">
				<div class="col col-sm-12 col-lg-6">
					<p>Remarks:</p>
					<ul>
						<li>Green Color: Answered</li>
						<li>Gray Color: Not/No Answer</li>
					</ul>
				</div>
				<div
					class="col col-sm-12 col-lg-6 alert alert-primary mt-5"
					v-show="examMessage"
				>
					{{ examMessage }}
				</div>
			</div>

			<div class="btn-toolbar" role="toolbar">
				<div
					v-for="(row, idx) in value.examContent"
					:key="idx"
					class="btn-group mr-2"
					role="group"
				>
					<div v-if="idx == 0"></div>
					<div v-else>
						<a
							type="button"
							:href="'#' + row.uniqueId"
							:class="
								row.yourAnswer
									? 'btn btn-success m-1'
									: 'btn btn-secondary m-1'
							"
						>
							{{ idx }}
						</a>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col col-sm-12">
					<div
						class="card p-3 mb-5"
						v-for="(row, idx) in value.examContent"
						:key="idx"
					>
						<div v-if="!row.uniqueId" class="d-none">Wala laman</div>
						<div v-if="row.question_type == 'multiplechoice'">
							<div class="row mb-4" :id="row.uniqueId">
								<div class="col col-sm-10 col-lg-11">
									<label for="" class="fw-bold"
										>Question No: {{ idx }} (Multiple Choice)</label
									>
									<p>
										{{ row.question }}
									</p>
								</div>
								<div class="col col-sm-2 col-lg-1"></div>
								<hr />
							</div>
							<div
								class="row mb-2"
								v-for="choice in row.choices"
								:key="choice.choice"
							>
								<div class="col col-sm-12 col-lg-12">
									<p>
										{{ choice.choice }}:

										{{ choice.value }}
									</p>
								</div>

								<hr />
							</div>
							<div class="row mb-2">
								<div class="col col-sm-3 col-lg-3">
									<label for=""> Your Answer: </label>
								</div>
								<div class="col col-sm-12 col lg-9">
									<input
										class="form-control"
										type="text"
										placeholder="In Letter"
										v-model="row.yourAnswer"
									/>
								</div>
							</div>
						</div>

						<div v-if="row.question_type == 'trueorfalse'">
							<div class="row mb-4" :id="row.uniqueId">
								<div class="col col-sm-10 col-lg-11">
									<label for="" class="fw-bold"
										>Question No: {{ idx }} (True or False)</label
									>
									<p>
										{{ row.question }}
									</p>
								</div>
								<div class="col col-sm-2 col-lg-1"></div>
							</div>

							<div class="row mb-2">
								<div class="col col-sm-3 col-lg-3">
									<label for=""> Your Answer: </label>
								</div>
								<div class="col col-sm-12 col lg-9">
									<input
										class="form-control"
										type="text"
										placeholder="true of false"
										v-model="row.yourAnswer"
									/>
								</div>
							</div>
						</div>

						<div v-if="row.question_type == 'identification'">
							<div class="row mb-4" :id="row.uniqueId">
								<div class="col col-sm-10 col-lg-11">
									<label for="" class="fw-bold"
										>Question No: {{ idx }} (Identification)</label
									>
									<p>
										{{ row.question }}
									</p>
								</div>
								<div class="col col-sm-2 col-lg-1"></div>
							</div>

							<div class="row mb-2">
								<div class="col col-sm-3 col-lg-3">
									<label for=""> Your Answer: </label>
								</div>
								<div class="col col-sm-12 col lg-9">
									<input
										class="form-control"
										type="text"
										placeholder="answer to question"
										v-model="row.yourAnswer"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<a href="#title" class="float" style="width: 5em; text-decoration: none">
			<span> Back to top </span>
		</a>
	</div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted, computed } from "vue";
export default {
	setup() {
		const route = useRoute();
		const router = useRouter();
		const storeModule = useStore();

		const getExamId = route.params.examcode;

		const getExamDetails = computed(
			() => storeModule.state.examModule.examListStudent
		);

		const examMessage = computed(
			() => storeModule.state.examModule.queryMessage
		);

		let queryArr = {
			field: "exam_code",
			value: getExamId
		};

		function doneExam() {
			if (
				confirm(
					"Are you sure to submit this exam? Please recheck all items before submitting"
				)
			) {
				storeModule.dispatch("submitExamToTeacher", getExamDetails.value);
			}
		}

		function backToExamList() {
			if (
				confirm(
					"Are you sure to leave this exam? All current answered are deleted"
				)
			) {
				router.push("/exams");
			}
		}

		onMounted([storeModule.dispatch("fetchAllExamsInStudent", queryArr)]);

		return { getExamDetails, doneExam, backToExamList, examMessage };
	}
};
</script>

<style></style>
