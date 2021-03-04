<template>
  <div>
  
    <div class="container mt-5">
        <div class="row">
            <button class="btn btn-primary" @click="addNewIdentificationQuestion()">Add Identification Question</button>
        </div>
    </div>

    </div>

</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
    setup() {

        let storeModule = useStore();
        let questionNumber = computed(() => storeModule.state.examModule.countOfItems)
        let uniqueNumbers = '';

        function addNewIdentificationQuestion() {
            uniqueNumbers = Math.floor(Math.random() * 1000000000)
            storeModule.dispatch('addQuestion', {uniqueId: 'idntf'+uniqueNumbers, question_type: "identification", question: "", userAnswer: "", answer: "" })
        }

        return {
            addNewIdentificationQuestion,
            questionNumber,
            uniqueNumbers
          
        }


    }
}
</script>

<style>

</style>

