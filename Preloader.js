BasicGame.Preloader = function (game) {
	this.ready = false;
};

BasicGame.Preloader.prototype = {
	preload: function() {
		// Loading text
		text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Loading', {font: '65px kenvector_future', fill: '#fff'});
		text.anchor.setTo(0.5, 0.5);
		
		// Preload bar
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.height - 300, 'preloaderBar');
		this.preloadBar.x = this.preloadBar.x - (this.preloadBar.width / 2);
		this.load.setPreloadSprite(this.preloadBar);
		
		// Menus
		this.game.load.image('title_screen', 'assets/title_screen.png');
		this.game.load.image('main_menu_bg', 'assets/main_menu.png');
		this.game.load.image('jump_button', 'assets/main_menu/jumpbutton.png');
		this.game.load.image('jump_button_locked', 'assets/main_menu/jumpbuttonlocked.png');
		this.game.load.image('race_button', 'assets/main_menu/racebutton.png');
		this.game.load.image('race_button_locked', 'assets/main_menu/racebuttonlocked.png');
		this.game.load.image('sidescroll_button', 'assets/main_menu/sidescrollbutton.png');
		this.game.load.image('sidescroll_button_locked', 'assets/main_menu/sidescrollbuttonlocked.png');
		this.game.load.image('boss_button', 'assets/main_menu/bossbutton.png');
		this.game.load.image('boss_button_locked', 'assets/main_menu/bossbuttonlocked.png');
		this.game.load.image('resume_button', 'assets/main_menu/resumebutton.png');
		this.game.load.image('resume_button_locked', 'assets/main_menu/resumegray.png');
		this.game.load.image('story_button', 'assets/main_menu/storybutton.png');
		
		// Backgrounds
		this.game.load.image('bg_shroom', 'assets/backgrounds/bg_shroom_lg.png');
		this.game.load.image('bg_marsh', 'assets/backgrounds/bg_marsh_lg.png');
		this.game.load.image('bg_desert', 'assets/backgrounds/bg_desert_lg.png');
		this.game.load.image('bg_castle', 'assets/backgrounds/bg_castle_lg.png');
		this.game.load.image('bg_grasslands', 'assets/backgrounds/bg_grasslands_lg.png');
		this.game.load.image('bg_green2', 'assets/racing_game/bg_green2.png');
		this.game.load.image('bg_green3', 'assets/racing_game/bg_green3.png');
		this.game.load.image('bg_boss', 'assets/boss_game/bg_boss.png');
		
		// Instructions
		this.game.load.image('boss_instructions', 'assets/instructions/bossinstructions.png');
		this.game.load.image('collect_instructions', 'assets/instructions/collectinstructions.png');
		this.game.load.image('race_instructions', 'assets/instructions/raceinstructions.png');
		this.game.load.image('scroller_instructions', 'assets/instructions/scrollerinstructions.png');
		this.game.load.image('score_board', 'assets/score_board.png');
		this.game.load.audio('race_instruction_sound', 'assets/instructions/Raceinstruct.ogg');
		this.game.load.audio('collect_instruction_sound', 'assets/instructions/Collectinstruct.ogg');
		this.game.load.audio('scroller_instruction_sound', 'assets/instructions/Scrollinstruct.ogg');
		this.game.load.audio('boss_instruction_sound', 'assets/instructions/Bossinstruct.ogg');
		
		// User interfaces
		this.game.load.spritesheet('button', 'assets/buttons.png', 193, 71);
		this.game.load.spritesheet('answer_button_bg', 'assets/answer_button_background.png', 72, 72);
		this.game.load.atlasXML('buttons', 'assets/ui/blueSheet.png', 'assets/ui/blueSheet.xml');
		this.game.load.atlasXML('green_buttons', 'assets/ui/greenSheet.png', 'assets/ui/greenSheet.xml');
		this.game.load.atlasXML('yellow_buttons', 'assets/ui/yellowSheet.png', 'assets/ui/yellowSheet.xml');
		this.game.load.image('pause_icon', 'assets/ui/pause_icon.png');
		this.game.load.image('black_screen', 'assets/black.png');
		this.game.load.image('white_screen', 'assets/white_screen.png');
		this.game.load.image('q_bg', 'assets/qborder.png');
		
		// Player sprites
		this.game.load.atlasXML('zizo', 'assets/aliens/alienGreen.png', 'assets/aliens/alienGreen.xml');
		this.game.load.atlasXML('addi', 'assets/aliens/alienPink.png', 'assets/aliens/alienPink.xml');
		this.game.load.atlasXML('alienBeige', 'assets/aliens/alienBeige.png', 'assets/aliens/alienBeige.xml');
		this.game.load.atlasXML('alienBlue3', 'assets/aliens/alienBlue3.png', 'assets/aliens/alienBlue.xml');
		this.game.load.atlasXML('alienYellow4', 'assets/aliens/alienYellow4.png', 'assets/aliens/alienYellow.xml');
		this.game.load.atlasXML('enemies', 'assets/side_scroller/enemies.png', 'assets/side_scroller/enemies.xml');
		this.game.load.atlasXML('items', 'assets/side_scroller/items_spritesheet.png', 'assets/side_scroller/items_spritesheet.xml');
		this.game.load.spritesheet('other_items', 'assets/side_scroller/other_items.png', 70, 69);
		this.game.load.image('door1', 'assets/door_openTop.png');
		this.game.load.image('door2', 'assets/door_openMid.png');
		this.game.load.spritesheet('km', 'assets/aliens/km.png', 75, 98);
		
		// Tilesets
		this.game.load.image('base_tileset', 'assets/tiles_spritesheet2.png');
		
		// Audio
		this.game.load.audio('win_sound', 'assets/common_sounds/Kids Cheering-SoundBible.com-681813822.ogg');
		this.game.load.audio('lose_sound', 'assets/common_sounds/Sad-Trombone.ogg');
		this.game.load.audio('right_answer_sound', 'assets/common_sounds/right_answer_ding.ogg');
		this.game.load.audio('wrong_answer_sound', 'assets/common_sounds/Banana Peel Slip Zip-SoundBible.com-803276918.ogg');
		this.game.load.audio('ouch_sound', 'assets/common_sounds/ow.ogg');
		this.game.load.audio('main_menu_music', 'assets/titlescreen.ogg');
		
		// Race Game Audio
		this.game.load.audio('racing_background_music', 'assets/racing_game/34_Chariot - Stage 4.ogg');
		this.game.load.audio('racing_on_ur_mark', 'assets/racing_game/On_ur_mark.ogg');
		this.game.load.audio('racing_get_set', 'assets/racing_game/Get_set.ogg');
		this.game.load.audio('racing_go', 'assets/racing_game/Go.ogg');
		
		// Scroller Game Audio
		this.game.load.audio('scroller_background_music', 'assets/side_scroller/Decktonic_-_09_-_Night_Drive.ogg');
		this.game.load.audio('splat_sound', 'assets/common_sounds/87535__flasher21__splat.ogg');
		
		// Boss Game Audio
		this.game.load.audio('boss_background_music', 'assets/boss_game/Battle_Special.ogg');
		this.game.load.audio('lasersound', 'assets/boss_game/lasersound.ogg');
		this.game.load.audio('rocksound', 'assets/boss_game/rocksound2.ogg');
	
		// Story Opener files
		this.game.load.image('cutscene_opener_bg', 'assets/cutscenes/open/bg_scene1.png');
		this.game.load.image('cutscene_opener_addi_1', 'assets/cutscenes/open/addi_dialogue_0.png');
		this.game.load.image('cutscene_opener_big_tree', 'assets/cutscenes/open/bigtree.png');
		this.game.load.image('cutscene_opener_km_new', 'assets/cutscenes/open/km_new.png');
		this.game.load.image('cutscene_opener_km_2', 'assets/cutscenes/open/km_new_2.png');
		this.game.load.image('cutscene_opener_km_positive', 'assets/cutscenes/open/km_positive.png');
		this.game.load.image('cutscene_opener_zizo_1', 'assets/cutscenes/open/zizo_dialogue_1.png');
		this.game.load.image('cutscene_opener_zizo_2', 'assets/cutscenes/open/zizo_dialogue_2.png');
		this.game.load.image('cutscene_opener_zizo_3', 'assets/cutscenes/open/z_youwont.png');
		this.game.load.image('cutscene_opener_zizo_stronghold', 'assets/cutscenes/open/z_subtraction.png');
		this.game.load.image('cutscene_opener_zizo_hmwhatsthis', 'assets/cutscenes/open/z_hmwhatsthis.png');
		this.game.load.image('cutscene_opener_zizo_million', 'assets/cutscenes/open/z_million.png');
		this.game.load.image('cutscene_opener_zizo_perfect', 'assets/cutscenes/open/z_perf.png');
		this.game.load.image('cutscene_opener_newspaper', 'assets/cutscenes/open/newspaper.png');
		this.game.load.image('cutscene_opener_newspaper2', 'assets/cutscenes/open/newspaper2.png');
		this.game.load.audio('story_Addi8+5', 'assets/cutscenes/open/Addi8+5.ogg');
		this.game.load.audio('story_KmAreYouPositive', 'assets/cutscenes/open/KmAreYouPositive.ogg');
		this.game.load.audio('story_KmPlusPlusPlus', 'assets/cutscenes/open/KmPlusPlusPlus.ogg');
		this.game.load.audio('story_KmZizoMyBoy', 'assets/cutscenes/open/KmZizoMyBoy.ogg');
		this.game.load.audio('story_NButLittleDoTheyKnow', 'assets/cutscenes/open/NButLittleDoTheyKnow.ogg');
		this.game.load.audio('story_NOurStoryBegins', 'assets/cutscenes/open/NOurStoryBegins.ogg');
		this.game.load.audio('story_NOurHeroZizo', 'assets/cutscenes/open/NOurHeroZizo.ogg');
		this.game.load.audio('story_Z4+7', 'assets/cutscenes/open/Z4+7.ogg');
		this.game.load.audio('story_Zperfect', 'assets/cutscenes/open/Zperfect.ogg');
		this.game.load.audio('story_Zsubstrong', 'assets/cutscenes/open/Zsubstrong.ogg');
		this.game.load.audio('story_Zwontgetaway', 'assets/cutscenes/open/Zwontgetaway.ogg');
		this.game.load.audio('story_Zwhatdo', 'assets/cutscenes/open/Zwhatdo.ogg');
		this.game.load.audio('story_Zwhatsthis', 'assets/cutscenes/open/Zwhatsthis.ogg');
		this.game.load.audio('story_Zmillionmiles', 'assets/cutscenes/open/Zmillionmiles.ogg');
		this.game.load.audio('story_swish', 'assets/cutscenes/open/swish.ogg');
		this.game.load.audio('story_wind', 'assets/cutscenes/open/wind.ogg');
		this.game.load.audio('story_Znewspaper', 'assets/cutscenes/open/Zracetomorrow.ogg');
		
		// Scene 2 (after winning flying car, arriving at castle, inside castle) files
		this.game.load.image('zizocar', 'assets/cutscenes/2/flyingcar.png');
		this.game.load.image('justcar', 'assets/cutscenes/2/justcar.png');
		this.game.load.image('umbrella', 'assets/cutscenes/2/umbrella.png');
		this.game.load.image('cutscene_2_outside', 'assets/cutscenes/2/bg_s2_outside.png');
		this.game.load.image('cutscene_2_inside', 'assets/cutscenes/2/bg_s2_inside.png');
		this.game.load.image('cutscene_2_zfinally', 'assets/cutscenes/2/z_s2_finally.png');
		this.game.load.image('cutscene_2_kmonce', 'assets/cutscenes/2/km_s2.png');
		this.game.load.image('cutscene_2_ano', 'assets/cutscenes/2/addi_s2.png');
		this.game.load.image('cutscene_2_zalmost', 'assets/cutscenes/2/z_s2_almost.png');
		this.game.load.image('cutscene_2_zumbrella', 'assets/cutscenes/2/z_s2_umbrella.png');
		this.game.load.audio('story_Ncar', 'assets/cutscenes/2/NCar.ogg');
		this.game.load.audio('story_Zfinally', 'assets/cutscenes/2/Zfinally.ogg');
		this.game.load.audio('story_KMonce', 'assets/cutscenes/2/KmOnceICover.ogg');
		this.game.load.audio('story_Ano', 'assets/cutscenes/2/AddiNo.ogg');
		this.game.load.audio('story_Zalmost', 'assets/cutscenes/2/Z-almostthere.ogg');
		this.game.load.audio('story_Zumbrella', 'assets/cutscenes/2/Zumbrella.ogg');
		
		// Scene 3 (before boss fight) files
		this.game.load.image('cutscene_3_bg', 'assets/cutscenes/3/scene3_low.png');
		this.game.load.image('cutscene_3_z1', 'assets/cutscenes/3/z_bf1.png');
		this.game.load.image('cutscene_3_z2', 'assets/cutscenes/3/z_bf2.png');
		this.game.load.image('cutscene_3_a1', 'assets/cutscenes/3/a_bf1.png');
		this.game.load.image('cutscene_3_km1', 'assets/cutscenes/3/km_bf1.png');
		this.game.load.image('cutscene_3_km2', 'assets/cutscenes/3/km_bf2.png');
		this.game.load.audio('story_Zaddi', 'assets/cutscenes/3/Z-addi.ogg');
		this.game.load.audio('story_Zlethergo', 'assets/cutscenes/3/Z-lethergo.ogg');
		this.game.load.audio('story_Azizo', 'assets/cutscenes/3/Addi-3.ogg');
		this.game.load.audio('story_KMwell', 'assets/cutscenes/3/KmWellWellWell.ogg');
		this.game.load.audio('story_KMtry', 'assets/cutscenes/3/KmTryAndStopMe.ogg');
		
		
		// Scene 4 (end scene) files
		this.game.load.image('cutscene_4_bg', 'assets/cutscenes/4/scene4.png');
		this.game.load.image('cutscene_4_addi1', 'assets/cutscenes/4/a_dia1.png');
		this.game.load.image('cutscene_4_addi2', 'assets/cutscenes/4/a_dia2.png');
		this.game.load.image('cutscene_4_zizo1', 'assets/cutscenes/4/z_dia1.png');
		this.game.load.image('cutscene_4_km1', 'assets/cutscenes/4/km_dia1.png');
		this.game.load.audio('story_AddiThanks', 'assets/cutscenes/4/Addi-4.ogg');
		this.game.load.audio('story_AddiGoHome', 'assets/cutscenes/4/Addi-5.ogg');
		this.game.load.audio('story_ZizoAreYouOkay', 'assets/cutscenes/4/Z-areuok.ogg');
		this.game.load.audio('story_KMCurse', 'assets/cutscenes/4/KmCurseYou.ogg');
		
		// Credits
		this.game.load.image('credits', 'assets/credits.png');
		this.game.load.audio('credits_music', 'assets/credits.ogg');
	},
	
	create: function() {
		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;
		this.game.state.start('TitleScreen');
	}
};