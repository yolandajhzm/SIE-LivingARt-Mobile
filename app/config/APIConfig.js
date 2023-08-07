const BASE_URL = 'http://172.19.137.178:8888/api';

const APIConfig = {
    REGISTER_USER: `${BASE_URL}/user/info/save`,
    LOGIN_USER: `${BASE_URL}/user/info/login`,
    GET_ALL_FURNITURE: `${BASE_URL}/furniture/info/list`,
    UPDATE_WISHLIST: `${BASE_URL}/user/favorite/update`,
    GET_WISHLIST: `${BASE_URL}/user/favorite/user`,
};

export default APIConfig;