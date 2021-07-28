export default class Minicoding {
    create(scene){
        this.scene = scene;
        scene.onTile = false; //계속 업데이트 되는 걸 막아 사용자가 입력할 수 있도록
        //if(scene.offTile) {
        //    this.setVisible(false);
        //    return
        //}
        //var text = scene.add.text(300, 100, 'test Text', { color: 'white', fontSize: '20px '});

        /** 사용자 위치를 기준으로 input 창(textInput.html) 뜨게 만듦**/
        this.element = scene.add.dom(scene.player.x , scene.player.y - 200).createFromCache('input');
        this.element.addListener('click');

        this.element.on('click', function (event) {

            if (event.target.name === 'button')
            {
                var inputText = this.getChildByName('playerInput');
    
                if (inputText.value !== '')
                {
                    var data = {

                        'code': inputText.value
    
                    };
                    data = JSON.stringify(data);

                    var xhr = new XMLHttpRequest();

                    xhr.open('POST', '/form_receive', true);
                    
                    //console.log("---post 되냐???---");
                    xhr.setRequestHeader('Content-type', 'application/json');
                    
                    xhr.send(data);
                    //console.log("---post 되냐???---2");

                    xhr.addEventListener('load', function() {
                        //console.log("---post 되냐???---3");
                        var result = JSON.parse(xhr.responseText);
    
                        if (result.result != 'ok') return;
    
                        document.getElementById('testoutput').value = result.output;
    
                    });
                    //  Turn off the click events
                    //this.removeListener('click');
    
                    //  Hide the login element
                    //this.setVisible(false);
                    
                    scene.count = true; //사용자가 입력을 끝나면 다시 입력할 수 있도록.

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