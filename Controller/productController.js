const router = require('express').Router();
const Product = require('../Schema/productSchema');
const Users = require('../Schema/userSchema');
const Bidding = require('../Schema/biddingSchema');
const nodemailer = require("nodemailer");
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
});


router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let findAllAmt = await Users.find({
        itemId: id
    });

    let maxAmt = await findAllAmt.sort((a, b) => b.bidAmt - a.bidAmt)
    let userInfo = maxAmt[0]
    // console.log("hiiii", userInfo);

    let updateWinner = await Product.findByIdAndUpdate(id, {
        $set: {
            "winner": userInfo
        },
        $inc: {
            v: 1
        }
    }, {
        new: true
    })
    // console.log("winner updated ", updateWinner);
    Product.findById(id).then(data => {
        res.status(200).json({
            data: data
        })
    })
});

router.get('/', async (req, res) => {
    let filter = {};

    if (req.query.productName) {
        filter.productName = req.query.productName
    }
    if (req.query.startingPrice) {
        filter.startingPrice = req.query.startingPrice
    }
    try {
        let product = await Product.find(filter);
        let count = await Product.countDocuments();
        res.status(200).json({
            product: product,
            totalDocuments: count
        })
    } catch (error) {
        console.log(error)
    }
});

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findByIdAndUpdate(id, {
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

router.post('/', upload.single('productImage'), (req, res, next) => {
    let body = req.body;
    var startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + 2);
    console.log(startTime)
    let product = new Product(body);
    product.endingTime = startTime;
    product.save().then(newProduct => {
        res.status(201).json({
            message: 'New Product saved successfully',
            product: newProduct
        })
    }).catch(err => console.log(err))
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;

    Product.findByIdAndDelete(id).then((data) => {
        res.status(200).json({
            msg: `Product deleted of id ${id}`,
            data: data
        })
    })
});




module.exports = router;