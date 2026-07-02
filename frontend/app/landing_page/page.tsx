import {
  Bell,
  CalendarDays,
  ChevronDown,
  FileText,
  LayoutGrid,
  Menu,
  Search,
  ShieldCheck,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Gestão de Usuários", icon: Users },
  { label: "Gestão Pedagógica", icon: ShieldCheck },
  { label: "Controle Diário", icon: FileText },
  { label: "Competições", icon: Trophy },
  { label: "Site / Marketing", icon: LayoutGrid },
  { label: "Relatórios", icon: FileText },
];

const stats = [
  {
    value: "1,247",
    label: "Alunos Ativos",
    sub: "+12% vs mês",
    icon: Users,
    color: "text-emerald-400",
  },
  {
    value: "432",
    label: "Presença Hoje",
    sub: "87% de frequência",
    icon: FileText,
    color: "text-blue-400",
  },
  {
    value: "38",
    label: "Turmas Ativas",
    sub: "12 professores",
    icon: LayoutGrid,
    color: "text-cyan-400",
  },
  {
    value: "14",
    label: "Jogos Agendados",
    sub: "Esta semana",
    icon: Trophy,
    color: "text-sky-400",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#050816] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-65 bg-[#0b1120] p-6 hidden lg:block">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 w-10 h-10 flex items-center justify-center rounded-xl font-bold">
              EN
            </div>
            <div>
              <h1 className="font-bold text-lg">EscalaNet</h1>
              <p className="text-xs text-gray-400">Gestão Esportiva</p>
            </div>
          </div>
        </div>

        <div className="mb-6 text-xs text-gray-400">PERFIL ATIVO</div>

        <div className="bg-[#111827] p-3 rounded-lg mb-8 flex justify-between">
          Administrador <ChevronDown size={16} />
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  item.active
                    ? "bg-green-600/20 text-green-400"
                    : "hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex items-center gap-4 p-6 border-b border-white/10">
          <Menu />
          <div className="flex-1 bg-[#0b1120] p-3 rounded-xl flex gap-2">
            <Search size={16} />
            <input
              placeholder="Buscar..."
              className="bg-transparent outline-none w-full"
            />
          </div>
          <Bell />
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-1">
            Bem-vindo ao painel
          </h2>
          <p className="text-gray-400 mb-8">
            Visão geral do sistema
          </p>

          {/* BOTÕES */}
          <div className="flex gap-3 mb-8">
            <button className="bg-green-500 text-black px-4 py-2 rounded-lg">
              + Frequência
            </button>
            <button className="bg-[#0b1120] px-4 py-2 rounded-lg flex gap-2">
              <UserPlus size={16} /> Novo Aluno
            </button>
            <button className="bg-[#0b1120] px-4 py-2 rounded-lg flex gap-2">
              <CalendarDays size={16} /> Agendar Jogo
            </button>
            <button className="bg-[#0b1120] px-4 py-2 rounded-lg flex gap-2">
              <FileText size={16} /> Relatório
            </button>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-[#0b1120] p-6 rounded-xl"
                >
                  <Icon className={item.color} />
                  <h3 className="text-2xl font-bold mt-3">
                    {item.value}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.sub}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ================= SEÇÕES ADICIONADAS ================= */}

          {/* FOTOS */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-5">Fotos</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0b1120] rounded-xl">
              <div className="bg-[#111827] h-32 rounded-lg" />
              <div className="bg-[#111827] h-32 rounded-lg" />
              <div className="bg-[#111827] h-32 rounded-lg" />
              <div className="bg-[#111827] h-32 rounded-lg" />
            </div>
          </div>

          {/* NOTÍCIAS */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-5">Notícias</h2>

            <div className="grid md:grid-cols-3 gap-4 p-4 bg-[#0b1120] rounded-xl">
              <div className="bg-[#111827] p-4 rounded-xl">
                <h3 className="font-bold">Novo campeonato</h3>
                <p className="text-sm text-gray-400">
                  Inscrições abertas
                </p>
              </div>

              <div className="bg-[#111827] p-4 rounded-xl">
                <h3 className="font-bold">Treinos atualizados</h3>
                <p className="text-sm text-gray-400">
                  Confira novos horários
                </p>
              </div>

              <div className="bg-[#111827] p-4 rounded-xl">
                <h3 className="font-bold">Vitória da equipe</h3>
                <p className="text-sm text-gray-400">
                  Resultado do último jogo
                </p>
              </div>
            </div>
          </div>

          {/* EVENTOS */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-5">Eventos</h2>

            <div className="space-y-3 p-4 bg-[#0b1120] rounded-xl">
              <div className="bg-[#111827] p-4 rounded-xl flex justify-between">
                <span>Jogo amistoso</span>
                <span className="text-gray-400">10/05</span>
              </div>

              <div className="bg-[#111827] p-4 rounded-xl flex justify-between">
                <span>Campeonato regional</span>
                <span className="text-gray-400">15/05</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}