
import Player from "./Player.js";
import Minicoding from "./Minicoding.js";
import DialogText from "./DialogText.js";
import Dialog from "./Dialog.js";
import Minibox from "./Minibox.js";


const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

var state = 0;

export default class TestScene extends Phaser.Scene {   
    constructor(){ 
        super("bootGame"); //identifier for the scene
    }

    preload() {
        /*** FROM Minicode.js***/
        this.load.html('input', './assets/js/textInput.html');

        this.load.image("tiles", "./assets/images/map.png");
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

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "map" });
        
        const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("ground", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 330);
        this.player.player.setFlipX(true);
        this.minicode = new Minicoding();


        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.deco.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.deco);


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
        var contenttext = '#include<stdio.h>\nint main(void){printf("hi");return 0;}';

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
        this.draganddrop_1 = new DragAndDrop(this, 300, 20, 100, 30).setRectangleDropZone(100, 30).setName("1");
        this.draganddrop_2 = new DragAndDrop(this, 500, 20, 100, 30).setRectangleDropZone(100, 30).setName("2");
        this.draganddrop_3 = new DragAndDrop(this, 700, 20, 100, 30).setRectangleDropZone(100, 30).setName("3");

        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });



        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //플레이어 얼려두기
        /** 초반 인트로 대사 출력 **/
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.intro, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });
        //===================================================================================
        //compile button
        this.compile_button = this.add.image(20,150,'compile_button').setOrigin(0,0);
        this.compile_button.setInteractive();
        this.compile_button.on('pointerdown', () => {
           
            if (contenttext !== '')
                {
                    var data = {

                        'code': contenttext
    
                    };
                    data = JSON.stringify(data);

                    var xhr = new XMLHttpRequest();

                    xhr.open('POST', '/form_test', true);                
                    
                    xhr.setRequestHeader('Content-type', 'application/json');
                    xhr.send(data);
                    xhr.addEventListener('load', function() {
                        
                        var result = JSON.parse(xhr.responseText);
    
                        if (result.result != 'ok') return;
                        console.log(result.output);
                        //document.getElementById('testoutput').value = result.output;
    
                    });
                    //  Turn off the click events
                    //this.removeListener('click');
                    //  Hide the login element
                    //this.setVisible(false);
                    //  Populate the text with whatever they typed in
                    //text.setText('Welcome ' + inputText.value);
                }
                else
                {
                    //  Flash the prompt 이거 뭔지 모르겠음 다른 곳에서 긁어옴
                    this.scene.tweens.add({
                        targets: text,
                        alpha: 0.2,
                        duration: 250,
                        ease: 'Power3',
                        yoyo: true
                    });
                            }
            console.log(" compile finish!!!");
           
        });
        //=================================================================================
           
        /*** 인벤토리 버튼 활성화 ***/
        this.inventory_button = this.add.image(map.widthInPixels - 100, 20,'inventory_button').setOrigin(0,0);
        this.inventory_button.setInteractive();
        this.invenZone = this.add.zone(map.widthInPixels + 745, 300, 100, 570).setRectangleDropZone(100,550);
        this.invenGra = this.add.graphics();
        this.invenGra.lineStyle(4, 0x00ff00);


        //플레이어 위 pressX 생성해두기
        this.pressX = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

         /*** 미니코딩창 불러오기 ***/
         this.minibox = new Minibox(this);
         //드래그앤드롭으로 zone에 있는 코드 받아올거임.
         this.code_zone_1 = "";
         this.code_zone_2 = "";
         this.code_zone_3 = "";
    }

    update() {
        this.player.update();
        this.minibox.update(this);
        /*** 인벤토리 ***/
        if(state == 0) {
            this.inventory_button.on('pointerdown', () => {
                this.invenGra.setVisible(true);
                state = 1;
            });
        } else {
            this.invenZone.x = this.worldView.x + 745; //화면 이동시 따라가도록 설정
            this.invenGra.strokeRect(this.invenZone.x - this.invenZone.input.hitArea.width / 2, this.invenZone.y - this.invenZone.input.hitArea.height / 2, this.invenZone.input.hitArea.width, this.invenZone.input.hitArea.height);
            this.inventory_button.on('pointerdown', () => {
                this.invenGra.setVisible(false);
                state = 0;
            });
        }


        //this.triggerpoint.setTileIndexCallback(1,this.playerOnTile,this);
        if(this.player.player.x < 300) {
            this.playerOnTile();
        }
        else{
            //this.scene.remove();
        }

        /* 플레이어가 문 앞에 서면 작동하도록 함 */
        if(this.player.player.x < 175 && 100 < this.player.player.x ) {
            this.pressX.x = this.player.player.x-50;
            this.pressX.y = this.player.player.y-100;
            this.pressX.setVisible(true);

            if(this.keyX.isDown) {
                this.cameras.main.fadeOut(100, 0, 0, 0); //is not a function error
                this.scene.sleep('testScene'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
                this.scene.run("stage1");
            }
        }
        else this.pressX.setVisible(false);

        
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;
        
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
