var stage
/***  stage값 가져오기 ***/ //preload에서 갖고와야함!!!
var xhr = new XMLHttpRequest();
xhr.open('POST', '/stage/check', true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send();

xhr.addEventListener('load', function() {
var result = JSON.parse(xhr.responseText);
console.log("======== 현재 스테이지는 : " + result.stage + " ========")
stage = result.stage;
}); 

class Stage extends Phaser.Scene {
    constructor(scene) { // 안에 매개변수 그런 건 필요한 걸로 하면 됩니다!
        super(scene);

        scene.add.existing(this); // 이게 있어야 모듈 안 써도 내부 변수 다른 js 파일에 호출할 수 있음

        console.log("Stage.js 테스트",stage);

        
    }
    create(scene){

    }

    plus(){
         /*** db에서 stage값을 1 증가시켜줌. ***/
         var xhr = new XMLHttpRequest();
         xhr.open('POST', '/stage', true);
         xhr.setRequestHeader('Content-type', 'application/json');
         xhr.send();

         stage++;

         console.log("[스테이지 증가]", stage)
    }
}