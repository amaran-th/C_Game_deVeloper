class Start extends Phaser.Scene {
    constructor() {
      super("startGame");
    }

    preload() {
      this.load.image("title_menu", "./assets/images/menu/title_menu.png"); 
      this.load.image("start_menu", "./assets/images/menu/start_menu.png");
      this.load.image("option_menu", "./assets/images/menu/option_menu.png");
      this.load.image("login_menu", "./assets/images/menu/login_menu.png");
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