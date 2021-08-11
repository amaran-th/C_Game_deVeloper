var stagenum;

class Start extends Phaser.Scene {
    constructor() {
      super("startGame");
      this.i = 0;
    }

    preload() {
      

      
      /*** 시작화면 image 로드 ***/
      this.load.image("title_menu", "./assets/images/menu/title_menu.png");
    
      /*** command 관련 image 로드 ***/
      this.load.image("entire_code_button", "./assets/images/command/entire_code_button.png");
      this.load.image("commandbox", "./assets/images/command/commandbox.png");
      this.load.image("compile_button", "./assets/images/command/execute_button.png");  //==============================================
      this.load.image("map_button", "./assets/images/command/map_button.png");

      /*** inventory 관련 image 로드 ***/
      this.load.image("inventory_button", "./assets/images/inventory_button.png");

      /*** textbox 이미지 로드***/
      this.load.image("textbox", "./assets/images/textbox.png");

      /** 플레이어 얼굴 이미지 로드 **/
      this.load.spritesheet('face', './assets/images/face.png', {
        frameWidth: 134,
        frameHeight: 130,
    });
      /*** minibox 관련 image 로드 ***/
      this.load.image("minibox", "./assets/images/command/mini_commandbox.png");

      /** 아이템 이미지 로드 **/
      this.load.image("item", "./assets/images/item.png");
      this.load.image("itemGet", "./assets/images/itemget.png");

      /**휴대폰, npc 로드 */
      this.load.image("phone", "./assets/images/phone.png");
      this.load.image("npc3", "./assets/images/npc/npc3.png");

      /*** 휴대폰 앱 로드 ***/
      this.load.image("app_code", "./assets/images/app_code.png");
      this.load.image("app_map", "./assets/images/app_map.png");
      this.load.image("app_tutorial", "./assets/images/app_tutorial.png");

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


    } 

    create() {
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
      // 마우스 올렸을 때 색변화
      this.NEW_GAME_button.on('pointerover', function () {
        graphics.lineStyle(3, 0x00ffff);
        graphics.strokeRect(380, 340, 202, 50);
      });
      this.CONTINUE_button.on('pointerover', function () {
        graphics.lineStyle(3, 0x00ffff);
        graphics.strokeRect(380, 415, 202, 50);
      });
      // 마우스 안 올렸을 때 원래 색으로
      this.NEW_GAME_button.on('pointerout', function () {
        graphics.lineStyle(3, 0x483D8B);
        graphics.strokeRect(380, 340, 202, 50);
      });
      this.CONTINUE_button.on('pointerout', function () {
        graphics.lineStyle(3, 0x483D8B);
        graphics.strokeRect(380, 415, 202, 50);
      });

      // 클릭하면 게임 시작
      this.NEW_GAME_button.once("pointerup", function () {
        this.scene.start("bootGame");
      }, this);
      this.CONTINUE_button.once("pointerup", function () {
        this.scene.start("bootGame");
      }, this);

    }

    // 색 그라데이션 계속해서 바뀜
    update() {
      const top = this.hsv[this.i].color;
      const bottom = this.hsv[359 - this.i].color;

      this.NEW_GAME_button.setTint(top, top, bottom, bottom);
      this.CONTINUE_button.setTint(top, top, bottom, bottom);

      this.i++;

      if (this.i === 360) {
        this.i = 0;
      }
    }
}