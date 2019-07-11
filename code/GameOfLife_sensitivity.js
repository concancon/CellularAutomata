autowatch = 1;

// inlets and outlets
inlets = 1;
outlets = 2;

var width = 16;
var height = 16;
var wrapX = 0;
var wrapY = 0;
var sens = 0;
var freq= 0;
var delay= 1000;
// Jitter matrices to work with (declared globally)
var mymatrix = new JitterMatrix("copyTest", 1, "char", width, height);
var decodeMatrix = new JitterMatrix("decodeMatrix", 1, "char", width, height);
var outputMatrix = new JitterMatrix("outputMatrix", 1, "char", 1, height);

var CALib = require('CALib');

// Game of life

//pours out all the data from this.board into mymatrix for display
CALib.CA.prototype.display = function () {

    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.rows; j++) {
            if (this.board[i][j] === 1) {

                mymatrix.setcell2d(i, j, 255, 0, 0);


            } else {

                mymatrix.setcell2d(i, j, 0, 0, 0);

            }


        }


    }


};

// Initialize CA
var ca = new CALib.CA();


/////////////////////////////////////////////////////////////////////////////

//setup function

function jit_matrix(){
	

	for(var i= 0; i< 16; i++){
		
		for(var j= 0; j<16; j++){
			
			  ca.setUserCell(i, j, (mymatrix.getcell(i,j) / 255));
    		  ca.setCell(i, j, (mymatrix.getcell(i,j) / 255));
			
			}
		

	}
			
	outlet(0, "jit_matrix", mymatrix.name);	
		
}


function draw() {
	decodeMatrix.clear();
    for (var i = 0; i < 16; i++) {
        decode(i);
    }
  	

	ca.display();
	ca.generate();
    outputMatrix.clear();
    
    interpret();

    outlet(0, "jit_matrix", mymatrix.name);
	outlet(1, "jit_matrix", decodeMatrix.name);
}

function clear() {
    mymatrix.clear();
    decodeMatrix.clear();
    outputMatrix.clear();
    // Initialize CA
    ca = new CALib.CA();
    outlet(0, "jit_matrix", mymatrix.name);
    outlet(1, "jit_matrix", decodeMatrix.name);

}


function reset() {

    ca.board = ca.userBoard.slice();
    ca.display();

/*	decodeMatrix.clear();
    for (var i = 0; i < 16; i++) {
        decode(i);
    }*/
    outlet(0, "jit_matrix", mymatrix.name);
    outlet(1, "jit_matrix", decodeMatrix.name);
}

function activate(x, y, a) {

    mymatrix.setcell2d(x, y, a * 255);
    ca.setUserCell(x, y, a);
    ca.setCell(x, y, a);
   
    outlet(0, "jit_matrix", mymatrix.name);
	outlet(1, "jit_matrix", decodeMatrix.name);
}

var counter = new Array(width);
for (var i = 0; i < width; i++) {

    counter[i] = 0;
}

//https://medium.com/@raviinit/hold-on-a-second-sleep-wait-or-delay-functionality-using-javascript-8521c7cecf0e
function resetCounter() {

    for (var i = 0; i < width; i++) {

        counter[i] = 0;
    }

}

var tsk = new Task(resetCounter, this);

function decode(voiceNumber) {


    for (var x = 0; x < ca.cols; x++) {
        for (var y = 0; y < ca.rows; y++) {

            if (ca.board[x][y] === 1) {


                var a = x % wrapX;
                var b = y % wrapY;


                a = (a === voiceNumber);
                b = (b === voiceNumber);
                var c = a * b;


                if (c === 1) {
                    //wait 2 secs to reset counter

                    //set a counter per voice
                    counter[y] = ((counter[y] + 1) % sens);
                    tsk.cancel();
                    //set this in reference to phasor freq
                    tsk.schedule(delay);
                    if (counter[y] === 0) {
                        ca.decoded[x][y] = 1;
                        decodeMatrix.setcell2d(x, y, 255);

                    }


                }


            } else {
                ca.decoded[x][y] = 0;
            }

        }


    }

    
}

var y = 0;

function interpret() {


    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {

            if (ca.decoded[x][y] === 1) {
                //discard the x value. we just want to know whether a given row contains a living cell
                outputMatrix.setcell2d(0, y, 255);

            }


        }


    }
}

function setWrapX(x) {
    wrapX = x;
}

function setWrapY(y) {
    wrapY = y;
}

function setSens(a) {

    sens = 16 - a;


}

function setFreq(x){

    freq= 1/ x;
    freq = freq * 1000;
    //scale freq according to grid width
    freq = freq * width;
    delay= freq + 10;



}




