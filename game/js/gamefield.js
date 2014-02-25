function GameField(stage) {
	this.stage = stage;
	console.log(this.stage);

	var marker_texture = PIXI.Texture.fromImage("data/marker.png");
	this.entity_marker = new PIXI.Sprite(marker_texture);

	// creating the game field
	this.game_field = new Array();

	this.fill_up_game_field();
}

GameField.constructor = GameField;
GameField.prototype.stage = null;
GameField.prototype.game_field = null;
GameField.prototype.clicked_object_one = null;
GameField.prototype.clicked_object_two = null;
GameField.prototype.entity_marker = null;
GameField.prototype = Object.create(Object.prototype);

GameField.prototype.generate_new_entity = function(t_game_field,column,row){

	
	var etype_already_exists = true;
	var etype = Math.floor(Math.random() * 4) + 1;
	var iteration = 0;

	/*
	while(etype_already_exists){
		etype_already_exists = false;
		etype = Math.floor(Math.random() * 4) + 1;

		// left
		if(typeof t_game_field[column-1] !== "undefined" && typeof t_game_field[column-1][row] !== "undefined"
			&& t_game_field[column-1][row] != null && t_game_field[column-1][row].type == etype){
			etype_already_exists = true;
		}
		// left-2
		if(typeof t_game_field[column-2] !== "undefined" && typeof t_game_field[column-2][row] !== "undefined"
			&& t_game_field[column-2][row] != null && t_game_field[column-2][row].type == etype){
			etype_already_exists = true;
		}

		// right
		if(typeof t_game_field[column+1] !== "undefined" && typeof t_game_field[column+1][row] !== "undefined"
			&& t_game_field[column+1][row] != null && t_game_field[column+1][row].type == etype){
			etype_already_exists = true;
		}

		// right-2
		if(typeof t_game_field[column+2] !== "undefined" && typeof t_game_field[column+2][row] !== "undefined"
			&& t_game_field[column+2][row] != null && t_game_field[column+2][row].type == etype){
			etype_already_exists = true;

		}

		// up
		if(typeof t_game_field[column] !== "undefined" && typeof t_game_field[column][row-1] !== "undefined"
			&& t_game_field[column][row-1] != null && t_game_field[column][row-1].type == etype){
			etype_already_exists = true;
		}

		// up+2
		if(typeof t_game_field[column] !== "undefined" && typeof t_game_field[column][row-2] !== "undefined"
			&& t_game_field[column][row-2] != null && t_game_field[column][row-2].type == etype){
			etype_already_exists = true;
		}

		// down
		if(typeof t_game_field[column] !== "undefined" && typeof t_game_field[column][row+1] !== "undefined"
			&& t_game_field[column][row+1] != null && t_game_field[column][row+1].type == etype){
			etype_already_exists = true;
		}

		// down+2
		if(typeof t_game_field[column] !== "undefined" && typeof t_game_field[column][row+2] !== "undefined"
			&& t_game_field[column][row+2] != null && t_game_field[column][row+2].type == etype){
			etype_already_exists = true;
		}

		iteration++;
		if(iteration > 10){
			etype_already_exists = false;
		}
	} // end of while*/
	return etype;
}

GameField.prototype.clicked_on_entity = function(gamefield_entity){
	if(this.clicked_object_one == null){ // nothing got clicked so far.. so just set the first click and return
		this.clicked_object_one = gamefield_entity;

		this.entity_marker.x = 0.5;
		this.entity_marker.y = 0.5;
		this.entity_marker.position.x = this.clicked_object_one.position.x - 32;
		this.entity_marker.position.y = this.clicked_object_one.position.y - 32;
		console.log("clicked_one: " + this.clicked_object_one.to_string());
		this.stage.addChild(this.entity_marker);
		return;
	}

	this.clicked_object_two = gamefield_entity;
	console.log("clicked_two: " + this.clicked_object_two.to_string());

	// we check if the two clicked objects are next to each other
	var next_to_each_other = false;
	
	// left
	if(this.clicked_object_two.column == this.clicked_object_one.column -1 && this.clicked_object_two.row == this.clicked_object_one.row)
	{
		next_to_each_other = true;
	}

	// right
	if(this.clicked_object_two.column == this.clicked_object_one.column +1 && this.clicked_object_two.row == this.clicked_object_one.row)
	{
		next_to_each_other = true;
	}

	// up
	if(this.clicked_object_two.column == this.clicked_object_one.column && this.clicked_object_two.row == this.clicked_object_one.row -1)
	{
		next_to_each_other = true;
	}

	// down
	if(this.clicked_object_two.column == this.clicked_object_one.column && this.clicked_object_two.row == this.clicked_object_one.row +1)
	{
		next_to_each_other = true;
	}
	

	if(next_to_each_other){ // seems so, let's check if we've got some matching entities
		this.find_matching();
	}

	
	//this.swap_entity_positions(this.game_field,this.clicked_object_one,this.clicked_object_two);
	this.clicked_object_one = null;
	this.clicked_object_two = null;
	this.stage.removeChild(this.entity_marker);
}

