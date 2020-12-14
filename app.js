const DOMqueries = {
    boardWidthInput: document.querySelector(".board-width"),
    boardHeightInput: document.querySelector(".board-height"),
    howManyBombsInput: document.querySelector(".bombs"),
    playBtn: document.querySelector("#play"),
    container: document.querySelector(".container"),
    boardContainer: document.querySelector(".board-container"),
};

const recurentionFunction = (el, current, fieldHeight) => {
    //console.log(current);
    const newCurrent = [];

    if (current.length !== 0) {
        current.forEach(element => {
            const isSthAround = (eld) => {
                    //console.log(eld);
                    //console.log(el[eld]);
                    //console.log(el[eld].bombsAround);
                    //console.log(el[eld].bombsAround === 0);
                    return el[eld].bombsAround === 0 && el[eld].active === false;
                }
                //console.log(el[element].freeAround.some(isSthAround));
                //console.log(el[element].freeAround);
                //console.log(el[element].freeAround.findIndex(isSthAround));
                //console.log(el);
            if (el[element].bombsAround === 0 && el[element].active === true) {
                el[element].displayYourself(fieldHeight, el);
                el[element].active = false;
                document.getElementById(el[element].index).classList.remove("blueField");
                //console.log(element);
                const isDuplicate = (ele) => {
                    //console.log(el);
                    //console.log(element);
                    return element === ele;
                };
                el[element].freeAround.forEach(elements => {
                    if (el[elements].active === true) {
                        newCurrent.push(elements);
                    }
                });
                //el[element].displayFreeAround(fieldHeight, el)
            } else if (el[element].freeAround.some(isSthAround) === true && el[element].active === true) {
                el[element].displayYourself(fieldHeight, el);
                el[element].active = false;
                document.getElementById(el[element].index).classList.remove("blueField");
            }
        });
        return recurentionFunction(el, newCurrent, fieldHeight);
    } else {
        console.log('sth')
    }
};

class Game {
    constructor(inputsValues, whichTurn) {
        this.boardWidth = inputsValues.boardWidth;
        this.boardHeight = inputsValues.boardHeight;
        this.howManyBombs = inputsValues.howManyBombs;
        this.whichTurn = whichTurn;
        this.flagNumber = this.howManyBombs;
        this.second = 0;
        this.result = 'inProgress';
        this.text = `<div class="container" oncontextmenu="return false">
            <h1 class="logo">Saper</h1>
            <div class="parameters-container">
                <section class="parameters">
                    <h2 class="question">Podaj Wielkość planszy:</h2>
                    <input type="number" class="board-width inp" placeholder="szerokość max.40" min="2" max="40"> <span class="x">x</span>
                    <input type="number" class="board-height inp" placeholder="wysokość max.40" min="2" max="40">
                </section>
    
                <section class="parameters">
                    <h2 class="question">Podaj ilość bomb:</h2>
                    <input type="number" class="bombs inp" placeholder="bomby" min="2">
                </section>
            </div>
    
            <button type="button" class="btn" id="play">Graj!</button>
            <section class="rules">
                <h2 class="rules-logo">Zasady Gry</h2>
                <p class="rules-text">Gra polega na odkrywaniu na planszy poszczególnych pól w taki sposób, aby nie natrafić na minę. Na każdym z odkrytych pól napisana jest liczba min, które bezpośrednio stykają się z danym polem (od jeden do ośmiu; jeśli min jest zero to na
                    polu nie ma wpisanej liczby). Należy używać tych liczb by wydedukować gdzie schowane są miny. Jeśli oznaczymy dane pole flagą (prawym przyciskiem myszy, bądź na urządzeniu mobilnym dłuższe przytrzymanie), jest ono zabezpieczone przed odsłonięciem,
                    dzięki czemu przez przypadek nie odsłonimy miny.</p>
    
            </section>
            <footer class="footer">© 2020 Done by: Łukasz Stodółka: <a href="https://github.com/StodolkaLukasz/">GitHub</a></footer>
        </div>`
    }

    drawBoard() {
        let id = 0;
        this.fieldHeight = (800 - this.boardWidth * 2) / this.boardWidth;
        this.fullBoardWidth = 800;
        for (let i = 0; i < this.boardHeight; i++) {
            document
                .querySelector("#board-container")
                .insertAdjacentHTML(
                    "beforeend",
                    `<div style="width: ${this.fullBoardWidth}px;" class=rows id="${i}-row"></div>`
                );
            for (let j = 0; j < this.boardWidth; j++) {
                const html = `<div style="height: ${this.fieldHeight}px; font-size:${this.fieldHeight / 2.1875
                    }px" class="field blueField" id=${id}></div>`;
                document.getElementById(`${i}-row`).insertAdjacentHTML("beforeend", html);
                id++;
            }
        }
        document.querySelector(
            ".container"
        ).innerHTML += `<footer class="footer">© 2020 Done by: Łukasz Stodółka: <a href="https://github.com/StodolkaLukasz/">GitHub</a></footer>`;
    }

