class TestScene extends Phaser.Scene {
    
    constructor(){ 
        super("bootGame"); //identifier for the scene
        console.log("construction of TestScene");
    }


    preload() {
        this.load.image("tiles", "./assets/images/testSceneMap.png");
        this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");
        this.load.image('player', './assets/images/heroin.png');
        console.log("preloading images.....");
    }


    create () {
        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset(which is same as Png tileset) , source
        const worldLayer = map.createLayer("ground", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        const aboveLayer = map.createLayer( "sign", tileset, 0, 0); //값이 안읽혔다는데 잘뜨긴함
        //const belowLayer = map.createLayer("Above Player", tileset, 0, 0);

        /*** 충돌 설정하기 Set Collision ***/
        worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, worldLayer); //충돌 하도록 만들기
        this.player.setCollideWorldBounds(true); //make player don't escape the screen

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        this.player = this.physics.add.image(spawnPoint.x, spawnPoint.y, 'player');
        
        /*** 충돌지점 색 칠하기 Mark the collid tile ***/
        const debugGraphics = this.add.graphics().setAlpha(0,75);
        worldLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243,134,48,255),
        faceColor: new Phaser.Display.Color(40,39,37,255)
        });
        
        console.log("build testScene");
    }

    update() {
        this.movePlayerManager();
    }

    movePlayerManager() {
        /*** 좌우 움직임 + 점프 sidewalks and jump ***/
            if(this.cursorsKeys.left.isDown){
                this.player.setVelocityX(-gameSettings.playerSpeed);
            }
            else if(this.cursorsKeys.right.isDown){
                this.player.setVelocityX(gameSettings.playerSpeed);
            } else {
                this.player.setVelocityX(0);
            }
            if(this.cursorsKeys.up.isDown){
                this.player.setVelocityY(-300); //jump
            }
            console.log("move player image");
    }
}
