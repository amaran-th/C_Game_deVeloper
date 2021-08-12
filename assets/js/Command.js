var state = 0;
var text;
var code_on = false;
var app_on = false;
import Stage1 from "./Stage1.js";

export default class Command extends Phaser.GameObjects.Image {
    constructor(scene, map, name) {
        super(scene, map, name);

        var stage1 = new Stage1();

        // ...
        scene.add.existing(this);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = scene.cameras.main.worldView;


        /*** 명령창버튼 활성화 ***/
        this.entire_code_button = scene.add.image(20,10,'entire_code_button').setOrigin(0,0);
        this.entire_code_button.setInteractive();

        /*** 컴파일버튼 활성화 ***/ //@@@@@@@@@@@
        this.compile_button = scene.add.image(20,170,'compile_button').setOrigin(0,0);
        this.compile_button.setInteractive();
    
        /*** 명령창, 명령창 내용 zone 미리 add해주기 ***/
        this.commandbox = scene.add.image(map.widthInPixels, 5,'commandbox').setOrigin(0,0);
        this.zone = scene.add.zone(map.widthInPixels, 100,  360, 550).setOrigin(0).setInteractive();
        text = scene.add.text(map.widthInPixels, 100, scene.contenttext, {  font: "25px Arial", color: '#ffffff', wordWrap: { width: 350 } }).setOrigin(0,0);

        /*** 폰 앱들 넣어주기 ***/
        var app_names = ['app_code', 'app_map', 'app_tutorial'];
        this.apps = [];
        for(var i=0; i < app_names.length; i++){
            const j = i;
            this.apps[j] = scene.add.image(map.widthInPixels, 80 + (parseInt(i / 2))*130, app_names[j]).setOrigin(0).setInteractive();
            this.apps[j].on('pointerup', function () { 
                app_on = true;
                //눌려졌는지 확인용으로 클릭됐다는 메시지 띄움
                var text_ex = scene.add.text(200, 100 + j*20, app_names[j]+' is click!', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                switch(j){
                    case 0:
                        // case 0 안으로 들어왔는지 확인용으로 0 띄움
                        scene.add.text(300, 10, '0', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                        code_on = true;
                        break;
                    case 1:
                        // case 1 안으로 들어왔는지 확인용으로 1 띄움
                        scene.add.text(310, 10, '1', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                        // HELP HELP 맵 이동 어떻게 하는지 모르겠음.. 
                        scene.cameras.main.fadeOut(100, 0, 0, 0); //is not a function error
                        console.log('맵이동');
                        scene.scene.sleep(name); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
                        scene.scene.run("minimap");
                        break;
                    case 2:
                        scene.add.text(350, 100, '음... 튜토리얼 뭘 넣어야 하는거징..', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                        break;
                    default:
                        scene.add.text(400, 300, 'default zone... why?', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                        break;
                }
            });
        }

        /*** 뒤로가기 버튼 ***/
        this.back_button = scene.add.image(map.widthInPixels, 538, 'back_button').setOrigin(0).setInteractive();
        /*
        this.back_button.on('pointerover', function () {
            this.back_button.destroy();
            this.back_button = scene.add.image(map.widthInPixels, 550, 'back_button_on').setOrigin(0).setInteractive();
        });
        this.back_button.on('pointerout', function () { 
            this.back_button.destroy();
            this.back_button = scene.add.image(map.widthInPixels, 550, 'back_button').setOrigin(0).setInteractive();
        });
        */
        this.back_button.on('pointerup', function () {
            console.log('out app_on : '+app_on);
            if(app_on == true){
                console.log("heuhe");
                app_on = false;
                code_on = false;
                text.setVisible(false);
                console.log('in app_on : '+app_on);
                console.log('code_on : '+code_on);
            }
        });



        /*** 명령창에 전체코드 띄우고 드래그 할 수 있기위한 설정 ***/
        this.graphics = scene.make.graphics(); 
        var mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
        text.setMask(mask);


        /*** 컴파일 버튼 누를시 컴파일러 동작. ***/ //@@@@@@@@@@@
        this.compile_button.on('pointerdown', () => {
           
            if (scene.contenttext !== '')
                {
                    var data = {

                        'code': scene.contenttext
    
                    };
                    data = JSON.stringify(data);

                    var xhr = new XMLHttpRequest();

                    xhr.open('POST', '/form_test', true);                
                    
                    xhr.setRequestHeader('Content-type', 'application/json');
                    xhr.send(data);
                    xhr.addEventListener('load', function() {
                        
                        var result = JSON.parse(xhr.responseText);
    
                        if (result.result != 'ok') return;
                        scene.out = result.output;
                        console.log(result.output);
                        console.log('command 파일 result:', result.output);
                        stage1.complied(sc, result.output);
                        //document.getElementById('testoutput').value = result.output;
    
                    });
                    //  Turn off the click events
                    //this.removeListener('click');
                    //  Hide the login element
                    //this.setVisible(false);
                    //  Populate the text with whatever they typed in
                    //text.setText('Welcome ' + inputText.value);
                }
                else
                {
                    //  Flash the prompt 이거 뭔지 모르겠음 다른 곳에서 긁어옴
                    this.scene.tweens.add({
                        targets: text,
                        alpha: 0.2,
                        duration: 250,
                        ease: 'Power3',
                        yoyo: true
                    });
                            }
            console.log(" compile finish!!!");
           
        });

    }

    preUpdate(time, delta) {
        //console.log('state' + state);
        /*** 화면 이동시 entire code button 따라가도록 설정***/
        this.entire_code_button.x = this.worldView.x + 5;
        /*** 버튼 클릭마다 명령창 띄웠다 없앴다 ***/
        if(state == 0) {
            this.entire_code_button.on('pointerdown', () => { //명령창 띄우기
                this.commandbox.setVisible(true);
                for(var i=0; i < this.apps.length; i++){
                    this.apps[i].setVisible(true);
                }
                this.back_button.setVisible(true);
                //this.slidebox(); //슬라이드 기능 수치가 중간에 이상해져서 될 때 있고 안 될 때 있음(일단 빼두겠음)
                state = 1;
            });
        } else {
            this.commandbox.x = this.worldView.x + 715; //화면 이동시 명령창 따라가도록 설정
            this.back_button.x = this.worldView.x + 980;
            for(var i=0; i < this.apps.length; i++){
                this.apps[i].x = this.worldView.x + 755 + (i%2)*170;
            }
            if(code_on === true){
                for(var i=0; i < this.apps.length; i++){
                    this.apps[i].setVisible(false);
                }
                text.setVisible(true);
                text.x = this.worldView.x + 760;
                this.graphics.fillRect(text.x -5, 100, 360, 550); // 화면 이동시 글이 보이는 판을 이동
                this.zone.x = text.x -5;
                this.zone.on('pointermove', function (pointer) {
                    if (pointer.isDown){
                        text.y += (pointer.velocity.y / 5000);
                        text.y = Phaser.Math.Clamp(text.y, -400, 600);
                        //this.extext.setVisible(true);
                    }
                });
            } else {
                text.setVisible(false);
                for(var i=0; i < this.apps.length; i++){
                    this.apps[i].setVisible(true);
                }
            }
            this.entire_code_button.on('pointerdown', () => {
                this.commandbox.setVisible(false);
                for(var i=0; i < this.apps.length; i++){
                    this.apps[i].setVisible(false);
                }
                code_on = false;
                text.setVisible(false);
                this.back_button.setVisible(false);
                state = 0;
            });
        }
    }
    /*** 명령창 슬라이드 함수 ***/
    //js 파일 분리 후 method?들 적용 안 돼서 에러 뜸 (어차피 지금 slide기능 제대로 작동 안되니 나중에 추가기능 넣을때 마저 수정해보겠음)
    /*slidebox() {
        scene.tweens.add({
            targets: this.commandbox,
            x: this.worldView.x + 415,
            ease: 'Power3'
        });
        //console.log("3:"+this.commandbox.x);
    }*/
    update(scene) { //@@@@@@@@@ 코드조각 넣은거 바로바로 업데이트 해줌.

        text.setText(scene.contenttext);
    }
}