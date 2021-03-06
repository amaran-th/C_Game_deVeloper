/* 스테이지1의 문제*/


var curve = [];
var graphics;
var path;
//var correct_answer = [1,0,0,2];
var player_answer = [3,3,3,3];
var graphics_zone; //드랍존의 그래픽존


export default class Quiz extends Phaser.Scene {
    constructor(){
        super('quiz');
    }
    preload(){
        
    }

    create(){
        console.log('퀴즈 시작!');
        player_answer = [3,3,3,3];
        //this.inventory.fillRoundedRect(0, 50, 1094, 173, 20).strokeRoundedRect(0, 50, 1094, 173, 20);
        var screen = this.add.rectangle(150, 100, 10, 10, 0x36385c).setOrigin(0,0);
        //dropzone
        this.tweens.add({
            targets: screen,
            scaleX: 80,
            scaleY: 40,
            duration: 1000,
            ease: 'Power1',
            repeat: 0,
            onComplete: ()=>{ this.build_unmovable() }
        }, this);
        screen.setStrokeStyle(0.1, 0xccc7f5);

        graphics = this.add.graphics();
        path = { t: 0, vec: new Phaser.Math.Vector2() };

        curve[0] = new Phaser.Curves.Line([ 300, 170, 300, 170 ]); //선 시작위치, 끝나는 위치 //int
        curve[1] = new Phaser.Curves.Line([ 300, 270, 300, 270 ]); //double
        curve[2] = new Phaser.Curves.Line([ 300, 370, 300, 370 ]); //char
        curve[3] = new Phaser.Curves.Line([ 300, 470, 300, 470 ]); //char

    }

    build_unmovable() {
        

        //글자...
        var quiz = ['3.14', '-64', '36', '가'];
        var answer= [ 'Int', 'Float', 'Char'];
        
        //텍스트
        for(var i=0; i<= 3; i++) {
            this.add.text(200, 150 + 100*i , quiz[i], { font: "30px Arial Black", fill: "#fff" });
            //var problem = circles.strokeCircle(curve[i].p0.x,curve[i].p0.y,10)
            //add.circle(curve[i].p0.x,curve[i].p0.y,10,10,0xefc53f).setInteractive();
            //problem.setData('vector', curve[i].p0);
            //this.input.setDraggable([ problem ]);
        }

        //드랍존
        graphics_zone = this.add.graphics();
        for(var i=0; i<= 2; i++) {
            this.add.text(830, 230 + 100*i , answer[i], { font: "30px Arial Black", fill: "#fff" });
            graphics_zone.lineStyle(2, 0xffff00);
            var zone = this.add.zone(800, 250 + 100*i).setCircleDropZone(10);
            graphics_zone.strokeCircle(zone.x, zone.y, 10);
        }
        this.make_circle();

        //gueid text
        this.guide_text = this.add.text(270,120, '<값을 올바른 자료형에 대응시켜 잠금을 해제하시오>', {
            font:'25px',
            fontFamily: ' Courier',
            color: '#ffffff'
        }).setOrigin(0,0);

        //help icon
        this.help_icon=this.add.image(880,120,'help_icon').setOrigin(0,0).setInteractive();
        this.help_box=this.add.image(this.help_icon.x-418,160,'help_box2').setOrigin(0,0);
        
        //help text
        this.help_text=this.add.text(this.help_box.x+30, this.help_box.y+60, "\nHint :자료형이란?\n\
                C언어에서 사용되는 자료형은 크게 실수, 정수, 문자로 구분됩니다.\n\
                (기존 수학적 정의와는 다르게, 컴퓨터는 소수점이 표현되는 수를 실수로 해석합니다.)\n\
                대표적인 실수 자료형은 float, double이 있습니다.\n\
                대표적인 정수 자료형은 int(integer을 생각해보세요!), long이 있습니다.\n\
                대표적인 문자형 자료형은 char이 있습니다.", {
            font:'20px',
            fontFamily: ' Courier',
            color: '#000000',
            wordWrap: { width: 500, height:230, useAdvancedWrap: true },
        }).setOrigin(0,0);
        this.help_box.setVisible(false);
        this.help_text.setVisible(false);

        this.help_icon.on('pointerover', function(){
            this.help_box.setVisible(true);
            this.help_text.setVisible(true);
            this.help_icon.setTint(0x4A6BD6);
        },this);
        this.help_icon.on('pointerout', function(){
            this.help_box.setVisible(false);
            this.help_text.setVisible(false);
            this.help_icon.clearTint();
        },this);

    }
    make_circle() {
        this.problem0 = this.add.circle(curve[0].p0.x,curve[0].p0.y,10,10,0xefc53f).setInteractive().setData('vector', curve[0].p0);
        this.problem1 = this.add.circle(curve[1].p0.x,curve[1].p0.y,10,10,0xefc53f).setInteractive().setData('vector', curve[1].p0);
        this.problem2 = this.add.circle(curve[2].p0.x,curve[2].p0.y,10,10,0xefc53f).setInteractive().setData('vector', curve[2].p0);
        this.problem3 = this.add.circle(curve[3].p0.x,curve[3].p0.y,10,10,0xefc53f).setInteractive().setData('vector', curve[3].p0);
        this.input.setDraggable([ this.problem0,this.problem1,this.problem2,this.problem3 ]);

        this.start_quiz();
    }

