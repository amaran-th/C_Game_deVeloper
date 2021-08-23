import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";


export default class SecondStage extends Phaser.Scene {   
    constructor(){ 
        super("second_stage"); //identifier for the scene
    }

    preload() {

        //this.load.image("stage_tiles", "./assets/images/test.png");
        this.load.tilemapTiledJSON("second_stage", "./assets/second_stage.json");
    
    }
    
    create () {
        this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);


        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key3 = this.input.keyboard.addKey('THREE');
        this.key4 = this.input.keyboard.addKey('FOUR');
        this.key5 = this.input.keyboard.addKey('FIVE');
        this.key6 = this.input.keyboard.addKey('SIX');


        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers('fireBackground',{ start: 0, end: 2}), 
            frameRate: 5,
            repeat: -1
        });

        this.background1 = this.add.sprite( 0, 550, 'fireBackground', 0).setOrigin(0,1);
        this.background2 = this.add.sprite( 1100, 550, 'fireBackground', 0).setOrigin(0,1);

        this.background1.play('fire',true);
        this.background2.play('fire',true);


        /** 물 찰랑이는 거 **/
        this.anims.create({
            key: "waterWball",
            frames: this.anims.generateFrameNumbers('waterWball',{ start: 0, end: 3}), 
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: "water",
            frames: this.anims.generateFrameNumbers('water',{ start: 0, end: 3}), 
            frameRate: 4,
            repeat: -1,
        });
        this.waterWball = this.add.sprite( 1600, 630, 'waterWball', 0).setOrigin(0,1);
        this.waterWball.play('waterWball');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "second_stage" });
        
        const tileset = map.addTilesetImage("map_stage2", "stage2_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        
        /**온도계 이미지**/
        this.anims.create({
            key: "temperature",
            frames: this.anims.generateFrameNumbers('temperature',{ start: 0, end: 1}), 
            frameRate: 2,
            repeat: -1,
        });
        this.temperature = this.add.sprite(200 ,500,'temperature').setOrigin(0,1);  
        this.temperature.setInteractive();  
        this.temperature.play('temperature');    

        /*** 카페 이미지 불러오기 (코드 실행 후 나오는 카페) */
        this.cafe = this.add.image(447,114,'cafe').setOrigin(0,0)
        this.cafe.setVisible(false);


        /*** npc 불러오기 ***/ 
     //   this.npc_hot = this.add.image(750,380,'npc_hot').setOrigin(0,0);
     //   this.npc_cold = this.add.image(650,380,'npc_cold').setOrigin(0,0);
        this.anims.create({
            key: "npc_cold_walk",
            frames: this.anims.generateFrameNumbers('npc_cold',{ start: 0, end: 3}), 
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: "npc_hot_walk",
            frames: this.anims.generateFrameNumbers('npc_cold',{ start: 4, end: 7}), 
            frameRate: 7,
            repeat: -1,
        });
        this.npc7 = this.physics.add.sprite(910 ,430,'npc_cold');
        this.npc7.setVisible(false);

        this.npc6 = this.add.sprite(1445 ,430,'npc6');

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, 1000, spawnPoint.y);
        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/20, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.npc7, this.worldLayer);
        
        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        /*** 퀘스트 말풍선 애니메이션 */
        this.anims.create({
            key: "exclam",
            frames: this.anims.generateFrameNumbers('exp_exclam',{ start: 0, end: 4}), 
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        });
        
        this.exclamMark = this.add.sprite( 580, 300, 'exp_exclam', 0);
        this.exclamMark.setVisible(false);

        /** 으아앙 말풍선 애니메이션 **/
        this.anims.create({
            key: "shake",
            frames: this.anims.generateFrameNumbers('cry',{ start: 0, end: 3}), 
            frameRate: 10,
            repeat: 2,
            hideOnComplete: true
        })
        this.cry = this.add.sprite( 900, 300, 'cry', 0);
        this.cry.setVisible(false);

        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "second_stage");
        /** 휴대폰 킨 상태로 맵 이동했을때 휴대폰 꺼져있도록**/
        this.command.commandbox.setVisible(false);
        for(var i=0; i < this.command.apps.length; i++){
            this.command.apps[i].setVisible(this.command.commandbox.visible);
            console.log(this.command.apps[i].visible);
        }
        this.command.back_button.setVisible(this.command.commandbox.visible);


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화 ***/ //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('second_stage'); 
            this.scene.run("minimap");
        },this);

        this.item = new Array(); //저장되는 아이템(드래그앤 드랍할 조각)

        // 인벤창 팝업 여부를 나타내는 상태변수
        this.invenIn = false;
        
        /** 아이템 만들기 **/
        this.itemicon = this.add.image(360,430,'item');
        var item_text = 'if';
        
        /** 아이템 얻었을 때 뜨는 이미지 **/
        this.itemget = this.add.image(0,0,'itemGet').setOrigin(0.0);
        this.itemText = this.add.text(500,270,item_text,{
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


        //Second_stage의 전체 코드
        this.contenttext = "" ; 

        // Second_stage의 앱에 들어가는 코드
        this.app_code_text =
        "1_#include <stdio.h>\n" + 
        "int main(){\n\n" +
        "   {int temp = 45;} \n\n   " +
        "           " + "(" + "           " + ">30){\n      " + //if(Temp>30)
        "           " + "(\"더워요\");\n"  +//printf("더워요");
        "   }\n   else{\n      printf(\"추워요\");\n   }\n}"

        //코드 실행후 불러올 output값
        this.out = "";

        stagenum = 2;

        //초반 대사
        this.cameras.main.fadeIn(1000,0,0,0);
        //this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        //this.stage2_1();


        /** 변수들 드래그 **/
        var variable = this.add.graphics();
        variable.lineStyle(3, 0xFFB569, 1);
        this.var_cage = variable.fillRoundedRect(0, 0, 75, 50, 10).strokeRoundedRect(0, 0, 75, 50, 10).fillStyle(0xFCE5CD, 1); //글자 밖 배경

        this.text_temp = this.add.text(37,25,'temp',{ 
            fontSize : '30px',
            fontFamily: ' Courier',
            color: '#FFB569'
        });
        this.text_temp.setInteractive();
        this.text_temp.setVisible(false); //아........ 투명도 0으로 하면 입력이 안먹힘...........
        //var var_temp = this.add.container(100,400, [var_cage,text_temp]).setSize(50,50); //temp 변수
        //var_temp.setInteractive(new Phaser.Geom.Rectangle(37, 25, 50, 50), Phaser.Geom.Rectangle.Contains); 
        //var_temp.setName("temp")
        //이거 37,25 안하면 왼쪽 위 꼭지점 부분 중심으로 50 사이즈로 클릭 범위 잡힘
        
        this.input.setDraggable(this.text_temp);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.setVisible(true);
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.input.on('dragend', function (pointer, gameObject,dropped) {
            //gameObject.clearTint();
            if (!dropped) //이거 없으면 마우스 놓은 자리에 유지됨
            {
                gameObject.setVisible(false);
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
            else{
            }
        });
        this.input.on('drop', function (pointer, gameObject, dragX, dragY) {
            gameObject.setVisible(false);
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        });
        
        this.temperature.on('pointerover', function(){
            this.text_temp.setVisible(true);
            this.text_temp.x = this.input.mousePointer.x-20;
            this.text_temp.y = this.input.mousePointer.y-20;
        }, this);
        this.temperature.on('pointerout', function(){
            this.text_temp.setVisible(false)
        }, this);

        //this.mission1Complete = false;
        this.mission1Complete = true;
        this.cantGoFarther = true; //플레이어가 1100 이상 움직였을 때 '한번만' 대사가 나오도록 
        this.firstTalk = true; //플레이어가 유치원생과 한 번만 대화할 수 있도록

        this.mission1 = true; //미션 1을 진행할때 폰에 미션1용 코드가 뜨도록
    }

    update() {
        //변수의 배경이 텍스트 따라다니도록
        this.var_cage.x = this.text_temp.x;
        this.var_cage.y = this.text_temp.y;
        this.var_cage.visible = this.text_temp.visible;

        if(this.mission1) {
            this.contenttext = 
            "1_#include <stdio.h>\n" + 
            "int main(){\n\n" +
            "   {int temp = 45;} \n\n   " +
            this.code_zone_1 + "(" + this.code_zone_2 + ">30){\n      " + //if(Temp>30)
            this.code_zone_3 + "(\"더워요\");\n"  +//printf("더워요");
            "   }\n   else{\n      printf(\"추워요\");\n   }\n}"
        }

        if(this.mission2) {
            this.contenttext = 'asdadasda'
            
        }

        
        //실제로는 2가지에 나눠서 쨔아함! ( this.out ==  "더워요")
        if (this.out == "1_#include <stdio.h>\nint main(){\n\n   {int temp = 45;} \n\n   if(temp>30){\n      printf(\"더워요\");\n   }\n   else{\n      printf(\"추워요\");\n   }\n}"){
            console.log("===stage2 성공===");
            this.out = "";
            this.mission1 = undefined;
            this.mission2 = true;
            this.stage2_3_1();  
        }
        else if (isErr){
            console.log("===stage2 실패===");
            this.out = "";
         
            this.stage2_4_1(); 
       
        }

        this.player.update();
        this.inventory.update(this);
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
            this.item[this.item.length] =  'printf';  
            this.item[this.item.length] =  'if';   
            this.dropzon_su = 3; // draganddrop.js안에 코드조각 같은거 한 개만 생성하게 하는데 필요
            
            this.dropzone1_x = 805; // 드랍존 x좌표 (플레이어 따라 이동하는데 필요)
            this.dropzone2_x = 895;
            this.dropzone3_x = 828;

            this.draganddrop_1 = new DragAndDrop(this, this.dropzone1_x, 231, 80, 25).setRectangleDropZone(80, 25).setName("1");
            this.draganddrop_2 = new DragAndDrop(this, this.dropzone2_x, 231, 80, 25).setRectangleDropZone(80, 25).setName("2");
            this.draganddrop_3 = new DragAndDrop(this, this.dropzone3_x, 259, 80, 25).setRectangleDropZone(80, 25).setName("3");

            this.invenPlus = false;
        }
        

        if(this.invenPlus2) {
            console.log('inven2')
            this.item[this.item.length] =  'while';  
            this.dropzon_su = 3; // draganddrop.js안에 코드조각 같은거 한 개만 생성하게 하는데 필요
            
            this.dropzone1_x = 805; // 드랍존 x좌표 (플레이어 따라 이동하는데 필요)
            this.dropzone2_x = 895;
            this.dropzone3_x = 828;

            this.draganddrop_1 = new DragAndDrop(this, this.dropzone1_x, 231, 80, 25).setRectangleDropZone(80, 25).setName("1");
            this.draganddrop_2 = new DragAndDrop(this, this.dropzone2_x, 231, 80, 25).setRectangleDropZone(80, 25).setName("2");
            this.draganddrop_3 = new DragAndDrop(this, this.dropzone3_x, 259, 80, 25).setRectangleDropZone(80, 25).setName("3");

            this.invenPlus2 = undefined;
        }

        if(this.draganddrop_1!=undefined) this.draganddrop_1.update(this);
        if(this.draganddrop_2!=undefined) this.draganddrop_2.update(this);
        if(this.draganddrop_3!=undefined) this.draganddrop_3.update(this);

        if(this.key1.isDown) {
            console.log('맵이동');
            this.scene.sleep('second_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('second_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }
        if(this.key4.isDown) {
            console.log('맵이동');
            this.scene.sleep('second_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fourth_stage");
        }
        if(this.key5.isDown) {
            console.log('맵이동');
            this.scene.sleep('second_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fifth_stage");
        }
        if(this.key6.isDown) {
            console.log('맵이동');
            this.scene.sleep('second_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("sixth_stage");
        }

        
        /** 미션1 안끝났는데 넘어가려고 할 때 **/
        /*
        if(!this.mission1Complete && this.player.player.x >= 1100) {
            if(this.cantGoFarther) {
                this.cantGoFarther = false;
                this.player.playerPaused = true;
                var seq = this.plugins.get('rexsequenceplugin').add(); 
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.stage2_5, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                }, [], this); 
            }   
         }
        else this.cantGoFarther = true;
        */

        if(this.mission1Complete) {
            this.stage2_6()
            this.mission1Complete = undefined;
        }

        if(1300 <= this.player.player.x && this.player.player.x <= 1350) {
            if(this.firstTalk) {
                this.playerPaused = true;
                this.firstTalk = undefined;
                this.stage2_7();
            }

        }
    }

    complied(scene,msg) { //일단 코드 실행하면 무조건 실행된다.
        //complied를 호출하는 코드가 command의 constructure에 있음, constructure에서 scene으로 zero_stage을 받아왔었음. 그래서??? complied를 호출할때 인자로 scene을 넣어줬음.
        var textBox = scene.add.image(0,400,'textbox').setOrigin(0,0); 
        var script = scene.add.text(textBox.x + 200, textBox.y +50, msg, {
        fontFamily: 'Arial', 
         fill: '#000000',
         fontSize: '30px', 
         wordWrap: { width: 450, useAdvancedWrap: true }
        }).setOrigin(0,0);

        var playerFace = scene.add.sprite(script.x + 600 ,script.y+50, 'face', 0);

        scene.input.once('pointerdown', function() {
            textBox.setVisible(false);
            script.setVisible(false);
            playerFace.setVisible(false);

            //scene.intro4();
        }, this);
    }   


    stage2_1() {
        this.time.delayedCall( 1000, () => { 
            var seq = this.plugins.get('rexsequenceplugin').add(); 
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage2_1, this.dialog)
            .start();
            seq.on('complete', () => {
           //     this.npc.setFlipX(true);
                this.exclamMark.setVisible(true);
                this.exclamMark.play('exclam');
                this.time.delayedCall( 1000, () => { this.stage2_2_1() }, [] , this);
                });   
            }, [], this);  
    }
    stage2_2_1() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_2_1, this.dialog)
        .start();
        seq.on('complete', () => {
            this.stage2_2_2();
        });     
    }

    stage2_2_2() {
        this.player.player.setVelocityX(-300);
        this.cameras.main.shake(500, 0.01);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_2_2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.stage2_2_3();
        });     
    }

    stage2_2_3() {
        this.cameras.main.shake(500, 0.01);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_2_3, this.dialog)
        .start();
        seq.on('complete', () => {
            this.stage2_2_4();
        });     
    }

    stage2_2_4() {
        this.cameras.main.shake(500, 0.01);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_2_4, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false;
        });     
    }

    stage2_3_1() { //미션 성공
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_3_1, this.dialog)
        .start();
        seq.on('complete', () => {
            this.time.delayedCall( 1500, () => { //1.5초간 옷입고
                this.npc7.setFlipX(true);
                this.npc7.setVisible(true);
                
                this.npc7.play('npc_hot_walk',true);//걸어감
                this.npc7.setVelocityX(-100); 
                this.cafe.setVisible(true); 

                this.time.delayedCall( 2000, () => { //2초간 걷다가 멈춤.
                    this.npc7.anims.stop();
                    this.npc7.setVelocityX(0); 
                    this.stage2_3_2();
                 }, [] , this); 
             }, [] , this);    
        
        });  
    }
    stage2_3_2() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_3_2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.mission1Complete = true;
            //this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });     
    }

    stage2_4_1() {  //미션 실패. 산타복
       
        var seq = this.plugins.get('rexsequenceplugin').add(); 
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_4_1, this.dialog)
        .start();
        seq.on('complete', () => {
            this.time.delayedCall( 1500, () => { //1.5초간 옷입고
                this.npc7.setFlipX(true);
                this.npc7.setVisible(true);
                
                this.npc7.play('npc_cold_walk',true);//걸어감
                this.npc7.setVelocityX(-100); 
                this.cafe.setVisible(true); 

                this.time.delayedCall( 2000, () => { //2초간 걷다가 멈춤.
                    this.npc7.anims.stop();
                    this.npc7.setVelocityX(0); 
                    this.stage2_4_2();
                 }, [] , this); 
             }, [] , this);    
        
        });   
          
    }
    stage2_4_2() {  
        this.time.delayedCall( 1000, () => {  //걸어나오는 모션뒤, 2초간 멈춤
            var seq = this.plugins.get('rexsequenceplugin').add(); 
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage2_4_2, this.dialog)
            .start();
            seq.on('complete', () => {
                this.npc7.setFlipX(false);
                this.npc7.play('npc_cold_walk',true);
                this.npc7.setVelocityX(+100); //걸어감
                
                this.time.delayedCall( 2000, () => { //2초간 걷다가 
                    this.npc7.anims.stop();
                    this.npc7.setVelocityX(0); 
                    this.cafe.setVisible(false); //다시 할아버지 카페에 앉아있게
                    this.npc7.setVisible(false);
                }, [] , this);
             });   
            }, [], this);  
    }
 
    stage2_6() {
        this.player.playerPaused = true;

        this.cry.setVisible(true);
        this.cry.play('shake');

        this.exclamMark.x = this.player.player.x;
        this.exclamMark.setVisible(true);
        this.exclamMark.play('exclam');

        var seq = this.plugins.get('rexsequenceplugin').add(); 
        this.time.delayedCall( 300, () => {
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage2_6, this.dialog)
            .start();
            seq.on('complete', () => {
                this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
            });     
        }, [] , this);
        
    }

    stage2_7() {
        this.player.playerPaused = true;
        this.npc6.setFlipX(true);
        this.exclamMark.setVisible(true);
        this.exclamMark.x = this.npc6.x;
        this.exclamMark.play('exclam');
        var seq = this.plugins.get('rexsequenceplugin').add(); 
        this.time.delayedCall( 500, () => {
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage2_7, this.dialog)
            .start();
            seq.on('complete', () => {
                this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
                this.npc6.setFlipX(false);
                this.tweens.add({
                    targets: this.cameras.main,
                    x: -100,
                    duration: 1000,
                    ease: 'Linear',
                    repeat: 0,
                    onComplete: ()=>{
                        this.time.delayedCall( 1000, () => {
                            this.npc6.setFlipX(true);
                            this.tweens.add({
                                targets: this.cameras.main,
                                x: 0,
                                duration: 500,
                                ease: 'Linear',
                                repeat: 0,
                                onComplete: ()=>{
                                    this.stage2_8();
                                }
                            }, this);
                        }, [] , this);
                    }
                }, this);
            });     
        }, [] , this);
    }


    stage2_8() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_8, this.dialog)
        .start();
        seq.on('complete', () => {
            this.stage2_9();
        });     
    }

    
    stage2_9(){
        var itemget = this.add.image(700,0,'itemGet').setOrigin(0.0);
        var itemText = this.add.text(1200,270,'While',{
        font: "30px Arial Black", fill: "#000000" 
        }).setOrigin(0,0);
        this.time.delayedCall( 1000, () => { 
            this.tweens.add({
                targets: [itemget, itemText],
                alpha: 0,
                duration: 2000,
                ease: 'Linear',
                repeat: 0,
                onComplete: ()=>{
                    this.invenPlus2 = true;
                    itemget.destroy();
                    itemText.destroy();
                    this.playerPaused = false;
                }
            }, this);
        }, [] , this);
       
    }
}

