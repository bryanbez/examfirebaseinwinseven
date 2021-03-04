<template>
  <div>
  
    <div class="container mt-5">
        <div class="row">
            <button class="btn btn-primary" @click="addNewTrueFalseQuestion()">Add True Or False Question</button>
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

        function addNewTrueFalseQuestion() {
            uniqueNumbers = Math.floor(Math.random() * 1000000000)
            storeModule.dispatch('addQuestion', {uniqueId: 'trufls'+uniqueNumbers, question_type: "trueorfalse", question: "", choices: [
                 {choice: 'TRUE', value: 'true'},
                 {choice: 'FALSE', value: 'false'}],
             answer: '' })
        }

        return {
            addNewTrueFalseQuestion,
            questionNumber, 
            uniqueNumbers
        }
    }
}
</script>

<style>

</style>

