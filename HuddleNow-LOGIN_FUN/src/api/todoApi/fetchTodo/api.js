import BaseApi from 'api/network/baseApi';
import basePath from '../basePath';

class Api extends BaseApi {
    constructor({ todoId }) {
        super({
            method: 'GET',
            url: `${basePath}/${todoId}`,
        })
    }
}

export default Api;