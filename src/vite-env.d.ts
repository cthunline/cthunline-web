/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEV_API_URL: string;
    readonly VITE_WEB_VERSION: `${number}.${number}.${number}`;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
