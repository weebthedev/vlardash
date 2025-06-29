const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', passport.authenticate('discord', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect(`${process.env.DASHBOARD_URL}/dashboard`);
});

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;
