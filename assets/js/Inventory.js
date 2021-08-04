//인벤 아래로 넣고 빼는 클릭이 ㅋㅋ 잘 안먹힘 이거 누가 좀 고쳐주세요
//inven.y 위치가 넣었을때랑 뺐을 때 값을 내가 입력한 값이랑 다르게 인식하나봄... 넣은 상태에서 아이템 추가했을 때 위치랑 뺀 상태에서 아이템 추가했을 때 위치가 다름

export default class inventory {
    preload() {

    }
    create(scene) {
        /** 인벤창 만들기 **/
        this.inventory = scene.add.graphics();
        this.inventory.lineStyle(2, 0x00ff00, 1);
        this.inventoryHandle = this.inventory.fillRoundedRect(0, 0, 150, 50, 5).strokeRoundedRect(0, 0, 150, 50, 5);
        this.inventoryBody = this.inventory.fillRoundedRect(0, 50, 1100, 200, 20).strokeRoundedRect(0, 50, 1100, 200, 20);
        this.inventory.fillStyle(0xff00ff, 1);
        this.invenText = scene.add.text(10,5,'Inventory',{
            fontFamily: ' Courier',
            color: '#000000'
        }).setOrigin(0,0);

        //인벤창을 모두 하나의 오브젝트로 묶기
        this.inven = scene.add.container(0,550, [this.inventoryHandle,this.inventoryBody, this.invenText]);
        this.inven.setSize(200, 100)

        this.inven.setInteractive();


        this.item = new Array(); //저장되는 아이템
        this.invenIn = true; //인벤토리 창이 내려가있는지 올라가있는지

        console.log('인덱스:', this.item.length);

        //저장된 아이템은 미리 인벤창에 넣어둔다.
        for(var i=0; i<=this.item.length; i++ ) {
            this.newItem = scene.add.text(50 + i*100, this.inven.y-250 , this.item[i], { font: "30px Arial Black", fill: "#fff" });
            this.newItem.setInteractive();
            scene.input.setDraggable(this.newItem);
            this.inven.add(this.newItem); //하나의 오브젝트로 묶어준다.
            }
        
    }
    update() {
        //console.log(this.invenIn); 

        this.inven.once('pointerdown', () => {
            if(this.invenIn) {this.inven.y = 375;} 
            else { this.inven.y = 550;} //175차이남
            console.log(this.inven.y);
            console.log('글자 위치:', this.newItem.y);
            this.invenIn = !this.invenIn;
        })


    }

    invenSave(scene, itemName) {
        //scene.invenPlus = false;  //여러번 불러와지는 거 방지
        this.item[this.item.length] = itemName; // 배열에 아이템을 추가한다.
        // 코드 조각 불러와 배치하기
        console.log('인덱스:', this.item.length);
        this.newItem = scene.add.text(50 + (this.item.length-1)*100, (this.inven.y+200)/2-200 , this.item[this.item.length-1], { 
            //이거 inven.y 상대적인 위치가 들어가 있을때랑 나와있을 때가 다름.... 들어가있을 때는 this.inven.y - 450, 나와있을 때는 this.inven.y - 175인가 해야함 이유는 모르겠음
             font: "30px Arial Black",
             fill: "#fff" 
            });
        console.log('글자 위치:', this.newItem.y);
        this.newItem.setInteractive();
        scene.input.setDraggable(this.newItem);
        this.inven.add(this.newItem);

    }

}
