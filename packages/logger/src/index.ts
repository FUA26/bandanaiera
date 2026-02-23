// Logger placeholder
// Will be populated during migration phase

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log('[INFO]', message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error('[ERROR]', message, ...args);
  },
};
