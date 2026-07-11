// ============================================================
// Penguin + Animated Blizzard + Timer + Stomp Animation
// Canvas: 800 x 450
// ============================================================

// Screen manager
let gameState = "start"; 
let startBg;
let winBg;
let lossBg;
let bgImg;
let start_penguin;
let levelPickerBg;

// Level picker assets
let currentLevel = 1;
let lock_icon;
let check_icon;
let info_box;
let level1Complete = true;
let level2Complete = true;
let level3Complete = true;

// Start screen penguin animation
let testFrame = 0;
let testFrameTimer = 0;
let titleImg;

// Avalanche penguin animation
let avalancheFrame = 0;
let avalancheFrameTimer = 0;

// Buttons states:
let startBtnPressed = false;
let winBtnPressed = false;
let lossBtnPressed = false;
let tutorialBtnPressed = false;
let homeBtnPressed = false;
let levelPickerBtnPressed = false;

// Background stuff
const VIEW_W  = 1200;
const VIEW_H  = 780;
let WORLD_W;
let WORLD_H;
const CAM_SMOOTHING = 0.08;
let camX = 0;
let camY = 0;
let camZoom = 2; //change back to 2

// Diagonal wall bounds
const walls = [];

const SPRITES = {
  up: {
    img: null,
    frameWidth: 520,
    frameHeight: 715,
    numFrames: 6,
    animSpeed: 7,
    scale: 0.3,

    cropLeft:  [65, 25, 0, 0, 0, 0],
    cropRight: [0, 0, 20, 60, 90, 120],
    cropTop:   [0, 0, 0, 0, 0, 60],
    cropBottom:[180, 180, 180, 180, 180, 180]
  },

  start_penguin: {
    img: null,
    frameWidth: 155,
    frameHeight: 152,
    numFrames: 4,
    animSpeed: 40,
    scale: 3,

    cropLeft:  [0, 10, 20, 20],
    cropRight: [25, 20, 10, 5],
    cropTop:   [0, 0, 0, 0],
    cropBottom:[0, 0, 0, 0]
  },

  left: {
    img: null,
    frameWidth: 374,
    frameHeight: 275,
    numFrames: 6,
    animSpeed: 9,
    scale: 0.37,

    cropLeft:  [25, 35, 45, 55, 65, 75],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop:   [0, 0, 0, 0, 0, 0],
    cropBottom:[0, 0, 0, 0, 0, 0]
  },

  right: {
    img: null,
    frameWidth: 374,
    frameHeight: 273,
    numFrames: 6,
    animSpeed: 7,
    scale: 0.37,

    cropLeft:  [0, 8, 8, 8, 30, 30],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop:   [0, 0, 0, 0, 0, 0],
    cropBottom:[0, 0, 0, 0, 0, 0],
  },

  down: {
    img: null,
    frameWidth: 380,
    frameHeight: 241,
    numFrames: 6,
    animSpeed: 7,
    scale: 0.4,

    cropLeft:  [130, 85, 25, 0, 0, 0],
    cropRight: [0, 0, 0, 25, 65, 85],
    cropTop:   [0, 0, 0, 0, 0, 0],
    cropBottom:[0, 0, 0, 0, 0, 0]
  },

  stomp: {
    img: null,
    frameWidth: 140,
    frameHeight: 210,
    numFrames: 6,
    animSpeed: 10,
    scale: 1,

    cropLeft:   [0,0,0,0,0,0],
    cropRight:  [0,0,0,0,0,0],
    cropTop:    [0,0,0,0,0,0],
    cropBottom: [0,0,0,0,0,0]
  },

  penguin_avalanche:{
    frameWidth: 420,
    frameHeight: 600 ,
    numFrames: 6,
    animSpeed: 25,
    scale: 0.6,

    cropLeft:  [0, 0, 5, 15, 5, 15],
    cropRight: [0, 0, 0, 0, 0, 0],
    cropTop:   [200, 200, 200, 200, 200, 200],
    cropBottom:[0, 0, 0, 0, 0, 0]
  }
};

let player = {
  x: 0,
  y: 0,
  w: 90,
  h: 90,
  speed: 3,
  currentFrame: 0,
  frameTimer: 0,
  direction: "up",
  isMoving: false,
};

const PENGUIN_HITBOX = {
  w: 30,
  h: 40,
  offsetX: -15,
  offsetY: -35   // because the sprite is now anchored at the feet
};

let DEBUG_PENGUIN_HITBOX = false; // remove after debugging

let clearRadius = 120;
let holeOffsetX = -5;
let holeOffsetY = -70;

// TIMER
let totalTime = 180;
let startTime;
let timerStarted = false;
let gameEnded = false;  
let finalTime = null;
let flashTimer = 0;
let fastestTimes = {
    level1: null,
    level2: null,
    level3: null
};
let fastestTimesIsNew = {
    level1: false,
    level2: false,
    level3: false
};

//STOMPING ANIMATION
let stompAnimating = false;
let stompFrame = 0;
let stompFrameTimer = 0;
const STOMP_FRAME_DURATIONS = [10, 10, 10, 10, 70, 10];
const STOMP_NUM_FRAMES = 6;
let waveActive = false;
let waveRadius = 100;
let waveMaxRadius = 730; 
let waveGrowth = 25;
let waveDelay = 0;
let waveDelayActive = false;
let blueBuffer;
let ringMaskBuffer;
let worldBuffer;
let ringOffsetX = 0;
let ringOffsetY = -50;
let stompOffsetX = -5;
let stompOffsetY = 0;

// ROCKY SPIKES
const SPIKE_DRAW_W = 60;
const SPIKE_DRAW_H = 60;
const SPIKE_HITBOXES = [
  { w: 30, h: 40, offsetX: 14, offsetY: 15 },  // small spike
  { w: 45, h: 40, offsetX: 8, offsetY: 15 },  // mid spike
  { w: 48, h: 40, offsetX: 7, offsetY: 17 },  // tall spike
  { w: 45, h: 40, offsetX: 5, offsetY: 15 }   // double spike
];
let spikeImages = [];
let spikes = [];
let DEBUG_SPIKE_HITBOXES = false; //remove after testing
let selectedSpikeVariant = 0;

// Tutorial text
let tutorialActive = false;
let tutorialAlpha = 0;
let tutorialIndex = 0;
let tutorialDelay = 0;
let postTutorialTimerActive = false;
let postTutorialTimer = 0;
let postTutorialDelayFrames = 360; // 6 seconds
let tutorialBox;
let warningOutline;
let maskBuffer;
let avalancheBuffer;
let boxKey;
let tutorialSteps = [
  {
    text: "AVALANCHE\nWARNING\nIN {time} !",
    //text
    fill: [247, 20, 43],
    size: 64,
    // box
    boxFill: tutorialBox,
    delay: 60
  },
  {
    text: " ",
    //text
    fill: [140, 180, 230],
    size: 42,
    // box
    boxFill: tutorialBox,
    delay: 20
  },
  {
    text: "Use A, W, S, D\nto move around.",
    //text
    fill: [140, 180, 230],
    size: 42,
    // box
    boxFill: tutorialBox,
    delay: 20
  },
  {
    text: " ",
    //text
    fill: [140, 180, 230],
    size: 42,
    // box
    boxFill: tutorialBox,
    delay: 450
  }
];

// Fish item
let fishImg;
let fish = {
  x: 0,
  y: 0,
  w: 35,
  h: 25,
  collected: false
};
let fishIconOutline;   // when NOT collected
let fishIconFilled;    // when collected
let needFishMessageActive = false;
let needFishMessageTimer = 0;
let needFishMessageDuration = 120; // 2 seconds at 60fps
let foundFishMessageActive = false;
let foundFishMessageTimer = 0;
let foundFishMessageDuration = 240
const fishSpawns = [
  { x: 243,  y: 1821 },
  { x: 854,  y: 1203 },
  { x: 203,  y: 1586 },
  { x: 721, y: 752 },
  { x: 263,  y: 1285 }
];
// Animated fish
let fishSheet;
let fishFrameWidth = 120;
let fishFrameHeight = 120;
let fishTotalFrames = 8;
let currentFishFrame = 0;
let fishAnimationSpeed = 10;

