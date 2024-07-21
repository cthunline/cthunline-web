import { useCallback, useEffect, useState } from 'react';

import { getConfiguration } from '../services/requests/configuration.js';
import { toast } from '../services/toast.js';
import type { Configuration } from '../types/index.js';

export interface ConfigurationHookExport {
    configuration: Configuration;
    refreshConfiguration: () => Promise<void>;
}

const defaultConfiguration: Configuration = {
    registrationEnabled: false,
    invitationEnabled: false,
    defaultTheme: 'dark',
    defaultLocale: 'en'
};

export const defaultConfigurationHookData: ConfigurationHookExport = {
    configuration: defaultConfiguration,
    refreshConfiguration: async () => {
        /* default */
    }
};

const useConfiguration = () => {
    const [configuration, setConfiguration] =
        useState<Configuration>(defaultConfiguration);

    const refreshConfiguration = useCallback(async () => {
        try {
            const conf = await getConfiguration();
            setConfiguration(conf);
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : 'Configuration error'
            );
            throw err;
        }
    }, []);

    useEffect(() => {
        refreshConfiguration();
    }, [refreshConfiguration]);

    return {
        configuration,
        refreshConfiguration
    };
};

export default useConfiguration;
