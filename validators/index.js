exports.createPostValidator = (req, res, next) => {

    req.check('title', 'write a title').notEmpty();
    req.check('title', 'title must be between 4 and 120').isLength({
        min: 4,
        max: 120
    })


    req.check('body', 'write body').notEmpty()
    req.check('body', 'body must be between 4 and 2000').isLength({
        min: 4,
        max: 2000
    })

    const errors = req.validationErrors();

    if(errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(404).json({error: firstError})
    }

    next()
}



exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty()
    req.check('email', 'Email must be between 5 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 5,
            max: 32
        });
    
    req.check('password', 'Password is rquired').notEmpty()
    req.check('password')
        .isLength({min: 6})
        .withMessage('Password must contain atleast 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');


    const errors = req.validationErrors();

    if(errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    next()
}