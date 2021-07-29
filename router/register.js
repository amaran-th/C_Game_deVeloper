var express = require('express');
const router = express.Router();
const crypto = require("crypto");//보안
const { User } = require('../models');

//회원가입시 아이디 중복체크
router.route('/checkdp')
    .post(async(req,res,next)=>{
        try{
            //[Register checkdp POST]
            console.log("[POST /register/checkdp]");
            const idcheck = await User.findOne({
                where: {
                    id: req.body.id
                }
            }, { raw: true });

            if (idcheck != null) {
                console.log("==id Dup==");//중복
                var responseData = {'result': 1};
                res.json(responseData);
            }else{
                console.log("==NOT id Dup==");//중복 X
                console.log("==Success to CHECK ID==");
                var responseData = {'result': 0};
                res.json(responseData);
            }
    }catch (err) {
        console.log(err);
        console.log("==Failed to CHECK ID==");
        res.render("register")//중복말고 다른 에러가 뜰시
        
    }
})

router.route('/')
    .get(async (req, res, next) => {
        
        console.log('[GET /register]');
        res.render('register');
        
    })
    .post(async (req, res, next) => {
        try {
            console.log('[POST /register]');
            console.log("==Try to add user==");
        
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

            console.log("==Success to INSERT new user==");
            res.redirect("/") //회원가입 되면 기본페이지로.        
        } catch (err) {
            console.log(err);
            console.log("==Failed to INSERT new user==");
            res.render("register") //중복말고 다른 에러가 뜰시
        }
    })
module.exports = router;
