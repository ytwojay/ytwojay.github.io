BasicGame.Credits = function (game) {
	this.music = null;
};

BasicGame.Credits.prototype = {
	preload: function() {
	},
	
	create: function() {
		this.game.add.sprite(0, 0, 'cutscene_opener_bg');
		var credits = this.game.add.sprite(this.game.world.centerX, 720, 'credits');
		credits.anchor.setTo(0.5, 0);
		this.music = this.game.add.audio('credits_music', 1, true);
		
		// Back to main menu
		var main_menu_button = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 20, 'yellow_buttons', this.backToMainMenu, this, 3, 3, 4);
		main_menu_button.alpha = 0;
		main_menu_button.anchor.setTo(0.5, 0.5);
		main_menu_button_text = this.game.add.text(2, 0, 'Main Menu', {font: '25px kenvector_future', fill: '#000', align: 'center'})
		main_menu_button_text.anchor.setTo(0.5, 0.5);
		main_menu_button.addChild(main_menu_button_text);
		
		var move = this.game.add.tween(credits).to({y:-2000}, 15000, null, false);
		move.onComplete.add(function(){
			this.game.add.tween(main_menu_button).to({alpha: 1}, 1000, null, true);
			
			var addi = this.game.add.sprite(this.game.world.centerX + 35, this.game.world.centerY + 73, 'addi');
			addi.anchor.setTo(0.5, 0);
			
			var zizo = this.game.add.sprite(this.game.world.centerX - 35, this.game.world.centerY + 73, 'zizo');
			zizo.anchor.setTo(0.5, 0);
		}, this);
		
		move.start();
		this.music.play('', 0, 1, false);
		
		// Delete saved game
		this.game.deleteSavedState();
	},
	
	update: function() {
	},
	
	backToMainMenu: function() {
		this.music.stop();
		// this.game.state.start('MainMenu');
		window.location.reload();
	}
};