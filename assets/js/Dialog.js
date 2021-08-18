import TestScene from "./TestScene.js";


const COLOR_PRIMARY = 0xffffff; //안쪽
const COLOR_LIGHT = 0xC3C3C3; //바깥 선

export default class Dialog extends Phaser.Events.EventEmitter {
  constructor(scene) {
      super();

      this.scene = scene;
      //this.myConsole = scene.add.text(100, 100, '');

      //this['loadTextbox'] = this.loadTextbox;
      this['place'] = this.place;
      this['placeAbovePlayer'] = this.placeAbovePlayer;
      this['wait-click'] = this.waitClick;
      this['wait-time'] = this.waitTime;
      this['console'] = this.consoleOut;
      this['visible'] = this.visible;
      this['bubbleVisible'] = this.bubbleVisible;
      this['setFace'] = this.setFace;
      this['setExtraFace'] = this.setFaceact;
      this.testScene = new TestScene();


  }
  

loadTextbox(scene) { //현재 장면을 가져와야함
    this.scene = scene;

       /*
    this.textBox = scene.add.textBox({
        //x: 100, //위치
        //y: 100,
        anchor: 'centor',
    
        //background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
        //   .setStrokeStyle(2, COLOR_LIGHT),

        background: CreateSpeechBubbleShape(scene, COLOR_PRIMARY, COLOR_LIGHT),
    
        text: getBBcodeText(scene, 100, 100, 55),
    
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
    */

    this.textBox = scene.add.image(0,400,'textbox').setOrigin(0,0);
    this.script = scene.add.text(this.textBox.x + 200, this.textBox.y +50, '', {
        fontFamily: 'Arial', 
         fill: '#000000',
         fontSize: '30px', 
         wordWrap: { width: 450, useAdvancedWrap: true }
        }).setOrigin(0,0);

    this.playerFace = scene.add.sprite(this.script.x + 600 ,this.script.y+50, 'face', 0);

    }

loadbubblebox(scene) {
      this.scene = scene; //이거 없으면 callback 함수들이 this.scene을 못읽음
      this.textBox = scene.add.image(0,0,'bubble').setOrigin(0,0);
      this.script = scene.add.text(this.textBox.x + 2.5, this.textBox.y +2.5, '', {
           fontFamily: 'Arial Black',
           fontSize: '15px',
           color: '#000000', //글자색 
           wordWrap: { width: 100, height:60, useAdvancedWrap: true },
           boundsAlignH: "center",
           boundsAlignV: "middle"
          }).setOrigin(0.5)
  
  }

bubbleVisible(visible){
  this.textBox.setVisible(visible);
  this.script.setVisible(visible);

}

visible(visible) {
    this.textBox.setVisible(visible);
    this.script.setVisible(visible);
    this.playerFace.setVisible(visible);
}
  
  consoleOut(msg) {
    console.log(msg)
  }

  place(x,y) {
      this.textBox.x = x;
      this.textBox.y = y;
      this.script.x = x+200;
      this.script.y = y+50;
      this.playerFace.x = x+800;
      this.playerFace.y = y+100;

  }
  // callbacks
  print(msg) {
      this.script.setText(msg);
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

  setFace(i) {
    this.playerFace.setFrame(i);
  }

  placeAbovePlayer(y) {
    //console.log('dialog에서 인식하는 말풍선 위치:', playerX, y);
    this.textBox.x = playerX-70;
    this.textBox.y = y;
    this.script.x = playerX-70 + 71.5;
    this.script.y = y + 33.5;
  }

  setFaceact(extraFace,i) { //key , 프래임
    this.playerFace.setVisible(false);
    var extraFace = this.scene.add.sprite(this.script.x + 600 ,this.script.y+50, extraFace , 0);
    extraFace.setFrame(i);
    this.scene.input.once('pointerup', function () {extraFace.destroy(); this.playerFace.setVisible(true);} , this);
  }

  bubbleExample = [
    ['bubbleVisible',true],
    ['placeAbovePlayer',200],
    ['print', '대사대ㅏ'],
    ['wait-time', 1],
    ['bubbleVisible',false],

  ]


  intro = [
    ['visible',false],
    ['wait-time', 1],
    ['visible',true],
    ['setFace', 1],
    ['print', '.....'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(헉목소리가 안나옴 어쩌구저쩌구)'],
    ['wait-click'],
    ['print', '(무슨일이지??)'],
    ['wait-click'],
    ['visible',false],
  ]

  intro2 = [
    ['visible',true],
    ['print', '\'printf\'?'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '(이게 뭐야? 내가 영어를 싫어하긴 하지만 printf가 아니라 print가 맞는 말이라는 것 정돈 안다고. 바보아냐?)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(그것보다 이게 왜 우리집에?)'],
    ['wait-click'],
    ['setExtraFace', 'entire_code_button', 0],
    ['print', '띠링띠링!'],
    ['wait-click'],
    ['visible',false],

  ]

  intro3 = [
    ['visible',true],
    ['print', '휴대폰에 이건 또 뭐고??'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '......'],
    ['wait-click'],
    ['print', '이걸로 뭔가 해야하는 걸까? 인벤토리 창을 열어서 아까 주운 걸 사용해보자.'],
    ['wait-click'],
    ['visible',false],
  ]

  intro4 = [
    ['wait-click'],
    ['visible',true],
    ['setFace', 0],
    ['print', '(말이 나왔어...!)'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '이 휴대폰 앱을 통해서 \'어떠한 행동\'을 할 수 있게 되는 걸지도...?'],
    ['wait-click'],
    ['print', '......'],
    ['wait-click'],
    ['print', '하하! 그럴리가 없잖아. 여기가 코딩 지옥이냐? 난 코딩같은 거 모른다고!'],
    ['wait-click'],
    ['print', '음... 그나저나 좀 더운 거 같은데...'],
    ['wait-click'],
    ['print', '...일단 밖으로 나가볼까?'],
    ['wait-click'],
    ['visible',false],
  ]

  stage1_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '(부... 불타고 있어!)'],
    ['wait-click'],
    ['print', '(이.. 이게 뭐야?! 악몽같아!)'],
    ['wait-click'],
    ['visible',false],
  ]

