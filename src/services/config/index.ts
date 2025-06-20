import { ref, reactive, watch, computed } from 'vue';
                                                                                                                                                                                                                                                                                                                                                                                            
/**
 * Types for configuration values
 */
export interface AppConfig {
  environment: string;
  app: {
    name: string;
    description: string;
    version: string;
    url: string;
  };
  api: {
    url: string;
    timeout: number;
    retries: number;
  };
  email: {
    plunkApiKey: string;
    mailjetApiKey: string;
    mailjetSecretKey: string;
    defaultFromEmail: string;
  };
  analytics: {
    umamiWebsiteId: string;
    umamiUrl: string;
    enabled: boolean;
  };
  features: Record<string, boolean>;
}

/**
 * Default configuration values
 */
const defaultConfig: AppConfig = {
  environment: 'development',
  app: {
    name: 'myNGO',
    description: 'NGO Management Platform',
    version: '1.0.0',
    url: 'http://localhost:5173',
  },
  api: {
    url: 'http://localhost:3001',
    timeout: 30000,
    retries: 3,
  },
  email: {
    plunkApiKey: '',
    mailjetApiKey: '',
    mailjetSecretKey: '',
    defaultFromEmail: 'no-reply@myngo.com',
  },
  analytics: {
    umamiWebsiteId: '',
    umamiUrl: '',
    enabled: false,
  },
  features: {
    darkMode: true,
    multilingualSupport: true,
    notifications: true,
    analytics: false,
    adminDashboard: true,
    userManagement: true,
    emailService: false,
    pwa: false,
    impersonation: false,
    otpVerification: false,
  },
};

/**
 * Get environment variable value (works in both browser and Node.js)
 */
