# Retack Sdk App Observer SDK for React

The **Retack Sdk App Observer SDK** for React allows you to easily report JavaScript errors to the Retack AI service from your React applications.

## Installation

You can install the Retack SDK for React using npm:

`npm install retack-sdk-app-observer`

## Usage

### Initialize the SDK

To start using the SDK, you need to initialize it with your environment key and app version.
This setup should typically be done at the beginning of your application, such as in `index.tsx` or `index.js`.

```
import { CustomLogger } from "retack-sdk-app-observer";

// Initialize the SDK with your environment key and app version

const envKey = "your-environment-key";
const appVersion = "your-app-version";
CustomLogger.init(envKey, appVersion);
```

## Automatic Error Handling

Once initialized, the SDK will automatically capture and report all uncaught errors and unhandled promise rejections to the Retack AI service.

## Usage

### Here's an example of how to integrate the SDK into your React application:

```
import React from "react";
import ReactDOM from "react-dom";
import { CustomLogger } from "retack-sdk-app-observer";

// Initialize the Retack SDK
const envKey = "your-environment-key"; 
const appVersion = "your-app-version";
CustomLogger.init(envKey, appVersion);

try {
  // Your application code
  // Example: Intentionally throw an error to test the SDK
  throw new Error("Test error");
} catch (error) {
  // Manually report the error
  CustomLogger.logError(error);
}

function App() {
  return <div>My React App</div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

## In this example:

The SDK is initialized with the `envKey` and `appVersion`.
Any errors within your React application are automatically reported.
You can also manually log errors if needed.
Reporting Errors Manually
In some cases, you may want to manually log errors. You can do this using the logError method provided by the SDK:

```
try {
  // Code that might throw an error
} catch (error) {
  CustomLogger.logError(error);
}
```

For more information, please visit Retack AI.
