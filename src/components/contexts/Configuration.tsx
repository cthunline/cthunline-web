import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback
} from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { Configuration } from '../../types';

interface ConfigurationProviderProps {
    children: JSX.Element | JSX.Element[];
}

interface ConfigurationContextData {
    configuration: Configuration;
    refreshConfiguration: () => Promise<void>;
}

const defaultConfiguration: Configuration = {
    registrationEnabled: false,
    invitationEnabled: false
};

const ConfigurationContext = createContext<ConfigurationContextData>({
    configuration: defaultConfiguration,
    refreshConfiguration: async () => { /* default */ }
});

export const ConfigurationProvider:React.FC<ConfigurationProviderProps> = ({ children }) => {
    const [configuration, setConfiguration] = useState<Configuration>(defaultConfiguration);

    const refreshConfiguration = useCallback(async () => {
        try {
            const conf = await Api.call({
                method: 'GET',
                route: '/configuration'
            });
            setConfiguration(conf);
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    }, []);

    useEffect(() => {
        refreshConfiguration();
    }, [refreshConfiguration]);

    const contextValue = useMemo(() => ({
        configuration,
        refreshConfiguration
    }), [
        configuration,
        refreshConfiguration
    ]);

    return (
        <ConfigurationContext.Provider value={contextValue}>
            {children}
        </ConfigurationContext.Provider>
    );
};

export function useConfiguration() {
    const context = useContext(ConfigurationContext);
    if (!context) {
        throw new Error('useConfiguration must be used within an ConfigurationProvider');
    }
    return context;
}
