BasicGame.CollectGame = function (game) {
	this.state_label = 'CollectGame';
	this.current_level = 1;
	this.level_images = [];
	this.level_images[1] = {
		//'background': 'sky',
		'background': 'bg_desert',
		'tilemap': '',
		'tileset': ''
	};
	this.text_style = {font: '65px kenvector_future', fill: 'white', align: 'center'};
	this.instructions = null;
	this.scoreboard = null;
	this.score = 0;
	this.score_text = null;
	this.high_score = 0;
	this.level_text = null;
	this.background = null;
	this.started = false;
	this.background_layer = null;
	this.move_button_group = null;
	this.ui_layer = null;
	this.problem_text = null;
	this.answer = 0;
	this.boulders = null;
	this.zizo = null;
	this.gametime = 0;
	this.numCollected = 0;
	this.win_sound = null;	
	this.inputActive = false;
	this.difficulty_text = null;
	//this.boulder_text = null;
	this.lastBoulderPosition = 0;
	this.lastBoulderValue = 0;
	this.diff_level = null;
	// local category booleans
	this.lcAddition = false;
	this.lcAddthree = false;
	this.lcSubtraction = false;
	this.lcSubthree = false;
	this.lcSubmiddle = false;
	this.lcZero = false;
	this.lcTen = false;
	this.lastAnswer = 0;
};

