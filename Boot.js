BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

	preload: function () {
		// Load images required for Preloader state
		this.load.image('preloaderBar', 'assets/preload_bar.png');
	},

	create: function () {		
		this.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
		this.stage.scale.pageAlignHorizontally = true;
		this.stage.scale.setScreenSize(true);
		
		//	Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
		this.game.input.maxPointers = 1;

		//	Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
		this.game.stage.disableVisibilityChange = true;
		
		this.game.state.start('Preloader');
	}

};