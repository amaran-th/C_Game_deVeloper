class DragAndDrop extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        // ...
        scene.add.existing(this);
        
        /*** 드래그앤드랍 ***/        
        // 코드 조각 불러와 배치하기
        var code_piece = [];  // 배열로 줘서 씬에서 할당한 코드조각 만큼을 text 생성 변수로 주어줌
        var code_piece_x = 460; // 처음 코드조각 x좌표 위치 이건 나중에 inventory 창 부분에 맞게 수정 예정

        //console.log('코드조각 수 : ' + scene.drag_piece.length);
        for (var i = 0; i < scene.drag_piece.length; i++){
            const j = i;
            code_piece[j] = scene.add.text(code_piece_x, 55, scene.drag_piece[i], { font: "30px Arial Black", fill: "#ffccff" }).setInteractive();
            scene.input.setDraggable(code_piece[j]); // 드래그 가능하도록
            code_piece_x += 100; // 각 코드 조각 위치 설정
            code_piece[j].on('pointerover', function () { 
                //여기 부분 0을 i로 하면 인 식 못함
                code_piece[j].setTint(0xf9cb9c);
            });
            // 마우스가 코드 조각 벗어났을때 원래 색으로!
            code_piece[j].on('pointerout', function () { 
                code_piece[j].clearTint();
            });
        }

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
                this.dropzone = 1; // dragend부분에서 쓰려하는데 거긴 파라미터에 dropZone없어서 여기서 지정해줌
            }
            else if (dropZone.name == "2"){
                scene.code_zone_2 = gameObject._text;
                this.dropzone = 2;
            }
            else if (dropZone.name == "3"){
                scene.code_zone_3 = gameObject._text;
                this.dropzone = 3;
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
                    console.log('DragAndDrop부분 dragend 부분 원래 이 부분 뜨면 안 되는데.. 클래스 이름 바로 받아와야 하는데 풀 받아오면서 이부분으로 온다.. 일단 작동되는 건 이상 없게 딴 코드 추가 해둠..');
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
            }
            
            graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        });
        
        //초기화 시키기
        var reset_button = scene.add.image(710, 55, 'reset_button');
        reset_button.setInteractive();
        reset_button.on('pointerover', function () {
            reset_button.setTint(0x4A6BD6);
        });
        reset_button.on('pointerout', function () {
            reset_button.clearTint();
        });
        reset_button.on('pointerup', function () {
            console.log('reset');
            var code_piece_reset_x = 460;
            for (var i = 0; i < scene.drag_piece.length; i++){
                code_piece[i].x = code_piece_reset_x;
                code_piece[i].y = 55;
                code_piece_reset_x += 100;
            }
            //여기 가끔씩 0 대입 안해줌.. 왜그런지 모르겠어
            scene.drop_state_1 = 0;
            scene.drop_state_2 = 0;
            scene.drop_state_3 = 0;

            scene.code_zone_1 = "";
            scene.code_zone_2 = "";
            scene.code_zone_3 = "";
        });
        
        if (scene.code_piece_add_state != 2) {
            for (var i = 0; i < scene.drag_piece.length; i++){
                code_piece[i].destroy();
            }
            //console.log('code piece destroyed');
                
            scene.code_piece_add_state += 1;
        }        
    } 
}