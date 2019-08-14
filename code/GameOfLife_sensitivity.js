autowatch = 1;

// inlets and outlets
inlets = 1;
outlets = 2;

/**
 * width of board currently in use
 @name width
 @type number
 *
 **/
var width = 16;
/**
 * height of board currently in use
 @name height
 @type number
 *
 **/
var height = 16;
/**
 * wrapX value for decoding scheme
 @name wrapX
 @type number
 *
 **/
var wrapX = 0;
/**
 * wrapY value for decoding scheme
 @name wrapY
 @type number
 *
 **/
var wrapY = 0;
/**
 * sensitivity value for decoding scheme
 @name sensitiviy
 @type number
 *
 **/
var sens = 0;
/**
 * frequency value for decoding scheme
 @name freq
 @type number
 *
 **/
var freq = 0;
/**
 * delay value for decoding scheme
 @name delay
 @type number
 *
 **/
var delay = 1000;
/**
 * matrix corresponding to user UI object
 @name mymatrix
 @type  matrix
 *
 **/
var mymatrix = new JitterMatrix("copyTest", 1, "char", width, height);
/**
 * matrix corresponding to user decode object
 @name decodematrix
 @type matrix
 *
 **/
var decodeMatrix = new JitterMatrix("decodeMatrix", 1, "char", width, height);
/**
 * 1d matrix for output
 @name outputMatrix
 @type matrix
 *
 **/
var outputMatrix = new JitterMatrix("outputMatrix", 1, "char", 1, height);

var CALib = require('CALib');

// Game of life
/***
 * reads cell values from an instance of a ca object and passes them to ui objects
 * @function
 * @name display
 *
 **/
function display(ca) {

    for (var i = 0; i < ca.cols; i++) {
        for (var j = 0; j < ca.rows; j++) {
            if (ca.getCell(i, j) === 1) {

                mymatrix.setcell2d(i, j, 255, 0, 0);


            } else {

                mymatrix.setcell2d(i, j, 0, 0, 0);

            }


        }


    }


}

// Initialize CA
var ca = new CALib.CA();


/////////////////////////////////////////////////////////////////////////////

/**
 * reads cell values from storage and writes them to current instance of a ca object
 * @function
 * @name jit_matrix
 *
 **/

function jit_matrix() {

post("hey im called ");
post();
    for (var i = 0; i < 16; i++) {

        for (var j = 0; j < 16; j++) {

            ca.setUserCell(i, j, (mymatrix.getcell(i, j) / 255));
            ca.setCell(i, j, (mymatrix.getcell(i, j) / 255));

        }


    }

    outlet(0, "jit_matrix", mymatrix.name);

}

/**
 * per iteration reads cell values from ca object and writes them to ui objects; applies GOL rules; applies decoding scheme
 * @function
 * @name draw
 *
 **/
function draw() {
    decodeMatrix.clear();
    for (var i = 0; i < 16; i++) {
        decode(i);
    }


    display(ca);
    ca.generate();
    outputMatrix.clear();
    interpret();

    outlet(0, "jit_matrix", mymatrix.name);
    outlet(1, "jit_matrix", decodeMatrix.name);
}
/**
 * clears all matrices and reinstantiates CALib
 * @function
 * @name clear
 *
 **/
function clear() {
    mymatrix.clear();
    decodeMatrix.clear();
    outputMatrix.clear();
    // Initialize CA
    ca = new CALib.CA();
    outlet(0, "jit_matrix", mymatrix.name);
    outlet(1, "jit_matrix", decodeMatrix.name);

}

/**
 * resets board to state configured by the user via ui object
 * @function
 * @name reset
 *
 **/
function reset() {

    ca.swapBoard();
    display(ca);
    outlet(0, "jit_matrix", mymatrix.name);
    outlet(1, "jit_matrix", decodeMatrix.name);
}
/**
 * reads cell values from ui objects and writes them to current instance of a ca object
 * @function
 * @name activate
 * @param {number} x x coordinate to activate.
 * @param {number} y y coordinate to activate
 * @param {number} a activation value
 *
 **/
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
/**
 * set counter to 0. used for sensitivity parameter
 * @function
 * @name resetCounter
 *
 **/
function resetCounter() {

    for (var i = 0; i < width; i++) {

        counter[i] = 0;
    }

}

var tsk = new Task(resetCounter, this);




/**
 * applies decoding scheme to game board. code adapted from Cycling 74 forum post: https://cycling74.com/forums/little-cellular-automata-sequencer
 * @function
 * @name decode
 * @param {number} voice number to apply decoding to
 *
 **/
function decode(voiceNumber) {


    for (var x = 0; x < ca.cols; x++) {
        for (var y = 0; y < ca.rows; y++) {

            if (ca.getCell(x, y) === 1) {


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
                        ca.setDecodedCell(x, y, 1);
                        decodeMatrix.setcell2d(x, y, 255);

                    }


                }


            } else {
                ca.setDecodedCell(x, y, 0);
            }

        }


    }


}

var y = 0;
/**
 * interprets output from decoding function in 1 dimension
 * @function
 * @name interpret
 *
 **/
function interpret() {


    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {

            var decodedCell = ca.getDecodedCell(x, y);
            if (decodedCell === 1) {
                //discard the x value. we just want to know whether a given row contains a living cell
                outputMatrix.setcell2d(0, y, 255);

            } else if (decodedCell === -1) {
                post("index does not exist");
                post();
            }


        }


    }
}

/**
 * a setter for wrapX param
 * @function
 * @name setWrapX
 * @param {number}  x value to wrap around
 **/
function setWrapX(x) {
    wrapX = x;
}

/**
 * a setter for wrapY param
 * @function
 * @name setWrapY
 * @param {number}  y value to wrap around
 **/
function setWrapY(y) {
    wrapY = y;
}
/**
 * a setter for sensitivity param
 * @function
 * @name setSens
 * @param {number} sensitivity value
 **/
function setSens(a) {

    sens = 16 - a;


}
/**
 * a setter for frequency param. used to calculate delay and sensitivity
 * @function
 * @name setFreq
 * @param {number} frequency value
 **/
function setFreq(x) {

    freq = 1 / x;
    freq = freq * 1000;
    //scale freq according to grid width
    freq = freq * width;
    delay = freq + 10;


}




