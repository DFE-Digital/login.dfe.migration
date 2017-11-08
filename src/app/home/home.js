'use strict';

const home = async (req, res) => {
  res.render('home/views/home', {
    title: 'Access DfE services'
  });
};

module.exports = home;
