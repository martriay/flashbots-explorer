require("dotenv").config();

module.exports = {
  target: "serverless",
  env: {
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    FLASHBOTS_API_URL: process.env.FLASHBOTS_API_URL || "https://blocks.flashbots.net/v1/blocks"
  },
  webpack: (config) => {
    return config;
  }
};
