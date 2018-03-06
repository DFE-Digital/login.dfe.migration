jest.mock('./../../../src/infrastructure/devices', () => {
  return {
    syncDigipassToken: jest.fn().mockReturnValue('poop'),
  };
});

jest.mock('./../../../src/infrastructure/logger', () => {
  return {
    audit: jest.fn()
  }
});

const httpMocks = require('node-mocks-http');
const validateToken = require('./../../../src/app/easToken/validateToken');

describe('When validating eas tokens submitted by user', () => {
  let req;
  let res;
  let devices;

  beforeEach(() => {
    req = {
      csrfToken: () => ('token'),
      params: {
        id: '123-456-789-000',
      },
      body: {
        code1: '12345678',
        code2: '12345679',
      },
      session: {
        invitation: {
          id: '123-456-789-000',
          firstName: 'Frank',
          lastName: 'Castle',
          email: 'the.punisher@army.test',
          tokenSerialNumber: '123312423',
        }
      },
    };

    res = httpMocks.createResponse();

    devices = require('./../../../src/infrastructure/devices');
    devices.syncDigipassToken.mockReset();
    devices.syncDigipassToken.mockReturnValue(true);
  });

  it('then it should render view with error if code 1 missing', async () => {
    req.body.code1 = undefined;

    await validateToken(req, res);

    expect(res._isEndCalled()).toBe(true);
    expect(res._getRenderView()).toBe('easToken/views/easToken');
    expect(res._getRenderData()).toMatchObject({
      validationMessages: {
        code1: 'You must provide first code',
      },
    });
  });

  it('then it should render view with error if code 1 is not a number', async () => {
    req.body.code1 = 'abcdefgh';

    await validateToken(req, res);

    expect(res._isEndCalled()).toBe(true);
    expect(res._getRenderView()).toBe('easToken/views/easToken');
    expect(res._getRenderData()).toMatchObject({
      validationMessages: {
        code1: 'first code must be a number',
      },
    });
  });

  it('then it should render view with error if code 1 is not 8 digits long', async () => {
    req.body.code1 = '1234567';

    await validateToken(req, res);

    expect(res._isEndCalled()).toBe(true);
    expect(res._getRenderView()).toBe('easToken/views/easToken');
    expect(res._getRenderData()).toMatchObject({
      validationMessages: {
        code1: 'first code must be 8 digits long',
      },
    });
  });

  it('then it should render view with error if code 2 missing', async () => {
    req.body.code2 = undefined;

    await validateToken(req, res);

    expect(res._isEndCalled()).toBe(true);
    expect(res._getRenderView()).toBe('easToken/views/easToken');
    expect(res._getRenderData()).toMatchObject({
      validationMessages: {
        code2: 'You must provide second code',
      },
    });
  });

  it('then it should render view with error if code 2 is not a number', async () => {
    req.body.code2 = 'abcdefgh';

    await validateToken(req, res);

    expect(res._isEndCalled()).toBe(true);
    expect(res._getRenderView()).toBe('easToken/views/easToken');
    expect(res._getRenderData()).toMatchObject({
      validationMessages: {
        code2: 'second code must be a number',
      },
    });
  });

  it('then it should render view with error if code 2 is not 8 digits long', async () => {
    req.body.code2 = '1234567';

    await validateToken(req, res);

    expect(res._isEndCalled()).toBe(true);
    expect(res._getRenderView()).toBe('easToken/views/easToken');
    expect(res._getRenderData()).toMatchObject({
      validationMessages: {
        code2: 'second code must be 8 digits long',
      },
    });
  });

  it('then it should attempt to sync token using serial number in invitation and codes entered by user', async () => {
    await validateToken(req, res);

    expect(devices.syncDigipassToken.mock.calls.length).toBe(1);
    expect(devices.syncDigipassToken.mock.calls[0][0]).toBe('123312423');
    expect(devices.syncDigipassToken.mock.calls[0][1]).toBe('12345678');
    expect(devices.syncDigipassToken.mock.calls[0][2]).toBe('12345679');
  });

  it('then it should render view with error if device sync fails', async () => {
    devices.syncDigipassToken.mockReturnValue(false);

    await validateToken(req, res);

    expect(res._isEndCalled()).toBe(true);
    expect(res._getRenderView()).toBe('easToken/views/easToken');
    expect(res._getRenderData()).toMatchObject({
      validationFailed: true,
      validationMessages: {
        code1: '',
        code2: '',
      },
    });
  });

  it('then it update session with token syncd', async () => {
    await validateToken(req, res);

    expect(req.session.invitation).toMatchObject({
      tokenSyncd: true,
    });
  });

  it('then it should redirect to my-details', async () => {
    await validateToken(req, res);

    expect(res._getRedirectUrl()).toBe('../my-details');
  });
});
