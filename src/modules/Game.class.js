export default class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState || this._createEmptyBoard();

    this.board = initialState
      ? this._cloneBoard(initialState)
      : this._createEmptyBoard();
  }

  _cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  _createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  _moveRowLeft(row) {
    const filtered = row.filter((value) => value !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    const merged = filtered.filter((value) => value !== 0);

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  _moveLeft() {
    let moved = false;

    this.board = this.board.map((row) => {
      const newRow = this._moveRowLeft(row);

      if (!this._areRowsEqual(row, newRow)) {
        moved = true;
      }

      return newRow;
    });

    if (moved) {
      this._addRandomTile();

      if (this._checkLose()) {
        this.status = 'lose';
      }

      if (this._checkWin()) {
        this.status = 'win';
      }
    }
  }

  _areRowsEqual(a, b) {
    return a.every((value, index) => value === b[index]);
  }

  _reverseRows(board) {
    return board.map((row) => [...row].reverse());
  }

  _transpose(board) {
    return board[0].map((_, col) => board.map((row) => row[col]));
  }

  _checkLose() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size - 1; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  _checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    this._moveLeft();
  }

  moveRight() {
    this.board = this._reverseRows(this.board);
    this._moveLeft();
    this.board = this._reverseRows(this.board);
  }

  moveUp() {
    this.board = this._transpose(this.board);
    this._moveLeft();
    this.board = this._transpose(this.board);
  }
  moveDown() {
    this.board = this._transpose(this.board);
    this.board = this._reverseRows(this.board);
    this._moveLeft();
    this.board = this._reverseRows(this.board);
    this.board = this._transpose(this.board);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this._cloneBoard(this.board);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'playing') {
      return;
    }

    this.score = 0;
    this.status = 'playing';

    this.board = this._createEmptyBoard();

    this._addRandomTile();
    this._addRandomTile();
  }

  restart() {
    this.status = 'idle';
    this.start();
  }
}
