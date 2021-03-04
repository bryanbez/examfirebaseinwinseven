<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col col-sm-12 col-lg-10 mt-3">
					<h3>Exam Details</h3>
				</div>
				<div class="col col-sm-12 col-lg-1 mt-3">
					<router-link to="/manageexams" class="btn btn-outline-danger">
						Back
					</router-link>
				</div>
			</div>
		</div>

		<div
			class="container card mt-3"
			v-for="(item, idx) in fetchSingleExamInfo"
			:key="idx"
		>
			<div class="card-body">
				<div class="row card-title">
					<div class="col col-sm-12 col-lg-6">
						<p>Exam Title: {{ item.examTitle }}</p>
					</div>
					<div class="col col-sm-12 col-lg-6">
						<p>Date Created: {{ item.dateCreated }}</p>
					</div>
				</div>
				<div
					class="card-text row"
					v-for="(question, idx) in item.examContent"
					:key="idx"
				>
					<div
						class="col col-lg-12"
						v-if="question.question_type == 'multiplechoice'"
					>
						<div class="card mb-3">
							<div class="card-body">
								<div class="card-title">
									Question No. {{ idx }} - {{ question.question }}
								</div>
								<div
									class="card-text"
									v-for="choice in question.choices"
									:key="choice.choice"
								>
									<p>{{ choice.choice }}: {{ choice.value }}</p>
								</div>
							</div>
						</div>
					</div>
					<div
						class="col col-lg-12"
						v-if="question.question_type == 'trueorfalse'"
					>
						<div class="card mb-3">
							<div class="card-body">
								<div class="card-title">
									Question No. {{ idx }} - {{ question.question }}
								</div>
								<div
									class="card-text"
									v-for="choice in question.choices"
									:key="choice.choice"
								>
									<p>{{ choice.choice }}</p>
								</div>
							</div>
						</div>
					</div>
					<div
						class="col col-lg-12"
						v-if="question.question_type == 'identification'"
					>
						<div class="card mb-3">
							<div class="card-body">
								<div class="card-title">
									Question No. {{ idx }} - {{ question.question }}
								</div>
								<div class="card-text">
									<p></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- card body -->
		</div>
		<!-- card container -->
	</div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
export default {
	setup() {
		const router = useRouter();
		const storeModule = useStore();
		let fetchSingleExamInfo = computed(
			() => storeModule.state.examModule.singleExam
		);
		let docIdparam = router.currentRoute.value.params.docid;

		onMounted([storeModule.dispatch("getSingleExamInfo", docIdparam)]);
		onUnmounted([storeModule.dispatch("clearSingleExamArr")]);

		return {
			fetchSingleExamInfo,
			docIdparam
		};
	}
};
</script>

<style></style>
