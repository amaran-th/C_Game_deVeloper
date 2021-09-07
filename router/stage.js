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

router.route('/check') //세션의 stage값 가져오는거. 위에껄로 해도 상관없는데
//위에는 db갔다가 왔다갔다 하기땜에 stage값만 확인할거면 세션값 가져오자!
    .post(async (req, res, next) => {

    if(req.session.is_logined){

        var responseData = {'is_logined':true, 'stage': req.session.stage};

        res.json(responseData);
    }
    else{
        var responseData={'is_logined':false};
        res.json(responseData);
    }
});

router.route('/reset') //세션의 stage값 가져오는거. 위에껄로 해도 상관없는데
//위에는 db갔다가 왔다갔다 하기땜에 stage값만 확인할거면 세션값 가져오자!
    .post(async (req, res, next) => {

        if(req.session.is_logined){

            User.update(
                 {stage: 0}//2. DB의 stage값을 현재 session기준으로 1증가.
                ,{
                where: { id: req.session.uid }//1. 현재 로그인한 사용자
              });
              
            req.session.stage = 0;
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