// Stars score
let starOutlineImg;
let starFilledImg;
let starsEarned = 0; 
let bestStars = { //highest score tracker
  level1: 0,
  level2: 0,
  level3: 0
};

function preload() {
  infoButtonImg = loadImage("assets/images/info_button.png");
  wideBoxImg = loadImage("assets/images/bigger_box.png");
  gameFont = loadFont("assets/fonts/jersey10.ttf");
  titleImg = loadImage("assets/images/title_card.png");
  SPRITES.up.img = loadImage("assets/images/w_key_penguin.png");
  SPRITES.start_penguin.img = loadImage("assets/images/penguin_front.png");
  SPRITES.left.img = loadImage("assets/images/a_key_penguin.png");
  SPRITES.right.img = loadImage("assets/images/d_key_penguin.png");
  SPRITES.down.img = loadImage("assets/images/s_key_penguin.png");
  SPRITES.stomp.img = loadImage("assets/images/penguin_stomp.png");
  SPRITES.penguin_avalanche.img = loadImage("assets/images/penguin_avalanche.png");
  startBg = loadImage("assets/images/start_screen.png");
  winBg   = loadImage("assets/images/win_screen.png");
  lossBg  = loadImage("assets/images/loss_screen.png");

  levelPickerBg = loadImage("assets/images/level_picker.JPG");
  lock_icon = loadImage("assets/images/lock_icon.png");
  check_icon = loadImage("assets/images/check_icon.png");
  info_box = loadImage("assets/images/level_info_box.png");

  // Fishy stuff
  fishImg = loadImage("assets/images/test_fish.png");
  fishSheet = loadImage("assets/images/fish.png");
  fishIconOutline = loadImage("assets/images/fish_outline.png"); 
  fishIconFilled  = loadImage("assets/images/fish_item.png");

  // Star score
  starOutlineImg = loadImage("assets/images/star_outline.png");
  starFilledImg  = loadImage("assets/images/golden_star.png");

  tutorialBox = loadImage("assets/images/tutorial_box.png");
  warningOutline = loadImage("assets/images/warning_octo.png");
  boxKey = loadImage("assets/images/box_key.png");

  spikeImages[0] = loadImage("assets/images/spike_small.png");
  spikeImages[1] = loadImage("assets/images/spike_mid.png");
  spikeImages[2] = loadImage("assets/images/spike_tall.png");
  spikeImages[3] = loadImage("assets/images/spike_double.png");
  bgImg = loadImage("assets/images/tutorial_background.png", () => {
    WORLD_W = bgImg.width;
    WORLD_H = bgImg.height;
    bgScale = Math.max(VIEW_W / WORLD_W, VIEW_H / WORLD_H);
    WORLD_W_SCALED = WORLD_W * bgScale;
    WORLD_H_SCALED = WORLD_H * bgScale;
    WORLD_TOP_LIMIT = WORLD_H_SCALED / 2 - 550;
    fish.x = WORLD_W_SCALED/2 - 230;
    fish.y = WORLD_H_SCALED/2 + 740;

    // WALL 1 — centered diagonal
    walls.push({
      x1: WORLD_W_SCALED / 2 - 670,
      y1: WORLD_H_SCALED / 2 + 1200,
      x2: WORLD_W_SCALED / 2 + 290,
      y2: WORLD_H_SCALED / 2 - 1600
    });

    // WALL 2 — another diagonal, different angle
    walls.push({
      x1: WORLD_W_SCALED / 2 + 700,
      y1: WORLD_H_SCALED / 2 + 1200,
      x2: WORLD_W_SCALED / 2 - 250,
      y2: WORLD_H_SCALED / 2 - 1600
    });

    player.x = WORLD_W_SCALED / 2;
    player.y = WORLD_H_SCALED + 0;

    spikes = [
      { x: 567, y: 517, variant: 3 },
      { x: 523, y: 525, variant: 0 },
      { x: 650, y: 653, variant: 0 },
      { x: 610, y: 653, variant: 0 },
      { x: 574, y: 656, variant: 0 },
      { x: 542, y: 662, variant: 0 },
      { x: 521, y: 692, variant: 0 },
      { x: 499, y: 730, variant: 0 },
      { x: 711, y: 673, variant: 0 },
      { x: 670, y: 681, variant: 0 },
      { x: 661, y: 735, variant: 0 },
      { x: 664, y: 771, variant: 0 },
      { x: 665, y: 809, variant: 0 },
      { x: 670, y: 845, variant: 0 },
      { x: 675, y: 875, variant: 0 },
      { x: 678, y: 908, variant: 1 },
      { x: 681, y: 932, variant: 1 },
      { x: 686, y: 954, variant: 2 },
      { x: 689, y: 992, variant: 2 },
      { x: 680, y: 1022, variant: 3 },
      { x: 645, y: 1025, variant: 3 },
      { x: 613, y: 1028, variant: 3 },
      { x: 630, y: 790, variant: 0 },
      { x: 599, y: 806, variant: 0 },
      { x: 570, y: 820, variant: 0 },
      { x: 545, y: 856, variant: 0 },
      { x: 524, y: 897, variant: 0 },
      { x: 496, y: 932, variant: 1 },
      { x: 472, y: 946, variant: 1 },
      { x: 431, y: 976, variant: 1 },
      { x: 415, y: 998, variant: 2 },
      { x: 414, y: 1028, variant: 2 },
      { x: 433, y: 1050, variant: 3 },
      { x: 569, y: 894, variant: 3 },
      { x: 541, y: 921, variant: 0 },
      { x: 524, y: 954, variant: 0 },
      { x: 503, y: 995, variant: 0 },
      { x: 473, y: 1036, variant: 0 },
      { x: 601, y: 916, variant: 0 },
      { x: 609, y: 940, variant: 0 },
      { x: 621, y: 973, variant: 0 },
      { x: 705, y: 1025, variant: 0 },
      { x: 705, y: 1066, variant: 0 },
      { x: 707, y: 1113, variant: 0 },
      { x: 841, y: 984, variant: 0 },
      { x: 815, y: 984, variant: 0 },
      { x: 784, y: 970, variant: 0 },
      { x: 308, y: 1091, variant: 0 },
      { x: 332, y: 1126, variant: 0 },
      { x: 359, y: 1151, variant: 0 },
      { x: 381, y: 1178, variant: 0 },
      { x: 403, y: 1181, variant: 3 },
      { x: 419, y: 1208, variant: 3 },
      { x: 440, y: 1238, variant: 3 },
      { x: 560, y: 1192, variant: 3 },
      { x: 534, y: 1203, variant: 3 },
      { x: 490, y: 1238, variant: 3 },
      { x: 593, y: 1236, variant: 0 },
      { x: 620, y: 1255, variant: 0 },
      { x: 642, y: 1288, variant: 0 },
      { x: 658, y: 1342, variant: 3 },
      { x: 628, y: 1375, variant: 3 },
      { x: 587, y: 1386, variant: 3 },
      { x: 542, y: 1389, variant: 3 },
      { x: 480, y: 1378, variant: 1 },
      { x: 508, y: 1394, variant: 1 },
      { x: 456, y: 1394, variant: 1 },
      { x: 429, y: 1394, variant: 1 },
      { x: 384, y: 1353, variant: 1 },
      { x: 345, y: 1293, variant: 1 },
      { x: 317, y: 1249, variant: 1 },
      { x: 295, y: 1225, variant: 1 },
      { x: 240, y: 1334, variant: 0 },
      { x: 253, y: 1356, variant: 0 },
      { x: 274, y: 1405, variant: 0 },
      { x: 295, y: 1225, variant: 0 },
      { x: 313, y: 1247, variant: 0 },
      { x: 323, y: 1266, variant: 0 },
      { x: 338, y: 1293, variant: 0 },
      { x: 356, y: 1318, variant: 0 },
      { x: 371, y: 1350, variant: 0 },
      { x: 394, y: 1364, variant: 0 },
      { x: 406, y: 1389, variant: 0 },
      { x: 888, y: 1126, variant: 0 },
      { x: 867, y: 1126, variant: 0 },
      { x: 842, y: 1132, variant: 0 },
      { x: 802, y: 1135, variant: 0 },
      { x: 802, y: 1181, variant: 0 },
      { x: 807, y: 1230, variant: 0 },
      { x: 817, y: 1258, variant: 0 },
      { x: 843, y: 1367, variant: 0 },
      { x: 826, y: 1299, variant: 0 },
      { x: 831, y: 1331, variant: 0 },
      { x: 843, y: 1364, variant: 0 },
      { x: 607, y: 1711, variant: 0 },
      { x: 607, y: 1733, variant: 0 },
      { x: 607, y: 1758, variant: 0 },
      { x: 607, y: 1791, variant: 2 },
      { x: 607, y: 1826, variant: 2 },
      { x: 748, y: 1577, variant: 2 },
      { x: 717, y: 1577, variant: 2 },
      { x: 682, y: 1596, variant: 2 },
      { x: 652, y: 1629, variant: 2 },
      { x: 635, y: 1651, variant: 3 },
      { x: 610, y: 1684, variant: 3 },
      { x: 901, y: 1539, variant: 0 },
      { x: 875, y: 1539, variant: 0 },
      { x: 849, y: 1539, variant: 0 },
      { x: 811, y: 1553, variant: 0 },
      { x: 784, y: 1564, variant: 0 },
      { x: 745, y: 1279, variant: 0 },
      { x: 765, y: 1309, variant: 0 },
      { x: 790, y: 1345, variant: 0 },
      { x: 806, y: 1361, variant: 0 },
      { x: 799, y: 1575, variant: 0 },
      { x: 818, y: 1605, variant: 0 },
      { x: 835, y: 1635, variant: 0 },
      { x: 850, y: 1657, variant: 0 },
      { x: 872, y: 1681, variant: 0 },
      { x: 887, y: 1689, variant: 0 },
      { x: 716, y: 1922, variant: 0 },
      { x: 827, y: 1815, variant: 0 },
      { x: 789, y: 1815, variant: 0 },
      { x: 770, y: 1832, variant: 0 },
      { x: 742, y: 1870, variant: 0 },
      { x: 741, y: 1892, variant: 0 },
      { x: 703, y: 1700, variant: 0 },
      { x: 1035, y: 1651, variant: 0 },
      { x: 1022, y: 1670, variant: 0 },
      { x: 1002, y: 1714, variant: 0 },
      { x: 974, y: 1763, variant: 0 },
      { x: 400, y: 1586, variant: 0 },
      { x: 432, y: 1586, variant: 0 },
      { x: 451, y: 1591, variant: 0 },
      { x: 464, y: 1618, variant: 0 },
      { x: 489, y: 1657, variant: 0 },
      { x: 515, y: 1676, variant: 0 },
      { x: 541, y: 1692, variant: 0 },
      { x: 553, y: 1692, variant: 0 },
      { x: 571, y: 1706, variant: 0 },
      { x: 516, y: 1889, variant: 0 },
      { x: 469, y: 1889, variant: 0 },
      { x: 377, y: 1769, variant: 0 },
      { x: 397, y: 1791, variant: 0 },
      { x: 431, y: 1873, variant: 0 },
      { x: 405, y: 1804, variant: 0 },
      { x: 346, y: 1780, variant: 0 },
      { x: 329, y: 1793, variant: 0 },
      { x: 314, y: 1856, variant: 0 },
      { x: 297, y: 1892, variant: 0 },
      { x: 270, y: 1927, variant: 0 },
      { x: 229, y: 1935, variant: 0 },
      { x: 194, y: 1719, variant: 0 },
      { x: 192, y: 1744, variant: 0 },
      { x: 191, y: 1777, variant: 0 },
      { x: 185, y: 1823, variant: 0 },
      { x: 185, y: 1848, variant: 2 },
      { x: 182, y: 1886, variant: 2 },
      { x: 183, y: 1916, variant: 2 },
      { x: 155, y: 1627, variant: 2 },
      { x: 164, y: 1659, variant: 2 },
      { x: 175, y: 1678, variant: 2 },
      { x: 179, y: 1514, variant: 0 },
      { x: 200, y: 1501, variant: 0 },
      { x: 235, y: 1501, variant: 0 },
      { x: 255, y: 1512, variant: 0 },
      { x: 259, y: 1706, variant: 0 },
      { x: 560, y: 1558, variant: 0 },
      { x: 722, y: 1441, variant: 0 },
      { x: 271, y: 1454, variant: 0 },
      { x: 404, y: 1837, variant: 0 },
      { x: 417, y: 1870, variant: 0 },
      { x: 718, y: 2083, variant: 0 },
      { x: 716, y: 2026, variant: 0 },
      { x: 715, y: 2004, variant: 0 },
      { x: 714, y: 1955, variant: 0 },
      { x: 578, y: 1577, variant: 2 },
      { x: 604, y: 1616, variant: 2 },
      { x: 743, y: 2037, variant: 3 },
      { x: 798, y: 2037, variant: 3 },
      { x: 831, y: 2026, variant: 3 },
      { x: 857, y: 1993, variant: 3 },
      { x: 883, y: 1968, variant: 3 },
      { x: 913, y: 1922, variant: 3 },
      { x: 948, y: 1908, variant: 3 },
      { x: 982, y: 1894, variant: 3 },
      { x: 983, y: 1834, variant: 2 },
      { x: 979, y: 1796, variant: 2 },
      { x: 973, y: 1829, variant: 2 },
      { x: 220, y: 1717, variant: 2 },
      { x: 311, y: 1826, variant: 3 },
      { x: 657, y: 714, variant: 3 },
      { x: 668, y: 1695, variant: 0 },
      { x: 638, y: 1698, variant: 0 },
      { x: 423, y: 812, variant: 0 },
      { x: 944, y: 1345, variant: 0 },
    ];
  });
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  pixelDensity(1);
  imageMode(CORNER);
  startTime = millis();
  blueBuffer  = createGraphics(VIEW_W, VIEW_H);
  ringMaskBuffer = createGraphics(VIEW_W, VIEW_H);
  worldBuffer = createGraphics(VIEW_W, VIEW_H);
  maskBuffer = createGraphics(200, 200);
  avalancheBuffer = createGraphics(200, 200);
}