BasicGame.CollectGame.prototype = {
	preload: function() {
		this.game.load.image('gun', 'assets/boss_game/gun.png');
		this.game.load.image('zcar', 'assets/collect_game/zcar.png');
		this.game.load.image('arrowUp', 'assets/collect_game/arrowUp.png');
		this.game.load.image('arrowDown', 'assets/collect_game/arrowDown.png');
		this.game.load.image('boulder', 'assets/collect_game/boulder.png');
		
		if ($.cookie('collect_high_score') != null && $.cookie('collect_high_score') != '') {
			this.high_score = $.cookie('collect_high_score');
		}
	},

	create: function() {
		console.log('Collect game');
		this.background_music = this.game.add.audio('boss_background_music');
		this.right_answer_sound = this.game.add.audio('right_answer_sound');
		this.wrong_answer_sound = this.game.add.audio('wrong_answer_sound');
		this.win_sound = this.game.add.audio('win_sound');
		
		// Manage Layers
		this.background_layer = this.game.add.group();
		this.background_layer.z = 0;

		// move button group
		this.move_button_group = this.game.add.group();
		this.move_button_group.z = 1;
		
		this.up_button = this.game.add.sprite(50, 175, 'arrowUp');
		this.up_button.inputEnabled = true;
		
		this.down_button = this.game.add.sprite(50, 425, 'arrowDown');
		this.down_button.inputEnabled = true;
		
		this.game.input.onDown.add(this.activeInput, this);
        this.game.input.onUp.add(this.releaseInput, this);
				
		// Pause button / ui group
		this.ui_layer = this.game.add.group();
		this.ui_layer.z = 2;
		// Create rock group
		this.boulders = this.game.add.group();
		
		this.background_music = this.game.add.audio('desert_background_music');
		
		// Score display
		this.score_text = this.game.add.text(this.game.width - 145, 9, this.score + '', this.text_style);
		this.score_text.anchor.setTo(1, 0);
		this.ui_layer.add(this.score_text);

		// Create zcar
		this.zcar = this.game.add.sprite(337, 443, 'zcar');
		this.zcar.anchor.setTo(.5, 1);
		
		// Instructions
		this.instructions = this.game.add.sprite(0, 0, 'collect_instructions');
		
		this.start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 90, 'yellow_buttons', this.killInstructions, this, 3, 3, 4);
		this.start_button.alpha = 0;
		this.start_button.anchor.setTo(0.5, 0.5);
		this.start_text = this.game.add.text(4, 0, 'START', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
		this.start_text.anchor.setTo(0.5, 0.5);
		this.start_button.addChild(this.start_text);
		
		// Initialize scoreboard
		this.scoreboard = this.game.add.group();
		
		var instruction_audio = this.game.add.audio('collect_instruction_sound');
		instruction_audio.onStop.add(function(){
			this.game.add.tween(this.start_button).to({alpha: 1}, 500, null, true);
		}, this);
		instruction_audio.play();
		
		if (this.game.global_vars.diff_score < 5) {
			this.diff_level = 'easy';
		}
		else if (this.game.global_vars.diff_score < 10) {
			this.diff_level = 'medium';
		}
		else {
			this.diff_level = 'hard';
		}
	},
	
	activeInput: function() {
		this.inputActive = true;
	},
	
	releaseInput: function() {
		this.inputActive = false;
	},
	
	killInstructions: function() {
		this.start_button.destroy();
		this.instructions.destroy();
		this.startLevel();
	},

	update: function() {
		if (!this.started) {
			return;
		}
		if (this.inputActive) {
			if (this.up_button.input.pointerOver()) {
				//this.zcar.body.velocity.y = 200;
				this.zcar.y -= 5;
				if (this.zcar.y <= 230) {
					this.zcar.y = 230;
				}
			}
			if (this.down_button.input.pointerOver()) {
				//this.zcar.body.velocity.y = 200;
				this.zcar.y += 5;
				if (this.zcar.y >= 700) {
					this.zcar.y = 700;
				}
			}
		}
		this.gametime = this.gametime+1;
		if (this.gametime >= 150) {
			this.gametime = this.gametime-150;
			this.generateBoulder();
		}
		this.game.physics.overlap(this.zcar, this.boulders, this.touchBoulder, null, this);
		
		if (this.numCollected == 10) {
			this.winLevel();
		}
	},
	
	generateBoulder: function() {
		boulderPos = this.game.rnd.integerInRange(2, 7)
		while (boulderPos == this.lastBoulderPosition) {
			boulderPos = this.game.rnd.integerInRange(2, 7)
		}
		this.lastBoulderPosition = boulderPos;
		boulder = this.boulders.create(1220, 100*boulderPos, 'boulder');
		if (this.diff_level == 'easy') {
			boulder.body.gravity.x = -80;
		} else if (this.diff_level == 'medium') {
			boulder.body.gravity.x = -100;
		} else {
			boulder.body.gravity.x = -130;
		}
		boulder.anchor.setTo(0,0);
		// 1 in 4 change of generating the right answer
		boulderrnd = this.game.rnd.integerInRange(1, 5);
		//console.log('boulderrnd' + boulderrnd);
		if ((boulderrnd == 2) || (boulderrnd == 5)) {
			boulderVal = this.answer;
		}
		else {
			boulderVal = this.game.rnd.integerInRange(1, 20);
		}
		while (boulderVal == this.lastBoulderValue) {
			boulderVal = this.game.rnd.integerInRange(1, 20);
		}
		this.lastBoulderValue = boulderVal;
		boulder_text = this.game.add.text(15, 15, boulderVal, {font: '40px kenvector_future', fill: '#fff', align: 'center'});
		boulder.value = boulderVal;
		boulder_text.anchor.setTo(0, 0);
		boulder.addChild(boulder_text);
	},
	
	/*reset: function() {
		this.zcar.x = 337;
		this.started = false;
		this.boulders.destroy();
		this.boulders = this.game.add.group();
	},*/
	
	startLevel: function() {
		this.scoreboard.destroy();
		
		/*if (this.game.global_vars.load_saved_state) {
			this.current_level = this.game.global_vars.saved_level;
			this.game.global_vars.load_saved_state = false;
		}*/
		
		// Load level specific things
		this.background = this.game.add.sprite(0, 0, this.level_images[this.current_level]['background']);
		this.background_layer.add(this.background);
		this.difficulty_text = this.game.add.text(80, 10, 'Difficulty ' + this.game.global_vars.diff_score + ' ' + this.diff_level, {font: '20px kenvector_future', fill: '#fff'});
		this.background_music.play();
		//this.started = false;
		//this.boulders = this.game.add.group();
		//this.startRace();
		this.started = true;
		this.displayNewProblem();
		// commented out to test 10/17
		//this.background_music.play(0,0,1,true);
	},

	startRace: function() {
		this.started = true;
		this.displayNewProblem();
		// commented out to test 10/17
		//this.background_music.play(0,0,1,true);
	},

	displayNewProblem: function() {
		var typeProb = randomIntFromInterval(1, 3);
		if (typeProb == 1) {
			var problem = this.game.getMathProblem('addSolution', this.diff_level);
		} else if (typeProb == 2) {
			var problem = this.game.getMathProblem('subSolution', this.diff_level);
		} else {
			var problem = this.game.getMathProblem('subMiddle', this.diff_level);
		}
		while (this.lastAnswer == problem.answer) {
			var typeProb = randomIntFromInterval(1, 3);
			if (typeProb == 1) {
				var problem = this.game.getMathProblem('addSolution', this.diff_level);
			} else if (typeProb == 2) {
				var problem = this.game.getMathProblem('subSolution', this.diff_level);
			} else {
				var problem = this.game.getMathProblem('subMiddle', this.diff_level);
			}
		}
		this.answer = problem.answer;
		this.lastAnswer = problem.answer;
		
		if (problem.cAddition == true) {
			this.lcAddition = true;
		}
		if (problem.cAddthree == true) {
			this.lcAddthree = true;
		}
		if (problem.cSubmiddle == true) {
			this.lcSubmiddle = true;
		}
		if (problem.cSubtraction == true) {
			this.lcSubtraction = true;
		}
		if (problem.cSubthree == true) {
			this.lcSubthree = true;
		}
		if (problem.cZero == true) {
			this.lcZero = true;
		}
		if (problem.cTen == true) {
			this.lcTen = true;
		}
		
		if (this.problem_background == null || !this.problem_background.exists) {
			this.problem_background = this.game.add.sprite(this.game.world.centerX, 15, 'q_bg2');
			this.problem_background.anchor.setTo(0.5, 0);
			this.problem_background.alpha = 0.65;
		}
		if (this.problem_text == null || !this.problem_text.exists) {
			this.problem_text = this.game.add.text(this.game.world.centerX, 65, problem.text, {font: '40px kenvector_future', fill: '#fff'});
			this.problem_text.anchor.setTo(0.5, 0.5);
		} else {
			this.problem_text.setText(problem.text);
		}
	},
	
	moveUp: function() {
		this.zcar.body.velocity.y = 200;
	},
	
	moveDown: function() {
		this.zcar.body.velocity.y = -200;
	},

	checkAnswer: function(answer) {
		//console.log('checking: ' + answer + " and " + this.answer);
		if (this.lcAddition == true){
			this.game.global_vars.askAddition += 1;
		}
		if (this.lcAddthree == true){
			this.game.global_vars.askAddthree += 1;
		}
		if (this.lcSubmiddle == true){
			this.game.global_vars.askSubmiddle += 1;
		}
		if (this.lcSubtraction == true) {
			this.game.global_vars.askSubtraction +=1;
		}
		if (this.lcSubthree == true) {
			this.game.global_vars.askSubthree +=1;
		}
		if (this.lcZero == true) {
			this.game.global_vars.askZero +=1;
		}
		if (this.lcTen == true) {
			this.game.global_vars.askTen +=1;
		}
		
		if (this.answer == answer) {
			this.right_answer_sound.play();
			this.game.global_vars.diff_score += 1;
			if (this.game.global_vars.diff_score > 15) {
				this.game.global_vars.diff_score = 15;
			}
			this.numCollected += 1;
			// if the correct answer was entered, increment all the ans* category vars and the difficulty vars
			if (this.lcAddition == true){
				this.game.global_vars.ansAddition += 1;
			}
			if (this.lcAddthree == true){
				this.game.global_vars.ansAddthree += 1;
			}
			if (this.lcSubmiddle == true){
				this.game.global_vars.ansSubmiddle += 1;
			}
			if (this.lcSubtraction == true) {
				this.game.global_vars.ansSubtraction += 1;
			}
			if (this.lcSubthree == true) {
				this.game.global_vars.ansSubthree += 1;
			}
			if (this.lcZero == true) {
				this.game.global_vars.ansZero += 1;
			}
			if (this.lcTen == true) {
				this.game.global_vars.ansTen += 1;
			}
			if (this.diff_level == 'easy') {
				this.game.global_vars.ansEasy += 1;
				this.score += 75;
			}
			if (this.diff_level == 'medium') {
				this.game.global_vars.ansMedium += 1;
				this.score += 100;
			}
			if (this.diff_level == 'hard') {
				this.game.global_vars.ansHard += 1;
				this.score += 150;
			}
		} else {
			this.wrong_answer_sound.play();
			this.game.global_vars.diff_score -= 2;
			if (this.game.global_vars.diff_score < 0) {
				this.game.global_vars.diff_score = 0;
			}
			//this.displayNewProblem();
			this.score -= 30;
			if (this.score < 0) {
				this.score = 0;
			}
		}
		/*if (this.answer != answer){
			this.wrong_answer_sound.play();
			this.game.global_vars.diff_score -= 1;
			if (this.game.global_vars.diff_score < 0) {
				this.game.global_vars.diff_score = 0;
			}
			this.displayNewProblem();
			this.score -= 30;
			if (this.score < 0) {
				this.score = 0;
			}
		}
		if (this.answer == answer) {
			this.right_answer_sound.play();
			this.displayNewProblem();
			this.game.global_vars.diff_score += 1;
			this.score += 100;
			this.numCollected += 1;
		}*/
		
		// reset local category booleans
		this.lcAddition = false;
		this.lcAddthree = false;
		this.lcSubmiddle = false;
		this.lcSubtraction = false;
		this.lcSubthree = false;
		this.lcZero = false;
		this.lcTen = false;
		
		console.log('askAddition: ' + this.game.global_vars.askAddition + ' Answered: ' + this.game.global_vars.ansAddition);
		console.log('askAddthree: ' + this.game.global_vars.askAddthree + ' Answered: ' + this.game.global_vars.ansAddthree);
		console.log('askSubmiddle: ' + this.game.global_vars.askSubmiddle + ' Answered: ' + this.game.global_vars.ansSubmiddle);
		console.log('askSubtraction: ' + this.game.global_vars.askSubtraction + ' Answered: ' + this.game.global_vars.ansSubtraction);
		console.log('askSubthree: ' + this.game.global_vars.askSubthree + ' Answered: ' + this.game.global_vars.ansSubthree);
		console.log('askZero: ' + this.game.global_vars.askZero + ' Answered: ' + this.game.global_vars.ansZero);
		console.log('askTen: ' + this.game.global_vars.askTen + ' Answered: ' + this.game.global_vars.ansTen);
		console.log('ansEasy: ' + this.game.global_vars.ansEasy);
		console.log('ansMedium: ' + this.game.global_vars.ansMedium);
		console.log('ansHard: ' + this.game.global_vars.ansHard);
		
		if (this.game.global_vars.diff_score < 5) {
			this.diff_level = 'easy';
		}
		else if (this.game.global_vars.diff_score < 10) {
			this.diff_level = 'medium';
		}
		else {
			this.diff_level = 'hard';
		}
		
		this.difficulty_text.destroy();
		this.difficulty_text = this.game.add.text(80, 10, 'Difficulty ' + this.game.global_vars.diff_score, {font: '20px kenvector_future', fill: '#fff'});		
		this.score_text.setText(this.score);
		this.displayNewProblem();
	},

	winLevel: function() {
		this.started = false;
		this.zcar.body.velocity.x = 0;
		this.background_music.stop();
		this.win_sound.play();
		this.showScoreboard(true);
	},

	touchBoulder: function(zcar, boulder) {
		/*if (!this.started) {
			return;
		}*/
		// This is so collision seems better towards the back of the car
		if (boulder.x > 250) {
			this.checkAnswer(boulder.value);
			boulder.destroy();
		}
	},
	
	showScoreboard: function(win) {
		this.scoreboard = this.game.add.group();
		
		this.scoreboard.add(this.game.add.sprite(0, 0, 'score_board'));
		var start_button = null;
		
		var new_pr = false;
		if (this.score > this.high_score) {
			new_pr = true;
			$.cookie('collect_high_score', this.score);
			this.high_score = this.score;
		}
		
		/*if (!this.game.global_vars.story_mode) {
			start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.backToMainMenu, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'Menu', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		}  else {*/
			start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.winGame, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'Next', {font: '20pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		//}
		
		result = 'Score:\n' + this.score + '\n';
		if (new_pr) {
			result += '**NEW**'
		}
		result += ' High Score:\n' + this.high_score;
		var header = this.game.add.text(this.game.world.centerX, 130, 'FINISHED!', {font: '75pt kenvector_future', fill: '#fff', align: 'center'});
		header.anchor.setTo(0.5, 0);
		var text = this.game.add.text(this.game.world.centerX, 290, result, this.text_style);
		text.anchor.setTo(0.5, 0);
		
		this.scoreboard.add(text);
		this.scoreboard.add(start_button);
		this.scoreboard.add(header);
	},

	/*endRace: function() {
		this.started = false;
		//this.problem_text.destroy();

		this.zcar.body.velocity.x = 0;
		this.background_music.stop();
		//this.opponents.setAll('body.velocity.x', 0);
		//this.opponents.callAll('play', null, 'wait');
	},*/


	winGame: function() {
		//console.log('Won horse game!');
		this.current_level = 1;

		// Unlock this mini game
		this.game.unlockMiniGame(this.state_label);
		this.game.goToNextState.call(this);
	}
	
	/*backToMainMenu: function() {
		this.game.state.start('MainMenu');
	}*/
	
	/*shutdown: function() {
		console.log('shutdown');
		console.log(this.zcar.body.velocity.x);
	}*/
};