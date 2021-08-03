
export default class Minibox extends Phaser.Scene {
    constructor(scene) {
        super("Minibox");
        
        //기존코드
        this.mini_content_text = [  
            "#include <stdio.h> \n int main(){ \n + (\"HI\") +"
        ]; 
        //text를 box보다 더 뒤에 놔둬야 보임!
        this.minibox = scene.add.image(200, 100,'minibox').setOrigin(0,0);
        this.mini_text = scene.add.text(220, 120, this.mini_content_text, { fontFamily: 'Arial', color: '#ffffff', wordWrap: { width: 500 } }).setOrigin(0,0);     
     

      

    }

    update(scene) {
        this.minibox.setVisible(true);
        this.mini_text.setVisible(true);
        this.minibox.x = scene.worldView.x + 200; //line 114, x축으로 200 + y축 100
        this.mini_text.x = scene.worldView.x + 210;

        this.mini_content_text = [
            "#include <stdio.h> \n int main(){ \n " + scene.code_zone_1 + " (\"HI\"); \n } 2번째 코드 :" +  scene.code_zone_2 + "\n 3번째 코드 :  " + scene.code_zone_3 
        ]; 

        this.mini_text.setText(this.mini_content_text);
    }

}