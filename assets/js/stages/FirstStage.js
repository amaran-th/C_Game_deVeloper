import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";

export default class FirstStage extends Phaser.Scene {   
    constructor(){ 
        super("first_stage"); //identifier for the scene
    }

    preload() {
        this.load.tilemapTiledJSON("stage1", "./assets/stage1.json");
    
    }
    
    create () {


        //this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key3 = this.input.keyboard.addKey('THREE');

        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers('fireBackground',{ start: 0, end: 2}), //TestScene의 preload에 있는 player 들고 옴
            frameRate: 5,
            repeat: -1
        });

        this.background1 = this.add.sprite( 0, 550, 'fireBackground', 0).setOrigin(0,1);
        this.background2 = this.add.sprite( 1100, 550, 'fireBackground', 0).setOrigin(0,1);

        this.background1.play('fire',true);
        this.background2.play('fire',true);

        

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "stage1" });

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawnPoint");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 430);

        /** 집 이미지 add **/
        this.add.image(0,0,"house").setOrigin(0,0);
        
        const tileset = map.addTilesetImage("map", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("world", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y


    

        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;


        /*** 명령창 불러오기 ***/
        this.command = new Command(this, map, "first_stage");

        // 드래그앤드랍
        //this.draganddrop_1 = new DragAndDrop(this, 300, 20, 100, 30).setRectangleDropZone(100, 30).setName("1");
        //this.draganddrop_2 = new DragAndDrop(this, 500, 20, 100, 30).setRectangleDropZone(100, 30).setName("2");
        //this.draganddrop_3 = new DragAndDrop(this, 700, 20, 100, 30).setRectangleDropZone(100, 30).setName("3");
        
        /** 인벤토리 만들기 **/     
        //this.inven = this.inventory.create(this);


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화 ***/ //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('first_stage'); 
            this.scene.run("minimap");
        },this);

        //드래그앤드롭으로 zone에 있는 코드 받아올거임.
        this.code_zone_1 = "       ";
        this.code_zone_2 = "       ";
        this.code_zone_3 = "       ";

        //stage1의 전체 코드
        this.contenttext = "" ;

        stagenum = 1;

        
    }

    update() {
        this.contenttext = 
            "#include <stdio.h> \n int main(){ \n " + "이건 1번째 스테이지"  +this.code_zone_1 
            + "2번째 코드 : " +  this.code_zone_2 + "\n3번째 코드 : " + this.code_zone_3 ;

        this.player.update();
        //this.inventory.update();
        this.command.update(this);
                
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;

        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('first_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('second_stage');
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('first_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }


    }



}
