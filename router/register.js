var express = require('express');
const router = express.Router();
const crypto = require("crypto");//보안
const { User } = require('../../../짱중요/C_Game_deVeloper/models');



router.route('/')
    .get(async (req, res, next) => {
        
        console.log('[Ragister GET] Register page loading...');
        res.render('register');
        
    })
    .post(async (req, res, next) => {
        try {
            console.log("[Try to add user]");
            /////id 중복 확인
            const idcheck = await User.findOne({
                where: {
                    id: req.body.id
                }
            }, { raw: true });

            if (idcheck != null) {
                console.log("[ID Dup]");//중복
                //alert("중복입니다 다시 입력하세여"); 서버에서는 alert 안됨 방법 없나??
                res.render("register");
            } else {
                console.log("[ID OK]");
           
                var nick = req.body.nick;
                var id = req.body.id;
                var pw = req.body.pw;

                var salt = crypto.randomBytes(64).toString("base64");//보안
            
                var hashPw = crypto //보안
                    .pbkdf2Sync(pw, salt, 100, 64, "sha512")
                    .toString("base64");

                await User.create({
                    nickname: nick,
                    id: id,
                    pw: hashPw, // 그냥 pw가 아님!!
                    salt: salt,
                });

                console.log("=======Success to INSERT new user=======");
                res.render("index") //회원가입 되면 기본페이지로.
            }

        } catch (err) {
            console.log(err);
            console.log("======Failed to INSERT new user======");
            res.render("register") //중복말고 다른 에러가 뜰시
            
        }
    })


module.exports = router;