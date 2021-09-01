//import RexUIPlugin from 'node_modules/phaser3-rex-plugins/templates/ui/ui-plugin'
import ZeroStage from "./ZeroStage.js";
import TestScene from "./TestScene.js";
import FirstStage from "./stages/FirstStage.js";
import SecondStage from "./stages/SecondStage.js";
import ThirdStage from "./stages/ThirdStage.js";
import ThirdStage_0 from "./stages/ThirdStage_0.js";
import FourthStage from "./stages/FourthStage.js";
import FifthStage from "./stages/FifthStage.js";
import SixthStage from "./stages/SixthStage.js";
import Quiz from "./stages/Quiz.js";
import Select from "./Select.js";
import Quiz2 from "./stages/Quiz2.js";


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
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 800 } //중력설정
      }
  },

  backgroundColor: 0xffffff,
  scene: [Start, TestScene, ZeroStage, MiniMap, FirstStage, Quiz, SecondStage, ThirdStage, FourthStage, Quiz2 ,FifthStage, SixthStage, Select, ThirdStage_0] //class name
};

var game = new Phaser.Game(config); //게임을 생성



