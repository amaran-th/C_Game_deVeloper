export default class Select extends Phaser.Scene {
    constructor() {
        super('selection');
        console.log('셀렉션 켜졌나?');
    }
    init(data)
    {
        console.log('init', data);

        this.msg = data.msgArr;
        //this.num = data.image;
    }

    create() {
        console.log('셀렉션 켜졌나?222');
        for(var i =0; i< this.msg.length; i++) {
            console.log(this.msg[i]);
        }
        var selectList = []; 
        for(var i=0; i< 3; i++) {
            selectList[i] = this.add.rectangle(300,100+i*100, 500,80, 0xFFD700).setOrigin(0,0);
-           this.add.text(selectList[i].x + 250, selectList[i].y + 40, this.msg[i], {
                fontFamily: 'Arial Black',
                fontSize: '15px',
                color: '#000000', //글자색 
                wordWrap: { width: 400, height:70, useAdvancedWrap: true },
                boundsAlignH: "center",
                boundsAlignV: "middle"
               }).setOrigin(0.5)
        }

        this.upKey = this.input.keyboard.addKey('up', true, true);
        this.downKey = this.input.keyboard.addKey('down', false, true);
        //this.cursorsKeys = this.input.keyboard.createCursorKeys();
        //this.upKey.onDown(this.selectChange);
        this.upKey.input.once(this.selectChange)
        //this.downKey = this.input.keyboard.addKey('down', false, true);
        
    
    }

    selectChange() {
        console.log('눌림');
    }

    update() {
        if(this.upKey.isDown){
            console.log('위');
       }
        else if(this.downKey.isDown){
            console.log('아래');
        }
    }

}