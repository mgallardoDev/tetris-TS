import './style.css';

interface TetrisState {
     lastTime: number;
     deltaTime: number;
     board: ColorCell[][];
     currentBoard: ColorCell[][];
     prevBoard: ColorCell[][];
     currentTetrimino: Tetrimino | null;
     isChangedState: boolean;
}

const rows = 20;
const cols = 10;
const initialDeltaTime = 500;

type ColorCell =
     | 'black'
     | 'cyan'
     | 'yellow'
     | 'purple'
     | 'green'
     | 'red'
     | 'blue'
     | 'orange';

interface Tetrimino {
     color: ColorCell;
     shape: number[][];
     pos?: { x: number; y: number };
}

type TetriminoKey = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

const Tetriminos: Record<TetriminoKey, Tetrimino> = {
     I: { color: 'cyan', shape: [[1], [1], [1], [1]] },
     O: {
          color: 'yellow',
          shape: [
               [1, 1],
               [1, 1],
          ],
     },
     T: {
          color: 'purple',
          shape: [
               [0, 1, 0],
               [1, 1, 1],
          ],
     },
     S: {
          color: 'green',
          shape: [
               [0, 1, 1],
               [1, 1, 0],
          ],
     },
     Z: {
          color: 'red',
          shape: [
               [1, 1, 0],
               [0, 1, 1],
          ],
     },
     J: {
          color: 'blue',
          shape: [
               [0, 0, 1],
               [1, 1, 1],
          ],
     },
     L: {
          color: 'orange',
          shape: [
               [1, 0, 0],
               [1, 1, 1],
          ],
     },
};

const newBoard = (rows: number, cols: number): ColorCell[][] =>
     Array.from({ length: rows }, () => Array(cols).fill('black'));

const board: ColorCell[][] = newBoard(rows, cols);

const drawSqare = (
     x: number,
     y: number,
     color: string,
     ctx: CanvasRenderingContext2D
) => {
     const sizeX: number = ctx.canvas.height / rows;
     const sizeY: number = ctx.canvas.width / cols;
     ctx.fillStyle = color;
     ctx.fillRect(x * sizeX, y * sizeY, sizeX, sizeY);
};

const drawBoard = () => {
     if (!ctx?.canvas) return;
     for (let rowIndex = 0; rowIndex < state.currentBoard.length; rowIndex++) {
          for (
               let colIndex = 0;
               colIndex < state.currentBoard[0].length;
               colIndex++
          ) {
               drawSqare(
                    colIndex,
                    rowIndex,
                    state.currentBoard[rowIndex][colIndex],
                    ctx
               );
          }
     }
};

const setRndTetrimino = (): Tetrimino => {
     const tetrimino =
          Object.entries(Tetriminos)[
               Math.floor(Math.random() * Object.keys(Tetriminos).length)
          ][1];

     tetrimino.pos = { x: Math.floor(Math.random() * 8), y: 0 };
     printTetrimino(tetrimino);
     drawBoard();

     return tetrimino;
};
const printTetrimino = (tetrimino?: Tetrimino) => {
      let tetrim = tetrimino ?? state.currentTetrimino!
     for (let y = 0; y < tetrim.shape.length; y++) {
          for (let x = 0; x < tetrim.shape[y].length; x++) {
               if (tetrim.shape[y][x] === 1) {
                    state.currentBoard[tetrim.pos!.y + y][tetrim.pos!.x + x] =
                         tetrim.color;
               }
          }
     }
};

const checkColision = (tetrimino: Tetrimino, board: any): boolean => {
     for (let y = 0; y < tetrimino.shape.length; y++) {
          for (let x = 0; x < tetrimino.shape[y].length; x++) {
               if (
                    !board[tetrimino.pos!.y + y] ||
                    !board[tetrimino.pos!.y + y][tetrimino.pos!.x + x] ||
                    (tetrimino.shape[y][x] === 1 &&
                         board[tetrimino.pos!.y + y][tetrimino.pos!.x + x] !==
                              'black')
               ) {
                    return true;
               }
          }
     }
     return false;
};

const dropTetrimino = (tetrimino: Tetrimino) => {
     return {
          ...tetrimino,
          pos: { x: tetrimino.pos?.x!, y: tetrimino.pos?.y! + 1 },
     };
};
const state: TetrisState = {
     lastTime: 0,
     deltaTime: 0,
     board,
     currentBoard: [],
     prevBoard: [],
     currentTetrimino: null,
     isChangedState: false,
};
const gameLoop = (time: number) => {
     state.currentBoard = structuredClone(state.board);
     state.currentTetrimino = state.currentTetrimino ?? setRndTetrimino();

     state.deltaTime += time - state.lastTime;
     state.lastTime = time;

     if (state.deltaTime >= initialDeltaTime) {
          state.currentTetrimino = dropTetrimino(state.currentTetrimino);
          state.deltaTime = 0;
          if (checkColision(state.currentTetrimino, state.board)) {
               state.board = structuredClone(state.prevBoard);
               state.currentTetrimino = null;
          } else {
               printTetrimino();
               state.prevBoard = structuredClone(state.currentBoard);
               drawBoard();
          }
     }

     requestAnimationFrame(gameLoop);
};

const canvas = <HTMLCanvasElement | null>document.querySelector('#board');

document.addEventListener('keydown', (event) => {
     if (!state.currentTetrimino) return;

     switch (event.key) {
          case 'ArrowRight':
               state.currentTetrimino.pos!.x += 1;
               printTetrimino();
               drawBoard()
               break;
          case 'ArrowLeft':
               state.currentTetrimino.pos!.x -= 1;
               printTetrimino();
               drawBoard()
               break;

     }
});

const ctx = canvas?.getContext('2d') ?? null;

requestAnimationFrame(gameLoop);
