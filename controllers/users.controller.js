const db = require("../models");
const Users = db.users;
const Invites = db.invites;
const Records = db.records;
const Op = db.Sequelize.Op;

const multer = require('multer');
const md5 = require("md5");
const path = require('path');
const url = require('url');

const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const handlebars = require("handlebars");
const https = require('https');
const fs = require("fs");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const welcomeEmailSource = fs.readFileSync(path.join(__dirname, "../config/mail/invite.hbs"), "utf8");
const freeEmailSource = fs.readFileSync(path.join(__dirname, "../config/mail/plan_free.hbs"), "utf8");
const premiumEmailSource = fs.readFileSync(path.join(__dirname, "../config/mail/plan_premium.hbs"), "utf8");
const mailgunAuth = {
    auth: {
      api_key: process.env.MAILGUN_SECRET,
      domain: process.env.MAILGUN_DOMAIN
    }
}
const backColor = [
    'f0cad3', 'eebcb7', 'f0d5b6', 'f2e4bd', 'cae8c8', 'cae2f2', 'd3ccf0'
];

const storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './www/uploads');
    },
    filename: function (req, file, callback) {
    //   callback(null, file.originalname + '-' + Date.now());
        var filename = file.originalname.split('.');
        var fileext = path.extname(file.originalname);
        callback(null, filename[0] + '-' + Date.now() + fileext);
    }
});
  
// const upload = multer({limits:{fileSize:4000000}}).single('file');
const upload = multer({ storage : storage}).single('file');

exports.uploadphoto = (req, res) => {
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        var urlname = req.file.filename;
        res.json({filename:urlname});
        res.end();
    });
};

exports.uploadrecord = (req, res) => {
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        var urlname = req.file.filename;
        res.json({filename:urlname});
        res.end();
    });
};

const generateMD5 = (str) => {
    const res = md5(str);
    return res;
}

const replaceSpaceText = (str) => {
    return str.replace(/\s/g, '__');
}

const sendingMail = (mailSource, params, subject, to) => {
    // Mail sending
    const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

    const template = handlebars.compile(mailSource);

    const htmlToSend = template(params);

    const mailOptions = {
        from: "info@joinshuffle.io",
        to: to,
        subject: subject,
        html: htmlToSend
    }
    
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error)
        } else {
            console.log("Successfully sent email.")
        }
    });
}

// Create new User
exports.create = async (req, res) => {
    // validation request
    if( !req.body.email ) {
        res.status(400).send({
            message: "Email error"
        });
        return;
    }

    try {
        const result = await Users.create({
            username: req.body.firstname,
            email: req.body.email,
            password: generateMD5(req.body.password),
            roomname: '',
            plantype: 0,
            islocked: false,
            isopened: false,
            usericon: '',
            ispaid: 0,
            roomlogo: '',
        });
        if( result ) {
            req.session.userData = result.toJSON();
            var bgColor = backColor[Math.floor(Math.random() * 7)];
            var userIcon = 'https://eu.ui-avatars.com/api?name=' + req.body.firstname + '&size=140&background=e2fcee&color=00ab53&rounded=false';
            req.session.userData.usericon = userIcon;
            req.session.userData.roomlogo = '/images/logo_white.svg';
            res.cookie('curuserinfo', req.session.userData);
            req.session.save();
        }
    } catch (err) {
        console.log(err);
    }

    res.redirect('/plan');
};

// update room setting
exports.roomsetting = (req, res, next) => {
    if( req.session.userData != null ) {
        var userId = req.session.userData.id;
        var filename = req.body.filename;

        Users.update(
            {
                roomname: req.body.roomname,
                roomlogo: filename,
            },
            {where: {id: userId}}
        )
        .then(function(rowUpdated) {
            req.session.userData.roomname = req.body.roomname;
            if( filename != '' )
                req.session.userData.roomlogo = '/uploads/' + filename;
            
            res.cookie('curuserinfo', req.session.userData);
            req.session.save();
            res.json({message: 'success'});
        })
        .catch(next);
    } else {
        res.redirect('/');
    }
};

