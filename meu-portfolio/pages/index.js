import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  // Configuração das categorias
  const categories = {
    'data-science': {
      name: 'Data Science',
      icon: '🔬',
      keywords: ['visão computacional', 'redes neurais convolucionais', 'analise', 'simulação'],
      languages: []
    },
    'websites': {
      name: 'Websites e Apps',
      icon: '🌐',
      keywords: ['site', 'apps', 'web', 'react', 'google'],
      languages: []
    },
    'other': {
      name: 'Outros',
      icon: '🛠️',
      keywords: ['jogo', 'computação gráfica'],
      languages: []
    }
  }

  // Busca repositórios do GitHub
  useEffect(() => {
    fetchGitHubProjects()
  }, [])

  const fetchGitHubProjects = async () => {
    try {
      const response = await fetch('https://api.github.com/users/AleFuzeti/repos?sort=updated&per_page=100')
      const data = await response.json()

      // Filtra apenas repos que não são forks e têm descrição
      const filteredProjects = data.filter(repo =>
        !repo.fork &&
        repo.description &&
        repo.name !== 'AleFuzeti'
      )

      // Categoriza os projetos
      const categorizedProjects = filteredProjects.map(repo => ({
        ...repo,
        category: categorizeProject(repo)
      }))

      setProjects(categorizedProjects)
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Função para categorizar automaticamente um projeto

  const categorizeProject = (repo) => {
    const name = repo.name.toLowerCase()
    const description = repo.description.toLowerCase()
    const language = repo.language || ''

    console.log(`Categorizing project: ${name} - ${description} - ${language}`)
    // Verifica Data Science
    const isDataScience =
      categories['data-science'].languages.includes(language) ||
      categories['data-science'].keywords.some(keyword =>
        name.includes(keyword) || description.includes(keyword)
      )

    if (isDataScience) return 'data-science'

    // Verifica Websites
    const isWebsite =
      categories['websites'].languages.includes(language) ||
      categories['websites'].keywords.some(keyword =>
        name.includes(keyword) || description.includes(keyword)
      )

    if (isWebsite) return 'websites'


    return 'other' // Default para Other

  }

  // Filtra projetos por categoria
  const getFilteredProjects = () => {
    if (activeCategory === 'all') {
      return projects
    }
    return projects.filter(project => project.category === activeCategory)
  }

  // Conta projetos por categoria
  const getProjectCount = (categoryKey) => {
    if (categoryKey === 'all') return projects.length
    return projects.filter(project => project.category === categoryKey).length
  }

  return (
    <div className="container">
      <Head>
        <title>Alexandre Fuzeti - Portfólio</title>
        <meta name="description" content="Portfólio de projetos de Alexandre Fuzeti" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        {/* Header */}
        <header className="header-github">
          <div className="personal-info">
            <img
              src="https://github.com/AleFuzeti.png"
              alt="Alexandre Fuzeti"
              className="profile-img"
            />
            <div className="info-text">
              <h1>Alexandre Fuzeti</h1>
              <p className="subtitle">Software Engineer • AI/ML Specialist</p>
              <div className="location">📍 Londrina, PR • 🎓 UEL</div>
            </div>
          </div>

          <div className="github-showcase">
            <div className="stats-images">
              <img
                src="https://github-readme-stats.vercel.app/api?username=AleFuzeti&show_icons=true&theme=tokyonight&hide_border=true"
                alt="GitHub Stats"
              />
              <img
                src="https://github-readme-stats.vercel.app/api/top-langs/?username=AleFuzeti&layout=compact&theme=tokyonight&hide_border=true"
                alt="Top Languages"
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </header>

        {/* Projetos */}
        <section className="projects-section">
          <h2 className="section-title">🚀 Meus Projetos</h2>

          {/* Filtros de Categoria */}
          <div className="category-filters">
            <button
              className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              📁 Todos ({getProjectCount('all')})
            </button>
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                className={`category-button ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                {category.icon} {category.name} ({getProjectCount(key)})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Carregando projetos...</div>
          ) : (
            <>
              {/* Título da categoria ativa */}
              <div className="active-category-title">
                {activeCategory === 'all' ? (
                  <h3>📁 Todos os Projetos ({getFilteredProjects().length})</h3>
                ) : (
                  <h3>
                    {categories[activeCategory].icon} {categories[activeCategory].name} ({getFilteredProjects().length})
                  </h3>
                )}
              </div>

              <div className="projects-grid">
                {getFilteredProjects().map((project) => (
                  <div key={project.id} className="project-card">
                    {/* Badge da categoria */}
                    <div className="project-category-badge">
                      {categories[project.category].icon} {categories[project.category].name}
                    </div>

                    <h3 className="project-title">{project.name}</h3>
                    <p className="project-description">{project.description}</p>

                    <div className="project-tech">
                      {project.language && (
                        <span className="tech-badge">{project.language}</span>
                      )}
                      {project.stargazers_count > 0 && (
                        <span className="stars-badge">⭐ {project.stargazers_count}</span>
                      )}
                    </div>

                    <div className="project-links">
                      <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-button"
                      >
                        Ver Código
                      </a>
                      {project.homepage && (
                        <a
                          href={project.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-button demo"
                        >
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {getFilteredProjects().length === 0 && (
                <div className="no-projects">
                  🔍 Nenhum projeto encontrado nesta categoria
                </div>
              )}
            </>
          )}
        </section>

        {/* Contato */}
        <section className="contact-section">
          <h2 className="section-title">📫 Entre em Contato</h2>
          <div className="contact-links">
            <a href="mailto:alebertipaglia@gmail.com" className="contact-link">
              📧 Email
            </a>
            <a href="https://www.linkedin.com/in/alefuzeti" className="contact-link">
              💼 LinkedIn
            </a>
            <a href="https://github.com/AleFuzeti" className="contact-link">
              🐱 GitHub
            </a>
          </div>
        </section>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
        }

        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .main {
          min-height: 100vh;
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .header-github {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 4rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          color: white;
          max-width: 1000px;
          width: 100%;
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .personal-info {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .profile-img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid rgba(255, 215, 0, 0.5);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
          transition: all 0.3s ease;
        }

        .profile-img:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 35px rgba(255, 215, 0, 0.4);
        }

        .info-text h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          color: #ffd700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          font-weight: 700;
        }

        .subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 1rem 0;
          font-weight: 500;
        }

        .location {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .github-showcase {
          width: 100%;
        }

        .stat-box {
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
        }

        .stat-box:hover {
          background: rgba(255, 215, 0, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-text {
          font-weight: 600;
          color: #ffd700;
          font-size: 1rem;
        }

        .stats-images {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stats-images img {
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          max-width: 100%;
          height: auto;
        }

        .stats-images img:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .section-title {
          font-size: 2rem;
          color: white;
          text-align: center;
          margin-bottom: 2rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .projects-section {
          width: 100%;
          margin-bottom: 4rem;
        }

        .category-filters {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .category-button {
          padding: 0.8rem 1.2rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .category-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .category-button.active {
          background: rgba(255, 215, 0, 0.3);
          border-color: rgba(255, 215, 0, 0.5);
          color: #ffd700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .active-category-title {
          text-align: center;
          margin-bottom: 2rem;
        }

        .active-category-title h3 {
          color: white;
          font-size: 1.3rem;
          opacity: 0.9;
        }

        .loading {
          color: white;
          text-align: center;
          font-size: 1.2rem;
        }

        .no-projects {
          color: white;
          text-align: center;
          font-size: 1.1rem;
          opacity: 0.8;
          margin: 3rem 0;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 0 1rem;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          color: white;
          position: relative;
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          background: rgba(255, 255, 255, 0.15);
        }

        .project-category-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.3);
          color: rgba(255, 255, 255, 0.8);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .project-title {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: #ffd700;
          margin-top: 1rem;
        }

        .project-description {
          margin-bottom: 1rem;
          opacity: 0.9;
          line-height: 1.5;
        }

        .project-tech {
          margin-bottom: 1rem;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tech-badge {
          background: rgba(255, 215, 0, 0.2);
          color: #ffd700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .stars-badge {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .project-links {
          display: flex;
          gap: 0.5rem;
        }

        .link-button {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .link-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .demo {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.3);
          color: #ffd700;
        }

        .demo:hover {
          background: rgba(255, 215, 0, 0.3);
        }

        .contact-section {
          text-align: center;
          width: 100%;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .contact-link {
          padding: 0.8rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-weight: 500;
        }

        .contact-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
          }
          
          .projects-grid {
            grid-template-columns: 1fr;
            padding: 0 0.5rem;
          }
          
          .contact-links {
            flex-direction: column;
            align-items: center;
          }

          .category-filters {
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
          }

          .category-button {
            width: 100%;
            max-width: 250px;
            text-align: center;
          }

          .project-category-badge {
            position: static;
            display: inline-block;
            margin-bottom: 0.5rem;
          }

          .project-title {
            margin-top: 0;
          }

          /* Header responsivo */
          .header-github {
            padding: 1.5rem;
            margin-bottom: 3rem;
          }

          .personal-info {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .profile-img {
            width: 100px;
            height: 100px;
          }

          .info-text h1 {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1.1rem;
          }

          .location {
            justify-content: center;
            flex-wrap: wrap;
          }

    

          .stat-box {
            padding: 0.8rem 1rem;
          }

          .stats-images {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .stats-images img {
            max-width: 100%;
            width: auto;
          }
        }
      `}</style>
    </div>
  )
}
