/**
 * This is an implementation of Connect 4 Utils code by
 * https://github.com/mennovanslooten/connect4/blob/gh-pages/js/c4.util.js
 */
export default class Connect4Util {

	constructor(stage) {
		this.stage = stage;

		this.columns = this.stage.map[0].length;
		this.rows = this.stage.map.length;
	}

	/**
	 * Find if exists a four in row
	 * 
	 * @return {Array} Cell coordinates
	 */
	findConnected() {
		let connected = [];
		//                S      SE      SW     E
		let directions = [[0,1], [-1,1], [1,1], [1, 0]];

		let walkRack = (callback) => {
			for(var r=0; r<this.rows; r++) {
				for(var c=0; c<this.columns; c++) {
					let player = this.stage.map[r][c];
					if(player && player.color) {
						callback(player, c, r);
					}
				}
			}
		};

		let findConnectedInDirection = (c, r, c_delta, r_delta) => {
			let player = this.stage.map[r][c];
			let connected = [[r,c]];
			try {
				while(this.stage.map[r += r_delta][c += c_delta] === player) {
					connected.push([r,c]);
				}
			} catch (ex) { }
			return connected;
		};

		walkRack(function(player, c, r) {
			directions.forEach((direction, i) => {
				let result = findConnectedInDirection(c, r, direction[0], direction[1]);
				if(result.length >= 4) {
					connected = connected.concat(result);
				}
			});
		});

		return connected;
	}

	/**
	 * Get the next available cell for colIndex
	 * 
	 * @param  {Number} colIndex Column index
	 * @return {Number}          Current row
	 */
	getDropRow(colIndex) {
		let row = this.rows - 1;

		for(var r=0; r<this.rows; r++) {
			if(this.stage.map[r][colIndex] != 0)
				row--;
		}

		return row;
	}

	/**
	 * Verify if the current column is full with tokens
	 * 
	 * @param  {Number}  colIndex Column index
	 * @return {Boolean}          
	 */
	isColumnFull(colIndex) {
		let count = 0;
		for(let r=0; r<this.rows; r++) {
			if(this.stage.map[r][colIndex] != 0)
				count++;
		}

		return this.columns-1 == count;
	}

}