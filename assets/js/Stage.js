class Stage extends Phaser.Scene {
    constructor(scene) { // 안에 매개변수 그런 건 필요한 걸로 하면 됩니다!
        super(scene);

        scene.add.existing(this); // 이게 있어야 모듈 안 써도 내부 변수 다른 js 파일에 호출할 수 있음

        console.log("Stage.js 테스트");
        this.test = "Stage.js 변수 테스트";
    }
}