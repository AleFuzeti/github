/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Gera arquivos estáticos (ideal para GitHub Pages)
  trailingSlash: true, // URLs sempre terminam com /
  images: {
    unoptimized: true // Permite usar imagens externas sem otimização
  },
  basePath: '/github', // Configura o caminho base para GitHub Pages
  assetPrefix: '/github/' // Prefixo para assets estáticos
}

module.exports = nextConfig
