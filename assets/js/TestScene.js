import Player from "./Player.js";
import Minicoding from "./Minicoding.js";

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



        console.log("preloading images.....");
        
    }
    
    create () {
        
        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "map" });
        
        const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset(which is same as Png tileset) , source
        const worldLayer = map.createLayer("ground", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
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
        worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, worldLayer); //충돌 하도록 만들기
        this.triggerpoint.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.triggerpoint);


        /*** 충돌지점 색 칠하기 Mark the collid tile ***/
        const debugGraphics = this.add.graphics().setAlpha(0,75);
        worldLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243,134,48,255),
        faceColor: new Phaser.Display.Color(40,39,37,255)
        }); //근데 작동 안하는듯... 중요한 거 같진 않으니 일단 넘어감

        this.count = true;
        console.log("build testScene");

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        /*** 명령창버튼 활성화 ***/
        this.entire_code_button = this.add.image(20,20,'entire_code_button').setOrigin(0,0);
        this.entire_code_button.setInteractive();
        this.commandbox = this.add.image(map.widthInPixels, 5,'commandbox').setOrigin(0,0);
                
    }

    update() {
        this.player.update();

        /** 표지판 근처에 갔을 때 itsays 작동 **/
        this.triggerpoint.setTileIndexCallback(1,this.itsays,this);

        /*** 화면 이동시 entire code button 따라가도록 설정***/
        this.entire_code_button.x = this.worldView.x + 5;

        /*** 버튼 클릭마다 명령창 띄웠다 없앴다 ***/
        //여기 슬라이드 적용 안 돼서 수정예정
        console.log(this.worldView.x);
        if(state == 0) {
            this.entire_code_button.on('pointerdown', () => { //명령창 띄우기
                this.commandbox.setVisible(true);
                console.log("보임:"+this.commandbox.x);
                this.slidebox();
                state = 1;
            });
        } else {
            this.commandbox.x = this.worldView.x + 415; //화면 이동시 명령창 따라가도록 설정
            this.entire_code_button.on('pointerdown', () => { //명령창 띄우기
                this.commandbox.setVisible(false);
                this.commandbox.setX(this.worldView.x + 1100);
                console.log("지움:"+this.commandbox.x);
                state = 0;
            });
        }
    }

    itsays() {
        console.log("welcome to hell!");
        if(this.count) this.minicode.create(this);
        this.count = false
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
}
