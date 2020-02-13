
// // console.log("email id mil gaya ", data)
// // console.log(data.endingTime)
// // var date = new Date(data.endingTime); // some mock date
// // var milliseconds = date.getTime();
// // console.log(milliseconds)
// // setTimeout(() => {
// //     let transporter = nodemailer.createTransport({
// //         host: 'smtp.gmail.com',
// //         port: 587,
// //         secure: false,
// //         requireTLS: true,
// //         auth: {
// //             user: 'akhilesh.here028@gmail.com',
// //             pass: 'Support123'
// //         }
// //     });
// //     let HelperOptions = {
// //         from: 'akhilesh.here028@gmail.com',
// //         to: `${data.winner.emailId}`,
// //         subject: 'Winner',
// //         text: 'Hello User, Congratulations!! Your the winner of the contest your had participated. Your product will be getting dispatched in two working days'
// //     };
// //     transporter.sendMail(HelperOptions, (error, info) => {
// //         if (error) {
// //             console.log(error);
// //         }
// //         console.log("The mail was sent successfully");
// //         console.log(info)
// //     })

// // }, milliseconds);

































// router.post('/', async (req, res) => {
//     var body = req.body;
//     let user = await Users.findById(body.userId);
//     let item = await Product.findById(body.itemId);
//     let bids = new Bidding(body);
//     bids.itemInfo = item;
//     bids.userInfo = user;

//     let updateinfo = await Users.update({
//         _id: body.userId
//     }, {
//         $set: {
//             itemId: body.itemId,
//             bidAmt: body.biddingAmt
//         }
//     });

//     if ((bids.createdOn).toString() <= item.endingTime) { //true
//         bids.save().then(async (newBid) => {
//             res.status(200).json(newBid);

//             let findAllAmt = await Users.find({
//                 itemId: newBid.itemId
//             });

//             let maxAmt = await findAllAmt.sort((a, b) => b.bidAmt - a.bidAmt)
//             let userInfo = maxAmt[0]

//             let updateWinner = await Product.findByIdAndUpdate(newBid.itemId, {
//                 $set: {
//                     "winner": userInfo
//                 },
//                 $inc: {
//                     v: 1
//                 }
//             }, {
//                 new: true
//             })
//             // let items = Product.findById(body.itemId);
//             // console.log("items", items)

//             let interval = setInterval(() => {
//                 var cond = (new Date().toString() > (newBid.itemInfo.endingTime).toString()) ? true : false;
//                 console.log("connd", cond);
//                 console.log("body.itemId near condition", body.itemId);
//                 if (cond == true) {
//                     clearInterval(interval);
//                     setImmediate(() => {
//                         console.log("updateWinner", updateWinner);
//                         var date = new Date(updateWinner.endingTime);
//                         var milliseconds = date.getTime();
//                         let transporter = nodemailer.createTransport({
//                             host: 'smtp.gmail.com',
//                             port: 587,
//                             secure: false,
//                             requireTLS: true,
//                             auth: {
//                                 user: 'akhilesh.here028@gmail.com',
//                                 pass: 'Support123'
//                             }
//                         });
//                         let HelperOptions = {
//                             from: 'akhilesh.here028@gmail.com',
//                             to: `${updateWinner.winner.emailId}`,
//                             subject: 'Winner',
//                             text: `Hello User,${updateWinner.winner.bidAmt} Congratulations!! Your the winner of the contest your had participated. Your product will be getting dispatched in two working days`
//                         };
//                         transporter.sendMail(HelperOptions, (error, info) => {
//                             if (error) {
//                                 console.log(error);
//                             }
//                             console.log("The mail was sent successfully");
//                             console.log(info)
//                         })

//                     });
//                 }

//             }, 100);

//             console.log("checking", interval)
//             res.status(201).json({
//                 message: 'New Bidding saved successfully',
//                 bids: newBid
//             })
//         }).catch(err => console.log(err))
//     } else {
//         console.log('Sorry!! Bidding time is up');
//         res.send("Sorry!! Bidding time is up")
//     }
// });