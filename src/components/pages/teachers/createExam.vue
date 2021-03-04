<template>
	<div>
		<div class="container mt-4">
			<div class="row">
				<div class="col col-sm-12 col-lg-9" id="title">
					<h3>Create Exam</h3>
				</div>
				<div class="col col-sm-12 col-lg-3">
					<button class="btn btn-outline-success mr-3" @click="saveExam()">
						Save Exam
					</button>
					<router-link to="/manageexams" class="btn btn-outline-primary">
						Back
					</router-link>
				</div>
			</div>
			<div class="row">
				<div class="col col-sm-12">
					<label for="">Exam Title</label>
					<input type="text" v-model="examtitle" class="form-control" />
				</div>
			</div>
			<div class="row mb-3">
				<div class="col col-sm-12 col-lg-4">
					<MultipleChoice />
				</div>
				<div class="col col-sm-12 col-lg-4">
					<TrueOrFalse />
				</div>
				<div class="col col-sm-12 col-lg-4">
					<Identification />
				</div>
			</div>
			<div class="btn-toolbar" role="toolbar">
				<div
					v-for="(row, idx) in arrayOfQuestions"
					:key="idx"
					class="btn-group mr-2"
					role="group"
				>
					<div v-if="idx == 0"></div>
					<div v-else>
						<a
							type="button"
							:href="'#' + row.uniqueId"
							class="btn btn-secondary"
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
						v-for="(row, idx) in arrayOfQuestions"
						:key="row.uniqueId"
					>
						<div
							v-if="row.question_type == 'multiplechoice'"
							:id="row.uniqueId"
						>
							<div class="row mb-4">
								<div class="col col-sm-10 col-lg-11">
									<label for="">Question No: {{ idx }}</label>
									<textarea
										class="form-control"
										cols="3"
										v-model="row.question"
									>
									</textarea>
								</div>
								<div class="col col-sm-2 col-lg-1">
									<button
										class="btn btn-outline-primary"
										@click="removeQuestion(row.uniqueId, idx)"
									>
										x
									</button>
								</div>
							</div>
							<div
								class="row mb-2"
								v-for="choice in row.choices"
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
									<label for=""> Answer: </label>
								</div>
								<div class="col col-sm-12 col lg-9">
									<input
										class="form-control"
										type="text"
										placeholder="In Letter"
										v-model="row.answer"
									/>
								</div>
							</div>
						</div>

						<div
							v-if="row.question_type == 'trueorfalse'"
							:id="row.uniqueId"
						>
							<div class="row mb-4">
								<div class="col col-sm-10 col-lg-11">
									<label for="">Question No: {{ idx }}</label>
									<textarea
										class="form-control"
										cols="3"
										v-model="row.question"
									>
									</textarea>
								</div>
								<div class="col col-sm-2 col-lg-1">
									<button
										class="btn btn-outline-primary"
										@click="removeQuestion(row.uniqueId, idx)"
									>
										x
									</button>
								</div>
							</div>
							<div
								class="row mb-2"
								v-for="choice in row.choices"
								:key="choice.choice"
							>
								<div class="d-grid gap-2 col-6 mx-auto">
									<button class="btn btn-outline-primary">
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
										v-model="row.answer"
									/>
								</div>
							</div>
						</div>

						<div
							v-if="row.question_type == 'identification'"
							:id="row.uniqueId"
						>
							<div class="row mb-4">
								<div class="col col-sm-10 col-lg-11">
									<label for="">Question No: {{ idx }}</label>
									<textarea
										class="form-control"
										cols="3"
										v-model="row.question"
									>
									</textarea>
								</div>
								<div class="col col-sm-2 col-lg-1">
									<button
										class="btn btn-outline-primary"
										@click="removeQuestion(row.uniqueId, idx)"
									>
										x
									</button>
								</div>
							</div>
							<div class="row mb-2">
								<div class="col col-sm-12">
									<input
										type="text"
										class="form-control"
										v-model="row.userAnswer"
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
										v-model="row.answer"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<a href="#title" class="float">
			<i class="fa fa-plus my-float"> Back to top</i>
		</a>
	</div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, onUnmounted } from "vue";
import { createExam } from "@/firebase";
import MultipleChoice from "../../partials/forms/examtype/multiplechoice";
import TrueOrFalse from "../../partials/forms/examtype/truefalse";
import Identification from "../../partials/forms/examtype/identification";
export default {
	components: {
		MultipleChoice,
		TrueOrFalse,
		Identification
	},
	setup() {
		let storeModule = useStore();
		// let questionNumber = computed(() => storeModule.state.examModule.countOfItems)
		let arrayOfQuestions = computed(
			() => storeModule.state.examModule.questionRows
		);
		const getEmail = computed(() => storeModule.state.authModule.user_email);
		let examtitle = ref("");

		function removeQuestion(id, idx) {
			if (confirm("Are you sure to remove this question no. " + idx)) {
				storeModule.dispatch("removeQuestionNumber", id);
			}
		}

		function generateRandomNumandLetters() {
			var chars =
				"0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var string_length = 6;
			let randKey = "";
			for (var i = 0; i < string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randKey += chars.substring(rnum, rnum + 1);
			}

			return randKey;
		} // to be moved in vuex

		const saveExam = async () => {
			let dateNow = new Date();

			let examContent = [
				{
					exam_code: generateRandomNumandLetters(),
					teacher_email: getEmail.value,
					examTitle: examtitle.value,
					dateCreated:
						dateNow.getMonth() +
						1 +
						"-" +
						dateNow.getDate() +
						"-" +
						dateNow.getFullYear(),
					examContent: arrayOfQuestions.value
				}
			];
			await createExam(...examContent);
			storeModule.dispatch("emptyQuestionList");
			alert("Exam Saved");
		};
		onUnmounted([storeModule.dispatch("emptyQuestionList")]);

		return {
			arrayOfQuestions,
			removeQuestion,
			saveExam,
			examtitle,
			getEmail
		};
	}
};
</script>

<style>
.float {
	position: fixed;
	width: 60px;
	height: 60px;
	bottom: 40px;
	right: 40px;
	background-color: #0c9;
	color: #fff;
	border-radius: 50px;
	text-align: center;
	box-shadow: 2px 2px 3px #999;
}

.my-float {
	margin-top: 22px;
}
</style>
