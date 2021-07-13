var gameSettings = {
  playerSpeed: 200,
}

// 게임 인스턴스를 만든다.
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: { y: 450 }
      }
  },
  //backgroundColor: 0x9cbbd8,
  scene: [ Start, TestScene ] //class name
};//

var game = new Phaser.Game(config);



