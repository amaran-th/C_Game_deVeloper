import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";

var tag_drop_state = false; // temp 가 드랍존에 들어가면 텍스트 오브젝트만 남도록
var tag_text = '';
var isDragging = false;

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
        this.waterWball = this.add.sprite( 1600, 630, 'waterWball', 0).setOrigin(0,1).setInteractive();
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
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        
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


        //코드 실행후 불러올 output값
        this.out = "";

        stagenum = 2;

        


        /** 변수들 드래그1 **/
        var variable = this.add.graphics();
        variable.lineStyle(3, 0xFFB569, 1);
        this.var_cage1 = variable.fillRoundedRect(0, 0, 75, 50, 10).strokeRoundedRect(0, 0, 75, 50, 10).fillStyle(0xFCE5CD, 1); //글자 밖 배경

        this.text_temp = this.add.text(this.temperature.x+50,200,'temp',{ 
            fontSize : '30px',
            fontFamily: ' Courier',
            color: '#FFB569'
        });
        this.text_temp.setInteractive();
        this.text_temp.setVisible(false);
        //var var_temp = this.add.container(100,400, [var_cage1,text_temp]).setSize(50,50); //temp 변수
        //var_temp.setInteractive(new Phaser.Geom.Rectangle(37, 25, 50, 50), Phaser.Geom.Rectangle.Contains); 
        //var_temp.setName("temp")
        //이거 37,25 안하면 왼쪽 위 꼭지점 부분 중심으로 50 사이즈로 클릭 범위 잡힘


        /** 변수들 드래그2 **/
        var variable2 = this.add.graphics();
        variable2.lineStyle(3, 0xFFB569, 1);
        this.var_cage2 = variable2.fillRoundedRect(0, 0, 75, 50, 10).strokeRoundedRect(0, 0, 75, 50, 10).fillStyle(0xFCE5CD, 1); //글자 밖 배경

        this.text_water = this.add.text(1600,550,'water',{ 
            fontSize : '28px',
            fontFamily: ' Courier',
            color: '#FFB569'
        });
        this.text_water.setInteractive();
        this.text_water.setVisible(false);

        /** 변수들 드래그3 **/
        var variable3 = this.add.graphics();
        variable3.lineStyle(3, 0xFFB569, 1);
        this.var_cage3 = variable3.fillRoundedRect(0, 0, 75, 50, 10).strokeRoundedRect(0, 0, 75, 50, 10).fillStyle(0xFCE5CD, 1); //글자 밖 배경

        this.text_ground = this.add.text(1000,500,'ground',{ 
            fontSize : '28px',
            fontFamily: ' Courier',
            color: '#FFB569'
        });
        this.text_ground.setInteractive();
        this.text_ground.setVisible(false);


        /** 마우스 올리면 태그 생기게! **/
        this.temperature.on('pointerover', function(){
            this.text_temp.setVisible(true);
            this.text_temp.x = this.worldView.x + this.input.mousePointer.x-10; // 이부분 있어야 드랍존에 들어간 상태에서도 새로 태그 생성 가능!
            this.text_temp.y = this.input.mousePointer.y-10;
        }, this);
        this.temperature.on('pointerout', function(){
            this.text_temp.setVisible(false);
        }, this);

        this.waterWball.on('pointerover', function(){
            this.text_water.setVisible(true);
            this.text_water.x = this.worldView.x + this.input.mousePointer.x-10;
            this.text_water.y = this.input.mousePointer.y-10;
        }, this);
        this.waterWball.on('pointerout', function(){
            this.text_water.setVisible(false)
        }, this);
        // this.text_ground 부분 없어도 되는 건가요?? 
        //특정 이미지에 마우스 가져다 대는게 아니라 마우스가 특정 위치로 이동하면 보이게 만든 거라 읍어도 됩니당 /오홍~굿!
        
        /** 드래그 활성화 **/
        this.input.setDraggable(this.text_temp);
        this.input.setDraggable(this.text_water);
        this.input.setDraggable(this.text_ground);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.setVisible(true);
            gameObject.x = dragX;
            gameObject.y = dragY;

            isDragging = true; //현재 드래그 하고 있는 중인지 디텍트하도록
        });
        this.input.on('dragend', function (pointer, gameObject,dropped) {
            if (!dropped) //이거 없으면 마우스 놓은 자리에 유지됨
            {
                gameObject.setVisible(false);
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;

                isDragging = false;
            }
        });
        this.input.on('drop', function (pointer, gameObject, dragX, dragY) {
            gameObject.setVisible(false); // 드랍하면 태그 사라지게 함
            tag_drop_state = true; // 드랍했다는 걸 알려줘서 update에서 드랍존에 들어갈 태그 조각 생성해 줌. 
            
            tag_text = gameObject._text; // 드랍존에 들어갈 태그 조각 문자열 알려줌

            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;

            isDragging = false;
            
        });
        


        this.mission1Complete = false;
        //this.mission1Complete = true;    //두번째 미션 먼저보고싶을때 활성화
        this.cantGoFarther = true; //플레이어가 1100 이상 움직였을 때 '한번만' 대사가 나오도록 
        this.firstTalk = true; //플레이어가 유치원생과 한 번만 대화할 수 있도록

        this.reset_state = false; // 태그조각 리셋 버튼과 연동하기 위함
        this.tag_in_dropzone = new Array(); // 드랍존에 들어가는 태그조각 배열 (플레이어 따라 이동하게 하기 위해서는 변수 하나만 하면 마지막 것만 들어와서 안 돼서 배열로 함)

        this.pointerUnderGround = true //태그가 번쩍거리지 않도록 setvisible true를 한번만 선언해줌

        this.mission1 = true; //미션 1을 진행할때 폰에 미션1용 코드가 뜨도록



        //초반 대사
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        this.stage2_1();
    }

    update() {
        //console.log(isDragging);
        //console.log('마우스 위치', this.input.mousePointer.x + this.worldView.x,' 땅 태그 위치:',this.text_ground.x  )

        if(this.input.mousePointer.y >= 500 && this.input.mousePointer.x + this.worldView.x <= 1500  && this.input.mousePointer.x + this.worldView.x >= this.worldView.x + 50 ) {
            if(this.pointerUnderGround){ //계속 불러와지면서 깜빡거리지 않도록
                this.text_ground.setVisible(true);
                this.pointerUnderGround = false
            }
            this.text_ground.x = this.input.mousePointer.x + this.worldView.x;
            this.text_ground.y = this.input.mousePointer.y - 15;
        }
        else if(!isDragging) {
           // this.text_ground.setVisible(false);
            this.pointerUnderGround = true;
        }

        if(this.input.mousePointer.y >= 500 &&  this.input.mousePointer.x + this.worldView.x <= 1500  && this.input.mousePointer.x + this.worldView.x >= this.worldView.x + 50 && isDragging) {
            if(this.pointerUnderGround){ //계속 불러와지면서 깜빡거리지 않도록
                this.text_ground.setVisible(true);
                this.pointerUnderGround = false
            }
        }

        if (tag_drop_state) { // 태그가 드랍됐으면 태그조각이 생성될 드랍존 위치를 파악해 태그조각을 생성해줌
            var tag_x; // 태그조각 생성될 x좌표
            var tag_y; // 태그조각 생성될 y좌표
            if (this.drop_state_1 == 0 && this.code_zone_1 == tag_text) { // 같은 문자열이더라도 드랍존에 이미 생성되어 있으면 해당 부분이 아닌 다른 드랍존에 생성하기 위해 this.drop_state 조건에 포함시켜 줌  
                //console.log("1");
                tag_x = this.draganddrop_1.x - (this.draganddrop_1.width / 2) + 5;
                tag_y = this.draganddrop_1.y - 15;
                this.drop_state_1 = 1;
            } else if (this.drop_state_2 == 0 && this.code_zone_2 == tag_text) {
                //console.log("2");
                tag_x = this.draganddrop_2.x - (this.draganddrop_2.width / 2) + 5;
                tag_y = this.draganddrop_2.y - 15;
                this.drop_state_2 = 1;
            } else if (this.drop_state_3 == 0 && this.code_zone_3 == tag_text) {
                //console.log("3");
                tag_x = this.draganddrop_3.x - (this.draganddrop_3.width / 2) + 5;
                tag_y = this.draganddrop_3.y - 15;
                this.drop_state_3 = 1;
            } else if (this.drop_state_4 == 0 && this.code_zone_4 == tag_text) {
                //console.log("4");
                tag_x = this.draganddrop_4.x - (this.draganddrop_4.width / 2) + 5;
                tag_y = this.draganddrop_4.y - 15;
                this.drop_state_4 = 1;
            } else if (this.drop_state_5 == 0 && this.code_zone_5 == tag_text) {
                //console.log("5");
                tag_x = this.draganddrop_5.x - (this.draganddrop_5.width / 2) + 5;
                tag_y = this.draganddrop_5.y - 15;
                this.drop_state_5 = 1;
            } else if (this.drop_state_6 == 0 && this.code_zone_6 == tag_text) {
                //console.log("6");
                tag_x = this.draganddrop_6.x - (this.draganddrop_6.width / 2) + 5;
                tag_y = this.draganddrop_6.y - 15;
                this.drop_state_6 = 1;
            }

            //console.log(this.drop_state_1 + " " + this.drop_state_2 + " " + this.drop_state_3 + " " + this.drop_state_4 + " " + this.drop_state_5 + " " + this.drop_state_6);
            //console.log(this.code_zone_1 + " " + this.code_zone_2 + " " + this.code_zone_3 + " " + this.code_zone_4 + " " + this.code_zone_5 + " " + this.code_zone_6);
            
            var tag_not_codepiece = true; // 텍스트 오브젝트 tag만 생성하고 codepiece는 생성하지 않기 위한 상태변수
            
            for (var code_piece_text of this.item){ 
                if (tag_text == code_piece_text) {
                    tag_not_codepiece = false;
                    break;
                }
                
            //console.log(tag_text + " vs " + code_piece_text);
            }

            if(tag_not_codepiece){ // 코드조각 아닌 태그만 텍스트 오브젝트 생성
               this.tag_in_dropzone[this.tag_in_dropzone.length] = this.add.text(tag_x, tag_y, tag_text, { font: "25px Arial Black", fill: "#eedfbe" }); // 배열에 태그조각 만들어 넣어줌
            }

            tag_drop_state = false; // 다른 태그 드랍할 때도 인식하게 하기 위해 false로 바꿔줌
        }
        
        if (this.worldView.x != this.preworldview_x) { // 플레이어가 이동하면 태그조각도 플레이어 따라 이동
            for (var i = 0; i < this.tag_in_dropzone.length; i++) { // 드랍된 드랍존 위치 유지하면서 이동
                // 조건 설명
                // (this.code_zone_1 == this.tag_in_dropzone[i]._text) : 태그조각 문자열과 해당 드랍존에 들어간 문자열이 같을 때 (어떤 드랍존에 위치해있는 지 알아야지 그 드랍존에 맞춰서 위치 이동 가능)
                // (this.tag_in_dropzone[i].x == this.draganddrop_1.x - (this.draganddrop_1.width / 2) + 5) : 같은 문자열일 경우 위의 조건에서 걸러지지 않음 -> 드랍존의 이전 위치와 비교해서 그 위치에 태그조각이 있을 경우를 추가 조건으로 줌
                if ((this.code_zone_1 == this.tag_in_dropzone[i]._text) && (this.tag_in_dropzone[i].x == this.draganddrop_1.x - (this.draganddrop_1.width / 2) + 5)) { 
                    this.tag_in_dropzone[i].x = this.worldView.x + this.dropzone1_x - (this.draganddrop_1.width / 2) + 5; // 현재 드랍존의 위치를 태그 조각에 반영 함.
                }
                if ((this.code_zone_2 == this.tag_in_dropzone[i]._text) && (this.tag_in_dropzone[i].x == this.draganddrop_2.x - (this.draganddrop_2.width / 2) + 5)) { // 같은 태그라도 플레이어 따라 다 이동해야하므로 elseif 말고 if로 함
                    this.tag_in_dropzone[i].x = this.worldView.x + this.dropzone2_x - (this.draganddrop_2.width / 2) + 5;
                }
                if ((this.code_zone_3 == this.tag_in_dropzone[i]._text) && (this.tag_in_dropzone[i].x == this.draganddrop_3.x - (this.draganddrop_3.width / 2) + 5)) { 
                    this.tag_in_dropzone[i].x = this.worldView.x + this.dropzone3_x - (this.draganddrop_3.width / 2) + 5;
                }
                if ((this.code_zone_4 == this.tag_in_dropzone[i]._text) && (this.tag_in_dropzone[i].x == this.draganddrop_4.x - (this.draganddrop_4.width / 2) + 5)) { 
                    this.tag_in_dropzone[i].x = this.worldView.x + this.dropzone4_x - (this.draganddrop_4.width / 2) + 5;
                }
                if ((this.code_zone_5 == this.tag_in_dropzone[i]._text) && (this.tag_in_dropzone[i].x == this.draganddrop_5.x - (this.draganddrop_5.width / 2) + 5)) { 
                    this.tag_in_dropzone[i].x = this.worldView.x + this.dropzone5_x - (this.draganddrop_5.width / 2) + 5;
                }
                if ((this.code_zone_6 == this.tag_in_dropzone[i]._text) && (this.tag_in_dropzone[i].x == this.draganddrop_6.x - (this.draganddrop_6.width / 2) + 5)) { 
                    this.tag_in_dropzone[i].x = this.worldView.x + this.dropzone6_x - (this.draganddrop_6.width / 2) + 5;
                }
                //console.log(i + "> " + this.tag_in_dropzone[i].x)
            }
            this.preworldview_x = this.worldView.x;
        }

        if (this.reset_state) { // 리셋 버튼 눌러졌으면 태그조각 드랍존에서 없애고, 태그조각 배열 비워주기
            //console.log("here");
            for (var i = 0; i < this.tag_in_dropzone.length; i++) {
                this.tag_in_dropzone[i].destroy();
            }
            this.tag_in_dropzone = [];
            this.reset_state = false;
        }

        if (this.codeapp_onoff_state == 0) { // 코드앱 켜지고 꺼짐에 따라 태그조각 보이고 안 보이고 하기
            for (var i = 0; i < this.tag_in_dropzone.length; i++) {
                this.tag_in_dropzone[i].setVisible(false);
            }
        } else {
            for (var i = 0; i < this.tag_in_dropzone.length; i++) {
                this.tag_in_dropzone[i].setVisible(true);
            }
        }

        //변수의 배경이 텍스트 따라다니도록
        this.var_cage1.x = this.text_temp.x;
        this.var_cage1.y = this.text_temp.y-10;
        this.var_cage1.visible = this.text_temp.visible;

        this.var_cage2.x = this.text_water.x;
        this.var_cage2.y = this.text_water.y-10;
        this.var_cage2.visible = this.text_water.visible;

        this.var_cage3.x = this.text_ground.x;
        this.var_cage3.y = this.text_ground.y-10;
        this.var_cage3.visible = this.text_ground.visible;


        if(this.mission1) {
             // Second_stage의 앱에 들어가는 코드
            this.app_code_text =
            "1_#include <stdio.h>\n" + 
            "int main(){\n" +
            "   {int temp = 45;} \n   " +
            "           " + "(" + "           " + ">30){\n      " + //if(Temp>30)
            "           " + "(\"더워요\");\n"  +//printf("더워요");
            "   }\n   else{\n      printf(\"추워요\");\n   }\n}"
            
            this.contenttext = 
            "1_#include <stdio.h>\n" + 
            "int main(){\n" +
            "   {int temp = 45;} \n   " +
            this.code_zone_1 + "(" + this.code_zone_2 + ">30){\n      " + //if(Temp>30)
            this.code_zone_3 + "(\"더워요\");\n"  +//printf("더워요");
            "   }\n   else{\n      printf(\"추워요\");\n   }\n}"
        }

        if(this.mission2) {
            this.contenttext =             
            "1_#include <stdio.h>\n" +
            "int main(){\n" +
            "   "+ this.code_zone_1 +"( "+this.code_zone_2+" <= " + this.code_zone_3 + " ) {\n" +
            "       " + this.code_zone_4 + " = " + this.code_zone_5 + " + 1;\n" +
            "   }\n" +
            "}"

             // Second_stage의 앱에 들어가는 코드
            this.app_code_text =
            "1_#include <stdio.h>\n" +
            "int main(){\n" +
            "              (             <=             )\n" +
            "   {\n"+
            "               =             + 1;\n" +
            "   }\n" +
            "}"
        }



        
        //실제로는 2가지에 나눠서 쨔아함! ( this.out ==  "더워요")
        if (this.out == "1_#include <stdio.h>\nint main(){\n   {int temp = 45;} \n   if(temp>30){\n      printf(\"더워요\");\n   }\n   else{\n      printf(\"추워요\");\n   }\n}"){
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

        if (this.out ==             "1_#include <stdio.h>\n" +
        "int main(){\n" +
        "   "+ "while" +"( "+"water"+" <= " + "ground" + " ) {\n" +
        "       " + "water" + " = " + "water" + " + 1;\n" +
        "   }\n" +
        "}"){
            console.log("===stage2 성공===");
            this.out = "";
            this.mission2 = undefined;

            this.stage2_10();
        }
        else if (isErr){
            console.log("===stage2 실패===");
            this.out = "";
       
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
            //console.log("here");
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

            this.reset_before_mission(); // 이전 미션의 드랍은 reset함

            this.item[this.item.length] =  'while';  
            this.dropzon_su = 5; // draganddrop.js안에 코드조각 같은거 한 개만 생성하게 하는데 필요
            
            this.dropzone1_x = 810;
            this.dropzone2_x = 900; // 드랍존 x좌표 (플레이어 따라 이동하는데 필요)
            this.dropzone3_x = 1020;
            this.dropzone4_x = 810;
            this.dropzone5_x = 900;
 
            this.draganddrop_1 = new DragAndDrop(this, this.dropzone1_x, 170, 80, 25).setRectangleDropZone(80, 25).setName("1");
            this.draganddrop_2 = new DragAndDrop(this, this.dropzone2_x, 170, 80, 25).setRectangleDropZone(80, 25).setName("2");
            this.draganddrop_3 = new DragAndDrop(this, this.dropzone3_x, 170, 80, 25).setRectangleDropZone(80, 25).setName("3");
            this.draganddrop_4 = new DragAndDrop(this, this.dropzone4_x, 230, 80, 25).setRectangleDropZone(80, 25).setName("4");
            this.draganddrop_5 = new DragAndDrop(this, this.dropzone5_x, 230, 80, 25).setRectangleDropZone(80, 25).setName("5");

            this.invenPlus2 = undefined;
        }

        if(this.draganddrop_1!=undefined) this.draganddrop_1.update(this);
        if(this.draganddrop_2!=undefined) this.draganddrop_2.update(this);
        if(this.draganddrop_3!=undefined) this.draganddrop_3.update(this);
        if(this.draganddrop_4!=undefined) this.draganddrop_4.update(this);
        if(this.draganddrop_5!=undefined) this.draganddrop_5.update(this);

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
        
        if(!this.mission1Complete && this.player.player.x >= 1100) {
            if(this.cantGoFarther) {
                this.cantGoFarther = false;
                this.player.playerPaused = true;
                var seq = this.plugins.get('rexsequenceplugin').add(); 
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.stage2_5, this.dialog) //할아버지의 부탁을 먼저 해결하자
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                }, [], this); 
            }   
         }
        else this.cantGoFarther = true;
        

        if(1300 <= this.player.player.x && this.player.player.x <= 1350) {
            if(this.firstTalk) {
                this.playerPaused = true;
                this.firstTalk = undefined;
                this.stage2_7();
            }

        }
    }