function drawSpikes() {
  for (let s of spikes) {
    let img = spikeImages[s.variant];
    image(img, s.x, s.y, SPIKE_DRAW_W, SPIKE_DRAW_H);
  }
}

function drawSpikeHitboxes() {
  if (!DEBUG_SPIKE_HITBOXES) return;

  push();
  noFill();

  for (let s of spikes) {
    let hb = SPIKE_HITBOXES[s.variant];
    if (!hb) continue;

    // BLUE = full spike sprite bounds
    stroke(0, 140, 255);
    strokeWeight(3 / (camZoom * bgScale));
    rect(s.x, s.y, SPIKE_DRAW_W, SPIKE_DRAW_H);

    // RED = actual collision hitbox
    stroke(255, 0, 0);
    strokeWeight(3 / (camZoom * bgScale));
    rect(
      s.x + hb.offsetX,
      s.y + hb.offsetY,
      hb.w,
      hb.h
    );
  }
  pop();
}

function drawPenguinHitbox() {
  if (!DEBUG_PENGUIN_HITBOX) return;

  let hw = PENGUIN_HITBOX.w;
  let hh = PENGUIN_HITBOX.h;
  let ox = PENGUIN_HITBOX.offsetX;
  let oy = PENGUIN_HITBOX.offsetY;

  let scale = camZoom * bgScale;

  let screenX = (player.x + ox - camX) * scale;
  let screenY = (player.y + oy - camY) * scale;

  push();
  noFill();
  stroke(0, 255, 0);
  strokeWeight(3);
  rect(
    screenX,
    screenY,
    hw * scale,
    hh * scale
  );
  pop();
}

