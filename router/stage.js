var express = require('express');
const router = express.Router();
const { User } = require('../models');


router.route('/')
    .post(async (req, res, next) => {

    console.log("[POST(ajax) /get_stage] ");
    console.log('==check the Session==');

    if(req.session.is_logined){

        User.update(
             {stage: req.session.stage + 1}//2. DB의 stage값을 현재 session기준으로 1증가.
            ,{
            where: { id: req.session.uid }//1. 현재 로그인한 사용자
          });
          
        req.session.stage++;
        var responseData = {'is_logined':true, 'stage': req.session.stage};
         //DB에서는 업데이트 됬으나, 세션값도 업데이트 해야함.

        res.json(responseData);
    }
    else{
        var responseData={'is_logined':false};
        res.json(responseData);
    }
});

module.exports = router;