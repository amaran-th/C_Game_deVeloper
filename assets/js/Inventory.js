//인벤 아래로 넣고 빼는 클릭이 ㅋㅋ 잘 안먹힘 이거 누가 좀 고쳐주세요
//inven.y 위치가 넣었을때랑 뺐을 때 값을 내가 입력한 값이랑 다르게 인식하나봄... 넣은 상태에서 아이템 추가했을 때 위치랑 뺀 상태에서 아이템 추가했을 때 위치가 다름

export default class inventory {
    preload() {

    }
    create(scene) {
        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = scene.cameras.main.worldView;

        /** 인벤창 만들기 **/
        this.inventory = scene.add.graphics();
        this.inventory.lineStyle(3, 0xFFB569, 1);
        this.inventoryHandle = this.inventory.fillRoundedRect(0, 0, 150, 50, 5).strokeRoundedRect(0, 0, 150, 50, 5);
        this.inventoryBody = this.inventory.fillRoundedRect(0, 50, 1094, 173, 20).strokeRoundedRect(0, 50, 1094, 173, 20);
        this.inventory.fillStyle(0xFCE5CD, 1);
        this.invenText = scene.add.text(5,10,'Inventory',{
            fontSize : '25px',
            fontFamily: ' Courier',
            color: '#FFB569'
        }).setOrigin(0,0);

        //인벤창을 모두 하나의 오브젝트로 묶기
        this.inven = scene.add.container(3,550, [this.inventoryHandle,this.inventoryBody, this.invenText]);
        this.inven.setSize(200, 100);

        this.inven.setInteractive();

        scene.invenIn = false; //인벤토리 창이 내려가있는지 올라가있는지

        //console.log('인덱스:', scene.item.length);

        //저장된 아이템은 미리 인벤창에 넣어둔다.
        /*for(var i=0; i<=scene.item.length; i++ ) {
            this.newItem = scene.add.text(50 + i*100, this.inven.y-250 , scene.item[i], { font: "25px Arial Black", fill: "#fff" });
            this.newItem.setInteractive();
            scene.input.setDraggable(this.newItem);
            this.inven.add(this.newItem); //하나의 오브젝트로 묶어준다.
        }*/
    }
    update(scene) {
        //console.log(scene.invenIn); 
        this.inven.x = this.worldView.x + 5;
        this.inven.on('pointerdown', () => {
            scene.invenIn = !scene.invenIn;
            if(scene.invenIn) { 
                this.inven.y = 375;
                if(this.exclamationIsReal){
                    this.exclamation.destroy();
                    this.exclamationIsReal = false;
                }

                // 드래그앤드랍이 호출되어 되어 아이템이 만들어진 이후 아이템도 인벤창 따라 들어갔다 나왔다 하기 위함 
                if(this.draganddrop_1 != undefined) this.draganddrop_1.updownwithinven(scene);
                if(this.draganddrop_2 != undefined) this.draganddrop_2.updownwithinven(scene);
                if(this.draganddrop_3 != undefined) this.draganddrop_3.updownwithinven(scene);
            } 
            else { 
                this.inven.y = 550;
                
                // 드래그앤드랍이 호출되어 되어 아이템이 만들어진 이후 아이템도 인벤창 따라 들어갔다 나왔다 하기 위함 
                if(this.draganddrop_1 != undefined) this.draganddrop_1.updownwithinven(scene);
                if(this.draganddrop_2 != undefined) this.draganddrop_2.updownwithinven(scene);
                if(this.draganddrop_3 != undefined) this.draganddrop_3.updownwithinven(scene);
            }
            //console.log('clicked');
        })
        if(this.draganddrop_1 != undefined) this.draganddrop_1.onoffwithcommand(scene);
        if(this.draganddrop_2 != undefined) this.draganddrop_2.onoffwithcommand(scene);
        if(this.draganddrop_3 != undefined) this.draganddrop_3.onoffwithcommand(scene);
    }

    invenSave(scene, itemName) {
        //scene.invenPlus = false;  //여러번 불러와지는 거 방지
        scene.item[scene.item.length] = itemName; // 배열에 아이템을 추가한다.
        /*for(var i=0; i<=scene.item.length; i++ ) {
            const j = i;
            this.newItem = scene.add.text(50 + j*100, 120 , scene.item[i], { font: "30px Arial Black", fill: "#FFB569" });
            this.newItem.setInteractive();
            scene.input.setDraggable(this.newItem);
            this.inven.add(this.newItem);
        }*/

        // 코드 조각 불러와 배치하기
        console.log('아이템 수:', scene.item.length);
        console.log('아이템 배열: ' + scene.item);
        this.draganddrop_1 = new DragAndDrop(scene, 815, 198, 100, 25).setRectangleDropZone(100, 25).setName("1");
        this.draganddrop_2 = new DragAndDrop(scene, 570, 20, 100, 25).setRectangleDropZone(100, 25).setName("2");
        this.draganddrop_3 = new DragAndDrop(scene, 670, 20, 100, 25).setRectangleDropZone(100, 25).setName("3");
        if(!scene.invenIn) { 
            this.exclamation = scene.add.text(this.worldView.x+140, 540,'!', { font: "30px Arial Black", fill: "#ff0000" }); 
            this.exclamationIsReal = true;
        }
    }
}
