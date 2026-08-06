import { useState } from 'react'
import { ArrowRight, BriefcaseBusiness, GraduationCap, MapPin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import campusImg from '@/assets/images/campus.png'
import logoBlanco from '@/assets/images/logoblanco.png'
import './landing.css'

type CompanyLogo = {
  name: string
  /** Sector y zona; se muestra bajo el nombre. */
  sector: string
  website: string
  /** Opcional: si no hay logotipo disponible se muestra solo el nombre. */
  logoUrl?: string
}

const heroPhotoUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200'

// Industria con presencia real en Puebla y la region de Tecamachalco.
// El agro y la avicultura son el motor de la zona; el corredor automotriz
// concentra el empleo industrial del estado.
const companies: CompanyLogo[] = [
  {
    name: 'Volkswagen de Mexico',
    sector: 'Automotriz - Puebla',
    logoUrl: 'https://cdn.simpleicons.org/volkswagen/001E50',
    website: 'https://www.vw.com.mx',
  },
  {
    name: 'Audi Mexico',
    sector: 'Automotriz - San Jose Chiapa',
    logoUrl: 'https://cdn.simpleicons.org/audi/111827',
    website: 'https://www.audi.com.mx',
  },
  {
    name: 'Bachoco',
    sector: 'Avicultura - Tecamachalco',
    website: 'https://www.bachoco.com.mx',
  },
  {
    name: 'Granjas Carroll',
    sector: 'Agroindustria - Valle de Perote',
    website: 'https://www.granjascarroll.com',
  },
  {
    name: 'Ternium',
    sector: 'Acero - Puebla',
    website: 'https://mx.ternium.com',
  },
  {
    name: 'Grupo Bimbo',
    sector: 'Alimentos - Puebla',
    website: 'https://www.grupobimbo.com',
  },
  {
    name: 'Cementos Moctezuma',
    sector: 'Construccion - Tepetzingo',
    website: 'https://www.cmoctezuma.com.mx',
  },
  {
    name: 'Pemex',
    sector: 'Energia - Nacional',
    logoUrl: 'https://cdn.simpleicons.org/pemex/CC0000',
    website: 'https://www.pemex.com',
  },
]

const carouselCompanies = [...companies, ...companies]

/** Iniciales para las empresas sin logotipo disponible. */
const getMonogram = (name: string): string => {
  // Se omiten conectores, pero no "Grupo": distingue nombres que comparten inicial.
  const words = name.split(' ').filter((word) => !/^(de|del|la|el|los|las)$/i.test(word))

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

const CompanyLogoCard = ({ company }: { company: CompanyLogo }) => {
  // No todas las empresas regionales tienen logotipo publico: las que faltan
  // usan un monograma para que todas las tarjetas se vean igual de acabadas.
  const [hasLogo, setHasLogo] = useState(Boolean(company.logoUrl))

  return (
    <a
      className="landing-company"
      href={company.website}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Visitar sitio de ${company.name}`}
    >
      <span className="landing-company__mark">
        {hasLogo && company.logoUrl ? (
          // Sin lazy: dentro del carrusel quedan fuera de vista y no se cargarian.
          <img src={company.logoUrl} alt="" onError={() => setHasLogo(false)} />
        ) : (
          <span className="landing-company__monogram" aria-hidden="true">
            {getMonogram(company.name)}
          </span>
        )}
      </span>

      <span className="landing-company__name">{company.name}</span>
      <span className="landing-company__sector">{company.sector}</span>
    </a>
  )
}

export const LandingPage = () => {
  return (
    <main className="landing-shell">
      <section className="landing-hero" style={{ backgroundImage: `url(${campusImg})` }}>
        <div className="landing-hero__shade" />

        {/* El acceso vive en los botones del hero: no se duplica aqui. */}
        <header className="landing-nav" aria-label="Navegacion principal">
          <Link to="/" className="landing-nav__brand" aria-label="Inicio UTTECAM">
            <img src={logoBlanco} alt="UTTECAM" />
          </Link>
        </header>

        <div className="landing-hero__content">
          <div className="landing-hero__copy">
            <h1>
              <span>Bolsa de</span>
              <span>Trabajo</span>
              <span>UTTECAM</span>
            </h1>

            <p>
              Un espacio para conectar estudiantes, egresados y empresas con oportunidades reales,
              validadas y listas para dar el siguiente paso profesional.
            </p>

            <div className="landing-hero__actions">
              <Link to="/login" className="landing-primary-button">
                Entrar a la plataforma
                <ArrowRight size={18} />
              </Link>
              <Link to="/registro" className="landing-secondary-button">
                Crear cuenta
              </Link>
            </div>
          </div>

          <figure className="landing-media-card">
            <img src={heroPhotoUrl} alt="Estudiantes revisando oportunidades profesionales" />
            <div className="landing-stats-list" aria-label="Resumen de la plataforma">
              <div className="landing-stat">
                <BriefcaseBusiness size={18} />
                <span>Vacantes activas</span>
                <strong>+120</strong>
              </div>
              <div className="landing-stat">
                <GraduationCap size={18} />
                <span>Talento UTTECAM</span>
                <strong>Estudiantes y egresados</strong>
              </div>
              <div className="landing-stat">
                <ShieldCheck size={18} />
                <span>Validacion</span>
                <strong>Empresas revisadas</strong>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section className="landing-companies" aria-labelledby="landing-companies-title">
        <div className="landing-section-heading">
          <span>Industria de la region</span>
          <h2 id="landing-companies-title">Oportunidades que se mueven contigo</h2>
          <p>
            Sectores y empresas con presencia en Puebla y la region de Tecamachalco, como referencia
            del campo profesional donde se desarrolla la comunidad UTTECAM.
          </p>
        </div>

        <div className="landing-marquee" aria-label="Carrusel de empresas destacadas">
          <div className="landing-marquee__track">
            {carouselCompanies.map((company, index) => (
              <CompanyLogoCard company={company} key={`${company.name}-${index}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="landing-proof">
        <div>
          <span className="landing-proof__label">UTTECAM Tecamachalco</span>
          <h2>Del aula al sector productivo, en un solo flujo.</h2>
        </div>
        <p>
          Empresas publican vacantes, administracion valida la informacion y estudiantes pueden postularse
          con seguimiento claro.
        </p>
        <div className="landing-proof__location">
          <MapPin size={18} />
          Tecamachalco, Puebla
        </div>
      </section>
    </main>
  )
}