GameField.prototype.copy_of_game_field = function(){
	//return copy = this.game_field.slice(0);
	copy = new Array();
	for(column = 0; column < 8; column++){
		copy[column] = new Array();
		for(row = 0; row < 8; row++){
			copy[column][row] = this.game_field[column][row];
		}
	}
	return copy;
}

/*
 * swaps two entites in a game_field array, returns the same game_field array
 * the column and row attribute of the entites won't be changed!
 */
GameField.prototype.swap_entities = function(t_game_field,entity_one,entity_two){
	t_game_field[entity_one.column][entity_one.row] = entity_two;
	t_game_field[entity_two.column][entity_two.row] = entity_one;
	return t_game_field;
}

/*
 * swaps the drawing position of two entities
 * C-pointers would be really great... narf!
 */
GameField.prototype.swap_entity_positions = function(t_game_field,entity_one,entity_two){
	var t_1_x = entity_one.position.x;
	var t_1_y = entity_one.position.y;
	var t_1_column = entity_one.column;
	var t_1_row = entity_one.row;
	
	entity_one.x = entity_two.position.x;
	entity_one.y = entity_two.position.y;
	entity_one.column = entity_two.column;
	entity_one.row = entity_two.row;
	t_game_field[entity_two.column][entity_two.row] = entity_one;
	
	entity_two.x = t_1_x;
	entity_two.y = t_1_y;
	entity_two.column = t_1_column;
	entity_two.row = t_1_row;
	t_game_field[t_1_column][t_1_row] = entity_two;

	return t_game_field;
}

GameField.prototype.find_matching = function(){
	/* we need to create a copy of the game field
	 * to swap clicked_object_one and ..two
	 */
	 console.log("GameField.prototype.find_matching started");
	var found_some_matching = false;

	console.log("permanent gamefield");
	this.print_game_field(this.game_field);
	
	temp_game_field = this.copy_of_game_field();
	temp_game_field = this.swap_entities(temp_game_field,this.clicked_object_one,this.clicked_object_two);
	console.log("temporary gamefield");
	this.print_game_field(temp_game_field);


	for(col = 0; col < 8; col++){
		for(row = 0; row < 8; row++){
			var found_matching_columns = this.find_in_column(temp_game_field,col,row);
			var found_matching_rows = this.find_in_row(temp_game_field,col,row);
			console.log(found_matching_rows);

			// TODO: optimize the code below

			var found_matching_entities = null;
			if(found_matching_columns){
				found_matching_entities = found_matching_columns;
			}

			if(found_matching_columns && found_matching_rows){
				found_matching_entities = found_matching_columns.concat(found_matching_rows);	
			}
			
			if(!found_matching_columns && found_matching_rows){
				found_matching_entities = found_matching_rows;
			}

			
			if(found_matching_entities){ // check if we found machting entities
				// if found_matching contains one of the clicked objects, we need to change their drawing position on the pixie stage too
				if(_.indexOf(found_matching_entities,this.clicked_object_one) || _.indexOf(found_matching_entities,this.clicked_object_two)){
					console.log("swapping positions");
					this.swap_entity_positions(this.game_field,this.clicked_object_one,this.clicked_object_two);
				}
				this.remove_entites(found_matching_entities); // removing the entities from the game_field
				var sound = new Howl({
  					urls: ['/data/explosion.wav']
				}).play();

				console.log("after removal gamefield");
				this.print_game_field(this.game_field);
			}
		} // end of row loop
	} // end of col loop

	if(this.rebuild_game_field()){
		//this.find_matching();
	}
	console.log("GameField.prototype.find_matching finished");
}

