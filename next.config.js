require("dotenv").config();

module.exports = {
  env: {
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    FLASHBOTS_API_URL: process.env.FLASHBOTS_API_URL
  },
  future: {
    webpack5: true
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  }
};
