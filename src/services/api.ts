import Axios, { AxiosHeaders, type AxiosProgressEvent } from 'axios';

import { pathJoin } from './tools';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiCallOptions {
    method: HttpMethod;
    route: string;
    body?: object | FormData;
    progress?: (percent: number) => void;
}

export const callApi = async <ResponseBodyType extends Record<string, any>>({
    method,
    route,
    body,
    progress
}: ApiCallOptions): Promise<ResponseBodyType> => {
    const url = pathJoin('/api', route);
    const headers = new AxiosHeaders();
    if (!(body instanceof FormData)) {
        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json');
    }
    const onUploadProgress = progress
        ? (progressEvent: AxiosProgressEvent) => {
              if (progressEvent.total) {
                  progress(
                      Math.round(
                          (progressEvent.loaded * 100) / progressEvent.total
                      )
                  );
              }
          }
        : undefined;
    const response = await Axios<ResponseBodyType>({
        withCredentials: true,
        method,
        url,
        headers,
        data: body,
        onUploadProgress
    });
    return response.data;
};

export const getAssetUrl = (path: string) => `/static/${path}`;
