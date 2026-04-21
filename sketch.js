//The Missing Pieces - Narrative Horror Puzzle Game
// I did take help of ai for this code, specifically in figuring out the puzzle mechanics, changing the game states, text fade in effect and the arrangment of the code.

let gameState = "start";
let startButton;
let puzzleArea; //arrea of the canvas puzzle is in
let pieces = []; //array for the puzzle pices
let draggingPiece = null; //piece that is dragged
let offsetX, offsetY; //
let nextButton; //button for changing game states
let puzzleComplete = false; // tracks to see if puzzle is solved
let textAlpha = 0; //text fade in opacity for story screens
let textTimer = 0; // timer for the text to appear

// Images
let startPageImg;
let startButtonImg;
let nextButtonImg;
let doorImg;
let keyholeImg;
let roomImg;
let portraitImg;
let restartImg;
let puzzle1Images = []; // Image set for Puzzle 1
let puzzle2Images = []; // Image set for Puzzle 2
let puzzle3Images = []; // Image set for Puzzle 3

// Font
let customFont;

// Current puzzle number
let currentPuzzle = 1;

// Sound
let startMenuMusic;
let gameplayMusic;
let roomMusic;
let lastStoryMusic;
let clickSound;
let screamSound;
let currentMusic = null; // Stores the currently playing music track
let volumeSlider;

// Final screen variables
let blackAlpha = 0;
let blackFadeComplete = false;
let endTextAlpha = 0;
let restartButton;
let finalScreenTimer = 0;
let screamPlayed = false;
let musicStarted = false;

function preload() {
  // Load start screen images
  startPageImg = loadImage("Start.Page.png");
  startButtonImg = loadImage("start.button.png");

  // Load next button image
  nextButtonImg = loadImage("next.button.png");

  // Load restart button image
  restartImg = loadImage("restart.png");

  // Load background images
  doorImg = loadImage("door.png");
  keyholeImg = loadImage("keyhole.png");
  roomImg = loadImage("room.png");
  portraitImg = loadImage("portrait.png");

  // Load font
  customFont = loadFont("rawrote.ttf");

  // Load puzzle 1 piece images
  for (let i = 0; i < 9; i++) {
    puzzle1Images[i] = loadImage("puzzle1_" + i + ".png");
  }

  // Load puzzle 2 piece images
  for (let i = 0; i < 9; i++) {
    puzzle2Images[i] = loadImage("puzzle2_" + i + ".png");
  }

  // Load puzzle 3 piece images
  for (let i = 0; i < 9; i++) {
    puzzle3Images[i] = loadImage("puzzle3_" + i + ".png");
  }

  // Load sound files
  startMenuMusic = loadSound("start.menu.mp3");
  gameplayMusic = loadSound("gameplay.mp3");
  roomMusic = loadSound("room.mp3");
  lastStoryMusic = loadSound("last.story.mp3");
  clickSound = loadSound("click.mp3");
  screamSound = loadSound("scream.mp3");
}

function setup() {
  createCanvas(700, 800);

  // Create start button
  startButton = {
    x: 250,
    y: 520,
    w: 200,
    h: 60,
  };

  // Create puzzle area object
  puzzleArea = {
    x: (width - 540) / 2,
    y: 100,
    w: 540,
    h: 540,
  };

  // Create next button
  nextButton = {
    x: 250,
    y: 650,
    w: 200,
    h: 60,
  };

  // Create restart button
  restartButton = {
    x: 250,
    y: 650,
    w: 200,
    h: 60,
  };

  // Create volume slider
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(15, 770);
  volumeSlider.style("width", "150px");

  // Start music for start screen
  playMusic(startMenuMusic);
}

function draw() {
  // Update volume for all sounds
  let vol = volumeSlider.value();
  if (currentMusic) {
    currentMusic.setVolume(vol);
  }
  clickSound.setVolume(vol);
  screamSound.setVolume(vol);

  // Hide slider on start screen, show on all others
  if (gameState === "start") {
    volumeSlider.hide();
  } else {
    volumeSlider.show();
  }

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "intro") {
    drawIntroScreen();
  } else if (gameState === "puzzle1") {
    drawPuzzle(1);
  } else if (gameState === "story1") {
    drawStory1Screen();
  } else if (gameState === "puzzle2") {
    drawPuzzle(2);
  } else if (gameState === "story2") {
    drawStory2Screen();
  } else if (gameState === "puzzle3") {
    drawPuzzle(3);
  } else if (gameState === "final") {
    drawFinalScreen();
  }
}

