import fetch from 'electron-fetch';
import FormData from 'form-data';

const config = require('../config.json');

const authenticate = (username, password) => {
  // console.log(JSON.stringify({ username, password }));
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);
  return fetch(`${config.apiUrl}/user/authenticate`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log('res', res);
      if (res && !res.error) {
        return res.result;
      }
      // throw new Error(res.errorMessage || 'Unknown error');
      return false;
    })
    .catch((e) => {
      console.log('Error', e);
      return false;
    });
};

export default authenticate;
