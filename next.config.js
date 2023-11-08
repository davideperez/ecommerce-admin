/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "res.cloudinary.com"
        ]
    }, // The code below seemed to be necesary but once fixed a name error (a typo on the productIds variable on the axios.post on frontend) and commented, everything still worked fine. But leaving it here just in case.
/*     async headers() {
        return [
            {
                // matching all API routes:
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*"},
                    { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
                ]
            }
        ]
    } */
}

module.exports = nextConfig
