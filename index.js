const express = require('express'); 
const app = express();
app.set("port", process.env.PORT || 4200); // 서버 포트 설정.  

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


app.get('/test',function(req,res){
    console.log('tets~s...');
    res.render('test')
});//이건 걍 웹페이지 전환 코드 

//id 보내는 코드 .html에서 '보내기' => /send_email POST
app.use(express.json()); //req로 데이터 받을때. 
app.use(express.urlencoded({extended: false})); //마찬가지

app.post('/send_code', function(req,res){
    console.log("code :", req.body.code);   //post로 받은건 req.body에 저장!                                                                 
    res.send("<h1>WELCOME<h1>");
  });
///////////////////


app.get('/',function(req,res){
    console.log('[main.js] Main page loading...');
    res.render('index')

});
app.listen(app.get('port'),function(){  //서버 연결 
    console.log('[Listening] localhost @',app.get('port'));
});
