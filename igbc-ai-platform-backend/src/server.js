import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    const rootUrl = `http://localhost:${env.port}`;

    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    console.log(`API URL: ${rootUrl}/api`);
    console.log(`Health URL: ${rootUrl}/health`);
    console.log(`Test Dashboard URL: ${rootUrl}/test.html`);
  });

  process.on("unhandledRejection", (error) => {
    console.error(`Unhandled rejection: ${error.message}`);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (error) => {
    console.error(`Uncaught exception: ${error.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
