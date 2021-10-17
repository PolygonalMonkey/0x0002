var DEFAULT_SIZE = 800;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var DIM = Math.min(WIDTH, HEIGHT);
var M = DIM / DEFAULT_SIZE; // SCALE FACTOR
if(M > 1){
	M = 1;
}

// let xspacing = 10; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0; // Start angle at 0
let amplitude = 45.0; // Height of wave (15-45)
let period = 500.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave

var bgColor; //BG COLOR
var bordClr; //BORDER COLOR


let hWaveTotal = 0;
let waveSpace;
var waveStyle;


// var rnd = [];
var waveTheta;
var wavesWidth;
var waveSlicesAMT;
var waveSliceHeight;
var colors;
var colorsHSL=[]; // colors in  HSL mode MIGHT MAKE IT SORTED FROM LOWEST TO HIGHEST BRIGHTNESS
// var colorsLgt=[]; // Brightness/Lightness values of the colors
var chosenGMstyle; // the chosen gradient map color
var hullClr; // the color of the hull color from the HSL conversion
var hullShd;   // the shadow color based on dark HSL conversion colors
let tokenData;

// HULL VARS
var hullLength, hullLengthPercentVAR, hOffRL; 

// MAST VARS
var mastHeight;
let currMastLoc = { //RETREIVING FROM createMast()
  mC: [],
  mB: [],
  mF: []
}
console.log(currMastLoc);

var pS,qS; // for random pos inside sail
var sailPoints = [];
var sailLoc;


// STARS VARS
var stars = [];
var starsAMT;
var starsSpeed;


