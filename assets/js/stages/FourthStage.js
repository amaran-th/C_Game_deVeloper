import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";
import ThirdStage from "./ThirdStage.js";

var droppedText; //드랍된 텍스트 무엇인지 판별할때 gameobject._text 값 저장하는 용으로 쓰임
var graphics; //퀴즈 넘어갈때마다 드랍존 지워야 해서 전역으로 뺐음
var inZone4_1;

export default class FourthStage extends Phaser.Scene {   
    constructor(){ 
        super("fourth_stage"); //identifier for the scene
    }

    preload() {

        this.load.image("stage4_tiles", "./assets/images/stage4/map_stage4.png");
        this.load.tilemapTiledJSON("fourth_stage", "./assets/fourth_stage.json");
    }
    
    create () {

        this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key3 = this.input.keyboard.addKey('THREE');
        this.key5 = this.input.keyboard.addKey('FIVE');
        this.key6 = this.input.keyboard.addKey('SIX');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "fourth_stage" });
        
        const tileset = map.addTilesetImage("test", "stage4_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.decoLayer = map.createLayer("deco", tileset, 0, 0);

        /*** 맵 이동 (문 이미지 불러오기) */
        this.zone4_1 = this.physics.add.staticImage(100, 420).setSize(100,160);

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, 1000, 430);

        /*** npc 만들기 ***/
        this.anims.create({
            key: "devil_touch_phone",
            frames: this.anims.generateFrameNumbers('npc_devil',{ start: 4, end: 5}), 
            frameRate: 2,
            repeat: -1,
        });

        this.devil = this.physics.add.sprite(910 ,430,'npc_devil');
        this.devil.setFlipX(true);
        this.devil.play('devil_touch_phone');

        //맵이동
        this.physics.add.overlap(this.player.player, this.zone4_1, function () {
            inZone4_1 = true;
        });

        //플레이어 위 pressX 생성해두기(door) => stage2로 
        this.pressX_1 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);


        /*벽 이미지 만들기*/

        this.wall = this.physics.add.image(1150,0,'wall').setOrigin(0,0);
        this.wall.body.setImmovable(true);
        this.wall.body.setAllowGravity(false); //플레이어가 밀 수도 없고 중력에 영향을 받지도 않게

        this.pressX = this.add.text(this.devil.x-50, this.devil.y-100, 'press X to\nattemp the test', {
            fontFamily: ' Courier',
            color: '#ffffff',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });

        this.pressXDoor = this.add.text(0, 340, 'press X', {
            fontFamily: ' Courier',
            color: '#ffffff',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.devil, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.player.player, this.wall);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;


        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "fourth_stage");


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
        /**마우스 위치 확인용 **/
        this.mouseCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });


        /*** 미니맵버튼 활성화  //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('fourth_stage'); 
            this.scene.run("minimap");
        },this);
        ***/


        //코드대로라면 if , for, printf를 얻고 시작을 해야하는데..... 안뜨네? 일단 아직 큰 문제는 아니니까 냅둠
        this.item = new Array(); //저장되는 아이템(드래그앤 드랍할 조각)
        this.item = ['if','for','printf'];
        this.dragAndDrop = new DragAndDrop(this, 0, 0, 0, 0);
        this.dragAndDrop.invenPlus(this);
        
        // 인벤창 팝업 여부를 나타내는 상태변수
        this.invenIn = false;
        
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

         // 4_stage의 앱에 들어가는 코드
         this.app_code_text =
         "#include <stdio.h>\n" +
         "int main(){\n\n" +
         "int password = 0;\n" +
         " ㅤㅤㅤ(int i=10; i>0; i--) {\n" +
		 "      ㅤㅤㅤ (i%2==1){\n" +
		 "          password += i;\n" +
		 "          }\n" +
	     "      }\n" +
         ' printf("ㅤㅤㅤㅤ",password);\n' +
         "}\n"



 
         //코드 실행후 불러올 output값
         this.out = "";


        stagenum = 4;

        this.firstTalk = true ;//악마 앞에서 x키 누를때 필요
        this.quiz1 = true;
        this.quiz2 = false;
        this.quiz3 = false;
        this.quiz4 = false;
        this.quizOver = false;
        this.door = true; //문 앞에서 퀴즈 맞출때;

        
    
    }

    update() {

        //console.log('droppedText:',droppedText);
        this.dragAndDrop.updownwithinven(this); //인벤창 닫고 열때 아이템도 같이 움직이게 함

        /** 현재 퀴즈따라서 컴파일 내용 바꿔주기 (퀴즈 틀리고 맞출때마다 플레이어 말풍선으로 컴파일 내용 뜨는 거 하고싶음)**/
        if(this.quiz1) {
            this.contenttext = 
            "#include <stdio.h>\n" +
            "int main()  { printf('1 + "+ this.code_zone_1 +" = 4', 3 }"
            } else if(this.quiz2) {
                this.contenttext = 
                "#include <stdio.h>\n" +
                "int main()  { printf('1 + "+ this.code_zone_1 +" = 4', 3 }"
            } else if(this.quiz3) {
                this.contenttext = 
                "#include <stdio.h>\n" +
                "int main()  { printf('1 + "+ this.code_zone_1 +" = 4', 3 }"
            } else if(this.quiz4) {
                this.contenttext = 
                "#include <stdio.h>\n" +
                "int main()  { printf('1 + "+ this.code_zone_1 +" = 4', 3 }"
            } else if(this.quizOver) {
            this.contenttext =
            "#include <stdio.h>\n" +
            "int main(){\n\n" +
            "   int password = 0;" +
            "  "+ this.code_zone_1 +"(int i=10; i>0; i--) {\n" +
            "      "+this.code_zone_2+" (i%2==1){\n" +
            "          password += i;\n" +
            "      }\n" +
            "  }\n" +
            "   printf(\'"+ this.code_zone_3 +"\',i);\n" +
            "}\n"
            }

        if (this.out == 
            "#include <stdio.h>\n" +
            "int main(){\n\n" +
            "   int password = 0;" +
            "  "+ 'for' +"(int i=10; i>0; i--) {\n" +
            "      "+'if'+" (i%2==1){\n" +
            "          password += i;\n" +
            "      }\n" +
            "  }\n" +
            "   printf(\'"+ '%d' +"\',i);\n" +
            "}\n"
            ){
            console.log("===stage4 클리어!===");
            this.bread.setVisible(true);
        }
        else if(this.out != "") this.stage4_7();



        /* 퀴즈 정답맞추기 */
        if(this.quiz1 && droppedText == '%d' ) {
            this.quiz1 = false;
            this.quiz2 = true;
            droppedText = undefined;
            
            this.time.delayedCall(1000,() => {
                this.dragAndDrop.reset_before_mission(this);
                this.item.length = 0; //배열 비워버리기
                this.temp_getItem() //배열 다시 채우기
                this.stage4_q_2()
            },[],this);
                
        }
        else if(this.quiz1 && droppedText != undefined ) {//%d가 드랍된 게 아니라면 
            this.dragAndDrop.reset_before_mission(this);
            console.log
            this.item.length = 0; //배열 비워버리기
            this.temp_getItem() //배열 다시 채우기
            this.dialog.visible(false);
            this.stage4_quiz_1(); //다시 드랍 실행하기
            droppedText = undefined;
        }

        if(this.quiz2 && droppedText == '%c' ) {
            this.quiz2 = false;
            this.quiz3 = true;
            droppedText = undefined;
            this.time.delayedCall(1000,() => {
                this.dragAndDrop.reset_before_mission(this);
                this.item.length = 0; //배열 비워버리기
                this.temp_getItem() //배열 다시 채우기
                this.stage4_q_3()
            },[],this);
        }
        else if(this.quiz2 && droppedText != undefined ) {//%d가 드랍된 게 아니라면 
            this.dragAndDrop.reset_before_mission(this);
            this.item.length = 0; //배열 비워버리기
            this.temp_getItem() //배열 다시 채우기
            this.dialog.visible(false);
            this.stage4_quiz_2(); //다시 드랍 실행하기
            droppedText = undefined;
        }

        if(this.quiz3 && droppedText == '%s' ) {
            this.quiz3 = false;
            this.quiz4 = true;
            droppedText = undefined;
            this.time.delayedCall(1000,() => {
                this.dragAndDrop.reset_before_mission(this);
                this.item.length = 0; //배열 비워버리기
                this.temp_getItem() //배열 다시 채우기
                this.stage4_q_4()
            },[],this);
        }
        else if(this.quiz3 && droppedText != undefined ) {//%d가 드랍된 게 아니라면 
            this.dragAndDrop.reset_before_mission(this);
            this.item.length = 0; //배열 비워버리기
            this.temp_getItem() //배열 다시 채우기
            this.dialog.visible(false);
            this.stage4_quiz_3(); //다시 드랍 실행하기
            droppedText = undefined;
        }

        if(this.quiz4 && droppedText == '%f' ) {
            this.quiz4 = false;
            droppedText = undefined;
            this.time.delayedCall(1000,() => {
                this.dragAndDrop.reset_before_mission(this);
                this.item.length = 0; //배열 비워버리기
                this.temp_getItem() //배열 다시 채우기
                this.stage4_5()
            },[],this);
        }
        else if(this.quiz4 && droppedText != undefined ) {//%d가 드랍된 게 아니라면 
            this.dragAndDrop.reset_before_mission(this);
            this.item.length = 0; //배열 비워버리기
            this.temp_getItem() //배열 다시 채우기
            this.dialog.visible(false);
            this.stage4_quiz_4(); //다시 드랍 실행하기
            droppedText = undefined;
        }
        

        this.player.update();
        this.inventory.update(this);
        this.command.update(this);
        if(this.draganddrop!=undefined) this.draganddrop.update(this);
        if(this.draganddrop_1!=undefined) this.draganddrop_1.update(this);
        if(this.draganddrop_2!=undefined) this.draganddrop_2.update(this);
        if(this.draganddrop_3!=undefined) this.draganddrop_3.update(this);
                
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;

        /* 마우스 위치 알려줌 */
        this.mouseCoord.setText([
            '마우스 위치',
            'x:' + this.input.mousePointer.x + this.worldView.x,
            'y:' + this.input.mousePointer.y,
        ]);
        this.mouseCoord.x = this.playerCoord.x;
        this.mouseCoord.y = this.worldView.y + 500;



        /* 시험 시작! */
        if(this.player.player.x >=this.devil.x -100 && this.devil.x +100 >= this.player.player.x ){
            this.pressX.setVisible(true);
            if(this.keyX.isDown){
                if(this.firstTalk) {
                    this.devil.anims.stop();
                    this.firstTalk = undefined;
                    this.player.playerPaused = true;
                    this.item.length = 0; //배열 비워버리기
                    this.temp_getItem() //배열 다시 채우기
                    this.stage4_quiz_1();
                }
            }
        }
        else this.pressX.setVisible(false);

        /*두번째 관문*/
        if(this.player.player.x >= 1400 && 1500 >= this.player.player.x ){
            this.pressXDoor.setVisible(true);
            this.pressXDoor.x = this.player.player.x;
            if(this.keyX.isDown){
                if(this.door) {
                    this.door = false;
                    this.player.playerPaused = true;
                    //this.temp_getItem();
                    this.stage4_6();
                }
            }
        }
        else this.pressXDoor.setVisible(false);


        if(this.key1.isDown) {
            console.log('맵이동');
            this.scene.sleep('fourth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');
        }
        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('fourth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("second_stage");
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('fourth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }
        if(this.key5.isDown) {
            console.log('맵이동');
            this.scene.sleep('fourth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fifth_stage");
        }
        if(this.key6.isDown) {
            console.log('맵이동');
            this.scene.sleep('fourth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("sixth_stage");
        }

        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        //맵이동 (stage3_0) 로
        if (inZone4_1) {
            this.pressX_1.x = this.player.player.x-50;
            this.pressX_1.y = this.player.player.y-100;
            this.pressX_1.setVisible(true);
            if (this.keyX.isDown){
                console.log("[맵이동] stage3_0 으로");
                this.command.remove_phone(this);
                this.scene.switch('third_stage_0'); 
            }
        }else this.pressX_1.setVisible(false);
        
        inZone4_1 = false;

    }

    temp_getItem() {
        console.log('아이템 겟 함수 호출');
        this.item[this.item.length] =  'printf';
        this.item[this.item.length] =  'if';
        this.item[this.item.length] =  'for';
        this.item[this.item.length] =  '%d';
        this.item[this.item.length] =  '%s';
        this.item[this.item.length] =  '%c';
        this.item[this.item.length] =  '%f';
        this.dropzon_su = 4; // draganddrop.js안에 코드조각 같은거 한 개만 생성하게 하는데 필요

        this.dragAndDrop.invenPlus(this);
    }

    makeDropzone(x,y,width) {
        this.zone  = this.add.zone(x, y, width, 25).setRectangleDropZone(80, 25);
        console.log('드랍존 생성!',this.zone);
        graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(x - width / 2, y - 25 / 2, width, 25);

        this.input.on('dragenter', function (pointer, gameObject, dropZone) {
    
            //graphics.clear();
            graphics.lineStyle(2, 0x00ffff);
            graphics.strokeRect((x - width / 2, y - 25 / 2, width, 25));
        });
    
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
    
            //graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect((x - width / 2, y - 25 / 2, width, 25));
        });
    
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            console.log(dropZone.x,dropZone.y)
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            console.log(gameObject.x,gameObject.y)

            droppedText = gameObject._text;

            //퀴즈 정답유무는 update에
        });
    
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped)
            {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            } else {
                gameObject.x = x - (width/2) +5;
                gameObject.y = y - (25/2);
            }
            //graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect((x - width / 2, y - 25 / 2, width, 25));
    
        });
    }

    stage4_quiz_1() {
        //this.codeapp_onoff_state = 1; //드랍존 폰 안열려있어도 보여야함
        this.command.entire_code_button.input.enabled = false; //퀴즈 진행하는 동안 폰 안열리도록

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_quiz_1, this.dialog)
        .start();
        seq.on('complete', () => {
        });
        this.makeDropzone(690,75,80);
    }

