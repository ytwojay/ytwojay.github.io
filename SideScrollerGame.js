BasicGame.SideScrollerGame = function (game) {
	this.state_label = 'SideScrollerGame';
	this.current_level = 1;
	
	this.level_images = [];
	
	this.level_images[1] = {
		'background': 'bg_castle'
	};
	
	this.level_images[2] = {
		'background': ''
	};
	
	this.level_images[2] = {
		'background': ''
	};
	
	// Layers
	this.background_layer = null;
	this.answer_button_group = null;
	this.ui_layer = null;
	this.tilemap_layer = null;
	
	this.tilemap = null;
	this.tileset = null;
	this.layer = null;
	
	this.zizo = null;
	this.umbrella = null;
	
	this.text_style = {font: '65px kenvector_future', fill: 'white', align: 'center'};
	
	this.problem_background = null;
	this.problem_text = null;
	this.answer = 0;
	
	this.start_button = null;
	this.start_text = '';
	this.score = 0;
	this.score_text = null;
	this.high_score = 0;
	this.scoreboard = null;
	
	// Enemies
	this.enemy_spiders = null;
	this.enemy_ghosts = null;
	this.enemy_bats = null;
	// this.enemy_spikes = null;
	this.enemy_snakes = null;
	
	this.door = null;
	this.door1 = null;
	this.door2 = null;
	
	this.background_music = null;
	this.win_sound = null;
	this.lose_sound = null;
	this.right_answer_sound = null;
	this.wrong_answer_sound = null;
	this.splat_sound = null;
	this.ouch_sound = null;
	
	this.already_dead = false;
	this.finished_level = false;
};

