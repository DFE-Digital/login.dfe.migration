const action = (req, res) => {
  req.session.invitation = null;

  res.render('enterCode/views/enterCode', {
    title: 'Enter your verification code\n',
    csrfToken: req.csrfToken(),
    id: req.params.id,
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;