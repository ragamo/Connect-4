/**
 * Player bean
 */
export default class Connect4Player {

	constructor(name, color, human = true) {
		this.name = name;
		this.color = color;
		this.human = human;

		this.opponent = null;
	}

}