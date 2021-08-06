//인벤 아래로 넣고 빼는 클릭이 ㅋㅋ 잘 안먹힘 이거 누가 좀 고쳐주세요

export default class inventory {
    preload() {

    }
    create(scene) {
        /** 인벤창 만들기 **/
        this.inventory = scene.add.graphics();
        this.inventory.lineStyle(5, 0xFFB569, 1);
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
        this.inven.setSize(200, 100)

        this.inven.setInteractive();


        this.item = new Array(); //저장되는 아이템
        this.invenIn = false; //인벤토리 창이 내려가있는지 올라가있는지

        console.log('인덱스:', this.item.length);

        //저장된 아이템은 미리 인벤창에 넣어둔다.
        for(var i=0; i<=this.item.length; i++ ) {
            this.newItem = scene.add.text(50 + i*100, this.inven.y-250 , this.item[i], { font: "30px Arial Black", fill: "#fff" });
            this.newItem.setInteractive();
            scene.input.setDraggable(this.newItem);
            this.inven.add(this.newItem); //하나의 오브젝트로 묶어준다.
        }
        
        this.exclamationIsReal = false;
    }
    update() {
        //console.log(this.invenIn);

        this.inven.once('pointerdown', () => {
            if(this.invenIn) { 
                this.inven.y = 375;
                if(this.exclamationIsReal){
                    this.exclamation.destroy();
                    this.exclamationIsReal = false;
                }
            } 
            else { 
                this.inven.y = 550;
            }
            //console.log('clicked');
            this.invenIn = !this.invenIn;
        })


    }

    invenSave(scene, itemName) {
        scene.invenPlus = false;  //여러번 불러와지는 거 방지
        this.item[this.item.length] = itemName; // 배열에 아이템을 추가한다.
        // 코드 조각 불러와 배치하기
        console.log('인덱스:', this.item.length);
        this.newItem = scene.add.text(50 + (this.item.length-1)*100, 120, this.item[this.item.length-1], {
             font: "30px Arial Black",
             fill: "#f9cb9c" 
            });
        if(!this.invenIn) { 
            this.exclamation = scene.add.text(140, 540,'!', { font: "30px Arial Black", fill: "#ff0000" }); 
            this.exclamationIsReal = true;
        }
        this.newItem.setInteractive();
        scene.input.setDraggable(this.newItem);
        this.inven.add(this.newItem);

    }
}
