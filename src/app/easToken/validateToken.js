const { syncDigipassToken } = require('./../../infrastructure/devices');
const invitations = require('./../../infrastructure/Invitations');

const validate = (code1, code2) => {
  const messages = {
    code1: '',
    code2: '',
  };

  const codeValidation = (code, codeName) => {
    if (!code) {
      return `You must provide ${codeName} code`;
    }
    if (isNaN(parseInt(code))) {
      return `${codeName} code must be a number`;
    }
    if (code.length !== 8) {
      return `${codeName} code must be 8 digits long`;
    }
    return null;
  };

  messages.code1 = codeValidation(code1, 'first');
  messages.code2 = codeValidation(code2, 'second');

  const failed = messages.code1 || messages.code2;

  return {
    failed,
    messages,
  };
};

const action = async (req, res) => {
  const code1 = req.body.code1;
  const code2 = req.body.code2;
  const validationResult = validate(code1, code2);

  if (validationResult.failed) {
    return res.render('easToken/views/easToken', {
      title: 'Enter your Digipass codes',
      csrfToken: req.csrfToken(),
      id: req.params.id,
      validationFailed: false,
      validationMessages: validationResult.messages,
    });
  }

  const invitation = await invitations.getById(req.params.id);
  if (!invitation) {
    return res.status(404).send();
  }

  const syncResult = await syncDigipassToken(invitation.oldCredentials.tokenSerialNumber, parseInt(code1), parseInt(code2));
  if (!syncResult) {
    return res.render('easToken/views/easToken', {
      title: 'Enter your Digipass codes',
      csrfToken: req.csrfToken(),
      id: req.params.id,
      validationFailed: true,
      validationMessages: {
        code1: '',
        code2: '',
      },
    });
  }

  req.session.invitation = {
    id: invitation.id,
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    email: invitation.email,
  };
  return res.redirect('../my-details');
};

module.exports = action;