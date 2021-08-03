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
        this.itemNum = 0;
        console.log('인벤토리 생성');
        console.log(this.inven.y);

        this.invenIn = true;
    }
    update() {
        console.log(this.invenIn);

        this.inven.once('pointerdown', () => {
            if(this.invenIn) {this.inven.y = 375;} 
            else { this.inven.y = 550;}
            console.log('clicked');
            this.invenIn = !this.invenIn;
        })


        


    }

    invenSave() {

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