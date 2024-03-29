let imagePaths = [];
imagePaths.push('./Cards/10-de-copas.png');
imagePaths.push('./Cards/200px-Playing_card_diamond_9.svg.png');
imagePaths.push('./Cards/200px-Playing_card_heart_6.svg.png');
imagePaths.push('./Cards/200px-Playing_card_heart_7.svg.png');
imagePaths.push('./Cards/819px-Playing_card_club_6.svg.png');
imagePaths.push('./Cards/1200px-Playing_card_club_8.svg.png');
imagePaths.push('./Cards/1200px-Playing_card_spade_6.svg.png');
imagePaths.push('./Cards/09462a668a4c8b5126d0c64c1c42169f.jpg');
imagePaths.push('./Cards/190996-1024__12779.jpg');
imagePaths.push('./Cards/32651166-jack-of-diamonds-playing-card.jpg');
imagePaths.push('./Cards/45128575-poker-playing-card-9-club.jpg');
imagePaths.push('./Cards/45128581-poker-playing-card-9-heart.jpg');
imagePaths.push('./Cards/ace-diamonds-playing-card-isolated-white-ace-diamonds-playing-card-isolated-white-clipping-path-included-172707789.jpg');
imagePaths.push('./Cards/ace-hearts-deck-goodall-son-ltd-14968582.jpg.webp');
imagePaths.push('./Cards/ace-spades-playing-card-isolated-white-ace-spades-playing-card-isolated-white-clipping-path-included-172550077.jpg');
imagePaths.push('./Cards/f1db2cddb90fd324cc32cefe1fa066d3.jpg');
imagePaths.push('./Cards/game-card-6357341.jpg');
imagePaths.push('./Cards/images.png');
imagePaths.push('./Cards/imgbin-gong-zhu-queen-of-clubs-playing-card-suit-queen-kZexwNV8y9sDK8VnBhf8b80yM.jpg');
imagePaths.push('./Cards/imgbin-queen-of-hearts-playing-card-king-playing-cards-queen-of-hearts-playing-card-k3y46UzpkrWbts03BmdnWTpCt.jpg');
imagePaths.push('./Cards/istockphoto-502944230-612x612.jpg');
imagePaths.push('./Cards/jack-clubs-playing-card-isolated-white-clipping-path-included-jack-clubs-playing-card-isolated-white-173562459.jpg');
imagePaths.push('./Cards/king-of-diamonds-card-AERYA3.jpg');

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

// Event for setting actual game level
$('#levelSettings .settingBtn').on('click', function () {
  let gameLvlValue = $(this).attr('gameLvl');
  currentLvl = parseInt(gameLvlValue);
  $('#levelSettings .settingBtn').removeClass('settingActiveBtn');
  $(this).addClass('settingActiveBtn');
});

// Event for setting actual speed
$('#speedSettings .settingBtn').on('click', function  () {
  let gameLvlValue = $(this).attr('speed');
  currentSpeed = parseInt(gameLvlValue);
  $('#speedSettings .settingBtn').removeClass('settingActiveBtn');
  $(this).addClass('settingActiveBtn');
});

let timerInterval;
let openedCards = [];
let imagesForGame = [];
let guessedPairs = 0;


class MemoryGame {
  constructor() {
    this._counterMoves = 0;
    this._counterMistakes = 0;
  }
  get counterMoves() {
    return this._counterMoves;
  }
  set counterMoves(value) {
    this._counterMoves = value;
    $moves.text(`Moves: ${this._counterMoves}`);
  }
  get counterMistakes() {
    return this._counterMistakes;
  }
  set counterMistakes(value) {
    this._counterMistakes = value;
    $mistakes.text(`Mistakes: ${this._counterMistakes}`);
  }
}
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
$("#overlayButton").on('click', function () {
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
  if (2 == openedCards.length && compareIsTheSameTwoCards(openedCards[0], openedCards[1])) {
    ++gameObject.counterMoves;
    ++guessedPairs;
    unsubscribeCard(openedCards[0]);
    unsubscribeCard(openedCards[1]);
    openedCards = [];
  }
  else if (2 == openedCards.length) {
    ++gameObject.counterMoves;
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
  $moves.text("Moves: 0");
  $mistakes.text("Mistakes: 0");
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
