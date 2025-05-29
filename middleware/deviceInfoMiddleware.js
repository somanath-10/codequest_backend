import UAParser from 'ua-parser-js';

export const extractDeviceInfo = (req, res, next) => {
  const parser = new UAParser(req.headers['user-agent']);
  const ua = parser.getResult();

  req.deviceInfo = {
    browser: ua.browser.name,
    os: ua.os.name,
    deviceType: ua.device.type || 'desktop',
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  };

  next();
};