// update profile info
exports.updateprofile = (req, res, next) => {
    if( req.session.userData != null ) {
        var userId = req.session.userData.id;
        
        var userPass = req.body.password;
        var filename = req.body.filename;

        if( userPass != '' ) {
            Users.update(
                {
                    username: req.body.username, 
                    email: req.body.email,
                    roomname: req.body.roomname,
                    password: generateMD5(userPass),
                    usericon: filename,
                },
                {where: {id: userId}}
            )
            .then(function(rowUpdated) {
                req.session.userData.username = req.body.username;
                req.session.userData.email = req.body.email;
                req.session.userData.roomname = req.body.roomname;
                if( filename != '' )
                    req.session.userData.usericon = '/uploads/' + filename;
                
                res.cookie('curuserinfo', req.session.userData);
                req.session.save();
                res.json({message: 'success'});
            })
            .catch(next);
        } else {
            Users.update(
                {
                    username: req.body.username, 
                    usericon: filename,
                    email: req.body.email,
                    roomname: req.body.roomname,
                },
                {where: {id: userId}}
            )
            .then(function(rowUpdated) {
                req.session.userData.username = req.body.username;
                req.session.userData.email = req.body.email;
                req.session.userData.roomname = req.body.roomname;
                if( filename != '' )
                    req.session.userData.usericon = '/uploads/' + filename;
                res.cookie('curuserinfo', req.session.userData);
                req.session.save();
                res.json({message: 'success'});
            })
            .catch(next);
        }
    } else {
        res.redirect('/');
    }
};