function playMusic(track) {
  // Don't restart if already playing
  if (currentMusic === track && track.isPlaying()) {
    return;
  }

  // Stop current music
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.stop();
  }

  // Play new track
  currentMusic = track;
  track.loop();
  track.setVolume(volumeSlider.value());
}

function playClickSound() {
  if (clickSound.isPlaying()) {
    clickSound.stop();
  }
  clickSound.play();
}

function drawStartScreen() {
  // Draw start page background image
  image(startPageImg, 0, 0, width, height);

  // scaling for the start button
  let buttonAspect = startButtonImg.width / startButtonImg.height;
  let buttonWidth = startButton.w;
  let buttonHeight = buttonWidth / buttonAspect;

  // Center the button vertically within the button area
  let buttonX = startButton.x;
  let buttonY = startButton.y + (startButton.h - buttonHeight) / 2;

  // Draw start button image with scaling
  image(startButtonImg, buttonX, buttonY, buttonWidth, buttonHeight);
}

//Intro text screen
function drawIntroScreen() {
  // Draw background image
  image(doorImg, 0, 0, width, height);

  // Update timer and fade in text
  textTimer++;
  if (textTimer > 60) {
    // 1 second at 60fps
    textAlpha = min(255, textAlpha + 4);
  }

  // Draw dark overlay when text appears 
  if (textAlpha > 0) {
    fill(0, 0, 0, map(textAlpha, 0, 255, 0, 100));
    rect(0, 0, width, height);
  }

  // Draw text with fade
  if (textAlpha > 0) {
    textFont(customFont);
    fill(200, 200, 200, textAlpha);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Behind this door waits a mystery.", width / 2, 250);
    text("locked by somethign unseen...", width / 2, 300);
    text("find the key to open it", width / 2, 350);
  }

  // Draw NEXT button after text fades in
  if (textAlpha === 255) {
    drawNextButton();
  }
}

//story/text 1 screen
function drawStory1Screen() {
  // Draw background image
  image(keyholeImg, 0, 0, width, height);

  // Timer and fade in text
  textTimer++;
  if (textTimer > 60) {
    textAlpha = min(255, textAlpha + 4);
  }

  // Draw dark overlay when text appears
  if (textAlpha > 0) {
    fill(0, 0, 0, map(textAlpha, 0, 255, 0, 100));
    rect(0, 0, width, height);
  }

  // Draw text with fade
  if (textAlpha > 0) {
    textFont(customFont);
    fill(200, 200, 200, textAlpha);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("A peak into what's inside.", width / 2, 250);
    text("And what you might find.", width / 2, 300);
    text("Something compels you forward...", width / 2, 350);
  }

  // Draw NEXT button after text fully faded in
  if (textAlpha === 255) {
    drawNextButton();
  }
}

//story 2 screen
function drawStory2Screen() {
  // Draw background image
  image(roomImg, 0, 0, width, height);

  // Timer and fade in text
  textTimer++;
  if (textTimer > 60) {
    textAlpha = min(255, textAlpha + 4);
  }

  // Draw dark overlay when text appears
  if (textAlpha > 0) {
    fill(0, 0, 0, map(textAlpha, 0, 255, 0, 100));
    rect(0, 0, width, height);
  }

  // Draw text with fade
  if (textAlpha > 0) {
    textFont(customFont);
    fill(200, 200, 200, textAlpha);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("The room settles into place.", width / 2, 250);
    text("It feels like you are not alone...", width / 2, 300);
    text(
      "You spot a family portrait, maybe it could be a clue?",
      width / 2,
      350
    );
  }

  // Draw NEXT button after text fades in
  if (textAlpha === 255) {
    drawNextButton();
  }
}

