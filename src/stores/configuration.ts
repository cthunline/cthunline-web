import { create } from 'zustand';

import { getConfiguration } from '../services/requests/configuration.js';
import { toast } from '../services/toast.js';
import type { Configuration } from '../types/index.js';

type ConfigurationStoreStates = Configuration & {
    refresh: () => Promise<void>;
};

const defaultConfigurationStoreStates: Configuration = {
    registrationEnabled: false,
    invitationEnabled: false,
    defaultTheme: 'dark',
    defaultLocale: 'en',
    apiVersion: '0.0.0'
};

export const useConfigurationStore = create<ConfigurationStoreStates>()(
    (set) => ({
        ...defaultConfigurationStoreStates,
        refresh: async () => {
            try {
                const conf = await getConfiguration();
                set(conf);
            } catch (err: unknown) {
                toast.error(
                    err instanceof Error ? err.message : 'Configuration error'
                );
                throw err;
            }
        }
    })
);
