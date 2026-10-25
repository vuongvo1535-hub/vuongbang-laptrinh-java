const API_CONFIG = {
    BASE_URL: "http://localhost:8080/api",
    IMAGE_URL: "http://localhost:8080/",
    HEADERS: {
        Accept: "application/json",
    },
    TIMEOUT: 10000,
    USE_MOCK: false,
};

export const IMAGE_URL = API_CONFIG.IMAGE_URL;
export default API_CONFIG;