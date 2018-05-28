"use strict"
let Errors = require('../../error');
let Success = require('../../responses');
let User = require('../user/user.model');
let Client = require('../user/clients.model');
let crypt = require('crypto');
let config = require('../../config/environment');
let SERVICES = require('../../config/services');
let moment = require( 'moment' );
let md5 = require( 'blueimp-md5' );
let SMSClient = require('@alicloud/sms-sdk')
let smsClient = new SMSClient({
  accessKeyId: config.alsms.akey,
  secretAccessKey: config.alsms.skey,
})
let Promise = require("bluebird");
let redis = require('redis');
Promise.promisifyAll(redis);
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
let redis_cli = redis.createClient(config.redis.port, config.redis.host);
let codeverify = {};

function makeCode() {
  let text = "";
  let possible = "0123456789";

  for (let i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

codeverify.genCode = async function(req, res) {
  if (!req.body.phone) {
    return Success.errorResponse(res, {message: '手机号为空!'}, 200);
  }

  let phone = req.body.phone.toString();
  let code = makeCode();
  let data = {};

  let telreg = /^(13[0-9]|14[5-9]|15[0-9]|16[6]|17[0-8]|18[0-9]|19[8-9])\d{8}$/;
  if (!telreg.test(phone)) {
    return Success.errorResponse(res, {message: '手机号格式错误!'}, 200);
  }

  let tmp = await redis_cli.keysAsync(phone + ':*');

  if (tmp && tmp.length > 0) {
    return Success.errorResponse(res, {message: '系统忙，请稍后再试!'}, 200);
  }

  if (config.env === 'production') {
    let send = await smsClient.sendSMS({
      PhoneNumbers: phone,
      SignName: config.alsms.sign,
      TemplateCode: config.alsms.code,
      TemplateParam: '{"code": ' + code + '}',
    });

    if (send.Code != "OK") {
      console.log("Send sms error: ", send);
      return Success.errorResponse(res, {message: '短信发送错误，请稍后再试!'}, 200);
    }
  }
  else {
    console.log("Gen new code:", code)
  }

  data['md5'] = md5(code);
  redis_cli.set(phone + ':' + code, md5, 'EX', 300);

  return Success.successResponse(res, data);
}

codeverify.chkCode = async function(phone, code) {
  let tmp = await redis_cli.getAsync(phone + ':' + code);

  if (tmp)
    return true;
  else
    return false;
}

module.exports = codeverify;
