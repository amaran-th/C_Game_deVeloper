

class MiniMap extends Phaser.Scene {   
    constructor(){ 
        super("minimap"); //identifier for the scene
        /***  stage값 가져오기 ***/ //preload에서 갖고와야함!!!

        
    }
    preload() {
        
    }
    create () {
        //this.stageNum
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/stage/check', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();

        xhr.addEventListener('load', function() {
        var result = JSON.parse(xhr.responseText);
        console.log("[minimap] 현재 스테이지는 : " + result.stage + " ========")
        stage = result.stage;
        });

        var background=this.add.image(0,0,"map_background").setOrigin(0,0);    //이미지 중심을 0,0 위치로 잡는다.
        var stage_1=this.add.image(80,70,"stage_1_button").setOrigin(0,0);
        var stage_2=this.add.image(350,70,"stage_2_button").setOrigin(0,0);
        var stage_3=this.add.image(620,50,"stage_3_button").setOrigin(0,0);
        var stage_4=this.add.image(850,280,"stage_4_button").setOrigin(0,0);
        var stage_5=this.add.image(560,350,"stage_5_button").setOrigin(0,0);
        var stage_6=this.add.image(260,340,"stage_6_button").setOrigin(0,0);
        var back_button=this.add.image(50,550,"back_map").setOrigin(0,1);

        //연결다리 색
        var link_1 =this.add.image(0,0,"link_1").setOrigin(0,0);
        var link_2 =this.add.image(0,0,"link_2").setOrigin(0,0);
        var link_3 =this.add.image(0,0,"link_3").setOrigin(0,0);
        var link_4 =this.add.image(0,0,"link_4").setOrigin(0,0);
        var link_5 =this.add.image(0,0,"link_5").setOrigin(0,0);

        back_button.setInteractive();
        stage_1.setInteractive();
        stage_2.setInteractive();
        stage_3.setInteractive();
        stage_4.setInteractive();
        stage_5.setInteractive();
        stage_6.setInteractive();

        stage_1.setVisible(false);
        stage_2.setVisible(false);
        stage_3.setVisible(false);
        stage_4.setVisible(false);
        stage_5.setVisible(false);
        stage_6.setVisible(false);

        link_1.setVisible(false);
        link_2.setVisible(false);
        link_3.setVisible(false);
        link_4.setVisible(false);
        link_5.setVisible(false);

        if (stage>=2){ //악마 퀘 완료해야 악마길거리? 로 갈 수 있음.

            console.log("[]3");
            stage_1.setVisible(true);
        }
        if (stage>=4){//유딩퀘까지 다 완료후, 이제 갈 수 있음.
            
            stage_2.setVisible(true);

            link_1.setVisible(true);

        }
        if (stage>=6){//빵집퀘 완료후
            stage_3.setVisible(true);

            link_2.setVisible(true);
        }
        if (stage>=8){// 관문퀘 완료후
            stage_4.setVisible(true);

            link_3.setVisible(true);

            
        }
        if (stage>=10){// 회원증 받고 나서
            stage_5.setVisible(true);

            link_4.setVisible(true);

        }
        if (stage>=13){// 사서2 퀴즈 완료
            stage_6.setVisible(true);

            link_5.setVisible(true);

        }

        stage_1.once("pointerdown",function(){//집 버튼 눌렀을때.
            background.setVisible(false);
            back_button.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);

            link_1.setVisible(false);
            link_2.setVisible(false);
            link_3.setVisible(false);
            link_4.setVisible(false);
            link_5.setVisible(false);

            this.scene.stop('minimap');
            this.scene.run('zero_stage');
        
        },this);

        stage_2.once("pointerdown",function(){
            background.setVisible(false);
            back_button.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);

            link_1.setVisible(false);
            link_2.setVisible(false);
            link_3.setVisible(false);
            link_4.setVisible(false);
            link_5.setVisible(false);

            this.scene.stop('minimap');
            this.scene.run('second_stage');
        },this);

        stage_3.once("pointerdown",function(){
            background.setVisible(false);
            back_button.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);

            link_1.setVisible(false);
            link_2.setVisible(false);
            link_3.setVisible(false);
            link_4.setVisible(false);
            link_5.setVisible(false);


            this.scene.stop('minimap');
            this.scene.run('third_stage_0');
    
        },this);

        stage_4.once("pointerdown",function(){
            background.setVisible(false);
            back_button.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);

            link_1.setVisible(false);
            link_2.setVisible(false);
            link_3.setVisible(false);
            link_4.setVisible(false);
            link_5.setVisible(false);

            this.scene.stop('minimap');
            this.scene.run('fourth_stage');


        },this);

        stage_5.once("pointerdown",function(){
            background.setVisible(false);
            back_button.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);

            link_1.setVisible(false);
            link_2.setVisible(false);
            link_3.setVisible(false);
            link_4.setVisible(false);
            link_5.setVisible(false);
            
            this.scene.stop('minimap');
            this.scene.run('fifth_stage');

        },this);

        stage_6.once("pointerdown",function(){
            background.setVisible(false);
            back_button.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);

            link_1.setVisible(false);
            link_2.setVisible(false);
            link_3.setVisible(false);
            link_4.setVisible(false);
            link_5.setVisible(false);
            
            this.scene.stop('minimap');
            this.scene.run('sixth_stage');

        },this);




        back_button.on("pointerdown",function(){
            console.log("click");
            console.log(stagenum);
            background.setVisible(false);
            back_button.setVisible(false);
            stage_1.setVisible(false);
            stage_2.setVisible(false);
            stage_3.setVisible(false);
            stage_4.setVisible(false);
            stage_5.setVisible(false);
            stage_6.setVisible(false);

            link_1.setVisible(false);
            link_2.setVisible(false);
            link_3.setVisible(false);
            link_4.setVisible(false);
            link_5.setVisible(false);
            
            //this.scene.stop('minimap');

            if(stagenum == 0){
                console.log("back stage0");
                this.scene.stop('minimap');
                this.scene.run('zero_stage');
            }else if(stagenum==1){
                console.log("back stage1");
                this.scene.stop('minimap');
                this.scene.run('first_stage');
            }
            else if(stagenum==2){
                console.log("back stage2");
                this.scene.stop('minimap');
                this.scene.run('second_stage');
            }
            else if(stagenum==3){
                console.log("back stage3");
                this.scene.stop('minimap');
                this.scene.run('third_stage');
            }else if(stagenum==3.1){
                console.log("back stage3.1");
                this.scene.stop('minimap');
                this.scene.run('third_stage_0');
            }else if(stagenum==4){
                console.log("back stage4");
                this.scene.stop('minimap');
                this.scene.run('fourth_stage');
            }else if(stagenum==5){
                console.log("back satage5");
                this.scene.stop('minimap');
                this.scene.run('fifth_stage');
            }
            else if(stagenum==6){
                console.log("back satage6");
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
