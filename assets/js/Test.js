var TestScene = class Test extends Phaser.Scene {
    constructor(){
        super("Scene1"); //identifier for the scene
        console.log("construction of Test class");
    }

    preload() {
        this.load.image('player', 'assets/image/snake.png');
    }
    creat() {
        this.player = this.physics.add.sprite(100,game.config.height/2,'player');
        this.cursors = this.input.keyboard.createCursorKeys(); 
    }
    update() {
        moveAmt = 200;
        this.player.setDrag(2000);

        if(this.cursors.right.isDown)
            this.player.setVelocityX(moveAmt);
    }
}
