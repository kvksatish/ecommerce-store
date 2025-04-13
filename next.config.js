/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com', 'cdn.pixabay.com'],
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000', 'localhost:3001'],
        },
    },

    output: "standalone",
};

module.exports = nextConfig; 