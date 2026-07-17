"use client";

import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail,
  Menu,
  Phone,
  Table,
  Newspaper,
  Image,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const banners = [
  {
    id: 1,
    title: "Acompanhe todos os jogos do seu time",
    subtitle: "Calendário, resultados, tabela e destaques em um só lugar",
    cta: "Ver jogos",
    link: "/dashboard",
    bg: "bg-linear-to-r from-green-600 to-emerald-700",
  },
  {
    id: 2,
    title: "Fique por dentro das notícias",
    subtitle: "Últimas atualizações dos campeonatos e times",
    cta: "Ver notícias",
    link: "#noticias",
    bg: "bg-linear-to-r from-blue-600 to-cyan-700",
  },
  {
    id: 3,
    title: "Resultados e tabelas atualizadas",
    subtitle: "Confira a classificação e os placares ao vivo",
    cta: "Ver tabela",
    link: "#eventos",
    bg: "bg-linear-to-r from-purple-600 to-pink-700",
  },
];

const noticias = [
  {
    id: 1,
    titulo: "Novo campeonato de futebol infantil começa no sábado",
    resumo: "10 times disputam o título da categoria sub-12",
    data: "15/05/2026",
    cor: "border-l-4 border-green-500",
  },
  {
    id: 2,
    titulo: "Treinos abertos para a torcida",
    resumo: "Confira os novos horários e participe",
    data: "12/05/2026",
    cor: "border-l-4 border-blue-500",
  },
  {
    id: 3,
    titulo: "Equipe principal vence clássico por 3 a 1",
    resumo: "Destaque para o artilheiro que marcou dois gols",
    data: "10/05/2026",
    cor: "border-l-4 border-yellow-500",
  },
  {
    id: 4,
    titulo: "Escola recebe homenagem por revelar talentos",
    resumo: "Jogadores formados na base conquistam destaque nacional",
    data: "08/05/2026",
    cor: "border-l-4 border-purple-500",
  },
];

const jogos = [
  {
    id: 1,
    titulo: "Flamengo vs Vasco",
    local: "Estádio do Maracanã",
    data: "20/05/2026 - 16:00",
    categoria: "Profissional",
  },
  {
    id: 2,
    titulo: "Sub-15: São Paulo vs Santos",
    local: "CT da Barra Funda",
    data: "25/05/2026 - 09:00",
    categoria: "Base",
  },
  {
    id: 3,
    titulo: "Treino aberto da equipe feminina",
    local: "Centro de Treinamento",
    data: "28/05/2026 - 14:00",
    categoria: "Treino",
  },
  {
    id: 4,
    titulo: "Final do Campeonato Sub-12",
    local: "Campo do Parque",
    data: "30/05/2026 - 10:00",
    categoria: "Final",
  },
];

