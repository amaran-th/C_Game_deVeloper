import Player from "./Player.js";

export default class Room extends Phaser.Scene {   
    constructor(){ 
        super("bootGame"); //identifier for the scene
        console.log("construction of TestScene");
    }

    preload() {
        this.load.image("tiles", "./assets/images/testSceneMap.png");
        this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");

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
        const aboveLayer = map.createLayer( "sign", tileset, 0, 0); //값이 안읽혔다는데 잘뜨긴함
        //const belowLayer = map.createLayer("Above Player", tileset, 0, 0);

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/ //이거 켜면 화면 까맣게만 나옴
        //this.cameras.main.startFollow(this.player);
        //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        //this.cameras.main.setDeadzone(config.width/4, config.height);

        /*** 충돌 설정하기 Set Collision ***/
        worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, worldLayer); //충돌 하도록 만들기
        

        /*** 충돌지점 색 칠하기 Mark the collid tile ***/
        const debugGraphics = this.add.graphics().setAlpha(0,75);
        worldLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243,134,48,255),
        faceColor: new Phaser.Display.Color(40,39,37,255)
        }); //근데 작동 안하는듯... 중요한 거 같진 않으니 일단 넘어감
        
        

        /*** 플레이어랑 표지판이랑 만나면 무언가 하기 ***/
        /*
        const obj = this.scene.map.getObjectLayer('Sensors').objects;
        
        for (const Sensors of obj) {
            this.sign.create(Sensors.x, Sensors.y, 'atlas')
                .setOrigin(0)
                .setDepth(-1);
        }
        */
        console.log("build testScene");
    }

    update() {
        this.player.update();
    }

    itsays() {
        console.log("welcome to hell!");
    }
}
