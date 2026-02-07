export default () => ({
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    pretty: process.env.NODE_ENV === 'development',
    redact: ['password', 'token', 'secret', 'authorization', 'cookie'],
    serializers: {
      req: (req: any) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        headers: {
          host: req.headers.host,
          'user-agent': req.headers['user-agent'],
        },
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
      }),
      err: (err: any) => ({
        type: err.constructor.name,
        message: err.message,
        stack: err.stack,
      }),
    },
  },
  newRelic: {
    enabled: process.env.NEW_RELIC_ENABLED === 'true',
    licenseKey: process.env.NEW_RELIC_LICENSE_KEY || '',
    appName: process.env.NEW_RELIC_APP_NAME || 'MyMindOS-Backend',
    distributedTracing: {
      enabled: true,
    },
    logging: {
      level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
    },
  },
});
