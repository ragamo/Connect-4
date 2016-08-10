import PIXI from 'pixi.js';
import Button from '../../engine/Button';
import Connect4 from './Connect4';

/**
 * Every related to the Game UI
 */
export default class Connect4UI {

	/**
	 * Constructor
	 * 
	 * @param  {Stage} stage Current stage
	 */
	constructor(stage) {
		this.stage = stage;
		this.arrowButtons = [];

		//Board
		let board = new PIXI.Sprite.fromImage(stage.resources.board);
		board.position.set(80, 60);
		stage.addChild(board);

		//Arrows buttons
		for(var i=0; i<this.stage.map[0].length; i++) {
			(index => {
				let arrow = new Button({
					defaultTexture: stage.resources.arrowDefault,
					hoverTexture: stage.resources.arrowHover
				});
		
				arrow.on('click', () => {
					if(!stage.util.isColumnFull(index) && !arrow.disabled && !this.stage.isAnimating)
						stage.dropToken(index);
				});

				arrow.position.set(105+(90*index),15);

				this.arrowButtons.push(arrow);
				stage.addChild(arrow);
			})(i);
		}

		//Movement tip
		stage.tip = new PIXI.Text(stage.currentPlayer.name +' moves', {
			font: '18px Arial',
			fill: '#F7EDCA'
		});
		stage.tip.position.set(80, 555);
		stage.addChild(stage.tip);
	}

	/**
	 * This method ends the game
	 * 
	 * @param  {String} message Final message
	 */
	gameOver(message = '') {
		//Victory mesage
		this.stage.tip.text = message;

		let layout = new PIXI.Container();
		this.stage.addChild(layout);

		//New game button
		let btnNewGame = new Button({
			defaultTexture: this.stage.resources.buttonDefault,
			hoverTexture: this.stage.resources.buttonHover,
			activeTexture: this.stage.resources.buttonActive,
			text: 'New Game'
		});
		btnNewGame.on('click', () => {
			this.stage.game.deleteStage(this.stage.name);
			this.stage.game.createStage(this.stage.name, new Connect4(this.stage.game, (this.stage.AI !== undefined)));
			this.stage.game.gotoAndPlay('menu');
		});
		layout.addChild(btnNewGame);

		//Disable arrow buttons
		for(let i in this.arrowButtons) {
			this.arrowButtons[i].disabled = true;
		}

		//Adjust layout on screen
		layout.width = 150;
		layout.height = 40;
		layout.position.set(570, 550);
	}

}