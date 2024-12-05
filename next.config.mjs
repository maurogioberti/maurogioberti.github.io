/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // FIXME: Temporary config to ignore HTML files in blog data
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.html$/,
        contextRegExp: /src[\/\\]data/,
      })
    );

    return config;
  },
};

export default nextConfig;