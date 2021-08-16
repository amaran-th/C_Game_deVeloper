import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";


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

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "second_stage" });
        
        const tileset = map.addTilesetImage("map_stage2", "stage2_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

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
        this.npc = this.physics.add.sprite(910 ,430,'npc_cold');
        this.npc.setVisible(false);

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        
        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.npc, this.worldLayer);
        
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

        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "second_stage");


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
        var item_text = 'if'
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

        //console.log('item 위치', this.itemicon.x);

        // 드래그앤드랍
        //드래그앤드롭으로 zone에 있는 코드 받아오기 위한 변수.
        this.code_zone_1 = "                ";
        this.code_zone_2 = "          ";
        this.code_zone_3 = "          ";
        //this.drag_piece = ['printf', 'if', 'else'];
        // 클래스 여러번 호출해도 위에 추가한 코드조각만큼만 호출되게 하기 위한 상태 변수
        this.code_piece_add_state = 0;
        // 드랍여부 확인(새로운 씬에도 반영 하기 위해 씬에 변수 선언 함)
        this.drop_state_1 = 0;
        this.drop_state_2 = 0;
        this.drop_state_3 = 0;
        
        this.draganddrop_1 = new DragAndDrop(this, 815, 198, 100, 25).setRectangleDropZone(100, 25).setName("1");
        this.draganddrop_2 = new DragAndDrop(this, 570, 20, 100, 25).setRectangleDropZone(100, 25).setName("2");
        this.draganddrop_3 = new DragAndDrop(this, 670, 20, 100, 25).setRectangleDropZone(100, 25).setName("3");

        //Second_stage의 전체 코드
        this.contenttext = "" ;

        //코드 실행후 불러올 output값
        this.out = "";

        stagenum = 2;

        //초반 대사
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        this.stage2_1();
        
    }

    update() {
        this.contenttext = 
            "2_#include <stdio.h> \n\nint main(){ \n\n  int Temp = 45;\n  if (Temp>30){\n" +
            "    printf(\"더워요\");\n  }\n" + //코드조각 
         //   "  else if (Temp>20){\n" +
         //   "    printf(\"적당해요\");\n  }\n" + //코드조각
            "  else {\n" + 
            "    printf(\"추워요\");\n  }\n}" //코드조각
        
        //실제로는 2가지에 나눠서 쨔아함! ( this.out ==  "더워요")
        if (this.out == "1_#include <stdio.h> \n\nint main(){ \n\n  int Temp = 45;\n  if (Temp>30){\n    printf(\"더워요\");\n  }\n  else {\n    printf(\"추워요\");\n  }\n}"){
            console.log("===stage2 성공===");
            this.out = "";

            this.stage2_3_1();  
        }
        else if (this.out == "2_#include <stdio.h> \n\nint main(){ \n\n  int Temp = 45;\n  if (Temp>30){\n    printf(\"더워요\");\n  }\n  else {\n    printf(\"추워요\");\n  }\n}"){
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
            this.inventory.invenSave(this, 'printf'); //인벤토리에 아이템 텍스트 추가
            this.inventory.invenSave(this, 'if');
            //his.inventory.invenSave(this, 'else');
            //this.intro2();
            this.invenPlus = false;
        }

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
                this.time.delayedCall( 1000, () => { this.stage2_2() }, [] , this);
                });   
            }, [], this);  
    }
    stage2_2() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
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
                this.npc.setFlipX(true);
                this.npc.setVisible(true);
                
                this.npc.play('npc_cold_walk',true);//걸어감
                this.npc.setVelocityX(-100); 
                this.cafe.setVisible(true); 

                this.time.delayedCall( 2000, () => { //2초간 걷다가 멈춤.
                    this.npc.anims.stop();
                    this.npc.setVelocityX(0); 
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
                this.npc.setFlipX(true);
                this.npc.setVisible(true);
                
                this.npc.play('npc_cold_walk',true);//걸어감
                this.npc.setVelocityX(-100); 
                this.cafe.setVisible(true); 

                this.time.delayedCall( 2000, () => { //2초간 걷다가 멈춤.
                    this.npc.anims.stop();
                    this.npc.setVelocityX(0); 
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
                this.npc.setFlipX(false);
                this.npc.play('npc_cold_walk',true);
                this.npc.setVelocityX(+100); //걸어감
                
                this.time.delayedCall( 2000, () => { //2초간 걷다가 
                    this.npc.anims.stop();
                    this.npc.setVelocityX(0); 
                    this.cafe.setVisible(false); //다시 할아버지 카페에 앉아있게
                    this.npc.setVisible(false);
                }, [] , this);
             });   
            }, [], this);  
    }
 
}
