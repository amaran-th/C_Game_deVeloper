var express = require('express');
const router = express.Router();
const crypto = require("crypto");
const { User } = require('../models');

router.route('/')
    .post(async (req, res, next) => {
        console.log('==== [logout POST] ===='); //logout버튼 눌렀을 때
        if (req.session.is_logined) {
            req.session.destroy();
            console.log("로그아웃 성공!");
        }
        else {
        }
        res.redirect('/');
    })

module.exports = router;
