<template>
	<div>
		<!-- modal -->
		<div
			class="modal fade"
			id="modalShowExamResult"
			tabindex="-1"
			aria-labelledby="modalSubmitExamResult"
			aria-hidden="true"
		>
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="modalShowExamResultLabel">
							Grade Info
						</h5>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div
						class="modal-body"
						v-if="fetchGradesOfRequestedExam != null"
					>
						<p v-if="fetchGradesOfRequestedExam[1].stud_name != null">
							Name:
							{{ fetchGradesOfRequestedExam[1].stud_name }}
						</p>
						<hr />
						<p>
							Correct Items:
							{{ fetchGradesOfRequestedExam[0].correct_items }}
						</p>
						<hr />
						<p>
							Wrong Items:
							{{ fetchGradesOfRequestedExam[0].wrong_items }}
						</p>
						<hr />
						<p>
							Total items:
							{{ fetchGradesOfRequestedExam[0].total_items }}
						</p>
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
					</div>
				</div>
			</div>
		</div>
		<!-- end modal -->
	</div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
export default {
	setup() {
		const storeModule = useStore();

		const fetchGradesOfRequestedExam = computed(
			() => storeModule.state.examModule.listSingleExamResult
		);

		let nameAndReqId = {
			name: "",
			requestId: ""
		};

		onMounted([storeModule.dispatch("fetchExamResultByReqId", nameAndReqId)]);

		return { fetchGradesOfRequestedExam };
	}
};
</script>

<style></style>
