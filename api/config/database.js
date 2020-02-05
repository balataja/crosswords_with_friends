module.exports = () => {
  // Default to dev presets
  const dbConfig = {
    url: 'mongodb://localhost:27017/crosswordsDb',
    opts: {
      useMongoClient: true,
      autoReconnect: true,
      keepAlive: 300000,
    },
  };

  switch (process.env.NODE_ENV) {
    case 'production':
      Object.assign(dbConfig, { url: process.env.MONGODB_URI || 'mongodb://localhost:27017/crosswordDb' });
      break;
    case 'stage':
      break;
    case 'test':
      Object.assign(dbConfig, { url: 'mongodb://localhost:27017/crosswordDb' });
      break;
    case 'dev':
    default:
      break;
  }

  return dbConfig;
};
