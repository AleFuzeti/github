/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Gera arquivos estáticos (ideal para GitHub Pages)
  trailingSlash: true, // URLs sempre terminam com /
  images: {
    unoptimized: true // Permite usar imagens externas sem otimização
  },
  basePath: '', // Deixe vazio por enquanto, depois mudamos se necessário
  assetPrefix: ''
}

module.exports = nextConfig
