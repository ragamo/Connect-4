import PIXI from 'pixi.js';
import Stage from '../../engine/Stage';
import Button from '../../engine/Button';

export default class Menu extends Stage {

	constructor(game) {
		super();
		this.game = game;
	}

	preload() {
		return {
			background: 'assets/menu/background.jpg',
			logo: 'assets/menu/logo.png',
			buttonDefault: 'assets/menu/buttonDefault.png',
			buttonHover: 'assets/menu/buttonHover.png',
			buttonActive: 'assets/menu/buttonActive.png'
		}
	}

	render() {
		//Background
		let bg = new PIXI.Sprite.fromImage(this.resources.background);
		this.addChild(bg);

		//Logo
		let logo = new PIXI.Sprite.fromImage(this.resources.logo);
		logo.position.set(210,100);
		this.addChild(logo);

		//1P vs AI button
		let buttonVsAI = new Button({
			defaultTexture: this.resources.buttonDefault,
			hoverTexture: this.resources.buttonHover,
			activeTexture: this.resources.buttonActive,
			text: '1P vs AI'
		});
		
		buttonVsAI.on('click', () => {
			this.game.gotoAndPlay('connect4vsAI');
		});

		buttonVsAI.position.set(260, 300);
		this.addChild(buttonVsAI);

		//2 Players button
		let buttonVsHuman = new Button({
			defaultTexture: this.resources.buttonDefault,
			hoverTexture: this.resources.buttonHover,
			activeTexture: this.resources.buttonActive,
			text: '2 Players'
		});
		
		buttonVsHuman.on('click', () => {
			this.game.gotoAndPlay('connect4vsHuman');
		});

		buttonVsHuman.position.set(260, 380);
		this.addChild(buttonVsHuman);
	}

}