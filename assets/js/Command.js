var state = 0;
var text;
        
class Command extends Phaser.GameObjects.Image {
    constructor(scene, map) {
        super(scene, map);
        // ...
        scene.add.existing(this);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = scene.cameras.main.worldView;

        /*** 전체 코드에 걍 예시로 넣은 문장 ***/
        var contenttext = [
            "The sky above the port was the color of television, tuned to a dead channel.",
            "`It's not like I'm using,' Case heard someone say, as he shouldered his way ",
            "through the crowd around the door of the Chat. `It's like my body's developed",
            "this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke.",
            "The Chatsubo was a bar for professional expatriates; you could drink there for",
            "a week and never hear two words in Japanese.",
            "",
            "Ratz was tending bar, his prosthetic arm jerking monotonously as he filled a tray",
            "of glasses with draft Kirin. He saw Case and smiled, his teeth a webwork of",
            "East European steel and brown decay. Case found a place at the bar, between the",
            "unlikely tan on one of Lonny Zone's whores and the crisp naval uniform of a tall",
            "African whose cheekbones were ridged with precise rows of tribal scars. `Wage was",
            "in here early, with two joeboys,' Ratz said, shoving a draft across the bar with",
            "his good hand. `Maybe some business with you, Case?'",
            "",
            "Case shrugged. The girl to his right giggled and nudged him.",
            "The bartender's smile widened. His ugliness was the stuff of legend. In an age of",
            "affordable beauty, there was something heraldic about his lack of it. The antique",
            "arm whined as he reached for another mug.",
            "",
            "",
            "From Neuromancer by William Gibson"
        ]; 

        /*** 명령창버튼 활성화 ***/
        this.entire_code_button = scene.add.image(20,20,'entire_code_button').setOrigin(0,0);
        this.entire_code_button.setInteractive();
    
        /*** 명령창, 명령창 내용 zone 미리 add해주기 ***/
        this.commandbox = scene.add.image(map.widthInPixels, 5,'commandbox').setOrigin(0,0);
        this.zone = scene.add.zone(map.widthInPixels, 25,  360, 550).setOrigin(0).setInteractive();
        text = scene.add.text(map.widthInPixels, 25, contenttext, { fontFamily: 'Arial', color: '#ffffff', wordWrap: { width: 350 } }).setOrigin(0,0);

        /*** 명령창에 전체코드 띄우고 드래그 할 수 있기위한 설정 ***/
        this.graphics = scene.make.graphics(); 
        var mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
        text.setMask(mask);

    }

    preUpdate(time, delta) {
        //console.log('state' + state);
        /*** 화면 이동시 entire code button 따라가도록 설정***/
        this.entire_code_button.x = this.worldView.x + 5;

        /*** 버튼 클릭마다 명령창 띄웠다 없앴다 ***/
        if(state == 0) {
            this.entire_code_button.on('pointerdown', () => { //명령창 띄우기
                this.commandbox.setVisible(true);
                text.setVisible(true);
                //this.slidebox(); //슬라이드 기능 수치가 중간에 이상해져서 될 때 있고 안 될 때 있음(일단 빼두겠음)
                state = 1;
            });
        } else {
            this.commandbox.x = this.worldView.x + 715; //화면 이동시 명령창 따라가도록 설정
            text.x = this.worldView.x + 730;
            this.graphics.fillRect(this.worldView.x + 725, 20, 360, 550); // 화면 이동시 글이 보이는 판을 이동
            this.zone.x = this.worldView.x + 725;
            this.zone.on('pointermove', function (pointer) {
                if (pointer.isDown){
                    text.y += (pointer.velocity.y / 10);
                    text.y = Phaser.Math.Clamp(text.y, -400, 600);
                    //this.extext.setVisible(true);
                }
            });

            this.entire_code_button.on('pointerdown', () => {
                this.commandbox.setVisible(false);
                text.setVisible(false);
                //invenGra.setVisible(false);
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
}