/**
 * a constructor for the game of life
 * @constructor
 * @name CA
 *
 **/
function CA() {


    this.cols = 16;
    this.rows = 16;

    /**
     * board for cells to live on
     @name board
     @type matrix
     *
     **/
    this.board = new Array(this.cols);
    /**
     *board of the cells the user has input
     @name userBoard
     @type matrix
     *
     **/
    this.userBoard = new Array(this.cols);

    /**
     *board for the decoded matrix
     @name userBoard
     @type matrix
     *
     **/
    this.decoded = new Array(this.cols);

    for (var i = 0; i < this.cols; i++) {
        this.board[i] = new Array(this.rows);
        this.userBoard[i] = new Array(this.rows);
        this.decoded[i] = new Array(this.rows);
    }

    //if we dont initialize here there are problems later...
    for (var i = 0; i < this.cols; i++) {

        for (var j = 0; j < this.rows; j++) {
            this.board[i][j] = 0;
            this.userBoard[i][j] = 0;
            this.decoded[i][j] = 0;

        }

    }



    /**
     * applies rules of GOL to gameboard. Code adapted from https://github.com/nature-of-code/noc-examples-p5.js/tree/master/chp07_CA/NOC_7_02_GameOfLifeSimple
     * @function
     * @name generate
     *
     **/
    this.generate = function () {

        var next = new Array(this.cols);
        for (var i = 0; i < this.cols; i++) {
            next[i] = new Array(this.rows);
        }


        // Loop through every spot in our 2D array and check spots neighbors
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                // Add up all the states in a 3x3 surrounding grid
                var neighbors = 0;

                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        neighbors += this.board[(x + i + this.cols) % this.cols][(y + j + this.rows) % this.rows];

                    }
                }

                // A little trick to subtract the current cell's state since
                // we added it in the above loop
                neighbors -= this.board[x][y];

                // Rules of Life
                if ((this.board[x][y] === 1) && (neighbors < 2)) next[x][y] = 0;           // Loneliness
                else if ((this.board[x][y] === 1) && (neighbors > 3)) next[x][y] = 0;           // Overpopulation
                else if ((this.board[x][y] === 0) && (neighbors === 3)) next[x][y] = 1;           // Reproduction
                else next[x][y] = this.board[x][y];  // Stasis
            }
        }


        this.board = next;


    };
    /**
     * prints cell values to the Max console
     * @function
     * @name generate
     *
     **/
    this.print = function () {
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {

                if (this.decoded[x][y] === 1) {

                    post("cell: " + x + " " + y);
                    post();
                }


            }
        }
    };
    /**
     * copies cell values from userboard to board. Used to reset board to user defined state
     * @function
     * @name swapBoard
     *
     **/
    this.swapBoard = function () {

        this.board = this.userBoard.slice();
    };


    /**
     * a setter for board contents
     * @function
     * @name setCell
     * @param {number} x value to set cell at {number} y value to set cell at {number} a activation value
     **/
    this.setCell = function (x, y, a) {

        this.board[x][y] = a;

    };

    /**
     * a getter for board contents
     * @function
     * @name getCell
     * @param {number} x value to get cell from {number} y value to get cell from
     **/
    this.getCell = function (x, y) {

        return this.board[x][y];
    };

    /**
     * a setter for decoded board contents
     * @function
     * @name setDecodedCell
     * @param {number} x value to set cell at {number} y value to set cell at {number} a activation value
     **/

    this.setDecodedCell= function (x, y, a) {

        this.decoded[x][y]= a;
    };
    /**
     * a getter for decoded board contents
     * @function
     * @name getCell
     * @param {number} x value to get cell from {number} y value to get cell from
     **/
    this.getDecodedCell= function (x,y) {
        //first check whether the x,y address has a value at all

        if(x >= 0 && x < this.decoded.length && y >= 0 && y < this.decoded[x].length) {
            return this.decoded[x][y];
        }
        return -1;

    };

    /**
     * a setter for user board contents
     * @function
     * @name setDecodedCell
     * @param {number} x value to set cell at {number} y value to set cell at {number} a activation value
     **/
    this.setUserCell = function (x, y, a) {

        this.userBoard[x][y] = a;

    };

}

exports.CA = CA;
