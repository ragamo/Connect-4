import Engine from '../engine/Engine';
import Intro from './intro/Intro';
import Menu from './menu/Menu';
import Connect4 from './connect4/Connect4';

export default class Game extends Engine {

	constructor(config) {
		super(config);

		this.createStage('menu', new Menu(this));
		this.createStage('connect4vsHuman', new Connect4(this));
		this.createStage('connect4vsAI', new Connect4(this, true));

		this.createStage('intro', new Intro(this));		
		this.gotoAndPlay('intro');
	}

}