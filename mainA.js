class Game {
  static start(len, height, bombs) {
    new this(len, height, bombs)
  }

  constructor(len, height, bombs) {
    this.bombsNum = bombs
    this.len = len
    this.height = height

    // server
    this.bombs = this.createBombs()
    this.numb = this.createNumbers()

    this.lost = false
    this.won = false

    this.board = document.getElementsByTagName('sweeper-board')[0]
    this.board.onCellClick((i, j) => this.pop(i, j))
  }

  // server & client
  pop(i, j) {
    const cell = this.board.getCell(i, j)

    if (cell.isPopped()) return this.deleteDone(i, j)
    if (cell.isFlagged()) return

    cell.pop()

    // Bombs and numbers should be already set
    // pop should reveal the content
    if (!this.bombs[i][j]) {
      if (this.numb[i][j] != 0) cell.setNumber(this.numb[i][j])
    } else {
      cell.setBomb()
      return this.gameOver()
    }

    if (this.checkWin()) {
      setTimeout(() => {
        this.won = true
        alert('Hai vinto!')
      })
    }

    if (this.numb[i][j]) return

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]

    directions.forEach(([dx, dy]) => {
      const newI = i + dx
      const newJ = j + dy

      newI >= 0 &&
        newI < this.len &&
        newJ >= 0 &&
        newJ < this.height &&
        !this.board.getCell(newI, newJ).isPopped() &&
        this.pop(newI, newJ)
    })
  }

  // server & client
  deleteDone(i, j) {
    let left = -1,
      right = 1,
      top = -1,
      down = 1,
      count = 0

    if (i == 0) left = 0
    if (j == 0) top = 0
    if (i == this.len - 1) right = 0
    if (j == this.height - 1) down = 0

    for (let left1 = left; left1 <= right; left1++) {
      for (let top1 = top; top1 <= down; top1++) {
        count += this.board.getCell(i + left1, j + top1).isFlagged()
      }
    }

    if (count != this.numb[i][j]) return

    for (let left1 = left; left1 <= right; left1++) {
      for (let top1 = top; top1 <= down; top1++) {
        !this.board.getCell(i + left1, j + top1).isPopped() &&
          this.pop(i + left1, j + top1)
      }
    }
  }

  // server & client
  intorno(i, j) {
    let count = 0
    let left = -1,
      right = 1,
      top = -1,
      down = 1
    if (i == 0) left = 0
    if (j == 0) top = 0
    if (i == this.len - 1) right = 0
    if (j == this.height - 1) down = 0
    for (let left1 = left; left1 <= right; left1++) {
      for (let top1 = top; top1 <= down; top1++) {
        if (this.bombs[left1 + i][top1 + j] == 1) {
          count++
        }
      }
    }

    return count
  }

  // client
  godo() {
    for (let i = 0; i < this.len; i++)
      for (let j = 0; j < this.height; j++)
        this.board.getCell(i, j).isPopped() && this.deleteDone(i, j)
  }

  // server
  checkWin() {
    let count = 0

    for (let i = 0; i < this.len; i++)
      for (let j = 0; j < this.height; j++)
        count += this.board.getCell(i, j).isPopped()

    return this.len * this.height - this.bombsNum == count
  }

  // server
  createBombs() {
    // I don't know why I have to do this
    const i = this.len
    const j = this.height

    const arr = new Array(i)
    for (let a = 0; a < i; a++) {
      arr[a] = new Array(j)
    }

    for (let a = 0; a < i; a++) {
      for (let b = 0; b < j; b++) {
        arr[a][b] = 0
      }
    }

    while (this.bombsNum != 0) {
      for (let a = 0; a < i; a++) {
        for (let b = 0; b < j; b++) {
          const rand = Math.floor(Math.random() * this.bombsNum * 5)
          if (!rand && arr[a][b] == 0 && (this.len != a || this.height != b)) {
            arr[a][b] = 1
            this.bombsNum--
          } else if (arr[a][b] == 0) arr[a][b] = 0
          if (this.bombsNum == 0) return arr
        }
      }
    }
  }

  // server
  createNumbers() {
    const numb = Array.from({ length: this.len }, () =>
      Array(this.height).fill(0)
    )

    for (let i = 0; i < this.len; i++)
      for (let j = 0; j < this.height; j++)
        this.bombs[i][j] == 0 && (numb[i][j] = this.intorno(i, j))

    return numb
  }

  // server
  gameOver() {
    this.lost = true
    this.board.revealBoard()

    setTimeout(() => {
      alert('Hai perso!')
    }, 100)
  }
}

class BoardCell extends HTMLElement {
  constructor(i, j, left, top, biggness) {
    super()

    this.id = `${i} ${j}`
    this.className = 'casella'

    this.style.display = 'block'
    this.style.width = biggness + 'px'
    this.style.height = biggness + 'px'
    this.style.left = left + 'px'
    this.style.top = top + 'px'
    this.popped = false

    this.setAttribute('flag', false)

    this.addEventListener(
      'contextmenu',
      (ev) => {
        ev.preventDefault()
        this.#flag()
      },
      false
    )

    this.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('boardClick', {
          detail: { cell: this },
          bubbles: true,
          composed: true,
        })
      )
    })
  }

  setNumber(num) {
    this.innerHTML = num
  }

  setBomb() {
    this.innerHTML = 'B'
  }

  pop() {
    this.popped = true
    this.setAttribute('popped', true)
  }

  getRow() {
    return parseInt(this.id.split(' ')[0])
  }

  getCol() {
    return parseInt(this.id.split(' ')[1])
  }

  isPopped() {
    return this.popped
  }

  isFlagged() {
    return this.getAttribute('flag') === 'true'
  }

  #flag() {
    if (this.popped) return
    this.setAttribute('flag', !this.isFlagged())
  }
}

class Board extends HTMLElement {
  constructor() {
    super()

    // TODO: create a parser
    this.len = parseInt(this.getAttribute('length'))
    this.height = parseInt(this.getAttribute('height'))
    this.bigness = parseInt(this.getAttribute('bigness'))

    this.cells = new Array(this.len * this.height)
  }

  getCell(i, j) {
    return this.cells[i * this.height + j]
  }

  connectedCallback() {
    this.id = 'table'

    this.style.display = 'block'
    this.style.width = this.len * this.bigness + 'px'
    this.style.height = this.height * this.bigness + 'px'

    let left = 0
    let top = 0
    for (let i = 0; i < this.len; i++) {
      for (let j = 0; j < this.height; j++) {
        const cell = new BoardCell(i, j, left, top, this.bigness)
        this.cells[i * this.height + j] = cell
        this.appendChild(cell)

        top += this.bigness
      }

      top = 0
      left += this.bigness
    }
  }

  onCellClick(callback) {
    this.addEventListener('boardClick', (ev) => {
      const cell = ev.target
      callback(cell.getRow(), cell.getCol())
    })
  }

  revealBoard() {
    for (let i = 0; i < this.len; i++)
      for (let j = 0; j < this.height; j++) {
        this.getCell(i, j).pop()
      }
  }
}

customElements.define('sweeper-cell', BoardCell)
customElements.define('sweeper-board', Board)

// to be fetched from server
const len = 20
const height = 20
const bigness = 20
const bombs = 50

document.body.innerHTML = `
	<sweeper-board length="${len}" height="${height}" bigness="${bigness}"></sweeper-board>
`

Game.start(len, height, bombs)
