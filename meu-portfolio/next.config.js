/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Gera arquivos estáticos (ideal para GitHub Pages)
  trailingSlash: true, // URLs sempre terminam com /
  images: {
    unoptimized: true // Permite usar imagens externas sem otimização
  },
  // basePath e assetPrefix só para produção no GitHub Pages
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/github',
    assetPrefix: '/github/'
  })
}

module.exports = nextConfig
