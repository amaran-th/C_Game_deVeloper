import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
var inZone1_1;
var inZone1_2;
export default class FirstStage extends Phaser.Scene {   
    constructor(){ 
        console.log('firststage');
        super("first_stage"); //identifier for the scene
    }

    preload() {
        this.load.tilemapTiledJSON("stage1", "./assets/stage1.json");
    }
    
    create () {
        this.isstage = new Stage(this);//stage관련 
        //this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key2 = this.input.keyboard.addKey('TWO');
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
        const map = this.make.tilemap({ key: "stage1" });

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawnPoint");

        /*** 맵 이동 (문 이미지 불러오기) */
        this.zone1_1 = this.physics.add.staticImage(100, 420).setSize(100,160);
        this.zone1_2 = this.physics.add.staticImage(1500, 420).setSize(100,160);
        

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 430);

        /** 집 이미지 add **/
        this.add.image(0,0,"house").setOrigin(0,0);
        
        const tileset = map.addTilesetImage("map", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("world", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y

        //플레이어 위 pressX 생성해두기(door) => stage2로 
        this.pressX_1 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //플레이어 위 pressX 생성해두기(door) => stage3로 
        this.pressX_2 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        this.anims.create({
            key: "exclam",
            frames: this.anims.generateFrameNumbers('exp_exclam',{ start: 0, end: 4}), 
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        });
        this.exclamMark = this.add.sprite( 600, 330, 'exp_exclam', 0);
        this.exclamMark.setVisible(false);

        this.anims.create({
            key: "devil_walk",
            frames: this.anims.generateFrameNumbers('npc_devil',{ start: 0, end: 3}), 
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: "devil_touch_phone",
            frames: this.anims.generateFrameNumbers('npc_devil',{ start: 4, end: 5}), 
            frameRate: 2,
            repeat: -1,
        });
        this.devil = this.physics.add.sprite(600 ,430,'npc_devil');
        this.devil.setFrame(1);

        //플레이어 위 talktext 생성해두기(talk with librarian)
        this.talktext = this.add.text(1100, 300, 'Press X to have a talk', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);
        
        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/16, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.devil, this.worldLayer);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        this.stage_text=this.add.image(this.worldView.x+1100, 0, 'stage1_text').setOrigin(1,0);

        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "first_stage");
        this.command.entire_code_button.input.enabled = false;//이거 나중에 고치기,,,


        //quest box 이미지 로드
        this.questbox = this.add.image(this.worldView.x,500,'quest_box').setOrigin(0,0);

        //quest text1
        this.quest_text1 = this.add.text(this.questbox.x+430, 540, '아까 본 남자에게 말을 걸자.', {
            font:'25px',
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        this.questbox.setVisible(false);
        this.quest_text1.setVisible(false);


        /** 플레이어 위치 확인용 **/
        //this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화  //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            // 휴대폰 킨 상태로 맵 이동했을때 휴대폰 꺼져있도록
            this.commandbox.setVisible(false);
            for(var i=0; i < this.apps.length; i++){
                this.apps[i].setVisible(false);
            }

            scene.codeapp_onoff_state = 0; // 코드앱이 켜지고 꺼짐에 따라 드랍존도 생기고 없어지고 하기위한 상태변수
                
            code_on = false;
            tutorial_on = false;
            //text.setVisible(false);
            code_text.setVisible(false);
            this.compile_button.setVisible(false);
            tutorial_text.setVisible(false);
            this.back_button.setVisible(false);
            state = 0;


            this.scene.sleep('first_stage'); 
            this.scene.run("minimap");
        },this);
***/
        stagenum = 1;

        /** 초반 대사 **/
        this.cameras.main.fadeIn(1000,0,0,0);

        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        if (stage==1){
            this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
            this.stage1_1();

            this.quiz_running = false;

            //npc에게 말을 걸 수 있는지 여부
            this.cantalk=false;

            //npc에게 말을 건 횟수(순차적 실행을 위함)
            this.talk_num=0

            //이벤트 실행을 위한 플래그 변수
            this.function=0;
        }
        else {//stage완료 했을때!!(이어하기)
            this.devil.x=1200; //악마 위치 고정
            this.devil.y=110;

            this.talk_num = 2;
           
            this.cantalk = true;
        }

