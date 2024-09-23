interface ErrorDetails {
  title: string;
  stack?: string;
  appVersion: string;
}
class CustomLogger {
  private static endpoint = "https://api.retack.ai/observe/error-log/";
  private static envKey: string | null = null;
  private static appVersion: string | null = null; // Store the app version
  // Initialize the SDK with envKey and appVersion
  static init(envKey: string, appVersion: string): void {
    if (!envKey || !appVersion) {
      console.error("Environment key and app version must be provided.");
      return;
    }
    this.envKey = envKey;
    this.appVersion = appVersion;
    if (typeof window !== "undefined") {
      // Browser environment
      window.addEventListener("error", (event) => {
        this.logError(event.error as Error);
      });
      window.addEventListener("unhandledrejection", (event) => {
        const reason = event.reason;
        if (reason instanceof Error) {
          this.logError(reason);
        } else {
          this.logError(new Error(String(reason)));
        }
      });
    } else if (typeof process !== "undefined") {
      // Node.js environment
      process.on("uncaughtException", (error) => {
        this.logError(error);
      });

      process.on("unhandledRejection", (reason) => {
        if (reason instanceof Error) {
          this.logError(reason);
        } else {
          this.logError(new Error(String(reason)));
        }
      });
    }
  }
  // Send error details to the endpoint, including app version
  static async sendErrorToEndpoint(
    errorDetails: Partial<ErrorDetails>
  ): Promise<void> {
    if (!this.envKey || !this.appVersion) {
      console.error("Environment key and app version must be initialized.");
      return;
    }
    try {
      const payload = { ...errorDetails, appVersion: this.appVersion }; // Add appVersion to the payload
      // Check environment and send error accordingly
      if (typeof window !== "undefined") {
        // Browser environment
        await fetch(this.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Env-key": this.envKey,
          },
          body: JSON.stringify(payload),
        });
      } else if (typeof process !== "undefined") {
        // Node.js environment
        const https = await import("node:https");
        const data = JSON.stringify(payload);
        const options = {
          hostname: "api.retack.ai",
          port: 443,
          path: "/observe/error-log/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Env-key": this.envKey,
          },
        };
        const req = https.request(options, (res) => {
          res.on("data", (chunk) => {
            console.log(`Response: ${chunk}`);
          });
        });
        req.on("error", (error) => {
          console.error("Failed to send error to endpoint:", error);
        });
        req.write(data);
        req.end();
      }
    } catch (error) {
      console.error("Failed to send error to endpoint:", error);
    }
  }
  // Log error and send with app version
  static logError(error: Error): void {
    if (!this.envKey || !this.appVersion) {
      console.error("Environment key and app version must be initialized.");
      return;
    }
    const errorPayload = {
      title: error.name,
      stack_trace: error.stack, // Fix stack_trace to match interface
      versions: this.appVersion, // Use appVersion correctly
    };
    this.sendErrorToEndpoint(errorPayload);
  }
}
export default CustomLogger;