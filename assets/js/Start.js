var playerX;
var stagenum=0;
var username='AAA';

//데이터베이스에 접속해서 닉네임 불러와서 username 변수에 저장
var xhr = new XMLHttpRequest();
xhr.open('POST', '/get_session', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();
xhr.addEventListener('load', function() {
  var result = JSON.parse(xhr.responseText);
  console.log("nickname : "+result.nick);
  username=result.nick;
 });

class Start extends Phaser.Scene {
    constructor() {
      super("startGame");
      this.i = 0;
    }

    preload() {

      
      this.load.image("bubble","./assets/images/bubble.png");
      this.load.image("bubble2","./assets/images/bubble2.png")
 
      
      /*** 시작화면 image 로드 ***/
      this.load.image("title_menu", "./assets/images/menu/title_menu.png");
      this.load.spritesheet('logo', './assets/images/menu/logo.png', {
        frameWidth: 1100,
        frameHeight: 290,
      });

      this.load.spritesheet('start', './assets/images/menu/start.png', {
        frameWidth: 320,
        frameHeight: 267,
      });

      this.load.spritesheet('load', './assets/images/menu/load.png', {
        frameWidth: 306.6,
        frameHeight: 320,
      });

    
      /*** command 관련 image 로드 ***/
      this.load.image("entire_code_button", "./assets/images/command/entire_code_button.png");
      this.load.image("commandbox", "./assets/images/command/commandbox.png");
      this.load.image("compile_button", "./assets/images/command/execute_button.png");  //==============================================
      this.load.image("map_button", "./assets/images/command/map_button.png");

      this.load.image("tutorial", "./assets/images/tutorial.png");
      this.load.image("tutorial2", "./assets/images/tutorial2.png");
      

      //나중에 지우기 ======================================
              this.load.image("tiles", "./assets/images/map.png");
              
              /** FROM Player.js**/
              this.load.spritesheet('player', './assets/images/heroin.png', {
                frameWidth: 80,
                frameHeight: 140
            });
    
            /** 텍스트 박스에 사용하는 플러그인 rexUI preload **/
            this.load.scenePlugin({
                key: 'rexuiplugin',
                url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
                sceneKey: 'rexUI'
            });
            this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
            
            /** 순차진행에 필요한 플러그인 **/
            var url;
            url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsequenceplugin.min.js';
            this.load.plugin('rexsequenceplugin', url, true);
      //나중에 지우기 ======================================


      /*** inventory 관련 image 로드 ***/
      this.load.image("inventory_button", "./assets/images/inventory_button.png");

      /*** textbox 이미지 로드***/
      this.load.image('textbox', "./assets/images/textbox.png");

      /** 플레이어 얼굴 이미지 로드 **/
      this.load.spritesheet('face', './assets/images/face.png', {
        frameWidth: 134,
        frameHeight: 130,
    });

    /*questbox 이미지 로드 */
      this.load.image('quest_box', "./assets/images/quest_box.png");
      //help관련 image 로드
      this.load.image('help_icon', "./assets/images/help.png");
      this.load.image('help_box', "./assets/images/help_box.png");
      this.load.image('help_box2', "./assets/images/help_box2.png");


      /*** minibox 관련 image 로드 ***/
      this.load.image("minibox", "./assets/images/command/mini_commandbox.png");

      /** 아이템 이미지 로드 **/
      this.load.image("item", "./assets/images/item.png");
      this.load.image("itemGet", "./assets/images/itemget.png");

      /**휴대폰, npc 로드 */
      this.load.spritesheet("phone", "./assets/images/phone.png", {
        frameWidth: 100,
        frameHeight: 100
    });
      this.load.image("table","./assets/images/table.png");
      this.load.image("myphone","./assets/images/myphone.png");
      this.load.image("npc3", "./assets/images/npc/npc3.png");

      /*** 휴대폰 앱 로드 ***/
      this.load.image("app_code", "./assets/images/app_code.png");
      this.load.image("app_map", "./assets/images/app_map.png");
      this.load.image("app_tutorial", "./assets/images/app_tutorial.png");
      this.load.image("app_control", "./assets/images/app_control.png");

      /*** 뒤로가기 버튼 로드 ***/
      this.load.image("back_button", "./assets/images/back_button.png");
      this.load.image("back_button_on", "./assets/images/back_button_on.png");

      /** 드랍 리셋 버든 로드 **/
      this.load.image("reset_button", "./assets/images/reset_button.png");
      /** 미니맵 이미지 로드 **/
      this.load.image("map_background", "./assets/images/map/minimap.png");
      this.load.image("stage_1_button", "./assets/images/map/stage_1.png");
      this.load.image("stage_2_button", "./assets/images/map/stage_2.png");
      this.load.image("stage_3_button", "./assets/images/map/stage_3.png");
      this.load.image("stage_4_button", "./assets/images/map/stage_4.png");
      this.load.image("stage_5_button", "./assets/images/map/stage_5.png");
      this.load.image("stage_6_button", "./assets/images/map/stage_6.png");

      this.load.image("link_1", "./assets/images/map/link_1.png");
      this.load.image("link_2", "./assets/images/map/link_2.png");
      this.load.image("link_3", "./assets/images/map/link_3.png");
      this.load.image("link_4", "./assets/images/map/link_4.png");
      this.load.image("link_5", "./assets/images/map/link_5.png");

      this.load.image("back_map", "./assets/images/map/back_button.png");

      /** 불타는 배경 로드 **/
      this.load.spritesheet('fireBackground', './assets/images/fireBackground.png', {
        frameWidth: 1100,
        frameHeight: 552
    });
    /** 도서관 불빛 로드 **/
    this.load.spritesheet('librarylight', './assets/images/stage5/librarylight.png', {
      frameWidth: 102,
      frameHeight: 100
  });

    /** 느낌표 말풍선 로드 **/
    this.load.spritesheet('exp_exclam', './assets/images/exp_exclam.png', {
      frameWidth: 55,
      frameHeight: 50
    });

    /** 첫번째 스테이지의 집 이미지 로드 **/
      this.load.image("house", "./assets/images/house.png");
    /**첫번째 스테이지 npc 로드  **/
    this.load.spritesheet('npc_devil', './assets/images/npc/npc3.png', {
      frameWidth: 79,
      frameHeight: 140,
    });
    /** 첫번째 스테이지의 잠긴 휴대폰 화면 로드 **/
      this.load.image("locked", "./assets/images/commandbox_locked.png");
      this.load.image('unlocked', './assets/images/commandbox_unlocked.png')

    /** 2번째 스테이지 타일 **/
      this.load.image("stage2_tiles", "./assets/images/stage2/map_stage2.png");
    
    /** 2번째 스테이지의 npc 로드 **/
      this.load.image("npc7", "./assets/images/npc/npc7.png");
      this.load.image("npc6", "./assets/images/npc/npc6.png");
 
      this.load.spritesheet('npc_cold', './assets/images/stage2/npc_cold.png', {
        frameWidth: 65,
        frameHeight: 128,
      });
    
    /** 2번째 스테이지 이미지 로드 **/
      this.load.image("cafe", "./assets/images/stage2/cafe.png");
      this.load.image('temperature2', './assets/images/stage2/temperature2.png')
      this.load.spritesheet("temperature", "./assets/images/stage2/temperature.png", {
        frameWidth: 214,
        frameHeight: 125,
      });
      this.load.spritesheet("waterWball", "./assets/images/stage2/waterWball.png", {
        frameWidth: 200,
        frameHeight: 100,
      });
      this.load.spritesheet("water", "./assets/images/stage2/water.png", {
        frameWidth: 200,
        frameHeight: 100,
      });
      this.load.spritesheet("cry", "./assets/images/stage2/cry.png", {
        frameWidth: 125,
        frameHeight: 75,
      });

    /** 3번째 스테이지의 npc 로드 **/
      this.load.image("npc_chef", "./assets/images/npc/npc1.png");
      this.load.image("npc_chef2", "./assets/images/stage3/npc_0.png"); //stage3_0
      this.load.image("stage3_tiles", "./assets/images/stage3/map_stage3.png");

    /** 3번째 스테이지 이미지 로드 **/
      this.load.image("bread", "./assets/images/stage3/bread.png");
      this.load.image("full_bread", "./assets/images/stage3/full_bread.png");
      this.load.image("oven", "./assets/images/stage3/oven.png");
      this.load.image("oven_open", "./assets/images/stage3/oven_open.png");

      //4번째 스테이지
      this.load.image('wall','./assets/images/stage4/wall.png')

      /** 4번째 스테이지의 npc 로드 **/
      this.load.spritesheet('npc_devil2', './assets/images/npc/npc8.png', {
        frameWidth: 79,
        frameHeight: 140,
      });
      this.load.spritesheet('npc9', './assets/images/npc/npc9.png', {
        frameWidth: 81,
        frameHeight: 95,
      });
      
      //5번째 스테이지의 desk 이미지 로드
      this.load.image("library_desk", "./assets/images/stage5/desk.png");

      /**5번째 스테이지 npc 로드  **/
      this.load.spritesheet('librarian1', './assets/images/stage5/librarian1.png', {
        frameWidth: 100,
        frameHeight: 120,
      });

      this.load.spritesheet('student', './assets/images/stage5/student.png', {
        frameWidth: 90,
        frameHeight: 140,
      });

      //5번째 스테이지의 회원증 이미지 로드
      this.load.image("library_membership", "./assets/images/stage5/membership.png");
      //5번째 스테이지의 문제지 이미지 로드
      this.load.image("tests_paper", "./assets/images/stage5/tests_paper.png");
      
      /** 6번째 스테이지 이미지 로드 **/
      this.load.image("librarian2", "./assets/images/stage6/librarian2.png");
      this.load.image("OX_O", "./assets/images/stage6/OX_O.png");
      this.load.image("OX_X", "./assets/images/stage6/OX_X.png");

      this.load.image("page1", "./assets/images/stage6/bookPage1.png"); //배열 설명 페이지
      this.load.image("page2", "./assets/images/stage6/bookPage2.png");
      this.load.image("page3", "./assets/images/stage6/bookPage3.png");
      this.load.image("books", "./assets/images/stage6/books.png");
      this.load.image("bookswhy", "./assets/images/stage6/bookswhy.png");
      this.load.image("sadari", "./assets/images/stage6/sadari.png");
      this.load.image("indexQuiz", "./assets/images/stage6/indexQuiz.png");
      this.load.image("quiz11", "./assets/images/stage6/quiz11.png");
      this.load.image("quiz12", "./assets/images/stage6/quiz12.png");
      this.load.image("quiz13", "./assets/images/stage6/quiz13.png");
      this.load.image("quiz14", "./assets/images/stage6/quiz14.png");
      this.load.image("quiz15", "./assets/images/stage6/quiz15.png");
      this.load.image("quiz21", "./assets/images/stage6/quiz21.png");
      this.load.image("quiz22", "./assets/images/stage6/quiz22.png");
      this.load.image("quiz23", "./assets/images/stage6/quiz23.png");
      this.load.image("quiz24", "./assets/images/stage6/quiz24.png");
      this.load.image("quiz25", "./assets/images/stage6/quiz25.png");

      //기타
      this.load.image("standing_student", "./assets/images/npc/npc4_student.png");

    } 
    
    

    create() {

      this.anims.create({
        key: "logo",
        frames: this.anims.generateFrameNumbers('logo',{ start: 0, end: 2}), 
        frameRate: 3,
        repeat: -1,
    });
    this.anims.create({
      key: "start",
      frames: this.anims.generateFrameNumbers('start',{ start: 0, end: 2}), 
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "load",
      frames: this.anims.generateFrameNumbers('load',{ start: 0, end: 1}), 
      frameRate: 3,
      repeat: -1,
  });

    var title = this.add.sprite(0, 10, 'logo').setOrigin(0, 0);
    this.NEW_GAME_button = this.add.sprite(180, 600, 'start').setOrigin(0, 1).setInteractive();
    this.CONTINUE_button = this.add.sprite(550, 600,'load').setOrigin(0, 1).setInteractive();

    title.play('logo');
    this.NEW_GAME_button.play('start');
    this.CONTINUE_button.play('load');
    /*
      this.hsv = Phaser.Display.Color.HSVColorWheel();

      var title = this.add.image(170, 100, 'title_menu').setOrigin(0, 0);
      this.NEW_GAME_button = this.add.text(385, 345, 'NEW GAME', { font: "30px Arial Black", fill: "#000" });
      this.CONTINUE_button = this.add.text(386, 420, 'CONTINUE', { font: "30px Arial Black", fill: "#fff" });

      // 버튼 활성화
      this.NEW_GAME_button.setInteractive();
      this.CONTINUE_button.setInteractive();

      // 색 그라데이션 넣기 위한 초석?
      this.NEW_GAME_button.setStroke('#fff', 5);
      this.NEW_GAME_button.setShadow(2, 2, "#333333", 2, true, true);
      this.CONTINUE_button.setStroke('#00f', 5);
      this.CONTINUE_button.setShadow(2, 2, "#333333", 2, true, true);

      // 틀 만들어줘서 마우스 올리고 내릴 때 색변화 주기
      var graphics = this.add.graphics();
      graphics.lineStyle(3, 0x483D8B);
      graphics.strokeRect(380, 340, 202, 50);
      graphics.strokeRect(380, 415, 202, 50);
      */

      // 마우스 올렸을 때 색변화
      this.NEW_GAME_button.on('pointerover', function (pointer) {
        this.anims.stop();
        this.setFrame(3);
      });
      this.CONTINUE_button.on('pointerover', function (pointer) {
        this.anims.stop();
        this.setFrame(2);
      });
      // 마우스 안 올렸을 때 원래 색으로
      this.NEW_GAME_button.on('pointerout', function () {
        this.play('start');

      });
      this.CONTINUE_button.on('pointerout', function () {
        this.play('load');
      });

      this.isnewgame=0;
      // 클릭하면 게임 시작
      this.NEW_GAME_button.once("pointerup", function () {
        this.isnewgame=1;
      }, this);
      this.CONTINUE_button.once("pointerup", function () {
        this.scene.start("bootGame");
      }, this);

    }


    // 색 그라데이션 계속해서 바뀜
    update() {
      /*
      const top = this.hsv[this.i].color;
      const bottom = this.hsv[359 - this.i].color;

      this.NEW_GAME_button.setTint(top, top, bottom, bottom);
      this.CONTINUE_button.setTint(top, top, bottom, bottom);

      this.i++;

      if (this.i === 360) {
        this.i = 0;
      }
      */


      if(this.isnewgame==1){
        this.tutorial = this.add.image(0,0,"tutorial").setOrigin(0,0);
        this.tutorial.setInteractive();
        this.tutorial.once("pointerdown",function(){
          this.isnewgame=2;
          this.tutorial.setVisible(false);
        },this);
      }else if(this.isnewgame==2){
        this.tutorial2 = this.add.image(0,0,"tutorial2").setOrigin(0,0);
        this.tutorial2.setInteractive();
        this.tutorial2.once("pointerdown",function(){
          this.scene.start("zero_stage");
        },this);
      }
    }
  
}