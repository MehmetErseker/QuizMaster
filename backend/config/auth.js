const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'workhard';

module.exports = {
  JWT_SECRET,
};
