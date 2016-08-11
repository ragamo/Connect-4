import PIXI from 'pixi.js';
import {Howl} from 'howler';
import TWEEN from 'tween.js';

import Stage from '../../engine/Stage';
import Button from '../../engine/Button';

import Connect4UI from './Connect4UI';
import Connect4AI from './third/C4.AI.js';
import Connect4Util from './Connect4Util';
import Connect4Player from './Connect4Player';

import {particles} from 'pixi-particles';
import configParticles from './config/particles';

/**
 * Main game class
 */
export default class Connect4 extends Stage {

	/**
	 * Constructor
	 * 
	 * @param  {Engine}  game Game instance
	 * @param  {Boolean} vsAI If 2nd player should be an AI
	 */
	constructor(game, vsAI = false) {
		super();
		this.game = game;

		this.isAnimating = false;

		//Initial clean map
		this.map = [ 				//7x6
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0]
		];

		//Players
		this.player1 = new Connect4Player('Player red','tokenRed');
		this.player2 = new Connect4Player('Player yellow'+(vsAI?' (AI)':''),'tokenYellow', !vsAI);
		this.currentPlayer = this.player1;

		//Some game logic
		this.util = new Connect4Util(this);

		//Load the AI
		if(vsAI) {
			this.player1.opponent = this.player2;
			this.player2.opponent = this.player1;

			this.AI = new Connect4AI(this, this.player2, 5);
		}
	}

	/**
	 * Preload the on-stage assets
	 * 
	 * @return {Object} Assets to be load
	 */
	preload() {
		return {
			board: 'assets/connect4/board.png',
			arrowDefault: 'assets/connect4/arrowDefault.png',
			arrowHover: 'assets/connect4/arrowHover.png',
			tokenRed: 'assets/connect4/tokenRed.png',
			tokenYellow: 'assets/connect4/tokenYellow.png',
			buttonDefault: 'assets/menu/buttonDefault.png',
			buttonHover: 'assets/menu/buttonHover.png',
			buttonActive: 'assets/menu/buttonActive.png',
			particle: 'assets/connect4/particle.png',
			soundCoin: 'assets/connect4/sounds/coin.mp3'
		}
	}

	/**
	 * Render the UI
	 */
	render() {
		this.UI = new Connect4UI(this);
	}

	/**
	 * Executed on every frame
	 * More info in engine/Stage class
	 */
	update(elapsedTime, time) {
		if(this.particles)
			this.particles.update(elapsedTime);

		if(this.tween)
			this.tween.update(time);
	}

	/**
	 * Change the current player
	 * and start AI turn in case
	 */
	changeCurrentPlayer() {
		this.currentPlayer = 
			(this.currentPlayer == this.player1) ?
				this.player2 : this.player1;

		//Update the movement tip
		this.tip.text = this.currentPlayer.name+' moves';

		//Start AI movement
		if(!this.currentPlayer.human) {
			let bestCol = this.AI.findBestCol();

			//Add some delay for end the animations
			setTimeout(() => {
				this.dropToken(bestCol);
			}, 1000);
		}
	}

	/**
	 * Animation for when a user drop a new token
	 * 
	 * @param  {Number} index  Column ID, from 0 to 6
	 */
	dropToken(colIndex) {
		if(!this.isAnimating) {
			this.isAnimating = true;

			//Create the token
			let token = new PIXI.Sprite.fromImage(this.resources[this.currentPlayer.color]);
			token.position.set(95+(90*colIndex), -70); //Initial pos
			this.addChild(token);

			//Calculate the row
			let rowIndex = this.util.getDropRow(colIndex);
			if(rowIndex >= 0) 
				this.map[rowIndex][colIndex] = this.currentPlayer;

			//Check if win
			if(this.util.findConnected().length >= 4) {
				this.UI.gameOver(this.currentPlayer.name+' win!');

			} else {
				//Change player
				this.changeCurrentPlayer();
			}

			//Drop animation
			let finalYPos = 66+(80*rowIndex);
			this.tween = new TWEEN.Tween({
				x: token.position.x,
				y: token.position.y
			})
			.to({
				x: token.position.x,
				y: finalYPos
			}, 250)
			.easing(TWEEN.Easing.Bounce.Out)
			.onUpdate(function() {
				token.position.y = this.y;
			})
			.onComplete(() => {
				//For some reason this method kill the particle's update method
			})
			.start();

			//Not fancy, but fix the onComplete problem.
			setTimeout(() => {
				this.createParticles(token.position.x+35, finalYPos+35, 100, () => {
					this.isAnimating = false;
				});
			}, 150);

			//Play some sound
			new Howl({
				src: [this.resources.soundCoin]
			}).play();
		}
	}

	/**
	 * Create some particles effect
	 * 
	 * @param  {Number} x  X Pos
	 * @param  {Number} y  Y Pos
	 * @param  {Number} ms Duration of particles effect
	 */
	createParticles(x = 0, y = 0, ms = 100, callback = () => {}) {
		if(this.particles)
			this.particles.cleanup();

		let particlesContainer = new PIXI.Container();
		this.particles = new PIXI.particles.Emitter(particlesContainer, this.resources.particle, configParticles);
		
		this.particles.emit = true;
		setTimeout(() => { 
			this.particles.emit = false; 
			callback();
		}, ms);

		particlesContainer.position.set(x,y);
		this.addChild(particlesContainer);		
	}

}