    buttonsController() {
        this.boardElements.forEach((element) => {

            console.log(this.result);
            document.getElementById(element.index).addEventListener("click", () => {
                if (this.result === 'inProgress') {
                    if (element.active === true) {
                        element.displayYourself(this.fieldHeight, this.boardElements);
                        //element.displayFreeAround(this.fieldHeight, this.boardElements);
                        this.checkIfWin();
                        if (element.bombsAround === 0) {
                            recurentionFunction(this.boardElements, element.freeAround, this.fieldHeight);
                            this.checkIfWin();
                        }
                    } else if (element.active === 'flag') {
                        element.unflag(this.boardElements);
                        this.flagNumber++;
                        this.checkIfWin();
                    }
                    element.displayFreeField(this.fieldHeight, this.boardElements);
                    //element.displayFieldsAround(this.fieldHeight, this.boardElements, this.boardHeight, this.boardWidth);
                    this.checkIfWin();
                    this.updateFlag();
                    if (this.result === 'lose') {
                        this.boardElements.forEach((element) => {
                            if (element.isBomb === true) {
                                element.displayYourself(this.fieldHeight, this.boardElements)
                            }
                        });
                        const text = `<div class="lose-screen"><div class="game-result">Przegrałeś!</div><button class="btn again">Zagraj jeszcze raz</button></div>`;
                        document.querySelector('.board-container').insertAdjacentHTML("afterbegin", text);
                        document.querySelector('.again').addEventListener('click', () => {

                            document.querySelector('body').innerHTML = this.text;
                            document.querySelector('#play').addEventListener("click", newGame);
                        });

                    } else if (this.result === 'win') {
                        const text = `<div class="win-screen"><div class="game-result">Wygrałeś!</div><button class="btn again">Zagraj jeszcze raz</button></div>`;
                        document.querySelector('.board-container').insertAdjacentHTML("afterbegin", text);
                        document.querySelector('.again').addEventListener('click', () => {

                            document.querySelector('body').innerHTML = this.text;
                            document.querySelector('#play').addEventListener("click", newGame);
                        });
                    }
                }
            });

            document.getElementById(element.index).addEventListener("contextmenu", () => {
                if (this.result === 'inProgress') {
                    if (element.active === true) {
                        if (this.flagNumber > 0) {
                            element.displayFlag(this.fieldHeight, this.boardElements);
                            this.flagNumber--;
                        }

                    } else if (element.active === 'flag') {
                        element.unflag(this.boardElements);
                        this.flagNumber++;
                    }
                    this.checkIfWin();
                    this.updateFlag();

                    if (this.result === 'win') {
                        const text = `<div class="win-screen"><div class="game-result">Wygrałeś!</div><button class="btn again">Zagraj jeszcze raz</button></div>`;
                        document.querySelector('.board-container').insertAdjacentHTML("afterbegin", text);
                        document.querySelector('.again').addEventListener('click', () => {

                            document.querySelector('body').innerHTML = this.text;
                            document.querySelector('#play').addEventListener("click", newGame);
                        });
                    }
                }
            });



        });
    }

    boardElementsCreate = () => {
        if (this.whichTurn === 0) {
            const idEl = parseInt(event.target.id);
            const boardElements = [];
            let index = 0;
            for (let y = 0; y < this.boardHeight; y++) {
                for (let x = 0; x < this.boardWidth; x++) {
                    boardElements.push(new boardElement(index, x, y));
                    index++;
                }
            }
            const randomNumbers = [];
            let howManyBombsLeft = this.howManyBombs;
            while (howManyBombsLeft > 0) {
                const random = Math.floor(Math.random() * (this.boardWidth * this.boardHeight));
                const isDuplicate = (el) => {
                    return el == random
                }

                if (random !== idEl && randomNumbers.some(isDuplicate) === false) {
                    boardElements[random].isBomb = true;
                    randomNumbers.push(random);
                    howManyBombsLeft--;
                }
            }
            this.boardElements = boardElements;
            this.boardElements.forEach((item) => {
                item.howManyBombsAround(boardElements, this.fieldHeight);
            });
            document.querySelectorAll(".field").forEach((button) => {
                button.removeEventListener("click", this.boardElementsCreate);
            });
            this.buttonsController();
            this.boardElements[idEl].displayYourself(this.boardHeight, this.boardElements);
            if (this.boardElements[idEl].bombsAround === 0)
                recurentionFunction(this.boardElements, this.boardElements[idEl].freeAround, this.fieldHeight);
            setInterval(this.timer, 1000);
        }
    }

    checkIfWin = () => {
        let bombAsFlag = 0;
        let unactiveElements = this.boardElements.length + 1;
        this.boardElements.forEach(element => {

            if (element.isBomb && element.active === 'flag') {
                bombAsFlag++;
            } else if (element.isBomb && element.active === 'lose') {
                //alert('Przegrales');
                this.result = 'lose';
            }
        });
        if (bombAsFlag === this.howManyBombs) {
            this.result = 'win';
        }
    }