BasicGame.SideScrollerGame.prototype = {
	preload: function() {
		this.game.load.tilemap('tilemap', 'assets/side_scroller/castle_tilemap.json', null, Phaser.Tilemap.TILED_JSON);
		
		if ($.cookie('scroller_high_score') != null && $.cookie('scroller_high_score') != '') {
			this.high_score = $.cookie('scroller_high_score');
		}
	},
	
	create: function() {		
		// Audio
		this.background_music = this.game.add.audio('scroller_background_music');
		this.win_sound = this.game.add.audio('win_sound');
		this.lose_sound = this.game.add.audio('lose_sound');
		this.right_answer_sound = this.game.add.audio('right_answer_sound');
		this.wrong_answer_sound = this.game.add.audio('wrong_answer_sound');
		this.splat_sound = this.game.add.audio('splat_sound');
		this.ouch_sound = this.game.add.audio('ouch_sound');
		
		// Manage Layers
		this.background_layer = this.game.add.group();
		this.background_layer.z = 0;
		this.background_layer.fixedToCamera = true;
		this.background_layer.parent = null;
		this.tilemap_layer = this.game.add.group();
		this.tilemap_layer.z = 1
		
		// Answer button group
		this.answer_button_group = this.game.add.group();
		this.answer_button_group.z = 3;
		this.answer_button_group.parent = null;
		this.answer_button_group.fixedToCamera = true;
		
		// Create answer buttons
		var plus_button = this.game.add.button(390, 300, 'buttons', this.answerPlus, this, 20, 20, 20);
		var plus_button_text = this.game.add.text(50, 50, '+', {font: '40px kenvector_future', fill: '#fff', align: 'center'});
		plus_button_text.anchor.setTo(0.5, 0.5);
		plus_button.addChild(plus_button_text);
		plus_button.fixedToCamera = true;
		plus_button.value = '+';
		this.answer_button_group.add(plus_button);
		
		var minus_button = this.game.add.button(500, 300, 'buttons', this.answerMinus, this, 20, 20, 20);
		var minus_button_text = this.game.add.text(50, 50, '-', {font: '40px kenvector_future', fill: '#fff', align: 'center'});
		minus_button_text.anchor.setTo(0.5, 0.5);
		minus_button.addChild(minus_button_text);
		minus_button.fixedToCamera = true;
		minus_button.value = '-';
		this.answer_button_group.add(minus_button);
		
		var greater_button = this.game.add.button(680, 300, 'buttons', this.answerGreater, this, 20, 20, 20);
		var greater_button_text = this.game.add.text(50, 50, '>', {font: '40px arial', fill: '#fff', align: 'center'});
		greater_button_text.anchor.setTo(0.5, 0.5);
		greater_button.addChild(greater_button_text);
		greater_button.fixedToCamera = true;
		greater_button.value = '>';
		this.answer_button_group.add(greater_button);
		
		var less_button = this.game.add.button(790, 300, 'buttons', this.answerLess, this, 20, 20, 20);
		var less_button_text = this.game.add.text(50, 50, '<', {font: '40px arial', fill: '#fff', align: 'center'});
		less_button_text.anchor.setTo(0.5, 0.5);
		less_button.addChild(less_button_text);
		less_button.fixedToCamera = true;
		less_button.value = '>';
		this.answer_button_group.add(less_button);
		
		// Pause button / ui group
		this.ui_layer = this.game.add.group();
		this.ui_layer.z = 2;
		
		this.pause_button = this.game.add.button(this.game.world.width - 135, 20, 'pause_icon', this.game.pause, this);
		this.pause_button.fixedToCamera = true;
		this.ui_layer.add(this.pause_button);
		
		// Score display
		this.score_text = this.game.add.text(this.game.width - 145, 9, this.score + '', this.text_style);
		this.score_text.anchor.setTo(1, 0);
		this.score_text.fixedToCamera = true;
		this.ui_layer.add(this.score_text);
		
		this.tilemap = this.game.add.tilemap('tilemap');
		this.tileset = this.tilemap.addTilesetImage('base_tileset', 'base_tileset');
		this.tilemap.setCollisionBetween(0, 156);
		this.tilemap.setTileIndexCallback(58, this.finishLevel, this, 'Tile Layer 1');
		
		this.layer = this.tilemap.createLayer('Tile Layer 1');
		torches_layer = this.tilemap.createLayer('Torches');
		this.layer.resizeWorld();
		
		// this.tilemap.replace(0, 1, 0, 0, 384, 72, 'Tile Layer 1');
		
		this.tilemap_layer.add(torches_layer);
		this.tilemap_layer.add(this.layer);
		
		this.door1 = this.game.add.sprite(6680, this.game.height - 210, 'door1');
		this.door2 = this.game.add.sprite(6680, this.game.height - 140, 'door2');
		this.door = this.game.add.group();
		this.door.add(this.door1);
		this.door.add(this.door2);
		
		// Create monsters
		this.enemy_spiders = this.game.add.group();
		this.enemy_ghosts = this.game.add.group();
		this.enemy_bats = this.game.add.group();
		this.enemy_snakes = this.game.add.group();
		
		var current_position = 800;
		for (var i = 0; i < 15; i++) {
			var random_enemy = randomIntFromInterval(1, 4);
			if (random_enemy == 1) {
				this.createEnemySpider(current_position);
			} else if (random_enemy == 2) {
				this.createEnemyBat(current_position);
			} else if (random_enemy == 3) {
				this.createEnemySnake(current_position);
			} else {
				this.createEnemyGhost(current_position);
			}
			
			current_position += 400;
		}
		this.enemies = this.game.add.group();
		this.enemies.add(this.enemy_spiders);
		this.enemies.add(this.enemy_ghosts);
		this.enemies.add(this.enemy_bats);
		this.enemies.add(this.enemy_snakes);
		
		// Create Zizo
		this.zizo = this.game.add.sprite(0, this.game.world.height - 164, 'zizo');
		this.zizo.anchor.setTo(0, 0);
		this.zizo.animations.add('run', [9, 10], 5, true);
		this.zizo.animations.add('die', [4], 1, false);
		this.zizo.play('run');
		// this.zizo.body.velocity.x = 1000;
	
		this.game.camera.follow(this.zizo);
		
		// Create umbrella
		this.umbrella = this.game.add.sprite(85, 45, 'other_items');
		this.umbrella.anchor.setTo(0.5, 0.5);
		this.umbrella.angle = 45;
		this.umbrella.animations.add('close', [0], 1, false);
		this.umbrella.animations.add('open', [1], 1, false);
		this.zizo.addChild(this.umbrella);
		this.closeUmbrella();
		
		// Initialize Scoreboard
		this.scoreboard = this.game.add.group();
		
		// Instructions
		this.instructions = this.game.add.sprite(0, 0, 'scroller_instructions');
		
		this.start_button = this.game.add.button(640, this.game.world.height - 100, 'yellow_buttons', this.killInstructions, this, 3, 3, 4);
		this.start_button.alpha = 0;
		this.start_button.anchor.setTo(0.5, 0.5);
		this.start_text = this.game.add.text(4, 0, 'START', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
		this.start_text.anchor.setTo(0.5, 0.5);
		this.start_button.addChild(this.start_text);
		
		var instruction_audio = this.game.add.audio('scroller_instruction_sound');
		instruction_audio.onStop.add(function(){
			this.game.add.tween(this.start_button).to({alpha: 1}, 500, null, true);
		}, this);
		instruction_audio.play();
	},
	
	update: function() {
		this.game.physics.collide(this.zizo,this.layer);
		this.game.physics.overlap(this.umbrella, this.enemies, this.killEnemy, null, this);
		// this.game.physics.collide(this.zizo, this.enemies, this.zizoGetsHit, null, this);
		this.game.physics.overlap(this.zizo, this.enemies, this.zizoGetsHit, null, this);
		this.game.physics.overlap(this.zizo, this.door, this.winLevel, null, this);
		
		// Flicker torches
		if (this.tilemap != null) {
			// console.log('yo');
		}
		
		
		// this.tilemap.replace(26, 38);
	},
	
	createEnemySpider: function(position) {
		var spider = this.game.add.sprite(position, this.game.world.height - 70, 'enemies');
		spider.anchor.setTo(0, 1);
		spider.animations.add('wait', [86, 87], 5, true);
		spider.animations.add('die', [85, 84], 10, false);
		spider.play('wait');
		
		this.enemy_spiders.add(spider);
	},
	
	createEnemyGhost: function(position) {
		var ghost = this.game.add.sprite(position, this.game.world.height - 80, 'enemies');
		ghost.anchor.setTo(0, 1);
		ghost.animations.add('wait', [32, 29], 5, true);
		ghost.animations.add('die', [31, 30], 10, false);
		ghost.play('wait');
		
		this.enemy_ghosts.add(ghost);
	},
	
	createEnemyBat: function(position) {
		var bat = this.game.add.sprite(position, this.game.world.height - 120, 'enemies');
		bat.anchor.setTo(0, 1);
		bat.animations.add('wait', [4, 6], 5, true);
		bat.animations.add('die', [8, 5], 10, false);
		bat.play('wait');
		
		this.enemy_bats.add(bat);
	},
	
	createEnemySnake: function(position) {
		var snake = this.game.add.sprite(position, this.game.world.height - 70, 'enemies');
		snake.anchor.setTo(0, 1);
		snake.animations.add('wait', [0, 1], 5, true);
		snake.animations.add('die', [3, 2], 10, false);
		snake.play('wait');
		
		this.enemy_snakes.add(snake);
	},
	
	killInstructions: function() {
		this.instructions.destroy();
		this.start_button.destroy();
		this.startLevel();
	},
	
	startLevel: function() {
		this.finished_level = false;
		this.scoreboard.destroy();
		
		// Load level specific things
		this.background = this.game.add.sprite(0, 0, this.level_images[this.current_level]['background']);
		this.background.fixedToCamera = true;
		this.background_layer.add(this.background);
		if (this.game.global_vars.diff_score < 5) {
			this.diff_level = 'easy';
		}
		else if (this.game.global_vars.diff_score < 10) {
			this.diff_level = 'medium';
		}
		else {
			this.diff_level = 'hard';
		}
		//this.level_text = this.game.add.text(80, 10, 'Level ' + this.current_level, {font: '20px kenvector_future', fill: '#fff'});
		this.difficulty_text = this.game.add.text(80, 10, 'Difficulty ' + this.game.global_vars.diff_score + ' ' + this.diff_level, {font: '20px kenvector_future', fill: '#fff'});
		//this.level_text.fixedToCamera = true;
		this.difficulty_text.fixedToCamera = true;
		
		this.background_music.play();
		
		this.displayNewProblem();
		
		//this.zizo.body.velocity.x = 200;
		this.zizo.body.velocity.x = 150;
		// this.zizo.body.velocity.x = 1000;
	},
	
	pause: function() {
		this.background_music.pause();
		this.zizo.body.velocity.x = 0;
	},
	
	unpause: function() {
		this.background_music.resume();
		this.zizo.body.velocity.x = 200;
	},
	
	displayNewProblem: function() {
		//var problem = this.game.getMathProblem('mix', this.diff_level);
		var problem = this.game.getMathProblem('greaterLess', this.diff_level);
		//var problem_text = problem.first_num + ' ? ' + problem.second_num + ' = ' + problem.answer;
		var problem_text = problem.text;
		this.answer = problem.operator;
		
		if (this.problem_background == null || !this.problem_background.exists) {
			this.problem_background = this.game.add.sprite(640, 120, 'q_bg');
			this.problem_background.anchor.setTo(0.5, 0);
			this.problem_background.alpha = 0.65;
			this.problem_background.fixedToCamera = true;
		}
		
		if (this.problem_text == null || !this.problem_text.exists) {
			this.problem_text = this.game.add.text(640, 200, problem_text, {font: '65px kenvector_future', fill: '#fff', align: 'center'});
			this.problem_text.anchor.setTo(0.5, 0.5);
			this.problem_text.fixedToCamera = true;
		} else {
			this.problem_text.setText(problem_text);
		}
	},
	
	answerPlus: function() {
		this.checkAnswer('+');
	},
	
	answerMinus: function() {
		this.checkAnswer('-');
	},
	
	answerGreater: function() {
		this.checkAnswer('>');
	},
	
	answerLess: function() {
		this.checkAnswer('<');
	},
	
	checkAnswer: function(answer) {
		if (this.answer == answer) {
			this.right_answer_sound.play();
			this.openUmbrella();
			this.score += 100;
			this.game.global_vars.diff_score += 1;
		} else {
			this.closeUmbrella();
			this.wrong_answer_sound.play();
			this.game.global_vars.diff_score -= 1;
			if (this.game.global_vars.diff_score < 0) {
				this.game.global_vars.diff_score = 0;
			}
			this.score -= 30;
			if (this.score < 0) {
				this.score = 0;
			}
		}
		
		this.displayNewProblem();
		this.score_text.setText(this.score);
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
		this.difficulty_text.fixedToCamera = true;
	},
	
	openUmbrella: function() {
		this.umbrella.play('open');
		this.umbrella.umbrellaState = 'open';
	},
	
	closeUmbrella: function() {
		this.umbrella.play('close');
		this.umbrella.umbrellaState = 'close';
	},
	
	killEnemy: function(umbrella, enemy) {
		if (this.umbrella.umbrellaState == 'open') {
			enemy.play('die');
			this.splat_sound.play();
			enemy.alive = false;
			this.closeUmbrella();
		}
	},
	
	zizoGetsHit: function(zizo, enemy) {
		if (enemy.alive && this.umbrella.umbrellaState == 'close') {
			enemy.alive = false;
			
			// this.zizo_lives--;
			// if (this.zizo_lives == 0) {
				// this.zizo.play('die');
				// this.zizo.body.velocity.x = 0;
				// enemy.body.velocity.x = 0;
				// this.already_dead = true;
				// this.background_music.stop();
				// this.lose_sound.play();
				// this.showScoreboard(false);
			// } else {
				this.ouch_sound.play();
				this.score -= 50;
				if (this.score < 0) {
					this.score = 0;
				}
				this.wrong_answer_sound.play();
				this.displayNewProblem();
				this.score_text.setText(this.score);
			// }
		}
	},
	
	winLevel: function() {
		if (this.finished_level) {	
			return;
		}
		
		this.finished_level = true;
		this.background_music.stop();
		this.win_sound.play();
		this.zizo.body.velocity.x = 0;
		this.showScoreboard(true);
	},
	
	showScoreboard: function(win) {
		this.problem_background.destroy();
		this.scoreboard = this.game.add.group();
		
		var new_pr = false;
		if (this.score > this.high_score) {
			new_par = true;
			$.cookie('race_high_score', this.score);
			this.high_score = this.score;
		}
		
		var scoreboard = this.game.add.sprite(this.game.camera.x, 0, 'score_board');
		var result_header = '';
		var result = '';
		var start_button = null;
		var start_text = '';
		
		var middle = this.game.camera.x + 640;
		
		if (win) {
			result_header = 'You Win!!';
		} else {
			result_header = 'You Lose...';
		}
		
		if (!this.game.global_vars.story_mode) {
			start_button = this.game.add.button(middle, this.game.world.height - 100, 'yellow_buttons', this.winGame, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'Menu', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		} else if (win) {
			result_header = 'You Win!!';
			start_button = this.game.add.button(middle, this.game.world.height - 100, 'yellow_buttons', this.finishLevel, this, 3, 3, 4);
			start_button.anchor.setTo(0.5, 0.5);
			start_text = this.game.add.text(4, 0, 'NEXT', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
			start_text.anchor.setTo(0.5, 0.5);
			start_button.addChild(start_text);
		} else {
			result_header = 'You Lose...';
			start_button = this.game.add.button(middle, this.game.world.height - 100, 'yellow_buttons', this.startLevel, this, 3, 3, 4);
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
		
		var header = this.game.add.text(middle, 130, result_header, {font: '75pt kenvector_future', fill: '#fff', align: 'center'});
		header.anchor.setTo(0.5, 0);
		var text = this.game.add.text(middle, 290, result, this.text_style);
		text.anchor.setTo(0.5, 0);
		
		// this.scoreboard.add(start_button);
		// this.scoreboard.add(header);
		// this.scoreboard.add(text);
		
		console.log(result);
	},
	
	finishLevel: function() {
		// this.background_layer.remove(this.background);
		// this.level_text.destroy();
		
		if (this.current_level < this.game.global_vars.num_levels) {
			this.current_level += 1;
			
			this.game.saveGame(this.state_label, this.current_level);
			
			this.startLevel();
		} else {
			this.winGame();
		}
	},
	
	winGame: function() {
		this.win_sound.stop();
		console.log('Won scroller game!');
		this.current_level = 1;
		
		this.game.world.setBounds(0, 0, 1280, 720);
		
		// Unlock this mini game
		this.game.unlockMiniGame(this.state_label);
		
		if (!this.game.global_vars.story_mode) {
			console.log('here');
			this.game.state.start('MainMenu');
		} else {
			this.game.goToNextState.call(this);
		}
	}
};