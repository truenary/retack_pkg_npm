interface ErrorDetails {
  title: string;
  message: string;
  stack?: string;
}

class CustomLogger {
  private static endpoint = "https://api.retack.ai/observe/error-log/";
  private static env_key: string | null = null;

  static init(env_key: string): void {
    if (!env_key) {
      console.error("Environment key must be provided.");
      return;
    }

    this.env_key = env_key;

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

  static async sendErrorToEndpoint(errorDetails: Partial<ErrorDetails>): Promise<void> {
    if (!this.env_key) {
      console.error("Environment key must be initialized.");
      return;
    }
    try {
      // Check environment and send error accordingly
      if (typeof window !== "undefined") {
        // Browser environment
        await fetch(this.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Env-key": this.env_key,
          },
          body: JSON.stringify(errorDetails),
        });
      } else if (typeof process !== "undefined") {
        // Node.js environment
        const https = await import("node:https");
        const data = JSON.stringify(errorDetails);
        const options = {
          hostname: "api.dev.retack.ai",
          port: 443,
          path: "/observe/error-log/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Env-key": this.env_key,
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

  static logError(error: Error): void {
    if (!this.env_key) {
      console.error("Environment key must be initialized.");
      return;
    }

    const errorPayload = {
      title: error.name,
      message: error.message,
      stack_trace: error.stack,
    };

    this.sendErrorToEndpoint(errorPayload);
  }
}

export default CustomLogger;
