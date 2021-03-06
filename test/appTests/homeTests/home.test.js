jest.mock('./../../../src/infrastructure/Invitations', () => ({
  getById: jest.fn(),
  checkIfEmailAlreadyInUse: jest.fn(),
}));

const httpMocks = require('node-mocks-http');
const home = require('./../../../src/app/home/home');

describe('when rendering a welcome message', () => {
  let req;
  let res;
  let invitations;

  beforeEach(() => {
    req = {
      params: {
        id: '123-456-789-000',
      },
    };

    res = httpMocks.createResponse();

    invitations = require('./../../../src/infrastructure/Invitations');
    invitations.checkIfEmailAlreadyInUse = jest.fn().mockReturnValue(false);
    invitations.getById = jest.fn().mockReturnValue({
      oldCredentials: {
        source: 'OSA',
      },
    });
  });

  it('then it should send success result', async () => {
    await home(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBe(true);
  });

  it('then it should render home/views/home for OSA invitations', async () => {
    await home(req, res);

    expect(res._getRenderView()).toBe('home/views/home');
  });

  it('then it should render home/views/home-eas for EAS invitations', async () => {
    invitations.getById.mockReturnValue({
      oldCredentials: {
        source: 'EAS',
      },
    });

    await home(req, res);

    expect(res._getRenderView()).toBe('home/views/home-eas');
  });

  it('then it should render home/views/home-eas for EAS invitations', async () => {
    invitations.getById.mockReturnValue({
      oldCredentials: {
        source: 'EAS',
      },
    });

    await home(req, res);

    expect(res._getRenderView()).toBe('home/views/home-eas');
  });

  it('then it should redirect to auth for support invitations', async () => {
    invitations.getById.mockReturnValue({
      source: 'support',
    });

    await home(req, res);

    expect(res._getRedirectUrl()).toBe('/enter-code/123-456-789-000');
  });

  it('then it include title and invitation id in model', async () => {
    await home(req, res);

    expect(res._getRenderData()).toMatchObject({
      title: 'DfE Sign-in',
      id: req.params.id,
    });
  });

  it('then it should return 404 if invitation not found', async () => {
    invitations.getById.mockReturnValue(null);

    await home(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBe(true);
  });

  it('then it should redirect to email-in-use if user with same email already exists', async () => {
    invitations.checkIfEmailAlreadyInUse.mockReturnValue(true);

    await home(req, res);

    expect(res._getRedirectUrl()).toBe('/123-456-789-000/email-in-use');
    expect(res._isEndCalled()).toBe(true);
  });

  it('then it should redirect to migration-complete if invitation is completed', async () => {
    invitations.getById.mockReturnValue({
      oldCredentials: {
        source: 'OSA',
      },
      isCompleted: true,
    });

    await home(req, res);

    expect(res._getRedirectUrl()).toBe('/123-456-789-000/migration-complete');
    expect(res._isEndCalled()).toBe(true);
  });
});
