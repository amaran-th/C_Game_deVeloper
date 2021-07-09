var game;
 
// 게임 인스턴스를 만든다.
game = new Phaser.Game(600, 450, Phaser.AUTO, '');
 
//  게임 인스턴스를 초기화 한 후, 상태를 추가한다.
game.state.add('Menu', Menu);
game.state.add('Game', Game);

game.state.start('Menu');


