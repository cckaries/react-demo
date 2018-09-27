import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-2ab50.firebaseio.com/'
});

export default instance;