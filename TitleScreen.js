BasicGame.TitleScreen = function (game) {
};

BasicGame.TitleScreen.prototype = {
	preload: function() {
	},
	
	create: function() {
		// console.log('TitleScreen');
		// console.log('Overall score = ' + this.game.global_vars.player_overall_score);
		// this.game.global_vars.player_overall_score = 500;
		
		// this.game.add.text(0, 0, 'Title Screen', {font: '64px arial', fill: '#fff', align: 'center'});
				
		this.game.add.sprite(0, 0, 'title_screen');
		
		this.start_button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 100, 'yellow_buttons', this.clickStart, this, 3, 3, 4);
		this.start_button.anchor.setTo(0.5, 0.5);
		this.start_text = this.game.add.text(5, 0, 'Start', {font: '30pt kenvector_future', fill: '#000', align: 'center'});
		this.start_text.anchor.setTo(0.5, 0.5);
		this.start_button.addChild(this.start_text);
	},
	
	update: function() {
	},
	
	clickStart: function() {
		this.game.state.start('MainMenu');
	}
};