const action = (req, res) => {
  res.render('easToken/views/easToken', {
    title: 'Enter your Digipass codes',
    csrfToken: req.csrfToken(),
    id: req.params.id,
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;