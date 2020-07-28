import { Colors } from './game.js'

export default class Computer {

  constructor(color) {
    this.color = color
  }

  isTerminalNode(board) {
    return board.isWon(Colors.Red) || board.isWon(Colors.Yellow) || board.isTied()
  }

  alphabeta(board, depth, alpha, beta, maximizingPlayer) {
    const options = board.possibleMoves
    const terminal = this.isTerminalNode(board)

    if(depth === 0 || terminal) {
      if(!terminal) return [null, board.getScore(Colors.Yellow)]
      if(board.isWon(Colors.Yellow)) return [null, 1000]
      if(board.isWon(Colors.Red)) return [null, -1000]
      return [null, 0]
    }

    if(maximizingPlayer) {
      let value = -1000
      let index = Math.floor(Math.random() * options.length)
      let choice = options[index]
      for(let i = 0; i < options.length; i++) {
        const col = options[i]
        const boardCopy = board.copy()
        const column = board.getCol(col)
        const row = column.lastIndexOf(false)
        boardCopy.setValueAt(row, col, Colors.Yellow)
        const newScore = this.alphabeta(boardCopy, depth - 1, alpha, beta, false)[1]
        if(newScore > value) {
          value = newScore
          choice = col
        }
        alpha = Math.max(alpha, value)
        if(alpha >= beta) break
      }

      return [choice, value]
    }

    let value = 1000
    let index = Math.floor(Math.random() * options.length)
    let choice = options[index]

    for(let i = 0; i < options.length; i++) {
      const col = options[i]
      const boardCopy = board.copy()
      const column = board.getCol(col)
      const row = column.lastIndexOf(false)
      boardCopy.setValueAt(row, col, Colors.Red)
      const newScore = this.alphabeta(boardCopy, depth - 1, alpha, beta, true)[1]
      if(newScore < value) {
        value = newScore
        choice = col
      }
      beta = Math.min(beta, value)
      if(alpha >= beta) break
    }

    return [choice, value]

  }

  getOptimalColumn(board) {
    return this.alphabeta(board.copy(), 4, -1000, 1000, true)[0]
  }

}