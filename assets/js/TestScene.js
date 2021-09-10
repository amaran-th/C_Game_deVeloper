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
        //devil1
        this.npc1 = this.physics.add.sprite(400 ,330,'npc_devil');
        this.npc1.setFrame(1);
        this.npc1.setFlipX(true);
        this.physics.add.collider(this.npc1, this.worldLayer); //충돌 설정
        this.npc1_text = this.add.text(this.npc1.x-50, 225, 'X키로 말 걸기', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //devil2
        this.npc2 = this.physics.add.sprite(650 ,330,'npc_devil2');
        this.npc2.setFrame(1);
        this.npc2.setFlipX(true);
        this.physics.add.collider(this.npc2, this.worldLayer); //충돌 설정
        this.npc2_text = this.add.text(this.npc2.x-50, 225, 'X키로 말 걸기', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);
        
        //student
        this.npc3=this.add.image(900,325,'standing_student');
        this.npc3.setFlipX(true);
        this.npc3_text = this.add.text(this.npc3.x-50, 225, 'X키로 말 걸기', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //librarian2
        this.npc4=this.add.image(1150 ,325,'librarian2');
        this.npc4_text = this.add.text(this.npc4.x-50, 225, 'X키로 말 걸기', {
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
         this.inevent=true;
        
    }

    update() {
        
        this.player.update();
        
        this.text.x=this.worldView.x+380;
        
        //맵이동 (stage6) 로
        if (inZone&&this.inevent==false) {
            this.pressX.x = this.player.player.x-50;
            this.pressX.y = this.player.player.y-100;
            this.pressX.setVisible(true);
            if (this.keyX.isDown){
                console.log("===[맵이동] stage6으로===");
                this.scene.sleep('bootGame')
                this.scene.run('sixth_stage'); 
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
        if(this.inevent==false&&this.player.player.x>this.npc1.x-150&&this.player.player.x<this.npc1.x-50){
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
                    this.inevent=false;
                });
            }
            
        }else this.npc1_text.setVisible(false);

        //npc에게 말걸기
        if(this.inevent==false&&this.player.player.x>this.npc2.x-150&&this.player.player.x<this.npc2.x-50){
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
                    this.inevent=false;
                });
            }
            
        }else this.npc2_text.setVisible(false);

        //npc에게 말걸기
        if(this.inevent==false&&this.player.player.x>this.npc3.x-150&&this.player.player.x<this.npc3.x-50){
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
                    this.inevent=false;
                });
            }
            
        }else this.npc3_text.setVisible(false);

        //npc에게 말걸기
        if(this.inevent==false&&this.player.player.x>this.npc4.x-150&&this.player.player.x<this.npc4.x-50){
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
                    this.inevent=false;
                });
            }
            
        }else this.npc4_text.setVisible(false);
        



        /*** 빨리 zero_stage으로 넘어가기 위해 잠시 만들어 두겠습니다.... ***/
        if(this.keyZ.isDown) {
            this.cameras.main.fadeOut(100, 0, 0, 0); //is not a function error
            console.log('맵이동');
            this.scene.sleep('bootGame'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("zero_stage");
        }

        
        
    }
}
