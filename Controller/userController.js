const router = require('express').Router();
const Users = require('../Schema/userSchema');
const md5 = require('md5');

router.get('/', async (req, res) => {
    let filter = {};

    if (req.query.name) {
        filter.name = req.query.name
    }
    if (req.query.email) {
        filter.email = req.query.email
    }
    if (req.query.itemId) {
        filter.itemId = req.query.itemId
    }
    if (req.query.bidAmt) {
        filter.bidAmt = req.query.bidAmt
    }
    try {
        let users = await Users.find(filter);
        res.status(200).json({
            users: users
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/:id', (req, res) => {
    let id = req.params.id;
    Users.findById(id).then(data => {
        res.status(200).json({
            data: data
        })
    })
});

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Users.findByIdAndUpdate(id, {
            $set: body,
            $inc: {
                v: 1
            }
        }, {
            new: true
        })
        .then((data) => {
            res.json({
                data: data
            })
        }).catch(err => next(err))
});

router.post('/', (req, res) => {
    let body = req.body;
    let user = new Users(body);
    user.password = md5(body.password);
    user.save().then(newUser => {
        res.status(201).json({
            message: 'New user saved successfully',
            user: newUser
        })
    }).catch(err => console.log(err))
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;

    Users.findByIdAndDelete(id).then((data) => {
        res.status(200).json({
            msg: `User deleted of id ${id}`,
            data: data
        })
    })
});

module.exports = router;