/*
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
    }   */
    complied(scene,msg) { //일단 코드 실행하면 무조건 실행된다.
        //complied를 호출하는 코드가 command의 constructure에 있음, constructure에서 scene으로 stage1을 받아왔었음. 그래서??? complied를 호출할때 인자로 scene을 넣어줬음.
        //console.log(scene.out);
        console.log("compiled");
        if(msg==scene.out){
            this.command.remove_phone(this);
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
                
                
            }else{
                this.textBox.setVisible(false);
                this.script.setVisible(false);
                this.playerFace.setVisible(false);
            }
            
        }, this);
    
    }

    printerr(scene){
        console.log("printerr");
        var textBox = scene.add.image(this.worldView.x,400,'textbox').setOrigin(0,0); 
            var script = scene.add.text(textBox.x + 200, textBox.y +50, "(코드에 문제가 있는 것 같아.)", {
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
            this.mission1Complete = true; //1100이상으로 계속 이동할 수 있도록
            this.stage2_6() //미션 2 시작
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
                //this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
                this.npc6.setFlipX(false);
                this.tweens.add({
                    targets: this.camera,
                    x: -100,
                    duration: 1000,
                    ease: 'Linear',
                    repeat: 0,
                    onComplete: ()=>{
                        this.time.delayedCall( 1000, () => {
                            this.npc6.setFlipX(true);
                            this.tweens.add({
                                targets: this.camera,
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
                    this.player.playerPaused = false;
                    this.invenPlus2 = true;
                    itemget.destroy();
                    itemText.destroy();
                    this.mission2 = true;
                }
            }, this);
        }, [] , this);
       
    }


    stage2_10() {
        //this.camera.x += 400;
        this.npc6.setFlipX(false);
        this.tweens.add({
            targets: this.waterWball,
            y: 600,
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            onComplete: ()=>{
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.stage2_10, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.stage2_11();
                });   
            }
        }, this);
    }

    stage2_11() {
        this.waterWball.destroy();
        this.water = this.add.sprite( 1600, 600, 'water', 0).setOrigin(0,1)
        this.water.play('water');

    }
 
    reset_before_mission() {
        this.draganddrop_1.reset_before_mission(this);
        this.draganddrop_2.reset_before_mission(this);
        this.draganddrop_3.reset_before_mission(this);
        for (var i = 0; i < this.tag_in_dropzone.length; i++) {
            this.tag_in_dropzone[i].destroy();
        }
        this.tag_in_dropzone = [];
        this.draganddrop_1 = undefined;
        this.draganddrop_2 = undefined;
        this.draganddrop_3 = undefined;
    }
}

