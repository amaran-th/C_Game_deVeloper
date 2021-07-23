const User = require('./user');
const Sequelize = require('sequelize');//시퀄라이즈 패키지이자 생성자 
const env = process.env.NODE_ENV || 'development';

const config = require('../config/config')[env];
//config.json 가져옴 => DB설정 들어가있음(아이디, 비번, DB 이름 )
//db가지고 테이블을 여러개 만드는 거임!!
const sequelize = new Sequelize(config.database, config.username, config.password, config);
//db설정가지고 !!!!!!!!!!!!!MYSQL 연결 객체!!!!!!!!!! 를 만듦

const db = {};
db.sequelize = sequelize; //MYSQL 연결객체를 나중에 쓰려고, db 객체에 넣음

db.User = User; //db 객체에 User 모델(테이블) 넣음.
User.init(sequelize); //!!! 각각 모델(테이블)의 static init함수 호출
//init실행이 되어야, 모델에 table이 연결되는거임!!!

module.exports = db; //db객체 모듈로 export!
