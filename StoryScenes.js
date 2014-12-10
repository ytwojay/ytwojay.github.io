var text_style = {font: '50px kenvector_future', fill: 'black', align: 'left'};

/* Scene #1 -- story introduction, before first mini game */
BasicGame.StoryOpen = function (game) {
	this.state_label = 'StoryOpen';
	this.lines = [];
	this.current_line_index = 0;
	this.current_line = null;
	this.zizo = null;
	this.addi = null;
	this.km = null;
	this.kma = null;
	this.tree = null;
	this.bubble = null;
	this.part_sprites = null;
	this.parts = [];
	this.current_part = 0;
};

BasicGame.StoryOpen.prototype = {
	preload: function() {
	},
	
	create: function() {
		this.game.add.sprite(0, 0, 'cutscene_opener_bg');
		
		this.zizo = this.game.add.sprite(600, 525, 'zizo');
		this.zizo.anchor.setTo(1, 1);
		this.zizo.frame = 6;
		
		this.addi = this.game.add.sprite(700, 525, 'addi');
		this.addi.anchor.setTo(0, 1);
		this.addi.frame = 6;
		this.addi.scale.x = -1;
		
		this.km = this.game.add.sprite(1170, 380, 'km');
		this.km.animations.add('mad', [1], 1, false);
		this.km.anchor.setTo(0, 1);
		this.km.scale.x = -1;
		this.km.angle = 30;
		this.km.frame = 7;
		
		this.tree = this.game.add.sprite(1000, 265, 'cutscene_opener_big_tree');
		
		this.part_sprites = this.game.add.group();
		
		this.parts = this.createParts();
		
		// this.current_part=10;
		this.playNextPart();
	},
	
	narrator: function(string) {
		return this.game.add.text(50, 50, string, text_style);
	},
	
	playLine: function(key) {
		this.current_line = this.game.add.audio(key);
		this.current_line.onStop.add(this.playNextPart, this);
		this.current_line.play();
	},
	
	createParts: function() {
		return [
			'',
			function() {
				this.add_sprite(0, 0, 'white_screen');
				this.part_sprites.add(this.narrator('Our story begins on a bright\n\t\tsummer day in Calculand'));
				this.playLine('story_NOurStoryBegins');
			},
			function() {
				var white = this.add_sprite(0, 0, 'white_screen');
				fade_white = this.game.add.tween(white).to({alpha: 0}, 3000, null, true);
				this.part_sprites.add(this.narrator('Our hero Zizo and his best friend\n\t\t\tAddi are hanging out,\n\t\t\t\t\t\tdoing math problems...'));
				this.playLine('story_NOurHeroZizo');
			},
			function() {		
				this.part_sprites.add(this.game.add.sprite(200, 270, 'cutscene_opener_zizo_1'));
				this.playLine('story_Z4+7');
			},
			function() {
				this.part_sprites.add(this.game.add.sprite(650, 270, 'cutscene_opener_addi_1'));
				this.playLine('story_Addi8+5');
			},
			function() {
				this.part_sprites.add(this.narrator('But little do they know,\n\t\tthey\'re being watched by\n\t\t\t\t\t\tthe evil King Minus'));
				this.playLine('story_NButLittleDoTheyKnow');
			},
			function() {
				this.part_sprites.add(this.game.add.sprite(760, 90, 'cutscene_opener_km_new'));
				this.playLine('story_KmPlusPlusPlus');
			},
			function() {
				var swish = this.game.add.audio('story_swish');
				this.km.frame = 6;
				this.km.angle = 0;
				this.km.bringToTop();
				this.kma = this.game.add.group();
				this.kma.add(this.addi);
				this.kma.add(this.km);
				var km_jump = this.game.add.tween(this.km).to( { x: 750, y: 525 }, 700, Phaser.Easing.Exponential.out, false, 100);
				km_jump.onComplete.add(function(){
					this.km.frame = 3;
					this.km.scale.x = 1;
					this.addi.frame = 4;
					this.addi.scale.x = 1;
					var km_grab = this.game.add.tween(this.kma).to({x: 400}, 500, Phaser.Easing.Exponential.out, false, 100);
					km_grab.onComplete.add(function(){
						this.zizo.frame = 4;
						this.part_sprites.add(this.game.add.sprite(200, 270, 'cutscene_opener_zizo_2'));
						this.playLine('story_Zwhatdo');
					}, this);
					km_grab.start();
					swish.play();
				}, this);
				km_jump.start();
				swish.play();
			},
			function(){
				this.addi.scale.x = -1;
				this.km.scale.x = -1;
				this.km.frame = 0;
				this.km.bringToTop();
				this.add_sprite(650, 150, 'cutscene_opener_km_2');
				this.playLine('story_KmZizoMyBoy');
			},
			function(){
				this.add_sprite(200, 270, 'cutscene_opener_zizo_3');
				this.playLine('story_Zwontgetaway');
			},
			function(){
				this.add_sprite(760, 265, 'cutscene_opener_km_positive');
				this.playLine('story_KmAreYouPositive');
			},
			function(){
				var swish = this.game.add.sound('story_swish');
				var km_leave = this.game.add.tween(this.kma).to({x:1300}, 500, Phaser.Easing.Exponential.out, false);
				km_leave.onComplete.add(this.playNextPart, this);
				km_leave.start();
				swish.play();
			},
			function(){
				this.add_sprite(170, 230, 'cutscene_opener_zizo_stronghold');
				this.playLine('story_Zsubstrong');
			},
			function(){
				this.add_sprite(170, 230, 'cutscene_opener_zizo_million');
				this.playLine('story_Zmillionmiles');
			},
			function(){
				var wind = this.game.add.audio('story_wind');
				var newspaper = this.add_sprite(this.game.world.centerX + 10, 0, 'cutscene_opener_newspaper');
				newspaper.anchor.setTo(0.5, 1);
				var paper_fall = this.game.add.tween(newspaper).to({y: 520}, 2000, Phaser.Easing.Bounce.Out, false);
				paper_fall.onComplete.add(function(){
					this.add_sprite(200, 270, 'cutscene_opener_zizo_hmwhatsthis');
					this.playLine('story_Zwhatsthis');
				}, this);
				paper_fall.start();
				wind.play();
			},
			function(){
				var newspaper = this.add_sprite(this.game.world.centerX, this.game.world.centerY, 'cutscene_opener_newspaper2');
				newspaper.anchor.setTo(0.5, 0.5);
				this.playLine('story_Znewspaper');
			},
			function(){
				this.zizo.frame = 0;
				this.add_sprite(200, 270, 'cutscene_opener_zizo_perfect');
				this.playLine('story_Zperfect');
			},
			function(){
				var black = this.add_sprite(0, 0, 'black_screen');
				black.alpha = 0;
				var fade_black = this.game.add.tween(black).to({alpha: 1}, 1000, Phaser.Easing.Exponential.out, false);
				fade_black.onComplete.add(this.playNextPart, this);
				fade_black.start();
			}
		];
	},
	
	add_sprite: function(x, y, key) {
		return this.part_sprites.add(this.game.add.sprite(x, y, key));
	},
	
	next: function() {
		this.game.input.onDown.add(this.playNextPart, this);
	},
	
	playNextPart: function() {
		this.removeSprites();
		this.current_part++;
		
		if (this.current_part >= this.parts.length) {
			console.log('here');
			this.game.goToNextState.call(this);
		} else {		
			console.log(this.current_part + ' ' + this.parts.length);
			this.parts[this.current_part].call(this);
		}
	},
	
	removeSprites: function() {
		this.part_sprites.destroy();
		this.part_sprites = this.game.add.group();
	},
	
	playNextLine: function() {
		this.current_line = this.lines[this.current_line_index];
		this.current_line.play();
		this.current_line_index++;
	},
	
	update: function() {
	}
};

