// A class to manage the CA

function CA() {


    this.cols = 16;
    this.rows = 16;

    // board for cells to live on
    this.board = new Array(this.cols);
    //board of the cells the user has input
    this.userBoard = new Array(this.cols);
    //board for the decoded matrix
    this.decoded = new Array(this.cols);

    // Going to use multiple 2D arrays and swap them

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

    // The process of creating the new generation
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

    this.setCell = function (x, y, a) {

        this.board[x][y] = a;

    };

    this.getCell = function (x, y) {

        return this.board[x][y];
    }


    this.setUserCell = function (x, y, a) {

        this.userBoard[x][y] = a;

    };

}

exports.CA = CA;
