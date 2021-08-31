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

      this.keyX = this.scene.input.keyboard.addKey('X');

      this.keyX.on('down', () => {
        this.complete();
        console.log('asdf');
     }); //x키 입력 가능하게 함!!
  
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
    //this.click = true;

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
      //this.click = true; 
      //항상 웨잇클릭 뒤에 print를 사용한다고 가정
      //(제일 처음으로 쓰는 print는 loadbox 함수에서 this.click = true가 선언돼 있어서 상관x)
      this.script.setText(msg);
      // return undefined to run next command
  }

  waitClick() {
    /*
    this.scene.input.keyboard.on('keydown-' + 'X', () => {
      if(this.click) {
        this.click = false;
        console.log('qasdf')
        this.complete();
      }
    });
    */

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
    ['setFace', 4],
    ['print', '* [Quest] 휴대전화를 얻자 *'],
    ['wait-click'],
    ['visible',false],
  ]

  
  intro1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 4],
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
    ['print', '(이게 뭐야?)'],
    ['wait-click'],
    ['print', '(내가 영어를 싫어하긴 하지만 printf가 아니라 print가 맞는 말이라는 것 정돈 안다고.)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(그것보다 이게 왜 우리집에?)'],
    ['wait-click'],
    ['setFace', 4],
    ['print', '* 자세히 보니 보따리에는 작은 쪽지가 들어있었다. *'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(쪽지...?)'],
    ['wait-click'],
    ['print', '* 코딩 지옥에 오신 걸 환영합니다!'],
    ['wait-click'],
    ['print', '*이 곳은 모든 일이 당신이 만든 C 코드에 의해 일어나는 공간입니다.'],
    ['wait-click'],
    ['print', '이 보따리에 들어있던 코드조각들은 처음 이곳에 온 당신에게 드리는 선물입니다!'],
    ['wait-click'],
    ['print', '휴대전화의 튜토리얼을 통해 코딩에 필요한 기본적인 정보를 얻을 수 있습니다!'],
    ['wait-click'],
    ['print', 'hint : printf를 사용할 땐 C 코드 상단에 #include<stdio.h>를 적는 걸 잊지 말아주세요! *'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '...이게 대체 뭔 소리야?'],
    ['wait-click'],
    ['setFace', 6],
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
    ['print', '* Quest : 폰의 코드 앱을 이용해 말을 해보자. *'],
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
  //퀘스트가 남아있을 때 나가려고 하면 출력
  intro_cannot_exit = [
    ['place', 40,10],
    ['visible',true],
    ['setFace', 1],
    ['print', '(아직은 나가지 말자.)'],
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
    ['setFace', 1],
    ['print', '...미안한데 자세히 설명해줄래?'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '다시 말하자면, 이 세계에선 printf를 사용해서 나오는 말에 힘이 있어.'],
    ['wait-click'],
    ['print', '마치 마법주문같지.'],
    ['wait-click'],
    ['print', '어떤 상황이 되면 거기에 맞게 미완성된 코드가 코딩 앱에 수신되는데,'],
    ['wait-click'],
    ['print', '누가 어디에서 보내는 건진 모르겠어.'],
    ['wait-click'],
    ['print', '그냥 게임적 허용이라고 생각해.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '(방금 그건 메타발언 아닌가...)'],
    ['wait-click'],
    ['print', '흠, 어쨌든.'],
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
    ['print', '내가 그랬나? 어쨌든 너가 하기에 달렸지~'],
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
    ['setFace', 5],
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
    ['print', '할아버지! 잠시 여쭤보고 싶은 게 있는데요...!'],
    ['wait-click'],
    ['setFace', 10],
    ['print', '껄껄 코딩지옥이 처음인가 보구나!'],
    ['wait-click'],
    ['print', '내 부탁을 좀 들어주면 묻는 말에 대답해주지'],
    ['wait-click'],
    ['print', '여기서 나가려고하는데 무슨 옷을 입어야할지 모르겠구나...'],
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
    ['setFace', 4],
    ['print', '* Quest : 할아버지에게 현재 날씨를 알려드리자. *'],
    ['wait-click'],
    ['print', '* 코딩 어플리케이션의 스크립트가 업데이트 되었습니다. *'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_3_1 = [
    ['visible',false],
    ['wait-click'],
    ['visible',true],
    ['place', 40,10],
    ['setFace', 10],
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
  //할아버지 퀘스트 깨고 난 후에 말 걸 수 있게 한다면?
  stage2_3_3 =[
  ['visible',true],
  ['place', 40,10],
  ['setFace', 10],
  ['print', '아이고 덥다~~'],
  ['wait-click'],
  ['visible',false],
]

  stage2_4_1 = [
    ['visible',false],
    ['wait-click'],
    ['visible',true],
    ['place', 40,10],
    ['setFace', 10],
    ['print', '날이 춥다고? 알겠네 조금만 기다리게'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_4_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 12],
    ['print', '자네! 이 옷차림은 아닌 것 같은데?'],
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
    ['setFace', 15],
    ['print', '(훌쩍훌쩍)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '왜 울고있어?'],
    ['wait-click'],
    ['setFace', 15],
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
    ['setFace', 15],
    ['print', 'while문을 사용하면 꺼낼 수 있을텐데...'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '응? 뭔 문?'],
    ['wait-click'],
    ['setFace', 15],
    ['print', '학원에선 아직 while문까지 진도를 나가지 않아서...'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '.....'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(유치원생이 나보다 더 잘 아는군.)'],
    ['wait-click'],
    ['setFace', 15],
    ['print', '(훌쩍훌쩍)'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '어어 울지마;; 내가 꺼내줄게. 나도 코딩은 잘 모르지만...'],
    ['wait-click'],
    ['setFace', 4],
    ['print', '* Quest : 강물의 양을 불려 공을 꺼내자. *'],
    ['wait-click'],
    ['print', '* 코딩 어플리케이션의 스크립트가 업데이트 되었습니다. *'],
    ['wait-click'],
    ['setFace', 15],
    ['print', '언니 이거 받으세요.'],
    ['wait-click'],
    ['visible',false],
  ]
  stage2_9 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '꼬마의 부탁을 먼저 해결하자'],
    ['wait-click'],
    ['visible',false],
  ]

  stage2_10 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 15],
    ['print', '와 감사합니다!'],
    ['wait-click'],
    ['visible',false],
  ]

  //스테이지 3-0에 들어가면 나오는 대사
  stage3_0 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 0],
    ['print', '헉...너무 덥다...'],
    ['wait-click'],
    ['print', '잠깐 시원한 곳으로 들어가야겠어...'],
    ['wait-click'],
    ['setFace', 4],
    ['print', '* Quest : 숨을 돌릴 장소를 찾아 들어가자. *'],
    ['wait-click'],
    ['visible',false],
  ]

  stage3_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '어떡하지.. '],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(하 시원하다... 좀 살 것 같네.)'],
    ['wait-click'],
    ['visible',false],
  ]
  stage3_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '손님! 지금은 브레이크 타임인데...'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '헉, 죄송합니다. '],
    ['wait-click'],
    ['setFace', 1],
    ['print', '밖이 너무 더워서 잠시만 쉬었다 나갈게요.'],
    ['wait-click'],
    ['setFace', 20],
    ['print', '그럼 손님, 잠시 저 좀 도와주실 수 있을까요?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(또야...?)'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '무슨 일인데요?'],
    ['wait-click'],
    ['setFace', 20],
    ['print', '자기소개부터 할게요. 전 제빵왕 김핑퐁이에요.'],
    ['wait-click'],
    ['print', '며칠 전, 자고 일어났더니 코딩지옥에 갇히게 되었어요.'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '헉 저도에요! 저는 오늘 왔는데...'],
    ['wait-click'],
    ['setFace', 20],
    ['print', '다행히 이곳 주민분들께 도움을 받아서 빵집을 차렸지만,'],
    ['wait-click'],
    ['print', '이곳은 빵도 코딩으로 만들더라구요...하지만 저는 코딩을 못해요'],
    ['wait-click'],
    ['print', '그래서말인데, 빵을 딱 25개만 만들어줄래요?'],
    ['wait-click'],
    ['print', '아! 여기 어딘가에 코드조각을 놔뒀는데, 필요하시면 찾아서 가져도 돼요.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '아..넵..'],
    ['wait-click'],
    ['setFace', 4],
    ['print', '* Quest : 핑퐁씨에게 빵을 25개 만들어주자. *'],
    ['wait-click'],
    ['print', '* 코딩 어플리케이션의 스크립트가 업데이트 되었습니다. *'],
    ['wait-click'],
    ['visible',false],
  ]
  stage3_2_2=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '이게 왜 이런 곳에 있는거지...?'],
    ['wait-click'],
    ['visible',false],
  ]
  stage3_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '세상에! 진짜 해냈군요!'],
    ['wait-click'],
    ['print', '고마워요! 덕분에 오늘은 무사히 장사를 할 수 있겠어요!'],
    ['wait-click'],
    ['visible',false],
  ]

  stage4_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 20],
    ['print', '흑흑흑!'],
    ['wait-click'],
    ['print', '왜 알파벳으로 나눗셈을 하는 거야?!'],
    ['wait-click'],
    ['print', "'알파값을 찾으라' 따위의 수학 문제도 아니면서!"],
    ['wait-click'],
    ['print', "나눗셈은 숫자로 하는 거라고!"],
    ['wait-click'],
    ['print', "저기요, 이거 가져요"],
    ['wait-click'],
    ['print', "가져가서 유황불에 태워버린다음에 어디 묻어버려요!"],
    ['wait-click'],
    ['setFace', 1],
    ['print', "(새로운 문법 아이템을 받았다.)"],
    ['wait-click'],
    ['visible',false],
  ]

  //스테이지 4 들어가자마자 출력되는 대사
  stage4_0 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    ['print', '음...나가는 방법에 대한 정보는 못 얻었지만...'],
    ['wait-click'],
    ['print', '그래도 여기까지 오면서 이것저것 많이 배운 것 같아.'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '그건 그렇고 여긴 분위기가 좀 다르네?'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '...저 사람도 악마인가?'],
    ['wait-click'],
    ['setFace', 4],
    ['print', '* Quest : 악마에게 말을 걸자. *'],
    ['wait-click'],
    ['visible',false],
  ]

  //악마에게 말을 걸었을 때 나오는 대사
  stage4_0_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 40],
    ['print', '어머, 처음보는 얼굴이네? 신입이야?'],
    ['wait-click'],
    ['print', '난 이 구역 문지기 악마야. 이름은 런타임 에러. 편하게 런타임이라고 불러.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '여기는 뭐하는 곳이죠?'],
    ['wait-click'],
    ['setFace', 40],
    ['print', '보면 몰라? 관문이잖아. 신택스가 설명 안해줬니?'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '네...'],
    ['wait-click'],
    ['setFace', 40],
    ['print', '이자식 이거 요즘 일 대충 하네...하...'],
    ['wait-click'],
    ['print', '코딩지옥은 여러 구역으로 나뉘어져있는데,'],
    ['wait-click'],
    ['print', '너가 왔던 곳은 불지옥이야. 이 너머는 도서관이고.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '(...불지옥이랑 도서관....? 무슨 조합이람.)'],
    ['wait-click'],
    ['setFace', 41],
    ['print', '머 근데 여기 규칙때문에...그냥 통과시켜주진 않고,'],
    ['wait-click'],
    ['setFace', 42],
    ['print', '내가 내는 문제를 맞춰야 해.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '예?'],
    ['wait-click'],
    ['setFace', 40],
    ['print', '일종의 시험이야.'],
    ['wait-click'],
    ['setFace', 41],
    ['print', '왜 그런 걸 정해놓은 건진 모르겠는데, 여기도 나름 계급이 있어서.'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '계급이라구요...?'],
    ['wait-click'],
    ['setFace', 42],
    ['print', '무겁게 생각하지마.'],
    ['wait-click'],
    ['setFace', 40],
    ['print', '그냥 코딩 초보랑 고수 나누는 딱 그 정도니까.'],
    ['wait-click'],
    ['print', '그래서, 시험에 임할래?'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '저는 그냥 원래 살던 곳으로 돌아가고 싶은데,'],
    ['wait-click'],
    ['print', '도서관에 가면 실마리가 있을까요?'],
    ['wait-click'],
    ['setFace', 40],
    ['print', '도서관에는 정보가 많으니까,'],
    ['wait-click'],
    ['setFace', 42],
    ['print', '어쩌면 도움이 될 정보가 있을 지도 모르지.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '그럼 저도 시험에 임할래요.'],
    ['wait-click'],
    ['setFace', 40],
    ['print', '그래, 좋아.'],
    ['wait-click'],
    ['visible',false],
  ]
  stage4_quiz_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', 'printf("1 + ㅤㅤㅤㅤ = 4", 3 } ?'],
    //['wait-click'],
    //['visible',false],
  ]

  stage4_q_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '그래도 예전보단 덜 멍청하군!'],
    ['wait-click'],
    ['print', '두번째 퀴즈다!'],
    ['wait-click'],
    ['visible',false],
  ]

  stage4_quiz_2 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', 'printf("welcome to ㅤ ell!"), h } ?'],
  ]

  stage4_q_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '이제 그만 멍청하기로 한거냐?'],
    ['wait-click'],
    ['print', '세번째 퀴즈다!'],
    ['wait-click'],
    ['visible',false],
  ]

  stage4_quiz_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', 'printf(" ㅤㅤㅤㅤ "), "I love Hell!" } ?'],
  ]

  stage4_q_4 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '이거 기대 이상이라 섭섭해지려 하는데'],
    ['wait-click'],
    ['print', '마지막 퀴즈다!'],
    ['wait-click'],
    ['visible',false],
    
  ]

  stage4_quiz_4 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', 'printf("π = ㅤㅤㅤㅤ "), "3.14" } ?'],
  ]

  stage4_5 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 2],
    ['print', '잠옷입고 누워 자기만 좋아하는 놈인줄 알았는데 그래도 공부를 했나보지?'],
    ['wait-click'],
    ['print', '이제 유치원생 수준은 벗어났군'],
    ['setFace', 1],
    ['print', '(유치원생....)'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '좋아! 통과다!'],
    ['wait-click'],
    ['print', '이 앞으로 가면 더 높은 구역으로 갈 수 있을거다.'],
    ['wait-click'],
    ['print', '이제 썩 사라져!'],
    ['wait-click'],
    ['visible',false],
  ]

  stage4_6 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 1],
    /*
    ['print', '문 앞에 무엇이 적혀있어'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '<비밀번호는 0과 10 사이 홀수의 합이다. 비밀번호를 맞추시오>'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '지금 장난해?'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '잠깐, 뒤에 뭐가 더 적혀있네'],
    ['wait-click'],
    ['setFace', 5],
    ['print', '<단, 코딩으로.>'],
    ['wait-click'],
    ['setFace', 1],
    */
    ['print', '.....'],
    ['wait-click'],
    ['visible',false],
    
  ]

  stage4_7 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 5],
    ['print', '아무일도 일어나지 않는다.'],
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
    ['setFace', 25],
    ['print', '그 복장을 보면 딱 봐도 알 수 있죠. 저도 처음 여기 왔을 땐 적응하기 힘들었어요.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '다들 그렇구나...'],
    ['wait-click'],
    ['setFace', 25],
    ['print', '도서관에서는 말 그대로 책을 빌릴 수도 있고, \'라이브러리\'를 빌릴 수도 있어요.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '라이브러리요?'],
    ['wait-click'],
    ['setFace', 25],
    ['print', '라이브러리는 ~~~~한거에요. 프로그램을 짜는 걸 더욱 편리하게 해주죠.'],
    ['wait-click'],
    ['setFace', 1],
    ['print', '오... 저도 빌릴 수 있나요?'],
    ['wait-click'],
    ['setFace', 25],
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
    ['setFace', 25],
    ['print', '여기 회원증입니다.'],
    ['wait-click'],
    ['print', '빌리고 싶은 책이나 라이브러리가 있으시면 회원증을 들고 저에게 와주시면 됩니다.'],
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
    ['setFace', 25],
    ['print', '네, 잠시 회원증을 주시겠어요?'],
    ['wait-click'],
    ['visible',false],
  ]
  select0=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 25],
    ['print', '네. 현재 대여 가능하신 라이브러리는 이렇게 있는데, 어떤 걸 대여하시겠어요?'],
    ['wait-click'],
    ['visible',false],
  ]
  select1=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 25],
    ['print', '이미 <math.h>를 대여 중이신데, 어떻게 하시겠어요?'],
    ['wait-click'],
    ['visible',false],
  ]
  select2=[
    ['visible',true],
    ['place', 40,10],
    ['setFace', 25],
    ['print', '이미 <string.h>를 대여 중이신데, 어떻게 하시겠어요?'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_8_1 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 25],
    ['print', '넵. 알겠습니다.'],
    ['wait-click'],
    ['visible',false],
  ]
  stage5_8_2 = [
    ['visible',true],
    ['setFace', 25],
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
    ['setFace', 30],
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
    ['setFace', 30],
    ['print', '제가 수학 숙제를 하는데, 답안지를 잃어버려서...문제 답이 뭔지 알아봐 줄 수 있을까요?'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '저기, 저도 수학을 그렇게 잘하는 게 아니라서...'],
    ['wait-click'],
    ['setFace', 30],
    ['print', '<math.h> 라이브러리를 사용하면 된다고 들은 것 같아요! 제발 한 번만 도와주세요ㅠㅠ '],
    ['wait-click'],
    ['print', '제가 코딩 성적은 맨날 꼴지였어서...ㅠㅠ'],
    ['wait-click'],
    ['setFace', 2],
    ['print', '흠...알았어. 나도 공부하는 셈 치고 도와주지 뭐.'],
    ['wait-click'],
    ['setFace', 30],
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
    ['setFace', 30],
    ['print', '와 감사합니다!!!ㅠㅠㅠ 이제 채점 할 수 있겠어요!'],
    ['wait-click'],
    ['setFace', 30],
    ['print', '...'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '왜?'],
    ['wait-click'],
    ['setFace', 30],
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
    ['setFace', 35],
    ['print', '어? 처음 보는 얼굴이네?'],
    ['wait-click'],
    ['print', '아무튼 잘됐다! 책 정리하는 걸 도와주지 않을래?'],
    ['wait-click'],
    ['print', '저기 책상위에 책 보이지? 나한테 좀 줘봐!'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '(어째 이 세계 사람들은 나한테 부탁하는 게 많은 것 같네...)'],
    ['wait-click'],
    ['visible',false],
  ]

  stage6_3 = [
    ['visible',true],
    ['place', 40,10],
    ['setFace', 4],
    ['print', '우당당탕!!'],
    ['wait-click'],
    ['setFace', 35],
    ['print', '으아아악 이게 뭐야!'],
    ['wait-click'],
    ['print', '더 어지럽혀졌잖아!ㅜㅜ'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '헉 죄송해요...'],
    ['wait-click'],
    ['setFace', 35],
    ['print', '도서관장님이 오시기 전에 다 정리해야할텐데...'],
    ['wait-click'],
    ['print', '이 꼴을 보이면... 또 혼날텐데...'],
    ['wait-click'],
    ['print', '잘리는 건 아니겠지...? 겨우 얻은 직장인데...'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '...도와드릴게요'],
    ['wait-click'],
    ['setFace', 35],
    ['print', '정말이니? 고마워!'],
    ['wait-click'],
    ['print', '그런데 혹시 너, 배열이 뭔지는 알고있니?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '아니요??'],
    ['wait-click'],
    ['setFace', 35],
    ['print', '배열을 알면 정리하는 일이 더 빨리 끝날거야. 가르쳐줄까?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '그럼 저야 좋죠.'],
    ['wait-click'],
    ['setFace', 35],
    ['print', '좋아. 그럼...거기 있는 갈색 책을 들어볼래?'],
    ['wait-click'],
    ['visible',false],
  ]

  stage6_4 = [
    ['visible',true],
    ['setFace', 35],
    ['print', '이건 배열에 관한건데.. -이 책의 첫 페이지를 한 번 봐볼래?'],
    ['wait-click'],
    ['print', '페이지가 0부터 시작하지?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '그렇네요? 보통 1부터 시작할텐데.'],
    ['wait-click'],
    ['setFace', 3],
    ['print', '맞아~ 이 책처럼 배열의 번호(index)도 0부터 시작해.'],
    ['wait-click'],
    ['print', '그럼, 만약에 이 배열이름을 book이라고 둬보자'],
    ['wait-click'],
    ['print', '그럼, book[0]은 뭘까? book배열의 1번째 원소를 찾는거야!'],
    ['wait-click'],
    ['print', ' \'네모\' 겠지!!'],
    ['wait-click'],
    ['print', '그럼 책을 다음 장으로 넘겨볼래?'],
    ['wait-click'],
    ['visible',false],
  ]

  stage6_5 = [
    ['visible',true],
    ['setFace', 35],
    ['print', '이것 봐, 0, 1 그 다음엔 2지?'],
    ['wait-click'],
    ['print', '그렇다면 book[3] 는 뭘까?'],
    ['wait-click'],
    ['print', '\'4번째\' 요소를 찾는 거니까 하트가 되겠지?'],
    ['wait-click'],
    ['setFace', 0],
    ['print', '와... 여기 사람들 중에서 제일 설명 잘 하시는 것 같아요.'],
    ['wait-click'],
    ['setFace', 35],
    ['print', '하하. 내가 이래보여도 교사 출신이거든~'],
    ['wait-click'],
    ['print', '컴퓨터 쪽은 아니었지만...'],
    ['wait-click'],
    ['print', '그럼 어디 한번 퀴즈를 풀어볼래? 준비 됐니?'],
    ['wait-click'],
    ['visible',false],
  ]

  //어디에 넣을 수 있을진 모르겠는데 적당히 엔딩낼때 넣을 텍스트
  final_0=[
    ['visible',true],
    ['setFace', 4],
    ['print', '*엔딩 룸에 오신 것을 환영합니다!*'],
    ['wait-click'],
    ['print', '캐릭터에게 말을 걸면 개발진의 후기를 볼 수 있습니다.'],
    ['wait-click'],
    ['visible',false],
  ]

  final_devil1 = [
    ['visible',true],
    ['setFace', 4],
    ['print', '...'],
    ['wait-click'],
    ['print', '안녕하세요. 개발진입니다.'],
    ['wait-click'],
    ['print', '현재까지 준비된 분량은 여기까지에요.'],
    ['wait-click'],
    ['print', '이래저래 게임 개발은 다들 처음이라 부족한 점이 많고 매우 매우 불친절하지만...'],
    ['wait-click'],
    ['print', '여기까지 플레이해주신 여러분에게 감사를 표하고 싶습니다.'],
    ['wait-click'],
    ['print', '여러분의 피드백은 저희의 소중한 자료가 될거에요.'],
    ['wait-click'],
    ['print', '이후 스테이지를 더 만들지는...잘 모르겠네요.'],
    ['wait-click'],
    ['print', '아마 힘들지 않을까 싶어요.'],
    ['wait-click'],
    ['print', '사실 이스터에그도 많이 넣고 싶었는데, '],
    ['wait-click'],
    ['print', '2달은 그런 것까지 신경쓰기엔 너무 짧은 시간이더라구요.'],
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