// Update plan type
exports.updateplan = (req, res, next) => {
    // validation request
    if( !req.body.plantype ) {
        res.status(400).send({
            message: "Need to select plan type"
        });
        return;
    }

    if( req.session.userData != null ) {
        var userId = req.session.userData.id;
        Users.update(
            {plantype: req.body.plantype},
            {where: {id: userId}}
        )
        .then(function(rowUpdated) {
            // console.log(rowUpdated);
            req.session.userData.plantype = req.body.plantype;
            res.cookie('curuserinfo', req.session.userData);
            req.session.save();

            if( req.body.plantype == '1') {
                // send mail
                sendingMail(freeEmailSource, 
                    {username: req.session.userData.username},
                    "Welcome",req.session.userData.email);
                res.redirect('/roomname');
            } else {
                // send mail
                sendingMail(premiumEmailSource, 
                    {username: req.session.userData.username},
                    "Welcome",req.session.userData.email);
                res.redirect('/payment');
            }
        })
        .catch(next);
    } else {
        res.redirect('/');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('curuserinfo');
    res.redirect('/');
};

// Register
exports.register = (req, res) => {
    if( req.session.userData != null ) {
        if( parseInt(req.session.userData.plantype) == 0 ) 
            res.render('plan.pug', {userinfo: req.session.userData});
        else if( req.session.userData.ispaid == 0 && parseInt(req.session.userData.plantype) == 2 )
            res.render('payment.pug', {userinfo: req.session.userData, from: ''});
        else if( req.session.userData.roomname == '' ) 
            res.render('roomname.pug', {userinfo: req.session.userData});
        else
            res.render('home.pug', {userinfo: req.session.userData});
    } else {
        res.render('register.pug');
    }
};

// Login 
exports.enterlogin = (req, res) => {
    if( req.session.userData != null ) {
        // res.sendFile(path.join(__dirname, 'www/plan.html'), {userinfo: req.session.user});
        if( parseInt(req.session.userData.plantype) == 0 ) 
            res.render('plan.pug', {userinfo: req.session.userData});
        else if( req.session.userData.ispaid == 0 && parseInt(req.session.userData.plantype) == 2 )
            res.render('payment.pug', {userinfo: req.session.userData, from: ''});
        else if( req.session.userData.roomname == '' ) 
            res.render('roomname.pug', {userinfo: req.session.userData});
        else
            res.render('home.pug', {userinfo: req.session.userData});
    } else {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        if( query.room != null )
            res.render('login.pug', {room: query.room});
        else 
            res.render('login.pug', {room: ''});
    }
};

// Payment
exports.payment = (req, res) => {
    var from = '';
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    if( query.from )
        from = query.from;
    res.render('payment.pug', {from: from});
};

exports.updatepayment = async (req, res, next) => {
    var from = req.body.fromVal;
    var coupon = req.body.couponid;
    if( coupon == '' )
        coupon = null;
    await stripe.customers.create({
        card: req.body.stripeToken,
        email: req.session.userData.email,
        plan: process.env.STRIPE_PLAN_ID,
        coupon: req.body.couponid,
    }, function(err, customer) {
        if( err ) {
            res.json({message: 'error'});
        } else {
            Users.update(
                {
                    ispaid: 1, 
                    plantype: 2,
                    paiddate: new Date(),
                },
                {where: {id: req.session.userData.id}}
            )
            .then(function(rowUpdated) {
                req.session.userData.ispaid = 1;
                req.session.userData.plantype = 2;
                res.cookie('curuserinfo', req.session.userData);            
                req.session.save();
                res.json({message: 'success'});
                // if( from == '')
                //     res.redirect('/roomname');
                // else
                //     res.redirect('/subscription');
            })
            .catch(next);
        }
    });
};

exports.getcoupon = async (req, res) => {
    if( !req.body.couponid ) {
        res.status(400).send({
            message: "Doesn't exist Coupon ID"
        });
        return;
    }
    await stripe.coupons.retrieve(req.body.couponid, function(err, coupon) {
        if( err )
            res.json({message: 'error'});
        else {
            res.json(coupon);
        }
    });
}

exports.getpromotion = async (req, res) => {
    if( !req.body.couponid ) {
        res.status(400).send({
            message: "Doesn't exist Coupon ID"
        });
        return;
    }
    await stripe.promotionCodes.list({limit:1, code:req.body.couponid}, function(err, data) {
        if( err )
            res.json({message: 'error'});
        else {
            if( data.data.length > 0 )
                res.json(data.data[0].coupon);
            else
                res.json({message: 'error'});
        }
    });
}

// Pricing
exports.pricing = (req, res) => {
    if( req.session.userData != null ) {
        // res.sendFile(path.join(__dirname, 'www/plan.html'), {userinfo: req.session.user});
        if( parseInt(req.session.userData.plantype) == 0 ) 
            res.render('plan.pug', {userinfo: req.session.userData});
        else if( req.session.userData.ispaid == 0 && parseInt(req.session.userData.plantype) == 2 )
            res.render('payment.pug', {userinfo: req.session.userData, from: ''});
        else if( req.session.userData.roomname == '' ) 
            res.render('roomname.pug', {userinfo: req.session.userData});
        else
            res.render('home.pug', {userinfo: req.session.userData});
    } else {
        // res.sendFile(path.join(__dirname, 'www/landing.html'));
        res.render('pricing.pug');
    }
};

// Profile view
exports.profile = (req, res) => {
    if( req.session.userData != null ) {
        res.render('profile.pug', {userinfo: req.session.userData});
    } else {
        res.redirect('/');
    }
};

// Room Settings
exports.roomset = (req, res) => {
    if( req.session.userData != null ) {
        res.render('roomsetting.pug', {userinfo: req.session.userData});
    } else {
        res.redirect('/');
    }
}

// Faq 
exports.faq = (req, res) => {
    if( req.session.userData != null ) {
        res.render('faq.pug', {userinfo: req.session.userData});
    } else {
        res.redirect('/');
    }
};

exports.records = (req, res) => {
    if( req.session.userData != null ) {
        res.render('records.pug', {userinfo: req.session.userData});
    } else {
        res.redirect('/');
    }
};

// Subscription view
exports.subscription = (req, res) => {
    if( req.session.userData != null ) {
        res.render('subscription.pug', {userinfo: req.session.userData});
    } else {
        res.redirect('/');
    }
};

// Faq view
exports.faq = (req, res) => {
    if( req.session.userData != null ) {
        res.render('faq.pug');
    } else {
        res.redirect('/');
    }
};

// Update Meeting open
exports.updateopen = (req, res, next) => {
    if( req.session.userData != null ) {
        var userId = req.session.userData.id;
        Users.update(
            {isopened: req.body.isOpen},
            {where: {id: userId}}
        )
        .then(function(rowUpdated) {
            // console.log(rowUpdated);
            if( req.body.isOpen == true )
                res.redirect('/'+req.session.userData.roomname);
            else 
                res.json({message: 'ok'});
        })
        .catch(next);
    } else {
        res.redirect('/');
    }
};

// Update room name
exports.updateroom = (req, res, next) => {
    // validation request
    if( !req.body.roomname ) {
        res.status(400).send({
            message: "Need to select room name"
        });
        return;
    }

    if( req.session.userData != null ) {
        var userId = req.session.userData.id;
        Users.update(
            {roomname: replaceSpaceText(req.body.roomname), islocked: req.body.lockstatus},
            {where: {id: userId}}
        )
        .then(function(rowUpdated) {
            // Users.update(
            //     {isopened: true},
            //     {where: {id: userId}}
            // )
            // res.redirect('/join/'+replaceSpaceText(req.body.roomname));
            req.session.userData.roomname = replaceSpaceText(req.body.roomname);
            res.cookie('curuserinfo', req.session.userData);
            req.session.save();
            res.redirect('/');
        })
        .catch(next);
    } else {
        res.redirect('/');
    }
};

// Check if exist user
exports.hasuser = (req, res) => {
    Users.findOne({
        where: {
            email: req.body.userEmail
        }
    })
    .then(data => {
        if( data ) {
            res.json({message: 'yes'});
        } else {
            res.json({message: 'no'});
        }
    })
    .catch(err => {
        res.json({message: 'no'});
    });
}

// Check if exist room name
exports.checkroom = (req, res) => {
    Users.findOne({
        where: {
            roomname: req.body.roomname
        }
    })
    .then(data => {
        if( data ) {
            res.json({message: 'yes'});
        } else {
            res.json({message: 'no'});
        }
    })
    .catch(err => {
        res.json({message: 'error'});
    });
}

// Invite people
exports.getinvite = (req, res) => {
    if( !req.body.user_id ) {
        res.status(400).send({
            message: "User doesn't exist"
        });
        return;
    }

    Invites.findAll({
        where: {
            user_id: req.body.user_id
        }
    })
    .then(data => {
        res.json({data: data});
    })
    .catch(err => {
        res.json({message: 'error'});
    })
}

exports.addinvite = (req, res) => {
    if( !req.body.user_id ) {
        res.status(400).send({
            message: "User doesn't exist"
        });
        return;
    }

    Users.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(data => {
        var selUser = null;
        var username = '';
        
        if( selUser ) {
            selUser = data.toJSON();
            username = selUser.username;
        } else {
            username = req.body.email.charAt(0);
        }
        var bgColor = backColor[Math.floor(Math.random() * 7)];
        var userIcon = 'https://eu.ui-avatars.com/api?name=' + username + '&size=40&background=e2fcee&color=00ab53&rounded=false';

        if( selUser && selUser.usericon != '' && selUser.usericon != null ) 
            userIcon = '/uploads/' + selUser.usericon;
        try {
            Invites.create({
                user_id: req.body.user_id,
                email: req.body.email,
                username: username,
                usericon: userIcon,
                issent: true,
            })
            .then(result => {
                var createdData = result.toJSON();

                res.json({data: createdData});
                    
                // send mail
                sendingMail(welcomeEmailSource, 
                    {inviter: req.session.userData.username, meetingLink: 'https://joinshuffle.io/' + req.session.userData.roomname},
                    "Invite",req.body.email);
            })
            .catch(err => {
                res.json({message: 'error'});
            });
        } catch (err) {
            res.json({message: 'error'});
        };
    })
    .catch(err => {
        res.json({message: 'error'});
    });
}

exports.removeinvite = (req, res) => {
    if( !req.body.id ) {
        res.status(400).send({
            message: "User doesn't exist"
        });
        return;
    }
    Invites.destroy({
        where: {
            id: req.body.id
        }
    })
    .then(data => {
        res.json({message:'success'});
    })
    .catch(err => {
        res.json({message: 'error'});
    });
}

// download record
exports.downloadrecord = (req, res) => {
    if( !req.body.filename ) {
        res.status(400).send({
            message: "File doesn't exist"
        });
        return;
    }

    // const fname = req.body.filename;
    // const downloadLink = window.location.host + '/uploads/' + fname;
    // https.get(downloadLink, (res) => {
    //     const pth = fname;
    //     const writeStream = fs.createWriteStream(pth);
    //     res.pipe(writeStream);

    //     writeStream.on('finish', () => {
    //         writeStream.close();
    //         console.log('download complete');
    //     })
    // });
};

// Recording
exports.getrecords = (req, res) => {
    if( !req.body.user_id ) {
        res.status(400).send({
            message: "User doesn't exist"
        });
        return;
    }

    Records.findAll({
        where: {
            user_id: req.body.user_id
        }
    })
    .then(data => {
        res.json({data: data});
    })
    .catch(err => {
        res.json({message: 'error'});
    })
}

exports.addrecord = (req, res) => {
    if( !req.body.user_id ) {
        res.status(400).send({
            message: "User doesn't exist"
        });
        return;
    }

    Records.create({
        user_id: req.body.user_id,
        description: req.body.description,
        filename: req.body.filename,
        filesize: req.body.filesize,
    })
    .then(result => {
        var createdData = result.toJSON();

        res.json({data: createdData});
    })
    .catch(err => {
        res.json({message: 'error'});
    });
}

exports.removerecord = (req, res) => {
    if( !req.body.id ) {
        res.status(400).send({
            message: "Recording data doesn't exist"
        });
        return;
    }
    Records.destroy({
        where: {
            id: req.body.id
        }
    })
    .then(data => {
        res.json({message:'success'});
    })
    .catch(err => {
        res.json({message: 'error'});
    });
}

// Check join room
exports.joinroom = (req, res) => {
    const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1);
    var roomName = getLastItem(req.url);
    if( roomName != 'fav.png') {
        Users.findOne({
            where: {
                roomname: roomName,
            }
        })
        .then(data => {
            if( data ) {
                var tmpData = data.toJSON();
                if( tmpData.isopened == false )
                    res.redirect('/');
                else {
                    var roomLogo = '/images/logo_white.svg';
                    if( tmpData.roomlogo != '' )
                        roomLogo = '/uploads/' + tmpData.roomlogo;
                    // tmpData.locked
                    if( req.session.userData != null ) {
                        if( req.session.userData.roomname == roomName ) {
                            res.render('client.pug', {
                                userid: req.session.userData.id,
                                meetingname: roomName,
                                userinfo:req.session.userData.username, 
                                plantype: req.session.userData.plantype,
                                isCreator:roomName, 
                                isLocked:tmpData.islocked,
                                usericon:req.session.userData.usericon,
                                roomlogo:roomLogo,
                            });
                        } else {
                            res.render('client.pug', {
                                userid: req.session.userData.id,
                                userinfo:req.session.userData.username, 
                                isCreator:'', 
                                plantype: '',
                                meetingname: roomName,
                                isLocked:tmpData.islocked,
                                roomlogo:roomLogo,
                                usericon:req.session.userData.usericon,
                            });
                        }
                    } else {
                        res.render('client.pug', {userid:'', roomlogo:roomLogo, meetingname: roomName, plantype:'', userinfo:'', isCreator:'', isLocked:tmpData.islocked, usericon:''});
                    }
                }
            } else {
                res.redirect('/');
            }
        })
        .catch(err => {
            res.redirect('/');
        });
    } else {
        res.render('client.pug', {userid:'', userinfo:'', plantype:'', usericon:'', meetingname: roomName, roomlogo:'/images/logo_white.svg'});
    }
}

