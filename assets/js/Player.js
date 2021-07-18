export default class Player extends Phaser.Scene {
    constructor(scene, x, y) {
        super("Player"); //identifier for the scene
        this.scene = scene;
        const anims = scene.anims;

        anims.create({
            key: "playerWalk",
            frames: anims.generateFrameNumbers('player',{ start: 0, end: 2}), //this 지우기
            frameRate: 7,
            repeat: -1
        });
        this.player = scene.physics.add.sprite(x ,y, 'player', 0); // x,y좌표, source

        this.cursorsKeys = scene.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true); //make player don't escape the screen
       
        console.log("construction of Player");

    }

    preload() {
        //플레이어 스프라이트 시트는 player.js 대신 맵에서 미리 불러와준다.
        /*
        this.load.spritesheet('player', './assets/images/p
        layer.png', {
            frameWidth: 80,
            frameHeight: 140
        });
        console.log('preload player');
        */
    }
    
    update() {

                if(this.cursorsKeys.left.isDown){
                    this.player.setVelocityX(-200); //싯...파... 여기서 main의 게임세팅에 접근하는 방법 모르겠음...
                    this.player.play("playerWalk", true);
                } else if(this.cursorsKeys.right.isDown){
                    this.player.setVelocityX(200);
                    this.player.play("playerWalk", true);
                }else {
                    this.player.setFrame(1);
                    this.player.setVelocityX(0);
                }
                
                /*** 걷는 방향에 따라 보는 방향 다르게 하기 ***/
                if (this.player.body.velocity.x > 0) {
                    this.player.setFlipX(false);
                  } else if (this.player.body.velocity.x < 0) {
                    this.player.setFlipX(true);
                  }

                if(this.cursorsKeys.up.isDown && this.player.body.onFloor() ){
                    this.player.setVelocityY(-300); //jump
                }
                console.log("player.update");
    }
}