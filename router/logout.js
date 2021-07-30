var express = require('express');
const router = express.Router();
const crypto = require("crypto");
const { User } = require('../models');

router.route('/')
    .post(async (req, res, next) => {
        console.log('[POST /logout]'); //logout버튼 눌렀을 때
        if (req.session.is_logined) {
            req.session.destroy();
            console.log("==Success to logout==");
        }
        else {
        }
        res.redirect('/');
    })

module.exports = router;
