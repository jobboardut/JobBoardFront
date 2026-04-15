import { BriefcaseBusiness, Building2, MapPin } from 'lucide-react'

export const PublicationDetail = () => {
  return (
    <article className="publication-scroll h-full overflow-y-auto rounded-xl border border-[#e7e1d9] bg-white p-5 shadow-[0_3px_15px_rgba(23,34,55,0.06)]">
      <div className="flex flex-col gap-4 border-b border-[#ece8e1] pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-18 w-18 place-items-center rounded-xl border border-[#ded8cf] bg-[#f7f6f4] text-[#009A4D]">
            <BriefcaseBusiness size={34} strokeWidth={1.7} />
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Ingeniero De Requerimientos
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-2xl text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={18} />
                Grupo Salinas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={18} />
                Tlalpan, Ciudad de Mexico
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-400">Hace 3 Dias</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-[#f4f3f2] p-3">
          <p className="text-sm text-slate-400">Rango de Salario</p>
          <p className="mt-1 text-lg font-semibold text-[#009A4D]">$45,000 - $75,000</p>
        </div>
        <div className="rounded-xl bg-[#f4f3f2] p-3">
          <p className="text-sm text-slate-400">Turno y horario</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">Lunes a Viernes</p>
        </div>
        <div className="rounded-xl bg-[#f4f3f2] p-3">
          <p className="text-sm text-slate-400">Tipo de Trabajo</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">Tiempo Completo</p>
        </div>
        <div className="rounded-xl bg-[#f4f3f2] p-3">
          <p className="text-sm text-slate-400">Experiencia</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">1 a 3 años</p>
        </div>
      </div>

      <div className="mt-5 px-1 text-slate-600">
        <h2 className="text-3xl font-semibold text-slate-900">Descripcion completa del empleo</h2>
        <p className="mt-2 text-xl leading-relaxed">
          Es una empresa dedicada a trabajar para las marcas, negocios y personas a traves de
          investigacion, estrategia, creatividad, tecnologia y ejecucion con el unico objetivo de crear
          exito para nuestros clientes.
        </p>

        <h3 className="mt-4 text-2xl font-semibold text-slate-800">Responsabilidades principales</h3>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-lg leading-relaxed">
          <li>Coordinacion de proyectos de marketing</li>
          <li>Planificar, coordinar y supervisar la ejecucion de proyectos de marketing.</li>
          <li>Gestionar tareas diarias</li>
          <li>Gestionar las tareas diarias del equipo de marketing junto al director de Marketing.</li>
          <li>Coordinar y colaborar con los equipos de Sr. Content Developer, Sr. Crossmedia Designer, y Social Media Manager en la ejecucion de estrategias inbound.</li>
          <li>Seguimiento y reporte de metricas de desempeno</li>
          <li>Realizar reportes y analisis sobre los resultados de las campanas de marketing.</li>
          <li>Optimizacion de procesos</li>
          <li>Identificar oportunidades para mejorar los procesos de trabajo y la eficiencia del equipo de marketing.</li>
        </ul>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-[#009A4D] px-7 py-2.5 text-lg font-semibold text-white transition hover:bg-[#10B981]"
        >
          Postularse
        </button>
      </div>
    </article>
  )
}
