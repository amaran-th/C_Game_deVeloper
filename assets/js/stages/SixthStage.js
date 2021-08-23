import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";

export default class SixthStage extends Phaser.Scene {   
    constructor(){ 
        super("sixth_stage"); //identifier for the scene
    }

    preload() {

        this.load.image("stage6_tiles", "./assets/images/test.png");
        this.load.tilemapTiledJSON("sixth_stage", "./assets/sixth_stage.json");
    
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
        this.key5 = this.input.keyboard.addKey('FIVE');
        this.keyP = this.input.keyboard.addKey('P');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "sixth_stage" });
        
        const tileset = map.addTilesetImage("test", "stage6_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y

        /*** npc 불러오기 ***/ //npc가 필요해서... 일단 ㅎㅎ 
        // this.npc_chef = this.add.image(350,250,'npc_chef').setOrigin(0,0);
        // this.npc_chef.setInteractive();
        this.sadari = this.add.image(700, 280, 'sadari').setOrigin(0,0);

        this.devil = this.add.image(720,170,'npc_chef').setOrigin(0,0);
        this.devil.setInteractive();

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
    
        this.anims.create({
            key: "exclam",
            frames: this.anims.generateFrameNumbers('exp_exclam',{ start: 0, end: 4}), 
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        });
        this.exclamMark = this.add.sprite( 700, 180, 'exp_exclam', 0);
        this.exclamMark.setVisible(false);
        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;


        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "sixth_stage");

 
        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화  //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('sixth_stage'); 
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


        stagenum = 6;

        /** 초반 대사 **/
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        this.stage6_1();
        this.page3 = this.add.image(580, 170, 'page3');
        this.page3.setVisible(false); 

        this.presspkey = false;
        this.somethingup = false;
        this.quiz1 = false;
        this.quiz2 = false;
        this.quizimage = this.add.image(600, 300, 'indexQuiz');
        this.quiz1_text = this.add.text(340, 200, 'Quiz1)  index[5]의 값을 고르시오!', { font: "25px Arial Black", fill: "#fff" });
        this.quiz2_text = this.add.text(340, 200, 'Quiz1)  index[1]의 값을 고르시오!', { font: "25px Arial Black", fill: "#fff" });
        this.quizimage.setVisible(false);
        this.quiz1_text.setVisible(false);
        this.quiz2_text.setVisible(false);
        var image1_names = ['quiz11', 'quiz12', 'quiz13', 'quiz14', 'quiz15'];
        this.image1 = [];
        for(var i=0; i < image1_names.length; i++){
            const j = i;
            if(j < 3) { this.image1[j] = this.add.image(360+160*j ,300, image1_names[j]).setOrigin(0).setInteractive(); }
            else { this.image1[j] = this.add.image(420+200*(j-3) ,410, image1_names[j]).setOrigin(0).setInteractive();}
            this.image1[j].setVisible(false);
            this.image1[j].on('pointerup', function () {
                switch(j){
                    case 0:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '정답아님!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    case 1:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '축축!! 정답!!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.quiz1 = false;
                        this.quiz2 = true;
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    case 2:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '정답아님!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    case 3:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '정답아님!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    case 4:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '정답아님!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    default:
                        scene.add.text(400, 300, 'default zone... why?', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                        break;
                }
            },this);
        }
        var image2_names = ['quiz21', 'quiz22', 'quiz23', 'quiz24', 'quiz25'];
        this.image2 = [];
        for(var i=0; i < image2_names.length; i++){
            const j = i;
            if(j < 3) { this.image2[j] = this.add.image(360+160*j ,300, image2_names[j]).setOrigin(0).setInteractive(); }
            else { this.image2[j] = this.add.image(420+200*(j-3) ,410, image2_names[j]).setOrigin(0).setInteractive();}
            this.image2[j].setVisible(false);
            this.image2[j].on('pointerup', function () {
                switch(j){
                    case 0:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '정답아님!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    case 1:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '축축!! 정답!!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.quiz2 = false;
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    case 2:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '정답아님!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    case 3:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '정답아님!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    case 4:
                        this.armgra = this.add.graphics();
                        this.armgra.fillStyle(0xCFE2F3, 1);
                        this.armgra.fillRoundedRect(400, 200, 300, 200, 32);
                        this.arm = this.add.text(450, 250, '정답아님!', { font: "25px Arial Black", fill: "#9900FF" });
                        this.time.delayedCall( 1000, () => { this.arm.destroy(); this.armgra.destroy(); }, [] , this);
                        break;
                    default:
                        scene.add.text(400, 300, 'default zone... why?', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                        break;
                }
            },this);
        }


                /** 임시로 만들어둔 선택지 예시 **/

        this.finAnswer = { //주소
            answer: 0 //값
        };
        var msgArr= ['msg1aaaaaaaaaaaaaaaaaaaaaaaaaasdasdsadadas','msg2','mgs3']; //msgArr.length = 3
        this.scene.run('selection',{ msgArr: msgArr, num: msgArr.length, finAnswer: this.finAnswer });
        //정답(1 ~ maxnum)은 this.finAnswer.andswer에 들어감
        
        this.player.playerPaused = true;
    }

    update() {

        if(!this.scene.isVisible('selection' && this.finAnswer.answer)){ //selection 화면이 꺼졌다면
            switch(this.finAnswer.answer) {
                case 1: console.log('1의 선택지로 대답 했을때');
                    this.finAnswer.answer = 0;
                    return;
                case 2: console.log('2의 선택지로 대답 했을때');
                    this.finAnswer.answer = 0;
                    return;
                case 3: console.log('3의 선택지로 대답 했을때');
                    this.finAnswer.answer = 0;
                    return;
            }
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

        if(this.presspkey === true){
            if(this.keyP.isDown) {
                this.somethingup = true;
                this.book_text.setVisible(false);
            }
        }
        if(this.somethingup === true){
            this.books.x = this.player.player.x + 40;
            this.books.y = 330;
        }
        if(this.player.player.x >= 400 && this.somethingup === true && this.keyP.isDown === true){
            this.books.x = this.player.player.x + 40;
            this.books.y = 330;
            this.stage6_3();
            this.presspkey = false;
            this.somethingup = false;
        }

        if(this.quiz1 === true){
            this.quizimage.setVisible(true);
            this.quiz1_text.setVisible(true);
            for(var i=0; i < this.image1.length; i++){
                this.image1[i].setVisible(true);
            }
        } else if(this.quiz2 === true){
            this.quiz1_text.setVisible(false);
            this.quiz2_text.setVisible(true);
            for(var i=0; i < this.image2.length; i++){
                this.image2[i].setVisible(true);
            }
        } else {
            this.quizimage.setVisible(false);
            this.quiz1_text.setVisible(false);
            this.quiz2_text.setVisible(false);
            for(var i=0; i < this.image2.length; i++){
                this.image1[i].setVisible(false);
                this.image2[i].setVisible(false);
            }

        }

        /** 아이템 획득하는 경우 **/
        //console.log(this.itemicon.x + "<" + this.player.player.x +'<' +(this.itemicon.x+54));
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
            this.scene.sleep('sixth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');
        }
        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('sixth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("second_stage");
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('sixth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }
        if(this.key4.isDown) {
            console.log('맵이동');
            this.scene.sleep('sixth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fourth_stage");
        }
        if(this.key5.isDown) {
            console.log('맵이동');
            this.scene.sleep('sixth_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fifth_stage");
        }

    }

    stage6_1() {
        //this.player.player.setVelocityY(-300)    //플레이어 프래임도 바꾸고 싶은데 안바뀌네..

        this.time.delayedCall( 1000, () => {  
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage6_1, this.dialog)
            .start();
            seq.on('complete', () => {
                // 악마를 플레이어 방향을 보게 하고, 그 위에 느낌표 표시를 한 뒤 stage2 대사로 넘어간다
                this.devil.setFlipX(true);
                this.exclamMark.setVisible(true);
                this.exclamMark.play('exclam');
                this.time.delayedCall( 1000, () => { this.stage6_2() }, [] , this);
                this.player.playerPaused = false;
            }); 
             
        }, [], this);
    }
    stage6_2() {
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage6_2, this.dialog)
            .start();
            seq.on('complete', () => {
                this.books = this.add.image(230,380,'books');
                this.book_text = this.add.text(230, 330, "이 책들을 npc에게 전달해줍시다! 줍는 키 : p", { font: '16px Courier', fill: '#A81FF7' });
                this.presspkey = true;
            });
    }

    stage6_3() {
        this.books.destroy();
        this.bookswhy = this.add.image(650, 380, 'bookswhy');
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage6_3, this.dialog)
            .start();
            seq.on('complete', () => {
                this.bookswhy.destroy();
                this.page1 = this.add.image(580, 170, 'page1');
                this.stage6_4()
            });
    }

    stage6_4() {
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage6_4, this.dialog)
            .start();
            seq.on('complete', () => {
                this.page1.destroy();
                this.page2 = this.add.image(580, 170, 'page2');
                this.time.delayedCall( 1000, () => { 
                    this.page2.destroy();
                    this.page3.setVisible(true); 
                }, [] , this);
                this.stage6_5()
            });
    }
    stage6_5() {
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage6_5, this.dialog)
            .start();
            seq.on('complete', () => {
                this.page3.destroy();
                this.quiz1 = true;
            });
    }



}