//다음문제로 넘어가면 드랍존이 안뜸... zone이 안지워지고 남아있어서 그런가봄
//this.zone으로 바꾸면 x y 를 못들고오긴 하는데 그냥 끼워맞추면 될지도...?


    stage4_q_2(){
        this.zone.destroy();
        this.dialog.visible(false);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_q_2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.stage4_quiz_2();
        });
    }

    stage4_quiz_2() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_quiz_2, this.dialog)
        .start();
        this.makeDropzone(765,75,40);

        seq.on('complete', () => {
        });

    }



    stage4_q_3(){
        this.zone.destroy();
        this.dialog.visible(false);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_q_3, this.dialog)
        .start();
        seq.on('complete', () => {
            this.stage4_quiz_3();
        });
    }

    stage4_quiz_3() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_quiz_3, this.dialog)
        .start();
        this.makeDropzone(665,75,80);
        seq.on('complete', () => {
        });
    }



    stage4_q_4(){
        this.zone.destroy();
        this.dialog.visible(false);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_q_4, this.dialog)
        .start();
        seq.on('complete', () => {
            this.stage4_quiz_4();
        });
    }

    stage4_quiz_4() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_quiz_4, this.dialog)
        .start();
        this.makeDropzone(725,75,80);
        seq.on('complete', () => {
        });
    }


    stage4_5() {
        this.zone.destroy();
        this.dialog.visible(false);

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_5, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false;
            this.command.entire_code_button.input.enabled = true;
            //this.wall.body.setImmovable(false);
            this.cameras.main.shake(3000, 0.01);
            this.tweens.add({
                targets: [this.wall],
                y:-400,
                duration: 3000,
                ease: 'Linear',
                repeat: 0,
                onComplete: ()=>{
                    this.devil.play('devil_touch_phone');
                }
            }, this);
        });
    }

    stage4_6() {
        this.player.playerPaused = true;
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_6, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false;
            this.temp_getItem();
            this.dropzone1_x = 790; // 드랍존 x좌표 (플레이어 따라 이동하는데 필요)
            this.dropzone2_x = 814;
            this.dropzone3_x = 880;
            this.draganddrop_1 = new DragAndDrop(this, this.dropzone1_x, 205, 80, 25).setRectangleDropZone(80, 25).setName("1");
            this.draganddrop_2 = new DragAndDrop(this, this.dropzone2_x, 230, 80, 25).setRectangleDropZone(80, 25).setName("2");
            this.draganddrop_3 = new DragAndDrop(this, this.dropzone3_x, 340, 80, 25).setRectangleDropZone(80, 25).setName("3");
        });
    }

    stage4_7(){
        this.player.playerPaused = true;
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_7, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false;
        });
    }

    complied(scene,msg) { //일단 코드 실행하면 무조건 실행된다.
        //complied를 호출하는 코드가 command의 constructure에 있음, constructure에서 scene으로 stage1을 받아왔었음. 그래서??? complied를 호출할때 인자로 scene을 넣어줬음.
        //console.log(scene.out);
        console.log("compiled");
        if(msg==scene.out){
            this.command.remove_phone(this);
            this.invenIn=false;
            this.inventory.inventoryBody.y = 600;

            playerX = this.player.player.x;
            this.textBox = scene.add.image(playerX-70,270,'bubble').setOrigin(0,0);
            this.script = scene.add.text(this.textBox.x + 70, this.textBox.y +30, msg, {
                fontFamily: 'Arial Black',
                fontSize: '15px',
                color: '#000000', //글자색 
                wordWrap: { width: 100, height:60, useAdvancedWrap: true },
                boundsAlignH: "center",
                boundsAlignV: "middle"
            }).setOrigin(0.5)
            this.player.playerPaused=true;    //플레이어 얼려두기

            //var playerFace = scene.add.sprite(script.x + 600 ,script.y+50, 'face', 0);
        }else{
            this.textBox = scene.add.image(this.worldView.x,400,'textbox').setOrigin(0,0); 
            this.script = scene.add.text(this.textBox.x + 200, this.textBox.y +50, "(이게 답이 아닌 것 같아.)", {
                fontFamily: 'Arial', 
                fill: '#000000',
                fontSize: '30px', 
                wordWrap: { width: 450, useAdvancedWrap: true }
            }).setOrigin(0,0);

            this.playerFace = scene.add.sprite(this.script.x + 600 ,this.script.y+50, 'face', 0);
        }
        scene.input.once('pointerdown', function() {
            if(msg==scene.out){
                this.textBox.setVisible(false);
                this.script.setVisible(false);
                //playerFace.setVisible(false);
                //this.stage2_3_1();
                
                
            }else{
                this.textBox.setVisible(false);
                this.script.setVisible(false);
                this.playerFace.setVisible(false);
            }
            
        }, this);
    
    }

}
