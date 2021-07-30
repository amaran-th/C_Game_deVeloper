import Player from "./Player.js";
import Minicoding from "./Minicoding.js";
import DialogText from "./DialogText.js";

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

var state = 0;

export default class TestScene extends Phaser.Scene {   
    constructor(){ 
        super("bootGame"); //identifier for the scene
        console.log("construction of TestScene");
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

        /** 다이얼로그 띄우는 용 rexUI preload **/
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
                
        


        this.onTile = 1;
        console.log("preloading images.....");
        
    }
    
    create () {
        this.textbox = new DialogText();
        this.dialog = new Dialog();
        
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



        console.log("build testScene");

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        /*** 명령창버튼 활성화 ***/
        this.entire_code_button = this.add.image(20,20,'entire_code_button').setOrigin(0,0);
        this.entire_code_button.setInteractive();
        this.commandbox = this.add.image(map.widthInPixels, 5,'commandbox').setOrigin(0,0);
        
        
        /*** 드래그앤드랍 ***/
        //코드 조각 텍스트 (후에 문장으로 바꿔 웹컴파일러 돌릴때 용이하도록)
        var code_piece_text_1 = 'printf';
        var code_piece_text_2 = 'if';
            //... 각 스테이지 구현할 때마다 추가 예정
        
        // 코드 조각 불러와 배치하기
        var code_piece_1 = this.add.text(50, 100, code_piece_text_1, { font: "30px Arial Black", fill: "#fff" });
        var code_piece_2 = this.add.text(50, 135, code_piece_text_2, { font: "30px Arial Black", fill: "#fff" });

        code_piece_1.setInteractive();
        code_piece_2.setInteractive();

        // 드래그 가능하도록
        this.input.setDraggable(code_piece_1); 
        this.input.setDraggable(code_piece_2);

        // 마우스가 코드 조각 위에 위치했을 때 색 변하도록
        code_piece_1.on('pointerover', function () { 
            code_piece_1.setTint(0x44ff44);
        });
        code_piece_2.on('pointerover', function () { 
            code_piece_2.setTint(0x44ff44);
        });

        // 마우스가 코드 조각 벗어났을때 원래 색으로!
        code_piece_1.on('pointerout', function () { 
            code_piece_1.clearTint();
        });
        code_piece_2.on('pointerout', function () { 
            code_piece_2.clearTint();
        });

        // 드랍 영역 위치
        var zone = new MyZone(this, 300, 20, 100, 30);
        zone.setRectangleDropZone(100, 30);
        // 드랍 영역 선으로 임시 표시
        var graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        // 드래그 하려고 선택한 거 맨 위로 올림
        this.input.on('dragstart', function (pointer, gameObject) { 
            this.children.bringToTop(gameObject);
        }, this); 
        // 드래그해서 가는 동작 실시간으로? 보여줌
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        // 드랍 영역 안에 들어가면 영역 색 변환
        this.input.on('dragenter', function (pointer, gameObject, dropZone) { 
            graphics.clear();
            graphics.lineStyle(2, 0x00ffff);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
        });
        // 영역 벗어났을 때 원래 색으로
        this.input.on('dragleave', function (pointer, gameObject, dropZone) { 
            graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
        });
        // 영역안에서도 지정된 부분에만 고정되는 듯
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x - 50; // 이거 왜 위치 중앙이 아니라 오른쪽 밑에 치우치는 지 모르겠음.. 임의로 위치 조정해둠
            gameObject.y = dropZone.y - 15;

            //gameObject.input.enabled = false; // 한 번 드랍되면 더 못 움직이게
        });
        // 드랍 위치가 아니면 원래 자리로 돌아가도록 함 + 색 조정
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped)
            {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
            graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
        });
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
                //console.log("보임:"+this.commandbox.x);
                this.slidebox();
                state = 1;
            });
        } else {
            this.commandbox.x = this.worldView.x + 415; //화면 이동시 명령창 따라가도록 설정
            this.entire_code_button.on('pointerdown', () => { //명령창 띄우기
                this.commandbox.setVisible(false);
                //this.commandbox.setX(this.worldView.x + 1100);
                //console.log("지움:"+this.commandbox.x);
                state = 0;
            });
        }


        //언니꺼~!
        //if(!this.playerOnTile) this.minicode.setvisible(false);
        
        //this.physics.add.overlap(this.triggerpoint, this.playerOnTile , null, this);
        
        this.triggerpoint.setTileIndexCallback(1,this.playerOnTile,this);
        //this.worldLayer.setTileLocationCallback(6, 4, 50, 100, this.playerOffTile, null, this);


        //this.triggerpoint.addListener()
        //if(this.triggerpoint.body.onCollide()) this.itsays;

        //console.log(this.onTile);

        
        //this.physics.collide(this.player, this.triggerpoint, this.itsays, null, this) 둘 다 physics 여야 작동하나봄
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


    /*** 명령창 슬라이드 함수 ***/
    slidebox() {
        this.tweens.add({
            targets: this.commandbox,
            x: this.worldView.x + 415,
            ease: 'Power3'
        });
        //console.log("3:"+this.commandbox.x);
    }
    async dialogBoxFor(i) {
        //for(let i=0; i<5; i++) {
            //console.log('for문:', i);
            //if(this.dialogOn) {
            //    this.dialogOn = false;
                await this.dialogBox(i);
                console.log('다이얼로그 박스 함수 끝:', this.dialogOn );
            //}
        //}
    }


    playerOnTile() {
        if(this.onTile) {
            this.minicode.create(this);
            this.dialogBoxFor(2); //역거움....
            this.dialogBoxFor(1);
            this.dialogBoxFor(0);
            
        }
        //this.onTile += 1;
        //if(onTile < 0) onTile = 2; //혹시나 싶은 오버플로우 방지
    }

    //타일과 플레이어의 충돌했을때 그 return값이 boolean인 함수를 못찾겠음... 그 이유로 else-if 대신 아래의 방식을 행함

    //타일을 밟을 때마다 count가 1씩 증가한다.
    //minicode는 타일을 밟고 있을 때 '딱 한 번' 실행돼서 그것이 계속 유지되고 있어야 한다.
    //그렇기 때문에 count가 1보다 작거나 같은 경우에만 minicode가 실행되게 한다.

    playerOffTile() {
        console.log("player on tile");
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