function drawPenguinInWorld(g) {
  let cfg = stompAnimating ? SPRITES.stomp : SPRITES[player.direction];
  let f   = stompAnimating ? stompFrame : player.currentFrame;

  // cropping
  let cropL = cfg.cropLeft[f]  || 0;
  let cropR = cfg.cropRight[f] || 0;
  let cropT = cfg.cropTop[f]   || 0;
  let cropB = cfg.cropBottom[f]|| 0;

  let sx = f * cfg.frameWidth + cropL;
  let sy = cropT;
  let sw = cfg.frameWidth  - cropL - cropR;
  let sh = cfg.frameHeight - cropT - cropB;

  let dw = sw * cfg.scale;
  let dh = sh * cfg.scale;

  // world‑space feet‑anchored position
  let wx = player.x - dw / 2;
  let wy = player.y - dh + 10;

  g.image(cfg.img, wx, wy, dw, dh, sx, sy, sw, sh);
}

function drawButton(label, x, y, w, h, pressedFlag) {
  let offsetY = pressedFlag ? 4 : 0;
  let hover = mouseX > x - w/2 && mouseX < x + w/2 &&
              mouseY > y - h/2 + offsetY && mouseY < y + h/2 + offsetY;
  let pulse = sin(frameCount * 0.07) * (hover ? 0 : 3);

  // shadow
  noStroke();
  fill(10, 20, 60, 130);
  rect(floor(x-w/2+5), floor(y-h/2+5+offsetY), w, h, 8);

  // body
  fill(hover ? 60 : 42, hover ? 90 : 68, hover ? 175 : 150, 230);
  stroke(130, 170, 230, 200);
  strokeWeight(3);
  rect(floor(x-w/2+pulse/2), floor(y-h/2+offsetY+pulse/2), w-pulse, h-pulse, 8);
  noStroke();

  // shine
  fill(255, 255, 255, 50);
  rect(floor(x-w/2+pulse/2+4), floor(y-h/2+offsetY+pulse/2+4), w-pulse-8, 10, 4);

  // label
  textFont(gameFont);
  textSize(48);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  for (let [ox,oy] of [[-2,-2],[2,-2],[-2,2],[2,2]]) {
    fill(10, 20, 70, 200);
    text(label, floor(x+ox), floor(y+offsetY+oy-5));
  }

  fill(210, 230, 255);
  text(label, floor(x), floor(y+offsetY-5));
  return hover;
}

function drawTutorialButton(label, x, y, w, h, pressedFlag) {
  let offsetY = pressedFlag ? 4 : 0;

  // HITBOX (correct)
  let hover = mouseX > x - w/2 && mouseX < x + w/2 &&
              mouseY > y - h/2 + offsetY && mouseY < y + h/2 + offsetY;

  // CLICK detection
  let clicked = hover && mouseIsPressed;

  // VISUAL pulse
  let pulse = sin(frameCount * 0.07) * (hover ? 0 : 3);

  // --- drawing code unchanged ---
  noStroke();
  fill(10, 20, 60, 130);
  rect(floor(x-w/2+5), floor(y-h/2+5+offsetY), w, h, 8);

  fill(hover ? 60 : 42, hover ? 90 : 68, hover ? 175 : 150, 230);
  stroke(130, 170, 230, 200);
  strokeWeight(3);
  rect(floor(x-w/2+pulse/2), floor(y-h/2+offsetY+pulse/2), w-pulse, h-pulse, 8);
  noStroke();

  fill(255, 255, 255, 50);
  rect(floor(x-w/2+pulse/2+4), floor(y-h/2+offsetY+pulse/2+4), w-pulse-8, 10, 4);

  textFont(gameFont);
  textSize(36);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  let textYOffset = -4;

  for (let [ox,oy] of [[-2,-2],[2,-2],[-2,2],[2,2]]) {
    fill(10, 20, 70, 200);
    text(label, floor(x+ox), floor(y+offsetY+oy + textYOffset));
  }

  fill(210, 230, 255);
  text(label, floor(x), floor(y+offsetY + textYOffset));
  return { hover, clicked };
}

function drawFish() {
  if (fish.collected) return;

  // Animate fish
  if (frameCount % fishAnimationSpeed === 0) {
    currentFishFrame =
      (currentFishFrame + 1) % fishTotalFrames;
  }

  let sx = currentFishFrame * fishFrameWidth;
  let sy = 0;

  image(
    fishSheet,
    fish.x,
    fish.y,
    fish.w,
    fish.h + 10,
    sx,
    sy,
    fishFrameWidth,
    fishFrameHeight
  );
}

function drawFishIconUI() {
  let x = 40;   // screen position
  let y = 40;
  let iconW = 80;   // width
  let iconH = 50;   // height

  if (fish.collected) {
    image(fishIconFilled, x, y, iconW, iconH);
  } else {
    image(fishIconOutline, x, y, iconW, iconH);
  }
}

function randomizeFishPosition() {
  let spot = random(fishSpawns);   // p5.js random() picks a random element
  fish.x = spot.x;
  fish.y = spot.y;
}

