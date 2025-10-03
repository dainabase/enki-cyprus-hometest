type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  sentryEnabled: boolean;
}

const config: LoggerConfig = {
  enabled: import.meta.env.DEV,
  level: 'debug',
  sentryEnabled: import.meta.env.PROD,
};

const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const shouldLog = (level: LogLevel): boolean => {
  if (!config.enabled && level !== 'error') return false;
  return logLevels[level] >= logLevels[config.level];
};

export const logger = {
  debug: (...args: any[]) => {
    if (shouldLog('debug')) {
      console.log('[DEBUG]', ...args);
    }
  },

  info: (...args: any[]) => {
    if (shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args: any[]) => {
    if (shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (message: string, error?: Error | unknown, context?: Record<string, any>) => {
    if (shouldLog('error')) {
      console.error('[ERROR]', message, error, context);
    }

    if (config.sentryEnabled && typeof window !== 'undefined') {
      try {
        const Sentry = (window as any).Sentry;
        if (Sentry && Sentry.captureException) {
          if (error instanceof Error) {
            Sentry.captureException(error, {
              tags: { component: context?.component },
              extra: context,
            });
          } else {
            Sentry.captureMessage(message, {
              level: 'error',
              extra: { error, ...context },
            });
          }
        }
      } catch (e) {
        console.error('Failed to log to Sentry:', e);
      }
    }
  },

  group: (label: string, callback: () => void) => {
    if (config.enabled) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },

  table: (data: any) => {
    if (config.enabled && console.table) {
      console.table(data);
    }
  },

  time: (label: string) => {
    if (config.enabled) {
      console.time(label);
    }
  },

  timeEnd: (label: string) => {
    if (config.enabled) {
      console.timeEnd(label);
    }
  },
};

export default logger;