const getEnvVar = (key: string): string | undefined => {
  // Check if we're in a browser environment with Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  // Check if we're in Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

/**
 * Load configuration from environment variables
 */
const loadConfigFromEnv = (): Partial<AppConfig> => {
  return {
    environment: getEnvVar('VITE_ENVIRONMENT') || defaultConfig.environment,
    app: {
      name: getEnvVar('VITE_APP_NAME') || defaultConfig.app.name,
      description: getEnvVar('VITE_APP_DESCRIPTION') || defaultConfig.app.description,
      version: getEnvVar('VITE_APP_VERSION') || defaultConfig.app.version,
      url: getEnvVar('VITE_APP_URL') || defaultConfig.app.url,
    },
    api: {
      url: getEnvVar('VITE_BACKEND_URL') || defaultConfig.api.url,
      timeout: Number(getEnvVar('VITE_API_TIMEOUT')) || defaultConfig.api.timeout,
      retries: Number(getEnvVar('VITE_API_RETRIES')) || defaultConfig.api.retries,
    },
    email: {
      plunkApiKey: getEnvVar('VITE_PLUNK_API_KEY') || defaultConfig.email.plunkApiKey,
      mailjetApiKey: getEnvVar('VITE_MAILJET_API_KEY') || defaultConfig.email.mailjetApiKey,
      mailjetSecretKey: getEnvVar('VITE_MAILJET_SECRET_KEY') || defaultConfig.email.mailjetSecretKey,
      defaultFromEmail: getEnvVar('VITE_DEFAULT_FROM_EMAIL') || defaultConfig.email.defaultFromEmail,
    },
    analytics: {
      umamiWebsiteId: getEnvVar('VITE_UMAMI_WEBSITE_ID') || defaultConfig.analytics.umamiWebsiteId,
      umamiUrl: getEnvVar('VITE_UMAMI_URL') || defaultConfig.analytics.umamiUrl,
      enabled: (getEnvVar('VITE_ENABLE_ANALYTICS') === 'true') || (!!getEnvVar('VITE_UMAMI_WEBSITE_ID') && !!getEnvVar('VITE_UMAMI_URL')),
    },
    features: {
      darkMode: getEnvVar('VITE_ENABLE_DARK_MODE') === 'true' || getEnvVar('VITE_FEATURE_DARKMODE') === 'true' || defaultConfig.features.darkMode,
      multilingualSupport: getEnvVar('VITE_FEATURE_MULTILINGUALSUPPORT') === 'true' || defaultConfig.features.multilingualSupport,
      notifications: getEnvVar('VITE_ENABLE_NOTIFICATIONS') === 'true' || getEnvVar('VITE_FEATURE_NOTIFICATIONS') === 'true' || defaultConfig.features.notifications,
      analytics: getEnvVar('VITE_ENABLE_ANALYTICS') === 'true' || getEnvVar('VITE_FEATURE_ANALYTICS') === 'true' || defaultConfig.features.analytics,
      adminDashboard: getEnvVar('VITE_FEATURE_ADMINDASHBOARD') === 'true' || defaultConfig.features.adminDashboard,
      userManagement: getEnvVar('VITE_FEATURE_USERMANAGEMENT') === 'true' || defaultConfig.features.userManagement,
      emailService: getEnvVar('VITE_FEATURE_EMAILSERVICE') === 'true' || defaultConfig.features.emailService,
      pwa: getEnvVar('VITE_ENABLE_PWA') === 'true' || defaultConfig.features.pwa,
      impersonation: getEnvVar('VITE_ENABLE_IMPERSONATION') === 'true' || defaultConfig.features.impersonation,
      otpVerification: getEnvVar('VITE_ENABLE_OTP_VERIFICATION') === 'true' || defaultConfig.features.otpVerification,
    },
  };
};

/**
 * Configuration Service for centralized config management
 */
export class ConfigService {
  private _config: AppConfig;
  private _runtimeConfig = reactive<Record<string, any>>({});
  private _features = reactive<Record<string, boolean>>({...defaultConfig.features});

  constructor() {
    // Merge default config with environment variables
    this._config = {
      ...defaultConfig,
      ...loadConfigFromEnv(),
    };

    // Update features with environment-loaded values
    Object.assign(this._features, this._config.features);
    
    // Log configuration in development
    if (this._config.environment === 'development') {
      console.log('[Config] Initialized with:', {
        ...this._config,
        email: { ...this._config.email, plunkApiKey: this._config.email.plunkApiKey ? '***' : '' }, // Hide sensitive data
      });
    }
  }

  /**
   * Get the current environment
   */
  get environment(): string {
    return this._config.environment;
  }

  /**
   * Check if running in development environment
   */
  get isDevelopment(): boolean {
    return this._config.environment === 'development';
  }

  /**
   * Check if running in production environment
   */
  get isProduction(): boolean {
    return this._config.environment === 'production';
  }

  /**
   * Get app configuration
   */
  get app(): AppConfig['app'] {
    return this._config.app;
  }

  /**
   * Get API configuration
   */
  get api(): AppConfig['api'] {
    return this._config.api;
  }

  /**
   * Get email configuration
   */
  get email(): AppConfig['email'] {
    return this._config.email;
  }

  /**
   * Get analytics configuration
   */
  get analytics(): AppConfig['analytics'] {
    return this._config.analytics;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    return this._features[featureName] ?? false;
  }

  /**
   * Get all features
   */
  get features(): Record<string, boolean> {
    return this._features;
  }

  /**
   * Enable a feature
   */
  enableFeature(featureName: string): void {
    this._features[featureName] = true;
  }

  /**
   * Disable a feature
   */
  disableFeature(featureName: string): void {
    this._features[featureName] = false;
  }

  /**
   * Toggle a feature
   */
  toggleFeature(featureName: string): boolean {
    this._features[featureName] = !this._features[featureName];
    return this._features[featureName];
  }

  /**
   * Set runtime configuration
   */
  setRuntimeConfig(key: string, value: any): void {
    this._runtimeConfig[key] = value;
  }

  /**
   * Get runtime configuration
   */
  getRuntimeConfig<T>(key: string, defaultValue?: T): T {
    return this._runtimeConfig[key] ?? defaultValue;
  }

  /**
   * Clear runtime configuration
   */
  clearRuntimeConfig(): void {
    Object.keys(this._runtimeConfig).forEach(key => {
      delete this._runtimeConfig[key];
    });
  }
}

/**
 * Global configuration service instance
 */
export const configService = new ConfigService();

/**
 * Export config object for direct access
 */
export const config = {
  app: configService.app,
  api: configService.api,
  email: configService.email,
  analytics: configService.analytics,
  environment: configService.environment,
  isDevelopment: configService.isDevelopment,
  isProduction: configService.isProduction,
  features: configService.features,
  isFeatureEnabled: (featureName: string) => configService.isFeatureEnabled(featureName),
};

/**
 * UI-specific configuration structure
 */
export interface UIConfig {
  app: {
    name: string;
    url: string;
    adminEmail: string;
    environment: string;
    debug: boolean;
  };
  locale: {
    defaultLanguage: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
  };
  mail: {
    driver: string;
    fromAddress: string;
    fromName: string;
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: string;
    apiKey: string;
  };
  security: {
    sessionLifetime: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumber: boolean;
    passwordRequireSpecial: boolean;
    twoFactorEnabled: boolean;
  };
  ui: {
    theme: string;
    animations: boolean;
    denseMode: boolean;
    sidebarCollapsed: boolean;
  };
}

/**
 * Default UI configuration values
 */
const defaultUIConfig: UIConfig = {
  app: {
    name: 'jBoilerplate',
    url: 'http://localhost:3000',
    adminEmail: 'admin@example.com',
    environment: 'development',
    debug: true,
  },
  locale: {
    defaultLanguage: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    timezone: 'UTC',
  },
  mail: {
    driver: 'smtp',
    fromAddress: 'no-reply@example.com',
    fromName: 'jBoilerplate',
    host: 'smtp.example.com',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls',
    apiKey: '',
  },
  security: {
    sessionLifetime: 120,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    twoFactorEnabled: false,
  },
  ui: {
    theme: 'system',
    animations: true,
    denseMode: false,
    sidebarCollapsed: false,
  },
};

/**
 * Hook for using the config service in UI components
 */
export function useConfigService() {
  // UI configuration state
  const config = reactive<UIConfig>(JSON.parse(JSON.stringify(defaultUIConfig)));
  
  // Loading states
  const isLoading = ref(true);
  const isLoaded = ref(false);
  const error = ref<Error | null>(null);

  // Load configuration from the server
  const loadConfig = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Simulate API call - in a real app, this would be an API call to load config
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Load saved config from localStorage if available
      const savedConfig = localStorage.getItem('app_config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        Object.assign(config, parsedConfig);
      }
      
      isLoaded.value = true;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load configuration');
      console.error('[ConfigService]', error.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Save configuration to the server
  const saveConfig = async () => {
    try {
      // Simulate API call - in a real app, this would be an API call to save config
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to localStorage for demo
      localStorage.setItem('app_config', JSON.stringify(config));
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to save configuration');
      console.error('[ConfigService]', error.value);
      return false;
    }
  };
  
  // Reset configuration to defaults
  const resetConfig = async () => {
    try {
      // Reset to defaults
      Object.assign(config, JSON.parse(JSON.stringify(defaultUIConfig)));
      
      // Save to localStorage
      localStorage.setItem('app_config', JSON.stringify(config));
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to reset configuration');
      console.error('[ConfigService]', error.value);
      return false;
    }
  };

  // Update a specific config section
  const updateConfig = <T extends keyof UIConfig>(section: T, values: Partial<UIConfig[T]>) => {
    Object.assign(config[section], values);
  };

  // Load config immediately
  loadConfig();

  return {
    config,
    isLoading,
    isLoaded,
    error,
    loadConfig,
    saveConfig,
    resetConfig,
    updateConfig
  };
} 