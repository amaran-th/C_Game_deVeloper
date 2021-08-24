import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";


export default class FifthStage extends Phaser.Scene {   
    constructor(){ 
        super("fifth_stage"); //identifier for the scene
    }

    preload() {

        this.load.image("stage5_tiles", "./assets/images/stage5/map_stage5.png");
        this.load.tilemapTiledJSON("fifth_stage", "./assets/fifth_stage.json");
    
    }
    
    create () {

        this.inventory = new Inventory(this);
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
        
        const tileset = map.addTilesetImage("map_stage5", "stage5_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);
        //도서관의 배경 불빛 애니메이션 생성
        this.anims.create({
            key: "light",
            frames: this.anims.generateFrameNumbers('librarylight',{ start: 0, end: 2}), 
            frameRate: 5,
            repeat: -1
        });

        this.background1 = this.add.sprite( 600, 200, 'librarylight', 0).setOrigin(0,1);
        this.background2 = this.add.sprite( 600, 400, 'librarylight', 0).setOrigin(0,1);
        this.background3 = this.add.sprite( 100, 250, 'librarylight', 0).setOrigin(0,1);

        this.background1.play('light',true);
        this.background2.play('light',true);
        this.background3.play('light',true);

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
        this.librarian1 = this.add.sprite(595 ,375,'librarian1');
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
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "fifth_stage");


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화/ //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('fifth_stage'); 
            this.scene.run("minimap");
        },this);
        */

        //플레이어 위 talktext 생성해두기(talk with librarian)
        this.talktext = this.add.text(600, 300, 'Press X to have a talk', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        
        /** 초반 대사 **/
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        this.stage5_1();

        
        this.item = new Array(); //저장되는 아이템(드래그앤 드랍할 조각)

        // 인벤창 팝업 여부를 나타내는 상태변수
        this.invenIn = false;
        
        /** 아이템 만들기 **/
        
        var item_text = 'printf';
        this.itemicon = this.add.image(360,330,'item'); 
        

        /** 아이템 얻었을 때 뜨는 이미지 **/
        this.itemget = this.add.image(0,0,'itemGet').setOrigin(0.0);
        this.itemText = this.add.text(500, 270, item_text, {
        font: "30px Arial Black", fill: "#000000" 
        }).setOrigin(0,0);
        this.itemget.setVisible(false);
        this.itemText.setVisible(false);
        this.beforeItemGet = true; //한 번만 뜨도록

        /** 인벤토리 만들기 **/     
        this.inven = this.inventory.create(this);

        /** 드래그앤드랍 **/
        //드래그앤드롭으로 zone에 있는 코드 받아오기 위한 변수.
        // 지금 컴파일 테스트를 못해봐서 일단 주석처리해놓고 확이해보고 제대로 되면 이부분 삭제예정
        /*this.code_zone_1 = "           "; //11칸
        this.code_zone_2 = "           ";
        this.code_zone_3 = "           ";
        this.code_zone_4 = "           ";
        this.code_zone_5 = "           ";
        this.code_zone_6 = "           ";*/
        
        // 클래스 여러번 호출해도 위에 추가한 코드조각만큼만 호출되게 하기 위한 상태 변수
        this.code_piece_add_state = 0;
        // 드랍여부 확인(새로운 씬에도 반영 하기 위해 씬에 변수 선언 함)
        this.drop_state_1 = 0;
        this.drop_state_2 = 0;
        this.drop_state_3 = 0;
        this.drop_state_4 = 0;
        this.drop_state_5 = 0;
        this.drop_state_6 = 0;


        //사서와 대화 중인지를 나타내는 플래그 변수
        this.cantalking=true;
        
        //이벤트 실행을 위한 플래그 변수
        this.function=0;
        
        //맵 이동을 위한 스테이지 번호 변수
        stagenum = 5;
        
        //사서1과의 초기 이벤트를 봤는지 여부
        this.firsttalked=false;

        /** 임시로 만들어둔 선택지 예시 **/
        this.finAnswer = { //주소
            answer: 0 //값
        };

        //라이브러리를 대여한 상태변수
        this.library_state=0;   //0 : 라이브러리 안 빌린 상태, 1 : math빌린 상태, 2 : string 빌린 상태
        this.present_library="없음";
        this.change_library=0;  //라이브러리 상태의 변화를 나타내는 변수(1~9)
        this.dialog_text="";
        
        //select 관련 함수 트리거 변수
        this.select_trigger=false;

        this.select_case0= ['<math.h>','<string.h>','대여하지 않는다.']; //msgArr.length = 3
        this.select_case1= ['<math.h>을 반납한다.','<math.h>을 반납하고 <string.h>을 대여한다.','아무것도 하지 않는다.'];
        this.select_case2= ['<string.h>을 반납한다.','<string.h>을 반납하고 <math.h>을 대여한다.','아무것도 하지 않는다.'];
        
    }

    update() {
        this.player.update();
        this.inventory.update(this);
        this.command.update(this);

        //선택지 선택 결과 처리 코드
        if(!this.scene.isVisible('selection') && this.finAnswer.answer){ //selection 화면이 꺼졌다면
            if(this.library_state==0){
                //case0의 선택지 선택시
                switch(this.finAnswer.answer) {
                case 1: console.log('1의 선택지로 대답 했을때(0->1)');
                    this.library_state=1;
                    this.change_library=1;
                    this.present_library="<math.h>";
                    this.finAnswer.answer = 0;
                    this.function=7;
                    return;
                case 2: console.log('2의 선택지로 대답 했을때(0->2)');
                    this.library_state=2;
                    this.change_library=2;
                    this.present_library="<string.h>";
                    this.finAnswer.answer = 0;
                    this.function=7;
                    return;
                case 3: console.log('3의 선택지로 대답 했을때(0->0)');
                    this.change_library=3;
                    this.finAnswer.answer = 0;
                    this.function=7;
                    return;
                }
            }else if(this.library_state==1){
                //case1의 선택지 선택시
                switch(this.finAnswer.answer) {
                    case 1: console.log('1의 선택지로 대답 했을때(1->0)');
                        this.library_state=0;
                        this.change_library=4;
                        this.present_library="없음";
                        this.finAnswer.answer = 0;
                        this.function=7;
                        return;
                    case 2: console.log('2의 선택지로 대답 했을때(1->2)');
                        this.library_state=2;
                        this.change_library=5;
                        this.present_library="<string.h>";
                        this.finAnswer.answer = 0;
                        this.function=7;
                        return;
                    case 3: console.log('3의 선택지로 대답 했을때(1->1)');
                        this.change_library=6;
                        this.finAnswer.answer = 0;
                        this.function=7;
                        return;
                    }
            }else if(this.library_state==2){
                //case2의 선택지 선택시
                switch(this.finAnswer.answer) {
                    case 1: console.log('1의 선택지로 대답 했을때(2->0)');
                        this.library_state=0;
                        this.change_library=7;
                        this.present_library="없음";
                        this.finAnswer.answer = 0;
                        this.function=7;
                        return;
                    case 2: console.log('2의 선택지로 대답 했을때(2->1)');
                        this.library_state=1;
                        this.change_library=8;
                        this.present_library="<math.h>";
                        this.finAnswer.answer = 0;
                        this.function=7;
                        return;
                    case 3: console.log('3의 선택지로 대답 했을때(2->2)');
                        this.change_library=9;
                        this.finAnswer.answer = 0;
                        this.function=7;
                        return;
                    }
            }
            
        }
            
        
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


        //사서1과 대화 중 선택지 관련 함수 실행을 위한 코드
        if(this.select_trigger){
            if(this.library_state==0){
                this.stage5_select0();
                this.select_trigger=false;
            }else if(this.library_state==1){
                this.stage5_select1();
                this.select_trigger=false;
            }else if(this.library_state==2){
                this.stage5_select2();
                this.select_trigger=false;
            }
        }




        /** 아이템 획득하는 경우 **/
        if (this.beforeItemGet && this.player.player.x < this.itemicon.x+54 && this.itemicon.x < this.player.player.x) {
            this.beforeItemGet = false; //여기다가 해야 여러번 인식 안함
            this.itemicon.setVisible(false);
            this.itemget.setVisible(true);
            this.itemText.setVisible(true);
            this.tweens.add({
                targets: [this.itemget, this.itemText],
                alpha: 0,
                duration: 2000,
                ease: 'Linear',
                repeat: 0,
                onComplete: ()=>{this.invenPlus = true;}
            }, this);
        }
        
        if(this.invenPlus) {
            this.item[this.item.length] =  '원하는';
            this.item[this.item.length] =  '아이템';
            this.item[this.item.length] =  '넣으셈';
            this.dropzon_su = 4; // draganddrop.js안에 코드조각 같은거 한 개만 생성하게 하는데 필요

            this.dropzone1_x = 805; // 드랍존 x좌표 (플레이어 따라 이동하는데 필요)
            this.dropzone2_x = 1000;
            this.dropzone3_x = 805;
            this.dropzone4_x = 200;

            this.draganddrop_1 = new DragAndDrop(this, this.dropzone1_x, 85, 80, 25).setRectangleDropZone(80, 25).setName("1");
            this.draganddrop_2 = new DragAndDrop(this, this.dropzone2_x, 85, 80, 25).setRectangleDropZone(80, 25).setName("2");
            this.draganddrop_3 = new DragAndDrop(this, this.dropzone3_x, 150, 80, 25).setRectangleDropZone(80, 25).setName("3");
            this.draganddrop_4 = new DragAndDrop(this, this.dropzone4_x, 150, 80, 25).setRectangleDropZone(80, 25).setName("4");
            //this.intro4();
            this.invenPlus = false;
        }

        if(this.draganddrop_1!=undefined) this.draganddrop_1.update(this);
        if(this.draganddrop_2!=undefined) this.draganddrop_2.update(this);
        if(this.draganddrop_3!=undefined) this.draganddrop_3.update(this);
        if(this.draganddrop_4!=undefined) this.draganddrop_4.update(this);

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
                            alpha: 0, //위치 이동
                            duration: 500,
                            ease: 'Power1',
                            repeat: 0,
                            onComplete: ()=>{
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
        console.log("stage5_7");
        this.membership_card.setAlpha(0);
        this.membership_card.y=600;
        this.librarian1.anims.stop();
        this.librarian1.setFlipX(true);
        
        this.player.player.setFlipX(false);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage5_7, this.dialog)
        .start();
        seq.on('complete', () => {
            //회원증이 스르륵 나타나서 위로 올라가는 애니메이션
            this.tweens.add({
                targets: this.membership_card,
                alpha: 1, //선명해지게
                duration: 500,
                ease: 'Power1',
                repeat: 0,
                onComplete: ()=>{
                    this.tweens.add({
                        targets: this.membership_card,
                        y: 0, //위치 이동
                        duration: 500,
                        ease: 'Power1',
                        repeat: 0,
                        onComplete: ()=>{
                            this.librarian1.setFlipX(false);
                            this.librarian1.play('working_librarian1',true);

                            this.time.delayedCall( 1000, () => { 
                                this.librarian1.anims.stop();
                                this.librarian1.setFlipX(true);

                                this.select_trigger=true;
                            }, [], this); 
                            
                        }
                    }, this);
                }
            }, this);
            
            
            
        }); 
    }

    stage5_select0(){
        console.log("stage5_select0");
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.select0, this.dialog)
        .start();
        seq.on('complete', () => {
            this.scene.run('selection',{ msgArr: this.select_case0, num: this.select_case0.length, finAnswer: this.finAnswer });
        });
    }

    stage5_select1(){
        console.log("stage5_select1");
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.select1, this.dialog)
        .start();
        seq.on('complete', () => {
            this.scene.run('selection',{ msgArr: this.select_case1, num: this.select_case1.length, finAnswer: this.finAnswer });
        });
    }

    stage5_select2(){
        console.log("stage5_select2");
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.select2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.scene.run('selection',{ msgArr: this.select_case2, num: this.select_case2.length, finAnswer: this.finAnswer });
        });
    }
    stage5_8(){
        if(this.change_library==1||this.change_library==2){
            //추가
            this.dialog_text=this.present_library+" 라이브러리 인벤토리가 추가되었습니다.";
            this.change_library=0;
        }else if(this.change_library==4||this.change_library==7){
            //제거
            this.dialog_text=" 라이브러리 인벤토리가 사라졌습니다.";
            this.change_library=0;
        }else if(this.change_library==5||this.change_library==8){
            //전환
            this.dialog_text="기존 라이브러리 인벤토리가 "+this.present_library+" 라이브러리 인벤토리로 변경되었습니다.";
            this.change_library=0;
        }else{
            //변화x
            this.dialog_text="라이브러리를 변경하지 않습니다.";
            this.change_library=0;
        }

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage5_8_1, this.dialog)
        .start();
        seq.on('complete', () => {
            console.log("stage5_8");
            var textBox = this.add.image(40,10,'textbox').setOrigin(0,0); 
            var script = this.add.text(textBox.x + 200, textBox.y +50, this.dialog_text, {
                fontFamily: 'Arial', 
                fill: '#000000',
                fontSize: '30px', 
                wordWrap: { width: 450, useAdvancedWrap: true }
            }).setOrigin(0,0);
            var playerFace = this.add.sprite(script.x + 600 ,script.y+50, 'face', 31);
            
            this.input.once('pointerdown', function() {
                console.log("click");
                    textBox.setVisible(false);
                    script.setVisible(false);
                    playerFace.setVisible(false);
                    this.function=8;       
            }, this);
        });
        
    }

    
    
    stage5_9(){
        console.log("stage5_9");
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
                .load(this.dialog.stage5_8_2, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.tweens.add({
                            targets: this.membership_card,
                            alpha: 0, //투명해지게
                            duration: 500,
                            ease: 'Power1',
                            repeat: 0,
                            onComplete: ()=>{
                                var seq = this.plugins.get('rexsequenceplugin').add();
                                this.dialog.loadTextbox(this);
                                seq
                                .load(this.dialog.stage5_8_3, this.dialog)
                                .start();
                                seq.on('complete', () => {
                                    this.librarian1.setFlipX(false);
                                    this.librarian1.play('working_librarian1',true);
                                    this.cantalking=true;
                                    this.player.playerPaused = false;
                                    this.function=0;
                                });
                        
                            }
                    }, this);  
                });
                             
            }
        }, this);
    }
    
}