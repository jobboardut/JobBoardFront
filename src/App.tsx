import React, { useState, useEffect } from 'react';
import { MapPin, Monitor, TrendingUp, Megaphone, Phone, Mail, Share, BriefcaseBusiness, Clock } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

// 1. Definimos las interfaces de TypeScript para nuestros datos
interface JobCategory {
  id: number;
  icon: React.ReactElement;
  name: string;
  description: string;
  openings: number;
}

interface FeaturedCompany {
  id: number;
  logoUrl: string; // O puedes usar íconos como marcadores de posición
  name: string;
}

// 2. Mock Data (datos de ejemplo)
const categoriesData: JobCategory[] = [
  { id: 1, icon: <Monitor size={24} className="category-icon-main" />, name: 'Tecnología', description: 'Software Engineering, data science, and cloud infrastructure.', openings: 1200 },
  { id: 2, icon: <Monitor size={24} className="category-icon-main" />, name: 'Diseño', description: 'Product design, UX research, and brand identity.', openings: 800 },
  { id: 3, icon: <TrendingUp size={24} className="category-icon-main" />, name: 'Ventas', description: 'Account management, BD, and sales operations.', openings: 1500 },
  { id: 4, icon: <Megaphone size={24} className="category-icon-main" />, name: 'Marketing', description: 'Growth hacking, content strategy, and SEO.', openings: 600 },
];

const companiesData: FeaturedCompany[] = [
  { id: 1, logoUrl: '/src/assets/img/apple.png', name: 'Apple' },
  { id: 2, logoUrl: '/src/assets/img/audi.png', name: 'Audi' },
  { id: 3, logoUrl: '/src/assets/img/codeland.png', name: 'Codeland' },
  { id: 4, logoUrl: '/src/assets/img/microsoft.png', name: 'Microsoft' },
  { id: 5, logoUrl: '/src/assets/img/volkswagen.png', name: 'Volkswagen' },
  { id: 6, logoUrl: '/src/assets/img/yakult.png', name: 'Yakult' },
  { id: 7, logoUrl: '/src/assets/img/banxico.png', name: 'Banxico' },
  { id: 8, logoUrl: '/src/assets/img/bimbo.png', name: 'Bimbo' },
];

// Duplicamos la lista para el efecto infinito
const carouselData = [...companiesData, ...companiesData];



const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="app-container">
      
      {/* 1. BARRA DE NAVEGACIÓN (Ya implementada) */}
<header className="navbar-container">
  <nav className="navbar-floating">
    <div className="logo-box">
      <img 
        src={new URL('/src/assets/img/uttecam.png', import.meta.url).href} 
        alt="Logo UTTECAM" 
        className="logo-img" 
      />
    </div>

    <div className="nav-links">
      <button className="nav-link-btn">Iniciar Sesión</button>
      <button className="btn-register">Registrarse</button>
    </div>
  </nav>
</header>

      <main>
        {/* 2. SECCIÓN PRINCIPAL (HERO) (Ya implementada) */}
        <section className="hero-section" data-aos="fade-up">
          {/* ... contenido hero existente ... */}
          {/* Lado Izquierdo: Textos y Buscador */}
          <div className="hero-content" data-aos="fade-left">
            <span className="badge">
              NUEVAS VACANTES AGREGADAS
            </span>
            
            <h1 className="hero-title">
              Tu próximo gran <span className="highlight">reto profesional</span> empieza aquí.
            </h1>
            
            <p className="hero-subtitle">
              Conecta con las mejores empresas y da el siguiente paso en tu vida profesional.
            </p>

          <div className="hero-cta-wrapper">
            <button className="btn-hero-main">
              Comenzar ahora
            </button>
            <p className="hero-trust-text">
              Con la confianza de las mejores empresas del sector
            </p>
          </div>
