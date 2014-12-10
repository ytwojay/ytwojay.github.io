BasicGame.HorseGame = function (game) {
	this.state_label = 'HorseGame';
	this.current_level = 1;
	
	this.level_images = [];
	
	this.level_images[1] = {
		'background': 'bg_marsh',
		'tilemap': '',
		'tileset': ''
	};
	
	this.level_images[2] = {
		'background': 'bg_green2',
		'tilemap': '',
		'tileset': ''
	};
	
	this.level_images[3] = {
		'background': 'bg_green3',
		'tilemap': '',
		'tileset': ''
	};
	
	this.text_style = {font: '65px kenvector_future', fill: 'white', align: 'center'};
	
	this.instructions = null;
	this.score = 0;
	this.score_text = null;
	this.high_score = 0;
	this.scoreboard = null;
	
	this.level_text = null;
	this.background = null;
	this.tilemap = null;
	this.tileset = null;
	
	this.started = false;
	this.finished = false;
	
	this.background_layer = null;
	this.answer_button_group = null;
	this.ui_layer = null;
	this.problem_text = null;
	this.answer = 0;
	this.problem_background = null;
	
	this.starting_line_position = 150;
	this.min_player_speed = 10;
	this.max_player_speed = 30;
	this.player_run_timer = 0;
	this.min_opponent_speed = 8;
	this.max_opponent_speed = 27;
	this.move_opponent_timer = 0;
	
	this.zizo = null;
	this.opponents = null;
	this.finish_line = null;
	
	this.background_music = null;
	this.win_sound = null;
	this.lose_sound = null;
	this.right_answer_sound = null;
	this.wrong_answer_sound = null;
	
	this.difficulty_text = null;
	this.diff_level = 'easy';
	
	this.finishplace = 1;
	this.probType = '';
	
	// local category booleans
	this.lcAddition = false;
	this.lcAddthree = false;
	this.lcSubtraction = false;
	this.lcSubthree = false;
	this.lcZero = false;
};

