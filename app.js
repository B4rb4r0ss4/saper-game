const DOMqueries = {
    boardWidthInput: document.querySelector(".board-width"),
    boardHeightInput: document.querySelector(".board-height"),
    howManyBombsInput: document.querySelector(".bombs"),
    playBtn: document.querySelector(".btn"),
    container: document.querySelector(".container"),
    boardContainer: document.querySelector(".board-container"),
};

const getInputs = () => {
    return {
        boardWidth: parseInt(DOMqueries.boardWidthInput.value),
        boardHeight: parseInt(DOMqueries.boardHeightInput.value),
        howManyBombs: parseInt(DOMqueries.howManyBombsInput.value),
    };
};

const checkInputs = (inputs) => {
    if (
        isNaN(inputs.boardWidth) ||
        isNaN(inputs.boardHeight) ||
        isNaN(inputs.howManyBombs)
    ) {
        return false;
    } else if (
        inputs.boardWidth > 30 ||
        inputs.boardHeight > 30 ||
        inputs.howManyBombs > inputs.boardWidth * inputs.boardHeight - 1
    ) {
        return false;
    } else if (
        inputs.boardWidth < 0 ||
        inputs.boardHeight < 0 ||
        inputs.howManyBombs < 0
    ) {
        return false;
    } else return true;
};

class boardElement {
    constructor(index, x, y, isBomb = false, active = true) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.isBomb = isBomb;
        this.active = active;
    }

    howManyBombsAround(el) {
        let bombDetected = 0;
        const findBombsFunctions = [];
        for (let i = -1; i <= 1; i++) {
            if (i !== 0) {
                const findBombFunction1 = (element) =>
                    element.x === this.x + i && element.y === this.y;

                const findBombFunction2 = (element) =>
                    element.x === this.x + i && element.y === this.y - i;

                const findBombFunction3 = (element) =>
                    element.x === this.x + i && element.y === this.y + i;

                const findBombFunction4 = (element) =>
                    element.x === this.x && element.y === this.y + i;

                findBombsFunctions.push(findBombFunction1);
                findBombsFunctions.push(findBombFunction2);
                findBombsFunctions.push(findBombFunction3);
                findBombsFunctions.push(findBombFunction4);
            }
        }
        //console.log(findBombsFunctions);
        findBombsFunctions.forEach((element, index) => {
            //console.log(el.findIndex(element));
            if (el.findIndex(element) !== -1) {
                if (el[el.findIndex(element)].isBomb) {
                    bombDetected++;
                }
            }
        });
        this.bombsAround = bombDetected;
        this.freeAround = [];
        findBombsFunctions.forEach(element => {
            if (el.findIndex(element) !== -1 && this.isBomb === false) {
                if (el[el.findIndex(element)].isBomb === false) {
                    this.freeAround.push(el.findIndex(element));
                    //console.log(el.findIndex(element));
                }
            }
        });

    }
}

boardElementsCreate = (width, height, howManyBombs, idEl) => {
    const boardElements = [];
    let index = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            boardElements.push(new boardElement(index, x, y));
            index++;
        }
    }
    const randomNumbers = [];
    while (howManyBombs > 0) {
        const random = Math.floor(Math.random() * (width * height));
        const isDuplicate = (el) => {
            return el == random
        }

        if (random !== idEl && randomNumbers.some(isDuplicate) === false) {
            boardElements[random].isBomb = true;
            randomNumbers.push(random);
            howManyBombs--;
        }
    }
    return boardElements;
};


let fieldHeight;
const drawBoard = (width, height) => {
    let id = 0;
    fieldHeight = (800 - width * 10) / width;
    boardWidth = 800;
    for (let i = 0; i < height; i++) {
        document
            .querySelector(".board-container")
            .insertAdjacentHTML(
                "beforeend",
                `<div style="width: ${boardWidth}px;" class=rows id="${i}-row"></div>`
            );
        for (let j = 0; j < width; j++) {
            const html = `<div style="height: ${fieldHeight}px; font-size:${fieldHeight / 2.1875
                }px" class="field" id=${id}></div>`;
            document.getElementById(`${i}-row`).insertAdjacentHTML("beforeend", html);
            id++;
        }
    }
    document.querySelector(
        ".container"
    ).innerHTML += `<footer class="footer">© 2020 Done by: Łukasz Stodółka: <a href="https://github.com/StodolkaLukasz/">GitHub</a></footer>`;
};





