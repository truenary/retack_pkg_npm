import ErrorHandler from './ErrorHandler';

export function initializePlugin(envKey: string, appVersion: string) {
  if (!envKey || !appVersion) {
    console.error("Environment key and app version must be provided.");
    return;
  }
  ErrorHandler.init(envKey, appVersion);
}