//final screen
function drawFinalScreen() {
  finalScreenTimer++;

  // Play scream sound
  if (!screamPlayed) {
    if (screamSound.isPlaying()) {
      screamSound.stop();
    }
    screamSound.play();
    screamPlayed = true;
  }

  // Timer for visibility of final screen
  if (finalScreenTimer < 90) {
    image(portraitImg, 0, 0, width, height);
  } else if (!blackFadeComplete) {
    // Fading tp a black screen
    image(portraitImg, 0, 0, width, height);

    blackAlpha = min(255, blackAlpha + 1.5);
    fill(0, 0, 0, blackAlpha);
    rect(0, 0, width, height);

    // Start music midway through the fade
    if (blackAlpha > 127 && !musicStarted) {
      playMusic(lastStoryMusic);
      musicStarted = true;
    }

    // Check if fade complete
    if (blackAlpha >= 255) {
      blackFadeComplete = true;
    }
  } else {
    // Screen is fully black
    background(0);

    // Fade in the end text
    endTextAlpha = min(255, endTextAlpha + 2);

    if (endTextAlpha > 0) {
      textFont(customFont);
      fill(200, 200, 200, endTextAlpha);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("The End", width / 2, height / 2);
    }

    // Show restart button after text is fully visible
    if (endTextAlpha === 255) {
      drawRestartButton();
    }
  }
}

function drawNextButton() {
  // Scaling for next button
  let buttonAspect = nextButtonImg.width / nextButtonImg.height;
  let buttonWidth = nextButton.w;
  let buttonHeight = buttonWidth / buttonAspect;

  // Center the button vertically
  let buttonX = nextButton.x;
  let buttonY = nextButton.y + (nextButton.h - buttonHeight) / 2;

  // Draw next button image
  image(nextButtonImg, buttonX, buttonY, buttonWidth, buttonHeight);
}

function drawRestartButton() {
  // Scaling for restart button
  let buttonAspect = restartImg.width / restartImg.height;
  let buttonWidth = restartButton.w;
  let buttonHeight = buttonWidth / buttonAspect;

  // Center the button vertically
  let buttonX = restartButton.x;
  let buttonY = restartButton.y + (restartButton.h - buttonHeight) / 2;

  // Draw restart button image
  image(restartImg, buttonX, buttonY, buttonWidth, buttonHeight);
}

