
const data = [
    {
        word: 'король',
        path: [1, 2, 3, 8, 13, 18]
    },
    {
        word: 'ладья',
        path: [7, 6, 11, 16, 21]
    },
    {
        word: 'ферзь',
        path: [12, 17, 22, 23, 24]
    },
    {
        word: 'пешка',
        path: [25, 20, 19, 14, 15]
    },
    {
        word: 'конь',
        path: [4, 9, 10, 5]
    },
]
let gameWrapper = document.querySelector('.root')
let gameField = document.querySelector('.field')

const size = 5;
let isMousedown = false
let currentCell = null

let fieldSize = 50 * size

gameField.style.width = `${fieldSize}px`

function fillField() {
    for (i = 0; i < size * size; i++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.id = i + 1
        gameField.append(cell)
    }
}
fillField()
let cells = document.querySelectorAll('.cell')
lettersFill()
function lettersFill() {
    data.forEach(item => {
        let letters = item.word.split('')
        //console.log(letters)
        letters.forEach((letter, index) => {
            //console.log( cells[item.path[index]-1])
            cells[item.path[index] - 1].append(letter)
        })

    })
}


gameField.addEventListener('pointerdown', onPointerdown)

function onPointerdown(e) {
    if (!e.target.classList.contains('buzy')) {
        let word = []
        if (e.target.classList.contains('cell')) {
            isMousedown = true
            currentCell = (e.target)
            currentCell.classList.add('color')
            word.push(currentCell.id)
            //currentCell.addEventListener('pointerleav', onPointerleave)
        }

        gameField.addEventListener('pointermove', onMousemove)
        gameField.addEventListener('pointerup', onMouseup)
        gameField.addEventListener('pointerleave', onMouseleave)

        function onMousemove(e) {
            if (e.target.classList.contains('cell')) {
                if (currentCell !== e.target) {
                    currentCell = (e.target)
                    currentCell.classList.add('color')
                    word.push(currentCell.id)

                }
            }
            
        }

        function onMouseup() {
            let count=0
            isMousedown = false
            gameField.removeEventListener('pointermove', onMousemove)
            console.log(word)
            data.forEach(item => {
                if (item.path.join('') === word.join('')) {
                    word.forEach((it, ind) => {
                        cells[it - 1].classList.add('buzy')
                        console.log(cells[it - 1])
                        count++
                    })
                }
            })
            if(!count){
                word.forEach((it) => {
                    cells[it - 1].classList.remove('color')
                })
                word=[]
            }
        }
    }
    function onMouseleave(){
        onMouseup()
    }



}
