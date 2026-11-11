import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';

function IconeMorada() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s-7-6-7-11a7 7 0 1 1 14 0c0 5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconeTelefone() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeHorario() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeYoutube() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M23 12s0-3.2-.4-4.7c-.2-.9-.9-1.5-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4c-.8.2-1.5.8-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4c.8-.2 1.5-.8 1.7-1.7.4-1.5.4-4.7.4-4.7ZM9.8 15.3V8.7l6 3.3-6 3.3Z" />
    </svg>
  );
}

function IconeWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7C17.18 3.03 14.68 2 12.04 2Zm5.83 14.06c-.25.7-1.46 1.34-2 1.4-.54.06-1.17.09-1.9-.12-.44-.13-1-.32-1.72-.63-3.03-1.31-5-4.36-5.15-4.56-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41 0 .58.01.19.01.44-.07.68.52.25.6.86 2.1.93 2.25.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.62 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.65-.08.17-.2.75-.88.95-1.18.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.07.13.07.75-.18 1.45Z" />
    </svg>
  );
}

function IconeFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export default function FooterCompleto() {
  const config = useConfig();
  const anoAtual = new Date().getFullYear();

  const linksUteis = [
    { to: '/', label: 'Início' },
    { to: '/#aulas-destaque', label: 'Aulas gratuitas' },
    { to: '/#escolha-classe', label: 'Escolha a sua classe' },
    { to: '/perfil', label: 'Perfil' },
  ];

  const whatsappLink = config?.whatsapp_admin
    ? `https://wa.me/${config.whatsapp_admin.replace(/\D/g, '')}`
    : null;

  const youtubeUrl = config?.youtube_url || null;
  const facebookUrl = config?.facebook_url || null;

  const morada = config?.morada || null;
  const horario = config?.horario || null;
  const telefone = config?.whatsapp_admin || null;

  return (
    <footer className="mt-16 bg-[#0B2A5B] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-8 md:px-8 lg:pt-16 lg:pb-10">
        <div className="grid gap-10 md:grid-cols-4 md:gap-10">
          {/* Coluna 1 — Marca */}
          <div>
            <p className="font-display text-2xl font-semibold leading-tight">
              Segredos da Física
            </p>
            <p className="mt-1 text-sm font-medium text-white/60">
              Sala Virtual
            </p>
          </div>

          {/* Coluna 2 — Links úteis */}
          <div>
            <p className="text-base font-semibold text-white">
              Links úteis
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {linksUteis.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/70 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Fale connosco */}
          <div>
            <p className="text-base font-semibold text-white">
              Fale connosco
            </p>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              {morada && (
                <li className="flex items-center gap-3">
                  <IconeMorada />
                  <span>{morada}</span>
                </li>
              )}
              {telefone && (
                <li className="flex items-center gap-3">
                  <IconeTelefone />
                  <span>+{telefone.replace(/\D/g, '').replace(/^(\d{3})(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4') || telefone}</span>
                </li>
              )}
              {horario && (
                <li className="flex items-center gap-3">
                  <IconeHorario />
                  <span>{horario}</span>
                </li>
              )}
              {!morada && !telefone && !horario && (
                <li className="text-white/40">Informações de contacto brevemente.</li>
              )}
            </ul>
          </div>

          {/* Coluna 4 — Siga-nos */}
          <div>
            <p className="text-base font-semibold text-white">
              Siga-nos
            </p>
            <div className="mt-5 flex items-center gap-5 text-white/60">
              {youtubeUrl ? (
                <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label="YouTube" className="transition hover:text-white">
                  <IconeYoutube />
                </a>
              ) : (
                <span aria-label="YouTube (brevemente)">
                  <IconeYoutube />
                </span>
              )}

              {whatsappLink ? (
                <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="transition hover:text-white">
                  <IconeWhatsapp />
                </a>
              ) : (
                <span aria-label="WhatsApp (brevemente)">
                  <IconeWhatsapp />
                </span>
              )}

              {facebookUrl ? (
                <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="transition hover:text-white">
                  <IconeFacebook />
                </a>
              ) : (
                <span aria-label="Facebook (brevemente)">
                  <IconeFacebook />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-8 flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {anoAtual} Segredos da Física. Todos os direitos reservados.</span>
          <span>Desenvolvido pela SmartMetrics</span>
        </div>
      </div>
    </footer>
  );
}