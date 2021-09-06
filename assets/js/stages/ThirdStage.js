import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";

var inZone = false;

export default class ThirdStage extends Phaser.Scene {   
    constructor(){ 
        super("third_stage"); //identifier for the scene
    }

    preload() {
        /* 흔드는 플러그인 */
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshakepositionplugin.min.js';
        this.load.plugin('rexshakepositionplugin', url, true);

        //this.load.image("stage_tiles", "./assets/images/map_stage3.png");
        this.load.tilemapTiledJSON("third_stage", "./assets/third_stage.json");
    
    }
    
    create () {
        this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key4 = this.input.keyboard.addKey('FOUR');
        this.key5 = this.input.keyboard.addKey('FIVE');
        this.key6 = this.input.keyboard.addKey('SIX');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "third_stage" });
        
        const tileset = map.addTilesetImage("map_stage3", "stage3_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        /*** npc_chef 불러오기 ***/ 
        this.npc_chef = this.add.image(350,350,'npc_chef').setOrigin(0,0);
        this.npc_chef.setInteractive();

        /***bread 불러오기 */
        this.bread = this.add.image(370,250,'bread').setOrigin(0,0);
        this.full_bread_1 = this.add.image(50,151,'full_bread').setOrigin(0,0)
        this.full_bread_2 = this.add.image(200,151,'full_bread').setOrigin(0,0)
        this.bread.setVisible(false);
        this.full_bread_1.setVisible(false);
        this.full_bread_2.setVisible(false);

        /*** 오븐 이미지 불러오기 */
        this.oven = this.add.image(851,300,'oven').setOrigin(0,0).setInteractive();
        this.oven_open = this.add.image(851,300,'oven_open').setOrigin(0,0)
        this.oven_open.setVisible(false);

        /** 오븐 흔들리는 효과 **/
        this.oven.shake = this.plugins.get('rexshakepositionplugin').add(this.oven, {
            duration: 1000,
            magnitude: 3,
            mode: 'effect'
        })
        //.on('complete', function () {
        //    console.log('complete');
        //})

        this.ovenShake = setInterval(() => this.oven.shake.shake(), 2000); //1초 간격으로 흔들리게 함

        

        /*** 맵 이동 (문 이미지 불러오기) */
        this.zone = this.physics.add.staticImage(1210, 420).setSize(92,161)

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");
        
        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x - 120, 430);

        /* 맵이동 */
        this.physics.add.overlap(this.player.player, this.zone, function () {
            inZone = true;
        });
    
        //플레이어 위 pressX 생성해두기(door) => 빵집에서 stage3_0(바깥)으로,
        this.pressX_1 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        

        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        

        /*** 퀘스트 말풍선 애니메이션 */
        this.anims.create({
            key: "exclam",
            frames: this.anims.generateFrameNumbers('exp_exclam',{ start: 0, end: 4}), 
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        });
        
        this.exclamMark = this.add.sprite( 390, 320, 'exp_exclam', 0);
        this.exclamMark.setVisible(false);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        this.stage_text=this.add.image(this.worldView.x+1100, 0, 'stage3_text').setOrigin(1,0);

        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "third_stage");


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*
        // 미니맵버튼 활성화/ //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('third_stage'); 
            this.scene.run("minimap");
        },this);
        */

        // 인벤창 팝업 여부를 나타내는 상태변수
        this.invenIn = false;

        /** 아이템 만들기 **/ 
        this.itemicon = this.add.image(930,350,'item');
        var item_text = 'for';
        this.itemicon.setVisible(false); //오븐 눌러야지 아이템 보이게

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
        this.code_piece = new CodePiece(this); // 코드조각 클래스 호출 (inven보다 뒤에 호출해야 inven 위에 올라감)
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
        
        // 클래스 여러번 호출해도 위에 추가한 코드조각만큼만 호출되게 하기 위한 상태 변수
        this.code_piece_add_state = 0;
        // 드랍여부 확인(새로운 씬에도 반영 하기 위해 씬에 변수 선언 함)
        this.drop_state_1 = 0;
        this.drop_state_2 = 0;
        this.drop_state_3 = 0;
        this.drop_state_4 = 0;
        this.drop_state_5 = 0;
        this.drop_state_6 = 0;
        
        this.dropzone1_x = 805; // 드랍존 x좌표 (플레이어 따라 이동하는데 필요)
        this.dropzone2_x = 980;

        this.draganddrop_1 = new DragAndDrop(this, this.dropzone1_x, 200, 80, 25).setRectangleDropZone(80, 25).setName("1");
        this.draganddrop_2 = new DragAndDrop(this, this.dropzone2_x, 200, 80, 25).setRectangleDropZone(80, 25).setName("2");

        //Second_stage의 전체 코드
        this.contenttext = "" ;

        //Second_stage의 앱에 들어가는 코드
        this.app_code_text = "";
        
        
        //오븐 관련 => 오븐 누를시 열린 오븐 이미지 뜨고, 인벤토리에 for문 얻게 할거임
        this.oven_on = false; // 오븐이 열려있을때만 아이템 받을수있게 할거임
        

        //quest box 이미지 로드
        this.questbox = this.add.image(0,500,'quest_box').setOrigin(0,0);
        //quest text
        this.quest_text = this.add.text(this.questbox.x+430, this.worldView.y+540, '핑퐁씨에게 빵을 25개 만들어주자.', {
            font:'25px',
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        this.questbox.setVisible(false);
        this.quest_text.setVisible(false);

        //help icon
        this.help_icon=this.add.image(this.questbox.x+870,535,'help_icon').setOrigin(0,0).setInteractive();
        this.help_box=this.add.image(this.help_icon.x-418,215,'help_box').setOrigin(0,0);
        
        //help text
        this.help_text=this.add.text(this.help_box.x+30, this.help_box.y+30, "hint : 스테이지 3 힌트====================================", {
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

        //코드 앱에 텍스트 업데이트 시키는 변수
        this.code_on=false;

        //코드 실행 후 비교할 목표 텍스트(리눅스용/윈도우용)
        this.msg="";

        //his.correct_msg="bread=25";
        /* */
        this.correct_msg="#include <stdio.h>\n" + 
        "int main(){\n" +
        "   int bread=1;\n" +
        "   int i;\n"+
        "   " + this.code_zone_1 + "(int i=0; i" + this.code_zone_2 + "24; i++){\n" +
        "      bread=bread+1;\n" +
        "   }\n" +
        "   printf(\"bread=%d\",bread);\n"+
        "}"


        stagenum = 3;

        //초반 대사
        this.cameras.main.fadeIn(1000,0,0,0);
       this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
       this.stage3_1();

    this.breadGroup = this.physics.add.group();
    //this.breadGroup.friction.x = 0.5;
    this.physics.add.collider(this.breadGroup, this.worldLayer);
    this.physics.add.collider(this.player.player, this.breadGroup);
    this.physics.add.collider(this.breadGroup, this.breadGroup);
    
    this.codeComplied = false //컴파일 이후 말풍선이 출력됐는지 여부 => x키 눌러서 말풍선 없애는 용
    this.codeError=false    //컴파일 이후 말풍선이 출력됐는지 여부 => x키 눌러서 말풍선 없애는 용(error)
}

    update() {
        this.player.update();
        this.inventory.update(this);
        this.command.update(this);

        
        //퀘스트 박스 및 텍스트 관련 코드
        if(this.questbox.visible==true){
            this.questbox.x=this.worldView.x+30;
            this.quest_text.x=this.questbox.x+430;
            this.help_icon.x=this.worldView.x+870;
            this.help_box.x=this.help_icon.x-418;
            this.help_text.x=this.help_box.x+30;
        }

        //stage num
        this.stage_text.x=this.worldView.x+1100;

        if(this.code_on){
            this.contenttext = 
                "#include <stdio.h>\n" + 
                "int main(){\n" +
                "   int bread=1;\n" +
                "   int i;\n"+
                "   " + this.code_zone_1 + "(int i=0; i" + this.code_zone_2 + "24; i++){\n" +
                "      bread=bread+1;\n" +
                "   }\n" +
                "   printf(\"bread=%d\",bread);\n"+
                "}"
            this.app_code_text = 
                "#include <stdio.h>\n" + 
                "int main(){ \n" +
                "   int bread = 1; \n"+
                "   int i;	//반복자\n"+
                "   " +"           " + "(int i=0;i" + "            " + "24; i++){\n" +
                "      bread=bread+1;\n" +
                "   }\n" +
                "   printf(\"bread=%d\",bread);\n"+
                "}";
        }
      


        //정답일시, 나중에 this.out == "25" 이케 바꿔야함.
        /*
        if (this.out == "#include <stdio.h>\nint main(){ \n   {int bread = 1;} \n   for(int i=0; i<100; i++){\n      {bread} = {bread} + 1 ; \n   }\n   printf(\"%d\", {bread} );\n}"){
            console.log("===stage3 클리어!===");
            this.bread.setVisible(true);

            for(var i =0; i<=25; i++) {//나중에 25를 this.out (문자열 정수로 바꾸는 함수 사용) 으로 바꾸기
                (x => {
                    setTimeout(() => {
                        console.log('빵');
                        var bread = this.breadGroup.create(Phaser.Math.Between(this.player.player.x -100, this.player.player.x +100), 0, 'bread');
                        bread.setFrictionX(1); //이거 마찰인데... 안 먹히는 듯ㅠㅠ
                    },100*x) //이러면 1초 간격으로 실행됨
                  })(i)
            }
            //this.full_bread_1.setVisible(true);
            //this.full_bread_2.setVisible(true);
            this.out = "";

            //this.cameras.main.fadeIn(1000,0,0,0);
            this.time.delayedCall(3000, function() {
                this.exclamMark.setVisible(true);
                this.exclamMark.play('exclam');
                this.stage3_3();
            }, [], this);
        }
        */

        this.player.update();
        this.inventory.update(this);
        this.command.update(this);
        this.code_piece.update(this);

        
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;

        /** 오븐 근처에서 x키 누르면 오븐 열리게**/
        if(this.player.player.x <= this.oven.x + 100 && this.player.player.x >= this.oven.x) {
            //console.log('오븐근처')
            if(this.keyX.isDown) {
                this.oven_open.setVisible(true);
                this.oven_on = true;
                 /** 아이템 만들기 **/
                 if(this.beforeItemGet) {
                    this.itemicon.setVisible(true);
                 }
                 this.oven.destroy()
                 clearInterval(this.ovenShake) //오븐 반복적으로 흔들리게 하는거 멈춤
            }
        }

        /** 아이템 획득하는 경우 **/
        if (this.oven_on && this.beforeItemGet && this.player.player.x < this.itemicon.x+54 && this.itemicon.x < this.player.player.x) {
            this.beforeItemGet = false; //여기다가 해야 여러번 인식 안함

            this.itemicon.setVisible(false);
            this.itemget.x = this.worldView.x
            this.itemText.x = this.worldView.x + 530;
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
            codepiece_string_arr[codepiece_string_arr.length] = 'for';
            this.code_piece.add_new_stage_codepiece(this);
            
            //this.intro2();
            this.invenPlus = false;
        }

        if(this.draganddrop_1!=undefined) this.draganddrop_1.update(this);
        if(this.draganddrop_2!=undefined) this.draganddrop_2.update(this);


        if(this.codeComplied) { 
            this.codeComplied = false;
                if(this.msg==this.correct_msg){
                    console.log("===stage3 클리어!===");
                    this.textBox.setVisible(false);
                    this.script.setVisible(false);
                    this.bread.setVisible(true);
                    this.questbox.setVisible(false);
                    this.quest_text.setVisible(false);
                    this.help_icon.setVisible(false);
    
                    for(var i =0; i<=25; i++) {//나중에 25를 this.out (문자열 정수로 바꾸는 함수 사용) 으로 바꾸기
                        (x => {
                            setTimeout(() => {
                                console.log('빵');
                                var bread = this.breadGroup.create(Phaser.Math.Between(this.player.player.x -100, this.player.player.x +100), 0, 'bread');
                                bread.setFrictionX(1); //이거 마찰인데... 안 먹히는 듯ㅠㅠ
                            },100*x) //이러면 1초 간격으로 실행됨
                        })(i)
                    }
                    //this.full_bread_1.setVisible(true);
                    //this.full_bread_2.setVisible(true);
                    //this.out = "";
                    
                    //this.cameras.main.fadeIn(1000,0,0,0);
                    this.time.delayedCall(3000, function() {
                        this.exclamMark.setVisible(true);
                        this.exclamMark.play('exclam');
                        this.stage3_3();
                    }, [], this);
    
                }else{
                    this.textBox.setVisible(false);
                    this.script.setVisible(false);
                    this.playerFace.setVisible(false);
                    this.player.playerPaused=false;
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
            this.scene.sleep('third_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');
        }
        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('third_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('second_stage');
        }
        if(this.key4.isDown) {
            console.log('맵이동');
            this.scene.sleep('third_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('fourth_stage');
        }
        if(this.key5.isDown) {
            console.log('맵이동');
            this.scene.sleep('third_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('fifth_stage');
        }
        if(this.key6.isDown) {
            console.log('맵이동');
            this.scene.sleep('third_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('sixth_stage');
        }

        /* 문에 글자 띄워줌 */
        if(this.player.player.x < 1300 && 1150 < this.player.player.x ) {
            this.pressX_1.x = this.player.player.x-50;
            this.pressX_1.y = this.player.player.y-100;
            this.pressX_1.setVisible(true);
        }
        else this.pressX_1.setVisible(false);
        
        // 맵이동 (빵집에서 바깥으로)
        if (inZone && this.keyX.isDown) {
            console.log("[맵이동] stage3_0 으로");
            this.command.remove_phone(this);
            this.scene.switch('third_stage_0'); 
            
        }
          
        inZone =  false;

       /* 바운더리 정하기 */
       this.physics.world.setBounds(0, 0, 1300, 600);
       this.player.player.body.setCollideWorldBounds()


    }
    stage3_1() {
        this.time.delayedCall( 1000, () => { 
        var seq = this.plugins.get('rexsequenceplugin').add(); 
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage3_1, this.dialog)
        .start();
        seq.on('complete', () => {
            this.npc_chef.setFlipX(false);
            this.player.player.setFlipX(true);
            this.exclamMark.setVisible(true);
            this.exclamMark.play('exclam');
            this.time.delayedCall( 1000, () => {this.stage3_2() }, [] , this);
            });
        }, [], this);
    }
    stage3_2() {
    
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage3_2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
            this.code_on=true;
            this.questbox.setVisible(true);
            this.help_icon.setVisible(true);
            this.quest_text.setVisible(true);
        });
    }

    stage3_3() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage3_3, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
            
        });     
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
    } 
    */  
/*
    complied(scene,msg) { //일단 코드 실행하면 무조건 실행된다.
        //complied를 호출하는 코드가 command의 constructure에 있음, constructure에서 scene으로 stage1을 받아왔었음. 그래서??? complied를 호출할때 인자로 scene을 넣어줬음.
        //console.log(scene.out);
        console.log("compiled");
        if(msg==scene.out){
            this.command.remove_phone(this);
            this.invenIn=false;
            this.inventory.inventoryBody.y = 600;

            playerX = this.player.player.x;
            this.textBox = scene.add.image(playerX-70,170,'bubble').setOrigin(0,0);
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
            this.textBox = scene.add.image(this.worldView.x+40,10,'textbox').setOrigin(0,0); 
            this.script = scene.add.text(textBox.x + 200, textBox.y +50, "(이게 답이 아닌 것 같아.)", {
                fontFamily: 'Arial', 
                fill: '#000000',
                fontSize: '30px', 
                wordWrap: { width: 450, useAdvancedWrap: true }
            }).setOrigin(0,0);

            this.playerFace = scene.add.sprite(script.x + 600 ,script.y+50, 'face', 0);
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
        var textBox = scene.add.image(this.worldView.x+40,10,'textbox').setOrigin(0,0); 
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
    */

    complied(scene,msg) { //일단 코드 실행하면 무조건 실행된다.
        //complied를 호출하는 코드가 command의 constructure에 있음, constructure에서 scene으로 stage1을 받아왔었음. 그래서??? complied를 호출할때 인자로 scene을 넣어줬음.
        //console.log(scene.out);
        console.log("compiled");
        if(msg==scene.correct_msg){
            console.log("scene.out="+msg);
            //console.log("scene.correct_msg"+scene.correct_msg);

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
          //this.questbox.setVisible(false);
          //this.quest_text2.setVisible(false);

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

        
        this.msg = msg;
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


}
