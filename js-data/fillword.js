import {
    renderCheckPanel,
    getCheckPanelElements,
    checkingAnswerPositive,
    checkingAnswerReset
  } from "../_common_files/common_scripts.js";
  
(() => {
    //уникальный Id тренажера
    const taskId = 'task-1'
    //size - количество клеток поля по горизонтали и вертикали
    const size = 5;

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

    renderFillword(taskId, data, size)

})();

(() => {
    //уникальный Id тренажера
    const taskId = 'task-2'
    //size - количество клеток поля по горизонтали и вертикали
    const size = 8;

    const data = [
        {
            word: 'король',
            path: [19, 20, 21, 29, 30, 38]
        },
        {
            word: 'ладья',
            path: [4, 5, 6, 14, 15]
        },
        {
            word: 'ферзь',
            path: [57, 58, 50, 42, 43]
        },
        {
            word: 'пешка',
            path: [25, 17, 9, 1, 2]
        },
        {
            word: 'конь',
            path: [55, 56, 48, 40]
        },
        {
            word: 'слон',
            path: [51, 59, 60, 52]
        },
    ]

    const lettersData = {
        letters:'яъжьхтжуупйюрнжияаефуйрыртцлцтчкэыф',
        path: [3,7,8,10,11,12,13,16,18,22,23,24,26,27,28,31,32,33,34,35,36,37,39,41,44,45,46,47,49,53,54,61,62,63,64]
    }
    

    renderFillword(taskId, data, size, lettersData)

})()

function renderFillword(taskId, data,size, lettersData) {
    const taskWrapper = document.querySelector(`#${taskId}`);
    
    const gameField = taskWrapper.querySelector('.fillword_field')

    const fieldSize = 50 * size
    let isMousedown = false
    let currentCell = null
    const alphabet =  "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"

    gameField.style.width = `${fieldSize}px`

    /*function setMinsize() {
        let count = 0
        data.forEach(item => {
            count += item.word.length
        })
    
        count = Math.ceil(Math.sqrt(count))
    }
    setMinsize()*/

    fillField()
    let cells = taskWrapper.querySelectorAll('.fillword_cell')

    lettersFill()

    renderCheckPanel(taskWrapper, true);
    const { btnReset, btnTest, controlsBox, infoBox } =
      getCheckPanelElements(taskWrapper);

      btnTest.classList.add('noDisplayElement')
  
    gameField.addEventListener('pointerdown', onPointerdown)
    btnReset.addEventListener('click', onReloadBtnClick)

    function lettersFill() {
        data.forEach(item => {
            let letters = item.word.split('')
            letters.forEach((letter, index) => {
                cells[item.path[index] - 1].append(letter.toUpperCase())
            })

        })
        if(lettersData){
            let lettersArr = lettersData.letters.split('')
            lettersArr.forEach((letter, index) => {
                cells[lettersData.path[index] - 1].append(letter.toUpperCase())
            })
        }
    }

    function fillField() {
        for (let i = 0; i < (size * size); i++) {
            const cell = document.createElement('div')
            cell.classList.add('fillword_cell')
            cell.id = i + 1
            gameField.append(cell)
        }
    }

    function onReloadBtnClick() {
        checkingAnswerReset(controlsBox, infoBox)
        cells.forEach(item => {
            item.classList.remove('fillword_color', 'fillword_buzy')
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
                if (elemBelow.classList.contains('fillword_cell')) {
                    if (currentCell !== elemBelow) {
                        if (elemBelow.id !== word.find(el => el === elemBelow.id) && !elemBelow.classList.contains('buzy')) {
                            currentCell = elemBelow
                            currentCell.classList.add('fillword_color')
                            word.push(currentCell.id)
                        }
                        else if (elemBelow.id === word[word.length - 2]) {
                            currentCell.classList.remove('fillword_color')
                            word.pop()
                            currentCell = (elemBelow)
                        } else {
                            onMouseup()
                        }
                    }
                }
            }

            function onMouseup() {
                let count = 0
                isMousedown = false
                gameField.removeEventListener('pointermove', onMousemove)
                data.forEach(item => {
                    if (item.path.join('') === word.join('')) {

                        word.forEach((it) => {
                            cells[it - 1].classList.add('fillword_buzy')
                            cells[it - 1].style.backgroundColor = color
                            count++
                        })
                    }
                })
                if (!count) {
                    word.forEach((it) => {
                        cells[it - 1].classList.remove('fillword_color')
                    })
                    word = []
                }
                gameField.removeEventListener('pointerup', onMouseup)
                gameField.removeEventListener('pointerleave', onMouseleave)

                let coutBuzy = 0
                cells.forEach(item => {
                    if (item.classList.contains('fillword_buzy')) {
                        coutBuzy++
                    }
                })
                let letters = 0
                data.forEach(item => {
                    letters += item.word.length
                })
                if (coutBuzy === letters) {
                    checkingAnswerPositive(controlsBox, infoBox)
                }

            }

            function onMouseleave() {
                onMouseup()
                gameField.removeEventListener('pointerup', onMouseup)
                gameField.removeEventListener('pointerleave', onMouseleave)
            }
        }
    }

}
