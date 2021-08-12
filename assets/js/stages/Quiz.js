var curve;
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
        curve = new Phaser.Curves.Line([ 250, 200, 250, 200 ]);
    }

    start_quiz() {
        var problem0 = this.add.circle(curve.p0.x,curve.p0.y,10,10,0xefc53f).setInteractive();
        problem0.setData('vector', curve.p0);
        this.input.setDraggable([ problem0 ]);

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.tint = 0x21f7ef;
        });
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.data.get('vector').set(dragX, dragY);
        });

        this.input.on('dragend', function (pointer, gameObject) {
            //gameObject.clearTint();
        });
    }

    update(){
        graphics.clear();
        graphics.lineStyle(2, 0xffffff, 1);
        curve.draw(graphics);
        curve.getPoint(path.t, path.vec);
    }
}