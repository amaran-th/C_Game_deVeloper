
import Player from "./Player.js";
import Minicoding from "./Minicoding.js";
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

        this.inventory = new Inventory();
        this.dialog = new Dialog(this);
        this.minicode = new Minicoding();

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
         this.itemPrintfText = this.add.text(550,300,'printf',{
             color: '#000000',
             fontsize: '30px',
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

        /*** 전체 코드에 걍 예시로 넣은 문장 ***/
        var contenttext = '#include<stdio.h>\nint main(void){printf("hi");return 0;}';

        /*** 명령창 불러오기 ***/
        var command = new Command(this, map);

        // 드래그앤드랍
        this.draganddrop_1 = new DragAndDrop(this, 300, 20, 100, 30).setRectangleDropZone(100, 30).setName("1");
        this.draganddrop_2 = new DragAndDrop(this, 500, 20, 100, 30).setRectangleDropZone(100, 30).setName("2");
        this.draganddrop_3 = new DragAndDrop(this, 700, 20, 100, 30).setRectangleDropZone(100, 30).setName("3");
        
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

        //compile button
        this.compile_button = this.add.image(20,150,'compile_button').setOrigin(0,0);
        this.compile_button.setInteractive();
        this.compile_button.on('pointerdown', () => {
           
            if (contenttext !== '')
                {
                    var data = {

                        'code': contenttext
    
                    };
                    data = JSON.stringify(data);

                    var xhr = new XMLHttpRequest();

                    xhr.open('POST', '/form_test', true);                
                    
                    xhr.setRequestHeader('Content-type', 'application/json');
                    xhr.send(data);
                    xhr.addEventListener('load', function() {
                        
                        var result = JSON.parse(xhr.responseText);
    
                        if (result.result != 'ok') return;
                        console.log(result.output);
                        //document.getElementById('testoutput').value = result.output;
    
                    });
                    //  Turn off the click events
                    //this.removeListener('click');
                    //  Hide the login element
                    //this.setVisible(false);
                    //  Populate the text with whatever they typed in
                    //text.setText('Welcome ' + inputText.value);
                }
                else
                {
                    //  Flash the prompt 이거 뭔지 모르겠음 다른 곳에서 긁어옴
                    this.scene.tweens.add({
                        targets: text,
                        alpha: 0.2,
                        duration: 250,
                        ease: 'Power3',
                        yoyo: true
                    });
                            }
            console.log(" compile finish!!!");
           
        });
           
        /*** 인벤토리 버튼 활성화 ***/
        this.inventory_button = this.add.image(map.widthInPixels - 100, 20,'inventory_button').setOrigin(0,0);
        this.inventory_button.setInteractive();
        this.invenZone = this.add.zone(map.widthInPixels + 745, 300, 100, 570).setRectangleDropZone(100,550);
        this.invenGra = this.add.graphics();
        this.invenGra.lineStyle(4, 0x00ff00);

        console.log('itme 위치', this.itemPrintf.x);
    }

    update() {
        this.player.update();
        this.inventory.update();

        /*** 인벤토리 ***/
        if(state == 0) {
            this.inventory_button.on('pointerdown', () => {
                this.invenGra.setVisible(true);
                state = 1;
            });
        } else {
            this.invenZone.x = this.worldView.x + 745; //화면 이동시 따라가도록 설정
            this.invenGra.strokeRect(this.invenZone.x - this.invenZone.input.hitArea.width / 2, this.invenZone.y - this.invenZone.input.hitArea.height / 2, this.invenZone.input.hitArea.width, this.invenZone.input.hitArea.height);
            this.inventory_button.on('pointerdown', () => {
                this.invenGra.setVisible(false);
                state = 0;
            });
        }

                
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
            this.time.delayedCall(1000, function() { //일초 뒤에 알아서 사라짐
                this.itemPrintfget.setVisible(false);
                this.itemPrintfText.setVisible(false);
                this.invenPlus = true;
            }, [], this);
        }
        if(this.itemPrintfget.visible && this.keyX.isDown) { //x키는 어쩔 수 없음... 그냥 누르지말기
            this.itemPrintfget.setVisible(false);
            this.itemPrintfText.setVisible(false);
            this.beforeItemGet = false;
            this.invenPlus = true;
        }

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
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });

    }

    playerOnTile() {
        if(this.onTile) {
            this.minicode.create(this);

            /** 플레이어 대사 **/
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this); //텍스트박스(다이얼로그 박스)를 불러와주는 함수를 따로 또 적어줘야함(scene 지정 문제 때문에)
            seq
                .load(this.dialog.talk1, this.dialog)
                .start();
        }
    }

}
