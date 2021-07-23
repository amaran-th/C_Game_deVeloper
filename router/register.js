var express = require('express');
const router = express.Router();
const crypto = require("crypto");//보안
const { User } = require('../models');


router.route('/')
    .get(async (req, res, next) => {
        
        console.log('[Ragister GET] Register page loading...');
        res.render('register');
        
    })
    .post(async (req, res, next) => {
        try {
            console.log("=======Try to add user=======");

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
            res.render("main") //회원가입 되면 main페이지로.

        } catch (err) {
            console.log(err);
            console.log("======Failed to INSERT new user======");
            res.render("register")
           
        }
    })

router.route('/idcheck')
    .post(async (req, res, next) => {
        console.log("[POST] ID Check");
        console.log(req.body);
        const idcheck = await User.findOne({
            where: {
                username: req.body.id
            }
        }, { raw: true });

        if (idcheck != null) {
            res.json({ duplicate: 1 });
            console.log("ID Dup");
        } else {
            res.json({ duplicate: 0 });
            console.log("ID OK");
        }
    })

module.exports = router;