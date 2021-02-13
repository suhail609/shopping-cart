var express = require('express');
var router = express.Router();
// var csrf = require('csurf');
// const passport = require('passport');
var Cart = require('../models/cart');

var Product = require('../models/product');

// var csrfProtection = csrf();
// router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs){
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

// router.get('/user/signup', function(req, res, next){
//   var messages = req.flash('error');
//   res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
// });

// router.post('/user/signup', passport.authenticate('local.signup', {
//   successRedirect: '/user/profile',
//   failureRedirect: '/user/signup',
//   failureFlash: true
// }));

// router.get('/user/profile', function(req, res, next){
//   res.render('user/profile');
// });

// router.get('/user/signin', function(req, res, next){
//   var messages = req.flash('error');
//   res.render('/user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
// });

// router.post('/user/signin', passport.authenticate('local.signin', {
//   successRedirect: '/user/profile',
//   failureRedirect: '/user/signin',
//   failureFlash: true
// }));

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shopping-cart', function(req, res, next){
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function(req, res, next){
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req, res, next) {

if (!req.session.cart) {
  return res.redirect('/shopping-cart');
}

var cart = new Cart(req.session.cart);

const stripe = require('stripe')('sk_test_51IJEOAIV7pbqZwfm8kxKaSFayxKDbLeUUOvwQB76rMvVonzUmZaWP135nxYuOQkD6O9mBJdcejIPWzJLYjuV3Fee00r6Nmrlgg');

// `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
stripe.charges.create({
  amount: cart.totalPrice * 100,
  currency: 'inr',
  source: req.body.stripeToken,
  description: 'My First Test Charge (created for API docs)',
},function(err, charge){
  if(err) {
    req.flash('error', err.message);
    return res.redirect('/checkout');
  }
  req.flash('success', 'Successfully bought product');
  req.session.cart = null;
  res.redirect('/');
});
});

module.exports = router;