function initializePuzzle(puzzleNum) {
  pieces = [];
  let pieceSize = 180;
  currentPuzzle = puzzleNum;

  // Create array of grid indices and shuffle them
  let gridIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  shuffleArray(gridIndices);

  // Create 9 pieces
  for (let i = 0; i < 9; i++) {
    pieces.push({
      number: i + 1,
      correctIndex: i,
      currentIndex: gridIndices[i],
      size: pieceSize,
      color: color(random(100, 150), random(50, 100), random(100, 150)),
      imageIndex: i,
    });
  }

  puzzleComplete = false;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getGridPosition(index) {
  let pieceSize = 180;
  let col = index % 3;
  let row = floor(index / 3);
  return {
    x: puzzleArea.x + col * pieceSize,
    y: puzzleArea.y + row * pieceSize,
  };
}

function getGridIndexFromMouse(mx, my) {
  // Check if mouse is within puzzle area
  if (
    mx < puzzleArea.x ||
    mx > puzzleArea.x + puzzleArea.w ||
    my < puzzleArea.y ||
    my > puzzleArea.y + puzzleArea.h
  ) {
    return -1;
  }

  let pieceSize = 180;
  let col = floor((mx - puzzleArea.x) / pieceSize);
  let row = floor((my - puzzleArea.y) / pieceSize);
  return row * 3 + col;
}

function drawPuzzle(puzzleNum) {
  // Dark background
  background(20, 15, 25);

  // Instruction text based on puzzle
  fill(200, 200, 200);
  textAlign(CENTER, CENTER);
  textSize(24);
  textStyle(NORMAL);
  textFont("Arial");

  if (puzzleNum === 1) {
    text("Solve the puzzle to open the door.", width / 2, 50);
  } else if (puzzleNum === 2) {
    text("Piece together what lies beyond.", width / 2, 50);
  } else if (puzzleNum === 3) {
    text("Complete the portrait to reveal the truth.", width / 2, 50);
  }

  // Draw puzzle area
  fill(40, 35, 45);
  stroke(100, 90, 110);
  strokeWeight(3);
  rect(puzzleArea.x, puzzleArea.y, puzzleArea.w, puzzleArea.h);

  // Draw grid lines
  stroke(60, 55, 65);
  strokeWeight(1);
  for (let i = 1; i < 3; i++) {
    // Vertical lines
    line(
      puzzleArea.x + i * 180,
      puzzleArea.y,
      puzzleArea.x + i * 180,
      puzzleArea.y + puzzleArea.h
    );
    // Horizontal lines
    line(
      puzzleArea.x,
      puzzleArea.y + i * 180,
      puzzleArea.x + puzzleArea.w,
      puzzleArea.y + i * 180
    );
  }

  // Draw all pieces (not being dragged)
  for (let piece of pieces) {
    if (piece !== draggingPiece) {
      drawPiece(piece, false, puzzleNum);
    }
  }

  // Draw dragging piece on top
  if (draggingPiece) {
    drawPiece(draggingPiece, true, puzzleNum);
  }

  // Check if puzzle is complete
  checkPuzzleComplete();

  // Draw Next button if puzzle is complete
  if (puzzleComplete) {
    drawNextButton();
  }
}

function drawPiece(piece, isDragging, puzzleNum) {
  push();

  let pos;
  if (isDragging) {
    pos = {
      x: draggingPiece.currentX,
      y: draggingPiece.currentY,
    };
  } else {
    pos = getGridPosition(piece.currentIndex);
  }

  // Select correct puzzle image set
  let puzzleImages;
  if (puzzleNum === 1) {
    puzzleImages = puzzle1Images;
  } else if (puzzleNum === 2) {
    puzzleImages = puzzle2Images;
  } else if (puzzleNum === 3) {
    puzzleImages = puzzle3Images;
  }

  // Highlight if being dragged
  if (isDragging) {
    strokeWeight(4);
    stroke(200, 200, 100);
  } else if (piece.currentIndex === piece.correctIndex) {
    strokeWeight(2);
    stroke(100, 200, 100);
  } else {
    strokeWeight(2);
    stroke(150, 150, 150);
  }

  // Draw puzzle piece image
  image(puzzleImages[piece.imageIndex], pos.x, pos.y, piece.size, piece.size);

  // Draw border
  noFill();
  rect(pos.x, pos.y, piece.size, piece.size);

  pop();
}

function resetGame() {
  // Reset game state
  gameState = "start";

  // Reset text variables
  textAlpha = 0;
  textTimer = 0;

  // Reset puzzle state
  puzzleComplete = false;
  pieces = [];
  draggingPiece = null;

  // Reset final screen variables
  blackAlpha = 0;
  blackFadeComplete = false;
  endTextAlpha = 0;
  finalScreenTimer = 0;
  screamPlayed = false;
  musicStarted = false;

  // Stop all sounds
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.stop();
  }
  if (screamSound.isPlaying()) {
    screamSound.stop();
  }

  // Start menu music
  playMusic(startMenuMusic);
}

