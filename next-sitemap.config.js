/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://shuvakharel.com.np",
  generateRobotsTxt: true,

  generateIndexSitemap: false,  // Don't generate index sitemap, only one sitemap

  // Transform allows custom sitemap entries, add homepage explicitly
  transform: async (config, path) => {
    if (path === "/") {
      return {
        loc: config.siteUrl,
        changefreq: "monthly",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    return null;  // exclude everything else
  },

  // This tells next-sitemap what paths to process, override to include homepage
  additionalPaths: async (config) => [
    {
      loc: config.siteUrl,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 1.0,
    },
  ],
};
