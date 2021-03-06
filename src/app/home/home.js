'use strict';

const invitations = require('./../../infrastructure/Invitations');

const home = async (req, res) => {
  const invitation = await invitations.getById(req.params.id);
  if (!invitation) {
    return res.status(404).send();
  }

  if (invitation.isCompleted) {
    return res.redirect(`/${req.params.id}/migration-complete`);
  }

  const emailAlreadyInUse = await invitations.checkIfEmailAlreadyInUse(invitation.email);
  if (emailAlreadyInUse) {
    return res.redirect(`/${req.params.id}/email-in-use`);
  }

  if (invitation.source === 'support') {
    return res.redirect(`/enter-code/${req.params.id}`);
  }

  let viewName = 'home/views/home';
  if (invitation.oldCredentials && invitation.oldCredentials.source === 'EAS') {
    viewName = 'home/views/home-eas';
  }
  return res.render(viewName, {
    title: 'DfE Sign-in',
    id: req.params.id,
  });
};

module.exports = home;
