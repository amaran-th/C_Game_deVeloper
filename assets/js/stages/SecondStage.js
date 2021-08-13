import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";


export default class SecondStage extends Phaser.Scene {   
    constructor(){ 
        super("second_stage"); //identifier for the scene
    }

    preload() {

        //this.load.image("stage_tiles", "./assets/images/test.png");
        this.load.tilemapTiledJSON("second_stage", "./assets/second_stage.json");
    
    }
    
    create () {

        //this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key3 = this.input.keyboard.addKey('THREE');

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "second_stage" });
        
        const tileset = map.addTilesetImage("test", "stage2_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y

        /*** npc_old 불러오기 ***/ 
        this.npc_old = this.add.image(550,280,'npc7').setOrigin(0,0);
        this.npc_old.setInteractive();

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        
        
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
        this.command = new Command(this, map, "second_stage");

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
            this.scene.sleep('second_stage'); 
            this.scene.run("minimap");
        },this);

        //stage3의 전체 코드
        this.contenttext = "" ;

        //코드 실행후 불러올 output값
        this.out = "";

        stagenum = 2;

        //초반 대사
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        this.stage2_1();
        
    }

    update() {
        this.contenttext = 
            "#include <stdio.h> \n int main(){ \n\n if문 \n}" 
        
        //정답일시, 나중에 this.out == "25" 이케 바꿔야함.
        if (this.out == "#include <stdio.h> \n int main(){ \nint bread = 0;\n for (int i=0; i<25; i++){\n   bread=bread+1;\n}\nprintf(\"%d\",bread);\n}"){
            console.log("===stage3 클리어!===");
            this.bread.setVisible(true);
            this.full_bread_1.setVisible(true);
            this.full_bread_2.setVisible(true);
            this.out = "";
            this.exclamMark.setVisible(true);
            this.exclamMark.play('exclam');

            this.cameras.main.fadeIn(1000,0,0,0);
            
            this.stage3_3();
            
        }

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

        if(this.key1.isDown) {
            console.log('맵이동');
            this.scene.sleep('second_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('second_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }

    }

    stage2_1() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage2_1, this.dialog)
        .start();
        seq.on('complete', () => {
            this.player.playerPaused = false; //대사가 다 나오면 플레이어가 다시 움직이도록
        });     
    }

}
