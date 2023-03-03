import axios from 'axios';

const instance = axios.create({
  baseURL:
    'https://react-projet3-todolist-default-rtdb.europe-west1.firebasedatabase.app/',
});

export default instance;
