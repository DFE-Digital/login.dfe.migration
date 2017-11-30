'use strict';

const invitations = require('./../../infrastructure/Invitations');

const home = async (req, res) => {
  const invitation = await invitations.getById(req.params.id);
  let viewName = 'home/views/home';
  if (invitation.oldCredentials.source === 'EAS') {
    viewName = 'home/views/home-eas';
  }
  res.render(viewName, {
    title: 'Access DfE services',
    id: req.params.id,
  });
};

module.exports = home;
