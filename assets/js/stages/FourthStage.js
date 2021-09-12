import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";
import ThirdStage from "./ThirdStage.js";
var stage;
var droppedText; //드랍된 텍스트 무엇인지 판별할때 gameobject._text 값 저장하는 용으로 쓰임
var graphics; //퀴즈 넘어갈때마다 드랍존 지워야 해서 전역으로 뺐음
var inZone4_1;

export default class FourthStage extends Phaser.Scene {   
    constructor(){ 
        super("fourth_stage"); //identifier for the scene
    }

    preload() {
        /***  stage값 가져오기 ***/ //preload에서 갖고와야함!!!
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/stage/check', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();

        xhr.addEventListener('load', function() {
        var result = JSON.parse(xhr.responseText);
        console.log("======== 현재 스테이지는 : " + result.stage + " ========")
        stage = result.stage;
        });

        this.load.image("stage4_tiles", "./assets/images/stage4/map_stage4.png");
        this.load.tilemapTiledJSON("fourth_stage", "./assets/fourth_stage.json");
    }
    
    create () {
        this.msg="";

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
        this.zone4_1 = this.physics.add.staticImage(30, 420).setSize(100,160);

        /*문 열리는 거*/
        this.anims.create({
            key: "open",
            frames: this.anims.generateFrameNumbers('door',{ start: 0, end: 3}), 
            frameRate: 1,
            repeat: 0,
        });
        this.door = this.add.sprite(1300 ,500,'door').setOrigin(0,1);
        //this.door.play('open');

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 430);

        /*** npc 만들기 ***/
        this.anims.create({
            key: "devil_touch_phone2",
            frames: this.anims.generateFrameNumbers('npc_devil2',{ start: 4, end: 5}), 
            frameRate: 2,
            repeat: -1,
        });

        this.devil = this.physics.add.sprite(910 ,430,'npc_devil2');
        this.devil.setFlipX(true);
        this.devil.play('devil_touch_phone2');

        this.anims.create({
            key: "crying",
            frames: this.anims.generateFrameNumbers('npc9',{ start: 0, end: 1}), 
            frameRate: 2,
            repeat: -1,
        });
        this.npc9 = this.add.sprite(530 ,500,'npc9').setOrigin(0,1);
        this.npc9.setScale(1.1);
        this.npc9.play('crying');

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

        this.pressX = this.add.text(this.devil.x-50, this.devil.y-130, 'press X to\nattemp the test', {
            fontFamily: ' Courier',
            color: '#ffffff',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });

