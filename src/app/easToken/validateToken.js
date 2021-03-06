const { syncDigipassToken } = require('./../../infrastructure/devices');
const logger = require('./../../infrastructure/logger');

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

  const invitation = req.session.invitation;

  const syncResult = await syncDigipassToken(invitation.tokenSerialNumber, code1, code2);
  if (!syncResult) {
    logger.audit(`${invitation.email} (invitationid: ${invitation.id}) failed to resync token "${invitation.tokenSerialNumber}"`, {
      type: 'migration',
      subType: 'digipass-resync',
      success: false,
      invitationId: invitation.id,
      userEmail: invitation.email,
      deviceSerialNumber: invitation.tokenSerialNumber,
    });

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

  logger.audit(`${invitation.email} (invitationid: ${invitation.id}) did a token resync "${invitation.tokenSerialNumber}"`, {
    type: 'migration',
    subType: 'digipass-resync',
    success: true,
    invitationId: invitation.id,
    userEmail: invitation.email,
    deviceSerialNumber: invitation.tokenSerialNumber,
  });

  invitation.tokenSyncd = true;
  req.session.invitation = invitation;
  return res.redirect('../my-details');
};

module.exports = action;