export default function LandingPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    const timer = setTimeout(() => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, 0);
    return () => {
      emblaApi.off("select", onSelect);
      clearTimeout(timer);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  // Slider de notícias
  const [emblaNoticiasRef, emblaNoticiasApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
    },
  });

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-[#050816]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-black">
                EN
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none">EscalaNet</h1>
                <p className="text-[10px] text-gray-400 leading-none">Esportes</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              {["Jogos", "Notícias", "Contato"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:block text-sm text-gray-300 hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/dashboard"
                className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400 transition flex items-center gap-1"
              >
                Acessar <ArrowRight size={16} />
              </Link>
              <button className="md:hidden">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {banners.map((banner) => (
                <div key={banner.id} className="flex-[0_0_100%] min-w-0">
                  <div
                    className={`${banner.bg} p-10 sm:p-16 rounded-2xl flex flex-col items-start justify-center min-h-100`}
                  >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                      {banner.title}
                    </h2>
                    <p className="text-lg text-white/90 max-w-lg mb-6">
                      {banner.subtitle}
                    </p>
                    <Link
                      href={banner.link}
                      className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      {banner.cta} <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center gap-2 mt-4">
            {banners.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === selectedIndex ? "bg-green-500 w-8" : "bg-white/30"
                }`}
                onClick={() => emblaApi && emblaApi.scrollTo(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="jogos" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0b1120]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-400 font-semibold text-sm mb-2">ACOMPANHE O ESPORTE</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tudo sobre os campeonatos da região
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calendário de jogos, resultados, notícias e fotos para você não perder nada.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: "Calendário de Jogos",
                desc: "Veja a programação completa de partidas, horários e locais.",
              },
              {
                icon: Table,
                title: "Tabelas de classificação",
                desc: "Acompanhe os placares e a classificação dos times.",
              },
              {
                icon: Newspaper,
                title: "Notícias e Destaques",
                desc: "Fique por dentro das últimas notícias dos campeonatos.",
              },
              {
                icon: Image,
                title: "Fotos e Vídeos",
                desc: "Galeria de imagens e melhores momentos das partidas.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#0b1120] p-6 rounded-xl border border-white/5 hover:border-green-500/30 transition group"
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition">
                  <item.icon className="text-green-400" size={24} />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="noticias" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-green-400 font-semibold text-sm mb-1">NOTÍCIAS</p>
              <h2 className="text-3xl font-bold">Últimas do esporte</h2>
            </div>
            <Link
              href="/noticias"
              className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
            >
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-hidden" ref={emblaNoticiasRef}>
            <div className="flex gap-4">
              {noticias.map((noticia) => (
                <div
                  key={noticia.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0"
                >
                  <div
                    className={`bg-[#0b1120] p-5 rounded-xl border border-white/5 ${noticia.cor} pl-6`}
                  >
                    <p className="text-xs text-gray-400">{noticia.data}</p>
                    <h3 className="font-bold text-lg mt-1">{noticia.titulo}</h3>
                    <p className="text-sm text-gray-400 mt-1">{noticia.resumo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => emblaNoticiasApi && emblaNoticiasApi.scrollPrev()}
              className="bg-[#0b1120] p-2 rounded-full hover:bg-[#1a2332] transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => emblaNoticiasApi && emblaNoticiasApi.scrollNext()}
              className="bg-[#0b1120] p-2 rounded-full hover:bg-[#1a2332] transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <section id="eventos" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0b1120]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-green-400 font-semibold text-sm mb-1">PRÓXIMOS JOGOS</p>
              <h2 className="text-3xl font-bold">Não perca nenhuma partida</h2>
            </div>
            <Link
              href="/eventos"
              className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
            >
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {jogos.map((jogo) => (
              <div
                key={jogo.id}
                className="bg-[#0b1120] p-5 rounded-xl border border-white/5 hover:border-green-500/30 transition"
              >
                <span className="inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full mb-3">
                  {jogo.categoria}
                </span>
                <h3 className="font-bold text-lg mb-1">{jogo.titulo}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <MapPin size={14} /> {jogo.local}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                  <Clock size={14} /> {jogo.data}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contato" className="border-t border-white/10 pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-500 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-black text-sm">
                  EN
                </div>
                <span className="font-bold">EscalaNet</span>
              </div>
              <p className="text-sm text-gray-400">Portal esportivo gratuito</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Conteúdo</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Jogos</li>
                <li>Notícias</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Sobre</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail size={14} /> contato@escalanet.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} /> (11) 99999-9999
                </li>
              </ul>
              <div className="flex gap-3 mt-4">
                <span className="text-gray-400 hover:text-white cursor-pointer">Instagram</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">YouTube</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">LinkedIn</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-400">
            © 2026 EscalaNet. Todos os direitos reservados. Acesso gratuito.
          </div>
        </div>
      </footer>
    </div>
  );
}
// "use client";

// import {
//   ArrowRight,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Mail,
//   Menu,
//   Phone,
//   Table,
//   Newspaper,
//   Image,
//   MapPin,
//   Clock,
// } from "lucide-react";
// import Link from "next/link";
// import { useState, useEffect, useCallback } from "react";
// import useEmblaCarousel from "embla-carousel-react";


// const banners = [
//   {
//     id: 1,
//     title: "Acompanhe todos os jogos do seu time",
//     subtitle: "Calendário, resultados, tabela e destaques em um só lugar",
//     cta: "Ver jogos",
//     link: "/dashboard",
//     bg: "bg-linear-to-r from-green-600 to-emerald-700",
//   },
//   {
//     id: 2,
//     title: "Fique por dentro das notícias",
//     subtitle: "Últimas atualizações dos campeonatos e times",
//     cta: "Ver notícias",
//     link: "#noticias",
//     bg: "bg-linear-to-r from-blue-600 to-cyan-700",
//   },
//   {
//     id: 3,
//     title: "Resultados e tabelas atualizadas",
//     subtitle: "Confira a classificação e os placares ao vivo",
//     cta: "Ver tabela",
//     link: "#eventos",
//     bg: "bg-linear-to-r from-purple-600 to-pink-700",
//   },
// ];


// const noticias = [
//   {
//     id: 1,
//     titulo: "Novo campeonato de futebol infantil começa no sábado",
//     resumo: "10 times disputam o título da categoria sub-12",
//     data: "15/05/2026",
//     cor: "border-l-4 border-green-500",
//   },
//   {
//     id: 2,
//     titulo: "Treinos abertos para a torcida",
//     resumo: "Confira os novos horários e participe",
//     data: "12/05/2026",
//     cor: "border-l-4 border-blue-500",
//   },
//   {
//     id: 3,
//     titulo: "Equipe principal vence clássico por 3 a 1",
//     resumo: "Destaque para o artilheiro que marcou dois gols",
//     data: "10/05/2026",
//     cor: "border-l-4 border-yellow-500",
//   },
//   {
//     id: 4,
//     titulo: "Escola recebe homenagem por revelar talentos",
//     resumo: "Jogadores formados na base conquistam destaque nacional",
//     data: "08/05/2026",
//     cor: "border-l-4 border-purple-500",
//   },
// ];


// const jogos = [
//   {
//     id: 1,
//     titulo: "Flamengo vs Vasco",
//     local: "Estádio do Maracanã",
//     data: "20/05/2026 - 16:00",
//     categoria: "Profissional",
//   },
//   {
//     id: 2,
//     titulo: "Sub-15: São Paulo vs Santos",
//     local: "CT da Barra Funda",
//     data: "25/05/2026 - 09:00",
//     categoria: "Base",
//   },
//   {
//     id: 3,
//     titulo: "Treino aberto da equipe feminina",
//     local: "Centro de Treinamento",
//     data: "28/05/2026 - 14:00",
//     categoria: "Treino",
//   },
//   {
//     id: 4,
//     titulo: "Final do Campeonato Sub-12",
//     local: "Campo do Parque",
//     data: "30/05/2026 - 10:00",
//     categoria: "Final",
//   },
// ];

// export default function LandingPage() {
  
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     emblaApi.on("select", onSelect);
//     const timer = setTimeout(() => {
//       setSelectedIndex(emblaApi.selectedScrollSnap());
//     }, 0);
//     return () => {
//       emblaApi.off("select", onSelect);
//       clearTimeout(timer);
//     };
//   }, [emblaApi, onSelect]);

//   const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
//   const scrollNext = () => emblaApi && emblaApi.scrollNext();

//   const [emblaNoticiasRef, emblaNoticiasApi] = useEmblaCarousel({
//     loop: true,
//     align: "start",
//     slidesToScroll: 1,
//     breakpoints: {
//       "(min-width: 768px)": { slidesToScroll: 2 },
//     },
//   });

//   return (
//     <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
  
//       <header className="fixed top-0 w-full z-50 bg-[#050816]/80 backdrop-blur-xl border-b border-white/5">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-2">
//               <div className="bg-green-500 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-black">
//                 EN
//               </div>
//               <div>
//                 <h1 className="font-bold text-lg leading-none">EscalaNet</h1>
//                 <p className="text-[10px] text-gray-400 leading-none">Esportes</p>
//               </div>
//             </div>
//             <nav className="hidden md:flex items-center gap-8 text-sm">
//               {["Jogos", "Notícias", "Contato"].map((item) => (
//                 <a
//                   key={item}
//                   href={`#${item.toLowerCase()}`}
//                   className="text-gray-300 hover:text-white transition"
//                 >
//                   {item}
//                 </a>
//               ))}
//             </nav>
//             <div className="flex items-center gap-3">
//               <Link
//                 href="/dashboard"
//                 className="hidden sm:block text-sm text-gray-300 hover:text-white"
//               >
//                 Entrar
//               </Link>
//               <Link
//                 href="/dashboard"
//                 className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400 transition flex items-center gap-1"
//               >
//                 Acessar <ArrowRight size={16} />
//               </Link>
//               <button className="md:hidden">
//                 <Menu size={24} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
//         <div className="max-w-7xl mx-auto relative">
//           <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
//             <div className="flex">
//               {banners.map((banner) => (
//                 <div key={banner.id} className="flex-[0_0_100%] min-w-0">
//                   <div
//                     className={`${banner.bg} p-10 sm:p-16 rounded-2xl flex flex-col items-start justify-center min-h-100`}
//                   >
//                     <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
//                       {banner.title}
//                     </h2>
//                     <p className="text-lg text-white/90 max-w-lg mb-6">
//                       {banner.subtitle}
//                     </p>
//                     <Link
//                       href={banner.link}
//                       className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center gap-2"
//                     >
//                       {banner.cta} <ArrowRight size={18} />
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <button
//             onClick={scrollPrev}
//             className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <button
//             onClick={scrollNext}
//             className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
//           >
//             <ChevronRight size={24} />
//           </button>

//           <div className="flex justify-center gap-2 mt-4">
//             {banners.map((_, idx) => (
//               <button
//                 key={idx}
//                 className={`w-3 h-3 rounded-full transition-all ${
//                   idx === selectedIndex ? "bg-green-500 w-8" : "bg-white/30"
//                 }`}
//                 onClick={() => emblaApi && emblaApi.scrollTo(idx)}
//               />
//             ))}
//           </div>
//         </div>
//       </section>


//       <section id="jogos" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0b1120]/50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12">
//             <p className="text-green-400 font-semibold text-sm mb-2">ACOMPANHE O ESPORTE</p>
//             <h2 className="text-3xl sm:text-4xl font-bold mb-4">
//               Tudo sobre os campeonatos da região
//             </h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               Calendário de jogos, resultados, notícias e fotos para você não perder nada.
//             </p>
//           </div>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               {
//                 icon: Calendar,
//                 title: "Calendário de Jogos",
//                 desc: "Veja a programação completa de partidas, horários e locais.",
//               },
//               {
//                 icon: Table,
//                 title: "Tabelas de classificação",
//                 desc: "Acompanhe os placares e a classificação dos times.",
//               },
//               {
//                 icon: Newspaper,
//                 title: "Notícias e Destaques",
//                 desc: "Fique por dentro das últimas notícias dos campeonatos.",
//               },
//               {
//                 icon: Image,
//                 title: "Fotos e Vídeos",
//                 desc: "Galeria de imagens e melhores momentos das partidas.",
//               },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="bg-[#0b1120] p-6 rounded-xl border border-white/5 hover:border-green-500/30 transition group"
//               >
//                 <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition">
//                   <item.icon className="text-green-400" size={24} />
//                 </div>
//                 <h3 className="font-bold mb-2">{item.title}</h3>
//                 <p className="text-sm text-gray-400">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

      
//       <section id="noticias" className="py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-between items-center mb-10">
//             <div>
//               <p className="text-green-400 font-semibold text-sm mb-1">NOTÍCIAS</p>
//               <h2 className="text-3xl font-bold">Últimas do esporte</h2>
//             </div>
//             <Link
//               href="/noticias"
//               className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
//             >
//               Ver todas <ArrowRight size={16} />
//             </Link>
//           </div>

//           <div className="overflow-hidden" ref={emblaNoticiasRef}>
//             <div className="flex gap-4">
//               {noticias.map((noticia) => (
//                 <div
//                   key={noticia.id}
//                   className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0"
//                 >
//                   <div
//                     className={`bg-[#0b1120] p-5 rounded-xl border border-white/5 ${noticia.cor} pl-6`}
//                   >
//                     <p className="text-xs text-gray-400">{noticia.data}</p>
//                     <h3 className="font-bold text-lg mt-1">{noticia.titulo}</h3>
//                     <p className="text-sm text-gray-400 mt-1">{noticia.resumo}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-center gap-3 mt-6">
//             <button
//               onClick={() => emblaNoticiasApi && emblaNoticiasApi.scrollPrev()}
//               className="bg-[#0b1120] p-2 rounded-full hover:bg-[#1a2332] transition"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={() => emblaNoticiasApi && emblaNoticiasApi.scrollNext()}
//               className="bg-[#0b1120] p-2 rounded-full hover:bg-[#1a2332] transition"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </div>
//         </div>
//       </section>

      
//       <section id="eventos" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0b1120]/50">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-between items-center mb-10">
//             <div>
//               <p className="text-green-400 font-semibold text-sm mb-1">PRÓXIMOS JOGOS</p>
//               <h2 className="text-3xl font-bold">Não perca nenhuma partida</h2>
//             </div>
//             <Link
//               href="/eventos"
//               className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
//             >
//               Ver todos <ArrowRight size={16} />
//             </Link>
//           </div>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {jogos.map((jogo) => (
//               <div
//                 key={jogo.id}
//                 className="bg-[#0b1120] p-5 rounded-xl border border-white/5 hover:border-green-500/30 transition"
//               >
//                 <span className="inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full mb-3">
//                   {jogo.categoria}
//                 </span>
//                 <h3 className="font-bold text-lg mb-1">{jogo.titulo}</h3>
//                 <p className="text-sm text-gray-400 flex items-center gap-2">
//                   <MapPin size={14} /> {jogo.local}
//                 </p>
//                 <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
//                   <Clock size={14} /> {jogo.data}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

      
//       <section id="acesso" className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="inline-block bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full text-sm text-green-400 mb-6">
//             ACESSO LIVRE E GRATUITO
//           </div>
//           <h2 className="text-3xl sm:text-4xl font-bold mb-6">
//             Acompanhe o esporte <span className="bg-linear-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">sem custo</span>
//           </h2>
//           <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
//             Veja jogos, resultados, notícias e fotos. Tudo disponível para você, onde quiser.
//           </p>
//           <div className="grid sm:grid-cols-3 gap-6 mb-10">
//             {[
//               { icon: "⚽", text: "Jogos ao vivo" },
//               { icon: "📊", text: "Tabelas atualizadas" },
//               { icon: "📰", text: "Notícias diárias" },
//             ].map((item) => (
//               <div key={item.text} className="bg-[#0b1120] p-4 rounded-xl border border-white/5">
//                 <span className="text-2xl block mb-2">{item.icon}</span>
//                 <p className="text-sm text-gray-300">{item.text}</p>
//               </div>
//             ))}
//           </div>
//           <Link
//             href="/dashboard"
//             className="bg-green-500 text-black px-8 py-4 rounded-xl font-semibold hover:bg-green-400 transition inline-flex items-center gap-2 text-lg"
//           >
//             Acessar agora <ArrowRight size={20} />
//           </Link>
//         </div>
//       </section>

//       {/* ========== FOOTER ========== */}
//       <footer id="contato" className="border-t border-white/10 pt-12 pb-6 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="bg-green-500 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-black text-sm">
//                   EN
//                 </div>
//                 <span className="font-bold">EscalaNet</span>
//               </div>
//               <p className="text-sm text-gray-400">Portal esportivo gratuito</p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-3">Conteúdo</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li>Jogos</li>
//                 <li>Notícias</li>
//                 <li>Contato</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-3">Empresa</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li>Sobre</li>
//                 <li>Blog</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-3">Contato</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li className="flex items-center gap-2">
//                   <Mail size={14} /> contato@escalanet.com
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Phone size={14} /> (11) 99999-9999
//                 </li>
//               </ul>
//               <div className="flex gap-3 mt-4">
//                 <span className="text-gray-400 hover:text-white cursor-pointer">Instagram</span>
//                 <span className="text-gray-400 hover:text-white cursor-pointer">YouTube</span>
//                 <span className="text-gray-400 hover:text-white cursor-pointer">LinkedIn</span>
//               </div>
//             </div>
//           </div>
//           <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-400">
//             © 2026 EscalaNet. Todos os direitos reservados. Acesso gratuito.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
