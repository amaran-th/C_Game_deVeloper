import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";
import DragAndDrop from "../DragAndDrop.js";
var stage;
var inZone6_1;
var inZone6_2;
export default class SixthStage extends Phaser.Scene {   
    constructor(){ 
        super("sixth_stage"); //identifier for the scene
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

        this.load.image("stage6_tiles", "./assets/images/stage6/map_stage6.png");
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
        
        const tileset = map.addTilesetImage("map_stage6", "stage6_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        //도서관의 배경 불빛 애니메이션 생성
        this.anims.create({
            key: "light",
            frames: this.anims.generateFrameNumbers('librarylight',{ start: 0, end: 2}), 
            frameRate: 5,
            repeat: -1
        });

        this.background1 = this.add.sprite( 600, 200, 'librarylight', 0).setOrigin(0,1);
        //this.background2 = this.add.sprite( 600, 400, 'librarylight', 0).setOrigin(0,1);
        this.background3 = this.add.sprite( 100, 250, 'librarylight', 0).setOrigin(0,1);
        this.background4 = this.add.sprite( 1100, 250, 'librarylight', 0).setOrigin(0,1);

        this.background1.play('light',true);
       // this.background2.play('light',true);
        this.background3.play('light',true);
        this.background4.play('light',true);

        /*** npc 불러오기 ***/ //npc가 필요해서... 일단 ㅎㅎ 
        // this.npc_chef = this.add.image(350,250,'npc_chef').setOrigin(0,0);
        // this.npc_chef.setInteractive();

        this.npc = this.add.image(214,195,'librarian2').setOrigin(0,0);
        this.npc.setInteractive();
        
        /*** 맵 이동 (문 이미지 불러오기) */
        this.zone6_1 = this.physics.add.staticImage(100, 420).setSize(100,160);
        /*** 맵 이동 (문 이미지 불러오기) */
        this.zone6_2 = this.physics.add.staticImage(1200, 420).setSize(100,160);
        //책 이미지 불러오기
        this.books = this.add.image(700,380,'books');
        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x + 100, 430);
    
        this.anims.create({
            key: "exclam",
            frames: this.anims.generateFrameNumbers('exp_exclam',{ start: 0, end: 4}), 
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        });
        this.exclamMark = this.add.sprite( 254, 172, 'exp_exclam', 0);
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



        
        
        //맵이동
        this.physics.add.overlap(this.player.player, this.zone6_1, function () {
            inZone6_1 = true;
        });
        this.physics.add.overlap(this.player.player, this.zone6_2, function () {
            inZone6_2 = true;
        });

        //플레이어 위 pressX 생성해두기(door)
        this.pressX_1 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);
        this.pressX_2 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //플레이어 위 pressX 생성해두기(책 얻기)
        this.pressX_getbook = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to GET books', {
            fontFamily: ' Courier',
            color: '#ffffff'
        }).setOrigin(0,0);

        //플레이어 위 pressX 생성해두기(책 주기)
        this.pressX_return_book = this.add.text(200,130, 'Press X to return books', {
            fontFamily: ' Courier',
            color: '#ffffff'
        }).setOrigin(0,0);

        //플레이어 위 pressX 생성해두기(책 주기)
        this.pressX_talk = this.add.text(200,130, 'Press X to have a talk', {
            fontFamily: ' Courier',
            color: '#ffffff'
        }).setOrigin(0,0);

        this.stage_text=this.add.image(this.worldView.x+1100, 0, 'stage6_text').setOrigin(1,0);

        /*** 명령창 불러오기 ***/
        this.codeapp_onoff_state = 0; // 명령창 열리고 닫힘을 나타내는 상태 변수 (command, draganddrop에서 쓰임)
        this.command = new Command(this, map, "sixth_stage");

        //quest box 이미지 로드
        this.questbox = this.add.image(this.worldView.x,500,'quest_box').setOrigin(0,0);

        //quest text1
        this.quest_text1 = this.add.text(this.questbox.x+430, 540, '남자 사서에게 책을 전달해주자.', {
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
            this.scene.sleep('sixth_stage'); 
            this.scene.run("minimap");
        },this);