function mousePressed() {
  if (gameState === "start") {
    // Check if START button was clicked
    if (
      mouseX > startButton.x &&
      mouseX < startButton.x + startButton.w &&
      mouseY > startButton.y &&
      mouseY < startButton.y + startButton.h
    ) {
      playClickSound();
      gameState = "intro";
      textAlpha = 0;
      textTimer = 0;
      playMusic(gameplayMusic);
    }
  } else if (gameState === "intro") {
    // Check if NEXT button was clicked
    if (
      textAlpha === 255 &&
      mouseX > nextButton.x &&
      mouseX < nextButton.x + nextButton.w &&
      mouseY > nextButton.y &&
      mouseY < nextButton.y + nextButton.h
    ) {
      playClickSound();
      gameState = "puzzle1";
      initializePuzzle(1);
      playMusic(gameplayMusic);
    }
  } else if (gameState === "story1") {
    // Check if NEXT button was clicked
    if (
      textAlpha === 255 &&
      mouseX > nextButton.x &&
      mouseX < nextButton.x + nextButton.w &&
      mouseY > nextButton.y &&
      mouseY < nextButton.y + nextButton.h
    ) {
      playClickSound();
      gameState = "puzzle2";
      initializePuzzle(2);
      playMusic(gameplayMusic);
    }
  } else if (gameState === "story2") {
    // Check if NEXT button was clicked
    if (
      textAlpha === 255 &&
      mouseX > nextButton.x &&
      mouseX < nextButton.x + nextButton.w &&
      mouseY > nextButton.y &&
      mouseY < nextButton.y + nextButton.h
    ) {
      playClickSound();
      gameState = "puzzle3";
      initializePuzzle(3);
      playMusic(gameplayMusic);
    }
  } else if (gameState === "final") {
    // Check if RESTART button was clicked
    if (
      endTextAlpha === 255 &&
      mouseX > restartButton.x &&
      mouseX < restartButton.x + restartButton.w &&
      mouseY > restartButton.y &&
      mouseY < restartButton.y + restartButton.h
    ) {
      playClickSound();
      resetGame();
    }
  } else if (
    gameState === "puzzle1" ||
    gameState === "puzzle2" ||
    gameState === "puzzle3"
  ) {
    // Check if NEXT button was clicked
    if (puzzleComplete) {
      if (
        mouseX > nextButton.x &&
        mouseX < nextButton.x + nextButton.w &&
        mouseY > nextButton.y &&
        mouseY < nextButton.y + nextButton.h
      ) {
        playClickSound();
        if (gameState === "puzzle1") {
          gameState = "story1";
          textAlpha = 0;
          textTimer = 0;
          playMusic(gameplayMusic);
        } else if (gameState === "puzzle2") {
          gameState = "story2";
          textAlpha = 0;
          textTimer = 0;
          playMusic(roomMusic);
        } else if (gameState === "puzzle3") {
          // Stop all music before entering final screen
          if (currentMusic && currentMusic.isPlaying()) {
            currentMusic.stop();
          }
          currentMusic = null;

          gameState = "final";
          blackAlpha = 0;
          blackFadeComplete = false;
          endTextAlpha = 0;
          finalScreenTimer = 0;
          screamPlayed = false;
          musicStarted = false;
        }
        return;
      }
    }

    // Get grid index under mouse
    let gridIndex = getGridIndexFromMouse(mouseX, mouseY);

    if (gridIndex !== -1) {
      // Find piece at this grid position
      for (let piece of pieces) {
        if (piece.currentIndex === gridIndex) {
          draggingPiece = piece;
          let pos = getGridPosition(piece.currentIndex);
          offsetX = mouseX - pos.x;
          offsetY = mouseY - pos.y;
          draggingPiece.currentX = pos.x;
          draggingPiece.currentY = pos.y;
          break;
        }
      }
    }
  }
}

function mouseDragged() {
  if (
    (gameState === "puzzle1" ||
      gameState === "puzzle2" ||
      gameState === "puzzle3") &&
    draggingPiece
  ) {
    draggingPiece.currentX = mouseX - offsetX;
    draggingPiece.currentY = mouseY - offsetY;
  }
}

function mouseReleased() {
  if (
    (gameState === "puzzle1" ||
      gameState === "puzzle2" ||
      gameState === "puzzle3") &&
    draggingPiece
  ) {
    // Get grid index where piece was released
    let releaseIndex = getGridIndexFromMouse(mouseX, mouseY);

    if (releaseIndex !== -1 && releaseIndex !== draggingPiece.currentIndex) {
      // Find piece at release position and swap
      for (let piece of pieces) {
        if (piece.currentIndex === releaseIndex) {
          // Swap the two pieces
          let tempIndex = piece.currentIndex;
          piece.currentIndex = draggingPiece.currentIndex;
          draggingPiece.currentIndex = tempIndex;
          break;
        }
      }
    }

    draggingPiece = null;
  }
}

function checkPuzzleComplete() {
  puzzleComplete = true;
  for (let piece of pieces) {
    if (piece.currentIndex !== piece.correctIndex) {
      puzzleComplete = false;
      break;
    }
  }
}
