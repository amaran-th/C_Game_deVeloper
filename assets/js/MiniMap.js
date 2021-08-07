

class MiniMap extends Phaser.Scene {   
    constructor(){ 
        super("minimap"); //identifier for the scene
    }
    
    create () {
        this.add.image(0,0,"map_background").setOrigin(0,0);    //이미지 중심을 0,0 위치로 잡는다.
        var stage_1=this.add.image(100,100,"stage_1_button").setOrigin(0,0);
        var stage_2=this.add.image(300,100,"stage_2_button").setOrigin(0,0);
        var stage_3=this.add.image(500,100,"stage_3_button").setOrigin(0,0);

        stage_1.setInteractive();
        stage_2.setInteractive();
        stage_3.setInteractive();

        stage_1.once("pointerup",function(){
            this.scene.start("first_stage");
        },this);

        
    }

    update() {
        
        
    }


    playerOnTile() {
        
    }
}
