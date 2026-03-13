import { Users, ClipboardList, Package, DollarSign } from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      label: "Total de Clientes",
      value: "248",
      icon: Users,
      color: "bg-[#9ACD32]",
    },
    {
      label: "Ordens Abertas",
      value: "12",
      icon: ClipboardList,
      color: "bg-orange-500",
    },
    {
      label: "Peças em Estoque",
      value: "856",
      icon: Package,
      color: "bg-[#9ACD32]",
    },
    {
      label: "Receita Mensal",
      value: "R$ 24.580",
      icon: DollarSign,
      color: "bg-black",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      client: "João Silva",
      vehicle: "ABC1D23",
      status: "Em Andamento",
      date: "10/03/2026",
    },
    {
      id: 2,
      client: "Maria Souza",
      vehicle: "XYZ5F78",
      status: "Pendente",
      date: "11/03/2026",
    },
    {
      id: 3,
      client: "Pedro Santos",
      vehicle: "DEF9G12",
      status: "Em Andamento",
      date: "12/03/2026",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Tela Inicial</h1>
        <p className="text-gray-600 mt-2">Bem-vindo! Veja o que está acontecendo hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Service Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Ordens de Serviço Recentes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{order.client}</p>
                  <p className="text-sm text-gray-600">Placa: {order.vehicle}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Pendente"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-[#9ACD32] bg-opacity-20 text-[#7BA428]"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}