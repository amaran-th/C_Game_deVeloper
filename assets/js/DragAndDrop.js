class DragAndDrop extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        // ...
        scene.add.existing(this);
        
        /*** 드래그앤드랍 ***/        
        // 코드 조각 불러와 배치하기
        this.code_piece = [];  // 배열로 줘서 씬에서 할당한 코드조각 만큼을 text 생성 변수로 주어줌
        var code_piece_x = 50; // 처음 코드조각 x좌표 위치 이건 나중에 inventory 창 부분에 맞게 수정 예정
        
        //console.log('코드조각 수 : ' + scene.item.length);
        for (var i = 0; i < scene.item.length; i++){
            const j = i;
            this.code_piece[j] = scene.add.text(code_piece_x, 600, scene.item[i], { font: "30px Arial Black", fill: "#f9cb9c" }).setInteractive();
            scene.input.setDraggable(this.code_piece[j]); // 드래그 가능하도록
            code_piece_x += 100; // 각 코드 조각 위치 설정
            var code_piece = this.code_piece[i]; //뒤에 index 안 먹어서 변수에 넣어 준 후 적용
            this.code_piece[j].on('pointerover', function () { 
                //console.log('조각 수' + this.code_piece.length);
                code_piece.setTint(0xf9cb9c);
            });
            // 마우스가 코드 조각 벗어났을때 원래 색으로!
            this.code_piece[j].on('pointerout', function () { 
                code_piece.clearTint();
            });
        }
        
        // 드랍 영역 선으로 임시 표시
        this.graphics = scene.add.graphics();
        var graphics = this.graphics; // 함수에서도 graphics를 쓰기 위해 this.graphics 썼으나 input 안에서 this 적용 안 돼서 따로 변수 둠.
        this.graphics.lineStyle(2, 0x7e80a7);
        this.graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        
        // 드래그 하려고 선택한 거 맨 위로 올림
        scene.input.on('dragstart', function (pointer, gameObject) { 
            scene.children.bringToTop(gameObject);
        }, scene); 
        // 드래그해서 가는 동작 실시간으로? 보여줌
        scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        // 드랍 영역 안에 들어가면 영역 색 변환
        scene.input.on('dragenter', function (pointer, gameObject, dropZone) { 
            graphics.clear();
            graphics.lineStyle(2, 0x00ffff);
            graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        });
        // 영역 벗어났을 때 원래 색으로
        scene.input.on('dragleave', function (pointer, gameObject, dropZone) { 
            graphics.clear();
            graphics.lineStyle(2, 0x7e80a7);
            graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        });
        // 영역안에서도 지정된 부분에만 고정되는 듯
        scene.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x - 50; // 이거 왜 위치 중앙이 아니라 오른쪽 밑에 치우치는 지 모르겠음.. 임의로 위치 조정해둠
            gameObject.y = dropZone.y - 15;
            if(dropZone.name == "1"){
                scene.code_zone_1 = gameObject._text;
                this.dropzone = 1; // dragend부분에서 쓰려하는데 거긴 파라미터에 dropZone없어서 여기서 지정해줌
            }
            else if (dropZone.name == "2"){
                scene.code_zone_2 = gameObject._text;
                this.dropzone = 2;
            }
            else if (dropZone.name == "3"){
                scene.code_zone_3 = gameObject._text;
                this.dropzone = 3;0
            }
            //gameObject.input.enabled = false; // 한 번 드랍되면 더 못 움직이게
        });

        // 드랍 위치가 아니면 원래 자리로 돌아가도록 함 + 색 조정
        scene.input.on('dragend', function (pointer, gameObject, dropped) {
            //console.log(this.dropzone);
            //console.log('scene.drop_state_1 > '+ scene.drop_state_1);
            //console.log('scene.drop_state_2 > '+ scene.drop_state_2);
            //console.log('scene.drop_state_3 > '+ scene.drop_state_3);
            switch (this.dropzone) {
                case 1:
                    if (!dropped || scene.drop_state_1) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_1 = 1;
                    }, 1000);
                    break;
                case 2:
                    if (!dropped || scene.drop_state_2) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_2 = 1;
                    }, 1000);
                    break;
                case 3:
                    if (!dropped || scene.drop_state_3) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_3 = 1;
                    }, 1000);
                    break;
                default:
                    console.log('dropzone 호출 안 된 부분');
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
            }
            
            graphics.clear();
            //this.graphics.lineStyle(30, 0x36385c);
            graphics.lineStyle(2, 0x7e80a7);
            graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        });
        
        //초기화 시키기
        this.reset_button = scene.add.image(980, 115, 'reset_button'); // 함수에서도 변수 쓰기 위해 this로 함
        var reset_button = this.reset_button;
        reset_button.setInteractive();
        reset_button.on('pointerover', function () {
            reset_button.setTint(0x4A6BD6);
        });
        reset_button.on('pointerout', function () {
            reset_button.clearTint();
        });
        var code_piece2 = this.code_piece; // 리셋 버튼 안에서 this.code_piece를 가져오지 못해서 따로 변수로 둠(앞에서 code_piece로 변수 둬서 충돌하길래 2로 둠)
        reset_button.on('pointerup', function () {
            console.log('reset');
            var code_piece_reset_x = 50;
            for (var i = 0; i < scene.item.length; i++){
                code_piece2[i].x = code_piece_reset_x;
                code_piece2[i].y = 490;
                code_piece_reset_x += 100;
            }
            //여기 가끔씩 0 대입 안해줌.. 왜그런지 모르겠어
            scene.drop_state_1 = 0;
            scene.drop_state_2 = 0;
            scene.drop_state_3 = 0;

            scene.code_zone_1 = "                ";
            scene.code_zone_2 = "";
            scene.code_zone_3 = "";
        });
        
        if (scene.code_piece_add_state != 2) {
            for (var i = 0; i < scene.item.length; i++){
                this.code_piece[i].destroy();
            }
            //console.log('code piece destroyed');
                
            scene.code_piece_add_state += 1;
        }        
    } 

    // 인벤창 따라 아이템(코드조각)도 나오고 들어가고 하기
    updownwithinven(scene) {
        if(scene.drop_state_1 == 0){ // 드랍존에 들어간 상태에서는 인벤창 따라갈 필요 없으므로 조건문 달아줌
            if (this.code_piece.length > 0) {
                if (scene.invenIn) { // 인벤창이 나와있을 때 코드도 나와 있도록
                    //console.log('there');
                    for (var i = 0; i < scene.item.length; i++){
                        this.code_piece[i].y = 490;
                    }
                } else { // 인벤창이 들어가있을 때 코드도 들어가 있도록
                    //console.log('here');
                    for (var i = 0; i < scene.item.length; i++){
                        this.code_piece[i].y = 600;
                    }
                }
            }
        }
    }
    onoffwithcommand(scene) {
        if (scene.codeapp_onoff_state) { // 명령창이 나와있을 때 드랍존과 리셋버튼 나와 있도록
            //console.log('there');
            this.graphics.setVisible(true);
            this.reset_button.setVisible(true);
        } else { // 명령창이 들어가있을 때 드랍존과 리셋버튼 들어가 있도록
            //console.log('here');
            this.graphics.setVisible(false);
            this.reset_button.setVisible(false);
        }
    }
}