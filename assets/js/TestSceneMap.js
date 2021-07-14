//내용 전부 TestScene으로 옮겼음!!!!! 안 쓰는 거//

class TestSceneMap extends Phaser.Scene {
  constructor() {
    super("buildMap");
    console.log("Construction of testSceneMap");
  }

  preload() {
    this.load.image("tiles", "./assets/images/testSceneMap.png");
    this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset(which is same as Png tileset) , source  //INVAILD TILESET IMAGE
  
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const worldLayer = map.createLayer("ground", tileset, 0, 0);
    const aboveLayer = map.createLayer( "sign", tileset, 0, 0); //값이 안읽혔다는데 잘뜨긴함..
    //const belowLayer = map.createLayer("Above Player", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true }); //안됨
    
    
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    
    const debugGraphics = this.add.graphics().setAlpha(0,75);
    worldLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243,134,48,255),
      faceColor: new Phaser.Display.Color(40,39,37,255)
    });
    
        console.log("build testSceneMap");
  }

}
