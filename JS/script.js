import MemoryGame from "./JS/memoryGame.js"; 
import {imagePaths} from "./JS/imagePaths.js"; 

const $gameBodyGrid = $("#gameBody");
const $generalOverlay = $('#overlay');
const $overlayBtn = $('#overlayButton');
const $mistakes = $('#mistakes');
const $moves = $('#moves');
const $timer = $('#timer');
// Check current game level from active level selector (default min level 4 x 4).
// Result will be summ (4x4=16)
let currentLvl = parseInt($('#levelSettings .settingActiveBtn').attr('gameLvl'));
let currentSpeed = parseInt($('#speedSettings .settingActiveBtn').attr('speed'));

let timerInterval;
let openedCards = [];
let imagesForGame = [];
let guessedPairs = 0;
let gameObject;


function resubscribeCardsOnEvent() {
  $('.oneCard').on('click', openOneCard)
};

function unsubscribeCard(index) {
  $('#gameBody .oneCard').eq(index).off('click', openOneCard);
}

function compareIsTheSameTwoCards(index1, index2) {
  return imagesForGame[index1].getAttribute('src') == imagesForGame[index2].getAttribute('src');
}

// Function for shuffle array
function shuffleImagePaths(array) {
  const shuffledArray = [...array];
  function compareRandom() {
    return Math.random() - 0.5;
  }
  shuffledArray.sort(compareRandom);
  return shuffledArray;
}

// Event for setting actual game level
$('#levelSettings .settingBtn').on('click', () => {
  let gameLvlValue = $(this).attr('gameLvl');
  currentLvl = parseInt(gameLvlValue);
  $('#levelSettings .settingBtn').removeClass('settingActiveBtn');
  $(this).addClass('settingActiveBtn');
});

// Event for setting actual speed
$('#speedSettings .settingBtn').on('click', () => {
  let gameLvlValue = $(this).attr('speed');
  currentSpeed = parseInt(gameLvlValue);
  $('#speedSettings .settingBtn').removeClass('settingActiveBtn');
  $(this).addClass('settingActiveBtn');
});

// In depends on game level selector this function generates a game grid with the appropriate numbers of cells
function generateGameGrid() {
  $gameBodyGrid.children('.oneCard').remove();
  $gameBodyGrid.attr('data-game-lvl', currentLvl);

  for (let i = 0; i < currentLvl; i++) {
    let placeholderDiv = document.createElement('div');
    placeholderDiv.classList.add('oneCard');
    $gameBodyGrid.append(placeholderDiv);
  }
  prepareImgForRound(currentLvl);
  resubscribeCardsOnEvent()
}

function prepareImgForRound(size) {
  imagesForGame = [];
  let imagePathsForRound = shuffleImagePaths(imagePaths).slice(0, (currentLvl / 2)); // get random imges for game
  imagePathsForRound = shuffleImagePaths(imagePathsForRound.concat(imagePathsForRound)); //each image mest be 2 times in game, shuffle images second time
  for (let i = 0; i < currentLvl; i++) {
    let img = document.createElement('img');
    let imgPath = imagePathsForRound.pop();
    img.setAttribute('src', imgPath);
    imagesForGame.push(img);
  }
}

// -------------------------------------------------------------------------------------------------------------------

// START GAME BUTTON
$("#overlayButton").on('click', () => {
  clearDataBeforeNewGame();
  $generalOverlay.css('display', 'none');
  $overlayBtn.hide();
  generateGameGrid();
  updateTimer();
  gameObject = new MemoryGame();
});

function openOneCard(event) {
  let clickedElement = event.target;
  let index = $('#gameBody .oneCard').index(clickedElement);
  if (2 <= openedCards.length || openedCards.includes(index)) return;
  openedCards.push(index);
  openImageInElement(index);
  ++gameObject.counterMoves;
  if (2 == openedCards.length && compareIsTheSameTwoCards(openedCards[0], openedCards[1])) {
    unsubscribeCard(openedCards[0]);
    unsubscribeCard(openedCards[1]);
    openedCards = [];
    ++guessedPairs;
  }
  else if (2 == openedCards.length) {
    ++gameObject.counterMistakes;
    setTimeout(() => {
      closeImageInElement(openedCards[0]);
      closeImageInElement(openedCards[1]);
      openedCards = [];
    }, currentSpeed);
  }
  if (guessedPairs === currentLvl / 2) {
    endGame();
  }
}

function openImageInElement(index) {
  let $imageElement = $(imagesForGame[index]);
  $('#gameBody .oneCard').eq(index).append($imageElement);
}

function closeImageInElement(index) {
  $('#gameBody .oneCard').eq(index).empty();
}

function clearDataBeforeNewGame() {
  openedCards = [];
  imagesForGame = [];
  guessedPairs = 0;
  gameObject = null;
  $moves.text("0");
  $mistakes.text("0");
  $timer.text("00:00:00");
}

function endGame() {
  $generalOverlay.css('display', 'block');
  $overlayBtn.show();
  clearInterval(timerInterval);
}

function updateTimer() {
  let timeInSeconds = 0;

  // Update timer every second
  timerInterval = setInterval(() => {
    timeInSeconds++;

    // Format and show timer in DOM
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    $timer.text(`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  }, 1000);
}
