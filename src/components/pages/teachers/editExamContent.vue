<template>
	<div>
		<div class="container mb-5 mt-5">
			<div class="row alert alert-primary mb-2" v-show="queryMessage">
				<h5>{{ queryMessage }}</h5>
			</div>
			<div class="row">
				<div class="col col-sm-12 col-lg-10">
					<h3>Edit Questions</h3>
				</div>
				<div class="col col-sm-12 col-lg-1">
					<button
						class="btn btn-outline-primary"
						@click="updateExamInfo()"
					>
						Update
					</button>
				</div>
				<div class="col col-sm-12 col-lg-1">
					<router-link to="/manageexams" class="btn btn-outline-danger">
						Back
					</router-link>
				</div>
			</div>
			<div class="row" v-for="(row, idx) in getSingleExamInfo" :key="idx">
				<div class="container">
					<div class="row mb-3">
						<label for=""> Exam Title </label>
						<input
							type="text"
							class="form-control"
							v-model="row.examTitle"
						/>
					</div>
				</div>
				<div
					class="col col-sm-12"
					v-for="(question, questionidx) in row.examContent"
					:key="questionidx"
				>
					<div
						v-if="question.question_type == 'multiplechoice'"
						:id="questionidx"
						class="card mb-3 p-3"
					>
						<div class="row mb-4">
							<div class="col col-sm-10 col-lg-11">
								<label for="">Question No: {{ questionidx }}</label>
								<textarea
									class="form-control"
									cols="3"
									v-model="question.question"
								>
								</textarea>
							</div>
						</div>
						<div
							class="row mb-2"
							v-for="choice in question.choices"
							:key="choice.choice"
						>
							<div class="col col-sm-12 col-lg-1">
								<button class="btn btn-outline-primary btn-block">
									{{ choice.choice }}
								</button>
							</div>
							<div class="col col-sm-12 col-lg-11">
								<input
									class="form-control"
									type="text"
									v-model="choice.value"
								/>
							</div>
						</div>
						<div class="row mb-2">
							<div class="col col-sm-3 col-lg-3">
								<label for=""> Answer: (in letter) </label>
							</div>
							<div class="col col-sm-12 col lg-9">
								<input
									class="form-control"
									type="text"
									placeholder="In Letter"
									v-model="question.answer"
								/>
							</div>
						</div>
					</div>
					<!-- end of multiple choice -->

					<div
						v-if="question.question_type == 'trueorfalse'"
						:id="questionidx"
						class="card mb-3 p-3"
					>
						<div class="row mb-4">
							<div class="col col-sm-10 col-lg-11">
								<label for="">Question No: {{ questionidx }}</label>
								<textarea
									class="form-control"
									cols="3"
									v-model="question.question"
								>
								</textarea>
							</div>
						</div>
						<div
							class="row mb-2"
							v-for="choice in question.choices"
							:key="choice.choice"
						>
							<div class="d-grid gap-2 col-6 mx-auto">
								<button class="btn btn-outline-primary ">
									{{ choice.choice }}
								</button>
							</div>
						</div>
						<div class="row mb-2">
							<div class="col col-sm-3 col-lg-3">
								<label for=""> Answer: </label>
							</div>
							<div class="col col-sm-12 col lg-9">
								<input
									class="form-control"
									type="text"
									placeholder="true of false"
									v-model="question.answer"
								/>
							</div>
						</div>
					</div>

					<!-- end of true or false -->

					<div
						v-if="question.question_type == 'identification'"
						:id="questionidx"
						class="card mb-3 p-3"
					>
						<div class="row mb-4">
							<div class="col col-sm-10 col-lg-11">
								<label for="">Question No: {{ questionidx }}</label>
								<textarea
									class="form-control"
									cols="3"
									v-model="question.question"
								>
								</textarea>
							</div>
						</div>
						<div class="row mb-2">
							<div class="col col-sm-12">
								<input
									type="text"
									class="form-control"
									v-model="question.userAnswer"
								/>
							</div>
						</div>
						<div class="row mb-2">
							<div class="col col-sm-3 col-lg-3">
								<label for=""> Answer: </label>
							</div>
							<div class="col col-sm-12 col lg-9">
								<input
									class="form-control"
									type="text"
									placeholder="answer to question"
									v-model="question.answer"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
export default {
	setup() {
		const storeModule = useStore();
		const router = useRouter();

		let getSingleExamInfo = computed(
			() => storeModule.state.examModule.singleExam
		);
		let queryMessage = computed(
			() => storeModule.state.examModule.queryMessage
		);
		let docIdparam = router.currentRoute.value.params.docid;

		function updateExamInfo() {
			let updatedExamAndDocid = {
				docId: docIdparam,
				updateExam: getSingleExamInfo.value[0]
			};
			storeModule.dispatch("updateExam", updatedExamAndDocid);
		}

		onUnmounted([storeModule.dispatch("clearQueryMessage")]);

		return { getSingleExamInfo, docIdparam, updateExamInfo, queryMessage };
	}
};
</script>

<style></style>
