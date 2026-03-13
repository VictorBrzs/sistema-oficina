import { Outlet, NavLink } from "react-router";
import { LayoutDashboard, Users, ClipboardList, Package } from "lucide-react";
import logo from "figma:asset/38726165bd32765396eb8ea9380fd737b3daad6b.png";

export function Layout() {
  const navItems = [
    { to: "/", label: "Tela Inicial", icon: LayoutDashboard, end: true },
    { to: "/clients", label: "Clientes", icon: Users },
    { to: "/service-orders", label: "Ordens de Serviço", icon: ClipboardList },
    { to: "/inventory", label: "Estoque", icon: Package },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <img src={logo} alt="Só Pra Motos" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-[#9ACD32]">Só Pra Motos</h1>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">BETINHO</p>
          <p className="text-xs text-gray-500">(13) 99192-6522</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#9ACD32] text-black"
                        : "text-gray-300 hover:bg-gray-900"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500">
            Av. dos Corretores de Imóveis, 1053
          </div>
          <div className="text-xs text-gray-500">
            Samambaia, Praia Grande/SP
          </div>
          <div className="text-xs text-gray-600 mt-2">
            © 2026 Só Pra Motos
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}