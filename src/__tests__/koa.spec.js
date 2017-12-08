import botimizeMiddleware from '../koa';

jest.mock('botimize');
jest.mock('../setInterceptors');

const _botimize = require('botimize');

const setInterceptors = require('../setInterceptors').default;

const setup = accessToken => ({ connector: { client: { accessToken } } });

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
    const bot = setup('12345');
    const botimize = _botimize(apiKey, platform);

    botimizeMiddleware(bot, { apiKey, platform });

    expect(_botimize).toBeCalledWith(apiKey, platform);
    expect(setInterceptors).toBeCalledWith(bot, botimize);
  });

  it('should call botimize.logIncoming and next', () => {
    const bot = setup('12345');
    const botimize = _botimize(apiKey, platform);

    const middleware = botimizeMiddleware(bot, { apiKey, platform });

    const req = { request: { body: { foo: 'bar' } } };
    const next = jest.fn();

    middleware(req, next);

    expect(botimize.logIncoming).toBeCalledWith({
      foo: 'bar',
      accessToken: '12345',
    });
    expect(next).toBeCalled();
  });
});
