var state = 0;
var code_text;
var tutorial_text;
var code_on = false;
var tutorial_on = false;
var app_on = false;
//import ZeroStage from "./ZeroStage.js";

export default class Command extends Phaser.GameObjects.Image {
    constructor(scene, map, name) {
        super(scene, map, name);

        // ...
        scene.add.existing(this);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = scene.cameras.main.worldView;

        /*** 명령창버튼 활성화 ***/
        this.entire_code_button = scene.add.image(20,10,'entire_code_button').setOrigin(0,0);
        this.entire_code_button.setInteractive();

        
    
        /*** 명령창, 명령창 내용 미리 add해주기 ***/
        this.commandbox = scene.add.image(map.widthInPixels, 5,'commandbox').setOrigin(0,0);
        code_text = scene.add.text(map.widthInPixels, 75, scene.app_code_text, {  font: "25px Arial", color: '#ffffff', wordWrap: { width: 340 } }).setOrigin(0,0);

        /*** 컴파일버튼 활성화 ***/ //@@@@@@@@@@@
        this.compile_button = scene.add.image(850,425,'compile_button').setOrigin(0,0);
        this.compile_button.setInteractive();

        


        // 튜토리얼 설명 
        var content = [
            "비교 연산자",
            "==, >, <, >=, <=",
            "",
            "<<조건문의 종류>>",
            "if문, switch-case문",
            "",
            "if문 문법",
            "if( 조건식 ){",
            "   실행문;",
            "}",
            "",
            "<<반복문의 종류>>",
            "while문, for문",
            "",
            "while문 문법",
            "while( ①조건식 ){",
            "   ②실행문;",
            "}",
            "실행 순서",
            "①조건식을 평가합니다. 평가 결과가 true이면 ②실행문을 실행합니다.",
            "②실행문이 모두 실행되면 다시 ①조건식으로 되돌아가서 다시 검사합니다. ",
            "만약 ①조건식이 true라면 1,2번 순서를 다시 반복하고 아니면 while문을 종료합니다. ",
            "",
            "for문 문법",
            "for( ①초기화식; ②조건식; ④증감식){",
            "   ③실행문;",
            "}",
            "실행 순서",
            "①초기화식이 제일 먼저 실행됩니다. 그 뒤 ②조건식을 평가해서 true이면 ③실행문을 실행시키고 false이면 for문을 종료합니다. 만약 실행문이 실행되었다면 블록 내부의 ③실행문을 모두 실행시키고 ④증감식을 실행 시킨 뒤 다시 ②조건식을 평가하게 됩니다.",
            "",
            ""
        ];
        tutorial_text = scene.add.text(map.widthInPixels, 75, content, {  font: "16px Arial", color: '#ffffff', wordWrap: { width: 340 } }).setOrigin(0,0);

        /*** 폰 앱들 넣어주기 ***/
        var app_names = ['app_code', 'app_map', 'app_tutorial'];
        this.apps = [];
        for(var i=0; i < app_names.length; i++){
            const j = i;
            this.apps[j] = scene.add.image(map.widthInPixels, 80 + (parseInt(i / 2))*130, app_names[j]).setOrigin(0).setInteractive();
            this.apps[j].on('pointerup', function () { 
                app_on = true;
                switch(j){
                    case 0:
                        code_on = true;
                        scene.codeapp_onoff_state = 1; // 코드앱이 켜지고 꺼짐에 따라 드랍존도 생기고 없어지고 하기위한 상태변수
                        break;
                    case 1:
                        console.log('맵이동');

                        app_on = false;
                        /** 휴대폰 킨 상태로 맵 이동했을때 휴대폰 꺼져있도록**/
                        this.commandbox.setVisible(false);
                        for(var i=0; i < this.apps.length; i++){
                            this.apps[i].setVisible(false);
                        }
                        scene.codeapp_onoff_state = 0; // 코드앱이 켜지고 꺼짐에 따라 드랍존도 생기고 없어지고 하기위한 상태변수
                        code_on = false;
                        tutorial_on = false;
                        code_text.setVisible(false);
                        this.compile_button.setVisible(false);
                        tutorial_text.setVisible(false);
                        this.back_button.setVisible(false);
                        state = 0;

                        


                        scene.scene.sleep(name);
                        scene.scene.run("minimap");
                        break;
                    case 2:
                        tutorial_on = true;
                        break;
                    default:
                        scene.add.text(400, 300, 'default zone... why?', { fontFamily: 'Arial', color: '#000'}).setOrigin(0,0);
                        break;
                }
            },this);
        }

        /*** 뒤로가기 버튼 ***/
        this.back_button = scene.add.image(map.widthInPixels, 538, 'back_button').setOrigin(0).setInteractive();
        this.back_button.on('pointerup', function () {
            scene.codeapp_onoff_state = 0; // 코드앱이 켜지고 꺼짐에 따라 드랍존도 생기고 없어지고 하기위한 상태변수
            if(app_on == true){
                app_on = false;
                code_on = false;
                tutorial_on = false;
                code_text.setVisible(false);
                this.compile_button.setVisible(false);
                tutorial_text.setVisible(false);
            }
        },this);



        /*** 튜토리얼앱 드래그 할 수 있기위한 설정 ***/
        this.zone = scene.add.zone(map.widthInPixels, 75,  360, 450).setOrigin(0).setInteractive();
        this.graphics = scene.make.graphics(); 
        var mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
        tutorial_text.setMask(mask);

        
        /*** 컴파일 버튼 누를시 컴파일러 동작. ***/ //@@@@@@@@@@@
        this.compile_button.on('pointerdown', () => {
           console.log("click");
            if (scene.contenttext !== ''){
                    var data = {
                        'code': scene.contenttext
                    };
                    data = JSON.stringify(data);

                    var xhr = new XMLHttpRequest();

                    xhr.open('POST', '/form_test', true);                
                    
                    xhr.setRequestHeader('Content-type', 'application/json');
                    xhr.send(data);
                    xhr.addEventListener('load', function() {
                        console.log(xhr.responseText);
                        var result = JSON.parse(xhr.responseText);
                        if (result.result != 'ok') {
                            console.log("error!!!");
                            scene.printerr(scene);
                        }else{
                        scene.out = result.output;
                        console.log('command 파일 result:', result.output);
                        scene.complied(scene, result.output);
                        }
                        //document.getElementById('testoutput').value = result.output;
                    });
                    //  Turn off the click events
                    //this.removeListener('click');
                    //  Hide the login element
                    //this.setVisible(false);
                    //  Populate the text with whatever they typed in
                    //code_text.setText('Welcome ' + inputText.value);
                }
                else
                {
                    //  Flash the prompt 이거 뭔지 모르겠음 다른 곳에서 긁어옴
                    this.scene.tweens.add({
                        targets: code_text,
                        alpha: 0.2,
                        duration: 250,
                        ease: 'Power3',
                        yoyo: true
                    });
                            }
            console.log(" compile finish!!!");
           
        });
        





    }