    updateFlag = () => {
        console.log(this.flagNumber);
        console.log(this.howManyBombs);
        document.querySelector(".bomb-left").innerHTML = `<img src="flag.png" class="flag" alt="flaga">${this.flagNumber}/${this.howManyBombs}`;
    }

    timer = () => {
        if (this.result === 'inProgress') {
            this.second++;
            //console.log(second);
            document.querySelector(".timer").textContent = `Minęło: ${this.second} s`;
        }
    };
}

class boardElement {
    constructor(index, x, y, isBomb = false, active = true) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.isBomb = isBomb;
        this.active = true;
        this.flagAround = 0;
    }

    howManyBombsAround(el, fieldHeight) {
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

    displayYourself(fieldHeight, el) {
        if (this.isBomb === true && this.active === true) {
            document.getElementById(this.index).innerHTML = `<img src="bomb.png" style="width: ${fieldHeight/1.3 - 4}px; height: ${fieldHeight/1.3 - 4}px" class="bomb" alt="bomba">`;
            document.getElementById(this.index).classList.toggle("blueField");
            this.active = 'lose';
        } else if (this.isBomb === false) {
            document.getElementById(`${this.index}`).classList.add(`Bombs${this.bombsAround}`);
            document.getElementById(`${this.index}`).innerHTML = `<p class="text">${this.bombsAround}</p>`;
            document.getElementById(this.index).classList.toggle("blueField");
            this.active = false;
        }
        //this.displayFreeAround(fieldHeight, el)
    }

    displayFlag(fieldHeight, el) {

        document.getElementById(this.index).innerHTML = `<img src="flag.png" style="width: ${fieldHeight - 7}px; height: ${fieldHeight - 7}px" class="flag-field" alt="flaga">`;
        document.getElementById(this.index).classList.toggle("yellow");
        document.getElementById(this.index).classList.toggle("blueField");
        this.active = 'flag';
        const indexes = [];
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

                indexes.push(findBombFunction1);
                indexes.push(findBombFunction2);
                indexes.push(findBombFunction3);
                indexes.push(findBombFunction4);
            }
        }

        indexes.forEach(element => {
            if (el.findIndex(element) !== -1) {
                el[el.findIndex(element)].flagAround++;
                //console.log(el[el.findIndex(element)].flagAround);
            }
        });



    }

    unflag(el) {
        document.getElementById(this.index).textContent = "";
        document.getElementById(this.index).classList.toggle("yellow");
        document.getElementById(this.index).classList.toggle("blueField");
        this.active = true;
        const indexes = [];
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

                indexes.push(findBombFunction1);
                indexes.push(findBombFunction2);
                indexes.push(findBombFunction3);
                indexes.push(findBombFunction4);
            }
        }

        indexes.forEach(element => {
            if (el.findIndex(element) !== -1) {
                el[el.findIndex(element)].flagAround--;
            }
        });
    }

    displayFreeField(fieldHeight, el) {
        const indexes = [];
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

                indexes.push(findBombFunction1);
                indexes.push(findBombFunction2);
                indexes.push(findBombFunction3);
                indexes.push(findBombFunction4);
            }
        }

        document.getElementById(this.index).addEventListener("dblclick", () => {
            indexes.forEach(element => {
                if (el.findIndex(element) !== -1) {
                    console.log(el);
                    if (this.flagAround === this.bombsAround) {
                        el[el.findIndex(element)].displayYourself(fieldHeight, el);
                        document.getElementById(el[el.findIndex(element)].index).classList.remove("blueField");
                    }
                    if (el[el.findIndex(element)].bombsAround === 0 && this.flagAround === this.bombsAround) {
                        recurentionFunction(el, el[el.findIndex(element)].freeAround, fieldHeight)
                    }
                }
            });
        });

    }
}

const getInputs = () => {
    return {
        boardWidth: parseInt(document.querySelector(".board-width").value),
        boardHeight: parseInt(document.querySelector(".board-height").value),
        howManyBombs: parseInt(document.querySelector(".bombs").value)
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
        inputs.boardWidth > 40 ||
        inputs.boardHeight > 40 ||
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

const newGame = () => {
    let inputsValues = getInputs();
    if (checkInputs(inputsValues)) {
        const game = new Game(inputsValues, 0);

        // 1. Draw board
        document.querySelector('.container').innerHTML = '<div class="board-container" id="board-container"></div>';
        document.querySelector(".container").insertAdjacentHTML("afterbegin", `<output class="bomb-left"><img src="flag.png" class="flag" alt="flaga"> ${inputsValues.howManyBombs}/${inputsValues.howManyBombs}</output><output class="timer">00.00.00</output>`);
        game.drawBoard();
        // 2. Add buttons actions
        const buttons = document.querySelectorAll(".field");
        buttons.forEach((button) => {
            button.addEventListener("click", game.boardElementsCreate);
        });
    }
};

DOMqueries.playBtn.addEventListener("click", newGame);
