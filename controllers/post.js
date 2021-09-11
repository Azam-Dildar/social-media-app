const Post = require('../models/post')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id name')
        .exec((err, post) => {
            if(err || !post)
                return res.status(400).json({error : err})
            
            req.post = post
            next()
        })
}

exports.getPosts = (req, res) => {
    const posts = Post.find().select('_id title body')
        .populate('postedBy', '_id name')
        .then((posts) => {
            res.status(200).json({ posts })
        })
        .catch(err => {
            res.status(404).json({ error: err})
        })
}

exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, files) =>  {
        if(err)
            return res.status(400).json({ error: 'Image could not be uploaded'})
        
        let post = new Post(fields)
        req.profile.hashed_password = undefined
        req.profile.salt = undefined    
        post.postedBy = req.profile

        if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.type = files.photo.type
        }

        post.save((err, result) =>{
            if(err)
                return res.status(400).json({ error: err})
            
            res.json( result )
        })
    })

}

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id})
        .populate('postedBy', '_id name')
        .sort('_created')
        .exec((err, posts) => {
            if(err)
                return res.status(400).json({ error: err })
            
            res.status(200).json({ posts })
        })
}

exports.isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id

    if(!isPoster)
        return res.status(400).json({ error: "User is not authorized"})
    
    next()
}

exports.updatePost = (req, res) => {
    let post = req.post
    post = _.extend(post, req.body)

    post.save(err => {
        if(err)
            return res.status(400).json({ error: err })
        
        res.status(200).json( post )
    })
}

exports.deletePost = (req, res ) => {
    let post = req.post
    post.remove((err, post) => {
        if(err)
            return res.status(400).json({ error: err})
        
        res.status(200).json({ message: "Post is delete successfully"})
    })
}