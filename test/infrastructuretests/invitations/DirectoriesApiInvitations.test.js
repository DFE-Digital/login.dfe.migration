'use strict';

jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('./../../../src/infrastructure/config', () => ({
  directories: {
    directoryId: 'directory1',
    service: {
      url: 'http://unit.test.local',
    },
  },
}));
let rp;
rp = jest.fn();
const requestPromise = require('request-promise');
requestPromise.defaults.mockReturnValue(rp);

describe('When using the user invitation service', () => {
  describe('and retrieving invitation information', () => {
    let Directories;
    let getBearerToken;


    beforeEach(() => {
      getBearerToken = jest.fn().mockReturnValue('token');
      const jwtStrategy = require('login.dfe.jwt-strategies');
      jwtStrategy.mockImplementation(() => ({
        getBearerToken,
      }));



      Directories = require('./../../../src/infrastructure/Invitations/DirectoriesApiInvitations');
    });
    it('then the invitation is retrieved using the id', async () => {
      const id = 'EDC345RFV';

      await Directories.getById(id);

      expect(rp.mock.calls).toHaveLength(1);
      expect(rp.mock.calls[0][0].method).toBe('GET');
      expect(rp.mock.calls[0][0].uri).toBe(`http://unit.test.local/invitations/${id}`);
    });
    it('then the auth token is applied', async () => {
      await Directories.getById('EDC345RFV');

      expect(rp.mock.calls).toHaveLength(1);
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


    const id = 'EDC345RFV';
    const username = 'user1';
    const password = 'my-Password';

    beforeEach(() => {
      getBearerToken = jest.fn().mockReturnValue('token');
      const jwtStrategy = require('login.dfe.jwt-strategies');
      jwtStrategy.mockImplementation(() => ({
        getBearerToken,
      }));

      // rp = jest.fn();
      // const requestPromise = require('request-promise');
      // requestPromise.mockImplementation(rp);

      Directories = require('./../../../src/infrastructure/Invitations/DirectoriesApiInvitations');
    });
    it('then the invitation is retrieved using the id', async () => {
      const invitationId = 'EDC345RFV';

      await Directories.validateOsaCredentials(id, '', '');

      expect(rp.mock.calls).toHaveLength(1);
      expect(rp.mock.calls[0][0].method).toBe('GET');
      expect(rp.mock.calls[0][0].uri).toBe(`http://unit.test.local/invitations/${invitationId}`);
    });
    it('then if the record is not found null is returned', async () => {
      rp.mockImplementation(() => {
        const error = new Error('Not found');
        error.statusCode = 404;
        throw error;
      });

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(actual).toBeNull();
    });
    it('then if the username is not part of the response then null is returned', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          username: '',
          password: 'my-Password',
          salt: 'saltVal',
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls).toHaveLength(1);
      expect(actual).toBeNull();
    });
    it('then if the password is not part of the response then null is returned', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          username: 'user1',
          password: '',
          salt: 'saltVal',
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls).toHaveLength(1);
      expect(actual).toBeNull();
    });
    it('then if the salt is not part of the response then null is returned', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          username: 'user1',
          password: 'my-Password',
          salt: '',
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls).toHaveLength(1);
      expect(actual).toBeNull();
    });
    it('then the username and password are checked against the invitation record and null is returned if they dont match', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          oldCredentials: {
            username: 'user1',
            password: 'my-Password',
            salt: '1234567',
          },
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls).toHaveLength(1);
      expect(actual).toBeNull();
    });
    it('then true is returned if the username and password match', async () => {
      rp.mockReturnValue(
        {
          id: 'invitation1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@user.com',
          oldCredentials: {
            salt: '1234567',
            password: '36f9bee6c0cb7443f0feb14b0a8e7347ffc1f7725c990613bc635d1133f138728a81ffca139ea7317ad3082f8609cd4760020313c84494262773a128afb00478',
            username: 'USER1',
          },
        },
      );

      const actual = await Directories.validateOsaCredentials(id, username, password);

      expect(rp.mock.calls).toHaveLength(1);
      expect(actual).not.toBeNull();
      expect(actual.firstName).toBe('Test');
      expect(actual.lastName).toBe('User');
      expect(actual.email).toBe('test@user.com');
      expect(actual.oldCredentials).toBe(undefined);
    });
  });
  describe('and creating the device link', () => {
    let Directories;
    let getBearerToken;

    const userId = '123abc456';
    const serialNumber = '986TGB123';
    const correlationId = 'my-id-123';

    beforeEach(() => {
      getBearerToken = jest.fn().mockReturnValue('token');
      const jwtStrategy = require('login.dfe.jwt-strategies');
      jwtStrategy.mockImplementation(() => ({
        getBearerToken,
      }));



      Directories = require('./../../../src/infrastructure/Invitations/DirectoriesApiInvitations');
    });
    it('then the api is called with the correct parameters', async () => {
      await Directories.createUserDevice(userId, serialNumber);

      expect(rp.mock.calls).toHaveLength(1);
      expect(rp.mock.calls[0][0].method).toBe('POST');
      expect(rp.mock.calls[0][0].uri).toBe(`http://unit.test.local/users/${userId}/devices`);
      expect(rp.mock.calls[0][0].body).toMatchObject({
        type: 'digipass',
        serialNumber,
      });
    });
    it('then it should authorize the request', async () => {
      await Directories.createUserDevice(userId, serialNumber);

      expect(rp.mock.calls).toHaveLength(1);
      expect(rp.mock.calls[0][0].headers.authorization).toBe('bearer token');
    });
    it('then it should include the correlation id', async () => {
      await Directories.createUserDevice(userId, serialNumber, correlationId);

      expect(rp.mock.calls[0][0]).toMatchObject({
        headers: {
          'x-correlation-id': correlationId,
        },
      });
    });
  });
});
