BasicGame.BossGame = function (game) {
	this.state_label = 'BossGame';
	this.current_level = 1;
	this.level_images = [];
	this.level_images[1] = {
		//'background': 'sky',
		'background': 'bg_boss',
		'tilemap': '',
		'tileset': ''
	};
	this.text_style = {font: '65px kenvector_future', fill: 'white', align: 'center'};
	this.level_text = null;
	this.background = null;
	//this.tilemap = null;
	//this.tileset = null;
	this.started = false;
	this.background_layer = null;
	this.answer_button_group = null;
	this.ui_layer = null;
	this.problem_text = null;
	this.answer = 0;
	this.answer2 = 0;
	this.answer3 = 0;	
	this.zgoal = 1;
	//this.starting_line_position = 150;
	this.min_player_speed = 15;
	this.player_run_timer = 0;
	this.rocks = null;
	this.zizo = null;
	this.king = null;
	this.opponents = null;
	this.finish_line = null;
	// 12/9 forgot what end_text was for, commenting out
	//this.end_text = null;
	this.bossplatforms = null;
	this.gametime = 0;
	this.gametime2 = 0;
	this.gunExists = false;
	this.gunPosition = 0;
	this.lasers = null;
	this.hands = 0;
	this.kinglives = 3;
	
	this.instructions = null;
	this.scoreboard = null;
	
	this.win_sound = null;
	this.lose_sound = null;
	this.ouch_sound = null;
	
	this.difficulty_text = null;
};