</div>
          {/* Lado Derecho: Imagen */}
          <div className="hero-image-container" data-aos="fade-right">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
              alt="Profesional" 
              className="hero-image" 
            />
            
            <div className="floating-card">
              <div className="floating-icon-wrapper">
                <div className="floating-icon-inner"></div>
              </div>
              <div className="floating-text">
                <p className="floating-title">Nueva vacante en Audi</p>
                <p className="floating-subtitle">Ingeniero de Procesos</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* NUEVAS SECCIONES A PARTIR DE AQUÍ */}
        {/* ========================================= */}

        {/* 3. SECCIÓN ESTADÍSTICAS PRINCIPALES */}
        <section className="stats-section" data-aos="fade-up">
          <div className="stats-grid">
            <div className="stat-item">
              <h2>24k+</h2>
              <p>EMPLEOS ACTIVOS</p>
            </div>
            <div className="stat-item">
              <h2>5k+</h2>
              <p>EMPRESAS</p>
            </div>
            <div className="stat-item">
              <h2>12k+</h2>
              <p>CONTRATACIONES</p>
            </div>
            <div className="stat-item">
              <h2>98%</h2>
              <p>TASA DE ÉXITO</p>
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN CARACTERISTICAS */}
{/* ========================================= */}
            <section className="features-section" data-aos="fade-up">
          <div className="section-header centered">
            <h2 className="section-title">Nuestras Características</h2>
            <p className="section-subtitle">Lo que hace única a la Bolsa de Trabajo UTTECAM.</p>
          </div>

          <div className="features-grid">
            {/* 1. Característica de Seguridad */}
            <div className="feature-card glass-effect">
              <div className="feature-icon-wrapper orange-glow">
                {/* Reutilizamos 'Share' como marcador. Luego cámbialo por 'ShieldCheck' u otro */}
                <Share size={32} />
              </div>
              <p className="feature-card-desc">
                Garantizamos tu seguridad validando administrativamente cada empresa y publicación de vacantes.
              </p>
            </div>

            {/* 2. Característica de Exclusividad */}
            <div className="feature-card glass-effect">
              <div className="feature-icon-wrapper green-glow">
                {/* Reutilizamos 'Monitor' como marcador. Luego cámbialo por 'Medal' u otro */}
                <Monitor size={32} />
              </div>
              <p className="feature-card-desc">
                Canal exclusivo para estudiantes y egresados de la UTTECAM directamente con el sector productivo.
              </p>
            </div>

            {/* 3. Característica de Seguimiento CV */}
            <div className="feature-card glass-effect">
              <div className="feature-icon-wrapper teal-glow">
                {/* Reutilizamos 'MapPin' como marcador. Luego cámbialo por 'FileText' u otro */}
                <MapPin size={32} />
              </div>
              <p className="feature-card-desc">
                Sube tu currículum y da seguimiento al estado de tus postulaciones en tiempo real.
              </p>
            </div>
          </div>
        </section>

        {/* 5. SECCIÓN EMPRESAS DESTACADAS */}
        <section className="companies-section" data-aos="fade-up">
          <div className="section-header centered">
            <h2 className="section-title">Empresas Destacadas</h2>
            <p className="section-subtitle">Únete a los equipos más innovadores del mundo hoy.</p>
          </div>

<div className="carousel-container">
    <div className="carousel-track">
      {carouselData.map((company, index) => (
        <div key={`${company.id}-${index}`} className="company-carousel-item">
          <img 
            src={new URL(company.logoUrl, import.meta.url).href} 
            alt={company.name} 
            className="company-logo-carousel" 
          />
        </div>
            ))}
            </div>
          </div>
        </section>

