//import RexUIPlugin from 'node_modules/phaser3-rex-plugins/templates/ui/ui-plugin'
import Stage1 from "./Stage1.js";
import TestScene from "./TestScene.js";


var gameSettings = {
  playerSpeed: 200,
}

// 게임 인스턴스를 만든다. asdasdsa
var config = {
  type: Phaser.AUTO,
  parent: 'divId', //dom 사용에 필요
  dom: {
    createContainer: true
}, //dom element 사용 가능하도록.
  width: 1100,
  height: 900,
  physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: { y: 800 } //중력설정
      }
  },

  //backgroundColor: 0x9cbbd8,
  scene: [ Start, TestScene, Stage1 ] //class name
};

var game = new Phaser.Game(config); //게임을 생성



