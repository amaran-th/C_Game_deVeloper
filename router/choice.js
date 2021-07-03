const express = require('express');
const router = express.Router();

router.get('/', async function(req, res){
    console.log('[choice.js]');
    res.send('hmm');
});

router.get('/:num',async function(req,res){
    console.log('[choice.js] Choosen page loading...');
    const c = parseInt(req.params.num);
    console.log(c);
    if (c == 1) {
        res.send('choice1');
    } else {
        res.send('choice2');
    }

});

module.exports = router;