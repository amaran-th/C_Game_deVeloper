import Player from "./Player.js";
import Dialog from "./Dialog.js";

var inZone;

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

        
        this.load.tilemapTiledJSON("map", "./assets/ending_room.json");

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
        
        const tileset = map.addTilesetImage("ending_room", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("ground", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        /*** 맵 이동 (문 이미지 불러오기) */
        this.zone = this.physics.add.staticImage(150, 320).setSize(100,160);

        ////npc
        //seyeon
        this.anims.create({
            key: "seyeon",
            frames: this.anims.generateFrameNumbers('dev',{ start: 4, end: 5}), 
            frameRate: 2,
            repeat: -1,
        });

        this.seyeon = this.add.sprite(350,400,'dev').setScale(1.1).setOrigin(0,1);
        this.seyeon.play('seyeon');

        this.npc1_text = this.add.text(this.seyeon.x, 225, 'X키로 말 걸기', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //yeounu
        this.anims.create({
            key: "yeonu",
            frames: this.anims.generateFrameNumbers('dev',{ start: 0, end: 1}), 
            frameRate: 1,
            repeat: -1,
        });

        this.yeonu = this.add.sprite(550,400,'dev').setScale(1.1).setOrigin(0,1);
        this.yeonu.play('yeonu');
        this.npc2_text = this.add.text(this.yeonu.x, 225, 'X키로 말 걸기', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);
        
        //seoyun
        this.anims.create({
            key: "seoyun",
            frames: this.anims.generateFrameNumbers('dev',{ start: 2, end: 3}), 
            frameRate: 2,
            repeat: -1,
        });

        this.seoyun = this.add.sprite(750,400,'dev').setScale(1.1).setOrigin(0,1);
        this.seoyun.play('seoyun');
        this.npc3_text = this.add.text(this.seoyun.x, 325, 'X키로 말 걸기', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //eunji
        this.anims.create({
            key: "eunji",
            frames: this.anims.generateFrameNumbers('dev2',{ start: 0, end: 3}), 
            frameRate: 2,
            repeat: -1,
        });

        this.eunji = this.add.sprite(950,400,'dev2').setScale(1.1).setOrigin(0,1);
        this.eunji.play('eunji');
        this.npc4_text = this.add.text(this.eunji.x, 225, 'X키로 말 걸기', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //daeun
        this.npc5=this.add.image(1150 ,325,'devil2');
        this.npc5_text = this.add.text(this.npc5.x-50, 225, 'X키로 말 걸기', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);


        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, 150, 330);

        //맵이동
        this.physics.add.overlap(this.player.player, this.zone, function () {
            inZone = true;
        });
        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.deco.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.deco);
        

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        

        //플레이어 위 pressX 생성해두기(door)
        this.pressX = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //플레이어 위 pressX 생성해두기(Ending Room)
        this.text = this.add.text(this.worldView.x+380, 20, '~Ending Room~', {
            font : '40px',
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);


        
        // 초반 인트로 대사 출력
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //플레이어 얼려두기
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.final_0, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
            this.inevent=false; //대사가 다 나오면 문 텍스트 나오게
        });
            

        /* 바운더리 정하기 */
       this.physics.world.setBounds(0, 0, 1500, 600);
       this.player.player.body.setCollideWorldBounds()
        
        
         //minimap에서 사용될 전역변수
        // stagenum = 0;
        //select 관련 함수 트리거 변수
        this.select_trigger=false;

        this.select_case0= ['예','아니오']; //msgArr.length = 2
        this.finAnswer = { //주소
            answer: 0 //값
        };


         this.inevent=true;
        
    }

    update() {
        
        this.player.update();
        
        this.text.x=this.worldView.x+380;

        //select
        if(this.select_trigger){
            this.select0();
            this.select_trigger=false;
        }

        if(!this.scene.isVisible('selection') && this.finAnswer.answer){ //selection 화면이 꺼졌다면
            switch(this.finAnswer.answer) {
            case 1: console.log('1의 선택지로 대답 했을때');
                this.finAnswer.answer = 0;
                this.player.playerPaused=false;
                this.scene.sleep('bootGame')
                this.scene.run('startGame'); 
                return;
            case 2: console.log('2의 선택지로 대답 했을때');
                this.finAnswer.answer = 0;
                this.player.playerPaused=false;
                this.time.delayedCall(500, () => {
                    this.inevent=false;
                }, [], this);
                return;  
        }
    }


        //맵이동 (stage6) 로
        if (inZone&&this.inevent==false) {
            this.pressX.x = this.player.player.x-50;
            this.pressX.y = this.player.player.y-100;
            this.pressX.setVisible(true);
            if (this.keyX.isDown){
                console.log("===[맵이동] stage6으로===");
                this.inevent=true;
                this.player.playerPaused=true;
                this.select_trigger=true;
            }
        }else this.pressX.setVisible(false);
        inZone = false;


        
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;



        //npc에게 말걸기
        if(this.inevent==false&&this.player.player.x>this.seyeon.x-150&&this.player.player.x<this.seyeon.x-50){
            this.npc1_text.setVisible(true);
            if(this.keyX.isDown){
                this.inevent=true;
                this.player.player.setFlipX(false);
                this.player.playerPaused=true;
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.final_npc1, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                    this.time.delayedCall(500, () => {
                        this.inevent=false;
                    }, [], this);
                });
            }
            
        }else this.npc1_text.setVisible(false);

        //npc에게 말걸기
        if(this.inevent==false&&this.player.player.x>this.yeonu.x-150&&this.player.player.x<this.yeonu.x-50){
            this.npc2_text.setVisible(true);
            if(this.keyX.isDown){
                this.inevent=true;
                this.player.player.setFlipX(false);
                this.player.playerPaused=true;
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.final_npc2, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                    this.time.delayedCall(500, () => {
                        this.inevent=false;
                    }, [], this);
                });
            }
            
        }else this.npc2_text.setVisible(false);

        //npc에게 말걸기
        if(this.inevent==false&&this.player.player.x>this.seoyun.x-150&&this.player.player.x<this.seoyun.x-50){
            this.npc3_text.setVisible(true);
            if(this.keyX.isDown){
                this.inevent=true;
                this.player.player.setFlipX(false);
                this.player.playerPaused=true;
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.final_npc3, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                    this.time.delayedCall(500, () => {
                        this.inevent=false;
                    }, [], this);
                });
            }
            
        }else this.npc3_text.setVisible(false);

        //npc에게 말걸기
        if(this.inevent==false&&this.player.player.x>this.eunji.x-150&&this.player.player.x<this.eunji.x-50){
            this.npc4_text.setVisible(true);
            if(this.keyX.isDown){
                this.inevent=true;
                this.player.player.setFlipX(false);
                this.player.playerPaused=true;
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.final_npc4, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                    this.time.delayedCall(500, () => {
                        this.inevent=false;
                    }, [], this);
                });
            }
            
        }else this.npc4_text.setVisible(false);

        //npc에게 말걸기
        if(this.inevent==false&&this.player.player.x>this.npc5.x-150&&this.player.player.x<this.npc5.x-50){
            this.npc5_text.setVisible(true);
            if(this.keyX.isDown){
                this.inevent=true;
                this.player.player.setFlipX(false);
                this.player.playerPaused=true;
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.final_npc5, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                    this.time.delayedCall(500, () => {
                        this.inevent=false;
                    }, [], this);
                });
            }
            
        }else this.npc5_text.setVisible(false);
        



        /*** 빨리 zero_stage으로 넘어가기 위해 잠시 만들어 두겠습니다.... ***/
        if(this.keyZ.isDown) {
            this.cameras.main.fadeOut(100, 0, 0, 0); //is not a function error
            console.log('맵이동');
            this.scene.sleep('bootGame'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("zero_stage");
        }

        
        
    }
    select0(){    
        console.log("endingroom_select0");
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.final_select, this.dialog)
        .start();
        seq.on('complete', () => {
            this.scene.run('selection',{ msgArr: this.select_case0, num: this.select_case0.length, finAnswer: this.finAnswer });
        });
        
    }
}