const buttonsController = (el, number) => {
    let flagNumber = number;
    el.forEach((element, i) => {
        document.getElementById(`${i}`).addEventListener("click", () => {
            if (element.active === true) {
                element.active = false;
                if (element.isBomb) {
                    document.getElementById(`${i}`).innerHTML =
                        `<img src="bomb.png" style="width: ${fieldHeight/1.3}px; height: ${fieldHeight}px" class="bomb" alt="bomba">`;
                    alert("przegrales");
                } else if (element.isBomb === false) {
                    if (el[i].bombsAround === 0) {
                        document.getElementById(`${i}`).classList.toggle("lightGreen");
                        el[i].freeAround.forEach((item, ind) => {
                            document.getElementById(`${item}`).classList.add("lightGreen");
                            el[item].active = false;
                        });
                    } else if (element.bombsAround > 0) {
                        document.getElementById(
                            `${i}`
                        ).innerHTML = `<p class="text">${element.bombsAround}</p>`;
                        document.getElementById(`${i}`).classList.toggle("darkGreen");
                    }
                    checkIfWin(el);
                }
            } else if (element.active === "flag") {
                element.active = true;
                document.getElementById(`${i}`).textContent = "";
                document.getElementById(`${i}`).classList.toggle("yellow");
                flagNumber++;
            }
        });


        document.getElementById(`${i}`).addEventListener("contextmenu", () => {
            if (el[i].active === true && flagNumber > 0) {
                el[i].active = "flag";
                document.getElementById(
                    `${i}`
                ).innerHTML = `<img src="flag.png" style="width: ${fieldHeight}px; height: ${fieldHeight}px" class="flag" alt="flaga">`;
                document.getElementById(`${i}`).classList.toggle("yellow");
                flagNumber--;
                document.querySelector(
                    ".bomb-left"
                ).innerHTML = `<img src="flag.png" class="flag" alt="flaga"> ${flagNumber}/${number}`;
                checkIfWin(el);
            } else if (el[i].active === true && flagNumber === 0) {
                alert("Nie masz już flag!");
            }
        });
    });

};

const checkIfWin = (el) => {
    let active = 0;
    el.forEach((item, i) => {
        if (item.active !== true) {
            active++;
        }
        if (active === el.length) {
            alert("Wygrales");
        }
    });
};

const firstMove = () => {
    if (whichTurn === 0) {
        itemID = parseInt(event.target.id);
        const boardElements = boardElementsCreate(
            inputsValues.boardWidth,
            inputsValues.boardHeight,
            inputsValues.howManyBombs,
            itemID
        );

        boardElements.forEach((item, i) => {
            item.howManyBombsAround(boardElements);
        });
        // boardElements.forEach((item, i) => {
        //     item.howManyFreeAround(boardElements);
        // });
        console.log(boardElements);
        buttonsController(boardElements, inputsValues.howManyBombs);
        boardElements[itemID].active = false;
        if (boardElements[itemID].bombsAround === 0) {
            document.getElementById(`${itemID}`).classList.toggle("lightGreen");
            boardElements[itemID].freeAround.forEach((item, ind) => {
                document.getElementById(`${itemID}`).classList.add("lightGreen");
                boardElements[itemID].active = false;
            });
        } else if (boardElements[itemID].bombsAround > 0) {
            document.getElementById(
                `${itemID}`
            ).innerHTML = `<p class="text">${boardElements[itemID].bombsAround}</p>`;
            document.getElementById(`${itemID}`).classList.toggle("darkGreen");
        }
        checkIfWin(boardElements);
    }

    document.querySelectorAll(".field").forEach((button) => {
        button.removeEventListener("click", firstMove);
    });
};
const timer = () => {
    second++;
    //console.log(second);
    document.querySelector(".timer").textContent = `Minęło: ${second}`;
};
let whichTurn = 0;
let itemID;
let inputsValues;
let second = 0;
DOMqueries.playBtn.addEventListener("click", () => {
    inputsValues = getInputs();
    if (checkInputs(inputsValues)) {
        console.log(inputsValues);
        DOMqueries.container.innerHTML = '<div class="board-container"></div>';
        document
            .querySelector(".container")
            .insertAdjacentHTML(
                "afterbegin",
                `<output class="bomb-left"><img src="flag.png" class="flag" alt="flaga"> ${inputsValues.howManyBombs}/${inputsValues.howManyBombs}</output><output class="timer">00.00.00</output>`
            );
        drawBoard(inputsValues.boardWidth, inputsValues.boardHeight);
        //const itemID = DOMqueries.container.addEventListener('click', firstMove);
        setInterval(timer, 1000);
        //console.log(boardElements);
        const buttons = document.querySelectorAll(".field");

        buttons.forEach((button) => {
            button.addEventListener("click", firstMove);
        });
    }
});
