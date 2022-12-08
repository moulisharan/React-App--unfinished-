module.exports = app => {  
  const usersCtrl = require("../controllers/users.controller.js");
  var router = require("express").Router();

  // create new user
  router.post("/signup", usersCtrl.create);

  // login user
  router.post("/signin", usersCtrl.login);

  // check if exist user
  router.post("/hasuser", usersCtrl.hasuser);

  // check if user can login
  router.post("/checkuser", usersCtrl.checkuser);

  // check if room name exist
  router.post("/checkroom", usersCtrl.checkroom);

  // update plan type
  router.post("/updateplan", usersCtrl.updateplan);

  // update room name
  router.post("/updateroom", usersCtrl.updateroom);

  // update meeting is opened
  router.post("/updateopen", usersCtrl.updateopen);

  // save profile
  router.post("/updateprofile", usersCtrl.updateprofile);

  // payment
  router.post("/updatepay", usersCtrl.updatepayment);

  // ajax upload photo
  app.post("/upload", usersCtrl.uploadphoto);

  // ajax upload video
  app.post("/uploadrecord", usersCtrl.uploadrecord);

  // download video file
  app.post("/downloadrecord", usersCtrl.downloadrecord);

  // invite member
  app.post("/getinvite", usersCtrl.getinvite);
  app.post("/addinvite", usersCtrl.addinvite);
  app.post("/removeinvite", usersCtrl.removeinvite);

  // recordings
  app.post("/getrecords", usersCtrl.getrecords);
  app.post("/addrecord", usersCtrl.addrecord);
  app.post("/removerecord", usersCtrl.removerecord);
  
  // payment
  app.post("/getcoupon", usersCtrl.getcoupon);
  app.post("/getpromotion", usersCtrl.getpromotion);

  // update room setting
  app.post("/roomsetting", usersCtrl.roomsetting);

  app.use("/api/auth", router);

  app.get("/logout", usersCtrl.logout);
  app.get("/login", usersCtrl.enterlogin);
  app.get("/register", usersCtrl.register);
  app.get("/profile", usersCtrl.profile);
  app.get("/roomsett", usersCtrl.roomset);
  app.get("/subscription", usersCtrl.subscription);
  app.get("/faq", usersCtrl.faq);
  app.get("/records", usersCtrl.records);
  app.get("/pricing", usersCtrl.pricing);
  app.get("/payment", usersCtrl.payment);

  app.get("/:roomname", usersCtrl.joinroom);
};