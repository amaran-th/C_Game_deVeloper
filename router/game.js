var express = require('express');
const router = express.Router();
const crypto = require("crypto");//보안
const { User } = require('../models');


router.route('/')
    .get(async (req, res, next) => {
        if(req.session.is_logined){
            console.log('[GET /game]');
            //let {nick,id}=req.query;   //url의 쿼리 스트링(닉네임)을 가져온다.(ex : /game?nick=abc라면 abc 문자열을 의미)
            //console.log(nick);
            //console.log(id);
            res.render('game');
        }else{
            res.send('로그인 후 이용해주세요.');
        }
        
    })


module.exports = router;
