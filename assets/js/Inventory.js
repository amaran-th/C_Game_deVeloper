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
            else { this.inven.y = 550;}
            console.log('clicked');
            this.invenIn = !this.invenIn;
        })


    }

    invenSave(scene, itemName) {
        //x를 여러번 누른 걸로 인식해서 invenSave가 여러번 불러와지는 거 같음
        this.item[this.item.length] = itemName; // 배열에 아이템을 추가한다.
        // 코드 조각 불러와 배치하기
        console.log('인덱스:', this.item.length);
        this.newItem = scene.add.text(50 + (this.item.length-1)*100, this.inven.y-250 , this.item[this.item.length-1], {
             font: "30px Arial Black",
             fill: "#fff" 
            });
        this.newItem.setInteractive();
        scene.input.setDraggable(this.newItem);
        this.inven.add(this.newItem);

    }

}

/*
{
this.codeGet = new Array();
this.inveNum = 0;
this.question;
this.is_action = true;
this.actNum = 0;
        
}

invenSave(geText){
if (this.is_action === false) { return false; }
this.is_action = false;
this.codeGet[this.inveNum] = geText;
console.log('this.codeGet['+this.inveNum+'] : '+this.codeGet[this.inveNum]+' actNum : '+this.actNum);
this.inveNum = this.inveNum + 1;
}

update() {

if((Math.abs(code_piece_1.x - this.player.player.x) <= 100) && (Math.abs(code_piece_1.y - this.player.player.y) <= 50)){
    code_piece_1.destroy();
    this.invenSave(code_piece_1.text);
    this.question = this.add.text(130, 10,'!',{font: "40px Arial", color: '#ff0000'})
}
*/