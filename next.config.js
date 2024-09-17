/** @type {import('next').NextConfig} */

const getEnvConfig = () => {
  switch (process.env.ENV) {
    case "dev":
      return {
        env: "dev",
        apiUrl: "https://webhook.site/1c6e32cd-3281-4c0d-948f-82e2591206b4",
        websiteUrl: "http://localhost:3000",
      };
    case "stage":
      return {
        env: "stage",
        apiUrl: "https://webhook.site/1c6e32cd-3281-4c0d-948f-82e2591206b4",
        websiteUrl: "https://segments-stage.com/api",
      };
    case "prod":
      return {
        env: "prod",
        apiUrl: "https://webhook.site/1c6e32cd-3281-4c0d-948f-82e2591206b4",
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
