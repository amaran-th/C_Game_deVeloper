var express = require('express');
const router = express.Router();
const { User } = require('../models');



router.route('/')
    .post(async (req, res, next) => {
        console.log('==== [terminate POST] ===='); //login버튼 눌렀을 때

        if (req.session.is_logined) {
            const terminate_id = req.session.uid;
            req.session.destroy(); //세션 삭제
            User.destroy({ //테이블에서 삭제
                where: { id: terminate_id },
            });
        }
        else {
        }
        res.redirect('/');
    })

module.exports = router;
