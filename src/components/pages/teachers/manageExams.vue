<template>
	<div>
		<div class="container mt-4">
			<div class="row">
				<div class="col col-sm-12 col-lg-10">
					<h3>Manage Exams</h3>
				</div>
				<div class="col col-sm-12 col-lg-2">
					<router-link to="/createexam" class="btn btn-outline-primary">
						Create Exam
					</router-link>
				</div>
			</div>
			<br />
			<div class="row">
				<div
					class="col col-sm-12"
					v-if="fetchExamByTeacherEmail.length != 0"
				>
					<table class="table">
						<thead>
							<tr scope="col">
								<th>Exam Code</th>
								<th>Date Created</th>
								<th>Exam Title</th>
								<th colspan="3">Options</th>
							</tr>
						</thead>
						<tbody>
							<tr
								scope="row"
								v-for="singleExam in fetchExamByTeacherEmail"
								:key="singleExam.id"
							>
								<td>{{ singleExam.userInfo.exam_code }}</td>
								<td>{{ singleExam.userInfo.dateCreated }}</td>
								<td>{{ singleExam.userInfo.examTitle }}</td>
								<td>
									<router-link
										:to="{
											name: 'ViewExamInfo',
											params: { docid: singleExam.id }
										}"
										class="btn btn-outline-primary"
									>
										View
									</router-link>
								</td>
								<td>
									<router-link
										:to="{
											name: 'EditExamInfo',
											params: { docid: singleExam.id }
										}"
										class="btn btn-outline-secondary"
									>
										Edit
									</router-link>
								</td>
								<td>
									<a
										@click="deleteExamDetails(singleExam.id)"
										class="btn btn-outline-danger"
									>
										Remove
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div
					class="col col-sm-12"
					v-if="fetchExamByTeacherEmail.length === 0"
				>
					<h3 class="alert alert-secondary">No Exams</h3>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
export default {
	setup() {
		const storeModule = useStore();

		const fetchExamByTeacherEmail = computed(
			() => storeModule.state.examModule.examList
		);
		const getEmail = computed(() => storeModule.state.authModule.user_email);

		let fetchExamByEmail = {
			field: "teacher_email",
			value: getEmail.value
		};

		function deleteExamDetails(uniqueId) {
			if (confirm("Are you sure to remove this exam?")) {
				storeModule.dispatch("removeExam", uniqueId);
			}

			storeModule.dispatch("fetchAllExamsInTeacher", fetchExamByEmail);
		}

		onMounted([
			storeModule.dispatch("fetchAllExamsInTeacher", fetchExamByEmail)
		]);

		return { fetchExamByTeacherEmail, getEmail, deleteExamDetails };
	}
};
</script>

<style></style>
