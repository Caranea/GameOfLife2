(function () {
    "use strict";
    var Cell = function (x, y, cells) {
        this.living = false;
        this.x = x;
        this.y = y;
        this.neighbors = null;
        this.countNeighbors = function () {
            return this.neighbors.filter(function (cell) {
                return cell.living;
            }).length;
        };
        return this;
    };
    var Grid = function (width, height) {
        var cells = new Array(width * height);
        var livingCells = [];
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                (function () {
                    cells[i + j * width] = new Cell(i, j, cells);
                })();
            }
        }
        cells.forEach(function (cell) {
            cell.neighbors = cells.filter(function (cell2) {
                var xx = Math.abs(cell2.x - cell.x);
                var yy = Math.abs(cell2.y - cell.y);
                return (xx === 1 && yy === 1) || (xx === 1 && yy === 0) || (xx === 0 && yy === 1);
            });
        });
        this.filter = function (p) {
            return cells.filter(p);
        };
        this.updateLiving = function () {
            var die = cells.filter(function (cell) {
                return cell.living && ((cell.countNeighbors() > 3) || (cell.countNeighbors() < 2))
            })
            var reproduction = cells.filter(function (cell) {
                return !cell.living && cell.countNeighbors() === 3;
            });
            var livesOn = cells.filter(function (cell) {
                return cell.living && (cell.countNeighbors() === 2 || cell.countNeighbors() === 3);
            });
            die.forEach(function (cell) {
                cell.living = false;
            });
            reproduction.concat(livesOn).forEach(function (cell) {
                cell.living = true;
            });
        };
        this.getCell = function (x, y) {
            return cells[x + y * width];
        };
        return this;
    }
    var Game = function (tilesHorizontal, tilesVertical) {
        var a = this;
        a.canvas = document.getElementById("game");
        a.ctx = a.canvas.getContext("2d");
        a.button = document.getElementById("start");
        var viewWidth = a.canvas.width = window.innerWidth - 250,
            viewHeight = a.canvas.height = window.innerHeight - 200;
        tilesHorizontal = tilesHorizontal || 20,
            tilesVertical = tilesVertical || 20;
        var tileWidth = a.canvas.width / tilesHorizontal;
        var tileHeight = tileWidth;
        var grid = new Grid(tilesHorizontal, tilesVertical);
        var mouseDown = false;
        var handleClick = function (event) {
            var x = event.pageX - a.canvas.offsetLeft;
            var y = event.pageY - a.canvas.offsetTop;
            var i = Math.floor(x / tileWidth);
            var j = Math.floor(y / tileHeight);
            grid.getCell(i, j).living = true;
            return;
        };
        var gameOn = false;
        var stop = function () {
            gameOn = !gameOn;
        }

        /*   var coords = function (event) {
                   var x = event.pageX - a.canvas.offsetLeft;
                   var y = event.pageY - a.canvas.offsetTop;
                   var i = Math.floor(x / tileWidth);
                   var j = Math.floor(y / tileHeight);
                   document.getElementById("coor").insertAdjacentHTML("beforeend", "[" + i + "," + j + "],");
               };
               a.canvas.addEventListener('click', coords);*/


        var dozen = function (event) {
            var points = [[38, 23], [38, 22], [38, 21], [39, 21], [41, 23], [42, 23], [42, 22], [42, 21]];
            (function () {
                for (var i = 0, len = points.length; i < len; i++) {
                    grid.getCell(points[i][0], points[i][1]).living = true;
                }
            })();
            return;
        };
        document.getElementById("dozen").addEventListener("click", function (event) {
            dozen(event);
            stop();
        });
        var gun = function (event) {
            var points = [[28, 15], [28, 16], [28, 17], [29, 14], [29, 18], [30, 19], [30, 13], [31, 13], [31, 19], [33, 18], [33, 14], [34, 15], [34, 16], [34, 17], [35, 16], [32, 16], [19, 15], [18, 15], [18, 16], [19, 16], [38, 15], [39, 15], [39, 14], [39, 13], [38, 13], [38, 14], [40, 16], [40, 12], [42, 12], [42, 11], [42, 16], [42, 17], [52, 13], [52, 14], [53, 14], [53, 13]];
            (function () {
                for (var i = 0, len = points.length; i < len; i++) {
                    grid.getCell(points[i][0], points[i][1]).living = true;

                }
            })();
            return;
        };
        document.getElementById("gun").addEventListener("click", function (event) {
            gun(event);
            stop();
        });
        var random = function (event) {
            for (var i = 0; i < tilesHorizontal; i++) {
                for (var j = 0; j < tilesVertical; j++) {
                    var ran = Math.random() * 3;
                    if (ran < 1) {

                        grid.getCell(i, j).living = true;
                    }
                }
            }
            return;
        };
        document.getElementById("random").addEventListener("click", function (event) {
            random(event);
            stop();
        });
        var flower = function (event) {
            var points = [[46, 28], [45, 28], [46, 27], [46, 29], [47, 28], [47, 26], [48, 27], [48, 29], [47, 30], [45, 30], [44, 29], [44, 27], [45, 26], [43, 27], [42, 27], [41, 27], [41, 26], [43, 26], [43, 25], [43, 24], [43, 23], [42, 25], [42, 24], [42, 23], [44, 25], [45, 24], [44, 23], [47, 25], [47, 24], [47, 23], [48, 23], [48, 25], [49, 26], [49, 25], [50, 25], [51, 25], [51, 26], [49, 24], [50, 24], [51, 24], [50, 27], [49, 29], [50, 29], [51, 29], [51, 30], [49, 30], [48, 31], [49, 31], [50, 31], [50, 32], [50, 33], [49, 33], [49, 32], [48, 33], [47, 32], [45, 31], [45, 32], [45, 33], [44, 33], [44, 31], [43, 32], [42, 32], [41, 32], [41, 31], [42, 31], [43, 31], [43, 30], [41, 30], [42, 29]];
            (function () {
                for (var i = 0, len = points.length; i < len; i++) {
                    grid.getCell(points[i][0], points[i][1]).living = true;
                }
            })();
            return;
        };
        document.getElementById("flower").addEventListener("click", function (event) {
            flower(event);
            stop();
        });
        var line = function (event) {
            for (var i = 27; i < 69; i++) {
                var j = 20; {
                    (function () {
                        grid.getCell(i, j).living = true;;
                    })();
                }
            }
            return;
        };
        document.getElementById("line").addEventListener("click", function (event) {
            line(event);
            stop();
        });
        var s = document.getElementById("pause");

        window.onkeydown = function (e) {
            e = e || window.event;
            var key = e.which || e.keyCode;
            if (key === 83) {
                stop();
            }
        };

        s.addEventListener("click", function () {
            stop();
        });


        window.onresize = function (event) {
            viewWidth = a.canvas.width = window.innerWidth - 200;
            viewHeight = a.canvas.height = window.innerHeight - 100;
        };
        a.canvas.addEventListener('mousedown', function (event) {
            mouseDown = true;
            handleClick(event);
            a.canvas.addEventListener('mousemove', handleClick);
        });
        a.canvas.addEventListener('mouseup', function (event) {
            mouseDown = false;
            a.canvas.removeEventListener('mousemove', handleClick);
        });
        var intID;
        a.start = function () {
            intID = setInterval(function () {
                a.update();
                a.draw();
            }, 50);
        };
        a.update = function () {
            if (gameOn) {
                grid.updateLiving();
            }
        };

        a.draw = function () {
            a.ctx.fillStyle = 'azure';
            a.ctx.fillRect(0, 0, a.canvas.width, a.canvas.height);
            grid.filter(function (cell) {
                return cell.living;
            }).forEach(function (cell) {
                a.ctx.fillStyle = '#004d4d';
                a.ctx.fillRect(cell.x * tileWidth, cell.y * tileHeight, tileWidth, tileHeight);
            });
            a.ctx.fillStyle = '#001a1a';
            a.ctx.lineWidth = 0.3;
            for (var x = 0; x <= viewWidth; x += tileWidth) {
                a.ctx.beginPath();
                a.ctx.moveTo(x, 0);
                a.ctx.lineTo(x, viewHeight);
                a.ctx.stroke();
            };
            for (var y = 0; y <= viewHeight; y += tileHeight) {
                a.ctx.beginPath();
                a.ctx.moveTo(0, y);
                a.ctx.lineTo(viewWidth, y);
                a.ctx.stroke();
            };
        };

        var nextGame;
        a.clear = function () {
            clearInterval(intID);
            a.ctx.fillStyle = 'azure';
            a.ctx.fillRect(0, 0, a.canvas.width, a.canvas.height);
            a.ctx.fillStyle = '#001a1a';
            a.ctx.lineWidth = 0.3;
            for (var x = 0; x <= viewWidth; x += tileWidth) {
                a.ctx.beginPath();
                a.ctx.moveTo(x, 0);
                a.ctx.lineTo(x, viewHeight);
                a.ctx.stroke();
            };
            for (var y = 0; y <= viewHeight; y += tileHeight) {
                a.ctx.beginPath();
                a.ctx.moveTo(0, y);
                a.ctx.lineTo(viewWidth, y);
                a.ctx.stroke();
            };
            nextGame = new Game(90, 45);
            nextGame.start();
        };

        document.getElementById('stop').addEventListener('click', function () {
            a.clear();
        });

    };
    var game = new Game(90, 45);
    game.start();

}());