function random_hash() {
  let chars = "0123456789abcdef";
  let result = '0x';
  for (let i = 64; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

class Rand {
  constructor(seed) {
    this.seed = seed
  }
  rnd_dec() {
    this.seed ^= this.seed << 13
    this.seed ^= this.seed >> 17
    this.seed ^= this.seed << 5
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000
  }
  rnd_between(a, b) {
    return a + (b - a) * this.rnd_dec()
  }
  rnd_int(a, b) {
    return Math.floor(this.rnd_between(a, b+1))
  }
  rnd_choice(x) {
    return x[Math.floor(this.rnd_between(0, x.length * 0.99))]
  }
}

//* weighterRand only for boast length
const weightedRand = (values) => {
	let i, pickedValue,
					randomNr = R.rnd_between(0,1),
					threshold = 0;

	for (i = 0; i < values.length; i++) {
			if (values[i].probability === '*') {
					pickedValue = values[i].value
					continue;
			}

			threshold += values[i].probability;
			if (threshold > randomNr) {
							pickedValue = values[i].value;
							break;
			}

			if (!pickedValue) {
					//nothing found based on probability value, so pick element marked with wildcard
					pickedValue = values.filter((value) => value.probability === '*');
			}
	}

	return pickedValue;
}

// BOAT SIZE PERCENTAGES
let boatSizePerc = [{ 
	value : 0.32, //0.32 SMALLER BOAT
	probability: 0.6
},
{
	value : 0.20,
	probability: 0.3
},
{
	value : 0.06, //0.06 LARGER BOAT
	probability: '*'
}]
//* weightedRand(boatSizePerc); // will return "aaa" in 10% calls, 
//* "bbb" in 30% calls, and "ccc" in 60% calls;

// BOAT SIZE PERCENTAGES
let gradClrPerc = [{ 
	value : 0, // Unknown colors
	probability: 0.8
},
{
	value : 1, 
	probability: 0.1 //Noir
},
{
	value : 2,
	probability: '0.05'
},
{
	value : 3,
	probability: '0.05'
},
{
	value : 3,
	probability: '*'
}]

let R;
function initVals(){

	tokenData = {"hash": random_hash()}
	// tokenData = {"hash": "0x56d7fbe766307d4125c7dd972a9ec629dc3c6a791f869daa6869998129262928"}
	// tokenData = {"hash": "0xcd6e6a4a365de9d3385ca5a6ca2641fa93e310f3f9f69447ac8748d5bbd3f642"}
	// tokenData = {"hash": "0x985bd29eadda3fe2af2c4ce4c17d17b3e39f55e7670fc95c2e16bae4159a9cae"}
	
	let mySeed = parseInt(tokenData.hash.slice(0, 16), 16);
	R = new Rand(mySeed);

  pS = R.rnd_between(0,1);
  qS = R.rnd_between(0,1);
	

	console.log(tokenData.hash);
	// waveStyle = round(R.rnd_between(0,1));
	waveStyle	= 2;  //? SEA ... SKY ... SPACE
	waveTheta = R.rnd_between(0,7.5); // Init offset position on the wave
	//! CHOSES THE MAIN WAVE STYLE!!!
	switch (waveStyle) {
		case 0:
			waveSpace      = 10; // space between each wave line (10)
			waveSlicesAMT  = map(M,0,1,60,100); // 60 - 100
			wavesWidth     = width;

			amplitude      = R.rnd_between(15,60);
			// amplitude      = 50;
			period         = 500;
			hullLengthPercentVAR = weightedRand(boatSizePerc); //* THREE SET VALUES FOR HULL SIZE
			mastHeight     = map(M,0,1,20,115);
			// mastHeight     = map(hullLengthPercentVAR * M,0.01,0.35,150,20);
			
			colors = gradientMap(waveSlicesAMT);
			// colors = getRGB(waveSlicesAMT);
			

		break;

		case 1:
			waveSpace      = 5; // space between each wave line (3-5)
			waveSlicesAMT  = 40;
			wavesWidth     = width/2;

			// amplitude       = R.rnd_between(15,60);
			amplitude      = R.rnd_between(15,60);
			// hullLengthPercentVAR = R.rnd_between(2,36)/100;
			hullLengthPercentVAR = weightedRand(boatSizePerc); //* THREE SET VALUES FOR HULL SIZE
			mastHeight     = map(M,0,1,20,110);

			// hOffRL = floor(R.rnd_between(-5,5)); //* HULL SLIDE OFFSET

			
			colors = gradientMap(waveSlicesAMT);
			// colors = getRGB(waveSlicesAMT);

		break;	

		case 2:

			starsAMT       = map(M,0,1,10,25);
			starsSpeed     = map(M,0,1,0.25,0.95);

			waveSpace      = 10; // space between each wave line (10)
			waveSlicesAMT  = 1; // 60 - 100
			wavesWidth     = width;

			amplitude      = R.rnd_between(15,60);
			// amplitude      = 50;
			period         = 500;
			hullLengthPercentVAR = weightedRand(boatSizePerc); //* THREE SET VALUES FOR HULL SIZE
			mastHeight     = map(M,0,1,20,115);

			colors = gradientMap(50);

			// colors = getRGB(waveSlicesAMT);
		break;	

		default:
		break;
	}


	waveSliceHeight = 12; // height of each rect per clice (3-16)
	waveSliceWidth  = 12; // wdith of each rect per clice (3-12)
	
	//TODO insert switch here for different color styles


	bgColor = getBG();
	bordClr = getBC();
	hullClr = colorsHSL[round(R.rnd_between(colorsHSL.length-10, colorsHSL.length-5))]
	hullShd = colorsHSL[round(R.rnd_between(1,5))]
	// colors = gradientMap(waveSlicesAMT);


}



// let canvas = Math.round(DEFAULT_SIZE * M);
let canvas = DEFAULT_SIZE * M;
function setup() {
  createCanvas(canvas, canvas);

	// frameRate(10)
	// colorMode(HSB, 100);


  // push()
  // translate(0,((height/2)-hWaveTotal/2));
	initVals();
  // pop()
	
	if(waveStyle == 2){
		starsInit(starsSpeed);
	}


	setTimeout(function(){ noLoop(); }, 100);

  // noLoop();
}

function draw() {
	push()
	colorMode(HSL);
	background(bgColor)
	pop()
	// background(250)

	
	// background(200,0,0)

	//! CHOSES THE MAIN WAVE STYLE!!!
	switch (waveStyle) {
		case 0:
			push()
			translate(0,((height/2)-hWaveTotal/2)); // positioning of the wave
			// rotate((-PI/(8*M)));
			// scale(1);
			//*  wavesWidth, waveSlicesAMT, colors, xspacing, w, amplitude, period
			calcWaves(wavesWidth,waveSlicesAMT, colors, 10, width, amplitude, 500); //* calcWaves() >> renderWave() >> renderHull() >> createMast()
			pop()
		break;

		case 1:
			push()
			translate(width/(4),((height/2)-hWaveTotal/2)); // positioning of the wave
			// rotate((-PI/(8*M)));
			// scale(1);
			//*  wavesWidth, waveSlicesAMT, colors, xspacing, w, amplitude, period
			calcWaves(wavesWidth,waveSlicesAMT, colors, 10, width, 45, 500); 
			pop()
		
		break;	

		case 2:
			push()
			translate(0,((height/2)-hWaveTotal/2)); // positioning of the wave
			// rotate((-PI/(8*M)));
			// scale(1);
			//*  wavesWidth, waveSlicesAMT, colors, xspacing, w, amplitude, period
			calcWaves(wavesWidth,waveSlicesAMT, colors, 10, width, amplitude, 500); 
			pop()

			// push()
			for (let i = 0; i < stars.length; i++) {
				stars[i].move();
				stars[i].display();
			}
			// pop();
		break;	

		default:
		break;
	}


	push()
	colorMode(HSL);
	noFill(); //* FRAME BORDER
	strokeWeight(30*M)
	// stroke(20)
	stroke(bordClr)
	rect(0,0,width,height)
	pop()
	//* ///////////////////////



}

var clickAMT= 0; 
var clicked = true;
function mouseClicked() {
	clickAMT++;
  // updateSails();
	// console.log(clickAMT);
	// if(clickAMT == 2){
	// 	// sampleMastPos();
	// }
  if (clicked == false){
		clicked = true;
    noLoop();
	} else {
    loop();
    clicked = false;
	}
}

function sampleMastPos(){
	var stoppedSailPos = sailLoc; //* Storring the mast position after second click to update sailRecs 
	
	for (var i=0; i < 200; i++) {
		// stoppedSailPos.push()
		var sailDotLoc = randomPoint(stoppedSailPos[0], stoppedSailPos[1], stoppedSailPos[2]);
		rect(sailDotLoc.x,sailDotLoc.y,3,3);
	}
	clickAMT = 0;
}

////////////////* COLORSS //////////////////////////////////////////////////////////////////////////////
function createColors(wS){
	var iclrs = [];
	for(var i=0; i < wS; i++){
		iclrs.push(floor(R.rnd_between(0,255)))
	}
	// console.log(clr);
	return gradientMap(clr);

}

function getRGB(wS){
	var clr = [];

	var j=0;
	for(var i=0; i < wS; i++){
		j++
		switch (j) {
			case 1:
				clr.push([255,0,0]);
				break;
			case 2:
				clr.push([0,255,0]);
				break;
			case 3:
				clr.push([0,0,255]);
				// j=0;
				break;
			case 4:
				clr.push([0,0,0]);
				j=0;
				break;
			default:
				break;
		}
	}
	return clr;
}

function gradientMap(wS){
  var cA, cB;
	var iclrs = [];
	//*INITIAL GREY SCALE VALUES TO GENERATE GRADIENTS
	for(var i=0; i < wS; i++){
		// iclrs.push(floor(R.rnd_between(0,255))) //WORKING
		iclrs.push(floor(R.rnd_between(0,255))) 
	}

	
	// var randStyle = round(R.rnd_between(0,3)); // seed based
	var randStyle = weightedRand(gradClrPerc); // weighted 
	var stylesGM = ["unknown", "noir", "kuro", "zebra"]
	chosenGMstyle = stylesGM[randStyle]; 
	console.log(chosenGMstyle);
	
	//* COLORS SWITCH
	switch (stylesGM[randStyle]) {
		case "unknown":
			cA = {
				r: R.rnd_between(0,0.475),
				g: R.rnd_between(0,0.475),
				b: R.rnd_between(0,0.475)
			}
			cB = {
				r: R.rnd_between(0.525,1),
				g: R.rnd_between(0.525,1),
				b: R.rnd_between(0.525,1)
			}
			break;

		case "noir":
			cA = {
				r: R.rnd_between(0.25,1),
				g: R.rnd_between(0.25,1),
				b: R.rnd_between(0.25,1)
			}
			cB = {
				r: 0,
				g: 0,
				b: 0
			}
			break;

		case "kuro":
			cA = {
				r: 0.25,
				g: 0.25,
				b: 0.25
			}
			cB = {
				r: 0,
				g: 0,
				b: 0
			}
			break;
		case "zebra":
			cA = {
				r: 1,
				g: 1,
				b: 1
			}
			cB = {
				r: 0,
				g: 0,
				b: 0
			}
			break;
		default:
			break;
	}

	console.log("cA: ", cA, "cB: ",cB);
  var gClr = [];
  var luma = 0;
  var r,g,b;
  iclrs.forEach((e, i) => {
    luma = 0.2126 * map(e,0,255,0,1) + 0.7152 * map(e,0,255,0,1) + 0.0722 * map(e,0,255,0,1);

    r = cB.r + luma * (cA.r - cB.r);
    g = cB.g + luma * (cA.g - cB.g);
    b = cB.b + luma * (cA.b - cB.b);
    
    gClr.push([round(map(r,0,1,0,255)),round(map(g,0,1,0,255)),round(map(b,0,1,0,255))]);
    // console.log(gC); //GRADIENT COLOR

		// clr = returnHex(gC[i]) //MAYBE

  });
	return gClr;
}

function getBG(){

	colors.forEach(e => {
		colorsHSL.push(rgb2hsl(e));
		// colorsLgt.push(rgb2hsl(e)[2]);
	});

	// console.log(colors);
	console.log(colorsHSL);
	// console.log(colorsLgt);
	// console.log(Math.min(...colorsLgt));
	
	// console.log(lowestIndexVal(colorsLgt));

	colorsHSL.sort(function(a, b) {
		return a[2] - b[2];
	});
	
	// return colors[round(R.rnd_between(0,colors.length-1))];

	// Returns the darkest color in HSL
	// return colorsHSL[lowestIndexVal(colorsLgt)];
	return colorsHSL[round(R.rnd_between(5,10))];
}

function getBC(){
	// return colors[round(R.rnd_between(0,colors.length-1))];
	return colorsHSL[round(R.rnd_between(colorsHSL.length-10, colorsHSL.length-5))]
};

// CONVERTS RGB TO HSL
function rgb2hsl(rgbArr){
	var r1 = rgbArr[0] / 255;
	var g1 = rgbArr[1] / 255;
	var b1 = rgbArr[2] / 255;

	var maxColor = Math.max(r1,g1,b1);
	var minColor = Math.min(r1,g1,b1);
	//Calculate L:
	var L = (maxColor + minColor) / 2 ;
	var S = 0;
	var H = 0;
	if(maxColor != minColor){
			//Calculate S:
			if(L < 0.5){
					S = (maxColor - minColor) / (maxColor + minColor);
			}else{
					S = (maxColor - minColor) / (2.0 - maxColor - minColor);
			}
			//Calculate H:
			if(r1 == maxColor){
					H = (g1-b1) / (maxColor - minColor);
			}else if(g1 == maxColor){
					H = 2.0 + (b1 - r1) / (maxColor - minColor);
			}else{
					H = 4.0 + (r1 - g1) / (maxColor - minColor);
			}
	}

	L = L * 100;
	S = S * 100;
	H = H * 60;
	if(H<0){
			H += 360;
	}
	var result = [round(H), round(S), round(L)];
	return result;
}


const lowestIndexVal = arr => {
	const creds = arr.reduce((acc, val, ind) => {
		 let { num, index } = acc;
		 if(val < num){
				num = val;
				index = ind;
		 };
		 return { num, index };
	}, {
		 num: Infinity,
		 index: -1
	});
	return creds.index;
};

////////////////*  /////////////// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ /////////////////////////////////////////////////////////



function calcWaves(waveWidth, waveSlicesAMT, colors, xspacing, w, amplitude, period ) {

  // var waveWidth = w/2; //TEST WAVEWIDTH
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(waveWidth / xspacing));

	if(clicked == true){ //* Toggle wave movement
		waveTheta = waveTheta;
	} else {
		waveTheta += 0.02; //* Angular velocity 
	}
	// console.log(theta);
  var x = waveTheta ;   // For every x value, calculate a y value with sine function
	// console.log(waveTheta);
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude;
    x += dx;
  }

	var yOff = 0;

	for (var j=0; j < waveSlicesAMT; j++){
		// push()
		fill(colors[j])
		if (j == waveSlicesAMT-1){
			renderWave(yOff, xspacing, waveSliceHeight / 2, waveSliceWidth);
		} else {
			renderWave(yOff, xspacing, waveSliceHeight, waveSliceWidth);
		}
		yOff += waveSpace; //* SPACE BETWEEN LINES
		// pop()
	}
	hWaveTotal = yOff
	// console.log(hWaveTotal);

	// fill(0,255,0);
	// fill(250);
	renderHull(yOff/2, xspacing);
}


