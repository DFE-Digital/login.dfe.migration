class StaticInvitationsApi extends Invitation {
  static async getById(id) {
    return {
      id,
      firstName: 'Test',
      lastName: 'Tester'
    }
  }
  static async validateOsaCredentials(id, username, password){
    if(username.toLowerCase() === 'foo@example.com' && password === 'Password1'){
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}

module.exports = StaticInvitationsApi;
