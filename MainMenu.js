BasicGame.MainMenu = function (game) {
	this.music = null;
};

BasicGame.MainMenu.prototype = {
	preload: function() {
	},
	
	create: function() {
		console.log('Main Menu');
		this.music = this.game.add.audio('main_menu_music');
		this.music.play('', 0, 1, true);
		// console.log('Overall score = ' + this.game.global_vars.player_overall_score);
		
		// Background
		this.game.add.sprite(0, 0, 'main_menu_bg');
		
		// Mini game buttons
		if ($.cookie('HorseGame') == 'true') {
			this.game.add.button(0 * (254 + 100) + 159, 195, 'race_button', this.startRaceGame, this);
		} else {
			this.game.add.sprite(0 * (254 + 100) + 159, 195, 'race_button_locked');
		}
		
		if ($.cookie('SideScrollerGame') == 'true') {
			this.game.add.button(1 * (254 + 100) + 159, 195, 'sidescroll_button', this.startSideScrollerGame, this);
		} else {
			this.game.add.sprite(1 * (254 + 100) + 159, 195, 'sidescroll_button_locked');
		}
		
		if ($.cookie('BossGame') == 'true') {
			this.game.add.button(2 * (254 + 100) + 159, 195, 'boss_button', this.startBossGame, this);
		} else {
			this.game.add.sprite(2 * (254 + 100) + 159, 195, 'boss_button_locked');
		}
		
		// Load saved state
		if ($.cookie('saved_state') != null && $.cookie('saved_state') != '') {
			load_game_button = this.game.add.button(288, 545, 'resume_button', this.loadSavedState, this);
		} else {
			this.game.add.sprite(288, 545, 'resume_button_locked');
		}
		
		// Start story mode
		story_mode_button = this.game.add.button(this.game.width - 590, 545, 'story_button', this.startStoryMode, this);
		this.game.global_vars.story_mode = false;
	},
	
	update: function() {
	},
	
	startRaceGame: function() {
		this.music.stop();
		this.game.state.start('HorseGame');
	},
	
	startSideScrollerGame: function() {
		this.music.stop();
		this.game.state.start('SideScrollerGame');
	},
	
	startBossGame: function() {
		this.music.stop();
		this.game.state.start('BossGame');
	},
	
	startStoryMode: function() {
		this.music.stop();
		this.game.deleteSavedState();
		
		this.game.global_vars.story_mode = true;
		this.game.state.start(this.game.story_mode_state_order[0]);
	},
	
	loadSavedState: function() {
		this.music.stop();
		this.game.global_vars.story_mode = true;
		this.game.global_vars.load_saved_state = true;
		this.game.global_vars.saved_state = $.cookie('saved_state');
		this.game.global_vars.saved_level = parseInt($.cookie('saved_level'));
		
		console.log('Load saved state');
		console.log('- saved state: ' + this.game.global_vars.saved_state);
		console.log('- saved level: ' + this.game.global_vars.saved_level);
		
		this.game.state.start(this.game.global_vars.saved_state);
	},
	
	pause: function() {
	},
	
	unpause: function() {
	}
};