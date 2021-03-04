<template>
  <div>
  
    <div class="container mt-5">
        <div class="row">
            <button class="btn btn-primary" @click="addNewMultipleQuestion()">Add Multiple Choice Question</button>
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

        function addNewMultipleQuestion() {
            uniqueNumbers = Math.floor(Math.random() * 1000000000)
            storeModule.dispatch('addQuestion', {uniqueId: 'mltchc'+uniqueNumbers, question_type: "multiplechoice", question: "", choices: [
                 {choice: 'A', value: ''},
                 {choice: 'B', value: ''},
                 {choice: 'C', value: ''},
                 {choice: 'D', value: ''}],
              answer: '' })
        }

        return {
            addNewMultipleQuestion,
            questionNumber,
            uniqueNumbers
          
        }


    }
}
</script>

<style>

</style>