function renderWave(yOff, xS, wSH, wSW) {
  noStroke();
  // A simple way to draw the wave with an ellipse at each location
	// console.log(yvalues.length);
  for (let x = 0; x < yvalues.length; x++) {

		// fill(colors[map(x,0,36,0,36)]);

		if(waveStyle == 2){ //Erases the wave when in space
		}else{
			rect(x * xS, yvalues[x] + yOff, wSW, wSH); //TODO ASSING DIFFERENT COLOR PER RECT
		}
  }
}

function starsInit(){ 
	console.log(colors);
	for(var i=0; i < starsAMT; i++){
		stars.push(new star(starsSpeed, colors[i]));
	}

	console.log(stars);
}

class star {
  constructor(sS, clr) {
    this.w = R.rnd_between(10,115);
		this.h = R.rnd_between(2,4);
		// this.h = 4;
		this.sS = sS;
    this.x = R.rnd_between(0, width + width/2);
    this.y = R.rnd_between(0, height - this.h);
    this.speed = R.rnd_between(5, 25) ;
		// this.clr = [255,0,0];
		this.clr = clr;
  }

  move() {
		if(this.x <= 0 - (this.w - 5)){
			this.x = width;
		}
		if(clicked == false){
			this.x -= this.speed * this.sS;
		} else {
			this.x = this.x;
		}
  }

