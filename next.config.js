/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.externals = [...config.externals, 'hnswlib-node'];
    return config
  }
}

module.exports = nextConfig
