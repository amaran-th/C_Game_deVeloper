var express = require('express');
const router = express.Router();
const crypto = require("crypto");
const { User } = require('../models');

router.route('/check')//중복확인
    .post(async(req,res,next)=>{
        console.log('[POST /login/check]');
        const id = req.body.id;
        const pw = req.body.pw;

        const result = await User.findOne({
            where: {
                id : id
            }
        });

        if (result == null){
            console.log("==Failed : ID already exits==");
            var responseData = {'pass': false};
            res.json(responseData);
        }else{
            const nick = result.dataValues.nickname;
            const salt = result.dataValues.salt; //db에서 가져온 salt값
            const db_pw = result.dataValues.pw //db에서 가져온 pw 값
            const input_pw = pw; //입력받은 pw값
            const stage =  result.dataValues.stage ; //db에서 가져온 stage값
          
            const hash_pw =  crypto.pbkdf2Sync(input_pw, salt, 100, 64, "sha512").toString("base64");


            if((db_pw === hash_pw)==false){
                console.log("==Failed : PW does not match==");
                var responseData = {'pass': false};
                res.json(responseData);
            }else{

                var responseData = {'pass': true};
                res.json(responseData);

            }
        }
    })

router.route('/')
    .post(async (req, res, next) => {
        console.log('[POST /login]'); //login버튼 눌렀을 때
        const id = req.body.id;
        const pw = req.body.pw;

        if (id && pw) {
            const result = await User.findOne({
                where: {
                    id : id
                }
            });
            
            if (result == null){
                console.log("==Failed : ID does not exist==");
                res.redirect('/');
            }
            const nick = result.dataValues.nickname;
            const salt = result.dataValues.salt; //db에서 가져온 salt값
            const db_pw = result.dataValues.pw //db에서 가져온 pw 값
            const input_pw = pw; //입력받은 pw값
            const stage =  result.dataValues.stage ; //입력받은 pw값
          
            const hash_pw =  crypto.pbkdf2Sync(input_pw, salt, 100, 64, "sha512").toString("base64");
            

            if(db_pw === hash_pw){

                req.session.is_logined = true; 
                req.session.uid = id; 
                req.session.nickname=nick;
                req.session.stage=stage;

                console.log("==Success to login==");
                res.redirect('/game');
            }
            
        }
    })

module.exports = router;