function draw() {
  // START SCREEN
  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  // WIN SCREEN
  if (gameState === "win") {
    drawWinScreen();
    return;
  }

  // LOSS SCREEN
  if (gameState === "loss") {
    drawLossScreen();
    return;
  }

  // LEVEL PICKER
  if (gameState === "level_picker") {
    drawLevelPickerScreen();
    return;
  }

  if (gameState === "level1") {
      drawLevel1();
      return;
  }

  if (gameState === "level2") {
      drawLevel2();
      return;
  }

  if (gameState === "level3") {
      drawLevel3();
      return;
  }


  // -------------------------
  // GAMEPLAY
  // -------------------------
  if (gameEnded) {
    gameState = "loss";
    return;
  }

  handleInput();
  animateSprite();
  updateCamera();
  updateStompAnimation();
  checkFishCollision(); 

  // --- BLOCK TOP EXIT IF FISH NOT COLLECTED ---
  if (!fish.collected) {
    let penguinScreenBottom = (player.y - camY) * camZoom * bgScale;

    if (player.y < WORLD_TOP_LIMIT + 40) {
      // stop movement
      player.y = WORLD_TOP_LIMIT + 40;

      // trigger popup message
      needFishMessageActive = true;
      needFishMessageTimer = needFishMessageDuration;
    }
  }

// -------------------------
// WIN CONDITION (correct)
// -------------------------
  let feetY_screen = (player.y - camY) * camZoom * bgScale;

  if (feetY_screen < 0 && fish.collected) {
      let elapsed = floor((millis() - startTime) / 1000);
      finalTime = elapsed;

      // --- STAR SCORING ---
      starsEarned = 0;
      if (fish.collected) starsEarned++;
      let timeLeft = totalTime - finalTime;
      if (timeLeft >= 30) starsEarned++;
      if (timeLeft >= 60) starsEarned++;

      // highest score
      let starKey = "level" + currentLevel;
      if (starsEarned > bestStars[starKey]) {
        bestStars[starKey] = starsEarned;
      }

      // --- UPDATE FASTEST TIME ---
      let key = "level" + currentLevel;
      if (fastestTimes[key] === null || finalTime < fastestTimes[key]) {
          fastestTimes[key] = finalTime;
          fastestTimesIsNew[key] = true;
      } else {
          fastestTimesIsNew[key] = false;
      }

      tutorialActive = false;
      postTutorialTimerActive = false;

      gameState = "win";
      return;
  }

  // WAVE DELAY + WAVE UPDATE
  if (waveDelayActive) {
    waveDelay--;
    if (waveDelay <= 0) {
      waveDelayActive = false;
      startWaveForFrame(4);
    }
  }

  if (waveActive) {
    updateWave();
  }

  // DRAW WORLD
  push();
  scale(camZoom * bgScale);
  translate(-camX, -camY);
  drawBackground();
  drawSpikes();
  drawFish();
  drawSpikeHitboxes();
  pop();

  // DRAW CHARACTER
  drawCharacterOnScreen();
  drawPenguinHitbox();

  // Capture world frame for X-ray ring
  baseWorldFrame = get();

  // BLIZZARD OVERLAY
  drawBlizzardOverlay();

  // X-RAY RING
  if (waveActive) {
    ringMaskBuffer.clear();
    ringMaskBuffer.noStroke();

    const cx = (player.x - camX) * camZoom * bgScale + ringOffsetX;
    const cy = (player.y - camY) * camZoom * bgScale + ringOffsetY;

    const outerRadius = waveRadius;
    const innerRadius = waveRadius - 80;

    ringMaskBuffer.fill(255);
    ringMaskBuffer.circle(cx, cy, outerRadius * 2);

    if (innerRadius > 0) {
      ringMaskBuffer.erase();
      ringMaskBuffer.circle(cx, cy, innerRadius * 2);
      ringMaskBuffer.noErase();
    }

    blueBuffer.clear();
    blueBuffer.image(baseWorldFrame, 0, 0);

    let maskedBlue = blueBuffer.get();
    maskedBlue.mask(ringMaskBuffer);

    let fade = map(waveRadius, waveMaxRadius * 0.7, waveMaxRadius, 255, 0);
    fade = constrain(fade, 0, 255);

    tint(0, 120, 255, fade);
    image(maskedBlue, 0, 0);
    noTint();
  }

  // TIMER
  drawTimer();

  // draw fish ui
  drawFishIconUI();

  // TUTORIAL POST-DELAY
  if (postTutorialTimerActive) {
    postTutorialTimer++;

    if (postTutorialTimer >= postTutorialDelayFrames) {
      postTutorialTimerActive = false;
      tutorialActive = true;
      gameState = "tutorial";
      tutorialIndex = 3;
      tutorialDelay = tutorialSteps[3].delay;
    }
  }

  // TUTORIAL OVERLAY
  if (tutorialActive) {
      drawTutorialOverlay();
  }

  // --- NEED FISH POPUP MESSAGE ---
  if (needFishMessageActive) {
      needFishMessageTimer--;
      push();
      imageMode(CENTER);

      // same tutorial box image
      image(tutorialBox, width/2, height/2, 730, 200);

      // text
      textAlign(CENTER, CENTER);
      textFont(gameFont);
      textSize(32);
      stroke(10, 15, 54);
      strokeWeight(8);
      fill(247, 20, 43);

      text("You need to find Fishy first !", width/2, height/2);
      pop();

      if (needFishMessageTimer <= 0) {
        needFishMessageActive = false;
      }
  }

  if (foundFishMessageActive) {
    foundFishMessageTimer--;

    push();
    imageMode(CENTER);
    image(tutorialBox, width/2, height/2, 750, 300);

    textAlign(CENTER, CENTER);
    textFont(gameFont);
    textSize(28);
    stroke(10, 15, 54);
    strokeWeight(8);
    fill(255);

    text("You found Fishy!\nFishy tends to run away a lot...\nHurry to safety now!", width/2, height/2);
    pop();

    if (foundFishMessageTimer <= 0) {
        foundFishMessageActive = false;
    }
  }
}

function animateUpTest() {
  let cfg = SPRITES.start_penguin;

  testFrameTimer++;

  if (testFrameTimer >= cfg.animSpeed) {
    testFrameTimer = 0;
    testFrame = (testFrame + 1) % cfg.numFrames;  // loop
  }
}

function drawUpAnimation(x, y) {
  let cfg = SPRITES.start_penguin;
  let f = testFrame;

  // cropping
  let cropL = cfg.cropLeft[f];
  let cropR = cfg.cropRight[f];
  let cropT = cfg.cropTop[f];
  let cropB = cfg.cropBottom[f];

  let sx = f * cfg.frameWidth + cropL;
  let sy = cropT;
  let sw = cfg.frameWidth  - cropL - cropR;
  let sh = cfg.frameHeight - cropT - cropB;

  let dw = sw * cfg.scale;
  let dh = sh * cfg.scale;

  image(cfg.img, x, y, dw, dh, sx, sy, sw, sh);
}

function drawTutorialOverlay() {
  // Count down delay
  if (tutorialDelay > 0) {
    tutorialDelay--;
    return;
  }

  let step = tutorialSteps[tutorialIndex];

  // Format timer
  let rawText = step.text;
  let minutes = floor(totalTime / 60);
  let seconds = totalTime % 60;
  let formatted = minutes + ":" + nf(seconds, 2);
  let displayText = rawText.replace("{time}", formatted);

  push();
  textAlign(CENTER);
  textFont(gameFont);

  // Box
  imageMode(CENTER);
  image(tutorialBox, width/2, height/2 + 20, 820, 460);
  imageMode(CORNER);

  // Text
  fill(step.fill[0], step.fill[1], step.fill[2]);
  textSize(step.size);
  stroke(10, 15, 54);
  strokeWeight(8);
  if (tutorialIndex === 0) {
    textAlign(LEFT, CENTER);
    let rightEdge = width/2 - 80;
    let baseX = rightEdge - 10;
    let baseY = height/2 - 35;   // move up slightly
    let lh = step.size * 0.72;   // tighter line height (64 * 0.72 ≈ 46px)

    let parts = displayText.split("\n");

    // Line 1
    text(parts[0], baseX, baseY);

    // Line 2
    text(parts[1], baseX, baseY + lh);

    // Line 3
    text(parts[2], baseX, baseY + lh * 2);

    drawOctagon(width/2 - 230, height/2 + 17, 95, 255);
    animateAvalanche();
    avalancheBuffer.clear();
    drawAvalancheToBuffer(avalancheBuffer);
    maskBuffer.clear();
    drawOctagonMask(maskBuffer, 98);
    let avalancheImgMasked = avalancheBuffer.get();
    avalancheImgMasked.mask(maskBuffer);
    image(avalancheImgMasked, width/2 - 335, height/2 - 80);
    image(warningOutline, width/2 - 330, height/2 - 80, 200, 200);
  } 

  else if (tutorialIndex === 1) {
    textAlign(LEFT, TOP);
    textSize(step.size);
    stroke(10, 15, 54);
    strokeWeight(8);

    let leftX = width/2 - 150;
    let baseY = height/2 - 40;
    let lh = textAscent() + textDescent() + 10;

    // Line 1 split
    let before1    = "Hurry, find ";
    let highlight1 = "Fishy";
    let after1     = " and";

    // Line 2
    let line2      = "make your way down the";

    // Line 3
    let line3      = "mountain to shelter!";

    // --- LINE 1 (before + highlight + after) ---
    fill(step.fill[0], step.fill[1], step.fill[2]);
    text(before1, leftX, baseY);

    let beforeW = textWidth(before1);

    fill(255); // white highlight
    text(highlight1, leftX + beforeW, baseY);

    let highlightW = textWidth(highlight1);

    fill(step.fill[0], step.fill[1], step.fill[2]);
    text(after1, leftX + beforeW + highlightW, baseY);

    // --- LINE 2 ---
    text(line2, leftX, baseY + lh-15);

    // --- LINE 3 ---
    text(line3, leftX, baseY + lh * 2 -30);

    image(fishImg, 270, height/2 - 30, 150, 100);
  }

  else if (tutorialIndex === 2) {
    textAlign(LEFT, CENTER);
    let baseX = width/2 - 60;
    let baseY = height/2;   // move up slightly
    let lh = step.size * 0.72;   // tighter line height (64 * 0.72 ≈ 46px)

    let parts = displayText.split("\n");

    // Line 1
    text(parts[0], baseX, baseY);

    // Line 2
    text(parts[1], baseX, baseY + lh);

    fill(10, 15, 54)
    strokeWeight(2);
    textFont(gameFont);
    textSize(24);
    textAlign(CENTER);

    // W key
    rect(width/2-238, height/2-48, 60, 60, 4)
    image(boxKey, width/2-250, height/2-60, 70, 70);
    text("W", width/2 - 215, height/2 - 28);

    // S key
    rect(width/2-238, height/2+32, 60, 60, 4)
    image(boxKey, width/2-250, height/2+20, 70, 70);
    text("S", width/2 - 215, height/2 + 52);

    // A key
    rect(width/2-318, height/2+32, 60, 60, 4)
    image(boxKey, width/2-330, height/2+20, 70, 70);
    text("A", width/2 - 295, height/2 + 52);

    // D key
    rect(width/2-158, height/2+32, 60, 60, 4)
    image(boxKey, width/2-170, height/2+20, 70, 70);
    text("D", width/2 - 135, height/2 + 52);
  }

  else if (tutorialIndex === 3) {
    textAlign(LEFT, TOP);
    textSize(step.size);
    stroke(10, 15, 54);
    strokeWeight(8);

    // --- LEFT BOUND + Y POSITION CONTROL ---
    let leftX = width/2 - 305;
    let baseY = height/2 - 50; 
    let lh = textAscent() + textDescent() + 10; // line height


    // --- LINE 1 ---
    fill(step.fill[0], step.fill[1], step.fill[2]);
    text("Really can't see much... pressing space!", leftX, baseY);


    // --- LINE 2 ---
    text("But careful, vibrations makes the", leftX, baseY + lh - 15);


    // --- LINE 3 (with red highlight) ---
    let before    = "avalanche come ";
    let highlight = "45 seconds";
    let after     = " faster!";

    let line3Y = baseY + lh * 2 -30;

    // BEFORE
    fill(step.fill[0], step.fill[1], step.fill[2]);
    text(before, leftX, line3Y);

    // RED HIGHLIGHT
    let beforeW = textWidth(before);
    fill(255, 0, 0);
    text(highlight, leftX + beforeW, line3Y);

    // AFTER
    let highlightW = textWidth(highlight);
    fill(step.fill[0], step.fill[1], step.fill[2]);
    text(after, leftX + beforeW + highlightW, line3Y);
  }

  else {
    textAlign(CENTER, CENTER);
    text(step.text, width/2, height/2 + 10);
  }

  let btn = drawTutorialButton("OK", width/2 + 280, height*0.62, 100, 45, tutorialBtnPressed);
  if (btn.hover) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  if (btn.clicked) {
      tutorialBtnPressed = true;
  }
  pop()
}

