import Player from "./Player.js";
import TestScene from "./TestScene.js";

const COLOR_PRIMARY = 0xffffff; //안쪽
const COLOR_LIGHT = 0xC3C3C3; //바깥 선

//** 텍스트 출력이 입력되는 것처럼 나오게 하는 함수인듯..**/
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

export default class Dialog extends Phaser.Events.EventEmitter {
  constructor(scene) {
      super();

      this.scene = scene;
      //this.myConsole = scene.add.text(100, 100, '');

      //this['loadTextbox'] = this.loadTextbox;
      this['place'] = this.place;
      this['wait-click'] = this.waitClick;
      this['wait-time'] = this.waitTime;
      this['console'] = this.consoleOut;

      this.testScene = new TestScene();

  }

loadTextbox(scene) { //현재 장면을 가져와야함
    //this.scene = scene;

    this.textBox = scene.rexUI.add.textBox({
        //x: 100, //위치
        //y: 100,
        anchor: 'centor',
    
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),
    
        text: getBBcodeText(scene, 100, 100, 65),
    
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



    
    }
  
  consoleOut(msg) {
    console.log(msg)
  }

  place(x,y) {
      this.textBox.x = x;
      this.textBox.y = y;

  }
  // callbacks
  print(msg) {
      this.textBox.setText(msg);
      // return undefined to run next command
  }

  waitClick() {
      this.scene.input.once('pointerup', this.complete, this);
      return this;  // return eventEmitter to pause the sequence
  }

  waitTime(delay) {
      this.scene.time.delayedCall(delay * 1000, this.complete, [], this);
      return this;  // return eventEmitter to pause the sequence
  }

  complete() {
      this.emit('complete');  // resume sequence
  }

  talk1 = [
    //['loadTextbox'],
    ['place',650,150],
    ['print', '플레이어 위치를 못읽어와요'],
    ['wait-click'],
    ['place',650,200],
    ['print', '위치는 그냥 일일이 적어야해요'],
    ['wait-click'],
    ['place',650,150],
    ['print', '정말 짱이다'],
    ['wait-click'],
    ['print', '대사가 너무 길면 짤려요'],
    ['wait-click'],
    ['print', '겜 완성하고 수정하죠뭐'],
    ['wait-click'],
    ['print', '위치 못받아오는거 빡치네요'],
    ['wait-click'],
    ['wait-time', 1],
  ];

}


/** 참고용으로 남겨둠, 사용안함**/
class Dialog2 extends Phaser.Scene {

  constructor() {
      super({
          key: 'squencial'
      })
  }

  preload() {
      this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
  }

  create() {
      /* original code
      var myCmds = new ActionKlass(this);
      var seq = this.plugins.get('rexsequenceplugin').add();
      seq
          .load(cmds, myCmds)
          .once('complete', myCmds.print.bind(myCmds, 'completed...'))
          .start();
      */

  }

  update() {}
}
