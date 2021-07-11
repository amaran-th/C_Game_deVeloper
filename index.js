const express = require('express'); 
const app = express();
app.set("port", process.env.PORT || 3000); // 서버 포트 설정.  

const morgan = require('morgan')
app.use(morgan('dev'))
//morgan 미들웨어 : GET /assets/images/menu.png 304 0.916 ms - - 


app.use(express.static(__dirname + '/'))
//정적 파일 제공 미들웨어asa
//npm으로 설치할 필요 x. 이미 내장
//서버에서 a.jpg 찾음 => ./pubic폴더에서 찾음


app.engine('html', require('ejs').renderFile);
app.set("views", "./views");
app.set("view engine", "html");
//render(html)할려고 한 코드들..

//id 보내는 코드 .html에서 '보내기' => /send_email POST
app.use(express.json()); //req로 데이터 받을때. 
app.use(express.urlencoded({extended: false})); //마찬가지


app.get('/test',function(req,res){
    console.log('tets~s...');
    res.render('test')
});//이건 걍 웹페이지 전환 코드 

app.post('/form_receive',function(req,res) {
    //서버에서 컴파일하고
    //결과값을 다시 클라이언트(웹페이지)로
    //POST => 데이터 => req.body에 저장됨
    var code = req.body.code;   //요청의 본문(body)(string 형태) 중 code 키에 해당하는 값(즉, form에 입력한 코드 내용 자체)
    var source = code.split(/\r\n|\r\n/).join("\n");
    var file='test.c';
    console.log(code)//다행히 코드는 잘 저장되네

    fs.writeFile(file,source,'utf8',function(error) {
        console.log('write end');
    });
    var compile = spawn('gcc',[file]);
    compile.stdout.on('data',function(data) {
        console.log('stdout: '+data);
    });
    compile.stderr.on('data',function(data){
        console.log(String(data));
    });
    compile.on('close',function(data){
        if(data ==0) {
            var run = spawn('./a.out',[]);    
            run.stdout.on('data',function(output){
                console.log('컴파일 완료');
                var responseData = {'result':'ok','output': output.toString('utf8')};
                res.json(responseData);
            });
            run.stderr.on('data', function (output) {
                console.log(String(output));
            });
            run.on('close', function (output) {
                console.log('stdout: ' + output);
            });
        }
    });
    
});






///////////////////


app.get('/',function(req,res){
    console.log('[main.js] Main page loading...');
    res.render('index')

});
app.listen(app.get('port'),function(){  //서버 연결 
    console.log('[Listening] localhost @',app.get('port'));
});
