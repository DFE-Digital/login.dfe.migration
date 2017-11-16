'use strict';

jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('./../../../src/infrastructure/config', () => {
  return () => {
    return {
      directories: {
        directoryId: 'directory1',
        service: {
          url: 'http://unit.test.local',
        }
      },
    };
  };
});

describe('When using the user invitation service', () => {
  let Account;
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

    Account = require('./../../../src/infrastructure/Invitations/DirectoriesApiInvitations');
  });
  it('then the invitation is retrieved using the id', async () => {
    const id = 'EDC345RFV';

    await Account.getById(id);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe(`http://unit.test.local/invitations/${id}`);
  });
  it('then the auth token is applied', async () => {
    await Account.getById('EDC345RFV');

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

    const actual = await Account.getById('EDC345RFV');

    expect(actual.id).toBe('invitation1');
    expect(actual.firstName).toBe('User');
    expect(actual.lastName).toBe('One');
  });

  it('then it should return null when api not found', async () => {
    rp.mockImplementation(() => {
      const error = new Error('Not found');
      error.statusCode = 404;
      throw error;
    });

    const actual = await Account.getById('EDC345RFV');

    expect(actual).toBeNull();
  });
});