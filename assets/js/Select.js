var answer = 0;
var beforeAnswer = 2;
var maxnum;

export default class Select extends Phaser.Scene {
    constructor() {
        super('selection');
    }
    init(data)
    {
        console.log('init', data);

        this.msg = data.msgArr;
        maxnum = data.num;
        this.finAnswer = data.finAnswer;
        //this.num = data.image;
    }

    create() {
        for(var i =0; i< this.msg.length; i++) {
            console.log(this.msg[i]);
        }
        this.selectList = []; 
        for(var i=0; i< maxnum; i++) {
            this.selectList[i] = this.add.rectangle(300,100+i*100, 500,80, 0xFFD700).setOrigin(0,0);
-           this.add.text(this.selectList[i].x + 250, this.selectList[i].y + 40, this.msg[i], {
                fontFamily: 'Arial Black',
                fontSize: '15px',
                color: '#000000', //글자색 
                wordWrap: { width: 400, height:70, useAdvancedWrap: true },
                boundsAlignH: "center",
                boundsAlignV: "middle"
               }).setOrigin(0.5)
        }

        this.upKey = this.input.keyboard.addKey('up');
        this.downKey = this.input.keyboard.addKey('down');
        this.enter = this.input.keyboard.addKey('enter');

        this.answer = 0; 
        console.log('maxnum=',maxnum);

        this.upKey.on('down', function (event) { // 이 내부 함수에서는 밖에서 정의한 this.변수를 들고오지 못함
            beforeAnswer = answer;

            if(answer == 0) {
                answer = maxnum -1;
            }
            else answer = answer - 1;
            console.log('up:',answer);
          });
        this.downKey.on('down', function (event) { //이 up down이 마우스의 up down과 동일한 의미인가봄
            beforeAnswer = answer;

            if(answer == maxnum - 1) answer = 0;
            else answer = answer + 1;
            console.log('down:',answer);
          });
        
    }

    update() {
        this.selectList[beforeAnswer].setStrokeStyle(0, 0xFF0000); //이전 정답 위치 선 없애기 위해
        this.selectList[answer].setStrokeStyle(4, 0xFF0000);

        if(this.enter.isDown) {
            this.scene.stop('selection'); //this.scene.stop('quiz');
            this.finAnswer.answer = answer+1;
        }
    }

}