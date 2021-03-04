<template>
	<div>
		<div class="container mt-5">
			<div class="row mb-5">
				<div class="col col-sm-12 col-lg-10">
					<h3>Exam List</h3>
				</div>
				<div class="col col-sm-12 col-lg-2">
					<router-link to="/createexam" class="btn btn-outline-primary">
						Add Exam
					</router-link>
				</div>
			</div>
			<div class="row alert alert-success" v-show="queryMessage">
				{{ queryMessage }}
			</div>
			<div class="row alert alert-secondary" v-if="examInfo.length == 0">
				<h5>No Exams</h5>
			</div>
			<div class="row" v-else>
				<table class="table table-bordered">
					<tr>
						<th>Date Created</th>
						<th>Exam Title</th>
						<th colspan="3">Options</th>
					</tr>
					<tr v-for="row in examInfo" :key="row.id">
						<td>{{ row.examInfo[0].dateCreated }}</td>
						<td>{{ row.examInfo[0].examTitle }}</td>
						<td>
							<router-link
								:to="{
									name: 'ViewExamInfo',
									params: { docid: row.id }
								}"
								class="btn btn-outline-primary"
							>
								View
							</router-link>
						</td>
						<td>
							<button
								class="btn btn-outline-danger"
								@click="deleteExamDetails(row.id)"
							>
								Delete
							</button>
						</td>
					</tr>
				</table>

				{{ route }}
			</div>
		</div>
	</div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
export default {
	setup() {
		let storeModule = useStore();
		const route = useRoute();
		let examInfo = computed(() => storeModule.state.examModule.examList);

		const queryMessage = computed(
			() => storeModule.state.examModule.queryMessage
		);

		function deleteExamDetails(uniqueId) {
			if (confirm("Are you sure to remove this exam?")) {
				storeModule.dispatch("removeExam", uniqueId);
			}
		}

		onMounted([storeModule.dispatch("getSingleExamInfo")]);
		onUnmounted([storeModule.dispatch("clearQueryMessage")]);

		return { examInfo, deleteExamDetails, queryMessage, route };
	}
};
</script>

<style></style>
