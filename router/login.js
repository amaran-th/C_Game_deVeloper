var express = require('express');
const router = express.Router();
const crypto = require("crypto");
const { User } = require('../models');

router.route('/check')
    .post(async(req,res,next)=>{
        console.log('==== [login check POST] ====');
        const id = req.body.id;
        const pw = req.body.pw;

        const result = await User.findOne({
            where: {
                id : id
            }
        });

        if (result == null){
            console.log("[아이디가 존재 X!]");
            var responseData = {'pass': false};
            res.json(responseData);
        }else{
            const nick = result.dataValues.nickname;
            const salt = result.dataValues.salt; //db에서 가져온 salt값
            const db_pw = result.dataValues.pw //db에서 가져온 pw 값
            const input_pw = pw; //입력받은 pw값
          
            const hash_pw =  crypto.pbkdf2Sync(input_pw, salt, 100, 64, "sha512").toString("base64");
            

            if((db_pw === hash_pw)==false){
                console.log("비밀번호 불일치");
                var responseData = {'pass': false};
                res.json(responseData);
            }else{
                console.log("비밀번호 일치");
                
                req.session.is_logined = true; 
                req.session.uid = id; 
                req.session.nickname=nick;

                console.log("[로그인 성공]");
                var responseData = {'pass': true};
                res.json(responseData);
                
            }
        }
    })

router.route('/')
    .post(async (req, res, next) => {
        console.log('==== [login POST] ===='); //login버튼 눌렀을 때
        const id = req.body.id;
        const pw = req.body.pw;

        if (id && pw) {
            const result = await User.findOne({
                where: {
                    id : id
                }
            });
            
            if (result == null){
                console.log("[아이디가 존재 X!]");
                res.redirect('/');
            }
            const nick = result.dataValues.nickname;
            const salt = result.dataValues.salt; //db에서 가져온 salt값
            const db_pw = result.dataValues.pw //db에서 가져온 pw 값
            const input_pw = pw; //입력받은 pw값
          
            const hash_pw =  crypto.pbkdf2Sync(input_pw, salt, 100, 64, "sha512").toString("base64");
            

            if(db_pw === hash_pw){
                console.log("비밀번호 일치");
                
                req.session.is_logined = true; 
                req.session.uid = id; 

                req.session.nickname=nick;
                console.log("[로그인 성공]");
                res.redirect('/game');
            }
            
        }
    })

module.exports = router;
