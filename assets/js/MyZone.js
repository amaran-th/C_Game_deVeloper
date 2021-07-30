class MyZone extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        // ...
        scene.add.existing(this);
    }
    // ...

    // preUpdate(time, delta) {}
}