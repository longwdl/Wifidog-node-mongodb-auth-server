'use strict';

module.exports = {
  ip: process.env.WIFIDOG_SELF_HOST || '0.0.0.0',
  port: process.env.WIFIDOG_SELF_PORT || 3000,
  mongo: {
    host: process.env.WIFIDOG_MONGO_HOST || 'localhost',
    name: process.env.WIFIDOG_MONGO_NAME || 'wifidog',
  },
  redis: {
    host: process.env.WIFIDOG_REDIS_HOST || 'localhost',
    port: process.env.WIFIDOG_REDIS_PORT || 6379,
  },
  alsms: {
    code: process.env.WIFIDOG_ALSMS_CODE || 'SMS_012345678',
    akey: process.env.WIFIDOG_ALSMS_AKEY || 'xxx',
    skey: process.env.WIFIDOG_ALSMS_SKEY || 'yyy',
    sign: process.env.WIFIDOG_ALSMS_SIGN || 'NRadio',
  },
  seedDB: false,
};
