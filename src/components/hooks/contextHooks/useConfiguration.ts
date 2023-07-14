import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import { getConfiguration } from '../../../services/requests/configuration';

import { Configuration, Locale, Theme } from '../../../types';

export interface ConfigurationHookExport {
    configuration: Configuration;
    refreshConfiguration: () => Promise<void>;
}

const defaultConfiguration: Configuration = {
    registrationEnabled: false,
    invitationEnabled: false,
    defaultTheme: Theme.dark,
    defaultLocale: Locale.en
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
        } catch (err: any) {
            toast.error(err.message);
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