        this.isdownX=true; //x키 중복 방지. 이거 안하면 안됨
        this.quiz_running2 = false; //이어하기에 쓰이는 변수
        
        //맵이동
        this.physics.add.overlap(this.player.player, this.zone1_1, function () {
            inZone1_1 = true;
        });
        this.physics.add.overlap(this.player.player, this.zone1_2, () => {
            inZone1_2 = true;
        });

        /* 스테이지 클리어 */
        this.stage_clear = this.add.image(0,0,'stage_clear').setOrigin(0.0);
        this.stage_clear.setVisible(false);

    }

    update() {
        this.player.update();
        //this.inventory.update(this);
        this.command.update(this);

        //퀘스트 박스 및 텍스트 관련 코드
        if(this.questbox.visible==true){
            this.questbox.x=this.worldView.x+30;
            this.quest_text1.x=this.questbox.x+430;
        }

        //stage num
        this.stage_text.x=this.worldView.x+1100;
                
         /* 플레이어 위치 알려줌
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;
*/
        /** 아이템 획득하는 경우 **/
        /*if (this.beforeItemGet && this.player.player.x < this.itemicon.x+54 && this.itemicon.x < this.player.player.x) {
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
            this.inventory.invenSave(this, 'if'); //인벤토리에 아이템 텍스트 추가
            //this.inventory.invenSave(this, 'if');
            //his.inventory.invenSave(this, 'else');
            //this.intro2();
            this.invenPlus = false;
        }*/

        //퀴즈 해결 후 악마에게 말을 걸 때
        if(this.cantalk&&this.player.player.x<1100&&this.player.player.x>1000){
            this.talktext.setVisible(true);
            if(this.keyX.isDown&&this.talk_num==0) {
                if(this.cantalk){
                    //devil에게 처음 말을 걸었을 때
                    console.log('first talk with devil');
                    this.player.player.setFlipX(false);
                    this.cantalk=false;
                    this.function=1;
                    this.player.playerPaused = true;
                    this.talk_num++; //second talk 악마 말하기
                    this.questbox.setVisible(false);
                    this.quest_text1.setVisible(false);
                }
            }else if(this.keyX.isDown&&this.talk_num==1){
                //devil에게 말을 건 이후에 또 말을 걸 때
                if(this.cantalk){
                    console.log('second talk with devil');
                    this.player.player.setFlipX(false);
                    this.cantalk=false;
                    this.function=4;
                    this.player.playerPaused = true;
                    this.talk_num++;
                    
                }
            }
            else if (this.keyX.isDown&&this.talk_num==2){ //퀴즈 한번더(계속 할 수 있음)
                if(this.cantalk){
                    console.log('퀴즈 한번더');
                    this.player.player.setFlipX(false);
                    this.cantalk=false;
                    this.function=5;
                    this.player.playerPaused = true
                }
            }
        }else this.talktext.setVisible(false);


        if(this.function==1){
            this.stage1_7();
            this.function=0;
        }else if(this.function==2){
            this.stage1_8(); //미션 완료후, 악마와 대화(1)하고 stage값 1증가(자동으로)
            this.function=0;
        }else if(this.function==3){
            //이거 안씀...
            this.function=0;
        }else if(this.function==4){
            this.stage1_10(); //미션 완료후 악마와 대화(2)
            this.function=0;
        }else if(this.function==5){
            this.stage1_11(); //한번 더 퀴즈
            this.function=0;
        }

        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        //맵이동 (stage1) 로
        if (inZone1_1) {
            this.pressX_1.x = this.player.player.x-50;
            this.pressX_1.y = this.player.player.y-100;
            this.pressX_1.setVisible(true);
            if (this.keyX.isDown){
                console.log("[맵이동] stage0 으로");
                this.command.remove_phone(this);
                this.scene.switch('zero_stage'); 
            }
        }else this.pressX_1.setVisible(false);
        
        inZone1_1 = false;
        
      

        if (inZone1_2) {
            this.pressX_2.x = this.player.player.x-50;
            this.pressX_2.y = this.player.player.y-100;
            this.pressX_2.setVisible(true);
            if (this.keyX.isDown&&stage>1){ // 스테이지 클리어해야 나감.
                console.log("===[맵이동] stage2 으로===");
                console.log("[맵이동] stage2 으로");
                this.command.remove_phone(this);
                this.scene.switch('second_stage'); 
            }else if(this.keyX.isDown&&stage<=1&&this.isdownX){ //스테이지 클리어 못하고 나가려할때
                this.isdownX=false;
                this.stage1_9();
            }
        }else this.pressX_2.setVisible(false);

        inZone1_2 = false;
        
        if(!this.scene.isActive('quiz') && this.quiz_running ) this.stage1_6();
        if(!this.scene.isActive('quiz') && this.quiz_running2) this.stage1_12();


        /* 바운더리 정하기 */
       this.physics.world.setBounds(0, 0, 1500, 600);
       this.player.player.body.setCollideWorldBounds()

        
    }

    stage1_1() {
        console.log('불바다 대사');
        this.time.delayedCall( 1000, () => {  
            this.player.player.setVelocityY(-300)    //플레이어 프래임도 바꾸고 싶은데 안바뀌네..

            this.time.delayedCall( 1000, () => {  
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.stage1_1, this.dialog)
                .start();
                seq.on('complete', () => {
                    //악마를 플레이어 방향을 보게 하고, 그 위에 느낌표 표시를 한 뒤 stage2 대사로 넘어간다
                    this.devil.setFlipX(true);
                    this.exclamMark.setVisible(true);
                    this.exclamMark.play('exclam');
                    this.time.delayedCall( 1000, () => { this.stage1_2() }, [] , this);
                });    
            }, [], this);
        }, [], this);
        
    }

    stage1_2() {
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage1_2, this.dialog)
            .start();
            seq.on('complete', () => {
                this.devil.play('devil_walk',true);
                this.devil.setVelocityX(-200);
                this.time.delayedCall( 1000, () => {
                    this.devil.anims.stop();
                    this.devil.setVelocityX(0); 
                    this.stage1_3();
                 }, [] , this);
            });  
    }

    stage1_3() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage1_3, this.dialog)
        .start();
        seq.on('complete', () => {
            this.command.entire_code_button.setVisible(false);//휴대폰 없엠
            this.devil.play('devil_touch_phone',true);
            this.time.delayedCall( 2000, () => {
                this.stage1_4();
             }, [] , this);
        });  
    }

    stage1_4() {
        this.devil.anims.stop();
        this.devil.setFrame(1);
        this.phoneLocked = this.add.image(this.worldView.x+1110,50,'locked').setOrigin(0,0).setInteractive();
        this.tweens.add({
            targets: this.phoneLocked,
            x: 350, //위치 이동
            duration: 500,
            ease: 'Power1', 
            repeat: 0,
            onComplete: ()=>{console.log('done')}
        }, this);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.time.delayedCall( 2000, () => { 
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage1_4, this.dialog)
            .start();
            seq.on('complete', () => {
                this.stage1_5();
            }); 
        }, [] , this);
    }

    stage1_5() {
        this.devil.setFlipX(false);
        this.devil.play('devil_walk');
        this.devil.setVelocityX(500);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage1_5, this.dialog)
        .start();
        seq.on('complete', () => {
            this.devil.setVelocityX(0);
            this.devil.x=1200;
            this.devil.y=110;
            this.devil.anims.stop();
            this.devil.setFrame(1);
            
            console.log('대화 끝');
            this.click = this.add.text(500, 480, 'Click!', { font: '30px Courier', fill: '#ffffff', fontSize: '100px' })
            this.phoneLocked.once('pointerdown', function() {
                this.scene.run('quiz');
                this.quiz_running = true;
                this.phoneLocked.input.enabled = false;
            }, this);
        }); 
    }

    stage1_6() {
        this.quiz_running = false;
        this.phoneLocked.destroy();
        this.click.destroy();

        var phoneUnlocked = this.add.image(350,50,'unlocked').setOrigin(0,0);

        this.time.delayedCall( 1000, () => { 
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage1_6, this.dialog)
            .start();
            seq.on('complete', () => {      
                this.tweens.add({
                    targets: phoneUnlocked,
                    x: 1200, //위치 이동
                    duration: 500,
                    ease: 'Power1',
                    repeat: 0,
                    onComplete: ()=>{
                        this.command.entire_code_button.setVisible(true);//휴대폰 생김
                        phoneUnlocked.destroy();
                        this.stage1_6_1();
                    }
                }, this);
            }); 
        }, [], this);
    }

    stage1_6_1(){
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage1_6_1, this.dialog)
            .start();
            seq.on('complete', () => {
                this.questbox.setVisible(true);
                this.quest_text1.setVisible(true);
                this.player.playerPaused = false;
                this.cantalk=true;
                this.devil.play('devil_touch_phone',true);
            }); 
    }
    stage1_7(){
        this.exclamMark.x=1200;

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage1_7, this.dialog)
        .start();
        seq.on('complete', () => {
            this.exclamMark.setVisible(true);
            this.exclamMark.play('exclam');
            this.time.delayedCall( 1000, () => {
                this.devil.anims.stop();
                this.devil.setFrame(1);
                this.devil.setFlipX(true);
                this.function=2;
            }, [] , this);

        });
    }

    stage1_8(){
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage1_8, this.dialog)
        .start();
        seq.on('complete', () => {            
            this.isstage.plus(this);
            this.clearEvent();

        });
    }
    stage1_9(){ //스테이지 클리어 안하고 나가려 할때//악마한테 따지고 오자!!!
        this.player.playerPaused = true; //플레이어 얼려두기
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.stage1_9, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                    this.isdownX=true;
                });

    }

    stage1_10(){ //악마와 대화 2번쩨
        this.player.playerPaused = true; //플레이어 얼려두기
                var seq = this.plugins.get('rexsequenceplugin').add();
                this.dialog.loadTextbox(this);
                seq
                .load(this.dialog.stage1_10, this.dialog)
                .start();
                seq.on('complete', () => {
                    this.player.playerPaused = false;
                    this.cantalk=true;
                });

    }


    stage1_11() { //악마에게 퀴즈 한번 더
        this.player.playerPaused = true; //플레이어 얼려두기

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage1_11, this.dialog)
        .start();
        seq.on('complete', () => {
            this.scene.run('quiz');
            this.quiz_running2 = true;
        });  
    }

    stage1_12() { //얏호! 또 풀었따
        this.quiz_running2 = false;

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage1_12, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false;
        
            this.time.delayedCall( 2000, () => {
                this.cantalk=true;
             }, [] , this);
        });  
    }
    clearEvent(){
        this.stage_clear.x=this.worldView.x+1100;
            this.time.delayedCall( 500, () => { 
                
                this.stage_clear.setVisible(true);

                this.tweens.add({
                    targets: this.stage_clear,
                    x: this.worldView.x,
                    duration: 500,
                    ease: 'Linear',
                    repeat: 0,
                    onComplete: ()=>{
                        var seq = this.plugins.get('rexsequenceplugin').add();
                        this.dialog.loadTextbox(this);
                        seq
                        .load(this.dialog.save_message, this.dialog)
                        .start();
                        seq.on('complete', () => {
                            this.tweens.add({
                            targets: this.stage_clear,
                            x: this.worldView.x-1100,
                            duration: 500,
                            ease: 'Linear',
                            repeat: 0,
                            onComplete: ()=>{ 
                                this.player.playerPaused = false;
                                this.cantalk=true; //대사가 다 나오면 플레이어가 다시 움직이도록
                                this.devil.play('devil_touch_phone',true);
                                this.stage_clear.setVisible(false);
                            }
                        }, this);
                        });
                    }
                }, this);
            }, [] , this);
    }
}
