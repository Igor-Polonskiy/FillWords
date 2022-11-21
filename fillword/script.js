import {
    renderCheckPanel,
    getCheckPanelElements,
    checkingAnswerPositive,
    checkingAnswerReset
  } from "../_common_files/common_scripts.js";
(() => {
    const taskId = 'task-1'
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

    renderFillword(taskId, data)

})()

function renderFillword(taskId, data) {
    const taskWrapper = document.querySelector(`#${taskId}`);
    
    let gameField = taskWrapper.querySelector('.field')

    const size = 5;
    let isMousedown = false
    let currentCell = null

    let fieldSize = 50 * size

    gameField.style.width = `${fieldSize}px`

    function fillField() {
        for (let i = 0; i < (size * size); i++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.id = i + 1
            gameField.append(cell)
        }
    }

    /*function setMinsize() {
        let count = 0
        data.forEach(item => {
            count += item.word.length
        })
    
        count = Math.ceil(Math.sqrt(count))
        console.log(count)
    }
    setMinsize()*/

    fillField()
    let cells = document.querySelectorAll('.cell')
    lettersFill()
    renderCheckPanel(taskWrapper, true);
    const { btnReset, btnTest, controlsBox, infoBox } =
      getCheckPanelElements(taskWrapper);

      btnTest.classList.add('noDisplayElement')
  

    function lettersFill() {
        data.forEach(item => {
            let letters = item.word.split('')
            letters.forEach((letter, index) => {
                cells[item.path[index] - 1].append(letter.toUpperCase())
            })

        })
    }


    gameField.addEventListener('pointerdown', onPointerdown)
    btnReset.addEventListener('click', onReloadBtnClick)

    function onReloadBtnClick() {
        checkingAnswerReset(controlsBox, infoBox)
        cells.forEach(item => {
            item.classList.remove('color', 'buzy')
            item.style.backgroundColor = ''
        })
    }

    function onPointerdown(e) {
        if (!e.target.classList.contains('buzy')) {
            let color = '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase()

            let word = []
            if (e.target.classList.contains('cell')) {
                isMousedown = true
                currentCell = (e.target)
                currentCell.classList.add('color')
                word.push(currentCell.id)
            }

            gameField.addEventListener('pointermove', onMousemove)
            gameField.addEventListener('pointerup', onMouseup)
            gameField.addEventListener('pointerleave', onMouseleave)

            let elemBelow
            function onMousemove(e) {
                elemBelow = document.elementFromPoint(e.clientX, e.clientY);
                if (elemBelow.classList.contains('cell')) {
                    if (currentCell !== elemBelow) {
                        if (elemBelow.id !== word.find(el => el === elemBelow.id) && !elemBelow.classList.contains('buzy')) {
                            currentCell = elemBelow
                            currentCell.classList.add('color')
                            word.push(currentCell.id)
                        }
                        else if (elemBelow.id === word[word.length - 2]) {
                            console.log(elemBelow.id)
                            currentCell.classList.remove('color')
                            word.pop()
                            currentCell = (elemBelow)
                        } else {
                            onMouseup()
                        }
                    }
                }
            }

            function onMouseup() {
                console.log('mouseup')
                let count = 0
                isMousedown = false
                gameField.removeEventListener('pointermove', onMousemove)
                console.log(word)
                data.forEach(item => {
                    if (item.path.join('') === word.join('')) {

                        word.forEach((it) => {
                            cells[it - 1].classList.add('buzy')
                            cells[it - 1].style.backgroundColor = color
                            console.log(cells[it - 1])
                            count++
                        })
                    }
                })
                if (!count) {
                    word.forEach((it) => {
                        cells[it - 1].classList.remove('color')
                    })
                    word = []
                }
                gameField.removeEventListener('pointerup', onMouseup)
                gameField.removeEventListener('pointerleave', onMouseleave)

                let coutBuzy = 0
                cells.forEach(item => {
                    if (item.classList.contains('buzy')) {
                        coutBuzy++
                    }
                })

                if (coutBuzy === cells.length) {
                    checkingAnswerPositive(controlsBox, infoBox)
                }

            }

            function onMouseleave(e) {
                console.log('leave')

                onMouseup()
                gameField.removeEventListener('pointerup', onMouseup)
                gameField.removeEventListener('pointerleave', onMouseleave)
            }


        }
    }

}