GameField.prototype.find_in_column = function(t_game_field,col,row){
	var found_matching = new Array();
	var stop_searching = false;

	for(in_col = col; in_col < 7; in_col++){
		if(stop_searching == false){
			console.log("find_in_column checking: " + in_col + "/" + row);
			current_entity = t_game_field[in_col][row];
			next_entity = t_game_field[in_col+1][row];
			
			if(current_entity && next_entity && (current_entity.type == next_entity.type)){
				console.log("find_in_column -> "+ current_entity.to_string() + "==" + next_entity.to_string());
				if(_.indexOf(found_matching,current_entity) == -1){ // check to see if we already added it... thanx to underscore for the simplicity
					found_matching.push(current_entity);
				}
				if(_.indexOf(found_matching,next_entity) == -1){ // check to see if we already added it... 
					found_matching.push(next_entity);
				}
			}else{
				stop_searching = true;
			}
		} // stop_searching condition
		
	} // end of loop

	// we need at least 3 matching items!
	console.log(found_matching);
	if(found_matching.length >= 3){
		console.log("find_in_column: we found matching >= 3");
		
		return found_matching;
	}
	return false;
} // end of find_in_column

GameField.prototype.find_in_row = function(t_game_field,col,row){
	var found_matching = new Array();
	var stop_searching = false;

	for(in_row = row; in_row < 7; in_row++){
		if(stop_searching == false){
			//console.log("find_in_column checking: " + in_col + "/" + row);
			current_entity = t_game_field[col][in_row];
			next_entity = t_game_field[col][in_row+1];
			
			if(current_entity && next_entity && (current_entity.type == next_entity.type)){
				console.log("find_in_row -> "+ current_entity.to_string() + "==" + next_entity.to_string());
				if(_.indexOf(found_matching,current_entity) == -1){ // check to see if we already added it... thanx to underscore for the simplicity
					found_matching.push(current_entity);
				}
				if(_.indexOf(found_matching,next_entity) == -1){ // check to see if we already added it... 
					found_matching.push(next_entity);
				}
			}else{
				stop_searching = true;
			}
		} // stop_searching condition
		
	} // end of loop

	// we need at least 3 matching items!
	if(found_matching.length >= 3){
		console.log("find_in_row: we found matching >= 3");
		console.log(found_matching);
		return found_matching;
	}
	return false;
} // end of find_in_row

GameField.prototype.remove_entites = function(entities){
	for(i = 0; i < entities.length; i++){
		this.remove_entity(entities[i]);
	}
}

GameField.prototype.remove_entity = function(entity){
	if(this.game_field[entity.column][entity.row]){
		this.stage.removeChild(this.game_field[entity.column][entity.row]);
		this.game_field[entity.column][entity.row] = null;
		entity = null;	
	}	
}

GameField.prototype.rebuild_game_field = function(){

	var found_something_to_move_down = false;
	//while(this.move_down_all_entities()){
	//	found_something_to_move_down = true;
	//}
	

	//this.fill_up_game_field();
	return found_something_to_move_down;
}

GameField.prototype.move_down_all_entities = function(){
	var check = false;

	for(column = 0; column < 8; column++){
		for(row = 7; row >= 0; row--){
			// is the current entity in the loop not empty?
			if(this.game_field[column][row] != null){
				// check if the entity place below is empty
				if(typeof this.game_field[column][row+1] !== "undefined" && this.game_field[column][row+1] == null){
					// ok, move it down
					
					this.game_field[column][row].row +=1;
					this.game_field[column][row].position.y += 64;
					this.game_field[column][row+1] = this.game_field[column][row];
					this.game_field[column][row] = null;
					check = true;
				}
			}
		} // row loop
	} // column loop

	//if(check){
	//	this.move_down_all_entities();
	//}

	console.log("after move down gamefield");
	this.print_game_field(this.game_field);

	return check;
} // end of move_down_all_entities

GameField.prototype.fill_up_game_field = function(){
	for(x = 0; x < 8; x++){
		if(typeof this.game_field[x] === "undefined"){
			this.game_field[x] = new Array();		
		}
	  
	  	for(y = 0; y < 8; y++){
	  		if(this.game_field[x][y] == null){
	  			var etype = this.generate_new_entity(this.game_field,x,y);
	    		var game_field_entity = new GameFieldEntity(this,x,y,etype);    
	    		this.game_field[x][y] = game_field_entity;
	  		}
	  	} // y
	} // x
}

GameField.prototype.print_game_field = function(t_game_field){
	console.log("--------------------------------");
	for(row = 0; row < 8; row++){
		var col_str = ""
		for(column = 0; column < 8; column++){
			if(t_game_field[column][row] == null){
				col_str += "X/X/X|";
			}else{
				col_str += t_game_field[column][row].to_string() + "|";	
			}
			
		}
		console.log(row+": " + col_str);
	}
}