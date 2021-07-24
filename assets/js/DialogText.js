/*** textbox 예시코드***/

const COLOR_PRIMARY = 0xffffff; //안쪽
const COLOR_LIGHT = 0xC3C3C3; //바깥 선
//const COLOR_DARK = 0xffffff; // 용도를 모르겠는 동그라미

var content = `Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.`;
const GetValue = Phaser.Utils.Objects.GetValue;

export default class DialogText extends Phaser.Scene {
    constructor() {
        super({
            key: 'textbox',
            active: true
        })
    }

    preload() { 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
 
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    }

    create() {
        createTextBox(this, 100, 100, {wrapWidth: 500,}).start(content, 50); //박스 사이즈 유동적(위)
        createTextBox(this, 100, 400, { //박스 사이즈 고정된 거(아래)
                wrapWidth: 500,
                fixedWidth: 500,
                fixedHeight: 65,
            })
            .start(content, 50); //속도
    }

    update() {}


    createTextBox = function (scene, x, y, config) {
        console.log('start of createTexBox');
        var wrapWidth = GetValue(config, 'wrapWidth', 0);
        var fixedWidth = GetValue(config, 'fixedWidth', 0);
        var fixedHeight = GetValue(config, 'fixedHeight', 0);
        var textBox = scene.rexUI.add.textBox({
                x: x,
                y: y,
                anchor: 'centor',
    
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                    .setStrokeStyle(2, COLOR_LIGHT),
    
                //icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK), //동그라미
    
                // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
                text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),
    
                action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
    
                space: {
                    left: 10, //텍스트와 말풍선 사이의 간격
                    right: 10,
                    top: 10,
                    bottom: 10,
                    icon: 10, //아이콘과 텍스트 사이 간격
                    text: 10, //텍스트와 아이콘 사이 간격?
                }
            })
            .setOrigin(0)
            .layout();

        textBox.setVisible(true);
    
        textBox
            .setInteractive()
            .on('pointerdown', function () {
                var icon = this.getElement('action').setVisible(false);
                this.resetChildVisibleState(icon);
                if (this.isTyping) {
                    this.stop(true);
                } else {
                    this.typeNextPage();
                }
            }, textBox)
            .on('pageend', function () {
                /*
                textBox.stop().then(() => {
                    textBox.setInteractive().on('pointerdown', function() {
                        textBox.resume();
                    },textBox)
                }).then(() => {
                        if (this.isLastPage) {
                        textBox.setVisible(false);
                        console.log("end of createTextBox");
                        return 0;
                        }
                })
                */
                
                    textBox.stop();
                   if (this.isLastPage) {
                    //scene.dialogOn = true; //다시 같은 대화를 반복 할 수 있도록.
                    
                    //클릭을 해야 리턴이 되도록.... 근데 안됨
                    textBox.setInteractive().on('pointerdown', function() {
                        setTimeout(function() {
                            textBox.setVisible(false);
                           }, 3000); //3초 지연시간을 주고 사라지도록
                           console.log("end of createTextBox");
                        return 0;
                    },textBox)
                    scene.ontile = true;
                }
                
                  

    
                


                var icon = this.getElement('action').setVisible(true);
                this.resetChildVisibleState(icon);
                icon.y -= 30;
                var tween = scene.tweens.add({
                    targets: icon,
                    y: '+=30', // '+=100'
                    ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 500,
                    repeat: 0, // -1: infinity
                    yoyo: false
                });
            }, textBox)
        //.on('type', function () {
        //})
        return textBox;
    }


    
}





var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
            fontSize: '20px',
            wordWrap: {
                width: wrapWidth
            },
            maxLines: 3
        })
        .setFixedSize(fixedWidth, fixedHeight);
}

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontFamily: 'font1',
        fontSize: '15px',
        color: '#000000', //글자색
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: DialogText
};

//var game = new Phaser.Game(config);