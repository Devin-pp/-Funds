//登录和注册接口
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/User');
const keys = require('../../config/keys');


//$route    POST api/users/register  注册
//@desc     return the requested  json data
//@access   public
router.post('/register',(req,res) => {
    // console.log(req.body);
    //查询数据库 检验邮箱存在
    User.findOne({email:req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json('邮箱已被注册!');
            }else{
                // 获取头像
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                // 创建新用户
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password,
                    identity:req.body.identity
                });
                // 密码加密
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
});


//$route    POST api/users/login    登录
//@desc     return the token jwt passport
//@access   public
router.post('/login',(req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    //查询数据库 邮箱是否存在
    User.findOne({email})
        .then(user =>{
            if(!user){
                return res.status(404).json('用户不存在！')
            }

            //密码匹配
            bcrypt.compare(password,user.password)
                .then(isMatch =>{
                    if(isMatch){
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identifier
                        };
                        jwt.sign(rule,keys.secretOrKey,{ expiresIn: 3600 },(err,token) =>{
                            if(err) throw err;
                            res.json({
                                success:true,
                                token:'Bearer ' + token
                            })
                        })
                    }else{
                        return res.status(400).json('密码错误！')
                    }
                })
        })
});


// @route  GET api/users/current  获取用户信息  验证token
// @desc   return current user
// @access Private
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res) => {
    res.json({
        id:req.user.id,
        email:req.user.email,
        name:req.user.name,
        identity:req.user.identity
    })

});

module.exports = router;