    start_quiz() {

        var addIndex;
        this.input.on('dragstart', function (pointer, gameObject) {
            //gameObject.setTint(0xf9cb9c);
            switch(gameObject.y) {
                case curve[0].p0.y:  
                    addIndex = 0; //원소 추가할 인덱스 위치
                    return;
                case curve[1].p0.y: 
                    addIndex = 1;
                    return;
                case curve[2].p0.y: 
                    addIndex = 2;
                    return;
                case curve[3].p0.y: 
                    addIndex = 3;
                    return;
            }
        });
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.data.get('vector').set(dragX, dragY);
        });

        this.input.on('dragend', function (pointer, gameObject,dropped) {
            //gameObject.clearTint();
            if (!dropped) //이거 없으면 마우스 놓은 자리에 유지됨
            {
                player_answer[addIndex] = 3;
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.data.get('vector').set(gameObject.x, gameObject.y); //선도 같이 제자리도 돌아가도록
            }
            else{
            player_answer.splice(addIndex, 1); // index 2 부터 1개의 요소('c')를 제거
            player_answer.splice(addIndex, 0, Math.round((gameObject.y-250)/100+0.10));
            console.log('결과 배열=', player_answer);
            console.log((gameObject.y-250)/100);
            /*
            //배열에서 중복값 검출 (제일 앞쪽에 있는 비중복값만 남김 == 마지막에 들어온 수들)
            const set = new Set(player_answer);
            const uniqueArr = [...set];
            player_answer = uniqueArr;
            console.log('중복값 제거=', player_answer);
            */
            }
        });
    }

    update(){
        if(!player_answer.includes(3)) {
            if(JSON.stringify(player_answer) == '[1,0,0,2]') {
                console.log('맞는 답');
                this.scene.stop('quiz');
            }
            else {
                this.cameras.main.shake(500, 0.01);
                player_answer = [3,3,3,3];
                this.problem0.x = 300;
                this.problem0.y = 170;
                this.problem0.data.get('vector').set(this.problem0.x, this.problem0.y);
                //this.problem0.setData('vector', curve[0].p0);
                this.problem1.x = 300;
                this.problem1.y = 270;
                this.problem1.data.get('vector').set(this.problem1.x, this.problem1.y);
                //this.problem1.setData('vector', curve[1].p0);
                this.problem2.x = 300;
                this.problem2.y = 370;
                this.problem2.data.get('vector').set(this.problem2.x, this.problem2.y);
                //this.problem2.setData('vector', curve[2].p0);
                this.problem3.x = 300;
                this.problem3.y = 470;
                this.problem3.data.get('vector').set(this.problem3.x, this.problem3.y);
                //this.problem3.setData('vector', curve[3].p0);
                graphics.clear();
                this.start_quiz();
                }
            }

        graphics.clear();
        graphics.lineStyle(2, 0xffffff, 1);

        for(var i = 0; i<curve.length; i++ ){
            curve[i].draw(graphics);
            curve[i].getPoint(path.t, path.vec);
        }

    }
}