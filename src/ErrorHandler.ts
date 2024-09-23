import CustomLogger from "./CustomLogger";

class ErrorHandler {
  static handleError(error: Error): void {
    CustomLogger.logError(error);
  }

  static handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(
          typeof event.reason === "string" ? event.reason : "Unknown reason"
        );
    CustomLogger.logError(error);
  }

  static handleUnhandledError(event: ErrorEvent): void {
    const errorDetails = {
      title: event.message,
      stack: event.error?.stack,
    };
    CustomLogger.sendErrorToEndpoint(errorDetails);
  }

  static init(envKey: string, appVersion: string): void {
    CustomLogger.init(envKey, appVersion); // Initialize the environment key and app version once

    if (typeof window !== "undefined") {
      // Browser environment
      window.addEventListener("unhandledrejection", (event) =>
        ErrorHandler.handleUnhandledRejection(event)
      );
      window.addEventListener("error", (event) =>
        ErrorHandler.handleUnhandledError(event as ErrorEvent)
      );
    } else if (typeof process !== "undefined") {
      // Node.js environment
      process.on("uncaughtException", (error) => {
        ErrorHandler.handleError(error);
      });
      process.on("unhandledRejection", (reason) => {
        const error =
          reason instanceof Error ? reason : new Error(String(reason));
        ErrorHandler.handleError(error);
      });
    }
  }
}

export default ErrorHandler;
