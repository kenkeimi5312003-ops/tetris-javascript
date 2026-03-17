const DROP_SPEED =300;
//300で大丈夫？
const BLOCK_SIZE = 30; 
const PLAY_SCREEN_WIDTH=10;
const PLAY_SCREEN_HEIGHT=20;

//キャンバスidの取得 移動
const CANVAS = document.getElementById('canvas');
//2Dコンテキストの取得
const CANVAS_2D=CANVAS.getContext('2d');


//キャンバスサイズ(=プレイ画面のサイズ)
const CANVAS_WIDTH = BLOCK_SIZE*PLAY_SCREEN_WIDTH;
const CANVAS_HEIGHT = BLOCK_SIZE*PLAY_SCREEN_HEIGHT;

CANVAS.width=CANVAS_WIDTH;
CANVAS.height=CANVAS_HEIGHT;

const TET_SIZE =4;

//Z世代型テトリス
const TETORO_TYPES = [
[
    [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
],
//syamuはs
[
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],    
],
[ 
    //愛
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
],//じぇじぇじぇ
[
    [0,0,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [1,1,0,0],
],//わたしはlです
[
    [0,0,1,0],
    [0,0,1,0],
    [0,1,1,0],
    [0,0,0,0],
    ],
[
  // T
  [0, 0, 0, 0],
  [1, 1, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 0],
],
[
  // O
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
],
];
//うまくいかん
const tetColors = [
  "",
  "#6CF",//インデックスZに対応 クオーテーションじゃなくてもいけるのか～？
  "#F92", //s
  "#66F",
  "#C5C",
  "#FD2",
  "#F44",
  "#5B5"
];

//テトロミノの取得もともとは*7だった何だあlengthって
let tetroTypesIndex = Math.floor(Math.random()*(TETORO_TYPES.length-1))+1;
//テトロの取得
let tetroMino = TETORO_TYPES[tetroTypesIndex];

//テトリミノの移動距離の初期値0、「初期位置」ではない
let tetroMinoDistanceX = 0;
let tetroMinoDistanceY = 0;

const SCORE_SCREEN =[];
const SCREEN =[];
// 配列を宣言
let timerId;
//ゲームオーバーフラグはこれ！「!」じゃあねえ！
let isGameOver = false;




const drawPlayScreen=() => {
    CANVAS_2D.fillStyle = '#000';
    //キャンバスを黒く塗りつぶす！？
    CANVAS_2D.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    //ここに静的ブロックを置いた場合でも正しく動く？
    
//テトリミノ描写内容と条件
for (let y = 0; y< PLAY_SCREEN_HEIGHT; y++){
for (let x = 0; x< PLAY_SCREEN_WIDTH; x++) {
  if(SCREEN[y][x]){
    //notgood
    drawBlock(x,y,SCREEN[y][x]);//,SCREEN[y][x]はいる
   
}
}
}

 // テトリミノを描画する
  for (let y = 0; y < TET_SIZE; y++) {
    for (let x = 0; x < TET_SIZE; x++) {
      if (tetroMino[y][x]) {
        drawBlock(
          tetroMinoDistanceX + x, 
          tetroMinoDistanceY + y,
          tetroTypesIndex
        );
      }
    }
  }
if (isGameOver) {
  const GAME_OVER_MESSAGE ='GAME OVER';
  CANVAS_2D.font ="40px 'Meiryo UI'";
  const width =CANVAS_2D.measureText(GAME_OVER_MESSAGE).width;
  const x = CANVAS_WIDTH/2-width/2;
  const y = CANVAS_HEIGHT/2-20;
  CANVAS_2D.fillStyle ='white';
  CANVAS_2D.fillText(GAME_OVER_MESSAGE,x,y);
 }
};

//第3引数
const drawBlock = (x,y,tetroTypesIndex) =>{
 let drawX= x* BLOCK_SIZE;
 let drawY= y* BLOCK_SIZE;

 //ここにもいれるのか
    CANVAS_2D.fillStyle = tetColors[tetroTypesIndex];
    CANVAS_2D.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
    //線の色を黒に設定
    CANVAS_2D.strokeStyle = 'black';
    CANVAS_2D.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
};
//既に宣言したtetroMinoでnewTetを紐づけ
const canMove =(moveX,moveY,newTet =tetroMino) =>{
 for (let y=0; y<TET_SIZE;y++){
  for (let x=0; x<TET_SIZE;x++){
    if (newTet[y][x]){
      //現在のテトリミノの位置(tetroMinoDistanceX +x)に移動分を加える
      let nextX = tetroMinoDistanceX +x +moveX;
      let nextY = tetroMinoDistanceY +y +moveY;

      //移動先にブロックがあるか判定
      if(nextY<0||
         nextX<0||
         nextY>=PLAY_SCREEN_HEIGHT ||
         nextX>=PLAY_SCREEN_WIDTH ||
         SCREEN[nextY][nextX] 
      ){
         return false;
         }
        }
      }
    }
      return true;
   };

const createRightRotateTet = () =>{
  //回転後の新しいテトリミノ用配列
  let newTet = [];
  for (let y = 0;y < TET_SIZE;y++) {
  newTet[y] =[];
  for (let x=0; x<TET_SIZE;x++){
  newTet[y][x] =tetroMino[TET_SIZE-1-x][y];
  }
  }
  return newTet
  //意味
};

const createLeftRotateTet =() =>{
  let newTet = [];
  for (let y = 0;y < TET_SIZE;y++) {
  newTet[y] =[];
  for (let x=0; x<TET_SIZE;x++){
  newTet[y][x] =tetroMino[x][TET_SIZE - 1 - y]
  }
}
return newTet
};

//テトリミノを動かす
document.onkeydown = (e) => { //return??
  if (isGameOver) return;
  switch (e.code) {
    case 'ArrowLeft':
     if (canMove(-1,0))tetroMinoDistanceX--;
     break;
    case 'ArrowUp':
     if (canMove(0,-1))tetroMinoDistanceY--;
     break;
    case 'ArrowRight':
     if (canMove(1,0))tetroMinoDistanceX++;
     break;
    case 'ArrowDown':
     if (canMove(0,1))tetroMinoDistanceY++;
     break;
    case 'KeyR':
      let newRTet = createRightRotateTet();
      if (canMove(0, 0, newRTet)) {
        tetroMino = newRTet;
      }
      break;
    case 'KeyL':
      let newLTet = createLeftRotateTet();
      if (canMove(0, 0, newLTet)) {
        tetroMino = newLTet;
      }
      break;
  }
      
 drawPlayScreen();

};
//下に落ちたミノを記録
const fixTet =()=>{
  for(let y=0;y <TET_SIZE;y++){
    for(let x=0; x<TET_SIZE;x++){
      if(tetroMino[y][x]){
        //CANVAS_2D.fillStyle = TETRO_COLORS[tetroTypesIndex]
        SCREEN[tetroMinoDistanceY+y][tetroMinoDistanceX+x]=
        tetroTypesIndex;
      }
    }
  }
};
const clearLine =() =>{
  //一列になっている場所をスクリーン上から調べていく01で表記されている
  for(let y =0; y<PLAY_SCREEN_HEIGHT;y++) {
 //行を消すフラグをたてる
 let isClearLine = true;
 //配列の行に0が入っているのかどうかを調べていくx座標に一つ一つ代入
 for (let x=0;x <PLAY_SCREEN_WIDTH;x++){
  if (SCREEN[y][x]===0){
     isClearLine = false;
     break;
  }  
 }
  if(isClearLine){
      
    //そろった行から上へ向かってforループしていく下じゃなくて？
    for(let newY =y; newY>0;newY--){
      for(let newX =0; newX< PLAY_SCREEN_WIDTH;newX++){
        SCREEN[newY][newX] = SCREEN[newY-1][newX];
      
   }
  }
 }
  }
};

//落下処理
const dropTet =() => {
  if (isGameOver) return;
  if (canMove(0,1)) {
    tetroMinoDistanceY++;
  } else{
    fixTet();
    clearLine();
    tetroTypesIndex = Math.floor(Math.random()*(TETORO_TYPES.length-1))+1;
    tetroMino = TETORO_TYPES[tetroTypesIndex];
    createTetPosition();
    // 次のテトリミノを出せなくなったらゲームオーバー
    if (!canMove(0,0)){
      isGameOver = true;
      clearInterval(timerId);
    }
  }
  drawPlayScreen();
};

const CONTAINER =document.getElementById('container'); // htmlのところから呼び出し
CONTAINER.style.width = CANVAS_WIDTH +'px';
//なぜheightはないの？


const createTetPosition =() => {
  tetroMinoDistanceX = PLAY_SCREEN_WIDTH/2 -TET_SIZE/2;
  tetroMinoDistanceY = 0; 
};

//テストプレイ画面描写処理 
// アロー関数...関数を表現します。
// 従来の関数式よりも簡潔で、特に無名関数を定義する際に便利

const init = () => {
  for (let y = 0;y<PLAY_SCREEN_HEIGHT;y++){
    SCREEN[y]=[];
    for (let x =0; x<PLAY_SCREEN_WIDTH; x++){
      SCREEN[y][x]=0;
    }
  }
 

 //test
 //SCREEN[4][6] =1;
 createTetPosition();
 //落下処理実行
 timerId = setInterval(dropTet,DROP_SPEED);
 drawPlayScreen();
};
