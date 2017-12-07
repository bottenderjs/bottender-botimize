import _botimize from 'botimize';

import setInterceptors from './setInterceptors';

export default function botimizeMiddleware(bot, { apiKey, platform }) {
  const { connector: { client: { accessToken } } } = bot;
  const botimize = _botimize(apiKey, platform);

  setInterceptors(bot, botimize);

  return ({ request }, next) => {
    botimize.logIncoming({
      ...request.body,
      accessToken,
    });

    next();
  };
}
