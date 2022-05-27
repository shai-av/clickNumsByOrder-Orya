'use strict'

var cellInRowQnty = 3;
var gCurrNumIdx;
var gAscendingNums;
var gShuffledNums;
var gClock = document.querySelector('.clock');
var gclockInterval;
const clickSound = new Audio('sound/click.wav');
const winSound = new Audio('sound/win.wav');
const wrongCell = new Audio('sound/wrong-trimmed.wav');

function init() {
    newGame();
}

function renderBoard() {
    var strHTML = '';
    var numIdx = 0;
    for (var i = 0; i < Math.sqrt(gShuffledNums.length); i++) {
        strHTML += '<tr>';
        for (var j = 0; j < Math.sqrt(gShuffledNums.length); j++) {
            strHTML += `<td data-idx="${numIdx}" class="cell" onclick="correctCellClicked(this)">${gShuffledNums[numIdx]}</td>`;
            numIdx++;
        }
        strHTML += '</tr>';
    }
    document.querySelector('tbody.board').innerHTML = strHTML;
}

function correctCellClicked(cell) {
    var cellIdx = +cell.dataset.idx;
    if (gShuffledNums[cellIdx] === gAscendingNums[gCurrNumIdx]) {
        if (!isClicked(cell)) {
            clickSound.play();
            cell.classList.add('clickedCell');
            if (gCurrNumIdx === 0) startClock();
            gCurrNumIdx++;
            if (gCurrNumIdx < gAscendingNums.length) {
                updateNextCellGuide(gCurrNumIdx);
            }
            if (isAllCellsMarked()) {
                winSound.play();
                document.querySelector('div.board').classList.add('completedBoard');
                stopClock();
            }
        }
    } else {
        wrongCell.play();
    }
}

function isAllCellsMarked() {
    return gCurrNumIdx === gAscendingNums.length;
}

function createShuffle(arr) {
    arr = arr.slice();
    return arr.sort(() => (Math.random() > .5) ? 1 : -1);
}

function createNums(cellPerRow) {
    var nums = [];

    for (var i = 1; i <= cellPerRow ** 2; i++) {
        nums.push(i);
    }
    return nums;
}

function selectedDifficulty(val) {
    cellInRowQnty = +val;
}

function newGame() {
    stopClock();
    gClock.innerText = "0.000";
    gAscendingNums = createNums(cellInRowQnty);
    gShuffledNums = createShuffle(gAscendingNums);
    gCurrNumIdx = 0;
    updateNextCellGuide(gCurrNumIdx);
    // check if board is turned on the side , if so, turn it back over
    if (isBoardComplete()) {
        document.querySelector('div.board').classList.remove('completedBoard');
    }
    renderBoard();
}

function startClock() {
    var startingTime = new Date;
    gclockInterval = setInterval(function () {
        var currentTime = new Date;
        gClock.innerText = ((currentTime - startingTime)/1000).toFixed(3);
    }, 1);
}

function stopClock() {
    if (gclockInterval) {
        clearInterval(gclockInterval);
    }
}

function isClicked(cell) {
    return cell.classList.contains('clickedCell');
}

function isBoardComplete() {
    return document.querySelector('div.board').classList.contains('completedBoard');
}

function updateNextCellGuide(idx) {
    document.querySelector('.next-cell').innerText = gAscendingNums[idx];
}