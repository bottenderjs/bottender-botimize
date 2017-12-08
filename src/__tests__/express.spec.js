import botimizeMiddleware from '../express';

jest.mock('botimize');
jest.mock('../setInterceptors');

const _botimize = require('botimize');

const setInterceptors = require('../setInterceptors').default;

const setup = accessToken => ({ connector: { client: { accessToken } } });

const accessToken = '<ACCESS_TOKEN>';
const apiKey = '<API_KEY>';
const platform = 'Facebook';

describe('botimizeMiddleware', () => {
  beforeEach(() => {
    _botimize.mockReturnValue({
      logIncoming: jest.fn(),
    });
  });

  it('should exist', () => {
    expect(botimizeMiddleware).toBeDefined();
  });

  it('should call setInterceptors', () => {
    const bot = setup(accessToken);
    const botimize = _botimize(apiKey, platform);

    botimizeMiddleware(bot, { apiKey, platform });

    expect(_botimize).toBeCalledWith(apiKey, platform);
    expect(setInterceptors).toBeCalledWith(bot, botimize);
  });

  it('should call botimize.logIncoming and next', () => {
    const bot = setup(accessToken);
    const botimize = _botimize(apiKey, platform);

    const middleware = botimizeMiddleware(bot, { apiKey, platform });

    const req = { body: { foo: 'bar' } };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(botimize.logIncoming).toBeCalledWith({
      foo: 'bar',
      accessToken,
    });
    expect(next).toBeCalled();
  });
});