  stage1_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '거기 너!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(뭐야 쟨???)'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '뭐라뭐라뭐라'],
    ['wait-click'],
    ['print', '대사좀써주세요'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '전 코딩할줄 모르는데요???'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '뭐라뭐라뭐라'],
    ['wait-click'],
    ['print', '흠.. 이거 안되겠군'],
    ['wait-click'],
    ['visible',false],
  ]

  stage1_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '휴대폰 이리내놔!'],
    ['wait-click'],
    ['visible',false],
  ]

  stage1_4 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '흠...(만족)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '저기요! 이게 무슨짓이에요?!'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '그리고 왜 반말함??? 빨리 잠금풀어!'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '니 알아서해라 ㅃㅇ'],
    ['wait-click'],
    ['visible',false],
  ]

  stage1_5 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '야!! 어디가!!'],
    ['wait-time', 1],
    ['wait-click'],
    ['setFace', 0],
    ['print', '이게.. 이게 뭐야 진짜?!'],
    ['wait-click'],
    ['print', '응..? 이 잠금화면, 일반적인 잠금이랑은 다른 거 같은데....?'],
    ['wait-click'],
    ['visible',false],
  ]


  stage1_6 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '풀렸다!'],
    ['wait-click'],
    ['visible',false],
    ['wait-time', 1],
  ]


  stage2_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '(아, 사람이다!)'],
    ['wait-click'],
    ['print', '저기요! 할아버지!!!'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '할아버지! 여긴 대체 어디죠?'],
    ['wait-click'],
    ['setFace', 4],
    ['print', '껄껄 코딩지옥은 처음인가 보구나!'],
    ['wait-click'],
    ['print', '내 부탁을 좀 들어주면 묻는 말에 대답해주지'],
    ['wait-click'],
    ['print', '여기서 나가려고하는데 무슨 옷을 입어야할지 모르겠군'],
    ['wait-click'],
    ['print', '밖에 날씨가 어떤지 좀 말해주겠나? 춥다, 덥다 이런식으로'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_3_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 4],
    ['wait-click'],
    ['print', '날이 덥다고? 알겠네 조금만 기다리게'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_3_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 4],
    ['print', '그래 이거야!'],
    ['wait-click'],
    ['print', '이제 코딩지옥에 대해 설명해주지 솰라솰라~~ '],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_4_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 4],
    ['wait-click'],
    ['print', '날이 춥다고? 알겠네 조금만 기다리게'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_4_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 4],
    ['print', '자네! 이 옷차림은 아닌것 같은데?'],
    ['wait-click'],
    ['print', '다시 한번 말해주게!!!'],
    ['wait-click'],
    ['visible',false],
  ]


  stage3_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 3],
    ['print', '어떡하지.. '],
    ['wait-click'],
    ['setFace', 0],
    ['print', '저기..'],
    ['wait-click'],
    ['visible',false],
  ]
  stage3_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 3],
    ['print', '뭐? 도와준다고?! 정말 고마워!'],
    ['wait-click'],
    ['print', '난 제빵왕 김핑퐁이야. 눈을 떠보니 코딩세계에 갇혀버렸지 뭐야!'],
    ['wait-click'],
    ['print', '코딩세계는 빵도 코딩으로 만들더라구?\n하지만 난 코딩을 못해..'],
    ['wait-click'],
    ['print', '빵을 딱 25개만 만들어줄래?'],
    ['wait-click'],
    ['print', '아! 여기 어딘가 코드조각을 놔뒀는데, 필요하면 찾아봐'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '아..넵..'],
    ['wait-click'],

    ['visible',false],
  ]
  stage3_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 3],
    ['wait-click'],
    ['print', '세상에! 진짜 해냈구나! '],
    ['wait-click'],
    ['print', '고마워! 코드조각은 너 가져'],
    ['wait-click'],

    ['visible',false],
  ]

  talk1 = [
    //['loadTextbox'],
    ['visible',true],
    ['print', '플레이어 위치를 못읽어와요'],
    ['wait-click'],
    ['move'],
    ['print', '위치는 그냥 일일이 적어야해요'],
    ['wait-click'],
    ['print', '정말 짱이다'],
    ['wait-click'],
    ['print', '대사가 너무 길면 짤려요'],
    ['wait-click'],
    ['print', '겜 완성하고 수정하죠뭐'],
    ['wait-click'],
    ['print', '위치 못받아오는거 빡치네요'],
    ['wait-click'],
    ['wait-time', 1],
    ['visible',false],
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
