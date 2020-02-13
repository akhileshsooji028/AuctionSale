const router = require('express').Router();
const Bidding = require('../Schema/biddingSchema');
const Product = require('../Schema/productSchema');
const Users = require('../Schema/userSchema');
const nodemailer = require("nodemailer");

router.get('/', async (req, res) => {
    try {
        let bids = await Bidding.find();
        let count = await Bidding.countDocuments();
        res.status(200).json({
            biddings: bids,
            totalDocuments: count
        })
    } catch (error) {
        console.log(error)
    }
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;

    Bidding.findByIdAndDelete(id).then((data) => {
        res.status(200).json({
            msg: `Bidding deleted of id ${id}`,
            data: data
        })
    })
});

router.post('/', async (req, res) => {
    var body = req.body;
    let user = await Users.findById(body.userId);
    let item = await Product.findById(body.itemId);
    let bids = new Bidding(body);
    bids.itemInfo = item;
    bids.userInfo = user;

    let updateinfo = await Users.update({
        _id: body.userId
    }, {
        $set: {
            itemId: body.itemId,
            bidAmt: body.biddingAmt
        }
    });

    if ((bids.createdOn).toString() <= item.endingTime) { //true
        bids.save().then(async (newBid) => {
            res.status(200).json(newBid);

            let findAllAmt = await Users.find({
                itemId: newBid.itemId
            });

            let maxAmt = await findAllAmt.sort((a, b) => b.bidAmt - a.bidAmt)
            let userInfo = maxAmt[0]

            let updateWinner = await Product.findByIdAndUpdate(newBid.itemId, {
                $set: {
                    "winner": userInfo
                },
                $inc: {
                    v: 1
                }
            }, {
                new: true
            })

            let interval = setInterval(() => {
                var cond = (new Date().toString() > (newBid.itemInfo.endingTime).toString()) ? true : false;
                if (cond == true) {
                    clearInterval(interval);
                    var date = new Date(updateWinner.endingTime);
                    var milliseconds = date.getTime();
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: 'akhilesh.here028@gmail.com',
                            pass: 'Support123'
                        }
                    });
                    let HelperOptions = {
                        from: 'akhilesh.here028@gmail.com',
                        to: `${updateWinner.winner.emailId}`,
                        subject: 'Winner',
                        text: `Hello User,${updateWinner.winner.bidAmt} Congratulations!! Your the winner of the contest your had participated. Your product will be getting dispatched in two working days`
                    };
                    transporter.sendMail(HelperOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        }
                        console.log("The mail was sent successfully");
                    })

                    // });
                }

            }, 8000);
            res.status(201).json({
                message: 'New Bidding saved successfully',
                bids: newBid
            })
        }).catch(err => console.log(err))
    } else {
        console.log('Sorry!! Bidding time is up');
        res.send("Sorry!! Bidding time is up")
    }
});


module.exports = router;