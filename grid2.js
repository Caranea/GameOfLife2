(function () {
    'use strict';
    class Cell {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.neighbors = [];
            this.living = false;
        }
        countLivingNeighbors() {
            return this.neighbors.filter((cell) => {
                return cell.living;
            }).length;
        }
    }
    class Grid {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.cells = new Array(width * height);
        }
        createCells() {
            for (var i = 0; i < this.width; i++) {
                for (var j = 0; j < this.height; j++) {
                    this.cells[i + j * this.width] = new Cell(i, j);
                }
            }
        }
        getNeighbors() {
            this.cells.forEach((cell) => {
                cell.neighbors = this.cells.filter((el) => {
                    const xx = Math.abs(el.x - cell.x);
                    const yy = Math.abs(el.y - cell.y);
                    return (xx === 1 && yy === 1) || (xx === 1 && yy === 0) || (xx === 0 && yy === 1);
                })

            })
        }
        gridUpdate() {
            const die = this.cells.filter((cell) => {
                return cell.living && ((cell.countLivingNeighbors() > 3) ||
                    (cell.countLivingNeighbors() < 2))
            })
            const reproduction = this.cells.filter((cell) => {
                return !cell.living && cell.countLivingNeighbors() === 3;
            });
            const livesOn = this.cells.filter((cell) => {
                return cell.living && (cell.countLivingNeighbors() === 2 ||
                    cell.countLivingNeighbors() === 3);
            });
            die.forEach((cell) => {
                cell.living = false;
            });
            reproduction.concat(livesOn).forEach((cell) => {
                cell.living = true;
            });
        }
        getCell(x, y) {
            return this.cells[x + y * this.width];
        }
    }
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.canvas = document.getElementById("game");
            this.ctx = this.canvas.getContext("2d");
            this.button = document.getElementById("start");
            this.canvas.width = window.innerWidth;
            this.cellWidth = this.canvas.width / width
            this.cellHeight = this.cellWidth;
            this.canvas.height = this.height * this.cellHeight;
            this.grid = new Grid(this.width, this.height);
            this.mouseDown = false;
            this.gameOn = false;
            this.intID;
            this.flowerPoints = [[46, 28], [45, 28], [46, 27], [46, 29], [47, 28], [47, 26], [48, 27], [48, 29], [47, 30], [45, 30], [44, 29], [44, 27], [45, 26], [43, 27], [42, 27], [41, 27], [41, 26], [43, 26], [43, 25], [43, 24], [43, 23], [42, 25], [42, 24], [42, 23], [44, 25], [45, 24], [44, 23], [47, 25], [47, 24], [47, 23], [48, 23], [48, 25], [49, 26], [49, 25], [50, 25], [51, 25], [51, 26], [49, 24], [50, 24], [51, 24], [50, 27], [49, 29], [50, 29], [51, 29], [51, 30], [49, 30], [48, 31], [49, 31], [50, 31], [50, 32], [50, 33], [49, 33], [49, 32], [48, 33], [47, 32], [45, 31], [45, 32], [45, 33], [44, 33], [44, 31], [43, 32], [42, 32], [41, 32], [41, 31], [42, 31], [43, 31], [43, 30], [41, 30], [42, 29]];
            this.dozenPoints = [[38, 23], [38, 22], [38, 21], [39, 21], [41, 23], [42, 23], [42, 22], [42, 21]];
            this.gunPoints = [[28, 15], [28, 16], [28, 17], [29, 14], [29, 18], [30, 19], [30, 13], [31, 13], [31, 19], [33, 18], [33, 14], [34, 15], [34, 16], [34, 17], [35, 16], [32, 16], [19, 15], [18, 15], [18, 16], [19, 16], [38, 15], [39, 15], [39, 14], [39, 13], [38, 13], [38, 14], [40, 16], [40, 12], [42, 12], [42, 11], [42, 16], [42, 17], [52, 13], [52, 14], [53, 14], [53, 13]]
            this.randomPoints = () => {
                const width = this.width;
                const height = this.height
                let points = []
                for (var i = 0; i < width; i++) {
                    for (var j = 0; j < height; j++) {
                        let point = [i, j];
                        var ran = Math.random() * 3;
                        if (ran > 2.5) {
                            points.push(point)
                        }
                    }
                }
                return points;
            };
        }
        gridInit() {
            for (var x = 0; x <= this.canvas.width; x += this.cellWidth) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            for (var y = 0; y <= this.canvas.height; y += this.cellHeight) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
        drawGame() {
            this.grid.cells.filter((cell) => {
                return cell.living;
            }).forEach((cell) => {
                this.ctx.fillStyle = '#004d4d';
                this.ctx.fillRect(cell.x * this.cellWidth, cell.y * this.cellHeight, this.cellWidth, this.cellHeight);
            });
        }
        clearGame() {
            this.ctx.fillStyle = 'azure';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#001a1a';
        }
        killAll() {
            this.grid.cells.filter((el) => {
                return el.living == true;
            }).forEach((el) => {
                el.living = false;
            })
            game.clearGame();
            game.gridInit()
        }
        populateCells(points) {
            for (let i = 0, len = points.length; i < len; i++) {
                this.grid.getCell(points[i][0], points[i][1]).living = true;
            }
            this.drawGame();
        }
        handleClick(ev) {
            let x = ev.pageX - this.canvas.offsetLeft;
            let y = ev.pageY - this.canvas.offsetTop;
            let i = Math.floor(x / this.cellWidth);
            let j = Math.floor(y / this.cellHeight);
            this.grid.getCell(i, j).living = true;
        }
        update() {
            this.grid.gridUpdate();
            const life = this.grid.cells.filter((el) => {
                return el.living == true;
            })
            if (life.length == 0) {
                this.pause();
            }
        }
        initGame() {
            this.grid.createCells();
            this.grid.getNeighbors();
            this.gridInit();
        }
        startGame() {
            this.drawGame();
            const start = () => {
                this.intID = setInterval(() => {
                    this.clearGame();
                    this.gridInit();
                    this.update();
                    this.drawGame();
                }, 30);
            }
            start();
        }
        pause() {
            clearInterval(this.intID)
        }
    }
    let game = new Game(90, 40);
    game.initGame();
    game.canvas.addEventListener('mousedown', (mousedown) => {
        game.stop;
        game.handleClick(mousedown);
        game.gridInit();
        game.drawGame();
    });
    const evList = (elId, ev, fn) => {
        document.getElementById(elId).addEventListener(ev, () => {
            fn()
        })
    }
    evList('flower', 'click', () => (game.populateCells(game.flowerPoints)));
    evList('random', 'click', () => (game.populateCells(game.randomPoints())));
    evList('dozen', 'click', () => (game.populateCells(game.dozenPoints)));
    evList('gun', 'click', () => (game.populateCells(game.gunPoints)));
    evList('start', 'click', () => (game.startGame()));
    evList('stop', 'click', () => (game.pause()));
    evList('clear', 'click', () => (game.killAll()));
}());
