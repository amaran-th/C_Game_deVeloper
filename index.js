//혼또니
const express = require("express");
const app = express();
app.set("port", process.env.PORT || 3000); 

const fs = require("fs");
const { spawn } = require("child_process");

const morgan = require("morgan");
app.use(morgan('dev'))

const path = require("path");
app.use(express.static(__dirname + '/'))

const ejs = require("ejs");
app.set('views', __dirname + '/views');         //ejs => html
app.engine('html', ejs.renderFile); 
app.set('view engine', 'html'); //html이지만 render쓰고 싶어서 하는 코드

app.use(express.json()); 
app.use(express.urlencoded({extended: false})); 

const session = require("express-session");

app.use(
    session({
      secret: "pipi",//쿠키 서명필요. 요거 중요함!!!! 나중에는 아무도 모를 변수로 저장해야함
      resave: false, //수정사항 없어도 세션 다시 설정할건지
      saveUninitialized: true, //세션에 저장할 내용이 없더라고 세션 다시 저장할건지
      cookie: {
        HttpOnly : true,//클라이언트는 쿠키못보게
        secure : false, //http아닌 환경도 가능한지. 배포시에는 true로
      //  maxAge : 60000 * 30, //60000밀리초 (1분) * 30 = 30분
      },
    })
  );

  app.post('/form_test',function(req,res) { //웹컴파일러
    console.log("[POST(ajax) /form_test] ");
    var code = req.body.code;  
    var source = code.split(/\r\n|\r\n/).join("\n");
    var file='test.c';
    console.log(code)

    fs.writeFile(file,source,'utf8',function(error) {
        console.log('write end');
    });
    console.log('(임시)gcc 실행 테스트');
    var responseData={'result':'ok','output':code.toString('utf8')};
    res.json(responseData);
    
});

app.post('/form_receive',function(req,res) { //웹컴파일러

    console.log("[POST(ajax) /form_receive] ");
    var code = req.body.code;  
    var source = code.split(/\r\n|\r\n/).join("\n");
    var file='test.c';
    console.log(code)

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
                res.json(responseData);
            });
            run.on('close', function (output) {
                console.log('stdout: ' + output);
            });
        }
    });
    
});

//라우터
var registerRouter = require("./router/register");
var loginRouter = require("./router/login");
var logoutRouter = require("./router/logout");
var terminateRouter = require("./router/terminate");
var gameRouter = require("./router/game");
var stageRouter = require("./router/stage");

app.use('/register',registerRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/terminate',terminateRouter);
app.use('/game',gameRouter);
app.use('/stage',stageRouter);

//================================================================이 부분은 지워도 될 것 같은데 일단 냅뒀음
//메인페이지로, 라우터 따로 안해줬는데 해줘야함
app.get('/',function(req,res){
    console.log('[GET /]');
  //  res.render('index.html');
    if (req.session.is_logined) {
        res.render('index2.html');
        //==res.render('tutorial', { uid: req.session.uid });
    } else {
        res.render('index.html');
    }
});
//==============================================================================================================

app.post('/get_session',function(req,res) { //세션 정보(닉네임, 아이디)를 받아오기 위한 url

    console.log("[POST(ajax) /get_session] ");
    console.log('==check the Session==');
    if(req.session.is_logined){
        var nick=req.session.nickname;
        var id=req.session.uid;
        var responseData={'is_logined':true,'nick':nick,'id':id};
    }else{
        var responseData={'is_logined':false};
    }
    
    res.json(responseData);
    
});


const { sequelize } = require('./models');
sequelize.sync({ force: false })
    .then(() => {
        console.log("[Success] Database Connect");
    })
    .catch((err) => {
    console.error(err);
    });

app.listen(app.get('port'),function(){  //서버 연결 
    console.log('[Listening] localhost @',app.get('port'));
});
