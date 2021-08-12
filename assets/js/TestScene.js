
import Player from "./Player.js";
import Dialog from "./Dialog.js";
import StageClear from "./StageClear.js";
import Command from "./Command.js";

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

var state = 0;

export default class TestScene extends Phaser.Scene {   
    constructor(){ 
        super("bootGame"); //identifier for the scene
    }

    preload() {
        /*** FROM Minicode.js***/

        
        this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");

        /*
        this.load.image("tiles", "./assets/images/map.png");

        // FROM Player.js
        this.load.spritesheet('player', './assets/images/heroin.png', {
            frameWidth: 80,
            frameHeight: 140
        });

        // 텍스트 박스에 사용하는 플러그인 rexUI preload 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
        
        // 순차진행에 필요한 플러그인
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsequenceplugin.min.js';
        this.load.plugin('rexsequenceplugin', url, true);
        */

        this.onTile = 1;
    }
    
    create () {
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.keyZ = this.input.keyboard.addKey('Z');
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key3 = this.input.keyboard.addKey('THREE');
        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "map" });
        
        const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("ground", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        //휴대폰, 서랍장 이미지 위치. 휴대폰 말풍선 클릭하면 휴대폰이미지 띄어주게 할것임.
        this.phone = this.add.image(700,210,'phone').setOrigin(0,0);
        
        this.phone.setInteractive();

        /*** 미니맵버튼 활성화 ***/ //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('bootGame'); 
            this.scene.run("minimap");
        },this);

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 330);
        this.player.player.setFlipX(true);


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
        this.command = new Command(this, map, "bootgame");

        // 드래그앤 드랍할 조각
        /*this.drag_piece = ['printf', 'if'];
        // 클래스 여러번 호출해도 위에 추가한 코드조각만큼만 호출되게 하기 위한 상태 변수 (새로운 씬에도 반영 하기 위해 씬에 변수 선언 함)
        this.code_piece_add_state = 0;
        // 드랍여부 확인(새로운 씬에도 반영 하기 위해 씬에 변수 선언 함)
        this.drop_state_1 = 0;
        this.drop_state_2 = 0;
        this.drop_state_3 = 0;
        // 드래그앤드랍
        this.draganddrop_1 = new DragAndDrop(this, 470, 20, 100, 30).setRectangleDropZone(100, 30).setName("1");
        this.draganddrop_2 = new DragAndDrop(this, 570, 20, 100, 30).setRectangleDropZone(100, 30).setName("2");
        this.draganddrop_3 = new DragAndDrop(this, 670, 20, 100, 30).setRectangleDropZone(100, 30).setName("3");*/

        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });


        /** 초반 인트로 대사 출력 **/
        /*
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
            */

    
           
        /*** 인벤토리 버튼 활성화 ***/
        this.inventory_button = this.add.image(map.widthInPixels - 100, 20,'inventory_button').setOrigin(0,0);
        this.inventory_button.setInteractive();
        this.invenZone = this.add.zone(map.widthInPixels + 745, 300, 100, 570).setRectangleDropZone(100,550);
        this.invenGra = this.add.graphics();
        this.invenGra.lineStyle(4, 0x00ff00);


        //플레이어 위 pressX 생성해두기
        this.pressX = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

         //드래그앤드롭으로 zone에 있는 코드 받아올거임.
         this.code_zone_1 = "       ";
         this.code_zone_2 = "       ";
         this.code_zone_3 = "       ";

         // 테스트씬의 전체코드
         this.contenttext = "" ;
         
         /*** Stage Clear! 창 불러오기 ***/
         this.StageClear = new StageClear(this);
        
         //minimap에서 사용될 전역변수
         stagenum = 0;
        
    }

    update() {
        this.contenttext = 
            "#include <stdio.h> \n int main(){ \n " +  this.code_zone_1 +  "(\"HI\"); \n }" 
            + "2번째 코드 : " +  this.code_zone_2 + "\n3번째 코드 : " + this.code_zone_3 ;

        this.player.update();
        this.command.update(this);
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


        //this.triggerpoint.setTileIndexCallback(1,this.playerOnTile,this);
        if(this.player.player.x < 300) {
            this.playerOnTile();
        }
        else{
            //this.scene.remove();
        }

        /* 플레이어가 문 앞에 서면 작동하도록 함 */
        if(this.player.player.x < 175 && 100 < this.player.player.x ) {
            this.pressX.x = this.player.player.x-50;
            this.pressX.y = this.player.player.y-100;
            this.pressX.setVisible(true);

            if(this.keyX.isDown) {
                this.cameras.main.fadeOut(100, 0, 0, 0); //is not a function error
                console.log('맵이동');
                this.scene.sleep('bootGame'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
                this.scene.run("stage1");
            }
        }
        else this.pressX.setVisible(false);

        
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;

        /*** 빨리 stage1으로 넘어가기 위해 잠시 만들어 두겠습니다.... ***/
        if(this.keyZ.isDown) {
            this.cameras.main.fadeOut(100, 0, 0, 0); //is not a function error
            console.log('맵이동');
            this.scene.sleep('bootGame'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("stage1");
        }
        if(this.key1.isDown) {
            console.log('맵이동');
            this.scene.sleep('bootGame'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');
        }
        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('bootGame'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('second_stage');
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('bootGame'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }
    }


    playerOnTile() {
        if(this.onTile) {

            /** 플레이어 대사 **/
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this); //텍스트박스(다이얼로그 박스)를 불러와주는 함수를 따로 또 적어줘야함(scene 지정 문제 때문에)
            seq
                .load(this.dialog.talk1, this.dialog)
                .start();
        }
    }
}
