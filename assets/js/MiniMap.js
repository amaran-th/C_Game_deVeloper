

class MiniMap extends Phaser.Scene {   
    constructor(){ 
        super("minimap"); //identifier for the scene
    }
    
    create () {
        this.stageNum

        var back=this.add.image(0,0,"map_background").setOrigin(0,0);    //이미지 중심을 0,0 위치로 잡는다.
        var stage_1=this.add.image(100,100,"stage_1_button").setOrigin(0,0);
        var stage_2=this.add.image(300,100,"stage_2_button").setOrigin(0,0);
        var stage_3=this.add.image(500,100,"stage_3_button").setOrigin(0,0);
        var stage_4=this.add.image(700,100,"stage_4_button").setOrigin(0,0);
        var stage_5=this.add.image(900,100,"stage_5_button").setOrigin(0,0);
        var stage_6=this.add.image(100,300,"stage_6_button").setOrigin(0,0);

        back.setInteractive();
        stage_1.setInteractive();
        stage_2.setInteractive();
        stage_3.setInteractive();
        stage_4.setInteractive();
        stage_5.setInteractive();
        stage_6.setInteractive();

        stage_1.once("pointerdown",function(){
            back.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);
            if(stagenum == 0){
                this.scene.stop('bootgame');
                this.scene.run('first_stage');
            }else if(stagenum==1){
                this.scene.stop('first_stage');
                this.scene.run('first_stage');
            }
            else if(stagenum==2){
                this.scene.stop('second_stage');
                this.scene.run('first_stage');
            }
            else if(stagenum==3){
                this.scene.stop('third_stage');
                this.scene.run('first_stage');
            }else if(stagenum==4){
                this.scene.stop('fourth_stage');
                this.scene.run('first_stage');
            }else if(stagenum==5){
                this.scene.stop('fifth_stage');
                this.scene.run('first_stage');
            }else if(stagenum==6){
                this.scene.stop('sixth_stage');
                this.scene.run('first_stage');
            }
        },this);

        stage_2.once("pointerdown",function(){
            back.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);
            if(stagenum == 0){
                this.scene.stop('bootgame');
                this.scene.run('second_stage');
            }else if(stagenum==1){
                this.scene.stop('first_stage');
                this.scene.run('second_stage');
            }
            else if(stagenum==2){
                this.scene.stop('second_stage');
                this.scene.run('second_stage');
            }
            else if(stagenum==3){
                this.scene.stop('third_stage');
                this.scene.run('second_stage');
            }
            else if(stagenum==4){
                this.scene.stop('fourth_stage');
                this.scene.run('second_stage');
            }else if(stagenum==5){
                this.scene.stop('fifth_stage');
                this.scene.run('second_stage');
            }else if(stagenum==6){
                this.scene.stop('sixth_stage');
                this.scene.run('second_stage');
            }
        },this);

        stage_3.once("pointerdown",function(){
            back.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);
            if(stagenum == 0){
                this.scene.stop('bootgame');
                this.scene.run('third_stage');
            }else if(stagenum==1){
                this.scene.stop('first_stage');
                this.scene.run('third_stage');
            }
            else if(stagenum==2){
                this.scene.stop('second_stage');
                this.scene.run('third_stage');
            }
            else if(stagenum==3){
                this.scene.stop('third_stage');
                this.scene.run('third_stage');
            }else if(stagenum==4){
                this.scene.stop('fourth_stage');
                this.scene.run('third_stage');
            }else if(stagenum==5){
                this.scene.stop('fifth_stage');
                this.scene.run('third_stage');
            }else if(stagenum==6){
                this.scene.stop('sixth_stage');
                this.scene.run('third_stage');
            }
        },this);

        stage_4.once("pointerdown",function(){
            back.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);
            if(stagenum == 0){
                this.scene.stop('bootgame');
                this.scene.run('fourth_stage');
            }else if(stagenum==1){
                this.scene.stop('first_stage');
                this.scene.run('fourth_stage');
            }
            else if(stagenum==2){
                this.scene.stop('second_stage');
                this.scene.run('fourth_stage');
            }
            else if(stagenum==3){
                this.scene.stop('third_stage');
                this.scene.run('fourth_stage');
            }else if(stagenum==4){
                this.scene.stop('fourth_stage');
                this.scene.run('fourth_stage');
            }else if(stagenum==5){
                this.scene.stop('fifth_stage');
                this.scene.run('fourth_stage');
            }else if(stagenum==6){
                this.scene.stop('sixth_stage');
                this.scene.run('fourth_stage');
            }
        },this);

        stage_5.once("pointerdown",function(){
            back.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);
            if(stagenum == 0){
                this.scene.stop('bootgame');
                this.scene.run('fifth_stage');
            }else if(stagenum==1){
                this.scene.stop('first_stage');
                this.scene.run('fifth_stage');
            }
            else if(stagenum==2){
                this.scene.stop('second_stage');
                this.scene.run('fifth_stage');
            }
            else if(stagenum==3){
                this.scene.stop('third_stage');
                this.scene.run('fifth_stage');
            }else if(stagenum==4){
                this.scene.stop('fourth_stage');
                this.scene.run('fifth_stage');
            }else if(stagenum==5){
                this.scene.stop('fifth_stage');
                this.scene.run('fifth_stage');
            }else if(stagenum==6){
                this.scene.stop('sixth_stage');
                this.scene.run('fifth_stage');
            }
        },this);

        stage_6.once("pointerdown",function(){
            back.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);
            if(stagenum == 0){
                this.scene.stop('bootgame');
                this.scene.run('sixth_stage');
            }else if(stagenum==1){
                this.scene.stop('first_stage');
                this.scene.run('sixth_stage');
            }
            else if(stagenum==2){
                this.scene.stop('second_stage');
                this.scene.run('sixth_stage');
            }
            else if(stagenum==3){
                this.scene.stop('third_stage');
                this.scene.run('sixth_stage');
            }else if(stagenum==4){
                this.scene.stop('fourth_stage');
                this.scene.run('sixth_stage');
            }else if(stagenum==5){
                this.scene.stop('fifth_stage');
                this.scene.run('sixth_stage');
            }else if(stagenum==6){
                this.scene.stop('sixth_stage');
                this.scene.run('sixth_stage');
            }
        },this);




        back.on("pointerdown",function(){
            console.log("click");
            console.log(stagenum);
            back.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);
            
            //this.scene.stop('minimap');

            if(stagenum == 0){
                console.log("back satage0");
                this.scene.stop('minimap');
                this.scene.run('zero_stage');
            }else if(stagenum==1){
                console.log("back satage1");
                this.scene.stop('minimap');
                this.scene.run('first_stage');
            }
            else if(stagenum==2){
                console.log("back satage2");
                this.scene.stop('minimap');
                this.scene.run('second_stage');
            }
            else if(stagenum==3){
                console.log("back satage3");
                this.scene.stop('minimap');
                this.scene.run('third_stage');
            }else if(stagenum==4){
                console.log("back satage3");
                this.scene.stop('minimap');
                this.scene.run('fourth_stage');
            }else if(stagenum==5){
                console.log("back satage3");
                this.scene.stop('minimap');
                this.scene.run('fifth_stage');
            }else if(stagenum==6){
                console.log("back satage3");
                this.scene.stop('minimap');
                this.scene.run('sixth_stage');
            }
            
        },this);



        
    }

    update() {
        
        
    }


    playerOnTile() {
        
    }
}
