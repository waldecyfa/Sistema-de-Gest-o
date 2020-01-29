import {create} from 'apisauce';

export const getBaseUrl = () => {
    const baseUrl = 'http://localhost:9020';
    // const baseUrl = 'http://erphsvr.ogmoes.com.br:8080/roteador/';
    // const baseUrl = 'https://roteador.ogmoes.com.br';
    // const baseUrl = 'http://bkdsvr.ogmoes.com.br:8080/roteador/';
    return baseUrl;
}

export const getClientId = () => {
    const clientId = 'microservices';
    return clientId;
}

export const getClientSecret = () => {
    const clientSecret = '$2a$10$r0RFDmpneBVryx.ihHK9gu6FFJQi4nTxQUqzdSTvrPpaKZMxigqpy';
    return clientSecret;
}

export const getGrantType = () => {
    const grantType = 'password';
    return grantType;
}

export const getApiAutenticado = (accessToken) => {
    // define the api
    return create({
        baseURL: getBaseUrl(),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ accessToken,
        }
    });
}

export const getApi = () => {
    // define the api
    return create({
        baseURL: getBaseUrl(),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}