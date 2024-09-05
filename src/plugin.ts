import ErrorHandler from './ErrorHandler';

export function initializePlugin(environmentKey: string) {
  if (!environmentKey) {
    throw new Error('Environment key must be provided.');
  }
  ErrorHandler.init(environmentKey);
}