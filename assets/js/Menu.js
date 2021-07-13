class Menu extends Phaser.Scene {
    constructor(){ 
        super("Scene0"); //identifier for the scene
        console.log("construction of Menu class");
    }

    preload() {
        console.log("preloading menu image");
        this.load.image('menu', './assets/images/menu.png');
        console.log(" menu image");
    }
    create() {
        console.log("creating menu image");
        this.mainpage = this.add.image(0, 0, 'menu');
        this.mainpage.setOrigin(0, 0) //reassign center point 
        this.mainpage.setInteractive()
        this.input.on('clicked', this.startScene1); //not my part... it's not working
    }
    startScene1() {
        console.log("startScene1");
        this.scene.start("Scene1");
    }
}
