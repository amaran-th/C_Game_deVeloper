//const { Game } = require("phaser");

var game;
 
// 게임 인스턴스를 만든다.
//game = new Phaser.Game(600, 450, Phaser.AUTO, '');

game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    physics: {
        default: 'arcade',
    },
    backgroundColor: 0x9cbbd8,
    Scene: [TestScene] //class name?
  });

//  게임 인스턴스를 초기화 한 후, 상태를 추가한다.
game.state.add('Menu', Menu);
game.state.add('Game', TestScene); 

game.state.start('Menu');


