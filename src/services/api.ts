import Axios, { AxiosHeaders } from 'axios';

import { pathJoin } from './tools';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiCallOptions {
    method: HttpMethod;
    route: string;
    data?: object | FormData;
    progress?: (percent: number) => void;
}

const Api = {
    async call({ method, route, data, progress }: ApiCallOptions) {
        const url = pathJoin('/api', route);
        const headers = new AxiosHeaders();
        if (!(data instanceof FormData)) {
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
        }
        const response = await Axios({
            withCredentials: true,
            method,
            url,
            headers,
            data,
            onUploadProgress: progress
                ? (progressEvent) => {
                      if (progressEvent.total) {
                          progress(
                              Math.round(
                                  (progressEvent.loaded * 100) /
                                      progressEvent.total
                              )
                          );
                      }
                  }
                : undefined
        });
        return response.data;
    },

    getAssetUrl: (path: string) => `/static/${path}`
};

export default Api;