BasicGame.BossGame.prototype = {
	preload: function() {
		this.game.load.image('rock', 'assets/boss_game/rock.png');
		this.game.load.image('gun', 'assets/boss_game/gun.png');
		this.game.load.image('laser', 'assets/boss_game/laser.png');
		this.game.load.spritesheet('king', 'assets/boss_game/km_boss.png', 69, 96);
	},

	create: function() {
		console.log('Boss game');
		this.background_music = this.game.add.audio('boss_background_music');
		this.lasersound = this.game.add.audio('lasersound');
		this.rocksound = this.game.add.audio('rocksound');
		this.right_answer_sound = this.game.add.audio('right_answer_sound');
		this.wrong_answer_sound = this.game.add.audio('wrong_answer_sound');
		this.win_sound = this.game.add.audio('win_sound');
		this.lose_sound = this.game.add.audio('lose_sound');
		this.ouch_sound = this.game.add.audio('ouch_sound');
		
		// Manage Layers
		this.background_layer = this.game.add.group();
		this.background_layer.z = 0;

		// Answer button group
		this.answer_button_group = this.game.createAnswerButtons.call(this);
		this.answer_button_group.z = 1;
		
		// Pause button / ui group
		this.ui_layer = this.game.add.group();
		this.ui_layer.z = 2;
		// Create rock group
		this.rocks = this.game.add.group();
		this.guns = this.game.add.group();
		this.lasers = this.game.add.group();
		//bullet = this.bullets.create(100, 100, 'tomato');
		this.pause_button = this.game.add.button(this.game.world.width - 135, 20, 'pause_icon', this.game.pause, this);
		this.ui_layer.add(this.pause_button);


		// Create Zizo
		//this.zizo = this.game.add.sprite(this.starting_line_position, this.game.world.height - 25, 'zizo');
		this.zizo = this.game.add.sprite(337, 443, 'zizo');
		this.zizo.anchor.setTo(.5, 1);
		this.zizo.animations.add('wait', [0], 1, false);
		this.zizo.animations.add('on_mark', [6], 1, false);
		this.zizo.animations.add('get_set', [3], 1, false);
		this.zizo.animations.add('run', [9, 10], 5, true);
		
		this.king = this.game.add.sprite(1100, 443, 'king');
		this.king.anchor.setTo(1, 1);
		this.king.animations.add('stand', [0], 1, false);
		this.king.animations.add('move', [0, 1], 3, true);
		this.king.animations.add('hands', [2], 1, false);
		this.king.play('stand');
		
		// Instructions
		this.instructions = this.game.add.sprite(0, 0, 'boss_instructions');
		
		this.start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 90, 'yellow_buttons', this.killInstructions, this, 3, 3, 4);
		this.start_button.alpha = 0;
		this.start_button.anchor.setTo(0.5, 0.5);
		this.start_text = this.game.add.text(4, 0, 'START', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
		this.start_text.anchor.setTo(0.5, 0.5);
		this.start_button.addChild(this.start_text);
		
		// Initialize scoreboard
		this.scoreboard = this.game.add.group();
		
		var instruction_audio = this.game.add.audio('boss_instruction_sound');
		instruction_audio.onStop.add(function(){
			this.game.add.tween(this.start_button).to({alpha: 1}, 500, null, true);
		}, this);
		instruction_audio.play();
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
		//this.game.physics.collide(this.zizo, this.bossplatforms);
		//this.game.physics.overlap(this.zizo, this.finish_line, this.winRace, null, this);
		if  (this.zgoal == 1 && this.zizo.x < 336) {
			this.zizo.body.velocity.x=100;
			//this.zizo.scale.x = 1;
			this.zizo.play('run');
		}
		if  (this.zgoal == 1 && this.zizo.x > 338) {
			this.zizo.body.velocity.x=-100;
			//this.zizo.scale.x = -1;
			this.zizo.play('run');
		}
		if  (this.zgoal == 1 && this.zizo.x > 335 && this.zizo.x < 339) {
			this.zizo.body.velocity.x=0;
			this.zgoal = 0;
			this.zizo.play('wait');
		}
		if  (this.zgoal == 2 && this.zizo.x < 616) {
			this.zizo.body.velocity.x=100;
			//this.zizo.scale.x = 1;
			this.zizo.play('run');
		}
		if  (this.zgoal == 2 && this.zizo.x > 618) {
			this.zizo.body.velocity.x=-100;
			//this.zizo.scale.x = -1;
			this.zizo.play('run');
		}
		if  (this.zgoal == 2 && this.zizo.x > 615 && this.zizo.x < 619) {
			this.zizo.body.velocity.x=0;
			this.zgoal = 0;
			this.zizo.play('wait');
		}
		if  (this.zgoal == 3 && this.zizo.x < 896) {
			this.zizo.body.velocity.x=100;
			//this.zizo.scale.x = 1;
			this.zizo.play('run');
		}
		if  (this.zgoal == 3 && this.zizo.x > 898) {
			this.zizo.body.velocity.x=-100;
			//this.zizo.scale.x = -1;
			this.zizo.play('run');
		}
		if  (this.zgoal == 3 && this.zizo.x > 895 && this.zizo.x < 899) {
			this.zizo.body.velocity.x=0;
			this.zgoal = 0;
			this.zizo.play('wait');
		}
		if (this.zizo.body.velocity.x<0){
			this.zizo.scale.x = -1;
		}
		else {
			this.zizo.scale.x = 1;
		}
		this.gametime = this.gametime+1;
		this.gametime2 = this.gametime2+1;
		if (this.gametime > 200) {
			this.gametime = this.gametime-200;
			console.log('rock');
			rock = this.rocks.create(this.game.rnd.integerInRange(1, 4)*280 +82, 1, 'rock');
			rock.body.gravity.y = 40;
			rock.anchor.setTo(1,1);
			this.king.play('hands');
			this.hands = 30;
			this.rocksound.play();
		}
		this.hands = this.hands-1;
		if (this.hands == 0) {
			this.king.play('move');
		}
		if (this.gunExists) {
			this.gametime2 = 0;
		}
		if (this.gametime2 > 425 && !this.gunExists) {
			console.log("make a gun!");
			console.log(this.gametime2);
			this.gametime2 = this.gametime2-425;
			this.gunPosition = (this.game.rnd.integerInRange(1, 4)*280 +82);
			while ((this.gunPosition - this.zizo.x)*(this.gunPosition - this.zizo.x) < 10000){
				this.gunPosition = (this.game.rnd.integerInRange(1, 4)*280 +82);
			}
			gun = this.guns.create(this.gunPosition, 443, 'gun');
			this.gunExists = true;
			gun.anchor.setTo(1,1);
		}
		this.game.physics.overlap(this.zizo, this.guns, this.collectGun, null, this);
		this.game.physics.overlap(this.king, this.lasers, this.collectLaser, null, this);
		this.game.physics.overlap(this.zizo, this.rocks, this.loseRace, null, this);
		
		if (this.kinglives == 0) {
			this.winRace();
		}

	},

	reset: function() {
		/*if (this.end_text != null && this.end_text.exists) {
			this.end_text.destroy();
		}*/

		this.zizo.play('wait');
		this.zizo.x = 337;
		this.zizo.body.velocity.x = 0;
		this.king.play('stand');
		this.kinglives = 3;
		this.started = false;
		this.gametime1 = 0;
		this.gametime2 = 1;
		this.gunExists = false;
		this.rocks.destroy();
		this.rocks = this.game.add.group();
		this.guns.destroy();
		this.guns = this.game.add.group();
		this.lasers.destroy();
		this.lasers = this.game.add.group();
	},
	
	collectGun: function(zizo, gun) {
		gun.destroy();
		this.gunExists = false;
		console.log('Collect Gun!');
		laser = this.lasers.create(this.zizo.x+75, 443, 'laser');
		laser.body.velocity.x = 350;
		laser.anchor.setTo(1,1);
		this.lasersound.play();
	},
	
	collectLaser: function(king, laser) {
		laser.destroy();
		console.log('Collect Laser!');
		this.kinglives = this.kinglives-1;
	},
	
	startLevel: function() {
		this.scoreboard.destroy();
		
		if (this.game.global_vars.load_saved_state) {
			this.current_level = this.game.global_vars.saved_level;
			this.game.global_vars.load_saved_state = false;
		}
		
		// Load level specific things
		this.background = this.game.add.sprite(0, 0, this.level_images[this.current_level]['background']);
		this.background_layer.add(this.background);
		//this.level_text = this.game.add.text(80, 10, 'Boss Level', {font: '20px kenvector_future', fill: '#fff'});
		this.difficulty_text = this.game.add.text(80, 10, 'Difficulty ' + this.game.global_vars.diff_score, {font: '20px kenvector_future', fill: '#fff'});

		// Reset characters
		this.reset();
		this.startRace();

	},

	startRace: function() {
		this.started = true;
		this.zizo.play('on_mark');
		this.displayNewProblem();
		this.displayNewProblem2();
		this.displayNewProblem3();
		this.king.play('move');
		// commented out to test 10/17
		//this.background_music.play(0,0,1,true);
	},


	displayNewProblem: function() {
		var problem = this.game.getMathProblem('addSolution', 'easy');
		this.answer = problem.answer;
		console.log('WE ARE HERE');
		while (this.answer == this.answer2 || this.answer == this.answer3) {
			problem = this.game.getMathProblem('addSolution', 'easy');
			this.answer = problem.answer;

		}

		if (this.problem_text == null || !this.problem_text.exists) {
			this.problem_text = this.game.add.text(340, 533, problem.text, {font: '40px kenvector_future', fill: '#fff'});
			this.problem_text.anchor.setTo(0.5, 0.5);
		} else {
			this.problem_text.setText(problem.text);
		}
	},
	
	displayNewProblem2: function() {
		var problem2 = this.game.getMathProblem('addSolution', 'medium');
		this.answer2 = problem2.answer;
		
		while (this.answer2 == this.answer || this.answer2 == this.answer3) {
			problem2 = this.game.getMathProblem('addSolution', 'medium');
			this.answer2 = problem2.answer;
		}
		if (this.problem_text2 == null || !this.problem_text2.exists) {
			this.problem_text2 = this.game.add.text(620, 533, problem2.text, {font: '40px kenvector_future', fill: '#fff'});
			this.problem_text2.anchor.setTo(0.5, 0.5);
		} else {
			this.problem_text2.setText(problem2.text);
		}
	},
	
	displayNewProblem3: function() {
		var problem3 = this.game.getMathProblem('addSolution', 'hard');
		this.answer3 = problem3.answer;
		
		while (this.answer3 == this.answer || this.answer3 == this.answer2) {
			problem3 = this.game.getMathProblem('addSolution', 'hard');
			this.answer3 = problem3.answer;
		}
		if (this.problem_text3 == null || !this.problem_text3.exists) {
			this.problem_text3 = this.game.add.text(900, 533, problem3.text, {font: '40px kenvector_future', fill: '#fff'});
			this.problem_text3.anchor.setTo(0.5, 0.5);
		} else {
			this.problem_text3.setText(problem3.text);
		}
	},

	checkAnswer: function(answer) {
		if ((this.answer != answer) && (this.answer2 != answer) && (this.answer3 != answer)){
			this.wrong_answer_sound.play();
			this.game.global_vars.diff_score -= 1;
			if (this.game.global_vars.diff_score < 0) {
				this.game.global_vars.diff_score = 0;
			}
		}
		if (this.answer == answer) {
			this.right_answer_sound.play();
			this.displayNewProblem();
			this.zgoal = 1;
			this.game.global_vars.diff_score += 1;
		}
		if (this.answer2 == answer) {
			this.right_answer_sound.play();
			this.displayNewProblem2();
			this.zgoal = 2;
			this.game.global_vars.diff_score += 1;
		}
		if (this.answer3 == answer) {
			this.right_answer_sound.play();
			this.displayNewProblem3();
			this.zgoal = 3;
			this.game.global_vars.diff_score += 1;
		}
		this.difficulty_text.destroy();
		this.difficulty_text = this.game.add.text(80, 10, 'Difficulty ' + this.game.global_vars.diff_score, {font: '20px kenvector_future', fill: '#fff'});
		
	},

	winRace: function() {
		if (!this.started) {
			return;
		}

		this.endRace();
		
		var black = this.game.add.sprite(0, 0, 'black_screen');
		black.alpha = 0;
		this.win_sound.play();
		var fade_black = this.game.add.tween(black).to({alpha: 1}, 3000, null, false);
		fade_black.onComplete.add(this.winGame, this);
		fade_black.start();
	},

	loseRace: function(zizo, rock) {
		if (!this.started) {
			return;
		}

		if (rock.alive) {
			rock.alive = false;
			this.ouch_sound.play();
			// this.endRace();
			// this.lose_sound.play();
			// this.showScoreboard(false);
		}
	},
	
	showScoreboard: function(win) {
		this.scoreboard = this.game.add.group();
		
		this.scoreboard.add(this.game.add.sprite(0, 0, 'score_board'));
		var start_button = null;
		
		if (!this.game.global_vars.story_mode) {
			start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.backToMainMenu, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'Menu', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		}  else {
			start_button = this.game.add.button(this.game.world.centerX, this.game.world.height - 100, 'yellow_buttons', this.startLevel, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'Try Again', {font: '20pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		}
		
		var header = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'You lose...', {font: '75pt kenvector_future', fill: '#fff', align: 'center'});
		header.anchor.setTo(0.5, 0);
		
		this.scoreboard.add(start_button);
		this.scoreboard.add(header);
	},

	endRace: function() {
		this.started = false;
		//this.problem_text.destroy();

		this.zizo.body.velocity.x = 0;
		this.zizo.animations.play('wait');
		this.background_music.stop();
		//this.opponents.setAll('body.velocity.x', 0);
		//this.opponents.callAll('play', null, 'wait');
	},

	finishLevel: function() {
		this.background_layer.remove(this.background);
		this.level_text.destroy();

		if (this.current_level < 3) {
			this.current_level += 1;

			this.game.saveGame(this.state_label, this.current_level);

			this.startLevel();
		} else {
			this.winGame();
		}
	},

	winGame: function() {
		console.log('Won horse game!');
		this.current_level = 1;

		// Unlock this mini game
		this.game.unlockMiniGame(this.state_label);
		this.game.goToNextState.call(this);
	},
	
	backToMainMenu: function() {
		this.game.state.start('MainMenu');
	},
	
	shutdown: function() {
		console.log('shutdown');
		// console.log(this.zizo.body.velocity.x);
		// this.background_layer.destroy();
		// this.answer_button_group.destory();
		// this.ui_layer.destroy();
		// this.zizo.destroy();
		// this.opponents.destroy();
		// this.finish_line.destroy();
		console.log(this.zizo.body.velocity.x);
	}
};