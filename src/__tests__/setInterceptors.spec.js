import setInterceptors from '../setInterceptors';

const setup = (accessToken, response) => ({
  connector: {
    client: {
      accessToken,
      axios: {
        interceptors: {
          response: {
            use: jest.fn(fn => fn(response)),
          },
        },
      },
    },
  },
});

const accessToken = '<ACCESS_TOKEN>';
const botimize = {
  logOutgoing: jest.fn(),
};

describe('setInterceptors', () => {
  it('should exist', () => {
    expect(setInterceptors).toBeDefined();
  });

  it('should not call botimize.logOutgoing when url is not matched', () => {
    const response = { config: { url: 'xxx.com' } };
    const bot = setup(accessToken, response);
    const { connector: { client: { axios } } } = bot;

    setInterceptors(bot, botimize);

    expect(axios.interceptors.response.use).toBeCalled();
    expect(botimize.logOutgoing).not.toBeCalled();
  });

  it('should call botimize.logOutgoing when url is matched', () => {
    const response = {
      config: {
        url: 'https://graph.facebook.com/me/messages',
        data: JSON.stringify({ foo: 'bar' }),
      },
    };
    const bot = setup(accessToken, response);
    const { connector: { client: { axios } } } = bot;

    setInterceptors(bot, botimize);

    expect(axios.interceptors.response.use).toBeCalled();
    expect(botimize.logOutgoing).toBeCalledWith(
      { foo: 'bar', accessToken },
      { parse: 'pure' }
    );
  });
});