  display() {
		// push()
		noStroke();
		// fill(0);
		fill(this.clr);
    rect(this.x, this.y, this.w, this.h);
		// pop();
  }
}

function renderHull(yOff, xS) {
  noStroke();
	
	// console.log(yvalues.length);
	var hullXParts = []
	var p1,p2, center = {x: 0,y: 0}, back = {x: 0,y: 0}, front = {x: 0,y: 0};
	hOffRL = 0;
	
	
	// console.log(hullLengthPercentVAR);
	hullLength = floor(yvalues.length * hullLengthPercentVAR);
	// hullLength = 16;
	
  for (let x = hullLength+hOffRL; x < yvalues.length-hullLength+hOffRL; x++) {

		
		push()
		colorMode(HSL)
		fill(hullShd);
    rect((x * xS)+2, yvalues[x] + yOff - 4+2, 16, 8);
		fill(hullClr)
    rect(x * xS, yvalues[x] + yOff - 4, 16, 8);
		pop()
		

		// CENTER POINT OF HULL
		// centerX = ((hullLength+yvalues.length-hullLength)/2)*xS;
		// centerY = yvalues[((hullLength+yvalues.length-hullLength)/2)] + yOff;		
		
		center.x = (round((yvalues.length)/2)*xS);
		center.y = yvalues[(round((yvalues.length)/2))-1] + yOff;

		back.x   = (round((yvalues.length+hullLength)/3.5)*xS);
		back.y   = yvalues[(round((yvalues.length+hullLength)/3.5))-1] + yOff;

		front.x   = (round((yvalues.length-(hullLength/3))*0.72)*xS); //TODO CHECK POSITION MATH IS WEIRD
		front.y   = yvalues[(round((yvalues.length-(hullLength/3))*0.72))-1] + yOff; 
  }

	// console.log(round(51/2));
	p1 = { //* STERN
		x: hullLength*xS,
		y: yvalues[hullLength] + yOff
	}
	p2 = { //* BOW
		x: (yvalues.length-hullLength)*xS,
		y: yvalues[round(yvalues.length-hullLength-1)] + yOff
	}

	//! DEBUG SPHERES
	// fill(255,0,0);
	// ellipse(p1.x,p1.y,10)
	// ellipse(p2.x,p2.y,10)
	// fill('#00f');
	// ellipse(center.x,center.y,10)
	
	// console.log(hullLengthPercentVAR);
	if(hullLengthPercentVAR == 0.32){
		createMast(center.x, center.y, p1,p2); // CENTER MAST 0 == CENTER MAST
	} else if(hullLengthPercentVAR == 0.20){
    createMast(back.x, back.y, p1,p2);     // BACK MAST
		createMast(front.x, front.y, p1,p2);   // FRONT MAST 
	}else{
    createMast(center.x, center.y, p1,p2); // CENTER MAST
		createMast(back.x, back.y, p1,p2);     // BACK MAST
		createMast(front.x, front.y, p1,p2);   // FRONT MAST 
	}
	// createMast(center.x, center.y, p1,p2); // CENTER MAST
	// createMast(back.x, back.y, p1,p2);     // BACK MAST
	// createMast(front.x, front.y, p1,p2);   // FRONT MAST //TODO bug tweak 0.20 mast positions
  
}


