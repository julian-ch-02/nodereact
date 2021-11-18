let jwtToken = "";
const storeToken = (token) => {
  jwtToken = token;
};
const getToken = () => {
  return jwtToken;
};
module.exports = {
  getToken,
  storeToken,
};
