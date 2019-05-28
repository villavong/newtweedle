//just adding global header
import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    console.log('setAuthToken called. Add token to headers');
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
