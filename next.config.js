/** @type {import('next').NextConfig} */

const getEnvConfig = () => {
  switch (process.env.ENV) {
    case "dev":
      return {
        env: "dev",
        apiUrl: "http://localhost:3001/api",
        websiteUrl: "http://localhost:3000",
      };
    case "stage":
      return {
        env: "stage",
        apiUrl: "http://localhost:3001/api",
        websiteUrl: "https://segments-stage.com/api",
      };
    case "prod":
      return {
        env: "prod",
        apiUrl: "https://localhost:3001/api",
        websiteUrl: "https://segments.com/api",
      };
  }
};
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  publicRuntimeConfig: getEnvConfig(),
};

module.exports = nextConfig;
