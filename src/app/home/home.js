'use strict';

const home = async (req, res) => {
  res.render('home/views/home', {
    title: 'Access DfE services',
    id: req.params.id,
  });
};

module.exports = home;
