// utils/deviceInfo.js
import UAParser from 'ua-parser-js';

export const getDeviceInfo = (req) => {
  const parser = new UAParser(req.headers['user-agent']);
  const result = parser.getResult();

  const browser = result.browser.name;
  const os = result.os.name;
  const deviceType = result.device.type || 'desktop';
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  return { browser, os, deviceType, ip };
};
