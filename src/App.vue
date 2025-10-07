<script setup lang="ts">
import { ref } from 'vue';
import { Calculator } from './components/calculator.ts';

// Создаём реактивную переменную
const expression = ref('0');  // Пустая строка изначально
const past_expression = ref('');
const calculator = new Calculator();
const operators = ['+', '-', '*', '/'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const deleteCharSymbol = '⌫';
const deleteAllSymbol = 'AC';
let caculated = false
let deleteButton = ref(deleteAllSymbol)


const getCurrentNumber = () => {
  let currentNumber:string = "";
    for (let i = expression.value.length - 1; i >= 0; i--) {
      if (expression.value[i] === '.' || numbers.includes(expression.value[i]!)) {
        currentNumber += expression.value[i];
      } else {
        break;
      }
    }
  const reversed = currentNumber.split('').reverse().join('');
  currentNumber = reversed

  return currentNumber
}


const addToExpression = (value: string) => {
  if (expression.value === '0' && expression.value.length === 1) {
    expression.value = '';
    deleteButton.value = deleteCharSymbol;
  }
  
  if (caculated) {
    expression.value = '';
    past_expression.value = '';
    caculated = false;
  }

  if (operators.includes(value) && operators.includes(expression.value.slice(-1))) {
    expression.value = expression.value.slice(0, -1);
    return
  }
  if (value === '.' && !operators.includes(expression.value.slice(-1))) {
    let currentNumber = getCurrentNumber();
    console.log(currentNumber);
    if (currentNumber.split('.').length > 1) {
      return
    }
    expression.value += '.'

    return
  }
  if (value === '.' && operators.includes(expression.value.slice(-1))) {
    expression.value += '0.'
    return
  }
  if (value === '.' && expression.value.length === 0) {
    expression.value += '0'
    return
  }

  if (numbers.includes(value) && expression.value[expression.value.length - 1] === ')') {
    expression.value += "*";
    expression.value += value;
    return
  }

  if (value === "(" && numbers.includes(expression.value.slice(-1))) {
    expression.value += "*(";
    return
  }

  
  expression.value += value;

  if (numbers.includes(expression.value.slice(-1))){
    // TO-DO форматировать по 3 цифры
  }
  
}

const deleteLast = () => {
  if (expression.value.length === 1 && expression.value === '0'){
    deleteButton.value = deleteAllSymbol;
    return
  }

  if (expression.value.length === 0) {
    past_expression.value = '';
    expression.value = '0';
    deleteButton.value = deleteAllSymbol;
    return
  }
  expression.value = expression.value.slice(0, -1); 
}

const calculate = () => {
  try {
    let result: number = calculator.calculate(expression.value);
    console.log(result);
    caculated = true;
    past_expression.value = expression.value;
    expression.value = result.toString();
  } catch (error: any) {
    past_expression.value = expression.value;
    expression.value = 'Ошибка';
    
    setTimeout(() => {
      expression.value = '0';
      past_expression.value = '';
      deleteButton.value = deleteAllSymbol;
    }, 1500);
  }
}




</script>

<template>
  <div>
    <h1>Калькулятор</h1>
  </div>
  <div class="main_window">
    <div class="secondary_display">
      {{ past_expression }}
    </div>
    <div class="display">
      {{ expression }}
    </div>
    <div class="buttons">
      
      <div class="buttons_row" id="first_row">
        <div class="button" id="clear" @click="deleteLast">{{deleteButton }}</div>
        <div class="button" @click="addToExpression('(')">(</div>
        <div class="button" @click="addToExpression(')')">)</div> 
        <div class="button" id="divide" @click="addToExpression('/')">/</div>
      </div>

      <div class="buttons_row" id="second_row">
        <div class="button" id="seven" @click="addToExpression('7')">7</div>
        <div class="button" id="eight" @click="addToExpression('8')">8</div>
        <div class="button" id="nine" @click="addToExpression('9')" >9</div>
        <div class="button" id="multiply" @click="addToExpression('*')">*</div>
      </div>

      <div class="buttons_row" id="third_row">
        <div class="button" id="four" @click="addToExpression('4')" >4</div>
        <div class="button" id="five" @click="addToExpression('5')" >5</div>
        <div class="button" id="six" @click="addToExpression('6')" >6</div>
        <div class="button" id="subtract" @click="addToExpression('-')" >-</div>
      </div>

      <div class="buttons_row" id="fourth_row">
        <div class="button" id="one" @click="addToExpression('1')" >1</div>
        <div class="button" id="two"  @click="addToExpression('2')">2</div>
        <div class="button" id="three"  @click="addToExpression('3')">3</div>
        <div class="button" id="add"  @click="addToExpression('+')">+</div>
      </div>

      <div class="buttons_row" id="fifth_row">
        <div class="button" id="zero"  @click="addToExpression('0')">0</div>
        <div class="button" id="decimal" @click="addToExpression('.')" >.</div>
        <div class="button" id="equals" @click="calculate()">=</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_window {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.display {
  width: 100%;
  height: 50px;
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: right;
  font-size: 24px;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
}
.secondary_display {
  width: 100%;
  height: 25px;
  border-radius: 5px;
  text-align: right;
  font-size: 16px;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
}

.buttons{
  display: block;
  width: 100%;
}

.buttons_row{
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  
}


#zero {
  width: 50% !important;
}

#divide,
#multiply,
#subtract,
#add,
#equals
 {
  background-color: orange;
}
#clear,
#negative,
#percent {
  background-color: gray;
}

.button {
  width: 25%;
  height: 40px;
  background-color: #2c2c2c;
  border-radius: 50px;
  color: #fff;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 5px;
  transition: background-color 0.3s ease;
}
.button:hover {
  background-color: rgb(199, 199, 199) !important;
}




</style>