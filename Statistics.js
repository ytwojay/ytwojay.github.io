BasicGame.Statistics = function (game) {
	this.music = null;
	this.text_style = {font: '30px kenvector_future', fill: 'white', align: 'center'};
};

BasicGame.Statistics.prototype = {
	preload: function() {
	var displayText = 1;
	var result2 = '';
	var result3 = '';
},
	
	create: function() {
		this.game.global_vars.showStatsBool = false;
		displayText = 1;
		var result = '';
		result2 = '';
		result3 = '';
		// calculate stats
		//this.game.global_vars.ansAddition = 7;
		//this.game.global_vars.askAddition = 9;
		var addStat = Phaser.Math.roundTo(this.game.global_vars.ansAddition*100/this.game.global_vars.askAddition,0);
		//var tempStat = 7/9;
		//var addStat = Phaser.Math.roundTo(tempStat*100,0,10);
		var subStat = Phaser.Math.roundTo(this.game.global_vars.ansSubtraction*100/this.game.global_vars.askSubtraction,0);
		var addthreeStat = Phaser.Math.roundTo(this.game.global_vars.ansAddthree*100/this.game.global_vars.askAddthree,0);
		var subthreeStat = Phaser.Math.roundTo(this.game.global_vars.ansSubthree*100/this.game.global_vars.askSubthree,0);
		var addmiddleStat = Phaser.Math.roundTo(this.game.global_vars.ansAddmiddle*100/this.game.global_vars.askAddmiddle,0);
		var submiddleStat = Phaser.Math.roundTo(this.game.global_vars.ansSubmiddle*100/this.game.global_vars.askSubmiddle,0);
		var lessStat = Phaser.Math.roundTo(this.game.global_vars.ansLess*100/this.game.global_vars.askLess,0);
		var greaterStat = Phaser.Math.roundTo(this.game.global_vars.ansGreater*100/this.game.global_vars.askGreater,0);
		var plusStat = Phaser.Math.roundTo(this.game.global_vars.ansPlus*100/this.game.global_vars.askPlus,0);
		var minusStat = Phaser.Math.roundTo(this.game.global_vars.ansMinus*100/this.game.global_vars.askMinus,0);
		var zeroStat = Phaser.Math.roundTo(this.game.global_vars.ansZero*100/this.game.global_vars.askZero,0);
		var tenStat = Phaser.Math.roundTo(this.game.global_vars.ansTen*100/this.game.global_vars.askTen,0);
		var totalAnswer = this.game.global_vars.ansEasy + this.game.global_vars.ansMedium + this.game.global_vars.ansHard;
		result += 'The student answered these types \nof questions with a success rate of: \n\n';
		result += 'Addition: ' + (addStat) + "%\n";
		result += 'Subtraction: ' + (subStat) + "%\n";
		result += 'Add/Subtract with missing number: ' + ((addmiddleStat+submiddleStat)/2) + "%\n";
		result += 'Comparisons: ' + ((lessStat+greaterStat)/2) + "%\n";
		result += 'Answering with operator(+/-): ' + ((plusStat+minusStat)/2) + "%\n";
		result += 'Working with the number zero: ' + (zeroStat) + "%\n";
		result += 'Working with the number ten: ' + (tenStat) + "%\n";
		
		result2 += 'Overall the student has a ';
		if (Phaser.Math.roundTo(this.game.global_vars.ansHard*100/totalAnswer,0) > 75) {
			result2 += 'Great';
		} else if (Phaser.Math.roundTo(this.game.global_vars.ansEasy*100/totalAnswer,0) > 85) {
			result2 += 'Poor';
		} else if (((Phaser.Math.roundTo(this.game.global_vars.ansHard*100/totalAnswer,0)+Phaser.Math.roundTo(this.game.global_vars.ansMedium*100/totalAnswer,0))/2) > 50) {
			result2 += 'Good';
		} else {
			result2 += 'Moderate';
		}
		result2 += '\ngrasp of first grade math. He/she excels\n';
		result2 += 'in the following categories:\n';
		if ((addthreeStat > 75) && (this.game.global_vars.askAddthree > 3)) {
			result2 += 'addition of three numbers\n';
		}
		if ((subthreeStat > 75) && (this.game.global_vars.askSubthree > 3)) {
			result2 += 'subtraction of three numbers\n';
		}
		if ((addmiddleStat > 75) && (this.game.global_vars.askAddmiddle > 3)) {
			result2 += 'addition with a missing number\n';
		}
		if ((submiddleStat > 75) && (this.game.global_vars.askSubmiddle > 3)) {
			result2 += 'subtraction with a missing number\n';
		}
		if ((greaterStat > 75) && (this.game.global_vars.askGreater > 3)) {
			result2 += 'conparison: greater than\n';
		}
		if ((lessStat > 75) && (this.game.global_vars.askLess > 3)) {
			result2 += 'conparison: less than\n';
		}
		if ((plusStat > 75) && (this.game.global_vars.askPlus > 3)) {
			result2 += 'answering with operator: plus (+)\n';
		}
		if ((minusStat > 75) && (this.game.global_vars.askMinus > 3)) {
			result2 += 'answering with operator: minus (-)\n';
		}
		if ((zeroStat > 75) && (this.game.global_vars.askZero > 3)) {
			result2 += 'working with the number zero\n';
		}
		if ((tenStat > 75) && (this.game.global_vars.askTen > 3)) {
			result2 += 'working with the number ten\n';
		}
		
		//result3
		result3 += 'The student could use improvement in\n the following areas:\n';
		if ((addthreeStat > 75) && (this.game.global_vars.askAddthree > 3)) {
			result3 += 'addition of three numbers\n';
		}
		if ((subthreeStat < 51) && (this.game.global_vars.askSubthree > 3)) {
			result3 += 'subtraction of three numbers\n';
		}
		if ((addmiddleStat < 51) && (this.game.global_vars.askAddmiddle > 3)) {
			result3 += 'addition with a missing number\n';
		}
		if ((submiddleStat < 51) && (this.game.global_vars.askSubmiddle > 3)) {
			result3 += 'subtraction with a missing number\n';
		}
		if ((greaterStat < 51) && (this.game.global_vars.askGreater > 3)) {
			result3 += 'conparison: greater than\n';
		}
		if ((lessStat < 51) && (this.game.global_vars.askLess > 3)) {
			result3 += 'conparison: less than\n';
		}
		if ((plusStat < 51) && (this.game.global_vars.askPlus > 3)) {
			result3 += 'answering with operator: plus (+)\n';
		}
		if ((minusStat < 51) && (this.game.global_vars.askMinus > 3)) {
			result3 += 'answering with operator: minus (-)\n';
		}
		if ((zeroStat < 51) && (this.game.global_vars.askZero > 3)) {
			result3 += 'working with the number zero\n';
		}
		if ((tenStat < 51) && (this.game.global_vars.askTen > 3)) {
			result3 += 'working with the number ten\n';
		}
		result3 += '\nNote: if no categories are listed, the\n student does not need help in \nany specific topics :)';
		//this.game.global_vars.text2 = result2;
		//console.log('Answered add: ' + this.game.global_vars.ansAddition + "/Asked add: " + this.game.global_vars.askAddition + " = " + addStat);
		
		this.scoreboard = this.game.add.group();
		this.scoreboard.add(this.game.add.sprite(0, 0, 'score_board'));
		var result_header = 'analysis';
		//result = 'resultoshid sdpfjsfg doifhj  \n psjdfpjsdfdfg \n sodfhg';
		var header = this.game.add.text(this.game.world.centerX, 130, result_header, {font: '60pt kenvector_future', fill: '#fff', align: 'center'});
		header.anchor.setTo(0.5, 0);
		var text = this.game.add.text(this.game.world.centerX, 240, result, this.text_style);
		text.anchor.setTo(0.5, 0);
		
		next_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.nextScreen, this, 3, 3, 4);
		next_button.anchor.setTo(0.5, 0.5);
		next_text = this.game.add.text(4, 0, 'Next', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
		next_text.anchor.setTo(0.5, 0.5);
		next_button.addChild(next_text);
			
		// Back to main menu
		/*var main_menu_button = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 20, 'yellow_buttons', this.backToMainMenu, this, 3, 3, 4);
		main_menu_button.anchor.setTo(0.5, 0.5);
		main_menu_button_text = this.game.add.text(2, 0, 'Main Menu', {font: '25px kenvector_future', fill: '#000', align: 'center'})
		main_menu_button_text.anchor.setTo(0.5, 0.5);
		main_menu_button.addChild(main_menu_button_text);*/
		
		
		this.scoreboard.add(next_button);
		this.scoreboard.add(header);
		this.scoreboard.add(text);
		// Delete saved game
		this.game.deleteSavedState();
	},
	
	update: function() {
	},
	
	nextScreen: function() {
		
		displayText += 1;
		if (displayText == 2) {
			this.scoreboard.add(this.game.add.sprite(0, 0, 'score_board'));
			var text = this.game.add.text(this.game.world.centerX, 240, result2, this.text_style);
			text.anchor.setTo(0.5, 0);
			next_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.nextScreen, this, 3, 3, 4);
			next_button.anchor.setTo(0.5, 0.5);
			next_text = this.game.add.text(4, 0, 'Next', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
			next_text.anchor.setTo(0.5, 0.5);
			next_button.addChild(next_text);
		} else if (displayText == 3) {
			this.game.add.sprite(0, 0, 'score_board');
			var text = this.game.add.text(this.game.world.centerX, 240, result3, this.text_style);
			text.anchor.setTo(0.5, 0);
			next_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.backToMainMenu, this, 3, 3, 4);
			next_button.anchor.setTo(0.5, 0.5);
			next_text = this.game.add.text(4, 0, 'Done', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
			next_text.anchor.setTo(0.5, 0.5);
			next_button.addChild(next_text);
		}

		
		
		/*next_button.destroy();
		this.scoreboard.add(this.game.add.sprite(0, 0, 'score_board'));*/
		/*result = '';
		result += 'Overall the student has a\n';
		if (Phaser.Math.roundTo(this.game.global_vars.ansHard*100/totalAnswer,0) > 75) {
			result += 'Great';
		} else if (Phaser.Math.roundTo(this.game.global_vars.ansEasy*100/totalAnswer,0) > 85) {
			result += 'Poor';
		} /*else if (((Phaser.Math.roundTo(this.game.global_vars.ansHard*100/totalAnswer,0)+Phaser.Math.roundTo(this.game.global_vars.ansMedium*100/totalAnswer,0))/2) > 50)
			result += 'Good';
		} else {
			result += 'Moderate';
		}*/
		/*result = this.game.global_vars.text2;
		var text = this.game.add.text(this.game.world.centerX, 290, result, this.text_style);
		text.anchor.setTo(0.5, 0);
		next_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.backToMainMenu, this, 3, 3, 4);
		next_button.anchor.setTo(0.5, 0.5);
		next_text = this.game.add.text(4, 0, 'Finish', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
		next_text.anchor.setTo(0.5, 0.5);
		next_button.addChild(next_text);*/
	},
	
	backToMainMenu: function() {
		//this.music.stop();
		// this.game.state.start('MainMenu');
		window.location.reload();
	}
};