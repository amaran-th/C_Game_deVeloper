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
      var worldView = this.scene.cameras.main.worldView;
      this.textBox.x = worldView.x+x;
      this.textBox.y = worldView.y+y;
      this.script.x = worldView.x+x+200;
      this.script.y = worldView.y+y+50;
      this.playerFace.x = worldView.x+x+800;
      this.playerFace.y = worldView.y+y+100;

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
    ['place', 40,10],
    ['setFace', 1],
    ['print', '(흐암...지금이 몇시지?)'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '* [Quest] 휴대전화를 얻자 *'],
    ['wait-click'],
    ['visible',false],
  ]

  
  intro1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 5],
    ['print', '* \'휴대전화\'를 얻었습니다. *'],
    ['wait-click'],
    ['visible',false],

  ]

  intro2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '(어디보자...지금 시간이...)'],
    ['wait-click'],
    ['print', '(...)'],
    ['wait-click'],
    ['print', '(...?)'],
    ['wait-click'],
    ['print', '(유튜브랑 카톡...내 앱들이 다 지워졌잖아?!)'],
    ['wait-click'],
    ['print', '(이건 뭐야 튜토리얼...C언어?? 이건 무슨 앱이야? 바이러스라도 걸린건가?)'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '(...)'],
    ['wait-click'],
    ['print', '(잠깐만...나 왜 목소리가 안 나오지???)'],
    ['wait-click'],
    ['visible',false],
  ]

  intro3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '(저 보따리는 또 뭐야?)'],
    ['wait-click'],
    ['visible',false],

  ]

  intro4 = [
    ['visible',true],
    ['place', 40,10],
    ['print', '\'printf\'?'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '(이게 뭐야? 내가 영어를 싫어하긴 하지만 printf가 아니라 print가 맞는 말이라는 것 정돈 안다고. 바보아냐?)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(그것보다 이게 왜 우리집에?)'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '* 자세히 보니 보따리에는 작은 쪽지가 들어있었다. *'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(쪽지...?)'],
    ['wait-click'],
    ['print', '* 코딩 지옥에 오신 걸 환영합니다!\n이 곳은 모든 일이 당신이 만든 C 코드에 의해 일어나는 공간입니다. '],
    ['wait-click'],
    ['print', '이 보따리에 들어있던 코드조각들은 처음 이곳에 온 당신에게 드리는 선물입니다!'],
    ['wait-click'],
    ['print', '휴대전화의 튜토리얼을 통해 코딩에 필요한 기본적인 정보를 얻을 수 있습니다!'],
    ['wait-click'],
    ['print', 'hint : printf를 사용할 땐 C 코드 상단에 #include<stdio.h>를 적는 걸 잊지 말아주세요!'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '...이게 대체 뭔 소리야?'],
    ['wait-click'],
    ['setExtraFace', 'entire_code_button', 0],
    ['print', '띠링띠링!'],
    ['wait-click'],
    ['visible',false],

  ]

  intro5= [
    ['visible',true],
    ['place', 40,10],
    ['print', '휴대폰에 이건 또 뭐고??'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '......'],
    ['wait-click'],
    ['print', '이걸로 뭔가 해야하는 걸까? 인벤토리 창을 열어서 아까 주운 걸 사용해보자.'],
    ['wait-click'],
    ['wait-click'],
    ['print', '* Quest : 폰의 코드 앱을 이용해 말을 해보자. *'],
    ['wait-click'],
    ['wait-click'],
    ['print', '* 코딩 어플리케이션의 스크립트가 업데이트 되었습니다. *'],
    ['wait-click'],
    ['visible',false],
  ]

  intro6 = [
    ['place', 40,10],
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
    ['print', '(뭐, 뭐야? 사방이 불바다잖아?!)'],
    ['wait-click'],
    ['print', '(내가 지금 악몽을 꾸는 건가?)'],
    ['wait-click'],
    ['visible',false],
  ]

  stage1_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 5],
    ['print', '거기 너!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(뭐야 저 사람은...? 머리에 뿔이 달려있잖아?)'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '오랫만에 신참이네~! 너 코딩은 좀 할 줄 아냐?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '코딩이요...??전 프로그래밍 교양과목도 F였는데...컴맹이에요.'],
    ['wait-click'],
    ['print', '아니, 근데 그것보다 상황 설명 좀 해주실래요??'],
    ['wait-click'],
    ['print', '이거 깜짝 카메라같은 거에요?'],
    ['wait-click'],
    ['setFace', 5],
    ['print', 'F라고?? 세상에. 이거 안되겠네.'],
    ['wait-click'],
    ['visible',false],
  ]

  stage1_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 5],
    ['print', '폰 이리 줘봐.'],
    ['wait-click'],
    ['visible',false],
  ]

  stage1_4 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 5],
    ['print', '흠...(만족)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '저기요! 이게 무슨 짓이에요?!'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '잠깐만, 너 왜 반말하냐?? 빨리 잠금 풀어!'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '아이고 성질도 급하셔라~! 쉬운 문제니까 너가 한 번 풀어봐~!'],
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
  stage1_7 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '야!! 다짜고짜 남의 폰에 이게 뭐하는 짓이야!!'],
    ['wait-click'],
    ['visible',false],
    ['wait-time', 1],
  ]
  stage1_8 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 5],
    ['print', '오, 용케 풀었네??'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '아니 그러니까 이게 뭐하는거냐고.'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '뭐긴 뭐겠어. 신입을 도와주려는 선배의 배려지^^'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '하, 배려?? 그래. 그건 둘째치고, 여긴 대체 뭐하는 곳이야?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '무슨 세트장...같은 거지? 그렇지?'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '여긴 코딩지옥이야. 종종 너 같은 사람들이 불시착하곤 해.'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '진짜 코딩지옥이라고??'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '가이드에도 적혀 있었을텐데?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '가이드라면 아까 그 이상한 보따리를 말하는 건가..?'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '폰에 코드 어플 있지? 그걸로 너가 코딩을 해서 실행시키면,'],
    ['wait-click'],
    ['print', '여기서 너가 하고싶은 일을 다 할 수 있어.'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '난 코딩의 코자도 모른단말이야. 원래 살던 곳으로는 어떻게 돌아가는데?'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '돌아가는 법은 나도 몰라~'],
    ['wait-click'],
    ['print', '처음에는 다들 나가려고 하는데, 대부분은 여기서 눌러 살더라. 저기 마을도 있어.'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '...실환가? 휴학한지 일주일도 안됐는데 이런 곳에 갇혔다고?'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '휴학생이라고? 잘됐네, 배워간다고 생각해~'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '아까는 돌아갈 수 있는지 모른다며??'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '내가 그랬나~? 어쨌든 너가 하기에 달렸지~'],
    ['wait-click'],
    ['print', '그건 그렇고, 내가 너 말이라도 편하게 하라고 셋팅해줬는데...'],
    ['wait-click'],
    ['print', '넌 고마운 것도 모르지?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '어? 그러고보니...printf인지 뭔지를 안 썼는데 목소리가 나오잖아?'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '어때? 내 배려가 눈물나게 고맙지?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '...'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '미안~노려보지 마~'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '하...아까는 좀 당황했는데, 그래도 이것저것 알려줘서 고마워.'],
    ['wait-click'],
    ['print', '넌 근데 뭐하는 사람이야?'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '난 지옥에서 일하는 악마야~이 근방을 순찰하다가 널 발견했지.'],
    ['wait-click'],
    ['print', '이름은 신택스 에러야. 신택스라고 불러.'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(이름은 또 왜 저래...)'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '뭐 더 알고싶은 게 있으면 계속 앞으로 가봐.'],
    ['wait-click'],
    ['print', '여긴 너 같은 사람들이 아주 많으니까 도움이 될거야.'],
    ['wait-click'],
    ['visible',false],
    ['wait-time', 1],
  ]


  stage2_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '(아, 사람이다!)'],
    ['wait-click'],
    ['print', '저기요! 할아버지!!!'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_2_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '할아버지! 여긴 대체 어디죠?'],
    ['wait-click'],
    ['setFace', 10],
    ['print', '껄껄 코딩지옥은 처음인가 보구나!'],
    ['wait-click'],
    ['print', '내 부탁을 좀 들어주면 묻는 말에 대답해주지'],
    ['wait-click'],
    ['print', '여기서 나가려고하는데 무슨 옷을 입어야할지 모르겠군'],
    ['wait-click'],
    ['print', '밖에 날씨가 어떤지 좀 말해주겠나? 춥다, 덥다 이런식으로'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '어엄.... 지금 날씨는요...'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_2_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 11],
    ['print', '예끼 이놈!!!!'],
    ['wait-click'],
    ['visible',false],
  ]

  
  stage2_2_3= [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 11],
    ['print', '코딩 지옥에서는 그렇게 하는 게 아니여!!!!!!!!!!!'],
    ['wait-click'],
    ['print', '코오-딩을 해야한단 말이다 코오-딩을!!!! 알간?!?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '.............................................'],
    ['wait-click'],
    ['setFace', 10],
    ['print', '이래서 요새 신참들은... 에잉 쯧쯧쯧쯧쯧....'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '...............................'],
    ['wait-click'],
    ['setFace', 10],
    ['print', '...............................'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_2_4 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 11],
    ['print', '멀뚱히 서서 뭐 하는 것이여?!?! 얼릉 코오-딩하지 못혀?!?!?'],
    ['wait-click'],
    ['setFace', 11],
    ['print', '거기 앞에 보따리 있제?? 거기 코드조각 넣어놨응께 빨랑 혀!!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '네.....넵....!!!'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_3_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 10],
    ['wait-click'],
    ['print', '날이 덥다고? 알겠네 조금만 기다리게'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_3_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 10],
    ['print', '그래 이거야!'],
    ['wait-click'],
    ['print', '아이고 이걸 고마워서 어쩌나~~'],
    ['wait-click'],
    ['print', '고마우니 그 코드조각은 학생이 가져!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '가 감사합니다...'],
    ['wait-click'],
    ['print', '할아버지 혹시 원래 살던 곳으로 돌아가는 방법이 있나요?'],
    ['wait-click'],
    ['setFace', 10],
    ['print', '원래 살던 곳??허허 그건 나도 알고싶구먼.'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(하긴 벌써 해답이 나올리가 없지...)'],
    ['wait-click'],
    ['setFace', 10],
    ['print', '걱정하지말게, 여기도 살만혀~'],
    ['wait-click'],
    ['print', '나도 여기 처음 왔을 땐 학생처럼 젊고 건강했다네!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '그럴수가...'],
    ['wait-click'],
    ['visible',false],
    ['wait-time', 1],
  ]

  stage2_4_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 10],
    ['wait-click'],
    ['print', '날이 춥다고? 알겠네 조금만 기다리게'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_4_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 12],
    ['print', '자네! 이 옷차림은 아닌것 같은데?'],
    ['wait-click'],
    ['print', '다시 한번 말해주게!!!'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_5 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '할아버지의 부탁을 먼저 해결하자'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_6 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '저쪽에서 무슨 소리가 들렸는데?'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_7 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '무슨 일이니 꼬마야?'],
    ['wait-click'],
    ['setFace', 13],
    ['print', '(훌쩍훌쩍)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '왜 울고있어?'],
    ['wait-click'],
    ['setFace', 13],
    ['print', '공이.......'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_8 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '이런! 팔이 안 닿나 보구나!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '내가 도와줄게!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '......'],
    ['wait-click'],
    ['wait-time', 1],
    ['setFace', 1],
    ['print', '이럴수가.. 내 팔은 너무 짧아...'],
    ['wait-click'],
    ['setFace', 5],
    ['print', 'while문을 사용하면 꺼낼 수 있을텐데...'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '응? 뭔 문?'],
    ['wait-click'],
    ['setFace', 13],
    ['print', '학원에선 아직 while문까지 진도를 나가지 않아서...'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '.....'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(유치원생이 나보다 더 잘 아는군.)'],
    ['wait-click'],
    ['setFace', 13],
    ['print', '언니 이거 받으세요.'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_10 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 13],
    ['print', '와 감사합니다!'],
    ['wait-click'],
    ['visible',false],
  ]




  stage3_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 15],
    ['print', '어떡하지.. '],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(하 시원하다... 들어오니 좀 살 것 같네.)'],
    ['wait-click'],
    ['visible',false],
  ]
  stage3_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 15],
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
    ['setFace', 15],
    ['print', '세상에! 진짜 해냈구나! '],
    ['wait-click'],
    ['print', '고마워! 코드조각은 너 가져'],
    ['wait-click'],

    ['visible',false],
  ]

  //독백
  stage5_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '(뭐야 여기는?? 분위기가....도서관인가?)'],
    ['wait-click'],
    ['print', '(저기 사람이 있어....! 한 번 물어보자.)'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '저기...'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '...아, 도서관이 처음이신가요?'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '네, 어떻게 아셨어요?'],
    ['wait-click'],
    ['setFace', 20],
    ['print', '그 복장을 보면 딱 봐도 알 수 있죠. 저도 처음 여기 왔을 땐 적응하기 힘들었어요.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '다들 그렇구나...'],
    ['wait-click'],
    ['setFace', 20],
    ['print', '도서관에서는 말 그대로 책을 빌릴 수도 있고, \'라이브러리\'를 빌릴 수도 있어요.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '라이브러리요?'],
    ['wait-click'],
    ['setFace', 20],
    ['print', '라이브러리는 ~~~~한거에요. 프로그램을 짜는 걸 더욱 편리하게 해주죠.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '오... 저도 빌릴 수 있나요?'],
    ['wait-click'],
    ['setFace', 20],
    ['print', '당신도 이제 코딩지옥의 주민이니, 회원증을 만드신다면 얼마든지요.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '(여기 더 오래 있고싶은 생각은 없지만...일단 만들어두는 게 좋겠지.)'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '그럼 저도 회원증을 만들게요.'],
    ['wait-click'],
    ['setFace', 21],
    ['print', '넵 잠시만요...성함이?'],
    ['wait-click'],
    ['visible',false],
  ]

  stage5_4 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '여기 회원증입니다. 빌리고 싶은 책이나 라이브러리가 있으시면 회원증을 들고 저에게 와주시면 됩니다.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '네, 감사합니다!'],
    ['wait-click'],
    ['visible',false],
  ]

  stage5_5 = [
    ['visible',true],
    ['setFace', 1],
    ['print', '* [회원증]을 얻었습니다. *'],
    ['wait-click'],
    ['visible',false],
  ]

  stage5_6 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '(일단은 여길 한 번 둘러볼까)'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_7 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '안녕하세요. 라이브러리를 대여하려고 하는데요.'],
    ['wait-click'],
    ['setFace', 20],
    ['print', '네, 잠시 회원증을 주시겠어요?'],
    ['wait-click'],
    ['visible',false],
  ]
  select0=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '네. 현재 대여 가능하신 라이브러리는 이렇게 있는데, 어떤 걸 대여하시겠어요?'],
    ['wait-click'],
    ['visible',false],
  ]
  select1=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '이미 <math.h>를 대여 중이신데, 어떻게 하시겠어요?'],
    ['wait-click'],
    ['visible',false],
  ]
  select2=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '이미 <string.h>를 대여 중이신데, 어떻게 하시겠어요?'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_8_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '넵. 알겠습니다.'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_8_2 = [
    ['visible',true],
    ['setFace', 20],
    ['print', '여기 회원증입니다.'],
    ['wait-click'],
    ['visible',false],
  ]

  stage5_8_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '* 라이브러리 대여 상황이 업데이트 되었습니다. *'],
    ['wait-click'],
    ['visible',false],
  ]

  stage5_11=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 23],
    ['print', '거기 잠옷 입으신 분! 잠시 저 좀 도와주실 수 있으세요??'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_12=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '무슨 일인데요?'],
    ['wait-click'],
    ['setFace', 23],
    ['print', '제가 수학 숙제를 하는데, 답안지를 잃어버려서...문제 답이 뭔지 알아봐 줄 수 있을까요?'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '저기, 저도 수학을 그렇게 잘하는 게 아니라서...'],
    ['wait-click'],
    ['setFace', 23],
    ['print', '<math.h> 라이브러리를 사용하면 된다고 들은 것 같아요! 제발 한 번만 도와주세요ㅠㅠ '],
    ['wait-click'],
    ['print', '제가 코딩 성적은 맨날 꼴지였어서...ㅠㅠ'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '흠...알았어. 나도 공부하는 셈 치고 도와주지 뭐.'],
    ['wait-click'],
    ['setFace', 23],
    ['print', '와 감사합니다..!!여기 문제에요.'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_13=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '(아직 여기서 하지 못한 일이 있는 것 같아.)'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_14=[
    ['place', 40,10],
    ['wait-click'],
    ['visible',true],
    ['setFace', 0],
    ['print', '(음, 이게 맞는 것 같긴 한데, 이제 학생 가까이에 가서 말해주면 될 것 같아.)'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_15=[
    ['place', 40,10],
    ['wait-click'],
    ['visible',true],
    ['setFace', 23],
    ['print', '와 감사합니다!!!ㅠㅠㅠ 이제 채점 할 수 있겠어요!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '...'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '왜?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '... ...'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '...'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_16=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '(공부에 열중하고 있는 것 같네.)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(...다시 보니 졸고 있잖아?)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '* 옆에 이전에 풀었던 수학 문제가 있다. *'],
    ['wait-click'],
    ['visible',false],
  ]


  stage6_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '여긴 아직 정리 중인가보네.'],
    ['wait-click'],

    ['visible',false],
  ]

  stage6_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 25],
    ['print', '어? 여긴 어떻게?'],
    ['wait-click'],
    ['print', '아무튼 잘됐다! 책 정리하는 것 좀 도와줘!'],
    ['wait-click'],
    ['print', '저기 책상위에 책 보이지? 나한테 좀 줘봐!'],
    ['wait-click'],

    ['visible',false],
  ]

  stage6_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 5],
    ['print', '우당당탕!!'],
    ['wait-click'],
    ['setFace', 25],
    ['print', '으아아악 이게 뭐야!'],
    ['wait-click'],
    ['print', '더 어지럽혀졌잖아!ㅜㅜ'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '헉 죄송해요...'],
    ['wait-click'],
    ['setFace', 25],
    ['print', '도서관장님이 오시기 전에 다 정리해야할텐데...'],
    ['wait-click'],
    ['print', '이 꼴을 보이면 또 혼날텐데...'],
    ['wait-click'],
    ['print', '잘리는 건 아니겠지...?겨우 얻은 직장인데...'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '...도와드릴게요'],
    ['wait-click'],
    ['setFace', 25],
    ['print', '정말이니? 고마워!'],
    ['wait-click'],
    ['print', '아까 들어보니까 코딩을 할 줄 아는 것 같던데,'],
    ['wait-click'],
    ['print', '배열이 뭔지는 알고있니?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '아니요??'],
    ['wait-click'],
    ['setFace', 25],
    ['print', '배열을 알면 정리하는 일이 더 빨리 끝날거야. 가르쳐줄까?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '그럼 저야 좋죠.'],
    ['wait-click'],
    ['setFace', 25],
    ['print', '좋아. 그럼...거기 있는 갈색 책을 들어볼래?'],
    ['wait-click'],
    ['visible',false],
  ]

  stage6_4 = [
    ['visible',true],
    ['setFace', 25],
    ['print', '이건 배열에 관한건데.. -이 책의 첫 페이지를 한 번 봐볼래?'],
    ['wait-click'],
    ['print', '페이지가 0부터 시작하지?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '그렇네요? 보통 1부터 시작할텐데.'],
    ['wait-click'],
    ['setFace', 3],
    ['print', '으아아악 이게 뭐야!'],
    ['wait-click'],
    ['print', '배열도 똑같아~!~! 0부터 시작하지!, 그 다음이 1이고'],
    ['wait-click'],
    ['print', '그럼, 만약에 이 배열이름을 book이라고 둬보자'],
    ['wait-click'],
    ['print', '그럼, book[0]은 뭘까? book배열의 1번째 원소를 찾는거야!'],
    ['wait-click'],
    ['print', ' \'네모\' 겠지!!'],
    ['wait-click'],
    ['print', '다음장을 함 볼까??// 책 넘김'],
    ['wait-click'],

    ['visible',false],
  ]

  stage6_5 = [
    ['visible',true],
    ['setFace', 25],
    ['print', '봐바 0,1 그다음엔 2겠지?'],
    ['wait-click'],
    ['print', '그렇다면 book[3] 는 뭘까?'],
    ['wait-click'],
    ['print', '4번째 요소를 찾는건데 바로 하트 인거죠~!'],
    ['wait-click'],
    ['print', '설명 설명..,, 대사'],
    ['wait-click'],
    ['print', '그럼 어디한번 퀴즈를 풀어볼래? 준비 됬니?'],
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