    update(scene) { //@@@@@@@@@ 코드조각 넣은거 바로바로 업데이트 해줌.
        code_text.setText(scene.app_code_text);

        //console.log('state' + state);
        /*** 화면 이동시 entire code button 따라가도록 설정***/
        this.entire_code_button.x = this.worldView.x + 5;
        /*** 버튼 클릭마다 명령창 띄웠다 없앴다 ***/
        for(var i=0; i < this.apps.length; i++){
            this.apps[i].visible = this.commandbox.visible;
        }
        this.back_button.visible = this.commandbox.visible;

        if(state == 0) {
            this.compile_button.setVisible(false);
            this.entire_code_button.on('pointerdown', () => { //명령창 띄우기
                this.commandbox.setVisible(true);

                //this.slidebox(); //슬라이드 기능 수치가 중간에 이상해져서 될 때 있고 안 될 때 있음(일단 빼두겠음)
                state = 1;
                
                // 드래그앤드랍이 호출되어 되어 드랍존과 리셋버튼이 만들어진 이후 드랍존과 리셋버튼 명령창 따라 들어갔다 나왔다 하기 위함 
                /*if(this.draganddrop_1 != undefined) this.draganddrop_1.updownwithinven(scene);
                if(this.draganddrop_2 != undefined) this.draganddrop_2.updownwithinven(scene);
                if(this.draganddrop_3 != undefined) this.draganddrop_3.updownwithinven(scene);*/
            });
        } else {
            this.commandbox.x = this.worldView.x + 715; //화면 이동시 명령창 따라가도록 설정
            this.back_button.x = this.worldView.x + 980;
            for(var i=0; i < this.apps.length; i++){
                this.apps[i].x = this.worldView.x + 755 + (i%2)*170;
                this.apps[i].setVisible(true);
            }
            if(app_on === false) {
                for(var i=0; i < this.apps.length; i++){
                    this.apps[i].setVisible(true);
                }
                this.zone.x = this.worldView.x + 1000;
                tutorial_text.setVisible(false);
                code_text.setVisible(false);
                this.compile_button.setVisible(false);
            }else{
                if(code_on === true){
                    for(var i=0; i < this.apps.length; i++){
                        this.apps[i].setVisible(false);
                    }
                    code_text.setVisible(true);
                    this.compile_button.setVisible(true);
                    code_text.x = this.worldView.x + 750;
                } else if(tutorial_on === true){
                    for(var i=0; i < this.apps.length; i++){
                        this.apps[i].setVisible(false);
                    }
                    tutorial_text.setVisible(true);
                    tutorial_text.x = this.worldView.x + 750;
                    this.graphics.fillRect(tutorial_text.x -5, 75, 340, 430); // 화면 이동시 글이 보이는 판을 이동
                    this.zone.x = tutorial_text.x -5;
                    this.zone.on('pointermove', function (pointer) {
                        if (pointer.isDown){
                            tutorial_text.y += (pointer.velocity.y / 2000);
                            tutorial_text.y = Phaser.Math.Clamp(tutorial_text.y, -400, 600);
                            //this.extext.setVisible(true);
                        }
                    });
                } 
            }
            this.entire_code_button.on('pointerdown', () => {
                this.commandbox.setVisible(false);
                for(var i=0; i < this.apps.length; i++){
                    this.apps[i].setVisible(false);
                }

                scene.codeapp_onoff_state = 0; // 코드앱이 켜지고 꺼짐에 따라 드랍존도 생기고 없어지고 하기위한 상태변수
                
                code_on = false;
                tutorial_on = false;
                //text.setVisible(false);
                code_text.setVisible(false);
                this.compile_button.setVisible(false);
                tutorial_text.setVisible(false);
                this.back_button.setVisible(false);
                state = 0;
            });
        }
    }

    remove_phone(scene){

        /** 휴대폰 킨 상태로 맵 이동했을때 휴대폰 꺼져있도록**/
        this.commandbox.setVisible(false);
        for(var i=0; i < this.apps.length; i++){
            this.apps[i].setVisible(false);
        }
        scene.codeapp_onoff_state = 0; // 코드앱이 켜지고 꺼짐에 따라 드랍존도 생기고 없어지고 하기위한 상태변수
        code_on = false;
        tutorial_on = false;
        code_text.setVisible(false);
        this.compile_button.setVisible(false);
        tutorial_text.setVisible(false);
        this.back_button.setVisible(false);
        state = 0;

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

    /*update(scene) { //@@@@@@@@@ 코드조각 넣은거 바로바로 업데이트 해줌.

        code_text.setText(scene.contenttext);
    }*/
}