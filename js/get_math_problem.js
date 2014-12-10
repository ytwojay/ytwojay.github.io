/*********************************************************************************************
getMathProblem(string type, string difficulty): returns a math problem and its expected answer

accepted 'type':
	'add'
	'sub'
	
accepted 'difficulty':
	'easy'
	'hard'
	
Returns a JSON object. 

Usage:
	var math_problem = getMathProblem('add', 'easy');
	alert(math_problem.text); // Alerts the text problem
	alert(math_problem.answer); // Alerts the correct answer
**********************************************************************************************/
function getMathProblem(type, difficulty) {
	// Set some restrictions based on difficulty
	//console.log(difficulty);
	var min = 0;
	var max = 10;
			var first_num = randomIntFromInterval(1, max);
			var second_num = randomIntFromInterval(min, max);
	var third_num = 20;
	//var solution = 0;
	//var solution = first_num + second_num;
	var problem = '';
	var operator = '';
	var answer = 0;
	var cAddition = false;
	var cAddthree = false;
	var cSubtraction = false;
	var cSubthree = false;
	var cZero = false;
			
	if (type == 'addSolution') {
		operator = '+';
		cAddition = true;
		answer = first_num + second_num;
		if (difficulty == 'easy') { // Answer is 1~12, num1 and num2 are 1~10
			while((answer < 1) || (answer > 12)){
				first_num = randomIntFromInterval(1, max);
				second_num = randomIntFromInterval(min, max);
				answer = first_num + second_num;
			}
			if (second_num == 0) {
				cZero = true;
			}
			problem = first_num + ' ' + operator + ' ' + second_num;
			return {'text': problem + ' = ?', 'answer': answer, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cAddition': cAddition, 'cZero': cZero};
		} else if (difficulty == 'medium') {
			while((answer < 11) || (answer > 20)){ // Answer is 11~20, num1 and num2 are 1~10
					first_num = randomIntFromInterval(1, max);
					second_num = randomIntFromInterval(min, max);
					answer = first_num + second_num;
			}
			if (second_num == 0) {
				cZero = true;
			}
			problem = first_num + ' ' + operator + ' ' + second_num;
			return {'text': problem + ' = ?', 'answer': answer, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cAddition': cAddition, 'cZero': cZero};
		} else if (difficulty == 'hard') { // Add 3 numbers, total is 3~15 
			answer = first_num + second_num + third_num;
			while(answer > 15){
					first_num = randomIntFromInterval(2, 10);
					second_num = randomIntFromInterval(0, 10);
					third_num = randomIntFromInterval(1, 10);
					answer = first_num + second_num + third_num;
			}
			if (second_num == 0) {
				cZero = true;
			}
			cAddthree = true;
			problem = first_num + ' ' + operator + ' ' + second_num + ' ' + operator + ' ' + third_num;
			return {'text': problem + ' = ?', 'answer': answer, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cAddition': cAddition, 'cAddthree': cAddthree, 'cZero': cZero};
		} else {
			console.log('getMathProblem() -- invalid difficulty');
			return false;
		}
	}
	if (type == 'subSolution') {
		operator = '-';
		cSubtraction = true;
		answer = first_num - second_num;
		if (difficulty == 'easy') { // num1 - num2, num1 is 1~10, num2 is 0~9
			while(answer < 1) {
				first_num = randomIntFromInterval(1, 10);
				second_num = randomIntFromInterval(0, 9);
				answer = first_num - second_num;
			}
			if (second_num == 0) {
				cZero = true;
			}
			problem = first_num + ' ' + operator + ' ' + second_num;
			return {'text': problem + ' = ?', 'answer': answer, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction, 'cZero': cZero};
		} else if (difficulty == 'medium') { // num1 - num2, num1 is 11~20, num2 is 0~20
			first_num = randomIntFromInterval(11, 20);
			second_num = randomIntFromInterval(0, 20);
			answer = first_num - second_num;
			while(answer < 1) {
				first_num = randomIntFromInterval(11, 20);
				second_num = randomIntFromInterval(0, 20);
				answer = first_num - second_num;
			}
			if (second_num == 0) {
				cZero = true;
			}
			problem = first_num + ' ' + operator + ' ' + second_num;
			return {'text': problem + ' = ?', 'answer': answer, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction, 'cZero': cZero};
		} else if (difficulty == 'hard') { // num1 - num2 - num3, num1 is 0~15 (not 20 because the problems get too difficult), num2 is 0~10, and num3 is 0~5
			first_num = randomIntFromInterval(0, 15);
			second_num = randomIntFromInterval(0, 10);
			third_num = randomIntFromInterval(0, 5);
			answer = first_num - second_num - third_num;
			while(answer < 1) {
				first_num = randomIntFromInterval(4, 15);
				second_num = randomIntFromInterval(0, 10);
				third_num = randomIntFromInterval(0, 5);
				answer = first_num - second_num - third_num;
			}
			if ((second_num == 0) || (third_num == 0)){
				cZero = true;
			}
			cSubthree = true;
			problem = first_num + ' ' + operator + ' ' + second_num + ' ' + operator + ' ' + third_num;
			return {'text': problem + ' = ?', 'answer': answer, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction, 'cSubthree': cSubthree, 'cZero': cZero};
		} else {
			console.log('getMathProblem() -- invalid difficulty');
			return false;
		}
	}
	
	if (type == 'addMiddle') {
		operator = '+';
		cAddition = true;
		//answer = first_num + second_num;
		if (difficulty == 'easy') { // Answer is 1~12, num1 and num2 are 1~10
			while((answer < 1) || (answer > 12)){
				first_num = randomIntFromInterval(0, max);
				second_num = randomIntFromInterval(1, max);
				answer = first_num + second_num;
			}
			if (first_num == 0) {
				cZero = true;
			}
			problem = first_num + ' ' + operator + ' ? = ' + answer;
			return {'text': problem , 'answer': second_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cAddition': cAddition, 'cZero': cZero};
		} else if (difficulty == 'medium') {
			while((answer < 11) || (answer > 20)){ // Answer is 11~20, num1 and num2 are 1~10
					first_num = randomIntFromInterval(0, 12);
					second_num = randomIntFromInterval(1, 12);
					answer = first_num + second_num;
			}
			if (first_num == 0) {
				cZero = true;
			}
			problem = first_num + ' ' + operator + ' ? = ' + answer;
			return {'text': problem, 'answer': second_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cAddition': cAddition, 'cZero': cZero};
		} else if (difficulty == 'hard') { // Add 3 numbers, total is 3~15 
			while((answer > 14) || (answer < 3)){
					first_num = randomIntFromInterval(1, 10);
					second_num = randomIntFromInterval(0, 10);
					third_num = randomIntFromInterval(1, 10);
					answer = first_num + second_num + third_num;
			}
			if (second_num == 0) {
				cZero = true;
			}
			cAddthree = true;
			problem = first_num + ' + ' + second_num + ' + ? = ' + answer;
			return {'text': problem, 'answer': third_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cAddition': cAddition, 'cAddthree': cAddthree, 'cZero': cZero};
		} else {
			console.log('getMathProblem() -- invalid difficulty');
			return false;
		}
	}
	
	if (type == 'subMiddle') {
		operator = '-';
		cSubtraction = true;
		if (difficulty == 'easy') { // num1 - num2, num1 is 1~10, num2 is 0~9
			while(answer < 1) {
				first_num = randomIntFromInterval(1, 10);
				second_num = randomIntFromInterval(1, 9);
				answer = first_num - second_num;
			}
			problem = first_num + ' - ? = ' + answer;
			return {'text': problem, 'answer': second_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction};
		} else if (difficulty == 'medium') { // num1 - num2, num1 is 11~20, num2 is 0~20
			first_num = randomIntFromInterval(8, 16);
			second_num = randomIntFromInterval(1, 11);
			answer = first_num - second_num;
			while(answer < 1) {
				first_num = randomIntFromInterval(8, 16);
				second_num = randomIntFromInterval(1, 11);
				answer = first_num - second_num;
			}
			problem = first_num + ' - ? = '+ answer;
			return {'text': problem, 'answer': second_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction};
		} else if (difficulty == 'hard') { // num1 - num2 - num3, num1 is 0~15 (not 20 because the problems get too difficult), num2 is 0~10, and num3 is 0~5
			first_num = randomIntFromInterval(4, 14);
			second_num = randomIntFromInterval(0, 5);
			third_num = randomIntFromInterval(1, 5);
			answer = first_num - second_num - third_num;
			while(answer < 1) {
				first_num = randomIntFromInterval(4, 14);
				second_num = randomIntFromInterval(0, 5);
				third_num = randomIntFromInterval(1, 5);
				answer = first_num - second_num - third_num;
			}
			if (second_num == 0){
				cZero = true;
			}
			cSubthree = true;
			problem = first_num + ' - ' + second_num + ' - ? = ' + answer;
			return {'text': problem, 'answer': third_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction, 'cSubthree': cSubthree, 'cZero': cZero};
		} else {
			console.log('getMathProblem() -- invalid difficulty');
			return false;
		}
	}
	
	if (type == 'greaterLess') {
		if (difficulty == 'easy') { 			
			var first_num = randomIntFromInterval(0, 10);
			var second_num = randomIntFromInterval(0, 10);
			while (first_num == second_num) {
				first_num = randomIntFromInterval(0, 10);
				second_num = randomIntFromInterval(0, 10);
			}
			if (first_num < second_num) {
				operator = '<';
			} else {
				operator = '>';
			}
			problem = first_num + ' ? ' + second_num;
			return {'text': problem, 'answer': third_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator};
		}
		
		if (difficulty == 'medium') { 			
			var first_num = randomIntFromInterval(0, 20);
			var second_num = randomIntFromInterval(0, 20);
			while (first_num == second_num) {
				first_num = randomIntFromInterval(0, 20);
				second_num = randomIntFromInterval(0, 20);
			}
			if (first_num < second_num) {
				operator = '<';
			} else {
				operator = '>';
			}
			problem = first_num + ' ? ' + second_num;
			return {'text': problem, 'answer': third_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator};
		}
		
		if (difficulty == 'hard') { 			
			var first_num = randomIntFromInterval(11, 20);
			var second_num = randomIntFromInterval(11, 20);
			while (first_num == second_num) {
				first_num = randomIntFromInterval(11, 20);
				second_num = randomIntFromInterval(11, 20);
			}
			if (first_num < second_num) {
				operator = '<';
			} else {
				operator = '>';
			}
			problem = first_num + ' ? ' + second_num;
			return {'text': problem, 'answer': third_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator};
		}
		
		
		/*var random_operator = randomIntFromInterval(1, 2);
		if (random_operator == 1) { // Greater than
			if (difficulty == 'easy') { 			
				var first_num = randomIntFromInterval(0, 10);
				var second_num = randomIntFromInterval(0, 10);
				while (first_num == second_num) {
					var first_num = randomIntFromInterval(0, 10);
					var second_num = randomIntFromInterval(0, 10);
				}
				problem = first_num + ' - ? = ' + answer;
				return {'text': problem, 'answer': second_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction};
			} else if (difficulty == 'medium') { // num1 - num2, num1 is 11~20, num2 is 0~20
				problem = first_num + ' - ? = '+ answer;
				return {'text': problem, 'answer': second_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction};
			} else if (difficulty == 'hard') { // num1 - num2 - num3, num1 is 0~15 (not 20 because the problems get too difficult), num2 is 0~10, and num3 is 0~5
				problem = first_num + ' - ' + second_num + ' - ? = ' + answer;
				return {'text': problem, 'answer': third_num, 'first_num': first_num, 'second_num': second_num, 'operator': operator, 'cSubtraction': cSubtraction, 'cSubthree': cSubthree, 'cZero': cZero};
			} else {
				console.log('getMathProblem() -- invalid difficulty');
				return false;
			}
			type = 'add';
		} else { // Less than
			type = 'sub';
		}*/
	}
	
	
	if (type == 'mix') {
		var random_operator = randomIntFromInterval(1, 2);
		if (random_operator == 1) {
			type = 'add';
		} else {
			type = 'sub';
		}
	}
	
	if (type == 'add') {
		operator = '+';
		answer = first_num + second_num;
	} else if (type == 'addSolution') {
		console.log('Hooray!');
		//operator = '+';
		//answer = first_num + second_num;
	} else if (type == 'sub') {
		if (first_num < second_num) {
			temp = first_num;
			first_num = second_num;
			second_num = temp;
			answer = second_num - first_num;
		}
		
		operator = '-';
		answer = first_num - second_num;
	} else {
		console.log('getMathProblem() -- invalid type');
		return false;
	}
	// example: problem = "3 + 4"
	// problem.text = "3 + 4 = ?"
	return {'text': problem + ' = ?', 'answer': answer, 'first_num': first_num, 'second_num': second_num, 'operator': operator};
}



function randomIntFromInterval(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}