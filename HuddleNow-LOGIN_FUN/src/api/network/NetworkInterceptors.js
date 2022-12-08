import React, { useEffect } from 'react';
import { defaultAxios, isCancelled } from './helper'
import useLoader from "atoms/hooks/useLoader";


const NetworkInterceptors = () => {
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const onRequest = (config = {}) => {
            const { skipLoader = false} = config;
            if (!skipLoader) {
                showLoader({ customLoader: config.customLoader});
            }
            const headers = { ...config.headers };
            return { ...config, headers: headers}
        };
        const onRequestError = (error) => {
            if (!error.config?.skipLoader) {
                hideLoader();
            }
            return Promise.reject(error);
        };

        const onResponse = (response) => {
            if (!response.config?.skipLoader) {
                hideLoader();
            }
            return response;
        };

        const onResponseError = (error) => {
            if (isCancelled(error)) {
                hideLoader();
            } else {
                if (!error.config?.skipLoader) {
                    hideLoader();
                }
            }
            return Promise.reject(error);
        };

        const requestInterceptors = defaultAxios.interceptors.request.use(onRequest, onRequestError);
        const responseInterceptors = defaultAxios.interceptors.response.use(onResponse, onResponseError);

        return () => {
            defaultAxios.interceptors.request.eject(requestInterceptors);
            defaultAxios.interceptors.response.eject(responseInterceptors)
        };
    }, [])

    return <></>;
};

export default NetworkInterceptors;