BasicGame.HorseGame.prototype = {
	preload: function() {
		// Finish line
		this.game.load.image('finish_line', 'assets/racing_game/finish_line2.png');
		
		if ($.cookie('race_high_score') != null && $.cookie('race_high_score') != '') {
			this.high_score = $.cookie('race_high_score');
		}
	},
	
	create: function() {
		console.log('Horse game');
		
		// Audio
		this.background_music = this.game.add.audio('racing_background_music');
		this.win_sound = this.game.add.audio('win_sound');
		this.lose_sound = this.game.add.audio('lose_sound');
		this.right_answer_sound = this.game.add.audio('right_answer_sound');
		this.wrong_answer_sound = this.game.add.audio('wrong_answer_sound');
			
		// Manage Layers
		this.background_layer = this.game.add.group();
		this.background_layer.z = 0;
		
		// Answer button group
		this.answer_button_group = this.game.createAnswerButtons.call(this);
		this.answer_button_group.z = 1;
		
		// Pause button / ui group
		this.ui_layer = this.game.add.group();
		this.ui_layer.z = 2;
		
		// 10/26 uncomment out pause button. not to be included in game
		//this.pause_button = this.game.add.button(this.game.world.width - 135, 20, 'pause_icon', this.game.pause, this);
		//this.ui_layer.add(this.pause_button);
		
		// Score display
		this.score_text = this.game.add.text(this.game.width - 145, 9, this.score + '', this.text_style);
		this.score_text.anchor.setTo(1, 0);
		this.ui_layer.add(this.score_text);
		
		// Create Opponents
		this.opponents = this.game.add.group();
		var opponent_sprites = ['alienBeige', 'alienBlue3', 'alienYellow4'];
		for (var i = 0; i < opponent_sprites.length; i++) {
			var opponent = this.opponents.create(this.starting_line_position, this.game.world.height - (90 * i) - 115, opponent_sprites[i]);
			opponent.anchor.setTo(1, 1);
			opponent.animations.add('wait', [9], 1, false);
			opponent.animations.add('on_mark', [10], 1, false);
			opponent.animations.add('get_set', [9], 1, false);
			opponent.animations.add('run', [9, 10], 5, true);
			opponent.play('wait');
			opponent.body.velocity.x = 0;
		}		
		this.opponents.sort('y', Phaser.Group.SORT_ASCENDING);
		
		// Create Zizo
		this.zizo = this.game.add.sprite(this.starting_line_position, this.game.world.height - 25, 'zizo');
		this.zizo.anchor.setTo(1, 1);
		this.zizo.animations.add('wait', [0], 1, false);
		this.zizo.animations.add('on_mark', [6], 1, false);
		this.zizo.animations.add('get_set', [3], 1, false);
		this.zizo.animations.add('run', [9, 10], 5, true);
		this.zizo.play('wait');
		this.zizo.body.velocity.x = 0;
		
				
		// Finish line
		this.finish_line = this.game.add.sprite(this.game.world.width - 115, this.game.world.height - 25, 'finish_line');
		this.finish_line.anchor.setTo(0, 1);
		
		// Instructions
		this.instructions = this.game.add.sprite(0, 0, 'race_instructions');
		
		this.start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.killInstructions, this, 3, 3, 4);
		this.start_button.alpha = 0;
		this.start_button.anchor.setTo(0.5, 0.5);
		this.start_text = this.game.add.text(4, 0, 'START', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
		this.start_text.anchor.setTo(0.5, 0.5);
		this.start_button.addChild(this.start_text);
		
		// Initialize scoreboard
		this.scoreboard = this.game.add.group();
		
		var instruction_audio = this.game.add.audio('race_instruction_sound');
		instruction_audio.onStop.add(function(){
			this.game.add.tween(this.start_button).to({alpha: 1}, 500, null, true);
		}, this);
		// 10/26 commented out during testing
		//instruction_audio.play();
	},
	
	// Commented out pause functionality
	/*pause: function() {
		this.background_music.pause();
		this.started = false;
	},
	
	unpause: function() {
		this.background_music.resume();
		this.started = true;
	},*/
	
	update: function() {
		if (!this.started) {
			return;
		}
		
		this.game.physics.overlap(this.zizo, this.finish_line, this.winRace, null, this);
		// If the opponent crosses the finish line, increment the finishing place by 1 (loseRace)
		this.game.physics.overlap(this.opponents, this.finish_line, this.loseRace, null, this);
		
		// If player has not answered in 6 seconds
		if (this.started && this.game.time.now - this.player_run_timer > 3000) {
			this.slowPlayer();
		}
		
		// After 10 seconds, randomize opponents' speeds
		if (this.started && this.game.time.now - this.move_opponent_timer > 5000) {
			this.moveOpponents();
			//console.log('moving opponents');
		}
	},
	
	reset: function() {		
		//console.log('in reset');
		this.zizo.x = this.starting_line_position;
		this.zizo.play('wait');
		this.zizo.body.velocity.x = 0;
		
		this.opponents.setAll('x', this.starting_line_position);
		this.opponents.setAll('body.velocity.x', 0);
		this.opponents.callAll('play', null, 'wait');
		
		this.background_music.stop();
	},
	
	killInstructions: function() {
		this.start_button.destroy();
		this.instructions.destroy();
		this.startLevel();
	},
	
	startLevel: function() {
		this.finished = false;
		this.scoreboard.destroy();
		
		if (this.game.global_vars.load_saved_state) {
			this.current_level = this.game.global_vars.saved_level;
			this.game.global_vars.load_saved_state = false;
		}
		
		// Load level specific things
		this.background = this.game.add.sprite(0, 0, this.level_images[this.current_level]['background']);
		this.background_layer.add(this.background);
		//this.level_text = this.game.add.text(80, 10, 'Level ' + this.current_level, {font: '20px kenvector_future', fill: '#fff'});
		
		// show difficulty
		this.difficulty_text = this.game.add.text(80, 10, 'Difficulty ' + this.game.global_vars.diff_score + ' ' + this.diff_level, {font: '20px kenvector_future', fill: '#fff'});
		//this.difficulty_text = this.game.add.text(80, 10, 'Difficulty ' + this.game.global_vars.diff_score, {font: '20px kenvector_future', fill: '#fff'});
		
		
		// Reset characters
		this.reset();
		this.startCountDown();
	},
	
	startCountDown: function() {
		//console.log('start count down');
		//this.background_music.play();
		
		var this_ref = this;
		var count_down_text = this.game.add.text(this.game.world.centerX, 150, 'On your mark...', this.text_style);
		count_down_text.anchor.setTo(0.5, 0.5);
		
		this.zizo.play('on_mark');
		this.opponents.callAll('play', null, 'on_mark');
		
		var mark = this_ref.game.add.audio('racing_on_ur_mark');
		mark.onStop.add(function(){
			count_down_text.setText('Get set...');
			this.zizo.play('get_set');
			this.opponents.callAll('play', null, 'get_set');
			
			var set = this.game.add.audio('racing_get_set');
			set.onStop.add(function(){
				count_down_text.setText('GO!!!');	
				
				var go = this_ref.game.add.audio('racing_go');
				go.onStop.add(function(){
					count_down_text.destroy();
					this.zizo.play('run');
					this.opponents.callAll('play', null, 'run');
					this.startRace.call(this);
				}, this);
				go.play('', 0, 0.7, false);			
			}, this);
			set.play('', 0, 0.7, false);
		}, this);
		mark.play('', 0, 0.7, false);
	},
	
	startRace: function() {
		this.started = true;
		this.displayNewProblem();
		
		this.zizo.body.velocity.x = this.min_player_speed;
		this.moveOpponents.call(this);
	},
	
	moveOpponents: function() {
		var this_ref = this;
		this.move_opponent_timer = this.game.time.now;
		
		this.opponents.forEach(function(opponent){ 
			var speed = this_ref.game.randomIntFromInterval(this_ref.min_opponent_speed, this_ref.max_opponent_speed);
			opponent.body.velocity.x = speed;
		});
	},
	
	displayNewProblem: function() {
		
		var problem = this.game.getMathProblem('subMiddle', this.diff_level);
		//var problem = this.game.getMathProblem('addMiddle', 'hard');
		this.answer = problem.answer;
		// Once the problem is returned, set local category variables
		if (problem.cAddition == true) {
			this.lcAddition = true;
		}
		if (problem.cAddthree == true) {
			this.lcAddthree = true;
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
		if (this.problem_background == null || !this.problem_background.exists) {
			this.problem_background = this.game.add.sprite(this.game.world.centerX, 120, 'q_bg');
			this.problem_background.anchor.setTo(0.5, 0);
			this.problem_background.alpha = 0.65;
		}
		
		if (this.problem_text == null || !this.problem_text.exists) {
			this.problem_text = this.game.add.text(this.game.world.centerX, 200, problem.text, {font: '65px kenvector_future', fill: '#fff', align: 'center'});
			this.problem_text.anchor.setTo(0.5, 0.5);
		} else {
			this.problem_text.setText(problem.text);
		}
		//console.log('Ask Subtraction: ' + this.game.global_vars.askSubtraction);
	},
	
	checkAnswer: function(answer) {
		if (this.finished)
			return false;
		if (this.lcAddition == true){
			this.game.global_vars.askAddition += 1;
		}
		if (this.lcAddthree == true){
			this.game.global_vars.askAddthree += 1;
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
		
		if (this.answer == answer) {
			this.right_answer_sound.play();
			//this.displayNewProblem();
			this.acceleratePlayer();
			this.score += 100;
			this.game.global_vars.diff_score += 1;
			// if the correct answer was entered, increment all the ans* category vars and the difficulty vars
			if (this.lcAddition == true){
				this.game.global_vars.ansAddition += 1;
			}
			if (this.lcAddthree == true){
				this.game.global_vars.ansAddthree += 1;
			}
			if (this.lcSubtraction == true) {
				this.game.global_vars.ansSubtraction +=1;
			}
			if (this.lcSubthree == true) {
				this.game.global_vars.ansSubthree +=1;
			}
			if (this.lcZero == true) {
				this.game.global_vars.ansZero +=1;
			}
			if (this.diff_level == 'easy') {
				this.game.global_vars.ansEasy +=1;
			}
			if (this.diff_level == 'medium') {
				this.game.global_vars.ansMedium +=1;
			}
			if (this.diff_level == 'hard') {
				this.game.global_vars.ansHard +=1;
			}
		} else {
			this.wrong_answer_sound.play();
			this.game.global_vars.diff_score -= 1;
			if (this.game.global_vars.diff_score < 0) {
				this.game.global_vars.diff_score = 0;
			}
			//this.displayNewProblem();
			this.score -= 30;
			if (this.score < 0) {
				this.score = 0;
			}
		}
		
		// reset local category booleans
		this.lcAddition = false;
		this.lcAddthree = false;
		this.lcSubtraction = false;
		this.lcSubthree = false;
		this.lcZero = false;
		
		this.displayNewProblem();
		
		/*console.log('askSubtraction: ' + this.game.global_vars.askSubtraction + ' Answered: ' + this.game.global_vars.ansSubtraction);
		console.log('askSubthree: ' + this.game.global_vars.askSubthree + ' Answered: ' + this.game.global_vars.ansSubthree);
		console.log('askZero: ' + this.game.global_vars.askZero + ' Answered: ' + this.game.global_vars.ansZero);
		console.log('ansEasy: ' + this.game.global_vars.ansEasy);
		console.log('ansMedium: ' + this.game.global_vars.ansMedium);
		console.log('ansHard: ' + this.game.global_vars.ansHard);*/
		
		console.log('askAddition: ' + this.game.global_vars.askAddition + ' Answered: ' + this.game.global_vars.ansAddition);
		console.log('askAddthree: ' + this.game.global_vars.askAddthree + ' Answered: ' + this.game.global_vars.ansAddthree);
		console.log('askZero: ' + this.game.global_vars.askZero + ' Answered: ' + this.game.global_vars.ansZero);
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
		this.difficulty_text = this.game.add.text(80, 10, 'Difficulty ' + this.game.global_vars.diff_score + ' ' + this.diff_level, {font: '20px kenvector_future', fill: '#fff'});
		this.score_text.setText(this.score);
	},
	
	acceleratePlayer: function() {
		if (this.started) {
			//console.log('accelerate');
			if (this.zizo.body.velocity.x < this.max_player_speed) {
				this.zizo.body.velocity.x += 6;
			}
			this.player_run_timer = this.game.time.now;
		}
	},
	
	slowPlayer: function() {
		if (this.started) {
			//console.log('deccelerate');
			this.player_run_timer = this.game.time.now;
			if (this.zizo.body.velocity.x > this.zizo.body.velocity.x + 14) {
				this.zizo.body.velocity.x -= 15;
			} else {
				this.zizo.body.velocity.x = this.min_player_speed;
			}
		}
	},
	
	winRace: function() {
		if (!this.started) {
			return;
		}
		this.finished = true;
		if (this.finishplace == 4) {
			this.score += 50;
		} else if (this.finishplace == 3) {
			this.score += 150;
		} else if (this.finishplace == 2) {	
			this.score += 300;
		} else {
			this.score += 500;
		}
		
		this.endRace();
		this.win_sound.play();
		this.showScoreboard(true);
		// this.game.input.onDown.addOnce(this.finishLevel, this);
	},
	
	loseRace: function(finish_line, opponent) {
		/*if (!this.started) {
			return;
		}
		this.finished = true;
		
		this.endRace();
		this.lose_sound.play();
		this.showScoreboard(false);*/
		this.finishplace += 1;
		//console.log(this.finishplace);
		opponent.destroy();
		// this.game.input.onDown.addOnce(this.startLevel, this);
	},
	
	showScoreboard: function(win) {
		this.problem_background.destroy();
		this.scoreboard = this.game.add.group();
		
		var new_pr = false;
		if (this.score > this.high_score) {
			new_pr = true;
			$.cookie('race_high_score', this.score);
			this.high_score = this.score;
		}
		
		this.scoreboard.add(this.game.add.sprite(0, 0, 'score_board'));
		var result_header = '';
		var result = '';
		var start_button = null;
		var start_text = '';
		
		if (win) {
			result_header = 'Rank: ' + this.finishplace;
			if (this.finishplace == 4) {
				result_header = '4th place!';
			} else if (this.finishplace == 3) {
				result_header = '3rd place!';
			} else if (this.finishplace == 2) {
				result_header = '2nd place!';
			} else {
				result_header = '1st place!';
			}
		} else {
			result_header = 'You Lose...';
		}
		
		if (!this.game.global_vars.story_mode) {
			start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.restart, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'Menu', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		} else if (win) {
			start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.finishLevel, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'Next', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		} else {
			start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.restart, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'Try Again', {font: '20pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		}
		
		result = 'Score:\n' + this.score + '\n';
		
		if (new_pr) {
			result += '**NEW**'
		}
		
		result += ' High Score:\n' + this.high_score;
		
		var header = this.game.add.text(this.game.world.centerX, 130, result_header, {font: '75pt kenvector_future', fill: '#fff', align: 'center'});
		header.anchor.setTo(0.5, 0);
		var text = this.game.add.text(this.game.world.centerX, 290, result, this.text_style);
		text.anchor.setTo(0.5, 0);
		
		this.scoreboard.add(start_button);
		this.scoreboard.add(header);
		this.scoreboard.add(text);
	},
	
	endRace: function() {
		this.started = false;
		this.problem_text.destroy();
		
		this.zizo.body.velocity.x = 0;
		this.zizo.animations.play('wait');
		this.opponents.setAll('body.velocity.x', 0);
		this.opponents.callAll('play', null, 'wait');
		
		this.background_music.stop();
	},
	
	finishLevel: function() {
		this.background_layer.remove(this.background);
		//this.level_text.destroy();
		
		if (this.current_level < this.game.global_vars.num_levels) {
			this.current_level += 1;
			
			this.game.saveGame(this.state_label, this.current_level);
			
			this.startLevel();
		} else {
			this.winGame();
		}
	},
	
	winGame: function() {
		//console.log('Won horse game!');
		this.current_level = 1;
		
		// Unlock this mini game
		this.game.unlockMiniGame(this.state_label);
		
		if (!this.game.global_vars.story_mode) {
			this.game.state.start('MainMenu');
		} else {
			this.game.goToNextState.call(this);
		}
	},
	
	restart: function() {
		this.game.state.start('MainMenu', true, false, {restarted: true});
	},
	
	shutdown: function() {
		console.log('shutdown');
		//console.log(this.zizo.body.velocity.x);
		// this.background_layer.destroy();
		// this.answer_button_group.destory();
		// this.ui_layer.destroy();
		// this.zizo.destroy();
		// this.opponents.destroy();
		// this.finish_line.destroy();
		this.zizo.body.velocity.x = 0;
		this.opponents.setAll('body.velocity.x', 0);
	}
};