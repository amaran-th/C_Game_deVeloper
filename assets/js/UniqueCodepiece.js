class UniqueCodePiece extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.unique_codepiece_x = x;
        scene.add.existing(this);

        //console.log("uniquecodepiece.js");
        this.unique_codepiece_textObject_arr = []; // 텍스트 오브젝트를 배열로 생성해줌
        this.unique_codepiece_textObject_y = y; // 텍스트 오브젝트가 생성되는 y좌표를 지정해두고, 다음 코드조각의 위치에 반영 함
        this.unique_codepiece_reset_y = y; // reset_unique_codepiece_position 함수에 사용하기 위한 y좌표 대입

        for (var i = 0; i < scene.unique_codepiece_string_arr.length; i++){
            this.unique_codepiece_textObject_arr[i] = scene.add.text(this.unique_codepiece_x, this.unique_codepiece_textObject_y, scene.unique_codepiece_string_arr[i], { font: "25px Arial Black", fill: "#f9cb9c" }).setInteractive();
            console.log(this.unique_codepiece_textObject_arr[i]._text, this.unique_codepiece_textObject_arr[i].x, this.unique_codepiece_textObject_arr[i].y);
            scene.input.setDraggable(this.unique_codepiece_textObject_arr[i]); // 드래그 가능하도록
            this.unique_codepiece_textObject_y += 30; // 각 코드 조각 위치 설정
        }
    }
    update(scene) {
        if (scene.worldView.x != this.preworldview_x) { // 코드 조각 플레이어 따라 이동
            for (var i = 0; i < this.unique_codepiece_textObject_arr.length; i++) {
                //console.log(this.unique_codepiece_textObject_arr[i].x);
                switch (this.unique_codepiece_textObject_arr[i]._text) { // 드랍존에 들어가지 않은 코드 조각은 그냥 플레이어 따라가고
                    case scene.code_zone_1:         // 드랍존에 들어간 코드조각은 어는 드랍존인 지 구분하여 해당 드랍존 위치에 맞게 플레이어를 따라가도록 함
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_1.x - (scene.draganddrop_1.width / 2) + 5;
                        break;
                    case scene.code_zone_2:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_2.x - (scene.draganddrop_2.width / 2) + 5;
                        break;
                    case scene.code_zone_3:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_3.x - (scene.draganddrop_3.width / 2) + 5;
                        break;
                    case scene.code_zone_4:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_4.x - (scene.draganddrop_4.width / 2) + 5;
                        break;
                    case scene.code_zone_5:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_5.x - (scene.draganddrop_5.width / 2) + 5;
                        break;
                    case scene.code_zone_6:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_6.x - (scene.draganddrop_6.width / 2) + 5;
                        break;
                    case scene.code_zone_7:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_7.x - (scene.draganddrop_7.width / 2) + 5;
                        break;
                    case scene.code_zone_8:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_8.x - (scene.draganddrop_8.width / 2) + 5;
                        break;
                    case scene.code_zone_9:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_9.x - (scene.draganddrop_9.width / 2) + 5;
                        break;
                    case scene.code_zone_10:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_10.x - (scene.draganddrop_10.width / 2) + 5;
                        break;
                    case scene.code_zone_11:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_11.x - (scene.draganddrop_11.width / 2) + 5;
                        break;
                    case scene.code_zone_12:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_12.x - (scene.draganddrop_12.width / 2) + 5;
                        break;
                    case scene.code_zone_13:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_13.x - (scene.draganddrop_13.width / 2) + 5;
                        break;
                    case scene.code_zone_14:
                        this.unique_codepiece_textObject_arr[i].x = scene.draganddrop_14.x - (scene.draganddrop_14.width / 2) + 5;
                        break;
                    default:
                        this.unique_codepiece_textObject_arr[i].x = scene.worldView.x + this.unique_codepiece_x;
                }
            }
            this.preworldview_x = scene.worldView.x;
        }
    }

    // 인벤창 따라 아이템(코드조각)도 나오고 들어가고 하기
    updownwithinven(scene, followthing) { // followthing : 인벤창이냐 라이브러리 인벤이냐 나누기 위해 넣은 인자
        if (scene.drop_state_1 == 0) { // 드랍존에 들어간 상태에서는 인벤창 따라갈 필요 없으므로 조건문 달아줌
            if (this.unique_codepiece_textObject_arr.length > 0) {
                if (followthing) { // 인벤창이 나와있을 때 코드 보이도록
                    //console.log('there');
                    for (var i = 0; i < this.unique_codepiece_textObject_arr.length; i++) {
                        this.unique_codepiece_textObject_arr[i].setVisible(true);
                    }
                } else { // 인벤창이 들어가있을 때 코드 안 보이도록
                    //console.log('here');
                    for (var i = 0; i < this.unique_codepiece_textObject_arr.length; i++) {
                        this.unique_codepiece_textObject_arr[i].setVisible(false);
                    }
                }
            }
        }
    }
    onoffwithcommand(scene) {
        //console.log("폰 열림상태 > "+scene.codeapp_onoff_state);
        if (scene.codeapp_onoff_state) { // 명령창이 나와있을 때 드랍존과 리셋버튼 나와 있도록
            //console.log('there');
            if (!scene.invenIn) { // 인벤 닫혀있을 때
                for (var i = 0; i < this.unique_codepiece_textObject_arr.length; i++){
                    switch (this.unique_codepiece_textObject_arr[i]._text) { // 드랍존에 들어간 코드조각은 어느 드랍존인 지 구분하여 해당 코드조각 코드앱따라 보이고 안 보이고 하기
                        case scene.code_zone_1:         
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_2:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_3:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_4:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_5:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_6:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_7:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_8:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_9:
                        this.unique_codepiece_textObject_arr[i].setVisible(true);
                        break;
                        case scene.code_zone_10:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_11:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_12:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_13:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        case scene.code_zone_14:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                            break;
                        default:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                    }
                }
            } else { // 인벤 열려있을 때
                for (var i = 0; i < this.unique_codepiece_textObject_arr.length; i++){
                    this.unique_codepiece_textObject_arr[i].setVisible(true);
                }
            }
        } else { // 명령창이 들어가있을 때 드랍존과 리셋버튼 들어가 있도록
            //console.log('here');
            if (!scene.invenIn) { // 인벤 닫혀있을 때
                for (var i = 0; i < this.unique_codepiece_textObject_arr.length; i++){
                    this.unique_codepiece_textObject_arr[i].setVisible(false);
                }
            } else { // 인벤 열려있을 때
                for (var i = 0; i < this.unique_codepiece_textObject_arr.length; i++){
                    switch (this.unique_codepiece_textObject_arr[i]._text) { // 드랍존에 들어간 코드조각은 어느 드랍존인 지 구분하여 해당 코드조각 코드앱따라 보이고 안 보이고 하기
                        case scene.code_zone_1:         
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_2:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_3:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_4:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_5:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_6:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_7:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_8:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_9:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                        break;
                        case scene.code_zone_10:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_11:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_12:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_13:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        case scene.code_zone_14:
                            this.unique_codepiece_textObject_arr[i].setVisible(false);
                            break;
                        default:
                            this.unique_codepiece_textObject_arr[i].setVisible(true);
                    }
                }
            }
        }
    }
    reset_unique_codepiece_position(scene) {
        var unique_codepiece_reset_y = this.unique_codepiece_reset_y; // 함수 호출 시 마다 같은 y 값 들어오도록
        for (var i = 0; i < this.unique_codepiece_textObject_arr.length; i++) {
            this.unique_codepiece_textObject_arr[i].x = scene.worldView.x + this.unique_codepiece_x;
            this.unique_codepiece_textObject_arr[i].y = unique_codepiece_reset_y;
            //console.log(this.unique_codepiece_textObject_arr[i].x, this.unique_codepiece_textObject_arr[i].y);
            unique_codepiece_reset_y += 30;
        }
    }
}