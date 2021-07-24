class TestSceneMap extends Phaser.Scene {
  constructor() {
    super("buildMap");
    console.log("Construction of testSceneMap");
  }
/*
  preload() {
    this.load.image("tiles", "./assets/image/testSceneMap.png");
    this.load.tilemapTiledJSON("map", "./assets/testSceneMap.json");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
  
    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("testSceneMap", "tiles"); //name of tileset , source  //INVAILD TILESET IMAGE
  
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createStaticLayer("sign", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("ground", tileset, 0, 0);
    //const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });

    console.log("build testSceneMap");
  }
*/
}
