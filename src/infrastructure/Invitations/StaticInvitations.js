const getById = async id => ({
  id,
  firstName: 'Test',
  lastName: 'Tester',
});

const validateOsaCredentials = async (id, username, password) => {
  if (username.toLowerCase() === 'foo@example.com' && password === 'Password1') {
    return Promise.resolve(
      {
        id: '12345',
        firstName: 'Test',
        lastName: 'Tester',
        email: 'test@test.com',
      });
  }
  return Promise.resolve(null);
};

const createUser = async () => Promise.resolve();
const checkIfEmailAlreadyInUse = async () => Promise.resolve(false);
const markInvitationAsComplete = async () => Promise.resolve(false);
const createUserDevice = async () => Promise.resolve(false);

module.exports = {
  getById,
  validateOsaCredentials,
  createUser,
  checkIfEmailAlreadyInUse,
  markInvitationAsComplete,
  createUserDevice,
};