function createMast(cX, cY, p1, p2){
  fill(0,255,0)
	noStroke();
	// strokeWeight(3);

	// stroke(255, 0, 0);
	// stroke(255);
	var wd = 5;   // Width of mast recs
	var ht = 25;  // Height of mast recs
	var yOff = 0; // Offset of mast recs up
	
	
	let tx,ty,a;
	tx = bezierTangent(p1.x, p2.x, p1.x, p2.x, 1)
	ty = bezierTangent(p1.y, p2.y, p1.y, p2.y, 0)
  a = atan2(ty, tx);
  a -= HALF_PI;
	// line(cX, cY, cos(a) * mastHeight + cX, sin(a) * mastHeight + cY); //! <=== LINE MAST 
	

	// ellipse(p1.)

	//* MAST RECTS
	// var mX, mY, steps=15; //MAST X and Y positions
	// for(var i=0; i < 10;i++){
	// 	noStroke()

	// 	let t = i / steps;
	// 	mX = bezierPoint(cX, cX, cos(a) * mastHeight + cX, cos(a) * mastHeight + cX, t)
	// 	mY = bezierPoint(cY, cY, sin(a) * mastHeight + cY, sin(a) * mastHeight + cY, t)


  //! THESE THREE POINTS CREATE THE SAIL
	let A = { x: cX, y: cY };
	let B = { x: cos(a) * mastHeight + cX, y: sin(a) * mastHeight + cY };
	let C = { x: cX + 25, y: cY - 25};
	// 	rect(mX-wd/2,mY-ht*0.85,wd,ht);

	sailLoc = [A,B,C];

  var inRecAmt = 200;
    
  for(var i=0; i < inRecAmt; i++){
    // fill(random(0,255),0,0);
    // noFill();
    var sailDotLoc = randomPoint(A, B, C);
    push()
    colorMode(HSL)
    fill(hullShd);			
    rect(sailDotLoc.x+1,sailDotLoc.y+1,6,6);

    fill(colorsHSL[round(R.rnd_between(1,colorsHSL.length-1))])
    rect(sailDotLoc.x,sailDotLoc.y,6,6);

    pop()
  }


	// }
}


//* RANDOM POINT IN A TRIANGLE
function randomPoint(A, B, C) {
		
	p = R.rnd_between(0,1);
	q = R.rnd_between(0,1);
	// p = 0.75;
	// q = 0.75;

	if (p + q > 1) {
		p = 1 - p
		q = 1 - q
	}
	
	// A + AB * p + BC * q
	let x = A.x + (B.x - A.x) * p + (C.x - A.x) * q
	let y = A.y + (B.y - A.y) * p + (C.y - A.y) * q

	return { x, y }
}
