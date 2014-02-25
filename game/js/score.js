function Score(stage){
	this.points = 0;
	PIXI.Text.call(this,"Score: " + this.points, {font:"30px Arial", fill:"black"});
	stage.addChild(this);
	this.position.y = 550;
	this.points_to_add = 0;
}

Score.constructor = Score;
Score.prototype.points = null;
Score.prototype.points_to_add = null;
Score.prototype = Object.create(PIXI.Text.prototype);

Score.prototype.update = function(){
	if(this.points_to_add > 10){
		this.points += 10;
		this.points_to_add -= 10;
		this.setText("Score: " + this.points);
	}
}