        this.pressXDoor = this.add.text(0, 330, 'press X', {
            fontFamily: ' Courier',
            color: '#ffffff',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });

        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/10, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.devil, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.player.player, this.wall);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        this.stage_text=this.add.image(this.worldView.x+1100, 0, 'stage4_text').setOrigin(1,0);

        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "fourth_stage");


        //quest box 이미지 로드
        this.questbox = this.add.image(0,500,'quest_box').setOrigin(0,0);
        //quest text
        this.quest_text1 = this.add.text(this.questbox.x+430, this.worldView.y+540, '악마에게 말을 걸자.', {
            font:'25px',
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);
        this.quest_text2 = this.add.text(this.questbox.x+430, this.worldView.y+540, '도어락의 비밀번호의 값을 구하자.', {
            font:'25px',
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        this.questbox.setVisible(false);
        this.quest_text1.setVisible(false);
        this.quest_text2.setVisible(false);

        //help icon
        this.help_icon=this.add.image(this.questbox.x+870,535,'help_icon').setOrigin(0,0).setInteractive();
        this.help_box=this.add.image(this.help_icon.x-418,215,'help_box').setOrigin(0,0);
        
        //help text
        this.help_text=this.add.text(this.help_box.x+30, this.help_box.y+30, "hint : 스테이지 4 힌트====================================", {
            font:'20px',
            fontFamily: ' Courier',
            color: '#000000',
            wordWrap: { width: 500, height:230, useAdvancedWrap: true },
        }).setOrigin(0,0);

        this.help_icon.setVisible(false);
        this.help_box.setVisible(false);
        this.help_text.setVisible(false);

        this.help_icon.on('pointerover', function(){
            this.help_box.setVisible(true);
            this.help_icon.setTint(0x4A6BD6);
            this.help_text.setVisible(true);
            
        },this);
        this.help_icon.on('pointerout', function(){
            this.help_box.setVisible(false);
            this.help_text.setVisible(false);
            this.help_icon.clearTint();
        },this);


        /** 플레이어 위치 확인용 **/
        //this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
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

        //여기 코드 보자!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.dragAndDrop = new DragAndDrop(this, 0, 0, 0, 0);

        
        // 인벤창 팝업 여부를 나타내는 상태변수
        this.invenIn = false;
        
        /** 인벤토리 만들기 **/     
        this.inven = this.inventory.create(this);
        this.code_piece = new CodePiece(this); // 코드조각 클래스 호출 (inven보다 뒤에 호출해야 inven 위에 올라감)

        /** 드래그앤드랍 **/
        //드래그앤드롭으로 zone에 있는 코드 받아오기 위한 변수.
        // 지금 컴파일 테스트를 못해봐서 일단 주석처리해놓고 확이해보고 제대로 되면 이부분 삭제예정
        /*this.code_zone_1 = "           "; //11칸
        this.code_zone_2 = "           ";
        this.code_zone_3 = "           ";
        this.code_zone_4 = "           ";
        this.code_zone_5 = "           ";
        this.code_zone_6 = "           ";*/
        
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
         "int main(){\n" +
         "\u00a0\u00a0\u00a0int password = 0;\n" +
         "\u00a0\u00a0\u00a0"+"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0(int i=10; i>0; i--) {\n" +
		 "\u00a0\u00a0\u00a0"+"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"+"(i%2==1){\n" +
		 "\u00a0\u00a0\u00a0"+"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"+"password += i;\n" +
		 "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0}\n" +
	     "\u00a0\u00a0\u00a0}\n" +
         "   printf(\"정답은 "+"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"+"\",password);\n" +
         "}"
 
         //코드 실행후 불러올 output값
         //this.correct_msg="정답은 25";

          /*window */
          this.correct_msg=
          "#include <stdio.h>\n" +
                 "int main(){\n" +
                 "   int password = 0;\n" +
                 "  "+ this.code_zone_1 +"(int i=10; i>0; i--) {\n" +
                 "      "+this.code_zone_2+" (i%2==1){\n" +
                 "          password += i;\n" +
                 "      }\n" +
                 "  }\n" +
                 "   printf(\"정답은 "+ this.code_zone_3 +"\",password);\n" +
                 "}"
 
 
        
         /* 시작 대사 */
         if(stage==6){//처음 들어왔을때
            this.cameras.main.fadeIn(1000,0,0,0);
            this.player.playerPaused = true;
            this.time.delayedCall(1000, () => {
                
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.stage4_0, this.dialog) //스테이지 4 들어가자마자 출력되는 대사
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                    this.questbox.setVisible(true);
                    this.quest_text1.setVisible(true);
                });
            }, [], this);

            //npc에게 말을 건 횟수(순차적 실행을 위함)
            this.talk_num=0

         }
         else if (stage==7){//악마 퀴즈 풀면, 관문은 연 상태. //이어하기를 대비해서 아이템 미리 넣어놔야함.
            this.tweens.add({
                targets: [this.wall],
                y:-400,
                duration: 3000,
                ease: 'Linear',
                repeat: 0,
                onComplete: ()=>{
                    
                }
            }, this);//벽 열기.

            //npc에게 말을 건 횟수(순차적 실행을 위함)
            this.talk_num=2

            //인벤에 넣기 (형식 지정자 조각)
            this.add_mini_inven();
            this.get_type_specifier();
        }
        else{//관문,도어락 퀘 모두 완료 => 무한반복 가능.
            this.tweens.add({
                targets: [this.wall],
                y:-400,
                duration: 3000,
                ease: 'Linear',
                repeat: 0,
                onComplete: ()=>{
                    
                }
            }, this);//벽 열기.

            //npc에게 말을 건 횟수(순차적 실행을 위함)
            this.talk_num=2

            //인벤에 넣기 (형식 지정자 조각)
            this.add_mini_inven();
            this.get_type_specifier();

            //******** 관문퀘1 에서 필요한 것들 *********/

            //문이 열리게. 
            this.door.setFrame(3);
        }

         
        

        stagenum = 4;

        this.cantalk=true;
        this.npcTalk = true; //npc랑 한번만 말하게 
        //this.firstTalk = true ;//악마 앞에서 x키 누를때 필요 =>=> talk_num으로 대체. 비슷하게는 function
        this.quiz1 = true;
        this.quiz2 = false;
        this.quiz3 = false;
        this.quiz4 = false;
        this.quizOver = false;
        this.doorlock = true; //문 앞에서 퀴즈 맞출때;

        this.code_on=false;

        this.codeComplied = false //컴파일 이후 말풍선이 출력됐는지 여부 => x키 눌러서 말풍선 없애는 용
        this.codeError=false    //컴파일 이후 말풍선이 출력됐는지 여부 => x키 눌러서 말풍선 없애는 용(error)
        
        this.function=0;    //도어락 미션 관련 함수의 순차적 실행을 위함

        //select 관련 함수 트리거 변수
        this.select_trigger=false;

        this.select_case0= ['도서관으로','다시 퀴즈 풀기']; //msgArr.length = 2
        this.finAnswer = { //주소
            answer: 0 //값
        };
    }

    update() {
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
                this.scene.switch('fifth_stage'); 

                this.doorlock = true;
                return;
            case 2: console.log('2의 선택지로 대답 했을때');//무한 반복퀘
                this.finAnswer.answer = 0;
                this.stage4_7();
        
                
                return;  
        }
    }

        this.player.update();
        this.inventory.update(this);
        this.command.update(this);
        if(this.unique_code_piece != undefined) this.unique_code_piece.onoffwithcommand(this, this.invenIn); // 코드조각 코드앱 따라가도록
        
        //퀘스트 박스 및 텍스트 관련 코드
        if(this.questbox.visible==true){
            this.questbox.x=this.worldView.x+30;
            this.quest_text1.x=this.questbox.x+430;
            this.quest_text2.x=this.questbox.x+430;
            this.help_icon.x=this.worldView.x+870;
            this.help_box.x=this.help_icon.x-418;
            this.help_text.x=this.help_box.x+30;
        }

        //stage num
        this.stage_text.x=this.worldView.x+1100;


        //console.log('droppedText:',droppedText);

        /** 현재 퀴즈따라서 컴파일 내용 바꿔주기 (퀴즈 틀리고 맞출때마다 플레이어 말풍선으로 컴파일 내용 뜨는 거 하고싶음)**/
            //console.log('퀴즈바뀜');

            if (this.code_on){
                // 4_stage의 앱에 들어가는 코드
                this.app_code_text =
                "#include <stdio.h>\n" +
                "int main(){\n" +
                "\u00a0\u00a0\u00a0int password = 0;\n" +
                "\u00a0\u00a0\u00a0"+"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0(int i=10; i>0; i--) {\n" +
                "\u00a0\u00a0\u00a0"+"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"+"(i%2==1){\n" +
                "\u00a0\u00a0\u00a0"+"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"+"password += i;\n" +
                "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0}\n" +
                "\u00a0\u00a0\u00a0}\n" +
                "   printf(\""+"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"+"\",password);\n" +
                "}"

                this.contenttext =
                "#include <stdio.h>\n" +
                "int main(){\n" +
                "   int password = 0;\n" +
                "  "+ this.code_zone_1 +"(int i=10; i>0; i--) {\n" +
                "      "+this.code_zone_2+" (i%2==1){\n" +
                "          password += i;\n" +
                "      }\n" +
                "  }\n" +
                "   printf(\"정답은 "+ this.code_zone_3 +"\",password);\n" +
                "}"

            }else {
                this.contenttext = "";
                this.app_code_text = "";
            }


        /* 퀴즈 정답맞추기 */
        if(this.quiz1 && droppedText == '%d' ) {
            this.quiz1 = false;
            this.quiz2 = true;
            droppedText = undefined;
            
            this.time.delayedCall(1000,() => {
                this.dragAndDrop.reset_before_mission(this);
                this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
                this.stage4_q_2()
            },[],this);
                
        }
        else if(this.quiz1 && droppedText != undefined ) {//%d가 드랍된 게 아니라면 
            this.dragAndDrop.reset_before_mission(this);
            this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
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
                this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
                this.stage4_q_3()
            },[],this);
        }
        else if(this.quiz2 && droppedText != undefined ) {//%d가 드랍된 게 아니라면 
            this.dragAndDrop.reset_before_mission(this);
            this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
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
                this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
                this.stage4_q_4()
            },[],this);
        }
        else if(this.quiz3 && droppedText != undefined ) {//%d가 드랍된 게 아니라면 
            this.dragAndDrop.reset_before_mission(this);
            this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
            this.dialog.visible(false);
            this.stage4_quiz_3(); //다시 드랍 실행하기
            droppedText = undefined;
        }

        if(this.quiz4 && droppedText == '%f' ) {
            this.quiz4 = false;
            droppedText = undefined;
            this.quizOver = true;
            this.time.delayedCall(1000,() => {
                this.dragAndDrop.reset_before_mission(this);
                this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
                if(stage==6){//처음 퀘스트 완료
                    this.stage4_5()
                }else this.stage4_10() //반복으로 퀘 완료
               
            },[],this);
        }
        else if(this.quiz4 && droppedText != undefined ) {//%d가 드랍된 게 아니라면 
            this.dragAndDrop.reset_before_mission(this);
            this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
            this.dialog.visible(false);
            this.stage4_quiz_4(); //다시 드랍 실행하기
            droppedText = undefined;
        }
        

        this.player.update();
        this.inventory.update(this);
        this.command.update(this);
        this.code_piece.update(this);
        if(this.unique_code_piece != undefined) this.unique_code_piece.update(this);
        if(this.mini_inventory!=undefined) this.mini_inven_update();

        if(this.draganddrop!=undefined) this.draganddrop.update(this);
        if(this.draganddrop_1!=undefined) this.draganddrop_1.update(this);
        if(this.draganddrop_2!=undefined) this.draganddrop_2.update(this);
        if(this.draganddrop_3!=undefined) this.draganddrop_3.update(this);

        if(this.dropPlus){

            this.dropzone1_x = 814; // 드랍존 x좌표 (플레이어 따라 이동하는데 필요)
            this.dropzone2_x = 835;
            this.dropzone3_x = 885;
            this.draganddrop_1 = new DragAndDrop(this, this.dropzone1_x, 175, 80, 25).setRectangleDropZone(80, 25).setName("1");
            this.draganddrop_2 = new DragAndDrop(this, this.dropzone2_x, 205, 80, 25).setRectangleDropZone(80, 25).setName("2");
            this.draganddrop_3 = new DragAndDrop(this, this.dropzone3_x, 315, 80, 25).setRectangleDropZone(80, 25).setName("3");

            this.dropPlus = false;
        }
                
           /* 플레이어 위치 알려줌
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;
*/

         //마우스 위치 알려줌 
        this.mouseCoord.setText([
            '마우스 위치',
            'x:' + this.input.mousePointer.x + this.worldView.x,
            'y:' + this.input.mousePointer.y,
        ]);
        this.mouseCoord.x = this.worldView.x + 900;
        this.mouseCoord.y = this.worldView.y + 500;


        /* 아이템 얻기 */
        if(this.player.player.x >=this.npc9.x -100 && this.npc9.x +100 >= this.player.player.x && stage == 6){
            if(this.npcTalk) { //유황불에 태워버려요
                this.npcTalk = undefined;
                this.player.playerPaused = true;
                this.stage4_1();
                console.log('대사 몇번나오니');
            }
        }


        /* 시험 시작! *///악마한테 말걸때.
        if(this.player.player.x >=this.devil.x -150 && this.devil.x +150 >= this.player.player.x&&this.cantalk){
            this.pressX.setVisible(true);

            if(this.keyX.isDown&&this.talk_num==0) {// 악마와 대화 1
                if(this.cantalk){
                    this.cantalk=false;
                    //devil에게 처음 말을 걸었을 때(퀴즈 해결 전)
                    this.devil.anims.stop();
                    this.devil.setFrame(1);
                
                    this.player.playerPaused = true;
                    this.questbox.setVisible(false);
                    this.quest_text1.setVisible(false);
                    this.stage4_0_1();

                    this.talk_num++;
                }
            }else if(this.keyX.isDown&&this.talk_num==1){
                //devil에게 말을 건 이후에 또 말을 걸 때
                if(this.cantalk){
                    this.cantalk=false;
                    this.devil.anims.stop();
                    this.devil.setFrame(1);
                
                    this.player.playerPaused = true;
                    this.stage4_8();

                    this.talk_num++; //second talk 악마 말하기
                    
                }
            }else if (this.keyX.isDown&&this.talk_num==2){//무한 반복 퀘스트
                if(this.cantalk){
                    this.cantalk=false;
                    this.player.playerPaused = true;
                    this.stage4_9();
                }
            }
           
        }
        else this.pressX.setVisible(false);

        /*두번째 관문*/
        if(this.player.player.x >= 1400 && 1600 >= this.player.player.x &&this.doorlock){
            this.pressXDoor.setVisible(true);
            this.pressXDoor.x = this.player.player.x-30;
            this.pressXDoor.y = this.player.player.y-100;
            if(this.keyX.isDown){
                
                    this.doorlock = false;

                    this.player.playerPaused=true;
                    //this.player.player.setFlipX(false);
                    //this.player.playerPaused = true;
                    //this.get_type_specifier();
                    if(stage>=8){//도어락 퀘 완료후, 나갈 수 있음.
                        this.scene.run('selection',{ msgArr: this.select_case0, num: this.select_case0.length, finAnswer: this.finAnswer });
                        
                       // this.scene.switch('fifth_stage'); 
                    }
                    else{//도어락 퀘 첫번째, 완료전.
                        this.stage4_6();
                        
                    }
                    
                
            }
        }
        else this.pressXDoor.setVisible(false);

        if(this.function==1){ //도어락 성공!
            this.stage4_11();
            this.function=0;
        }else if(this.function==2){//도어락 => 답은 맞지만 너무 멀리서.
            this.stage4_12();
            this.function=0;
        }else if(this.function==3){ //도어락 퀘 무한반복 성공시
            this.stage4_13();
            this.function=0;
        }

        if(this.codeComplied) { 
            console.log('컴파일 사라지는 용의 x키');
            this.codeComplied = false;

            if(this.msg==this.correct_msg){//답은 맞음
                this.textBox.setVisible(false);
                this.script.setVisible(false);
                
                if(this.player.player.x>1300&&this.player.player.x<1700&&stage==7){//도어락 첫 성공
                    this.function=1;
                }else if(this.player.player.x>1300&&this.player.player.x<1700 &&stage>=8){//도어락 무한반복 성공!
                    this.function=3;
                }else{//너무 멀리서 했을시
                    this.function=2;
                }
                
            }else{
            }
        }

        if(this.codeError && this.keyX.isDown) { 
            console.log('Error 사라지는 용의 x키');
            this.codeError = false;

            this.textBox.setVisible(false);
            this.script.setVisible(false);
            this.playerFace.setVisible(false);
            this.player.playerPaused=false;
            
        }

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

        /* 바운더리 정하기 */
       this.physics.world.setBounds(0, 0, 1850, 600);
       this.player.player.body.setCollideWorldBounds()

    }

    get_type_specifier() {
        console.log('get_type_specifier 함수 호출');
        this.unique_codepiece_string_arr = [];
        this.unique_codepiece_string_arr[this.unique_codepiece_string_arr.length] = '%d';
        this.unique_codepiece_string_arr[this.unique_codepiece_string_arr.length] = '%s';
        this.unique_codepiece_string_arr[this.unique_codepiece_string_arr.length] = '%c';
        this.unique_codepiece_string_arr[this.unique_codepiece_string_arr.length] = '%f';
        
        this.unique_codepiece_x = 170;
        this.unique_codepiece_y = 400;
        this.unique_code_piece = new UniqueCodePiece(this, this.unique_codepiece_x, this.unique_codepiece_y); // 현스테이지에서만 사용하는 형식지정자 코드조각 생성, 코드조각의 x좌표, 시작 y좌표를 인자로 넣어줌
    }

    makeDropzone(x,y,width) {
        this.zone  = this.add.zone(x, y, width, 25).setRectangleDropZone(width, 25);
        console.log('드랍존 생성!',this.zone);
        this.graphics = this.add.graphics();
        graphics = this.graphics;
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(x - width / 2, y - 25 / 2, width, 25);

        this.input.once('dragenter', function (pointer, gameObject, dropZone) {
    
            //graphics.clear();
            graphics.lineStyle(2, 0x00ffff);
            graphics.strokeRect((x - width / 2, y - 25 / 2, width, 25));
        });
    
        this.input.once('dragleave', function (pointer, gameObject, dropZone) {
    
            //graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect((x - width / 2, y - 25 / 2, width, 25));
        });
    
        this.input.once('drop', function (pointer, gameObject, dropZone) {
            console.log("stagedrop");
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            //console.log(gameObject.x,gameObject.y)

            droppedText = gameObject._text;

            //퀴즈 정답유무는 update에
        });
    
        this.input.once('dragend', function (pointer, gameObject, dropped) {
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
    deleteDropzone() {
        this.graphics.destroy();
        this.zone.destroy();
    }


    stage4_1() { //유황불에 태워버려요
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_1, this.dialog)
        .start();
        seq.on('complete', () => {
            console.log('대사끝');
            this.player.playerPaused = false;
            this.add_mini_inven();
            this.get_type_specifier();
        });
    }
 
    stage4_0_1(){ //악마한테 처음 말걸면
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_0_1, this.dialog)
        .start();
        seq.on('complete', () => {
            this.stage4_quiz_1();
            this.quiz1 = true;
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
        this.makeDropzone(this.worldView.x + 385 ,75,30);
    }

//다음문제로 넘어가면 드랍존이 안뜸... zone이 안지워지고 남아있어서 그런가봄
//this.zone으로 바꾸면 x y 를 못들고오긴 하는데 그냥 끼워맞추면 될지도...?


    stage4_q_2(){
        this.deleteDropzone();
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
        this.makeDropzone(this.worldView.x + 500,75,20);

        seq.on('complete', () => {
        });

    }



    stage4_q_3(){
        this.deleteDropzone();
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
        this.makeDropzone(this.worldView.x + 344,75,30);
        seq.on('complete', () => {
        });
    }



    stage4_q_4(){
        this.deleteDropzone();
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
        this.makeDropzone(this.worldView.x + 390,75,20);
        seq.on('complete', () => {
        });
    }


    stage4_5() {//퀴즈 완료후 악마 대화 (퀴즈 끝나면 자동으로)
        //this.get_type_specifier();
        this.deleteDropzone();
        this.zone = undefined;
        this.dragAndDrop.reset_before_mission(this); //드랍존 리셋
        this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
        this.dragAndDrop = undefined; // 드랍존 들어가면 인벤,코드앱 따라 보이고 안 보이고 안 따라가는 거 해결위해 필요
        
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
                    this.devil.play('devil_touch_phone2');
                    this.cantalk=true;
                   // this.firstTalk=false;
                }
            }, this);

            /*** db에서 stage값을 1 증가시켜줌. ***/
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/stage', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send();

            xhr.addEventListener('load', function() {
            var result = JSON.parse(xhr.responseText);

                console.log("========stage 추가된다!: " + result.stage)
                stage = result.stage;          
            });

        });
    }

    stage4_6() {//도어락 퀘스트 대사
        
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_6, this.dialog)
        .start();
        seq.on('complete', () => {
            this.questbox.setVisible(true);
            this.quest_text2.setVisible(true);
            this.help_icon.setVisible(true);
            this.code_on=true;
            this.player.playerPaused = false;

            this.dropPlus = true;//드랍존 생성
        });
    }

    stage4_7(){//도어락 무한반복 퀘스트
        this.player.playerPaused = true;
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_7, this.dialog)
        .start();
        seq.on('complete', () => {
            this.questbox.setVisible(true);
            this.quest_text2.setVisible(true);
            this.help_icon.setVisible(true);
            this.code_on=true;
            this.player.playerPaused = false;

            this.dropPlus = true;//드랍존 생성
        });
    }

    stage4_8(){//악마 대화2번째
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_8, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false;
            //this.firstTalk=false;
            this.cantalk=true;
            this.devil.play('devil_touch_phone2');
        });
    }

    stage4_9(){//무한 반복 퀘
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_9, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = true;
            this.stage4_quiz_1();
        });
    }
    stage4_10(){//무한 반복 퀘 완료
        this.command.entire_code_button.input.enabled = true;//폰 다시 클릭가능하게

        this.deleteDropzone();
        this.zone = undefined;
        this.dragAndDrop.reset_before_mission(this); //드랍존 리셋
        this.unique_code_piece.reset_unique_codepiece_position(this); // 형식지정자 코드조각 원래 위치로 보내기
        this.dragAndDrop = undefined; // 드랍존 들어가면 인벤,코드앱 따라 보이고 안 보이고 안 따라가는 거 해결위해 필요
        
        this.dialog.visible(false);

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_10, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false;
            this.time.delayedCall( 2000, () => { 
                this.cantalk = true; //퀘스트 완료해야, 또 한번 더 가능하게
            });
        });
    }

    //doorlock 클리어 시
    stage4_11(){
        
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_11, this.dialog)
        .start();
        seq.on('complete', () => {  
            console.log("clear");
            this.player.playerPaused=false;
            this.questbox.setVisible(false);
            this.quest_text2.setVisible(false);
            this.help_icon.setVisible(false);

            this.code_on = false;
            this.draganddrop_1.reset_before_mission(this);//드랍존 지움.
            this.draganddrop_2.reset_before_mission(this)
            this.draganddrop_3.reset_before_mission(this)

            /*** db에서 stage값을 1 증가시켜줌. 도어락 퀘 완료. ***/ 
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/stage', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send();

            xhr.addEventListener('load', function() {
            var result = JSON.parse(xhr.responseText);

                console.log("========stage 추가된다!: " + result.stage)
                stage = result.stage;          
            });

            //문열리는 애니메이션
            this.door.play('open')
            //this.time.delayedCall( 3000, () => { this.door.anims.stop(); }, [] , this);
            //this.door.setFrame(3);

            this.time.delayedCall(3000,() => {//문 다 열려야 이동 가능하게.
                this.doorlock = true;
            },[],this);
        });
    }

    //답은 맞으나 너무 멀리에서 실행했을 시
    stage4_12(){
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_12, this.dialog)
        .start();
        seq.on('complete', () => {  
            this.player.playerPaused=false;
        });
    }

    //doorlock 클리어 시 (무한반복)
    stage4_13(){
        
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage4_13, this.dialog)
        .start();
        seq.on('complete', () => {  
            console.log("clear");
            this.player.playerPaused=false;
            this.questbox.setVisible(false);
            this.quest_text2.setVisible(false);
            this.help_icon.setVisible(false);

            this.code_on = false;
            this.draganddrop_1.reset_before_mission(this);//드랍존 지움.
            this.draganddrop_2.reset_before_mission(this)
            this.draganddrop_3.reset_before_mission(this)

          
            this.time.delayedCall(700,() => {
                this.doorlock = true;
            },[],this);
        });
    }

    complied(scene,msg) { //일단 코드 실행하면 무조건 실행된다.
        //complied를 호출하는 코드가 command의 constructure에 있음, constructure에서 scene으로 stage1을 받아왔었음. 그래서??? complied를 호출할때 인자로 scene을 넣어줬음.
        //console.log(scene.out);
        console.log("compiled");
        this.msg=msg;
        if(msg==this.correct_msg){
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

            this.tweens.add({
                targets: [this.textBox, this.script],
                alpha: 0,
                duration: 2000,
                ease: 'Power1',
                repeat: 0,
                onComplete: ()=>{  this.codeComplied = true; }
            }, this);
            this.player.playerPaused=true;    //플레이어 얼려두기

            //var playerFace = scene.add.sprite(script.x + 600 ,script.y+50, 'face', 0);
        }else{
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.intro_wrong, this.dialog)
            .start();
            seq.on('complete', () => {
                this.codeComplied = true;
            });
        }

    }

    printerr(scene){
        console.log("printerr");
        this.textBox = scene.add.image(this.worldView.x,400,'textbox').setOrigin(0,0); 
        this.script = scene.add.text(this.textBox.x + 200, this.textBox.y +50, "(코드에 문제가 있는 것 같아.)", {
                fontFamily: 'Arial', 
                fill: '#000000',
                fontSize: '30px', 
                wordWrap: { width: 450, useAdvancedWrap: true }
            }).setOrigin(0,0);
            this.player.playerPaused=true;

            this.playerFace = scene.add.sprite(this.script.x + 600 ,this.script.y+50, 'face', 0);
        
            this.codeError = true;
    }

    add_mini_inven() {
        console.log("here");
        this.mini_inventory = this.add.graphics();
        this.mini_inventory.lineStyle(3, 0xFFB569, 1);
        this.mini_inventory.fillStyle(0xFCE5CD, 1);

        this.mini_inventoryBody = this.mini_inventory.fillRoundedRect(160, 390, 60, 170, 10).strokeRoundedRect(160, 390, 60, 170, 10); // 인벤창
        this.mini_inventoryBody.y = 600; // 처음 안 보이도록
        this.mini_added = true; // 라이브러리 추가되었다는 걸 알려줘서 update에서 mini_inventory_update 함수 실행시켜줌
    }
    // 미니 인벤토리 삭제하는 함수
    delete_mini_inven() {
        this.mini_invenText.destroy();
        this.mini_inventory.destroy();
        this.mini_inventory_button.destroy();
        this.mini_added = false;
    }
    // 미니 인벤토리 버튼 누를때 열고 닫히게 하는 함수
    mini_inven_update() {
        this.mini_inventoryBody.x = this.worldView.x;
        if(this.invenIn) { // 열려있을 때
            //console.log("here", this.mini_inventoryBody.x, this.mini_inventoryBody.y);
            this.mini_inventoryBody.y = 0; // 와 왜 0으로 해야 그 위치로 가는거지?? 이유를 모르겠네.. 이거 setvisible로 처리해도 될 것 같긴한데 앞에 인벤 짤때 y좌표로 해놨길래 그냥 이것도 이렇게 해놨습니다!
        } else { // 닫혀있을 때
            //console.log("there", this.mini_inventoryBody.x, this.mini_inventoryBody.y);
            this.mini_inventoryBody.y = 600;
        }
        //this.unique_code_piece.updownwithinven(this,this.invenIn); // 코드조각 인벤 따라가도록
    }
}
