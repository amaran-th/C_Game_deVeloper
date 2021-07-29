//mYSQL에서 만든 테이블을 똑같이 정의해줘야함

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    //시퀄라이즈 모델을 확장한 class User 모델을. 모듈로 export

    static init(sequelize) { //static init: 테이블 정의
        return super.init({ //super.init의 첫번째 인수 : 테이블 컬럼에 관한 정의
            no : {
                type: Sequelize.INTEGER(20),
                primaryKey: true, // Primary Key 
                autoIncrement: true, // 자동 증가 
            },
            nickname: { 
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            id: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            pw: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            salt: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, { //2번째 인수: 테이블 자체에 관한 정의,
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'test', //table 이름!!!!!!!!!!!!!
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
};