function drawOctagon(cx, cy, radius, fillCol) {
  push();
  translate(cx, cy);
  rotate(PI / 8);
  noStroke();
  fill(fillCol);
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

function drawOctagonMask(g, radius) {
  g.push();
  g.clear();
  g.noStroke();
  g.fill(255);

  g.translate(g.width/2, g.height/2);
  g.rotate(PI/8);

  g.beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    g.vertex(x, y);
  }
  g.endShape(CLOSE);

  g.pop();
}

function drawAvalancheToBuffer(g) {
  let cfg = SPRITES.penguin_avalanche;
  let f = avalancheFrame;
  let yOffset = 20;
  let xOffset = -9;

  let cropL = cfg.cropLeft[f] || 0;
  let cropR = cfg.cropRight[f] || 0;
  let cropT = cfg.cropTop[f] || 0;
  let cropB = cfg.cropBottom[f] || 0;

  let sx = f * cfg.frameWidth + cropL;
  let sy = cropT;
  let sw = cfg.frameWidth - cropL - cropR;
  let sh = cfg.frameHeight - cropT - cropB;

  let dw = sw * cfg.scale;
  let dh = sh * cfg.scale;

  g.image(
    cfg.img,
    (g.width - dw) / 2 + xOffset,
    (g.height - dh) / 2 + yOffset,
    dw,
    dh,
    sx,
    sy,
    sw,
    sh
  );
}

function animateAvalanche() {
  let cfg = SPRITES.penguin_avalanche;

  avalancheFrameTimer++;

  if (avalancheFrameTimer >= cfg.animSpeed) {
    avalancheFrameTimer = 0;
    avalancheFrame = (avalancheFrame + 1) % cfg.numFrames;
  }
}

function drawAvalanche(x, y) {
  let cfg = SPRITES.penguin_avalanche;

  let f = avalancheFrame;

  let cropL = cfg.cropLeft[f] || 0;
  let cropR = cfg.cropRight[f] || 0;
  let cropT = cfg.cropTop[f] || 0;
  let cropB = cfg.cropBottom[f] || 0;

  let sx = f * cfg.frameWidth + cropL;
  let sy = cropT;
  let sw = cfg.frameWidth - cropL - cropR;
  let sh = cfg.frameHeight - cropT - cropB;

  let dw = sw * cfg.scale;
  let dh = sh * cfg.scale;

  image(
    cfg.img,
    x,
    y,
    dw,
    dh,
    sx,
    sy,
    sw,
    sh
  );
}

function keyPressed() {
  // START SCREEN → ENTER → TUTORIAL
  if (gameState === "start" && keyCode === ENTER) {
      gameState = "level_picker";
      return;
  }

  // TUTORIAL → ENTER → PLAYING
  if (gameState === "tutorial" && keyCode === ENTER) {
    // ignore ENTER until delay finishes
    if (tutorialDelay > 0) return;
    tutorialIndex++;
    if (tutorialIndex === 3) {
      tutorialActive = false;            // hide tutorial
      gameState = "playing";             // allow movement
      postTutorialTimerActive = true;    // start countdown
      postTutorialTimer = 0;
      cursor(ARROW);
      return;
    }

    if (tutorialIndex < tutorialSteps.length) {
      tutorialAlpha = 255;
      tutorialDelay = tutorialSteps[tutorialIndex].delay;
      return;
    }

    tutorialActive = false;
    gameState = "playing";
    return;
  }

  // WIN SCREEN → ENTER → START
  if (gameState === "win" && keyCode === ENTER) {
    gameState = "start";
    return;
  }

  // LOSS SCREEN → R → RESTART
  if (gameState === "loss" && key === "r") {
    resetGame();
    gameState = "playing";
    cursor(ARROW)
    return;
  }

  // LOSS SCREEN → ENTER → START
  if (gameState === "loss" && keyCode === ENTER) {
    gameState = "start";
    return;
  }
}

function resetGame() {
  gameEnded = false;
  startTime = 0;
  timerStarted = false;
  finalTime = null;

  totalTime = 180;   // reset timer
  flashTimer = 0;

  tutorialActive = false;
  postTutorialTimerActive = false;
  tutorialIndex = 0;
  tutorialDelay = 0;

  player.x = WORLD_W_SCALED / 2;
  player.y = WORLD_H_SCALED + 0;

  stompAnimating = false;
  stompFrame = 0;
  waveActive = false;
  waveRadius = 0;

  fish.collected = false;
  randomizeFishPosition();
  bestStars.level1 = 0;
  bestStars.level2 = 0;
  bestStars.level3 = 0;
}

