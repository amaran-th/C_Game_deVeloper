import Player from "./Player.js";
import Inventory from "./Inventory.js";
import Dialog from "./Dialog.js";
import Command from "./Command.js";
import DragAndDrop from "./DragAndDrop.js";


const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

export default class ZeroStage extends Phaser.Scene {   
    constructor(){ 
        super("zero_stage"); //identifier for the scene
    }

    preload() {
        this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");
        /*
        /*** FROM Minicode.js***/
        //this.load.html('input', './assets/js/textInput.html');

        //this.load.image("tiles", "./assets/images/map.png");
        //this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");

        /** FROM Player.js**/
        //this.load.spritesheet('player', './assets/images/heroin.png', {
        //    frameWidth: 80,
        //    frameHeight: 140
        //});

        /** 텍스트 박스에 사용하는 플러그인 rexUI preload **/
        //this.load.scenePlugin({
        //    key: 'rexuiplugin',
        //    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //    sceneKey: 'rexUI'
        //});
        //this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
        
        /** 순차진행에 필요한 플러그인 **/
        //var url;
        //url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsequenceplugin.min.js';
        //this.load.plugin('rexsequenceplugin', url, true);
    

        this.onTile = 1;
        

    }
    
    create () {

        this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key3 = this.input.keyboard.addKey('THREE');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "map" });
        
        const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("ground", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        //휴대폰 말풍선 애니메이션 설정
        this.anims.create({
            key: "phone_icon",
            frames: this.anims.generateFrameNumbers('phone',{ start: 0, end: 1}), 
            frameRate: 2,
            repeat: -1,
        });
    
        //휴대폰, 서랍장 이미지 위치. 휴대폰 말풍선 클릭하면 휴대폰이미지 띄어주게 할것임.
        this.phone = this.add.sprite( 700,210,'phone',0).setOrigin(0,0);
        this.table = this.add.image(680,300,"table").setOrigin(0,0);
        this.phone.play('phone_icon');
        this.myphone=this.add.image(710,295,"myphone").setOrigin(0,0);

        //플레이어 말풍선 띄워두기
        this.bubble=this.add.image(0, 300,'bubble2').setOrigin(0,1);
        this.concern_text0 = this.add.text(this.bubble.x+10, this.bubble.y-90, '(           )', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);
        this.concern_text = this.add.text(this.bubble.x+20, this.bubble.y-87, '아-마잌테스트', {
            font:'14px',
            fontFamily: 'Courier',
            color: '#000000'
        }).setOrigin(0,0);
        this.bubble.setVisible(false);
        this.concern_text0.setVisible(false);
        this.concern_text.setVisible(false);

        
        this.concern_text.setInteractive();

        this.input.setDraggable(this.concern_text);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                    gameObject.x = dragX;
                    gameObject.y = dragY;
        });
        this.input.on('dragend', function (pointer, gameObject,dropped) {
                    if (!dropped) //이거 없으면 마우스 놓은 자리에 유지됨
                    {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
        });
        var concern_text = this.concern_text; // drop 안에서 this 안 먹어서 새로 변수 만들어줌
        this.input.on('drop', function (pointer, gameObject, dropZone) {
                    gameObject.x = dropZone.x - dropZone.width / 2 + 5; // 드랍존 틀에 맞춰서 넣어줌
                    gameObject.y = dropZone.y - dropZone.height / 2 + 15;
                    concern_text.setColor('#bfede3');
                    concern_text.setFontSize(25);
        });


        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 330);
        this.player.player.setFlipX(true);

        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.deco.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.deco);

        /*** 충돌지점 색 칠하기 Mark the collid tile ***/
        const debugGraphics = this.add.graphics().setAlpha(0,75);
        this.worldLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243,134,48,255),
        faceColor: new Phaser.Display.Color(40,39,37,255)
        }); //근데 작동 안하는듯... 중요한 거 같진 않으니 일단 넘어감

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "zero_stage");

        this.command.entire_code_button.setVisible(false);  //처음 시작시 휴대전화 아이콘이 보이지 않게 설정

        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        
        //플레이어 위 pressX 생성해두기(door)
        this.pressX = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //플레이어 위 pressX 생성해두기(phone)
        this.getphone = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Get phone', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        

        //quest box 이미지 로드
        this.questbox = this.add.image(0,500,'quest_box').setOrigin(0,0);

        //quest text1
        this.quest_text1 = this.add.text(this.questbox.x+430, this.worldView.y+540, '휴대폰을 얻자.', {
            font:'25px',
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        
        //quest text2
        this.quest_text2 = this.add.text(this.questbox.x+430, this.worldView.y+540, '폰의 코드 앱을 이용해 말을 해보자.', {
            font:'25px',
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        this.questbox.setVisible(false);
        this.quest_text1.setVisible(false);
        this.quest_text2.setVisible(false);
        

        /** 초반 인트로 대사 출력 **/
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //플레이어 얼려두기
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro, this.dialog)
        .start();
        seq.on('complete', () => {
            this.questbox.setVisible(true);
            this.quest_text1.setVisible(true);
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });

        
        this.item = new Array(); //저장되는 아이템(드래그앤 드랍할 조각)

        // 인벤창 팝업 여부를 나타내는 상태변수
        this.invenIn = false;
        
        /** 아이템 만들기 **/
        var item_text = 'printf';
        this.itemicon = this.add.image(360,330,'item'); 
        this.itemicon.setVisible(false);
        

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
        
        // zero_stage 씬의 전체코드
        this.contenttext = "" ;
        // zero_stage의 앱에 들어가는 코드
        this.app_code_text ="";
        
        

        stagenum=0;

        this.isdownX=true;  //X를 누를 때 이벤트가 여러번 동작하는 것을 방지하기 위한 트리거
        this.canexit=false; //문 밖으로 나갈 수 있는지 여부
        this.cangetItem=false;  //아이템을 얻을 수 있는지 여부
        this.code_on=false; //베이스 코드가 설정되었는지 여부

        this.out=this.code_zone_1+this.code_zone_2+" \n int main(){ \n " +  this.code_zone_3 +  "(\""+this.code_zone_4+"\"); \n }" ;;  //플레이어가 얻어야 하는 C코드 출력 텍스트
        ////나중에 "아-아-마이크 테스트"로 바꾸어야 함.////
        
    }

    update() {


        if(this.code_on){
           // zero_stage 씬의 전체코드
            this.contenttext = 
                this.code_zone_1+this.code_zone_2+"\n" + 
                "int main(){ \n " + 
                "    " + this.code_zone_3 +  "(\""+this.code_zone_4+"\"); \n }" ;
            // zero_stage의 앱에 들어가는 코드
            this.app_code_text = 
                "           " + "           " + "\n" + 
                "int main(){ \n" +  
                "    " + "            " + "(\"" + "                         " + "\"); \n" + 
                "}"; 
        }
        
        if(this.bubble.visible&&this.player.player.body.velocity.x != 0 ){
            this.bubble.x=this.player.player.x;
            this.concern_text0.x=this.bubble.x+10;
            this.concern_text.x=this.bubble.x+20;
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
        if (this.beforeItemGet && this.player.player.x < this.itemicon.x+54 && this.itemicon.x < this.player.player.x&&this.cangetItem) {
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
            

            this.item[this.item.length] =  '#include';
            this.item[this.item.length] =  '<stdio.h>';
            this.item[this.item.length] =  'printf';
            //this.item[this.item.length] =  "아-아-마이크 테스트";
            this.dropzon_su = 4; // draganddrop.js안에 코드조각 같은거 한 개만 생성하게 하는데 필요

            this.dropzone1_x = 815; // 드랍존 x좌표 (플레이어 따라 이동하는데 필요)
            this.dropzone2_x = 950;
            this.dropzone3_x = 815;
            this.dropzone4_x = 965;

            this.draganddrop_1 = new DragAndDrop(this, this.dropzone1_x, 85, 130, 25).setRectangleDropZone(100, 25).setName("1");
            this.draganddrop_2 = new DragAndDrop(this, this.dropzone2_x, 85, 130, 25).setRectangleDropZone(100, 25).setName("2");
            this.draganddrop_3 = new DragAndDrop(this, this.dropzone3_x, 150, 80, 25).setRectangleDropZone(80, 25).setName("3");
            this.draganddrop_4 = new DragAndDrop(this, this.dropzone4_x, 150, 170, 25).setRectangleDropZone(170, 25).setName("4");
            this.intro4();
            this.invenPlus = false;
        }

        if(this.draganddrop_1!=undefined) this.draganddrop_1.update(this);
        if(this.draganddrop_2!=undefined) this.draganddrop_2.update(this);
        if(this.draganddrop_3!=undefined) this.draganddrop_3.update(this);
        if(this.draganddrop_4!=undefined) this.draganddrop_4.update(this);

        /* x 키 눌렀을 때 바로 사라지게 하는 건데 대사 많이 출력하는 오류있음
        if(this.itemget.visible && this.keyX.isDown) {
            this.itemget.setVisible(false);
            this.itemText.setVisible(false);
            this.beforeItemGet = false;
            this.invenPlus = true;
        }
        */

        /* 플레이어가 문 앞에 서면 작동하도록 함 */
        if(this.player.player.x < 175 && 100 < this.player.player.x && this.canexit ) {
            this.pressX.x = this.player.player.x-50;
            this.pressX.y = this.player.player.y-100;
            this.pressX.setVisible(true);
        
            if(this.keyX.isDown) {
                this.cameras.main.fadeOut(100, 0, 0, 0); //is not a function error
                console.log('맵이동');

                
                /** 휴대폰 킨 상태로 맵 이동했을때 휴대폰 꺼져있도록**/
                this.command.remove_phone(this);


                this.scene.stop('zero_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
                this.scene.run("first_stage");
            }
        }
        else this.pressX.setVisible(false);


        
        //휴대폰 앞에서 x키를 누를 시
        if(this.player.player.x < 775 && 700 < this.player.player.x ) {
            this.getphone.x = this.player.player.x-50;
            this.getphone.y = this.player.player.y-100;
            this.getphone.setVisible(true);
   
            if(this.keyX.isDown) {
                if(this.isdownX) {
                this.isdownX=false;
                console.log('휴대폰 획득');
                this.phone.setVisible(false);
                this.myphone.setVisible(false);
                this.getphone.destroy();    ////나중에 애니메이션까지 destroy 시키자
                this.phoneicon=this.add.image(550, 250, "entire_code_button").setOrigin(0,0).setAlpha(0);
                this.tweens.add({
                    targets: this.phoneicon,
                    alpha:1,
                    duration: 500,
                    ease: 'Linear',
                    repeat: 0,
                    onComplete: ()=>{this.isintro=1;}
                }, this);
            }
        }
        }
        else this.getphone.setVisible(false);


        //상태 변수 isintro 값에 따라 함수를 실행시킨다.(이벤트를 순차적으로 실행시키기 위해)
        if(this.isintro==1) {
            this.intro1();
            this.isintro = 0;
        }else if(this.isintro==2){
            this.intro2();
            this.isintro = 0;
        }else if(this.isintro==3){
            this.intro3();
            this.isintro = 0;
        }




        if(this.key1.isDown) {
            console.log('맵이동');
            this.scene.sleep('zero_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');


        }
        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('zero_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('second_stage');
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('zero_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }

    }

    intro1() {
        this.player.playerPaused = true; //플레이어 얼려두기
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro1, this.dialog)
        .start();
        seq.on('complete', () => {
            this.tweens.add({
                targets: this.phoneicon,
                x:5,
                y:10,
                duration: 1000,
                ease: 'Power1',
                repeat: 0,
                onComplete: ()=>{
                    this.questbox.setVisible(false);
                    this.quest_text1.setVisible(false);
                    this.phoneicon.destroy();
                    this.command.entire_code_button.setVisible(true);
                    this.itemicon.setVisible(true);
                    this.cangetItem=true;
                    this.player.player.setFlipX(false);
                    this.isintro=2;
                }
            }, this);
        });
    }
    intro2() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro2, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.player.setFlipX(true);
            this.isintro=3;
        });
    }
    intro3() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro3, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });
    }



    intro4() {
        this.player.playerPaused = true; //플레이어 얼려두기
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro4, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.player.setVelocityY(-300)    //플레이어 프래임도 바꾸고 싶은데 안바뀌네..
            this.time.delayedCall( 1000, () => {  this.intro5(); }, [], this);
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });
    }

    intro5() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro5, this.dialog)
        .start();
        seq.on('complete', () => {
            this.bubble.x=this.player.player.x;
            this.concern_text0.x=this.bubble.x+10;
            this.concern_text.x=this.bubble.x+20;
            
            this.bubble.setVisible(true);
            this.concern_text0.setVisible(true);
            this.concern_text.setVisible(true);

            this.questbox.setVisible(true);
            this.quest_text2.setVisible(true);
            this.code_on=true;
        });
    }

    complied(scene,msg) { //일단 코드 실행하면 무조건 실행된다.
        //complied를 호출하는 코드가 command의 constructure에 있음, constructure에서 scene으로 stage1을 받아왔었음. 그래서??? complied를 호출할때 인자로 scene을 넣어줬음.
        //console.log(scene.out);
        console.log("compiled");
        if(msg==scene.out){
            this.bubble.setVisible(false);
            this.concern_text0.setVisible(false);
            this.concern_text.setVisible(false);

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
          this.questbox.setVisible(false);
          this.quest_text2.setVisible(false);

            //var playerFace = scene.add.sprite(script.x + 600 ,script.y+50, 'face', 0);
        }else{
            var textBox = scene.add.image(this.worldView.x+40,10,'textbox').setOrigin(0,0); 
            var script = scene.add.text(textBox.x + 200, textBox.y +50, "(이게 답이 아닌 것 같아.)", {
                fontFamily: 'Arial', 
                fill: '#000000',
                fontSize: '30px', 
                wordWrap: { width: 450, useAdvancedWrap: true }
            }).setOrigin(0,0);

            var playerFace = scene.add.sprite(script.x + 600 ,script.y+50, 'face', 0);
        }
        scene.input.once('pointerdown', function() {
            if(msg==scene.out){
                this.textBox.setVisible(false);
                this.script.setVisible(false);
                //playerFace.setVisible(false);
                scene.intro6();
            }else{
                textBox.setVisible(false);
                script.setVisible(false);
                playerFace.setVisible(false);
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



    intro6() {
        this.canexit=true;
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro6, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
            this.code_on=false;
        });
    }
}