***/

        // 인벤창 팝업 여부를 나타내는 상태변수
        this.invenIn = false;

        /** 인벤토리 만들기 **/    
        this.inven = this.inventory.create(this);
        this.code_piece = new CodePiece(this); // 코드조각 클래스 호출 (inven보다 뒤에 호출해야 inven 위에 올라감)


        stagenum = 6;

        /** 초반 대사 **/
        this.cameras.main.fadeIn(1000,0,0,0);



        this.somethingup = false; //플래그변수
        this.bookok = false; // 플래그변수

        this.O = this.add.image(260, 140, 'OX_O');//맞췄을때 말풍선
        this.X = this.add.image(260, 140, 'OX_X');
        this.O.setVisible(false);
        this.X.setVisible(false);

        this.quiz1 = false;
        this.quiz2 = false;
        this.quizimage = this.add.image(600, 300, 'indexQuiz');
        this.quiz1_text = this.add.text(340, 200, 'Quiz1)  index[1]의 값을 고르시오!', { font: "25px Arial Black", fill: "#fff" });
        this.quiz2_text = this.add.text(340, 200, 'Quiz2)  index[3]의 값을 고르시오!', { font: "25px Arial Black", fill: "#fff" });
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
                        this.X.setVisible(true);
                        this.time.delayedCall( 1000, () => { this.X.setVisible(false);}, [] , this);
                        break;
                    case 1:
                        this.X.setVisible(false);
                        this.O.setVisible(true);
                        this.quiz1 = false;
                        this.quiz2 = true;
                        this.time.delayedCall( 1000, () => { this.O.setVisible(false);}, [] , this);
                        break;
                    case 2:
                        this.X.setVisible(true);
                        this.time.delayedCall( 1000, () => { this.X.setVisible(false);}, [] , this);
                        break;
                    case 3:
                        this.X.setVisible(true);
                        this.time.delayedCall( 1000, () => { this.X.setVisible(false);}, [] , this);
                        break;
                    case 4:
                        this.X.setVisible(true);
                        this.time.delayedCall( 1000, () => { this.X.setVisible(false);}, [] , this);
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
                        this.X.setVisible(true);
                        this.time.delayedCall( 1000, () => { this.X.setVisible(false);}, [] , this);
                        break;
                    case 1://퀴즈 다끝남!!
                        this.X.setVisible(false);
                        this.O.setVisible(true);
                        this.quiz1 = false;
                        this.quiz2 = true;
                        this.time.delayedCall( 1000, () => {
                            //퀴즈를 모두 맞춘 경우
                            this.O.setVisible(false);
                        }, [] , this);
                        this.quiz2 = false;
                        this.quiz_finish = true;
                        
                        break;
                    case 2:
                        this.X.setVisible(true);
                        this.time.delayedCall( 1000, () => { this.X.setVisible(false);}, [] , this);
                        break;
                    case 3:
                        this.X.setVisible(true);
                        this.time.delayedCall( 1000, () => { this.X.setVisible(false);}, [] , this);
                        break;
                    case 4:
                        this.X.setVisible(true);
                        this.time.delayedCall( 1000, () => { this.X.setVisible(false);}, [] , this);
                        break;
                    default:
                        scene.add.text(400, 300, 'default zone... why?', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                        break;
                }
            },this);
        }


                /** 임시로 만들어둔 선택지 예시 **/