/* Scene #2 -- between first and second mini game */
// After winning the flying car. Arriving to castle. Inside castle. Going inside castle.
BasicGame.StoryScene2 = function (game) {
	this.state_label = 'StoryScene2';
	this.lines = [];
	this.current_line_index = 0;
	this.current_line = null;
	this.zizo = null;
	this.zizocar = null;
	this.tree = null;
	this.umbrella = null;
	this.kma = null;
	this.bubble = null;
	this.part_sprites = null;
	this.parts = [];
	this.current_part = 0;
};

BasicGame.StoryScene2.prototype = {
	preload: function() {
	},
	
	create: function() {
		this.persistent_sprites = this.game.add.group();
		this.persistent_sprites.z = 0;
		this.part_sprites = this.game.add.group();
		this.part_sprites.z = 0;
		
		this.zizo = null;
		this.umbrella = null;
		this.parts = this.createParts();
		this.collided = false;
		// this.current_part=4;
		this.playNextPart();
		// this.next();
	},
	
	narrator: function(string) {
		return this.game.add.text(50, 50, string, text_style);
	},
	
	playLine: function(key) {
		this.current_line = this.game.add.audio(key);
		this.current_line.onStop.add(this.playNextPart, this);
		this.current_line.play();
	},
	
	createParts: function() {
		return [
			'',
			function() {		
				this.add_sprite(0, 0, 'cutscene_opener_bg');
				this.add_sprite(1000, 265, 'cutscene_opener_big_tree');
				var zizocar = this.add_sprite(0, 350, 'zizocar');
				zizocar.body.velocity.x = 200;
				this.part_sprites.add(this.narrator('With his new flying car,\n\t\tzizo is able to fly to\n\t\t\t\t\t\tmath mountain'));
				this.playLine('story_Ncar');
			},
			function() {
				this.add_sprite(0, 0, 'cutscene_2_outside');
				
				var umbrella = this.add_sprite(795, 470, 'umbrella', false);
				umbrella.anchor.setTo(0.5, 0);
				umbrella.scale.x = -1;
				
				var zizocar = this.add_sprite(0, 400, 'zizocar');
				var movecar = this.game.add.tween(zizocar).to({x: 200}, 1000, null, false);
				movecar.onComplete.add(this.playNextPart, this);
				movecar.start();
			},
			function(){
				this.add_sprite(0, 0, 'cutscene_2_outside');
				this.add_sprite(200, 400, 'zizocar');
				var umbrella = this.add_sprite(795, 470, 'umbrella', false);
				umbrella.anchor.setTo(0.5, 0);
				umbrella.scale.x = -1;
				this.add_sprite(330, 230, 'cutscene_2_zfinally');
				this.playLine('story_Zfinally');
			},
			function() {		
				this.add_sprite(0, 0, 'cutscene_2_inside');
				this.add_sprite(640, 170, 'cutscene_2_kmonce');
				this.playLine('story_KMonce');
			},
			function() {
				this.add_sprite(0, 0, 'cutscene_2_inside');
				this.add_sprite(780, 120, 'cutscene_2_ano');
				this.playLine('story_Ano');
			},
			function() {		
				this.add_sprite(0, 0, 'cutscene_2_outside', true);
				this.add_sprite(200, 400, 'justcar', true);
				
				this.umbrella = this.add_sprite(795, 470, 'umbrella', true);
				this.umbrella.anchor.setTo(0.5, 0);
				this.umbrella.scale.x = -1;
				
				this.zizo = this.add_sprite(300, 430, 'zizo', true);
				this.zizo.animations.add('stand', [6], 1, false);
				this.zizo.play('stand');
				
				this.add_sprite(340, 270, 'cutscene_2_zalmost');
				this.playLine('story_Zalmost');
			},
			function() {
				this.zizo.animations.add('walk', [9, 10], 2, true);
				this.zizo.play('walk');
				this.zizo.body.velocity.x = 150;
			},
			function() {		
				this.collided = true;
				this.zizo.body.velocity.x = 0;
				this.zizo.play('stand');
				this.add_sprite(400, 270, 'cutscene_2_zumbrella');
				this.umbrella.angle = 180;
				this.umbrella.x = 75;
				this.umbrella.y = 70;
				this.zizo.addChild(this.umbrella);
				this.playLine('story_Zumbrella');
			},
			function(){
				this.zizo.play('walk');
				var move = this.game.add.tween(this.zizo).to({x: this.zizo.x + 200}, 2000, null, false);
				move.onComplete.add(this.playNextPart, this);
				move.start();
			},
			function(){
				var black = this.add_sprite(0, 0, 'black_screen');
				black.alpha = 0;
				var fade_black = this.game.add.tween(black).to({alpha: 1}, 1000, Phaser.Easing.Exponential.out, false);
				fade_black.onComplete.add(this.playNextPart, this);
				fade_black.start();
			}
		];
	},
	
	update: function() {
		if (this.collided || this.zizo == null || this.umbrella == null) {
			return;
		}
		
		this.game.physics.overlap(this.zizo, this.umbrella, this.playNextPart, null, this);
	},
	
	add_sprite: function(x, y, key, persistent) {
		persistent = typeof persistent !== 'undefined' ? persistent : false;
		
		if (persistent) {
			return this.persistent_sprites.add(this.game.add.sprite(x, y, key));
		} else {
			return this.part_sprites.add(this.game.add.sprite(x, y, key));
		}
	},
	
	next: function() {
		this.game.input.onDown.add(this.playNextPart, this);
	},
	
	playNextPart: function() {
		this.removeSprites();
		this.current_part++;
		
		if (this.current_part >= this.parts.length) {
			console.log('here');
			this.game.goToNextState.call(this);
		} else {		
			console.log(this.current_part + ' ' + this.parts.length);
			this.parts[this.current_part].call(this);
		}
	},
	
	removeSprites: function() {
		this.part_sprites.destroy();
		this.part_sprites = this.game.add.group();
	},
	
	playNextLine: function() {
		this.current_line = this.lines[this.current_line_index];
		this.current_line.play();
		this.current_line_index++;
	}
};