// Check if exist user
exports.checkuser = (req, res) => {
    Users.findOne({
        where: {
            email: req.body.userEmail,
            password: generateMD5(req.body.userPass),
        }
    })
    .then(data => {
        if( data ) {
            res.json({message: 'yes'});
        } else {
            res.json({message: 'no'});
        }
    })
    .catch(err => {
        res.json({message: 'no'});
    });
}

// Login
exports.login = (req, res) => {
    var passHash = generateMD5(req.body.password);
    Users.findOne({
        where: {
            email: req.body.email,
            password: passHash,
        }
    })
    .then(data => {
        console.log(data);
        if( data ) {
            req.session.userData = data.toJSON();
            var bgColor = backColor[Math.floor(Math.random() * 7)];
            var userIcon = 'https://eu.ui-avatars.com/api?name=' + req.session.userData.username + '&size=140&background=e2fcee&color=00ab53&rounded=false';

            if( req.session.userData.usericon == '' || req.session.userData.usericon == null )
                req.session.userData.usericon = userIcon;
            else 
                req.session.userData.usericon = '/uploads/' + req.session.userData.usericon;

            if( req.session.userData.roomlogo == '' || req.session.userData.roomlogo == null )
                req.session.userData.roomlogo = '/images/logo_white.svg';
            else
                req.session.userData.roomlogo = '/uploads/' + req.session.userData.roomlogo;
            
            res.cookie('curuserinfo', req.session.userData);
            req.session.save();
            if( req.body.callbackRoom == '' )
                res.redirect('/');
            else
                res.redirect('/' + req.body.callbackRoom);
        } else {
            res.status(400).send({
                message: "Login error"
            });
            return;
        }
    })
}