/*
        this.finAnswer = { //주소
            answer: 0 //값
        };
        var msgArr= ['msg1aaaaaaaaaaaaaaaaaaaaaaaaaasdasdsadadas','msg2','mgs3']; //msgArr.length = 3
        this.scene.run('selection',{ msgArr: msgArr, num: msgArr.length, finAnswer: this.finAnswer });
        //정답(1 ~ maxnum)은 this.finAnswer.andswer에 들어감
   */     
        this.isdownX=true;

        if (stage==12){

            this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
            this.stage6_1();

        }
        else{//이어하기 (미션 끝난 상태로 만들어줌)
            this.books.destroy();  //쌓인 책 이미지 없앰
            this.bookswhy = this.add.image(340, 478, 'bookswhy'); //책 무너진 이미지 띄움
        }

    }

    update() {
        /*
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
        }*/

        this.player.update();
        this.inventory.update(this);
        this.command.update(this);
        this.code_piece.update(this);

        //퀘스트 박스 및 텍스트 관련 코드
        if(this.questbox.visible==true){
            this.questbox.x=this.worldView.x+30;
            this.quest_text1.x=this.questbox.x+430;
        }
           
        //stage num
        this.stage_text.x=this.worldView.x+1100;
               
         /* 플레이어 위치 알려줌*/
         /*
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;
        */

        //1. 책 주변으로 갔을때 X누르면 머리위로 책 얻음!
        if( this.player.player.x > 600 && this.player.player.x < 730 && this.bookok == false && this.somethingup == false && stage == 12){
            this.pressX_getbook.x = this.player.player.x-50;
            this.pressX_getbook.y = this.player.player.y-100;
            this.pressX_getbook.setVisible(true);
            
            if(this.keyX.isDown) {
                this.somethingup = true;
            }
    
        }
        else this.pressX_getbook.setVisible(false);

        //2. 책 X키로 얻었을때, 책이 머리위로 뜨도록
        if(this.somethingup === true){
            this.books.x = this.player.player.x + 5;
            this.books.y = this.player.player.y - 95;
        }

        //3.책 얻은 상태로 npc한테 줄때
        if(this.player.player.x > 300 && this.player.player.x < 400 && this.somethingup === true){
            this.pressX_return_book.setVisible(true);

            if(this.keyX.isDown) {
                this.somethingup = false;
                this.questbox.setVisible(false);
                this.quest_text1.setVisible(false);
                this.stage6_3();
            }
        }
        else this.pressX_return_book.setVisible(false);

        
        //4. (첫번째) 퀴즈2개 다 완료했을때 대화 뜸
        if(this.quiz_finish && stage==12){
            this.stage6_6();
            this.quiz_finish = false;
        }
        //4_1. (무한반복) 퀴즈2개 다 완료했을때 대화 뜸
        if(this.quiz_finish && stage>12){
            this.stage6_8(); //얏호! 또 풀었다!
            this.quiz_finish = false;
        }

        //5. (미션 반복) 배열 퀴즈 계속 받기
        if(this.player.player.x > 300 && this.player.player.x < 400 && stage > 12&&this.isdownX){
            this.pressX_talk.setVisible(true);

            if(this.keyX.isDown) {
                this.stage6_7();
                this.isdownX = false;
            }
        }
        else this.pressX_talk.setVisible(false);

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
        
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        //맵이동 (stage5) 로
        if (inZone6_1) {
            this.pressX_1.x = this.player.player.x-50;
            this.pressX_1.y = this.player.player.y-100;
            this.pressX_1.setVisible(true);
            if (this.keyX.isDown){
                console.log("[맵이동] stage4 으로");
                this.command.remove_phone(this);
                this.scene.switch('fifth_stage'); 
            }
        }else this.pressX_1.setVisible(false);
        //맵이동 (Ending Room) 로
        if (inZone6_2) {
            this.pressX_2.x = this.player.player.x-50;
            this.pressX_2.y = this.player.player.y-100;
            this.pressX_2.setVisible(true);
            if (this.keyX.isDown&&stage>12){
                console.log("[맵이동] Ending Room 으로");
                this.command.remove_phone(this);
                this.scene.switch('bootGame'); 
            }else if(this.keyX.isDown&&stage<=12&&this.isdownX){ //스테이지 클리어 못하고 나가려할때
                this.isdownX=false;
                this.stage6_9();
            }
        }else this.pressX_2.setVisible(false);
        
        inZone6_1 = false;
        inZone6_2 = false;

        /* 바운더리 정하기 */
       this.physics.world.setBounds(0, 0, 1500, 600);
       this.player.player.body.setCollideWorldBounds()

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
                this.exclamMark.setVisible(true);
                this.exclamMark.play('exclam');
                this.time.delayedCall( 1000, () => { this.stage6_2() }, [] , this);
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
                this.questbox.setVisible(true);
                this.quest_text1.setVisible(true);
                this.player.playerPaused = false;
            });
    }
    //책을 npc한테 줬을시
    stage6_3() {

        this.cameras.main.fadeIn(500,0,0,0) //화면 한번 깜빡이고
        this.cameras.main.shake(500, 0.01); //책 무너짐
        this.npc.setFlipX(true);

        this.books.destroy();  //쌓인 책 이미지 없앰
        this.bookswhy = this.add.image(340, 478, 'bookswhy'); //책 무너진 이미지 띄움
        this.bookok = true; //이거 안하면 press x to get book text계속 뜸. 플래그 변수

        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage6_3, this.dialog)
            .start();
            seq.on('complete', () => {
                this.page1 = this.add.image(360, 200, 'page1');//page1 이미지 띄움
                this.time.delayedCall( 1500, () => { this.stage6_4()}, [] , this);
            }); 
    }

    stage6_4() {
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage6_4, this.dialog)
            .start();
            seq.on('complete', () => {
                this.page2 = this.add.image(730, 200, 'page2');//page2 이미지 띄움
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
                this.page1.destroy();
                this.page2.destroy();
                this.quiz1 = true; //퀴즈 시작

                
            });
    }


    stage6_6(){ //처음으로 퀴즈 2개 다 풀었을때 
    
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage6_6, this.dialog)
            .start();
            seq.on('complete', () => {
                 /*** db에서 stage값을 1 증가시켜줌. because,, ***/
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
    stage6_7() { //사서에게 퀴즈 한번 더 (무한 반복)

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage6_7, this.dialog)
        .start();
        seq.on('complete', () => {
            this.quiz1 = true; //퀴즈 시작
        });  
    }

    stage6_8() { //사서에게 퀴즈 받고 대사창 (무한 반복) //얏호! 또 풀었다!

        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage6_8, this.dialog)
        .start();
        seq.on('complete', () => {
            this.time.delayedCall( 1500, () => { this.isdownX=true;}, [] , this);
        });  
    }

    stage6_9() { //못 나가게
        this.player.playerPaused = true;
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage6_9, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false;
            this.time.delayedCall( 1500, () => { this.isdownX=true;}, [] , this);
            
        });  
    }



}