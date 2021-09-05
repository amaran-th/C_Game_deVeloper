import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";

var inZone3_1 = false;
var inZone3_2 = false;
var inZone3_3 = false;

export default class ThirdStage_0 extends Phaser.Scene {   
    constructor(){ 
        super("third_stage_0"); //identifier for the scene
    }

    preload() {

        this.load.tilemapTiledJSON("third_0_stage", "./assets/third_stage_0.json");

    }

    create () {

        //this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key1 = this.input.keyboard.addKey('ONE');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key3 = this.input.keyboard.addKey('THREE');
        this.key4 = this.input.keyboard.addKey('FOUR');
        this.key6 = this.input.keyboard.addKey('SIX');

        //불타는 배경
        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers('fireBackground',{ start: 0, end: 2}), 
            frameRate: 5,
            repeat: -1
        });

        this.background1 = this.add.sprite( 0, 550, 'fireBackground', 0).setOrigin(0,1);
        this.background2 = this.add.sprite( 1100, 550, 'fireBackground', 0).setOrigin(0,1);

        this.background1.play('fire',true);
        this.background2.play('fire',true);

        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "third_0_stage" });

        const tileset = map.addTilesetImage("map_stage3", "stage3_tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("background", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y
        this.deco = map.createLayer("deco", tileset, 0, 0);

        /*** npc_chef 불러오기 ***/ 
        this.npc_chef = this.add.image(640,271,'npc_chef2').setOrigin(0,0);
        this.npc_chef.setInteractive();

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");

        /*** 맵 이동 (문 이미지 불러오기) */
        this.zone3_1 = this.physics.add.staticImage(30, 420).setSize(100,160);
        this.zone3_2 = this.physics.add.staticImage(955, 420).setSize(92,161);
        this.zone3_3 = this.physics.add.staticImage(1300, 420).setSize(100,160);
        
       // this.zone3_3 = this.physics.add.staticImage(1210, 420, 'door3_1');
        
        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 430);

        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/4, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;

        this.physics.add.overlap(this.player.player, this.zone3_1, function () {
            inZone3_1 = true;
        });
        this.physics.add.overlap(this.player.player, this.zone3_2, function () {
            inZone3_2 = true;
        });
        this.physics.add.overlap(this.player.player, this.zone3_3, function () {
            inZone3_3 = true;
        });
        //플레이어 위 pressX 생성해두기(door) => stage2로 
        this.pressX_1 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //플레이어 위 pressX 생성해두기(door) => stage3로 
        this.pressX_2 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //플레이어 위 pressX 생성해두기(door) => stage4로 
        this.pressX_3 = this.add.text(this.player.player.x, this.player.player.y-125, 'Press X to Exit', {
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //quest box 이미지 로드
        this.questbox = this.add.image(0,500,'quest_box').setOrigin(0,0);
        //quest text
        this.quest_text = this.add.text(this.questbox.x+430, this.worldView.y+540, '숨을 돌릴 장소를 찾아 들어가자.', {
            font:'25px',
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        this.questbox.setVisible(false);
        this.quest_text.setVisible(false);

        this.stage_text=this.add.image(this.worldView.x+1100, 0, 'stage3_text').setOrigin(1,0);
        
        /*** 명령창 불러오기 ***/
        this.command = new Command(this, map, "third_stage_0");

        //Second_stage의 앱에 들어가는 코드 ***이거 없으면 에러남. 업데이트에 이걸 계속 해줘서
        this.app_code_text = 
        "#include <stdio.h>\n" + 
        "int main(){ \n\n" +
  
        "   {int bread = 1;} \n\n   " +
        "           " + 
        "(int i=0; i" + "           " + 
        "100; i++){\n" +
        "      {bread} = {bread} + 1 ; \n" +
        "   }\n\n" +
  
        "   printf(\"%d\", {bread} );\n}";

        // 드래그앤드랍
        //this.draganddrop_1 = new DragAndDrop(this, 300, 20, 100, 30).setRectangleDropZone(100, 30).setName("1");
        //this.draganddrop_2 = new DragAndDrop(this, 500, 20, 100, 30).setRectangleDropZone(100, 30).setName("2");
        //this.draganddrop_3 = new DragAndDrop(this, 700, 20, 100, 30).setRectangleDropZone(100, 30).setName("3");

        /** 인벤토리 만들기 **/     
        //this.inven = this.inventory.create(this);


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화  //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('third_stage_0'); 
            this.scene.run("minimap");
        },this);***/

        stagenum = 3.1;

        //처음 시작하면 .....
        //초반 대사
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        this.stage3_0_1();
        

    }

    update() {
        this.player.update();
        //this.inventory.update();
        this.command.update(this);

        //퀘스트 박스 및 텍스트 관련 코드
        if(this.questbox.visible==true){
            this.questbox.x=this.worldView.x+30;
            this.quest_text.x=this.questbox.x+430;
        }

        //stage num
        this.stage_text.x=this.worldView.x+1100;

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
            this.scene.sleep('third_stage_0'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('first_stage');
        }
        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('third_stage_0'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("second_stage");
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('third_stage_0'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }
        if(this.key4.isDown) {
            console.log('맵이동');
            this.scene.sleep('third_stage_0'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fourth_stage");
        }
        if(this.key6.isDown) {
            console.log('맵이동');
            this.scene.sleep('third_stage_0'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("sixth_stage");
        }

        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        //맵이동 (stage2) 로
        if (inZone3_1) {
            this.pressX_1.x = this.player.player.x-50;
            this.pressX_1.y = this.player.player.y-100;
            this.pressX_1.setVisible(true);
            if (this.keyX.isDown){
                this.questbox.setVisible(false);
                this.quest_text.setVisible(false);
                console.log("[맵이동] stage2 으로");
                this.command.remove_phone(this);
                this.scene.switch('second_stage'); 
            }
        }else this.pressX_1.setVisible(false);
        
        inZone3_1 = false;
        
        //맵이동 (stage3) 로
        if (inZone3_2) {
            this.pressX_2.x = this.player.player.x-50;
            this.pressX_2.y = this.player.player.y-100;
            this.pressX_2.setVisible(true);
            if (this.keyX.isDown){
                console.log("[맵이동] stage3 으로");
                this.command.remove_phone(this);
                this.scene.switch('third_stage'); 
            }
        }else this.pressX_2.setVisible(false);

        //맵이동 (stage4) 로
        if (inZone3_3) {
            this.pressX_3.x = this.player.player.x-50;
            this.pressX_3.y = this.player.player.y-100;
            this.pressX_3.setVisible(true);
            if (this.keyX.isDown){
                console.log("[맵이동] stage4 으로");
                this.command.remove_phone(this);
                this.scene.switch('fourth_stage'); 
            }
        }else this.pressX_3.setVisible(false);
        inZone3_2 = false;
        inZone3_3 = false;

    

    
        /* 바운더리 정하기 */
       this.physics.world.setBounds(0, 0, 1400, 600);
       this.player.player.body.setCollideWorldBounds()
    
    }
    stage3_0_1() {
            this.time.delayedCall( 1000, () => { 
            var seq = this.plugins.get('rexsequenceplugin').add(); 
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage3_0, this.dialog)
            .start();
            seq.on('complete', () => {
                this.player.playerPaused=false;
                this.questbox.setVisible(true);
                this.quest_text.setVisible(true);
                });
            }, [], this);
        }
}