'use strict';

const invitations = require('./../../infrastructure/Invitations');

const home = async (req, res) => {
  const invitation = await invitations.getById(req.params.id);
  if (!invitation) {
    return res.status(404).send();
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