<section className="cta-section-compact" data-aos="fade-up">
  <div className="cta-card">
    <div className="cta-content-left">
      <span className="cta-badge">Bolsa de Trabajo UTTECAM</span>
      <h2>Impulsa tu futuro profesional</h2>
      <p>
        Conectamos el talento universitario con las mejores oportunidades del sector productivo. 
        Un espacio exclusivo para estudiantes y egresados.
      </p>
      <div className="cta-actions">
        <button className="btn-hero-main" onClick={() => setIsModalOpen(true)}>
          Saber más
        </button>
      </div>
    </div>
    
    <div className="cta-visual-right">
      <div className="glass-icon-container">
        <Monitor size={60} />
      </div>
    </div>
  </div>

  {/* Modal Simple */}
{isModalOpen && (
  <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
    <div className="modal-content-premium" onClick={e => e.stopPropagation()}>
      {/* Botón X para cerrar en la esquina */}
      <button className="modal-close-x" onClick={() => setIsModalOpen(false)}>×</button>
      
      <div className="modal-header">
        <div className="modal-icon-main">
          <BriefcaseBusiness size={32} />
        </div>
        <h3>Explora la Bolsa de Trabajo</h3>
        <p className="modal-tagline">Tu puente directo al éxito profesional en la región.</p>
      </div>

      <div className="modal-body-grid">
        <div className="modal-feature-item">
          <div className="feature-dot green"></div>
          <div>
            <h4>Validación Institucional</h4>
            <p>Todas las empresas y vacantes son revisadas por el departamento de Vinculación.</p>
          </div>
        </div>

        <div className="modal-feature-item">
          <div className="feature-dot orange"></div>
          <div>
            <h4>Seguimiento en Vivo</h4>
            <p>Conoce en qué etapa se encuentra tu postulación y recibe notificaciones directas.</p>
          </div>
        </div>

        <div className="modal-feature-item">
          <div className="feature-dot teal"></div>
          <div>
            <h4>CV Inteligente</h4>
            <p>Crea un perfil profesional que destaque tus habilidades técnicas y académicas.</p>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn-modal-primary" onClick={() => setIsModalOpen(false)}>
          Entendido, ¡gracias!
        </button>
      </div>
    </div>
  </div>
)}
</section>

      </main>
{/* ========================================= */}
        {/* SECCIÓN 7: FOOTER (ACTUALIZADO CON CONTACTO) */}
        {/* ========================================= */}
        
<footer className="footer-premium">
  <div className="footer-content">
    
    {/* Columna 1: Logo e Info General */}
    <div className="footer-column info">
      <div className="footer-logo">
        <img 
          src={new URL('/src/assets/img/uttecam.png', import.meta.url).href} 
          alt="Logo UTTECAM" 
          className="footer-logo-img" 
        />
      </div>
      <p className="footer-desc">
        Conectando el talento universitario de la Universidad Tecnológica de Tecamachalco con el sector productivo.
      </p>
    </div>

    {/* Columna 2: Información de Contacto (Manteniendo tu diseño) */}
    <div className="footer-column contact-full">
      <h4 className="footer-title teal-dot">Contáctanos</h4>
      <ul className="detailed-contact-list">
        <li className="contact-item align-top">
          <MapPin className="contact-icon" size={20} />
          <div>
            <strong>Dirección:</strong><br />
            Av. Universidad Tecnológica 1,<br />
            Barrio la Villita, 75483 Tecamachalco, Pue.
          </div>
        </li>
        <li className="contact-item">
          <Phone className="contact-icon" size={20} />
          <div><strong>Tel:</strong> +52-249-422-3303</div>
        </li>
        <li className="contact-item">
          <Clock className="contact-icon" size={20} />
          <div><strong>Horario:</strong> de 9:00 a 17:00</div>
        </li>
        <li className="contact-item align-top">
          <Mail className="contact-icon" size={20} />
          <div>
            <strong>Email:</strong><br />
            <a href="mailto:rectoria@uttecam.edu.mx">rectoria@uttecam.edu.mx</a><br />
            <a href="mailto:extensionuniversitaria@uttecam.edu.mx">extensionuniversitaria@uttecam.edu.mx</a>
          </div>
        </li>
      </ul>
    </div>

    {/* Columna 3: Google Maps API / Iframe (NUEVO) */}
    <div className="footer-column map-container">
      <h4 className="footer-title orange-dot">Ubicación</h4>
      <div className="google-map-wrapper">
        <iframe
          title="Ubicación UTTECAM"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.5089738389467!2d-97.72309!3d18.8651353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cfbf640db83211%3A0x86fce97bd24ed08e!2sUniversidad%20Tecnol%C3%B3gica%20de%20Tecamachalco!5e0!3m2!1ses!2smx!4v1712752800000"
          width="100%"
          height="220"
          style={{ border: 0, borderRadius: '15px' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>

  </div>

  <div className="footer-bottom">
    <p>&copy; {new Date().getFullYear()} Universidad Tecnológica de Tecamachalco. Todos los derechos reservados.</p>
  </div>
</footer>
    </div>
  );
};

export default App;