import Computer from './computer.js'
import Game, { Colors } from './game.js'

function getElements() {
  let elements = {}

  for(let element of document.querySelectorAll('.js')) {
    if(element.id !== '' || element.id != null) {
      elements[element.id] = element
    }
  }
  
  return elements
}


function checkEndGameConditions(action) {
  if(action.gameOver) {
    if(action.winner) {
      if(action.winner === Colors.Red)    (ui.PlayerOneTurn.classList.add('Winner'))
      if(action.winner === Colors.Yellow) (ui.PlayerTwoTurn.classList.add('Winner'))
    } else {
      // game is tied
    }
  }
}


function delay(ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(clearTimeout(timer))
    }, ms)
  })
}


async function onColumnSelect(event) {
  if(game.turn === Colors.Yellow) return
  const tiles = Array.from(ui.GameContainer.children)
  const col = tiles.indexOf(event.target) % 7
  const humanAction = game.dropTile(col)
  if(!humanAction.valid) return
  render()
  checkEndGameConditions(humanAction)
  await delay(3000)
  const computerChoice = computer.getOptimalColumn(game.board)
  const computerAction = game.dropTile(computerChoice)
  render()
  checkEndGameConditions(computerAction)
}

function addTile(row, col, value) {
  const div = document.createElement('div')
  div.style.gridRow = row + 1
  div.style.gridCol = col + 1
  div.classList.add(`Slot`)
  div.classList.add(`Slot--${value}`)
  div.addEventListener('click', onColumnSelect, false)
  ui.GameContainer.appendChild(div)
}

function render() {
  ui.GameContainer.innerHTML = ''
  ui.PlayerOneTurn.classList.toggle('Turn--Focussed')
  ui.PlayerTwoTurn.classList.toggle('Turn--Focussed')
  for(let row = 0; row < game.board.height; row++) {
    for(let col = 0; col < game.board.width; col++) {
      addTile(row, col, game.board.getValueAt(row, col))
    }
  }
}

const game = new Game()
const computer = new Computer(Colors.Yellow)
const ui = getElements()

render()