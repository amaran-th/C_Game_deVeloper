export default class DragAndDrop extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        // ...
        scene.add.existing(this);

        /*** 드래그앤드랍 ***/        
        // 코드 조각 불러와 배치하기
        this.code_piece = [];  // 배열로 줘서 씬에서 할당한 코드조각 만큼을 text 생성 변수로 주어줌
        var code_piece_y = 130; // 처음 코드조각 x좌표 위치 이건 나중에 inventory 창 부분에 맞게 수정 예정
        
        //console.log('코드조각 수 : ' + scene.item.length);
        for (var i = 0; i < scene.item.length; i++){
            this.code_piece[i] = scene.add.text(15, code_piece_y, scene.item[i], { font: "25px Arial Black", fill: "#f9cb9c" }).setInteractive();
            scene.input.setDraggable(this.code_piece[i]); // 드래그 가능하도록
            code_piece_y += 30; // 각 코드 조각 위치 설정
            var code_piece = this.code_piece[i]; //뒤에 index 안 먹어서 변수에 넣어 준 후 적용
        }
        
        // 드랍 영역 선으로 임시 표시
        this.graphics = scene.add.graphics();
        var graphics = this.graphics; // 함수에서도 graphics를 쓰기 위해 this.graphics 썼으나 input 안에서 this 적용 안 돼서 따로 변수 둠.
        this.graphics.lineStyle(2, 0x7e80a7);
        this.graphics.strokeRect(x - width / 2, y - height / 2, width, height);


        // 드래그 하려고 선택한 거 맨 위로 올림
        scene.input.on('dragstart', function (pointer, gameObject) { 
            scene.children.bringToTop(gameObject);
            gameObject.setTint(0xf9cb9c); // 드래그 시작하면 코드 조각 색 바꾸기
        }, scene); 
        // 드래그해서 가는 동작 실시간으로? 보여줌
        scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.setTint(0xf9cb9c); // 드래그 하는동안 코드 조각 색 바뀐채로 이동
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
            gameObject.x = dropZone.x - dropZone.width / 2 + 5; // 드랍존 틀에 맞춰서 넣어줌
            gameObject.y = dropZone.y - dropZone.height / 2 - 3; // 위치 왜 이런지 궁금한 사람 은지한테 문의 바람 그림 그려줌
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
            else if (dropZone.name == "4"){
                scene.code_zone_4 = gameObject._text;
                this.dropzone = 4;
            } 
            else if (dropZone.name == "5"){
                scene.code_zone_5 = gameObject._text;
                this.dropzone = 5;
            } 
            else if (dropZone.name == "6"){
                scene.code_zone_6 = gameObject._text;
                this.dropzone = 6;
            }  
            else if (dropZone.name == "7"){
                scene.code_zone_7 = gameObject._text;
                this.dropzone = 7;
            }  
            else if (dropZone.name == "8"){
                scene.code_zone_8 = gameObject._text;
                this.dropzone = 8;
            }  
            else if (dropZone.name == "9"){
                scene.code_zone_9 = gameObject._text;
                this.dropzone = 9;
            }  
            else if (dropZone.name == "10"){
                scene.code_zone_10 = gameObject._text;
                this.dropzone = 10;
            }  
            else if (dropZone.name == "11"){
                scene.code_zone_11 = gameObject._text;
                this.dropzone = 11;
            }  
            else if (dropZone.name == "12"){
                scene.code_zone_12 = gameObject._text;
                this.dropzone = 12;
            }  
            else if (dropZone.name == "13"){
                scene.code_zone_13 = gameObject._text;
                this.dropzone = 13;
            }  
            else if (dropZone.name == "14"){
                scene.code_zone_14 = gameObject._text;
                this.dropzone = 14;
            } 

            //gameObject.input.enabled = false; // 한 번 드랍되면 더 못 움직이게
        });

        // 드랍 위치가 아니면 원래 자리로 돌아가도록 함 + 색 조정
        scene.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.clearTint(); // 드래그 끝나면 코드 조각 색 원래대로
            //console.log('dropname' + this.dropzone);
            //console.log('scene.drop_state_1 > '+ scene.drop_state_1);
            //console.log('scene.drop_state_2 > '+ scene.drop_state_2);
            //console.log('scene.drop_state_3 > '+ scene.drop_state_3);
            switch (this.dropzone) { // (this.name으로 수정해도 될듯!)
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
                case 4:
                    if (!dropped || scene.drop_state_4) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_4 = 1;
                    }, 1000);
                    break;
                case 5:
                    if (!dropped || scene.drop_state_5) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_5 = 1;
                    }, 1000);
                    break;
                case 6:
                    if (!dropped || scene.drop_state_6) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_6 = 1;
                    }, 1000);
                    break;
                case 7:
                    if (!dropped || scene.drop_state_7) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_7 = 1;
                    }, 1000);
                    break;
                case 8:
                    if (!dropped || scene.drop_state_8) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_8 = 1;
                    }, 1000);
                    break;
                case 9:
                    if (!dropped || scene.drop_state_9) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_9 = 1;
                    }, 1000);
                    break;
                case 10:
                    if (!dropped || scene.drop_state_10) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_10 = 1;
                    }, 1000);
                    break;
                case 11:
                    if (!dropped || scene.drop_state_11) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_11 = 1;
                    }, 1000);
                    break;
                case 12:
                    if (!dropped || scene.drop_state_12) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_12 = 1;
                    }, 1000);
                    break;
                case 13:
                    if (!dropped || scene.drop_state_13) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_13 = 1;
                    }, 1000);
                    break;
                case 14:
                    if (!dropped || scene.drop_state_14) {
                        gameObject.x = gameObject.input.dragStartX;
                        gameObject.y = gameObject.input.dragStartY;
                    }
                    setTimeout(function() {
                        scene.drop_state_14 = 1;
                    }, 1000);
                    break;
                default:
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
            }
            
            graphics.clear();
            graphics.lineStyle(2, 0x7e80a7);
            graphics.strokeRect(x - width / 2, y - height / 2, width, height);
        });
        
        //초기화 시키기
        this.reset_button = scene.add.image(800, 450, 'reset_button'); // 함수에서도 변수 쓰기 위해 this로 함
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
            var code_piece_reset_y = 130;
            for (var i = 0; i < scene.item.length; i++){
                code_piece2[i].x = scene.worldView.x + 15;
                code_piece2[i].y = code_piece_reset_y;
                code_piece_reset_y += 30;
            }
            //여기 가끔씩 0 대입 안해줌.. 왜그런지 모르겠어
            scene.drop_state_1 = 0;
            scene.drop_state_2 = 0;
            scene.drop_state_3 = 0;
            scene.drop_state_4 = 0;
            scene.drop_state_5 = 0;
            scene.drop_state_6 = 0;
            scene.drop_state_7 = 0;
            scene.drop_state_8 = 0;
            scene.drop_state_9 = 0;
            scene.drop_state_10 = 0;
            scene.drop_state_11 = 0;
            scene.drop_state_12 = 0;
            scene.drop_state_13 = 0;
            scene.drop_state_14 = 0;

            scene.code_zone_1 = undefined; // 리셋했을 때 비워주기
            scene.code_zone_2 = undefined;
            scene.code_zone_3 = undefined;
            scene.code_zone_4 = undefined;
            scene.code_zone_5 = undefined;
            scene.code_zone_6 = undefined;
            scene.code_zone_7 = undefined;
            scene.code_zone_8 = undefined;
            scene.code_zone_9 = undefined;
            scene.code_zone_10 = undefined;
            scene.code_zone_11 = undefined;
            scene.code_zone_12 = undefined;
            scene.code_zone_13 = undefined;
            scene.code_zone_14 = undefined;

            scene.reset_state = true;

            //zerostage this.concern_text(마이크테스트) 리셋버튼 적용시키기 위해 넣음
            if (scene.concern_text != undefined) {
                scene.concern_text.setColor('#000000');
                scene.concern_text.setFontSize(14);
                scene.concern_text.x = scene.bubble.x+20;
                scene.concern_text.y = scene.bubble.y-87;
            }
        });
        
        if (scene.code_piece_add_state != scene.dropzon_su - 1) {
            for (var i = 0; i < scene.item.length; i++){
                this.code_piece[i].destroy();
            }
            //console.log('code piece destroyed');
                
            scene.code_piece_add_state += 1;
        }   
    } 

    update(scene) {
        
        this.reset_button.x = scene.worldView.x + 800; // 리턴 버튼 플레이어 따라 이동
        
        if (scene.worldView.x != this.preworldview_x) { // 코드 조각 플레이어 따라 이동
            for (var i = 0; i < scene.item.length; i++) {
                switch (this.code_piece[i]._text) { // 드랍존에 들어가지 않은 코드 조각은 그냥 플레이어 따라가고
                    case scene.code_zone_1:         // 드랍존에 들어간 코드조각은 어는 드랍존인 지 구분하여 해당 드랍존 위치에 맞게 플레이어를 따라가도록 함
                        this.code_piece[i].x = scene.draganddrop_1.x - (scene.draganddrop_1.width / 2) + 5;
                        break;
                    case scene.code_zone_2:
                        this.code_piece[i].x = scene.draganddrop_2.x - (scene.draganddrop_2.width / 2) + 5;
                        break;
                    case scene.code_zone_3:
                        this.code_piece[i].x = scene.draganddrop_3.x - (scene.draganddrop_3.width / 2) + 5;
                        break;
                    case scene.code_zone_4:
                        this.code_piece[i].x = scene.draganddrop_4.x - (scene.draganddrop_4.width / 2) + 5;
                        break;
                    case scene.code_zone_5:
                        this.code_piece[i].x = scene.draganddrop_5.x - (scene.draganddrop_5.width / 2) + 5;
                        break;
                    case scene.code_zone_6:
                        this.code_piece[i].x = scene.draganddrop_6.x - (scene.draganddrop_6.width / 2) + 5;
                        break;
                    case scene.code_zone_7:
                        this.code_piece[i].x = scene.draganddrop_7.x - (scene.draganddrop_7.width / 2) + 5;
                        break;
                    case scene.code_zone_8:
                        this.code_piece[i].x = scene.draganddrop_8.x - (scene.draganddrop_8.width / 2) + 5;
                        break;
                    case scene.code_zone_9:
                        this.code_piece[i].x = scene.draganddrop_9.x - (scene.draganddrop_9.width / 2) + 5;
                        break;
                    case scene.code_zone_10:
                        this.code_piece[i].x = scene.draganddrop_10.x - (scene.draganddrop_10.width / 2) + 5;
                        break;
                    case scene.code_zone_11:
                        this.code_piece[i].x = scene.draganddrop_11.x - (scene.draganddrop_11.width / 2) + 5;
                        break;
                    case scene.code_zone_12:
                        this.code_piece[i].x = scene.draganddrop_12.x - (scene.draganddrop_12.width / 2) + 5;
                        break;
                    case scene.code_zone_13:
                        this.code_piece[i].x = scene.draganddrop_13.x - (scene.draganddrop_13.width / 2) + 5;
                        break;
                    case scene.code_zone_14:
                        this.code_piece[i].x = scene.draganddrop_14.x - (scene.draganddrop_14.width / 2) + 5;
                        break;
                    default:
                        this.code_piece[i].x = scene.worldView.x + 15;
                }
            }
            this.preworldview_x = scene.worldView.x;
        }

        if(scene.draganddrop_1!=undefined) scene.draganddrop_1.x = scene.worldView.x + scene.dropzone1_x; // 드랍존 플레이어 따라 이동
        if(scene.draganddrop_2!=undefined) scene.draganddrop_2.x = scene.worldView.x + scene.dropzone2_x;
        if(scene.draganddrop_3!=undefined) scene.draganddrop_3.x = scene.worldView.x + scene.dropzone3_x;
        if(scene.draganddrop_4!=undefined) scene.draganddrop_4.x = scene.worldView.x + scene.dropzone4_x;
        if(scene.draganddrop_5!=undefined) scene.draganddrop_5.x = scene.worldView.x + scene.dropzone5_x;
        if(scene.draganddrop_6!=undefined) scene.draganddrop_6.x = scene.worldView.x + scene.dropzone6_x;
        if(scene.draganddrop_7!=undefined) scene.draganddrop_7.x = scene.worldView.x + scene.dropzone7_x;
        if(scene.draganddrop_8!=undefined) scene.draganddrop_8.x = scene.worldView.x + scene.dropzone8_x;
        if(scene.draganddrop_9!=undefined) scene.draganddrop_9.x = scene.worldView.x + scene.dropzone9_x;
        if(scene.draganddrop_10!=undefined) scene.draganddrop_10.x = scene.worldView.x + scene.dropzone10_x;
        if(scene.draganddrop_11!=undefined) scene.draganddrop_11.x = scene.worldView.x + scene.dropzone11_x;
        if(scene.draganddrop_12!=undefined) scene.draganddrop_12.x = scene.worldView.x + scene.dropzone12_x;
        if(scene.draganddrop_13!=undefined) scene.draganddrop_13.x = scene.worldView.x + scene.dropzone13_x;
        if(scene.draganddrop_14!=undefined) scene.draganddrop_14.x = scene.worldView.x + scene.dropzone14_x;
        this.graphics.x = scene.worldView.x; // 드랍존 틀 플레이어 따라 이동
        
    }

    invenPlus(scene) {
        //console.log('코드조각 수 : ' + scene.item.length);
        var code_piece_y_invenPlus = 150
        for (var i = 0; i < scene.item.length; i++){
            //console.log(scene.item[i],"invenPlus,", code_piece_y_invenPlus );
            this.code_piece[i] = scene.add.text(scene.worldView.x+15, code_piece_y_invenPlus, scene.item[i], { font: "25px Arial Black", fill: "#f9cb9c" }).setInteractive();
            scene.input.setDraggable(this.code_piece[i]); // 드래그 가능하도록
            code_piece_y_invenPlus += 30; // 각 코드 조각 위치 설정
        }
    }


    // 인벤창 따라 아이템(코드조각)도 나오고 들어가고 하기
    updownwithinven(scene) {
        if (scene.drop_state_1 == 0) { // 드랍존에 들어간 상태에서는 인벤창 따라갈 필요 없으므로 조건문 달아줌
            if (this.code_piece.length > 0) {
                if (scene.invenIn) { // 인벤창이 나와있을 때 코드 보이도록
                    //console.log('there');
                    for (var i = 0; i < scene.item.length; i++) {
                        this.code_piece[i].setVisible(true);
                    }
                } else { // 인벤창이 들어가있을 때 코드 안 보이도록
                    //console.log('here');
                    for (var i = 0; i < scene.item.length; i++) {
                        this.code_piece[i].setVisible(false);
                    }
                }
            }
        }
    }
    onoffwithcommand(scene) {
        //console.log("폰 열림상태 > "+scene.codeapp_onoff_state);
        if (scene.codeapp_onoff_state) { // 명령창이 나와있을 때 드랍존과 리셋버튼 나와 있도록
            //console.log('there');
            this.graphics.setVisible(true);
            this.reset_button.setVisible(true);
            if (!scene.invenIn) { // 인벤 닫혀있을 때
                for (var i = 0; i < scene.item.length; i++){
                    switch (this.code_piece[i]._text) { // 드랍존에 들어간 코드조각은 어느 드랍존인 지 구분하여 해당 코드조각 코드앱따라 보이고 안 보이고 하기
                        case scene.code_zone_1:         
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_2:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_3:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_4:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_5:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_6:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_7:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_8:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_9:
                        this.code_piece[i].setVisible(true);
                        break;
                        case scene.code_zone_10:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_11:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_12:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_13:
                            this.code_piece[i].setVisible(true);
                            break;
                        case scene.code_zone_14:
                            this.code_piece[i].setVisible(true);
                            break;
                        default:
                            this.code_piece[i].setVisible(false);
                    }
                }
            } else { // 인벤 열려있을 때
                for (var i = 0; i < scene.item.length; i++){
                    this.code_piece[i].setVisible(true);
                }
            }
        } else { // 명령창이 들어가있을 때 드랍존과 리셋버튼 들어가 있도록
            //console.log('here');
            this.graphics.setVisible(false);
            this.reset_button.setVisible(false);
            if (!scene.invenIn) { // 인벤 닫혀있을 때
                for (var i = 0; i < scene.item.length; i++){
                    this.code_piece[i].setVisible(false);
                }
            } else { // 인벤 열려있을 때
                for (var i = 0; i < scene.item.length; i++){
                    switch (this.code_piece[i]._text) { // 드랍존에 들어간 코드조각은 어느 드랍존인 지 구분하여 해당 코드조각 코드앱따라 보이고 안 보이고 하기
                        case scene.code_zone_1:         
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_2:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_3:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_4:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_5:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_6:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_7:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_8:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_9:
                            this.code_piece[i].setVisible(false);
                        break;
                        case scene.code_zone_10:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_11:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_12:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_13:
                            this.code_piece[i].setVisible(false);
                            break;
                        case scene.code_zone_14:
                            this.code_piece[i].setVisible(false);
                            break;
                        default:
                            this.code_piece[i].setVisible(true);
                    }
                }
            }
        }
    }


    reset_before_mission(scene) {   
        for (var i = 0; i < scene.item.length; i++){ // 코드조각 없애줌
            this.code_piece[i].destroy();
        }

        this.graphics.destroy(); // 드랍존틀 없애줌
        this.reset_button.destroy(); // 리셋버튼 없애줌

        //여기 가끔씩 0 대입 안해줌.. 왜그런지 모르겠어
        scene.drop_state_1 = 0;
        scene.drop_state_2 = 0;
        scene.drop_state_3 = 0;
        scene.drop_state_4 = 0;
        scene.drop_state_5 = 0;
        scene.drop_state_6 = 0;
        scene.drop_state_7 = 0;
        scene.drop_state_8 = 0;
        scene.drop_state_9 = 0;
        scene.drop_state_10 = 0;
        scene.drop_state_11 = 0;
        scene.drop_state_12 = 0;
        scene.drop_state_13 = 0;
        scene.drop_state_14 = 0;

        scene.code_zone_1 = undefined; // 리셋했을 때 비워주기
        scene.code_zone_2 = undefined;
        scene.code_zone_3 = undefined;
        scene.code_zone_4 = undefined;
        scene.code_zone_5 = undefined;
        scene.code_zone_6 = undefined;
        scene.code_zone_7 = undefined;
        scene.code_zone_8 = undefined;
        scene.code_zone_9 = undefined;
        scene.code_zone_10 = undefined;
        scene.code_zone_11 = undefined;
        scene.code_zone_12 = undefined;
        scene.code_zone_13 = undefined;
        scene.code_zone_14 = undefined;
    }
}