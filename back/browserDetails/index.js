const collectBrowserDetails = () => {
  return {
    accept_header: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    java_enabled: false,
    javascript_enabled: true,
    language: navigator.language || 'en-US',
    color_depth: screen.colorDepth || 24,
    screen_height: screen.height || 1080,
    screen_width: screen.width || 1920,
    time_zone_offset: new Date().getTimezoneOffset(),
    user_agent: navigator.userAgent,
    challenge_window_size: "full-screen"
  };
};

const getBrowserDetailsFromRequest = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const acceptHeader = req.headers['accept'] || '';
  const language = req.headers['accept-language'] || '';
  
  return {
    accept_header: acceptHeader,
    java_enabled: false,
    javascript_enabled: true,
    language: language.split(',')[0] || 'en-US',
    color_depth: 24,
    screen_height: 1080,
    screen_width: 1920,
    time_zone_offset: new Date().getTimezoneOffset(),
    user_agent: userAgent,
    challenge_window_size: "full-screen",
    ip_address: req.ip || req.connection.remoteAddress || '93.88.94.130'
  };
};




module.exports = { collectBrowserDetails, getBrowserDetailsFromRequest };