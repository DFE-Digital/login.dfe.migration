jest.mock('./../../../src/infrastructure/organisations', () => {
  const services = [
    {
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
    },
    {
      invitationId: '8226a3d1-823a-4e52-83b3-6e6a117cef0f',
      role: {
        id: 0,
        name: 'End user'
      },
      service: {
        id: 'svc2',
        name: 'Service 2',
      },
      organisation: {
        id: 'org1',
        name: 'Organisation 1',
      },
    }
  ];
  return {
    getServicesForInvitation: jest.fn().mockReturnValue(services)
  }
});

const httpMocks = require('node-mocks-http');
const getDetails = require('./../../../src/app/userDetails/getDetails');

describe('when getting user details view', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        id: '8226a3d1-823a-4e52-83b3-6e6a117cef0f',
        firstName: 'User',
        lastName: 'One',
        email: 'user.one@unit.tests',
      },
    };

    res = httpMocks.createResponse();
  });

  it('then it should get services for invitationId', async () => {
    await getDetails(req, res);

    const orgs = require('./../../../src/infrastructure/organisations');
    expect(orgs.getServicesForInvitation.mock.calls.length).toBe(1);
    expect(orgs.getServicesForInvitation.mock.calls[0][0]).toBe(req.user.id);
  });

  it('then it should return a success result', async () => {
    await getDetails(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBe(true);
  });

  it('then it should render the viewDetails view', async () => {
    await getDetails(req, res);

    expect(res._getRenderView()).toBe('userDetails/views/viewDetails');
  });

  it('then it should render the logged in user details in the model', async () => {
    await getDetails(req, res);

    expect(res._getRenderData()).toMatchObject({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    })
  });

  it('then it should render the first services organisation in the model', async () => {
    await getDetails(req, res);

    expect(res._getRenderData()).toMatchObject({
      organisation: {
        name: 'Organisation 1',
      }
    });
  });
});
