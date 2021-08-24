import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";
import ThirdStage from "./ThirdStage.js";


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

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, 800, spawnPoint.y);

        /*** npc 만들기 ***/
        this.anims.create({
            key: "devil_touch_phone",
            frames: this.anims.generateFrameNumbers('npc_devil',{ start: 4, end: 5}), 
            frameRate: 2,
            repeat: -1,
        });

        this.devil = this.physics.add.sprite(910 ,230,'npc_devil');
        this.devil.setFlipX(true);
        this.devil.play('devil_touch_phone');

        this.pressX = this.add.text(this.devil.x-50, this.devil.y-10, 'press X to\nattemp the test', {
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

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;


        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "fourth_stage");


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화  //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('fourth_stage'); 
            this.scene.run("minimap");
        },this);
***/
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

         //4_stage의 전체 코드
         this.contenttext = "" ; 

         // 4_stage의 앱에 들어가는 코드
         this.app_code_text =
         "#include <stdio.h>\n" +
         "int main(){\n\n" +
         "  for (int i=10; i>0; i--) {\n" +
		 "      if (i%2==1){\n" +
		 "          printf('%d',i);\n" +
		 "      }\n" +
	     "  }\n" +
         "}\n"

 
         //코드 실행후 불러올 output값
         this.out = "";


        stagenum = 4;

        console.log(this.devil.x);
        

        this.firstTalk = true ;//악마 앞에서 x키 누를때 필요
        this.quiz1 = true;
        this.quiz2 = false;
        this.quiz3 = false;
        this.quiz4 = false;
        this.quizOver = false;


        this.code_zone_1 = "           " //이거 어떻게 작동하는 건지 모르겠어서 일단 빈칸 만들기 위해 임시로 해둠
    }

    update() {

        if(this.quiz1) {
        this.contenttext = 
        "#include <stdio.h>\n" +
        "int main()  { printf('1 + "+ this.code_zone_1 +" = 4', 3 }"
        }

        if(this.quiz2) {
            this.contenttext = 
            "#include <stdio.h>\n" +
            "int main()  { printf('1 + "+ this.code_zone_1 +" = 4', 3 }"
        }

        if(this.quiz3) {
            this.contenttext = 
            "#include <stdio.h>\n" +
            "int main()  { printf('1 + "+ this.code_zone_1 +" = 4', 3 }"
        }
        
        if(this.quiz4) {
            this.contenttext = 
            "#include <stdio.h>\n" +
            "int main()  { printf('1 + "+ this.code_zone_1 +" = 4', 3 }"
        }
        
        if(this.quizOver) {
        this.contenttext =
        "#include <stdio.h>\n" +
        "int main(){\n\n" +
        "  "+ this.code_zone_1 +"(int i=10; i>0; i--) {\n" +
        "      "+this.code_zone_2+" (i%2==1){\n" +
        "          printf(\'"+ this.code_zone_3 +"\',i);\n" +
        "      }\n" +
        "  }\n" +
        "}\n"
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


        /* 시험 시작! */
        if(this.player.player.x >=this.devil.x -100 && this.devil.x +100 >= this.player.player.x ){
            this.pressX.setVisible(true);
            if(this.keyX.isDown){
                if(this.firstTalk) {
                    this.firstTalk = undefined;
                    this.player.playerPaused = true;
                    this.stage4_2();
                }
            }
        }
        else this.pressX.setVisible(false);


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

    }

    stage4_2() {
        console.log('대사 나오고 시험 시작하도록');
        this.dialog.loadTextbox(this);
        this.dialog.place(40,10);
        this.dialog.setFace(2);
        this.dialog.print(this.contenttext);
        this.draganddrop_1 = new DragAndDrop(this, 500, 100, 80, 25).setRectangleDropZone(80, 25).setName("1");
    }



}
