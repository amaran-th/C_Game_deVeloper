
import Player from "./Player.js";
import Minicoding from "./Minicoding.js";
import DialogText from "./DialogText.js";
import Dialog from "./Dialog.js";



const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

var state = 0;
var text;
var code_piece_1;
var code_piece_2;
export default class TestScene extends Phaser.Scene {   
    constructor(){ 
        super("bootGame"); //identifier for the scene
    }

    preload() {
        /*** FROM Minicode.js***/
        this.load.html('input', './assets/js/textInput.html');

        this.load.image("tiles", "./assets/images/testSceneMap.png");
        this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");

        /** FROM Player.js**/
        this.load.spritesheet('player', './assets/images/heroin.png', {
            frameWidth: 80,
            frameHeight: 140
        });

        /** 텍스트 박스에 사용하는 플러그인 rexUI preload **/
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
        
        /** 순차진행에 필요한 플러그인 **/
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsequenceplugin.min.js';
        this.load.plugin('rexsequenceplugin', url, true);

        this.onTile = 1;
        
    }
    
    create () {
        this.textbox = new DialogText();
        this.dialog = new Dialog(this);
        
        
        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "map" });
        
        const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("ground", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        const sign = map.createLayer( "sign", tileset, 0, 0); //값이 안읽혔다는데 잘뜨긴함
        this.triggerpoint= map.createLayer("trigger", tileset, 0, 0);


        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.minicode = new Minicoding();


        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.triggerpoint.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.triggerpoint);


        /*** 충돌지점 색 칠하기 Mark the collid tile ***/
        const debugGraphics = this.add.graphics().setAlpha(0,75);
        this.worldLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243,134,48,255),
        faceColor: new Phaser.Display.Color(40,39,37,255)
        }); //근데 작동 안하는듯... 중요한 거 같진 않으니 일단 넘어감

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

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
        this.entire_code_button = this.add.image(20,20,'entire_code_button').setOrigin(0,0);
        this.entire_code_button.setInteractive();
        this.commandbox = this.add.image(map.widthInPixels, 5,'commandbox').setOrigin(0,0);
                
        /*** 전체코드를 띄우고 드래그 할 수 있기위한 설정 ***/
        this.graphics = this.make.graphics();
        text = this.add.text(map.widthInPixels, 25, contenttext, { fontFamily: 'Arial', color: '#ffffff', wordWrap: { width: 350 } }).setOrigin(0,0);     
        var mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);
        text.setMask(mask);

        // 드래그앤드랍
        var zone = new DragAndDrop(this, 300, 20, 100, 30).setRectangleDropZone(100, 30);
           
    }

    update() {
        this.player.update();

        /** 표지판 근처에 갔을 때 itsays 작동 **/
        this.triggerpoint.setTileIndexCallback(1,this.itsays,this);

        /*** 화면 이동시 entire code button 따라가도록 설정***/
        this.entire_code_button.x = this.worldView.x + 5;

        /*** 버튼 클릭마다 명령창 띄웠다 없앴다 ***/
        //여기 슬라이드 적용 안 돼서 수정예정
        if(state == 0) {
            this.entire_code_button.on('pointerdown', () => { //명령창 띄우기
                this.commandbox.setVisible(true);
                text.setVisible(true);
                console.log("보임:"+this.commandbox.x);
                this.slidebox();
                state = 1;
            });
        } else {
            this.commandbox.x = this.worldView.x + 310; //화면 이동시 명령창 따라가도록 설정
            text.x = this.worldView.x + 325; // 화면 이동시 글 이동
            var invenZone = this.add.zone(this.worldView.x + 745, 300, 100, 570).setRectangleDropZone(100,550);
            var invenGra = this.add.graphics();
            invenGra.lineStyle(4, 0x00ff00);
            invenGra.strokeRect(invenZone.x - invenZone.input.hitArea.width / 2, invenZone.y - invenZone.input.hitArea.height / 2, invenZone.input.hitArea.width, invenZone.input.hitArea.height);
            this.graphics.fillRect(this.worldView.x + 320, 20, 360, 550); // 화면 이동시 글이 보이는 판을 이동 
            /*** 드래그를 하기위해 존 설정 + 드래그 설정 ***/
            var zone = this.add.zone(this.worldView.x + 320, 25,  360, 550).setOrigin(0).setInteractive();
            zone.on('pointermove', function (pointer) {
                if (pointer.isDown){
                    text.y += (pointer.velocity.y / 10);
                    text.y = Phaser.Math.Clamp(text.y, -400, 600);
                    //this.extext.setVisible(true);
                }
            });

            this.entire_code_button.on('pointerdown', () => {
                this.commandbox.setVisible(false);
                text.setVisible(false);
                invenGra.setVisible(false);
                console.log("지움:"+this.commandbox.x);
                state = 0;
            });
        }

        this.triggerpoint.setTileIndexCallback(1,this.playerOnTile,this);

    }

    /*** 명령창 슬라이드 함수 ***/
    slidebox() {
        this.tweens.add({
            targets: this.commandbox,
            x: this.worldView.x + 415,
            ease: 'Power3'
        });
        //console.log("3:"+this.commandbox.x);
    }

    dialogBox(i) {
        console.log('다이얼로그 박스 함수:', i);
        return sleep(10).then( resolve =>
            this.textbox.createTextBox(this ,600, 200, {
                wrapWidth: 100, //나오는 대사 길이 조절
                fixedWidth: 100, //말풍선 길이
                fixedHeight: 50,
            })
            .start(configDialog.dialog[i].text, 50)
            )
    }
    
    async dialogBoxFor(i) {
                await this.dialogBox(i);
                console.log('다이얼로그 박스 함수 끝:', this.dialogOn );
    }


    playerOnTile() {
        if(this.onTile) {
            this.minicode.create(this);

            /** 플레이어 대사 **/
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this); //텍스트박스(다이얼로그 박스)를 불러와주는 함수를 따로 또 적어줘야함(scene 지정 문제 때문에)
            seq
                .load(this.dialog.talk1, this.dialog)
                .start();
        }
    }

    //타일과 플레이어의 충돌했을때 그 return값이 boolean인 함수를 못찾겠음... 그 이유로 else-if 대신 아래의 방식을 행함

    //타일을 밟을 때마다 count가 1씩 증가한다.
    //minicode는 타일을 밟고 있을 때 '딱 한 번' 실행돼서 그것이 계속 유지되고 있어야 한다.
    //그렇기 때문에 count가 1보다 작거나 같은 경우에만 minicode가 실행되게 한다.

    playerOffTile() {
        //this.offTile = true;
        //this.minicode.create(this);
        this.Minicoding.setActive(true);
        this.Minicoding.setVisible(false);
    }

    //타일에서 발을 땐 경유에는 count를 0으로 초기화 한다.
    //count가 0인 경우에는 minicode를 지워야 한다.
    //minicode는 minicode.js에 들어가서만 지울 수 있다 (여기서 지우는 방법 급구.......)
    //따라서 타일에서 발을 땐 경우 minicode를 한 번 더 실행하고, count가 0일때만 setvisible(false)를 실행하도록 한다.

    
    //dk.........씨바 난 모르겠다...
}
