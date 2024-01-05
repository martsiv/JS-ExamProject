export default class MemoryGame {
    constructor() {
      this._counterMoves = 0;
      this._counterMistakes = 0;
    }
    get counterMoves() {
      return this._counterMoves;
    }
    set counterMoves(value) {
      this._counterMoves = value;
      $moves.text(this._counterMoves);
    }
    get counterMistakes() {
      return this._counterMistakes;
    }
    set counterMistakes(value) {
      this._counterMistakes = value;
      $mistakes.text(this._counterMistakes);
    }
  }