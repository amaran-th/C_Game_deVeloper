export default class Minicoding {
    create(scene){
        this.scene = scene;

        //var text = scene.add.text(300, 100, 'test Text', { color: 'white', fontSize: '20px '});

        this.element = scene.add.dom(scene.player.x , scene.player.y - 200).createFromCache('input');
        this.element.addListener('click');

        this.element.on('click', function (event) {

            if (event.target.name === 'button')
            {
                var inputText = this.getChildByName('playerInput');
    
                if (inputText.value !== '')
                {
                    //  Turn off the click events
                    this.removeListener('click');
    
                    //  Hide the login element
                    this.setVisible(false);
    
                    //  Populate the text with whatever they typed in
                    //text.setText('Welcome ' + inputText.value);
                }
                else
                {
                    //  Flash the prompt 이거 뭔지 모르겠음 다른 곳에서 긁어옴
                    this.scene.tweens.add({
                        targets: text,
                        alpha: 0.2,
                        duration: 250,
                        ease: 'Power3',
                        yoyo: true
                    });
                            }
            }
    
        });
     /*
        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: 'Power3'
        });
        */
	}
}