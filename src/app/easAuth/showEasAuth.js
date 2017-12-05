const action = (req, res) => {
  req.session.invitation = null;

  res.render('easAuth/views/easAuth', {
    title: 'Sign in to using EAS details',
    csrfToken: req.csrfToken(),
    id: req.params.id,
    validationFailed: false,
    validationMessages: {
      username: '',
      password: '',
    },
  });
};

module.exports = action;