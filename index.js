import express from 'express'; 
const app = express();
app.set("port", process.env.PORT || 3000); 

import fs from 'fs';
import { spawn } from 'child_process';

import morgan from 'morgan';
app.use(morgan('dev'))

import path from 'path';
const __dirname = path.resolve();
app.use(express.static(__dirname + '/'))

app.use(express.json()); 
app.use(express.urlencoded({extended: false})); 

app.get('/test',function(req,res){
    console.log('tets~s...');
    res.sendFile(path.join(__dirname, "./views", "test.html"));
});

app.post('/form_receive',function(req,res) {

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
            });
            run.on('close', function (output) {
                console.log('stdout: ' + output);
            });
        }
    });
    
});

app.get('/',function(req,res){
    console.log('[main.js] Main page loading...');
    res.sendFile(path.join(__dirname, "./views", "index.html"));

});
app.listen(app.get('port'),function(){  //서버 연결 
    console.log('[Listening] localhost @',app.get('port'));
});
