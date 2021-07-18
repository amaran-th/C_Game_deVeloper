class TestScene extends Phaser.Scene {
    constructor(){ 
        super("bootGame"); //identifier for the scene
        console.log("construction of TestScene");
    }
    preload() {
        this.load.image('player', './assets/images/heroin.png');
        console.log("preloading player image");
    }
    create () {
        this.player = this.physics.add.image(config.width/2,config.height/2,'player');
        
        this.cursorsKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true); //make player don't escape the screen
        console.log("create player image");

        /*** 명령창버튼 활성화 ***/
        this.entire_code_button = this.add.image(20,20,'entire_code_button').setOrigin(0,0);
        this.entire_code_button.setInteractive();
        this.entire_code_button.on('pointerup', () => { //명령창 띄우기
            this.commandbox = this.add.image(400 + 15, 5,'commandbox').setOrigin(0,0);
        });

        /*** 명령창 슬라이드 ***/
        
    }
   
    update() {
        this.movePlayerManager();
    }

    movePlayerManager() {
            if(this.cursorsKeys.left.isDown){
                this.player.setVelocityX(-gameSettings.playerSpeed);
            }
            else if(this.cursorsKeys.right.isDown){
                this.player.setVelocityX(gameSettings.playerSpeed);
            } else {
                this.player.setVelocityX(0);
            }
            
            if(this.cursorsKeys.up.isDown){
                this.player.setVelocityY(-300); //jump
            }
            console.log("move player image");
    }

}