function pointSide(px, py, x1, y1, x2, y2) {
  return (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
}

function drawBackground() {
  image(bgImg, 0, 0, WORLD_W_SCALED, WORLD_H_SCALED);
}

function updateCamera() {
  if (!WORLD_W_SCALED || !WORLD_H_SCALED) return;

  // visible window in world units
  let visibleW = VIEW_W / (camZoom * bgScale);
  let visibleH = VIEW_H / (camZoom * bgScale);

  // center camera on player
  let targetX = player.x - visibleW / 2;
  let targetY = player.y - visibleH * 0.7;

  // clamp camera to scaled world
  targetX = constrain(targetX, 0, (WORLD_W_SCALED - visibleW) - 30);
  targetY = constrain(targetY, WORLD_TOP_LIMIT, WORLD_H_SCALED - visibleH);

  camX = lerp(camX, targetX, CAM_SMOOTHING);
  camY = lerp(camY, targetY, CAM_SMOOTHING);
}

function drawTimer() {
  let elapsed = 0;
  if (timerStarted) {
      elapsed = floor((millis() - startTime) / 1000);
  }
  let timeLeft = totalTime - elapsed;

  if (timeLeft <= 0) {
    timeLeft = 0;
    gameEnded = true;
  }

  let minutes = floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  let timerText = minutes + ":" + nf(seconds, 2);

  // body
  let w = 200;
  let h = 70;
  let x = VIEW_W/2;
  let y = 70;

  // body
  fill(42, 68, 150, 230);
  stroke(130, 170, 230, 200);
  strokeWeight(3);
  rect(floor(x-w/2), floor(y-h/2), w, h, 8);
  noStroke();

  // shine
  fill(255, 255, 255, 50);
  rect(floor(x-w/2+4), floor(y-h/2+4), w-8, 10, 4);

  // FLASH LOGIC
  if (flashTimer > 0) {
    flashTimer--;

    // alternate red/white every 10 frames
    if (floor(flashTimer / 10) % 2 === 0) {
      fill(255, 0, 0);   // red
    } else {
      fill(255);         // white
    }
  } else {
    // normal timer color
    if (timeLeft <= 10) {
      fill(255, 0, 0);
    } else {
      fill(255);  // your normal color
    }
  }

  // label
  textFont(gameFont);
  textSize(72);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(timerText, width / 2, 60);
}

function drawSadEnding() {
  imageMode(CORNER);
  image(endingSadImg, 0, 0, width, height);
  imageMode(CENTER);
}

function handleInput() {
  // Allow movement during tutorial delay
  if (tutorialActive && tutorialDelay <= 0) {
    player.isMoving = false;
    return;   // freeze ONLY when the card is visible
  }

  if (stompAnimating) {
    player.isMoving = false;
    return;
  }

  let newX = player.x;
  let newY = player.y;

  // reset each frame
  player.isMoving = false;

  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {           // W / up
    newY -= player.speed;
    player.direction = "up";
    player.isMoving = true;
  }
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {           // A / left
    newX -= player.speed;
    player.direction = "left";
    player.isMoving = true;
  }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {           // D / right
    newX += player.speed;
    player.direction = "right";
    player.isMoving = true;
  }
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {           // S / down
    newY += player.speed;
    player.direction = "down";
    player.isMoving = true;
  }

  if (keyIsDown(32) && !stompAnimating) { // space bar / stomping
    stompAnimating = true;
    stompFrame = 0;
    stompFrameTimer = 0;
    waveDelay = 0;
    waveDelayActive = false;
    totalTime = max(0, totalTime - 45); // time penalty for stomp
    flashTimer= 150;
  }

  if (WORLD_W_SCALED && WORLD_H_SCALED) {
    newX = constrain(newX, player.w / 2, WORLD_W_SCALED - player.w / 2);
    newY = min(newY, WORLD_H_SCALED - player.h / 2);
  }

  // collision radius
  let r = player.w * 0.45;

  // three collision test points (world space)
  let topX    = newX;
  let topY    = newY - r;
  let leftX   = newX - r;
  let leftY   = newY;
  let rightX  = newX + r;
  let rightY  = newY;

  for (let w of walls) {
    function crossed(px, py) {
      let d0 = pointSide(player.x, player.y, w.x1, w.y1, w.x2, w.y2);
      let d1 = pointSide(px, py,        w.x1, w.y1, w.x2, w.y2);
      return d0 * d1 < 0;
    }

    if (crossed(topX, topY) ||
        crossed(leftX, leftY) ||
        crossed(rightX, rightY)) {

      let mx = newX - player.x;
      let my = newY - player.y;

      // compute wall normal
      let nx = w.y2 - w.y1;
      let ny = -(w.x2 - w.x1);

      // normalize
      let len = Math.hypot(nx, ny);
      nx /= len;
      ny /= len;

      // ⭐ ensure normal faces the player
      let side = pointSide(player.x, player.y, w.x1, w.y1, w.x2, w.y2);
      if (side < 0) {
        nx = -nx;
        ny = -ny;
      }

      // dot > 0 means movement is toward the wall
      let dot = mx * nx + my * ny;

      if (dot > 0) {
        mx -= dot * nx;
        my -= dot * ny;
      }

      newX = player.x + mx;
      newY = player.y + my;

      break;
    }
  }

  let dx = newX - player.x;
  let stepX = dx === 0 ? 0 : (dx > 0 ? 1 : -1);
  for (let i = 0; i < Math.abs(dx); i++) {
    let testX = player.x + stepX;
    if (!wouldCollideWithSpike(testX, player.y)) {

      player.x = testX;
    } else {
      break;
    }
  }
  let dy = newY - player.y;
  let stepY = dy === 0 ? 0 : (dy > 0 ? 1 : -1);
  for (let i = 0; i < Math.abs(dy); i++) {
    let testY = player.y + stepY;
    if (!wouldCollideWithSpike(player.x, testY)) {
      player.y = testY;
    } else {
      break;
    }
  }
}

function wouldCollideWithSpike(testX, testY) {
  let hw = PENGUIN_HITBOX.w;
  let hh = PENGUIN_HITBOX.h;
  let ox = PENGUIN_HITBOX.offsetX;
  let oy = PENGUIN_HITBOX.offsetY;
  let px = testX + ox;
  let py = testY + oy;
  for (let s of spikes) {
    let hb = SPIKE_HITBOXES[s.variant];
    if (!hb) continue;
    let hx = s.x + hb.offsetX;
    let hy = s.y + hb.offsetY;
    if (px + hw > hx && px < hx + hb.w && py + hh > hy && py < hy + hb.h) {
      return true;
    }
  }
  return false;
}

function checkFishCollision() {
  if (fish.collected) return;

  // Penguin hitbox in world coordinates
  let hb = PENGUIN_HITBOX;
  let px = player.x + hb.offsetX;
  let py = player.y + hb.offsetY;
  let pw = hb.w;
  let ph = hb.h;

  // Fish hitbox
  let fx = fish.x;
  let fy = fish.y;
  let fw = fish.w;
  let fh = fish.h;

  // AABB collision
  let overlap =
    px < fx + fw &&
    px + pw > fx &&
    py < fy + fh &&
    py + ph > fy;

  if (overlap) {
    fish.collected = true;

    // --- NEW POPUP TRIGGER ---
    foundFishMessageActive = true;
    foundFishMessageTimer = foundFishMessageDuration;
  }
}

function animateSprite() {
  let cfg = SPRITES[player.direction];

  if (player.isMoving) {
    player.frameTimer++;

    if (player.frameTimer >= cfg.animSpeed) {
      player.frameTimer = 0;
      player.currentFrame = (player.currentFrame + 1) % cfg.numFrames;
    }
  } else {
    player.currentFrame = 0;
    player.frameTimer = 0;
  }
}

function drawCharacterOnScreen() {
  if (stompAnimating) {
    let cfg = SPRITES.stomp;
    let f = stompFrame;
    let sx = f * cfg.frameWidth;
    let sy = 0;
    let sw = cfg.frameWidth;
    let sh = cfg.frameHeight;
    let dw = sw * cfg.scale;
    let dh = sh * cfg.scale;
    let screenX = (player.x - camX) * camZoom * bgScale - dw / 2 + stompOffsetX;
    let screenY = (player.y - camY) * camZoom * bgScale - dh + 10 + stompOffsetY;
    image(cfg.img, screenX, screenY, dw, dh, sx, sy, sw, sh);
    return;
  }


  let cfg = SPRITES[player.direction];
  let f   = player.currentFrame;

  // cropping
  let cropL = cfg.cropLeft[f]  || 0;
  let cropR = cfg.cropRight[f] || 0;
  let cropT = cfg.cropTop[f]   || 0;
  let cropB = cfg.cropBottom[f]|| 0;

  let sx = f * cfg.frameWidth + cropL;
  let sy = cropT;
  let sw = cfg.frameWidth  - cropL - cropR;
  let sh = cfg.frameHeight - cropT - cropB;

  // fixed-size penguin (never scales)
  let dw = sw * cfg.scale;
  let dh = sh * cfg.scale;
  player.w = dw;
  player.h = dh;
  player.offsetX = (cropL - cropR) * cfg.scale / 2;
  player.offsetY = (cropT - cropB) * cfg.scale / 2;

  // correct world → screen conversion
  let screenX = (player.x - camX) * camZoom * bgScale - dw / 2;
  let screenY = (player.y - camY) * camZoom * bgScale - dh + 10;

  image(cfg.img, screenX, screenY, dw, dh, sx, sy, sw, sh);
}

function updateStompAnimation() {
  if (!stompAnimating) return;

  stompFrameTimer++;

  if (stompFrameTimer >= STOMP_FRAME_DURATIONS[stompFrame]) {
    stompFrameTimer = 0;
    stompFrame++;

    if (stompFrame === 4) {
      waveDelay = 10;
      waveDelayActive = true;
    }

    if (stompFrame >= STOMP_NUM_FRAMES) {
      stompAnimating = false;
      stompFrame = 0;
    }
  }
}

function updateWave() {
  if (!waveActive) return;

  waveRadius += waveGrowth;

  if (waveRadius >= waveMaxRadius) {
    waveActive = false;
  }
}

function startWaveForFrame(frameIndex) {
  waveActive = true;
  waveRadius = 0;

  const duration = STOMP_FRAME_DURATIONS[frameIndex];
  waveGrowth = waveMaxRadius / duration;
}

function drawBlizzardOverlay() {
  let stormLayer = createGraphics(width, height);

  stormLayer.noStroke();
  stormLayer.fill(255, 255, 255, 253);
  stormLayer.rect(0, 0, width, height);

  // Convert penguin world → screen
  const screenX = (player.x - camX) * camZoom * bgScale + holeOffsetX;
  const screenY = (player.y - camY) * camZoom * bgScale + holeOffsetY;

  // Cut-out hole
  stormLayer.drawingContext.globalCompositeOperation = "destination-out";
  stormLayer.fill(255);
  stormLayer.ellipse(screenX, screenY, clearRadius * 2, clearRadius * 2);
  image(stormLayer, 0, 0);
}

function mousePressed() {
    // --- PLAY BUTTON PRESS (inside info panel) ---
    if (gameState === "level_picker" && activePanelIndex !== -1) {
      if (levelPanels[activePanelIndex].playHover) {
        playBtnPressed[activePanelIndex] = true;
      }
    }

    // --- LEVEL PICKER CLICK ---
    if (gameState === "level_picker") {
        handleLevelPickerClick();
        return;
    }

    /// --- START SCREEN BUTTON PRESS ---
    if (gameState === "start") {
      let bx = width/2, by = 400, bw = 320, bh = 64;

      if (mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
          mouseY > by-bh/2 && mouseY < by+bh/2) {
        startBtnPressed = true;
      }
      return;
    }

    // --- WIN SCREEN BUTTON ---
    if (gameState === "win") {
        let bx = width/2;
        let by = height * 0.82;
        let bw = 320;
        let bh = 64;

        if (mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
            mouseY > by-bh/2 && mouseY < by+bh/2) {
            winBtnPressed = true;
        }
    }

    // --- LOSS SCREEN BUTTON ---
    if (gameState === "loss") {
        let bx = width/2;
        let by = height * 0.45;
        let bw = 320;
        let bh = 64;

        if (mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
            mouseY > by-bh/2 && mouseY < by+bh/2) {
            lossBtnPressed = true;
        }
    }

    // --- LEVEL PICKER BUTTON (win + loss screens) ---
    if (gameState === "win" || gameState === "loss") {
      let bx = width/2, by = height*0.90, bw = 320, bh = 56;

      if (mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
          mouseY > by-bh/2 && mouseY < by+bh/2) {
        levelPickerBtnPressed = true;
      }
    }

    // --- TUTORIAL BUTTON CLICK ---
  if (gameState === "tutorial" && tutorialActive) {
        let x = width/2 + 280;
        let y = height * 0.62;
        let w = 100;
        let h = 45;
        let offsetY = tutorialBtnPressed ? 4 : 0;
        let hover =
          mouseX > x - w/2 &&
          mouseX < x + w/2 &&
          mouseY > y - h/2 + offsetY &&
          mouseY < y + h/2 + offsetY;
    if (hover) {
      tutorialBtnPressed = true;

      // START TIMER WHEN CLICKING OK ON TUTORIAL PAGE 2
      if (tutorialIndex === 2 && !timerStarted) {
          startTime = millis();
          timerStarted = true;
      }

      // advance tutorial
      tutorialIndex++;

      if (tutorialIndex >= tutorialSteps.length) {
          tutorialActive = false;
          cursor(ARROW);
          gameState = "playing";
      } else {
          tutorialDelay = tutorialSteps[tutorialIndex].delay;
      }
    }
  }
}

function mouseReleased() {
  // --- START SCREEN BUTTON RELEASE ---
  if (gameState === "start") {
    let bx = width/2, by = 400, bw = 320, bh = 64;

    let hover =
      mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
      mouseY > by-bh/2 && mouseY < by+bh/2;

    if (startBtnPressed && hover) {
      gameState = "level_picker";
    }

    startBtnPressed = false;
    return;
  }

  // --- TUTORIAL CONTINUE BUTTON RELEASE ---
  if (gameState === "tutorial") {
    let bx = width/2, by = height * 0.60, bw = 320, bh = 64;

    let hover =
      mouseX > bx-bw/2 && mouseX < bx+bw/2 &&
      mouseY > by-bh/2 && mouseY < by+bh/2;

    if (tutorialBtnPressed && hover && tutorialDelay <= 0) {
      if (tutorialIndex === 2) {
        startTime = millis();
        timerStarted = true;
      }

      tutorialIndex++;

      if (tutorialIndex === 3) {
        tutorialActive = false;
        gameState = "playing";
        postTutorialTimerActive = true;
        postTutorialTimer = 0;
      } else if (tutorialIndex < tutorialSteps.length) {
        tutorialAlpha = 255;
        tutorialDelay = tutorialSteps[tutorialIndex].delay;
      } else {
        tutorialActive = false;
        gameState = "playing";
      }
    }

    tutorialBtnPressed = false;
    return;
  }

  // --- LEVEL PICKER PLAY BUTTON RELEASE ---
  if (gameState === "level_picker" && activePanelIndex !== -1) {
    let i = activePanelIndex;

    if (playBtnPressed[i] && levelPanels[i].playHover) {
      startLevel(i);
    }

    playBtnPressed[i] = false;
    return;
  }

  // --- WIN / LOSS BUTTON RELEASES ---
  if (gameState === "win" || gameState === "loss") {
    // Level Picker button (bottom)
    let lpBx = width/2, lpBy = height*0.90, lpBw = 320, lpBh = 56;
    let lpHover =
      mouseX > lpBx-lpBw/2 && mouseX < lpBx+lpBw/2 &&
      mouseY > lpBy-lpBh/2 && mouseY < lpBy+lpBh/2;

    if (levelPickerBtnPressed && lpHover) {
      gameState = "level_picker";
    }

    let lossBx = width/2, lossBy = height*0.45, lossBw = 320, lossBh = 64;
    let lossHover =
      mouseX > lossBx-lossBw/2 && mouseX < lossBx+lossBw/2 &&
      mouseY > lossBy-lossBh/2 && mouseY < lossBy+lossBh/2;

    if (lossBtnPressed && lossHover && gameState === "loss") {
      resetGame();

      startTime = millis();     // new starting point
      timerStarted = true;      // force timer to run
      gameEnded = false;        // prevent auto-loss
      finalTime = null;         // clear old result

      tutorialActive = false;
      postTutorialTimerActive = false;
      tutorialIndex = 999;      // mark tutorial as finished

      gameState = "playing";
      cursor(ARROW);
    }


    levelPickerBtnPressed = false;
    lossBtnPressed = false;
    winBtnPressed = false;
    return;
  }
}





