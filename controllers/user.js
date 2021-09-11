const User = require('../models/user')
const _     = require('lodash')

exports.userById = (req, res, next, id) => {
    User.findOne({id}).exec((err, user) => {
        if( err || !user)
            return res.status(401).json({error : 'User not found'})
        
        req.profile = user
        next()
    })
}

exports.hasAuthorized = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id

    if(!authorized)
        return res.status(401).json({ error: 'User is not authorized to perform this action'})
}

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if(err)
            return res.status(401).json({error : err})
        
        res.status(200).json({ users })
    }).select('name email created updated')
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined

    return res.json( req.profile )
}

exports.updateUser = (req, res, next) => {
    let user = req.profile

    user = _.extend(user, req.body)
    user.updated = Date.now()
    user.save((err) => {
        if(err)
            return res.status(400).json({
                error: 'You are not authorized to perform this action'
            })
        
        user.hashed_password = undefined
        user.salt = undefined

        res.json({ user })
    })
}

exports.deleteUser = (req, res, next) => {
    let user = req.profile

    user.remove((err, user) => {
        if(err)
            return res.status(401).json({error: err})
        
        res.status(200).json({ message: "User is deleted successfuly"})
    })
}