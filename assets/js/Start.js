class Start extends Phaser.Scene {
    constructor() {
      super("startGame");
    }

    preload() {
      /*** 시작화면 image 로드 ***/
      this.load.image("title_menu", "./assets/images/menu/title_menu.png"); 
      this.load.image("start_menu", "./assets/images/menu/start_menu.png");
      this.load.image("option_menu", "./assets/images/menu/option_menu.png");
      this.load.image("login_menu", "./assets/images/menu/login_menu.png");
    
      /*** command 관련 image 로드 ***/
      this.load.image("entire_code_button", "./assets/images/command/entire_code_button.png");
      this.load.image("commandbox", "./assets/images/command/commandbox.png");
      this.load.image("compile_button", "./assets/images/command/execute_button.png");  //==============================================

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

    }

    create() {
      var title_button = this.add.image(400, 190, 'title_menu', this.startGame, this);
      var start_button = this.add.image(385, 345, 'start_menu', this.startGame, this);
      var option_button = this.add.image(380, 420, 'option_menu', this.startGame, this);
      var login_button = this.add.image(380, 500, 'login_menu', this.startGame, this);
      
      start_button.setInteractive();
      option_button.setInteractive();
      login_button.setInteractive();

      start_button.once("pointerup", function () {

        this.scene.start("bootGame");

      }, this);

    }

}