export default function setInterceptors(bot, botimize) {
  const { connector: { client: { accessToken, axios } } } = bot;

  // Add a response interceptor
  axios.interceptors.response.use(response => {
    const { config } = response;

    if (
      /graph\.facebook\.com.*\/me\/messages/.test(config.url) || // Messenger
      /api\.line\.me\/v2\/bot\/message/.test(config.url) || // LINE
      /api\.telegram\.org.*\/send/.test(config.url) // Telegram
    ) {
      botimize.logOutgoing(
        { ...JSON.parse(config.data), accessToken },
        { parse: 'pure' }
      );
    }

    return response;
  });
}
