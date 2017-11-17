'use strict';

jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('./../../../src/infrastructure/config', () => {

    return {
      directories: {
        directoryId: 'directory1',
        service: {
          url: 'http://unit.test.local',
        }
      },
    };

});

describe('When using the user invitation service', () => {
  describe('and retrieving invitation information', () =>{
    let Directories;
    let getBearerToken;
    let rp;

    beforeEach(() => {
      getBearerToken = jest.fn().mockReturnValue('token');
      const jwtStrategy = require('login.dfe.jwt-strategies');
      jwtStrategy.mockImplementation(() => {
        return {
          getBearerToken: getBearerToken
        };
      });

      rp = jest.fn();
      const requestPromise = require('request-promise');
      requestPromise.mockImplementation(rp);

      Directories = require('./../../../src/infrastructure/Invitations/DirectoriesApiInvitations');
    });
    it('then the invitation is retrieved using the id', async () => {
      const id = 'EDC345RFV';

      await Directories.getById(id);

      expect(rp.mock.calls.length).toBe(1);
      expect(rp.mock.calls[0][0].method).toBe('GET');
      expect(rp.mock.calls[0][0].uri).toBe(`http://unit.test.local/invitations/${id}`);
    });
    it('then the auth token is applied', async () => {
      await Directories.getById('EDC345RFV');

      expect(rp.mock.calls.length).toBe(1);
      expect(rp.mock.calls[0][0].headers.authorization).toBe('bearer token');
    });
    it('then it should return the invitation if found', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          firstName: 'User',
          lastName: 'One',
        },
      );

      const actual = await Directories.getById('EDC345RFV');

      expect(actual.id).toBe('invitation1');
      expect(actual.firstName).toBe('User');
      expect(actual.lastName).toBe('One');
    });
    it('then it should return null when the invitations is not found', async () => {
      rp.mockImplementation(() => {
        const error = new Error('Not found');
        error.statusCode = 404;
        throw error;
      });

      const actual = await Directories.getById('EDC345RFV');

      expect(actual).toBeNull();
    });
  });
  describe('and validating invitation information', () => {
    let Directories;
    let getBearerToken;
    let rp;

    const id = 'EDC345RFV';
    const username = 'user1';
    const password = 'my-Password';

    beforeEach(() => {
      getBearerToken = jest.fn().mockReturnValue('token');
      const jwtStrategy = require('login.dfe.jwt-strategies');
      jwtStrategy.mockImplementation(() => {
        return {
          getBearerToken: getBearerToken
        };
      });

      rp = jest.fn();
      const requestPromise = require('request-promise');
      requestPromise.mockImplementation(rp);

      Directories = require('./../../../src/infrastructure/Invitations/DirectoriesApiInvitations');
    });
    it('then the invitation is retrieved using the id', async () => {
      const invitationId = 'EDC345RFV';

      await Directories.validateOsaCredentials(id, '', '');

      expect(rp.mock.calls.length).toBe(1);
      expect(rp.mock.calls[0][0].method).toBe('GET');
      expect(rp.mock.calls[0][0].uri).toBe(`http://unit.test.local/invitations/${invitationId}`);
    });
    it('then if the record is not found false is returned', async () => {
      rp.mockImplementation(() => {
        const error = new Error('Not found');
        error.statusCode = 404;
        throw error;
      });

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(actual).toBe(false);
    });
    it('then if the username is not part of the response then false is returned', async () => {

      rp.mockReturnValue(
        {
          id: 'invitation1',
          username: '',
          password: 'my-Password',
          salt: 'saltVal'
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls.length).toBe(1);
      expect(actual).toBe(false);
    });
    it('then if the password is not part of the response then false is returned', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          username: 'user1',
          password: '',
          salt: 'saltVal'
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls.length).toBe(1);
      expect(actual).toBe(false);
    });
    it('then if the salt is not part of the response then false is returned', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          username: 'user1',
          password: 'my-Password',
          salt: ''
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls.length).toBe(1);
      expect(actual).toBe(false);
    });
    it('then the username and password are checked against the invitation record and false returned if they dont match', async () => {

      rp.mockReturnValue(
        {
          id: 'invitation1',
          username: 'user1',
          password: 'my-Password',
          salt: '1234567'
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls.length).toBe(1);
      expect(actual).toBe(false);
    });
    it('then true is returned if the username and password match', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          username: 'user1',
          password: 'my-Password',
          salt: '1234567'
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls.length).toBe(1);
      expect(actual).toBe(true);
    });
  });
});