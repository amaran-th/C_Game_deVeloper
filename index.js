//혼또니
const express = require("express");
const app = express();
app.set("port", process.env.PORT || 3001); 


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

app.post('/form_receive',function(req,res) { //웹컴파일러

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
app.use('/register',registerRouter);


//메인페이지로, 라우터 따로 안해줬는데 해줘야함
app.get('/',function(req,res){
    console.log('[main.js] Main page loading...');
    res.render('index.html');

});

const { sequelize } = require('./models');
sequelize.sync({ force: false })
    .then(() => {
        console.log("======[Success] Database Connect======");
    })
    .catch((err) => {
    console.error(err);
    });

app.listen(app.get('port'),function(){  //서버 연결 
    console.log('[Listening] localhost @',app.get('port'));
});
