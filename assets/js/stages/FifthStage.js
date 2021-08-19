import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";


export default class FifthStage extends Phaser.Scene {   
    constructor(){ 
        super("fifth_stage"); //identifier for the scene
    }

    preload() {

        this.load.image("stage5_tiles", "./assets/images/test.png");
        this.load.tilemapTiledJSON("fifth_stage", "./assets/fifth_stage.json");
    
    }
    
    create () {
        //this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);
        

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key3 = this.input.keyboard.addKey('THREE');
        this.key4 = this.input.keyboard.addKey('FOUR');
        this.key6 = this.input.keyboard.addKey('SIX');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "fifth_stage" });
        
        const tileset = map.addTilesetImage("test", "stage5_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        
        //도서관의 배경 불빛 애니메이션 생성
        this.anims.create({
            key: "light",
            frames: this.anims.generateFrameNumbers('librarylight',{ start: 0, end: 2}), 
            frameRate: 5,
            repeat: -1
        });

        this.background1 = this.add.sprite( 400, 400, 'librarylight', 0).setOrigin(0,1);
        this.background2 = this.add.sprite( 800, 400, 'librarylight', 0).setOrigin(0,1);

        this.background1.play('light',true);
        this.background2.play('light',true);

        //desk 이미지 add
        this.add.image(400,500,"library_desk").setOrigin(0,1);

        //느낌표 애니메이션
        this.anims.create({
            key: "exclam",
            frames: this.anims.generateFrameNumbers('exp_exclam',{ start: 0, end: 4}), 
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        });
        this.exclamMark = this.add.sprite( 600, 280, 'exp_exclam', 0);
        this.exclamMark.setVisible(false);

        //사서가 키보드 치는 애니메이션
        this.anims.create({
            key: "working_librarian1",
            frames: this.anims.generateFrameNumbers('librarian1',{ start: 0, end: 1}), 
            frameRate: 7,
            repeat: -1,
        });
        this.librarian1 = this.add.sprite(600 ,350,'librarian1');
        this.librarian1.play('working_librarian1',true);

        //회원증 이미지
        this.membership_card=this.add.image(350,0,"library_membership").setOrigin(0,1);

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 430);

        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.librarian1, this.worldLayer);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;


        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0;
        this.command = new Command(this, map, "fifth_stage");


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화 ***/ //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('fifth_stage'); 
            this.scene.run("minimap");
        },this);

        //플레이어 위 talktext 생성해두기(talk with librarian)
        this.talktext = this.add.text(600, 300, 'Press X to have a talk', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        
        /** 초반 대사 **/
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        this.stage5_1();

        //사서와 대화 중인지를 나타내는 플래그 변수
        this.cantalking=true;
        
        this.function=0;
        stagenum = 5;
        //초기 이벤트를 봤는지 여부
        this.firsttalked=false;
    }

    update() {
        this.player.update();
        //this.inventory.update();
        this.command.update(this);
                
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;

        /* 플레이어가 사서 근처에 다가가면 작동하도록 함 */
        if(this.player.player.x < 500 && 400 < this.player.player.x && this.cantalking ) {
            this.talktext.setVisible(true);
            if(this.keyX.isDown&&this.firsttalked==false) {
                if(this.cantalking){
                    //사서에게 처음 말을 걸었을 때
                    console.log('first talk with librarian');
                    this.player.player.setFlipX(false);
                    this.cantalking=false;
                    this.function=1;
                    this.player.playerPaused = true;
                }
            }else if(this.keyX.isDown&&this.firsttalked){
                //사서에게 말을 건 이후에 또 말을 걸 때
                if(this.cantalking){
                    console.log('talk with librarian');
                    this.player.player.setFlipX(false);
                    this.cantalking=false;
                    this.function=6;
                    this.player.playerPaused = true;
                }
            }
        }else this.talktext.setVisible(false);

        //초기 이벤트
        if(this.function==1){
            this.stage5_2();
            this.function=0;
        }else if(this.function==2){
            this.stage5_3();
            this.function=0;
        }else if(this.function==3){
            this.stage5_4();
            this.function=0;
        }else if(this.function==4){
            this.stage5_5();
            this.function=0;
        }else if(this.function==5){
            this.stage5_6();
            this.function=0;
        }

        //초기 이벤트를 본 이후의 이벤트
        if(this.function==6){
            this.stage5_7();
            this.function=0;
        }else if(this.function==7){
            this.stage5_8();
            this.function=0;
        }else if(this.function==8){
            this.stage5_9();
            this.function=0;
        }else if(this.function==9){
            this.stage5_10();
            this.function=0;
        }else if(this.function==10){
            this.stage5_11();
            this.function=0;
        }
        







        if(this.key1.isDown) {
            console.log('맵이동');
            this.scene.sleep('fifth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');
        }
        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('fifth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("second_stage");
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('fifth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }
        if(this.key4.isDown) {
            console.log('맵이동');
            this.scene.sleep('fifth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fourth_stage");
        }
        if(this.key6.isDown) {
            console.log('맵이동');
            this.scene.sleep('fifth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("sixth_stage");
        }

    }
    stage5_1(){
        this.time.delayedCall( 1000, () => {  
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage5_1, this.dialog)
            .start();
            seq.on('complete', () => {
                this.player.playerPaused = false;
            });
        }, [], this);   
    }
    stage5_2(){ 
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage5_2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.exclamMark.setVisible(true);
            this.exclamMark.play('exclam');
            this.time.delayedCall( 1000, () => {
                this.librarian1.anims.stop();
                this.librarian1.setFlipX(true);
                this.function=2;
            }, [] , this);

            

            console.log("..");
        });
    }
    
    stage5_3(){
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage5_3, this.dialog)
            .start();
            seq.on('complete', () => {
                //닉네임 말하는 대사 출력하기
                var textBox = this.add.image(40,10,'textbox').setOrigin(0,0); 
                var script = this.add.text(textBox.x + 200, textBox.y +50, '\''+username+'\' 이에요.', {
                fontFamily: 'Arial', 
                fill: '#000000',
                fontSize: '30px', 
                wordWrap: { width: 450, useAdvancedWrap: true }
                }).setOrigin(0,0);

                var playerFace = this.add.sprite(script.x + 600 ,script.y+50, 'face', 1);

                this.input.once('pointerdown', function() {
                    textBox.setVisible(false);
                    script.setVisible(false);
                    playerFace.setVisible(false);
                    this.librarian1.setFlipX(false);
                    this.librarian1.play('working_librarian1',true);
                    this.function=3;
                }, this);
            });
    }

    stage5_4(){
        var textBox = this.add.image(40,10,'textbox').setOrigin(0,0); 
        var script = this.add.text(textBox.x + 200, textBox.y +50, '\''+username+'\'... 어디보자...', {
            fontFamily: 'Arial', 
            fill: '#000000',
            fontSize: '30px', 
            wordWrap: { width: 450, useAdvancedWrap: true }
        }).setOrigin(0,0);

        var playerFace = this.add.sprite(script.x + 600 ,script.y+50, 'face', 1);

        //0.5초 뒤에 자동으로 대사창 사라지고 애니메이션 실행
        this.time.delayedCall( 500, () => { 
            textBox.setVisible(false);
            script.setVisible(false);
            playerFace.setVisible(false);
            this.time.delayedCall( 2000, () => { 
                this.librarian1.anims.stop();
                this.librarian1.setFlipX(true);
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.stage5_4, this.dialog)
                .start();
                seq.on('complete', () => {
                    
                    this.function=4;
                });
            }, [], this);   
            
        }, [], this);   
    }
    

    stage5_5(){
        this.tweens.add({
            targets: this.membership_card,
            y: 600, //위치 이동
            duration: 500,
            ease: 'Power1',
            repeat: 0,
            onComplete: ()=>{
                var seq = this.plugins.get('rexsequenceplugin').add();
                    this.dialog.loadTextbox(this);
                    seq
                    .load(this.dialog.stage5_5, this.dialog)
                    .start();
                    seq.on('complete', () => {
                        this.tweens.add({
                            targets: this.membership_card,
                            y: 0, //위치 이동
                            duration: 500,
                            ease: 'Power1',
                            repeat: 0,
                            onComplete: ()=>{
                                this.membership_card.destroy();
                                this.function=5;
                                this.librarian1.setFlipX(false);
                                this.librarian1.play('working_librarian1',true);
                            }
                        }, this);
                    }); 
            }
        }, this);
        
    }
    
    stage5_6(){
        this.player.player.setFlipX(true);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage5_6, this.dialog)
        .start();
        seq.on('complete', () => {
            this.firsttalked=true;
            this.cantalking=true;
            this.player.playerPaused = false;
        }); 
    }

    //===========================================================================

    stage5_7(){
        this.player.player.setFlipX(false);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage5_7, this.dialog)
        .start();
        seq.on('complete', () => {
            
        }); 
    }
    
}
