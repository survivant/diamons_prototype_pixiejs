function GameFieldEntity(gamefield_object,pos_x,pos_y,type) {
 	
	this.gamefield_object = gamefield_object;
	this.type = type;
	this.column = pos_x;
	this.row = pos_y;

	var texture = PIXI.Texture.fromImage("data/game_entity_0"+this.type+".png");

	PIXI.Sprite.call(this, texture);
    this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	// move the sprite t the center of the screen
	this.position.x = 32 + (pos_x * 64);
	this.position.y = 32 + (pos_y * 64);
	this.setInteractive(true);
	
	// for desktop version
	this.click = function(mouseData){
		this.gamefield_object.clicked_on_entity(this);
		var sound = new Howl({
  			urls: ['data/click.wav','data/click.mp3']
			}).play();
	}

	// mobile version of click
	this.tap = function(mouseData){
		this.gamefield_object.clicked_on_entity(this);
		var sound = new Howl({
  			urls: ['data/click.wav','data/click.mp3']
			}).play();
	}
	    
	this.gamefield_object.stage.addChild(this);
}


GameFieldEntity.constructor = GameField;
GameFieldEntity.prototype.gamefield_object = null;
GameFieldEntity.prototype.type = null;
GameFieldEntity.prototype.column = null;
GameFieldEntity.prototype.row = null;
GameFieldEntity.prototype = Object.create(PIXI.Sprite.prototype);
GameFieldEntity.prototype.earned_points = null;

GameFieldEntity.prototype.to_string = function(){
	return this.column + "/" + this.row + "/" + this.type;
}