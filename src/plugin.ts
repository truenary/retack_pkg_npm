import ErrorHandler from './ErrorHandler';

export function initializePlugin(env_key: string) {
  if (!env_key) {
    throw new Error('Environment key must be provided.');
  }
  ErrorHandler.init(env_key);
}