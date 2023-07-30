const BASE_URL = 'https://5f9a-2601-647-4b80-78a0-8945-a485-1459-2b10.ngrok-free.app/api';

const APIConfig = {
    REGISTER_USER: `${BASE_URL}/user/info/save`,
    LOGIN_USER: `${BASE_URL}/user/info/login`,
    GET_ALL_FURNITURE: `${BASE_URL}/furniture/info/list`,
    UPDATE_WISHLIST: `${BASE_URL}/user/favorite/update`,
    GET_WISHLIST: `${BASE_URL}/user/favorite/user`,
};

export default APIConfig;