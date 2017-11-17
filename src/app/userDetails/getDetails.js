const { getServicesForInvitation } = require('./../../infrastructure/organisations');

const action = async (req, res) => {
  const services = await getServicesForInvitation(req.user.id);
  const org = services[0].organisation;

  const user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    organisation: {
      name: org.name
    }
  };

  res.render('userDetails/views/viewDetails', user);
};

module.exports = action;