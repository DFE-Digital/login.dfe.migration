'use strict';

const isLoggedIn = (req, res, next) => {
  if (req.session.invitation) {
    req.user = req.session.invitation;
    return next();
  }
  return res.status(302).redirect('/');
  // if(req.isAuthenticated()) {
  //   return next();
  // }
  // req.session.redirectUrl = req.originalUrl;
  // return res.status(302).redirect(`/auth`);
};

const getUserEmail = (user) => {
  return user.email || '';
};

const getUserDisplayName = (user) => {
  return `${user.given_name || ''} ${user.family_name || ''}`.trim();
};


const setUserContext = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
    res.locals.displayName = getUserDisplayName(req.user);
  }
  next();
};

module.exports = { isLoggedIn, getUserEmail, getUserDisplayName, setUserContext };