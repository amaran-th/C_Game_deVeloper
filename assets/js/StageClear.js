export default class StageClear extends Phaser.Scene {
    constructor(scene) {
        super("StageClear");
        
        
        this.npc3 = scene.add.image(150,400,'npc3').setOrigin(0,0);
        this.npc3.setInteractive();

        this.npc3.on('pointerdown', () => {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/stage', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send();
    
            xhr.addEventListener('load', function() {
                var result = JSON.parse(xhr.responseText);
                if(result.is_logined){
                    console.log("Stage Clear! 현재 스테이지는 : " + result.stage)
                }else{
                    console.log("로그인이 정상적으로 이루어지지 않았습니다.")
                }                
            });
        });
         

      

    }

}