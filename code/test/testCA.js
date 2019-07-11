var CALib = require('../CALib');
var assert = require('assert');


describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe('GoL_Algorithm', function () {
    describe('initialization', function () {

        const ca = new CALib.CA();

        before(function () {

            ca.width = 16;
            ca.height = 16;
        });

        it('The game board should only contain zeros upon initialization', function () {


            for (var i = 0; i < ca.cols; i++) {

                for (var j = 0; j < ca.rows; j++) {

                    assert.equal(ca.board[i][j], 0);

                }

            }

        });

    });

    describe('ruleSet', function () {

        describe('loneliness', function () {


            const ca = new CALib.CA();

            before(function () {

                ca.width = 16;
                ca.height = 16;
                ca.setCell(0,0,1);
                ca.generate();



            });

            it('The game board should only contain zeros after a single cell is inserted and one generation passes', function () {


                for (var i = 0; i < ca.cols; i++) {

                    for (var j = 0; j < ca.rows; j++) {

                        assert.equal(ca.board[i][j], 0);

                    }

                }

            });

        });

        describe('overpopulation', function () {


            const ca = new CALib.CA();

            before(function () {

                ca.width = 16;
                ca.height = 16;
                //the cell in question
                ca.setCell(0,0,1);
                //neighbors > 3
                ca.setCell(1, 0, 1);
                ca.setCell(0, 1, 1);
                ca.setCell(1, 1, 1);
                //cells on the edges have neighbors on the other side
                ca.setCell(15,0, 1);
                ca.generate();



            });

            it(' if a cell has more than three living neighbors and one generation passes, it should die', function () {


               assert.equal(ca.getCell(0,0), 0);

            });

        });
        describe('stasis', function () {


            const ca = new CALib.CA();

            before(function () {

                ca.width = 16;
                ca.height = 16;
                //the cell in question
                ca.setCell(0,0,1);
                //neighbors > 3
                ca.setCell(1, 0, 1);
                ca.setCell(0, 1, 1);
                ca.setCell(1, 1, 1);
                ca.generate();



            });

            it('a cell should remain alive if it is surrounded by three living neighbors and one generation passes', function () {


               assert.equal(ca.getCell(0,0), 1);

            });

        });













    });


});