BasicGame.StoryScene3 = function (game) {
	this.state_label = 'StoryScene3';
	// Scene before Boss Fight
	this.lines = [];
	this.current_line_index = 0;
	this.current_line = null;
	this.zizo = null;
	this.kma = null;
	this.bubble = null;
	this.part_sprites = null;
	this.parts = [];
	this.current_part = 0;
};

BasicGame.StoryScene3.prototype = {
	preload: function() {
	},
	
	create: function() {
		this.game.add.sprite(0, 0, 'cutscene_3_bg');
		
		this.zizo = this.game.add.sprite(200, 445, 'zizo');
		this.zizo.anchor.setTo(1, 1);
		this.zizo.frame = 6;
		this.zizo.animations.add('run', [9, 10], 5, true);

		
		this.part_sprites = this.game.add.group();
		this.parts = this.createParts();
		
		// this.current_part=10;
		this.playNextPart();
	},
	
	playLine: function(key) {
		this.current_line = this.game.add.audio(key);
		this.current_line.onStop.add(this.playNextPart, this);
		this.current_line.play();
	},
	
	createParts: function() {
		return [
			'',
			function() {		
				this.part_sprites.add(this.game.add.sprite(170, 170, 'cutscene_3_z1'));
				this.playLine('story_Zaddi');
			},
			function() {
				this.part_sprites.add(this.game.add.sprite(760, 120, 'cutscene_3_a1'));
				this.playLine('story_Azizo');
			},
			function() {		
				this.part_sprites.add(this.game.add.sprite(680, 200, 'cutscene_3_km1'));
				this.playLine('story_KMwell');
			},
			function() {		
				this.part_sprites.add(this.game.add.sprite(170, 170, 'cutscene_3_z2'));
				this.playLine('story_Zlethergo');
			},
			function() {		
				this.part_sprites.add(this.game.add.sprite(660, 200, 'cutscene_3_km2'));
				this.playLine('story_KMtry');
			},
			function(){
				var black = this.add_sprite(0, 0, 'black_screen');
				black.alpha = 0;
				var fade_black = this.game.add.tween(black).to({alpha: 1}, 1000, Phaser.Easing.Exponential.out, false);
				fade_black.onComplete.add(this.playNextPart, this);
				fade_black.start();
			}
		];
	},
	
	add_sprite: function(x, y, key) {
		return this.part_sprites.add(this.game.add.sprite(x, y, key));
	},
	
	next: function() {
		this.game.input.onDown.add(this.playNextPart, this);
	},
	
	playNextPart: function() {
		this.removeSprites();
		this.current_part++;
		
		if (this.current_part >= this.parts.length) {
			console.log('here');
			this.game.goToNextState.call(this);
		} else {		
			console.log(this.current_part + ' ' + this.parts.length);
			this.parts[this.current_part].call(this);
		}
	},
	
	removeSprites: function() {
		this.part_sprites.destroy();
		this.part_sprites = this.game.add.group();
	},
	
	playNextLine: function() {
		this.current_line = this.lines[this.current_line_index];
		this.current_line.play();
		this.current_line_index++;
	},
	
	update: function() {
	}
};

