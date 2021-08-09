
import Player from "./Player.js";
import Inventory from "./Inventory.js";
import Dialog from "./Dialog.js";



const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

var state = 0;

export default class Stage1 extends Phaser.Scene {   
    constructor(){ 
        super("stage1"); //identifier for the scene
    }

    preload() {
        /*
        /*** FROM Minicode.js***/
        //this.load.html('input', './assets/js/textInput.html');

        //this.load.image("tiles", "./assets/images/map.png");
        //this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");

        /** FROM Player.js**/
        //this.load.spritesheet('player', './assets/images/heroin.png', {
        //    frameWidth: 80,
        //    frameHeight: 140
        //});

        /** 텍스트 박스에 사용하는 플러그인 rexUI preload **/
        //this.load.scenePlugin({
        //    key: 'rexuiplugin',
        //    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //    sceneKey: 'rexUI'
        //});
        //this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
        
        /** 순차진행에 필요한 플러그인 **/
        //var url;
        //url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsequenceplugin.min.js';
        //this.load.plugin('rexsequenceplugin', url, true);
    

        this.onTile = 1;
        

    }
    
    create () {

 

        this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "map" });
        
        const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("ground", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        /** 아이템 만들기 **/
        this.itemPrintf = this.add.image(360,330,'item'); 
       

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 330);
        this.player.player.setFlipX(true);

         /** 아이템 얻었을 때 뜨는 이미지 **/
         this.itemPrintfget = this.add.image(0,0,'itemGet').setOrigin(0.0);
         this.itemPrintfText = this.add.text(500,270,'printf',{
            font: "30px Arial Black", fill: "#000000" 
         }).setOrigin(0,0);
         this.itemPrintfget.setVisible(false);
         this.itemPrintfText.setVisible(false);
         this.beforeItemGet = true; //한 번만 뜨도록

        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.deco.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.deco);


        /*** 충돌지점 색 칠하기 Mark the collid tile ***/
        const debugGraphics = this.add.graphics().setAlpha(0,75);
        this.worldLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243,134,48,255),
        faceColor: new Phaser.Display.Color(40,39,37,255)
        }); //근데 작동 안하는듯... 중요한 거 같진 않으니 일단 넘어감

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;


        /*** 명령창 불러오기 ***/
        this.command = new Command(this, map);

        // 드래그앤 드랍할 조각
        this.drag_piece = ['printf', 'if', 'else'];
        // 클래스 여러번 호출해도 위에 추가한 코드조각만큼만 호출되게 하기 위한 상태 변수
        this.code_piece_add_state = 0;
        // 드랍여부 확인(새로운 씬에도 반영 하기 위해 씬에 변수 선언 함)
        this.drop_state_1 = 0;
        this.drop_state_2 = 0;
        this.drop_state_3 = 0;
        // 드래그앤드랍
        this.draganddrop_1 = new DragAndDrop(this, 470, 20, 100, 30).setRectangleDropZone(100, 30).setName("1");
        this.draganddrop_2 = new DragAndDrop(this, 570, 20, 100, 30).setRectangleDropZone(100, 30).setName("2");
        this.draganddrop_3 = new DragAndDrop(this, 670, 20, 100, 30).setRectangleDropZone(100, 30).setName("3");
       
        /** 인벤토리 만들기 **/     
        this.inven = this.inventory.create(this);


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });


        /** 초반 인트로 대사 출력 **/
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //플레이어 얼려두기
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });

        console.log('itme 위치', this.itemPrintf.x);
    }

    update() {
        this.player.update();
        this.inventory.update();
        this.command.update(this);
                
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;


        /** 아이템 획득하는 경우 **/
        if (this.beforeItemGet && this.player.player.x < this.itemPrintf.x+54 && this.itemPrintf.x < this.player.player.x) {
            this.beforeItemGet = false; //여기다가 해야 여러번 인식 안함
            this.itemPrintf.setVisible(false);
            this.itemPrintfget.setVisible(true);
            this.itemPrintfText.setVisible(true);
            this.tweens.add({
                targets: [this.itemPrintfget, this.itemPrintfText],
                alpha: 0,
                duration: 2000,
                ease: 'Linear',
                repeat: 0,
                onComplete: ()=>{this.invenPlus = true;}
            }, this);
        }


        /* x 키 눌렀을 때 바로 사라지게 하는 건데 대사 많이 출력하는 오류있음
        if(this.itemPrintfget.visible && this.keyX.isDown) {
            this.itemPrintfget.setVisible(false);
            this.itemPrintfText.setVisible(false);
            this.beforeItemGet = false;
            this.invenPlus = true;
        }
        */

        if(this.invenPlus) {
            this.inventory.invenSave(this, 'printf'); //인벤토리에 아이템 추가
            this.intro2();
            this.invenPlus = false;
        }
    }

    intro2() {
        this.player.playerPaused = true; //플레이어 얼려두기
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.player.setVelocityY(-300)    //플레이어 프래임도 바꾸고 싶은데 안바뀌네..
            this.time.delayedCall( 1000, () => {  this.intro3(); }, [], this);
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });
    }

    intro3() {
        this.command.commandbox.setVisible(true);   ///작동안됨!!!!!!!!!!!!!!!!!
        //this.command.text.setVisible(true);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro3, this.dialog)
        .start();
    }

}
