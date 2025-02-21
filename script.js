let cells = document.getElementsByClassName("grid")[0].getElementsByTagName("div");
let snakeLength = 0;
let foodIndex;
let snakeDirection = { row: 0, col: 0 }
let snakeHeadPosition = { row: 8, col: 3 }
let snakeArr = [{ row: 8, col: 3 }]
let snakeHeadIndex = (snakeHeadPosition.row - 1) * 17 + snakeHeadPosition.col - 1;
let foodScore = 0;
let highScore = 0;
let startX, startY;

//Generate food at start
generateFood()

let main = () => {

    if (snakeHeadPosition.row == 18 || snakeHeadPosition.col == 18 || snakeHeadPosition.row == 0 || snakeHeadPosition.col == 0) {
        gameOver();
        return;
    }
    for (let i = snakeArr.length - 1; i >= 2; i--) {
        if (snakeArr[i].row == snakeHeadPosition.row && snakeArr[i].col == snakeHeadPosition.col) {
            gameOver();
            return
        }
    }

    for (let i = snakeArr.length - 1; i >= 1; i--) {
        let snakeBodyIndex = ((snakeArr[i].row) - 1) * 17 + (snakeArr[i].col) - 1;

        cells[snakeBodyIndex].style.backgroundColor = '';
    }
    cells[snakeHeadIndex].classList.remove("snakeHead")

    cells[snakeHeadIndex].classList.remove("rotateUp")
    cells[snakeHeadIndex].classList.remove("rotateDown")
    cells[snakeHeadIndex].classList.remove("rotateLeft")
    cells[snakeHeadIndex].classList.remove("rotateRight")

    snakeHeadPosition = { row: (snakeHeadPosition.row + snakeDirection.row), col: snakeHeadPosition.col + snakeDirection.col }
    snakeHeadIndex = ((snakeHeadPosition.row) - 1) * 17 + (snakeHeadPosition.col) - 1;

    if (snakeHeadIndex == foodIndex) {
        foodScore++;
        document.querySelector(".score").innerHTML = foodScore;
        if (foodScore > highScore) {
            highScore = foodScore;
            document.querySelector(".highScore").innerHTML = highScore;
        }
        cells[foodIndex].classList.remove("snakeFood")
        generateFood();
        snakeLength++;
        snakeArr.push({ row: 0, col: 0 })
    }

    if (snakeDirection.row == 1) {
        cells[snakeHeadIndex].classList.add("rotateDown")
    } else if (snakeDirection.row == -1) {
        cells[snakeHeadIndex].classList.add("rotateUp")
    } else if (snakeDirection.col == 1) {
        cells[snakeHeadIndex].classList.add("rotateRight")
    } else if (snakeDirection.col == -1) {
        cells[snakeHeadIndex].classList.add("rotateLeft")
    }

    cells[snakeHeadIndex].classList.add("snakeHead")

    for (let i = snakeArr.length - 1; i >= 1; i--) {
        snakeArr[i] = snakeArr[i - 1];
        let snakeBodyIndex = ((snakeArr[i].row) - 1) * 17 + (snakeArr[i].col) - 1;
        cells[snakeBodyIndex].style.backgroundColor = '#4775EB'
    }

    snakeArr[0] = { row: snakeHeadPosition.row, col: snakeHeadPosition.col };

}

//For continuously moving the snake
let interval = setInterval(main, 200);

//key listeners to change  the direction of snake
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (snakeDirection.row !== 1 || snakeDirection.col !== 0) {
                snakeDirection = { row: -1, col: 0 };
            }
            break;
        case 'ArrowDown':
            if (snakeDirection.row !== -1 || snakeDirection.col !== 0) {
                snakeDirection = { row: 1, col: 0 };
            }
            break;
        case 'ArrowLeft':
            if (snakeDirection.row !== 0 || snakeDirection.col !== 1) {
                snakeDirection = { row: 0, col: -1 };
            }
            break;
        case 'ArrowRight':
            if (snakeDirection.row !== 0 || snakeDirection.col !== -1) {
                snakeDirection = { row: 0, col: 1 };
            }
            break;
    }
})

document.addEventListener('touchstart', function (e) {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
});

document.addEventListener('touchmove', function (e) {
    if (!startX || !startY) {
        return;
    }

    let diffX = startX - e.touches[0].pageX;
    let diffY = startY - e.touches[0].pageY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            //left
            if (snakeDirection.row !== 0 || snakeDirection.col !== 1) {
                snakeDirection = { row: 0, col: -1 };
            }
        } else {
            //right
            if (snakeDirection.row !== 0 || snakeDirection.col !== -1) {
                snakeDirection = { row: 0, col: 1 };
            }
        }
    } else {
        if (diffY > 0) {
            //up
            if (snakeDirection.row !== 1 || snakeDirection.col !== 0) {
                snakeDirection = { row: -1, col: 0 };
            }
        } else {
            //down
            if (snakeDirection.row !== -1 || snakeDirection.col !== 0) {
                snakeDirection = { row: 1, col: 0 };
            }
        }
    }

    startX = null;
    startY = null;
}, false);

function generateFood() {
    let validPosition = false;
    while (!validPosition) {
        foodIndex = Math.floor(Math.random() * 290);
        validPosition = true;
        for (let i = 0; i < snakeArr.length; i++) {
            let snakeBodyIndex = (snakeArr[i].row - 1) * 17 + (snakeArr[i].col - 1);
            if (foodIndex === snakeBodyIndex) {
                validPosition = false;
                break;
            }
        }
    }
    cells[foodIndex].classList.add("snakeFood")
}

document.querySelector(".playAgain").addEventListener("click", () => {
    document.querySelector(".gameOver").style.display = ""
    console.log(document.querySelector(".gameOver"))
    snakeLength = 0;
    snakeDirection = { row: 0, col: 0 }
    snakeHeadPosition = { row: 8, col: 3 }
    snakeArr = [{ row: 8, col: 3 }]
    snakeHeadIndex = (snakeHeadPosition.row - 1) * 17 + snakeHeadPosition.col - 1;
    foodScore = 0;
    document.querySelector(".score").innerHTML = foodScore;
    Array.from(cells).forEach(element => {
        element.style.backgroundColor = "";
        element.style.backgroundImage = "";
        element.classList = " ";
    });
    generateFood();
    main();
    interval = setInterval(main, 200);
})

function gameOver() {
    clearInterval(interval)
    document.querySelector(".gameOver").style.display = "flex"
    document.querySelector(".foodScore").lastElementChild.innerHTML = foodScore;
    document.querySelectorAll(".highScore")[1].innerHTML = highScore;
}