/* Scene #4 -- end scene, after last mini game */
BasicGame.StoryScene4 = function (game) {
	this.state_label = 'StoryScene4';
	this.lines = [];
	this.current_line_index = 0;
	this.current_line = null;
	this.zizo = null;
	this.addi = null;
	this.km = null;
	this.kma = null;
	this.tree = null;
	this.bubble = null;
	this.part_sprites = null;
	this.parts = [];
	this.current_part = 0;
};

BasicGame.StoryScene4.prototype = {
	preload: function() {
	},
	
	create: function() {
		//this.game.add.text(0, 0, 'Story scene #4 -- \nend/win scene after game #3', {font: '65px arial', fill: '#fff'});
		//console.log('story scene #4');
		//this.game.input.onDown.add(this.game.goToNextState, this);
		
		this.game.add.sprite(0, 0, 'cutscene_4_bg');
		
		this.zizo = this.game.add.sprite(600, 445, 'zizo');
		this.zizo.anchor.setTo(1, 1);
		this.zizo.frame = 6;
		this.zizo.animations.add('run', [9, 10], 5, true);
		
		this.addi = this.game.add.sprite(700, 445, 'addi');
		this.addi.anchor.setTo(0, 1);
		this.addi.frame = 6;
		this.addi.scale.x = -1;
		this.addi.animations.add('run', [9, 10], 5, true);
		this.part_sprites = this.game.add.group();
		this.parts = this.createParts();
		
		// this.current_part=10;
		this.playNextPart();
		
	},
	
	playLine: function(key) {
		this.current_line = this.game.add.audio(key);
		this.current_line.onStop.add(this.playNextPart, this);
		this.current_line.play();
	},
	
	createParts: function() {
		return [
			'',
			function() {		
				this.part_sprites.add(this.game.add.sprite(650, 170, 'cutscene_4_addi1'));
				this.playLine('story_AddiThanks');
			},
			function() {
				this.part_sprites.add(this.game.add.sprite(200, 170, 'cutscene_4_zizo1'));
				this.playLine('story_ZizoAreYouOkay');
			},
			function() {		
				this.part_sprites.add(this.game.add.sprite(650, 170, 'cutscene_4_addi2'));
				this.playLine('story_AddiGoHome');
			},
			function() {		
				this.zizo.body.velocity.x = -150;
				this.zizo.scale.x = -1;
				this.zizo.play('run');
				this.addi.body.velocity.x = -150;
				this.addi.play('run');
				this.part_sprites.add(this.game.add.sprite(745, 220, 'cutscene_4_km1'));
				this.playLine('story_KMCurse');
			},
			function(){
				var black = this.add_sprite(0, 0, 'black_screen');
				black.alpha = 0;
				var fade_black = this.game.add.tween(black).to({alpha: 1}, 1000, Phaser.Easing.Exponential.out, false);
				fade_black.onComplete.add(this.playNextPart, this);
				fade_black.start();
			}
		];
	},
	
	add_sprite: function(x, y, key) {
		return this.part_sprites.add(this.game.add.sprite(x, y, key));
	},
	
	next: function() {
		this.game.input.onDown.add(this.playNextPart, this);
	},
	
	playNextPart: function() {
		this.removeSprites();
		this.current_part++;
		
		if (this.current_part >= this.parts.length) {
			console.log('here');
			this.game.goToNextState.call(this);
		} else {		
			console.log(this.current_part + ' ' + this.parts.length);
			this.parts[this.current_part].call(this);
		}
	},
	
	removeSprites: function() {
		this.part_sprites.destroy();
		this.part_sprites = this.game.add.group();
	},
	
	playNextLine: function() {
		this.current_line = this.lines[this.current_line_index];
		this.current_line.play();
		this.current_line_index++;
	},
	
	update: function() {
	}
};