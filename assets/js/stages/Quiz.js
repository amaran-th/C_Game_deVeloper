var curve = [];
var graphics;
var path;

export default class Quiz extends Phaser.Scene {
    constructor(){
        super('quiz');
    }
    preload(){
        
    }

    create(){
        console.log('퀴즈 시작!');
        //this.inventory.fillRoundedRect(0, 50, 1094, 173, 20).strokeRoundedRect(0, 50, 1094, 173, 20);
        var screen = this.add.rectangle(150, 100, 10, 10, 0x9966ff).setOrigin(0,0);
        //dropzone
        this.tweens.add({
            targets: screen,
            scaleX: 80,
            scaleY: 40,
            duration: 1000,
            ease: 'Power1',
            repeat: 0,
            onComplete: ()=>{ this.start_quiz() }
        }, this);
        screen.setStrokeStyle(0.1, 0xefc53f);

        graphics = this.add.graphics();
        path = { t: 0, vec: new Phaser.Math.Vector2() };

        curve[0] = new Phaser.Curves.Line([ 300, 300, 300, 300 ]); //선 시작위치, 끝나는 위치 //int
        curve[1] = new Phaser.Curves.Line([ 300, 400, 300, 400 ]); //double
        curve[2] = new Phaser.Curves.Line([ 300, 500, 300, 500 ]); //char
    }

    start_quiz() {
        
        var graphics_zone = this.add.graphics();
        for(var i=0; i<= 3; i++) {
            graphics_zone.lineStyle(2, 0xffff00);
            var zone = this.add.zone(800, 200 + 100*i).setCircleDropZone(10);
            graphics_zone.strokeCircle(zone.x, zone.y, zone.input.hitArea.radius);
        }

        for(var i=0; i< 3; i++) {
        var problem0 = this.add.circle(curve[i].p0.x,curve[i].p0.y,10,10,0xefc53f).setInteractive();
        problem0.setData('vector', curve[i].p0);
        this.input.setDraggable([ problem0 ]);
        }

        this.input.on('dragstart', function (pointer, gameObject) {
            //gameObject.setTint(0xf9cb9c);
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
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.data.get('vector').set(gameObject.x, gameObject.y); //선도 같이 제자리도 돌아가도록
            }
        });
    }

    update(){
        graphics.clear();
        graphics.lineStyle(2, 0xffffff, 1);
        for(var i = 0; i<curve.length; i++ ){
            curve[i].draw(graphics);
            curve[i].getPoint(path.t, path.vec);
        }

    }
}