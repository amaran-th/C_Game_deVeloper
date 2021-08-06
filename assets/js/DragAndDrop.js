class DragAndDrop extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        // ...
        scene.add.existing(this);
        
        /*** 드래그앤드랍 ***/
        //코드 조각 텍스트 (후에 문장으로 바꿔 웹컴파일러 돌릴때 용이하도록)
        var code_piece_text_1 = 'printf';
        var code_piece_text_2 = 'if';
            //... 각 스테이지 구현할 때마다 추가 예정
        
        // 코드 조각 불러와 배치하기
        var code_piece_1 = scene.add.text(10, 107, code_piece_text_1, { font: "30px Arial Black", fill: "#ffccff" });
        var code_piece_2 = scene.add.text(10, 140, code_piece_text_2, { font: "30px Arial Black", fill: "#ffccff" });

        code_piece_1.setInteractive();
        code_piece_2.setInteractive();

        // 드래그 가능하도록
        scene.input.setDraggable(code_piece_1); 
        scene.input.setDraggable(code_piece_2);

        // 마우스가 코드 조각 위에 위치했을 때 색 변하도록
        code_piece_1.on('pointerover', function () { 
            code_piece_1.setTint(0xf9cb9c);
        });
        code_piece_2.on('pointerover', function () { 
            code_piece_2.setTint(0xf9cb9c);
        });

        // 마우스가 코드 조각 벗어났을때 원래 색으로!
        code_piece_1.on('pointerout', function () { 
            code_piece_1.clearTint();
        });
        code_piece_2.on('pointerout', function () { 
            code_piece_2.clearTint();
        });

        // 드랍 영역 선으로 임시 표시
        var graphics = scene.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        
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
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        });
        // 영역안에서도 지정된 부분에만 고정되는 듯
        scene.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x - 50; // 이거 왜 위치 중앙이 아니라 오른쪽 밑에 치우치는 지 모르겠음.. 임의로 위치 조정해둠
            gameObject.y = dropZone.y - 15;

            if(dropZone.name == "1"){
                scene.code_zone_1 = gameObject._text;
            }
            else if (dropZone.name == "2"){
                scene.code_zone_2 = gameObject._text;
            }
            else if (dropZone.name == "3"){
                scene.code_zone_3 = gameObject._text;
            }

            //gameObject.input.enabled = false; // 한 번 드랍되면 더 못 움직이게
        });
        // 드랍 위치가 아니면 원래 자리로 돌아가도록 함 + 색 조정
        scene.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped)
            {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
            graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        });
        
    }
    // ...

    // preUpdate(time, delta) {}
}