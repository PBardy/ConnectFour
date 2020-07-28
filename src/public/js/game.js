export class Colors {

  static Red = 'Red'
  static Yellow = 'Yellow'

  static getOpposite(color) {
    if(color == Colors.Red) return Colors.Yellow
    if(color == Colors.Yellow) return Colors.Red
  }

}


export class Action {

  constructor(valid = false, colAffected = null, gameOver = false, winner = null, tied = false) {
    this.valid = valid
    this.gameOver = gameOver
    this.winner = winner
    this.tied = tied
    this.colAffected = colAffected
  }

}


export class History {

  actions = []

  get span() {
    return this.actions.length
  }

  get last() {
    if(this.actions.length === 0) return
    return this.actions.pop()
  }

  add(action) {
    this.actions.push(action)
  }

}


export class Board {

  constructor(width, height, board = []) {
    this.width = width
    this.height = height
    this.board = board
  }

  get possibleMoves() {
    let moves = []
    for(let i = 0; i < this.width; i++) {
      if(this.getCol(i).includes(false)) (moves.push(i))
    }

    return moves
  }

  getScore(color) {
    let score = 0

    const enemy = color === Colors.Red ? Colors.Yellow : Colors.Red

    // score center column
    const centerColumn = this.getCol(Math.floor(this.width / 2))
    const centerCount = centerColumn.reduce((t, x) => (x == color ? t + 1 : t), 0)
    score += centerCount * 3

    // score rows
    for(let row = 0; row < this.height; row++) {
      const choice = this.getRow(row)
      if(this.checkLine(color, choice, 4)) (score += 100)
      if(this.checkLine(color, choice, 3) && this.checkLine(false, choice, 1)) (score += 5)
      if(this.checkLine(color, choice, 2) && this.checkLine(false, choice, 2)) (score += 2)
      if(this.checkLine(enemy, choice, 2) && this.checkLine(false, choice, 1)) (score -= 2)
      if(this.checkLine(enemy, choice, 3) && this.checkLine(false, choice, 1)) (score -= 100)
    }

    // score columns
    for(let col = 0; col < this.width; col++) {
      const choice = this.getCol(col)
      if(this.checkLine(color, choice, 4)) (score += 100)
      if(this.checkLine(color, choice, 3) && this.checkLine(false, choice, 1)) (score += 5)
      if(this.checkLine(color, choice, 2) && this.checkLine(false, choice, 2)) (score += 2)
      if(this.checkLine(enemy, choice, 2) && this.checkLine(false, choice, 1)) (score -= 2)
      if(this.checkLine(enemy, choice, 3) && this.checkLine(false, choice, 1)) (score -= 100)
    }

    // score diagonals
    const diagonals = this.getDiagonals()
    for(let choice of diagonals) {
      if(this.checkLine(color, choice, 4)) (score += 100)
      if(this.checkLine(color, choice, 3) && this.checkLine(false, choice, 1)) (score += 5)
      if(this.checkLine(color, choice, 2) && this.checkLine(false, choice, 2)) (score += 2)
      if(this.checkLine(enemy, choice, 2) && this.checkLine(false, choice, 1)) (score -= 2)
      if(this.checkLine(enemy, choice, 3) && this.checkLine(false, choice, 1)) (score -= 100)
    }

    return score
  }

  copy() {
    let newArray = []
    for(let i = 0; i < this.height; i++) (newArray.push(this.board[i].slice()))
    const newBoard = new Board(this.width, this.height, newArray)
    return newBoard
  }

  create() {
    for(let row = 0; row < this.height; row++) {
      this.board[row] = []
      for(let col = 0; col < this.width; col++) {
        this.board[row][col] = false
      }
    }
  }

  withinBounds(row, col) {
    return (row >= 0 && row < this.height && col >= 0 && col < this.width)
  }

  getValueAt(row, col) {
    if(!this.withinBounds(row, col)) return
    return this.board[row][col]
  }

  setValueAt(row, col, value) {
    if(!this.withinBounds(row, col)) return
    this.board[row][col] = value
  }

  getRow(row) {
    return this.board[row]
  }

  getCol(col) {
    return this.board.map(row => row[col])
  }

  getDiagonals() {
    let array = []

    for(let k = 0; k < this.width; k++) {
      const temp = []
      for(let j = 0; j <= k; j++) {
        temp.push(this.getValueAt(k - j, j))
      }
      array.push(temp)
    }
    
    for(let k = this.width + 1; k > 0; k--) {
      const temp = []
      for(let j = k; j > 0; j--) {
        temp.push(this.getValueAt(k - j, this.width - j))
      }
      array.push(temp)
    }

    for(let k = this.width - 2; k >= 0; k--) {
      const temp = []
      for(let j = 0 ; j <= k; j++) {
        temp.push(this.getValueAt(this.width - j - 1, this.width - (k - j) - 1))
      }
      array.push(temp)
    }

    for(let k = 0; k < this.width; k++) {
      const temp = []
      for(let j = 0; j <= this.width - k; j++) {
        temp.push(this.getValueAt(k + j, j))
      }
      array.push(temp)
    }

    return array
  }

  isWon(color) {
    return this.checkRows(color) || this.checkColumns(color) || this.checkDiagonals(color)
  }

  isTied() {
    return this.board.every((value, index) => {
      return value.reduce((t, x) => (x === false ? t + 1 : t), 0) === 0
    }) 
  }

  checkLine(color, line, matching = 4) {
    return line.some((value, index) => {
      const chunk = line.slice(index, index + 4)
      const count = chunk.reduce((t, x) => (x == color ? t + 1 : t), 0)
      return count === matching
    })
  }

  checkRows(color) {
    for(let row = 0; row < this.height; row++) {
      if(this.checkLine(color, this.getRow(row))) return true
    }
  } 

  checkColumns(color) {
    for(let col = 0; col < this.width; col++) {
      if(this.checkLine(color, this.getCol(col))) return true
    }
  }

  checkDiagonals(color) {
    return this.getDiagonals().some(diagonal => this.checkLine(color, diagonal))
  }

}


export default class Game {

  turn = Colors.Red
  board = new Board(7, 6)
  history = new History()

  playerOneScore = (this.width * 4) + (this.height * 4) + 32
  playerTwoScore = (this.width * 4) + (this.height * 4) + 32

  constructor() {
    this.board.create()
  }

  get maxMoves() {
    return this.board.width * this.board.height
  }

  get opponentColor() {
    return this.turn === Colors.Red ? Colors.Yellow : Colors.Red
  }

  undo() {
    const last = this.history.last
    this.board.setValueAt(last[0], last[1], false)
  }

  hasSpace(col) {
    return col.includes(false)
  }

  dropTile(col) {
    if(!this.board.withinBounds(0, col)) return new Action()
    const column = this.board.getCol(col)
    if(!this.hasSpace(column)) return new Action()
    const row = column.lastIndexOf(false)
    this.board.setValueAt(row, col, this.turn)
    this.history.add([row, col])
    const tied = this.history.span === this.maxMoves
    const winner = this.board.isWon(this.turn)
    const action = new Action(true, col, winner, this.turn, tied)
    this.turn = this.opponentColor
    return action
  }

} 