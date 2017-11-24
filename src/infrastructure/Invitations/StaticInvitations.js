const Invitation = require('./Invitation');

class StaticInvitationsApi extends Invitation {
  static async getById(id) {
    return {
      id,
      firstName: 'Test',
      lastName: 'Tester',
    }
  }

  static async validateOsaCredentials(id, username, password) {
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
  }

  static async createUser() {
    return Promise.resolve();
  }
}

module.exports = StaticInvitationsApi;
