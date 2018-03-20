jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getBearerToken: jest.fn().mockReturnValue('token'),
    };
  });
});
jest.mock('./../../../src/infrastructure/config', () => {
  return {
    organisations: {
      service: {
        url: 'https://orgs.test',
      },
    },
  };
});


const rp = jest.fn();
const requestPromise = require('request-promise');
requestPromise.defaults.mockReturnValue(rp);

const services = [{
  invitationId: '8226a3d1-823a-4e52-83b3-6e6a117cef0f',
  role: {
    id: 0,
    name: 'End user'
  },
  service: {
    id: 'svc1',
    name: 'Service 1',
  },
  organisation: {
    id: 'org1',
    name: 'Organisation 1',
  },
}];

const { getServicesForInvitation } = require('./../../../src/infrastructure/organisations/organisationsApi');

describe('when getting invitation service mapping from api', () => {

  beforeEach(() => {
    rp.mockImplementation(() => {
      return services;
    });
  });

  it('then it should get services using correct uri', async () => {
    await getServicesForInvitation('inv1');

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe('https://orgs.test/invitations/inv1');
  });

  it('then it should get services using token for auth', async () => {
    await getServicesForInvitation('inv1');

    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  });

  it('then it should return the response from the service', async () => {
    const actual = await getServicesForInvitation('inv1');

    expect(actual).toBe(services);
  });

  it('then it should return null if invitation not found', async() => {
    rp.mockImplementation(() => {
      const error = new Error('not found');
      error.statusCode = 404;
      throw error;
    });

    const actual = await getServicesForInvitation('inv1');

    expect(actual).toBeNull();
  })
});