import axios from 'axios';
import configuration from 'configuration';

/* 
Allowed config for axios request
url?: string;
method?: Method;
baseURL?: string;
transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
headers?: AxiosRequestHeaders;
params?: any;
paramsSerializer?: (params: any) => string;
data?: D;
timeout?: number;
timeoutErrorMessage?: string;
withCredentials?: boolean;
adapter?: AxiosAdapter;
auth?: AxiosBasicCredentials;
responseType?: ResponseType;
responseEncoding?: responseEncoding | string;
xsrfCookieName?: string;
xsrfHeaderName?: string;
onUploadProgress?: (progressEvent: any) => void;
onDownloadProgress?: (progressEvent: any) => void;
maxContentLength?: number;
validateStatus?: ((status: number) => boolean) | null;
maxBodyLength?: number;
maxRedirects?: number;
socketPath?: string | null;
httpAgent?: any;
httpsAgent?: any;
proxy?: AxiosProxyConfig | false;
cancelToken?: CancelToken;
decompress?: boolean;
transitional?: TransitionalOptions;
signal?: AbortSignal;
insecureHTTPParser?: boolean;
*/

export const defaultAxios = axios.create({
    headers: {
        "x-requested-with": "XMLHttpRequest"
    },
    withCredentials: true,
});

defaultAxios.defaults.baseURL = configuration.BASE_URL;
defaultAxios.interceptors.request.use((config) => {
    const headers = { ...config.headers };
    return { ...config, headers: headers}
});

export const externalAxios = axios.create({
    headers: {
        "x-requested-with": "XMLHttpRequest"
    },
    withCredentials: true,
});

export const CancelToken = () => axios.CancelToken.source();

export const { isCancelled } = () => axios;


export const process = api => {
    if (api.isExternalApi) {
        return externalAxios({ ...api.config });
    } else {
        return defaultAxios({ ...api.config });
    }
}