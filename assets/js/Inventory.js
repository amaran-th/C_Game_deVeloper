//인벤 아래로 넣고 빼는 클릭이 ㅋㅋ 잘 안먹힘 이거 누가 좀 고쳐주세요
//inven.y 위치가 넣었을때랑 뺐을 때 값을 내가 입력한 값이랑 다르게 인식하나봄... 넣은 상태에서 아이템 추가했을 때 위치랑 뺀 상태에서 아이템 추가했을 때 위치가 다름

export default class inventory {
    create(scene) {
        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = scene.cameras.main.worldView;

        /** 인벤창 만들기 **/
        this.inventory_button = scene.add.image(5, 560,'inventory_button').setOrigin(0,0); // 인벤창 버튼
        this.inventory_button.setInteractive();

        this.inventory = scene.add.graphics();
        this.inventory.lineStyle(3, 0xFFB569, 1);
        this.inventory.fillStyle(0xFCE5CD, 1);

        this.inventoryBody = this.inventory.fillRoundedRect(5, 0, 150, 440, 10).strokeRoundedRect(5, 0, 150, 440, 10); // 인벤창
        this.inventoryBody.y = 600;
        
        this.invenText = scene.add.text(10,565,'Inventory',{
            fontSize : '25px',
            fontFamily: ' Courier',
            color: '#FFB569'
        }).setOrigin(0,0);

    }
    update(scene) {
        this.inventory_button.x = this.worldView.x + 5;
        this.invenText.x = this.worldView.x + 10;
        this.inventoryBody.x = this.worldView.x;

        if(!scene.invenIn) { 
            this.inventory_button.on('pointerdown', () => {
                this.inventoryBody.y = 120;

                if(this.exclamationIsReal){
                    this.exclamation.destroy();
                    this.exclamationIsReal = false;
                }

                // 드래그앤드랍이 호출되어 되어 아이템이 만들어진 이후 아이템도 인벤창 따라 들어갔다 나왔다 하기 위함 
                //scene.code_piece.updownwithinven(scene);

                scene.invenIn = true;
            });
        } else { 
            this.inventory_button.on('pointerdown', () => {
                this.inventoryBody.y = 600;
                
                // 드래그앤드랍이 호출되어 되어 아이템이 만들어진 이후 아이템도 인벤창 따라 들어갔다 나왔다 하기 위함 
                //scene.code_piece.updownwithinven(scene);

                scene.invenIn = false;
            });
        }

        // 드래그앤드랍이 호출되어 되어 아이템이 만들어진 이후 아이템도 인벤창 따라 들어갔다 나왔다 하기 위함 
        if(scene.draganddrop_1 != undefined) scene.draganddrop_1.onoffwithcommand(scene);
        if(scene.draganddrop_2 != undefined) scene.draganddrop_2.onoffwithcommand(scene);
        if(scene.draganddrop_3 != undefined) scene.draganddrop_3.onoffwithcommand(scene);
        if(scene.draganddrop_4 != undefined) scene.draganddrop_4.onoffwithcommand(scene);
        if(scene.draganddrop_5 != undefined) scene.draganddrop_5.onoffwithcommand(scene);
        if(scene.draganddrop_6 != undefined) scene.draganddrop_6.onoffwithcommand(scene);
        if(scene.draganddrop_7 != undefined) scene.draganddrop_7.onoffwithcommand(scene);
        if(scene.draganddrop_8 != undefined) scene.draganddrop_8.onoffwithcommand(scene);
        if(scene.draganddrop_9 != undefined) scene.draganddrop_9.onoffwithcommand(scene);
        if(scene.draganddrop_10 != undefined) scene.draganddrop_10.onoffwithcommand(scene);
        if(scene.draganddrop_11 != undefined) scene.draganddrop_11.onoffwithcommand(scene);
        if(scene.draganddrop_12 != undefined) scene.draganddrop_12.onoffwithcommand(scene);
        if(scene.draganddrop_13 != undefined) scene.draganddrop_13.onoffwithcommand(scene);
        if(scene.draganddrop_14 != undefined) scene.draganddrop_14.onoffwithcommand(scene);
        if(scene.code_piece != undefined) scene.code_piece.onoffwithcommand(scene);
    }

    invenSave(scene, itemName) { // 이부분 내용 draganddrop으로 옮겨서 함수 이름 바꾸던지 아래 내용 create나 update로 이동할까 싶음
        // 코드 조각 불러와 배치하기
        console.log('아이템 수:', scene.item.length);
        console.log('아이템 배열: ' + scene.item);
        if(!scene.invenIn) { 
            this.exclamation = scene.add.text(this.worldView.x+140, 540,'!', { font: "30px Arial Black", fill: "#ff0000" }); 
            this.exclamationIsReal = true;
        }
    }
}
