'use strict';

const invitations = require('./../../infrastructure/Invitations');

const home = async (req, res) => {
  const invitation = await invitations.getById(req.params.id);
  if (!invitation) {
    return res.status(404).send();
  }

  const emailAlreadyInUse = await invitations.checkIfEmailAlreadyInUse(invitation.email);
  if (emailAlreadyInUse) {
    return res.redirect(`/${req.params.id}/email-in-use`);
  }

  let viewName = 'home/views/home';
  if (invitation.oldCredentials.source === 'EAS') {
    viewName = 'home/views/home-eas';
  }
  return res.render(viewName, {
    title: 'Access DfE services',
    id: req.params.id,
  });
};

module.exports = home;
