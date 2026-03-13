import { useState, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { AddServiceOrderModal } from "../components/AddServiceOrderModal";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function ServiceOrders() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2f9023b`;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${apiUrl}/service-orders`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching service orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async (orderData: any) => {
    try {
      const response = await fetch(`${apiUrl}/service-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (result.success) {
        await fetchOrders();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding service order:", error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta ordem de serviço?")) return;

    try {
      const response = await fetch(`${apiUrl}/service-orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting service order:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-orange-100 text-orange-700";
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-700";
      case "Concluído":
        return "bg-[#9ACD32] bg-opacity-20 text-[#7BA428]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Ordens de Serviço</h1>
          <p className="text-gray-600 mt-2">Acompanhe e gerencie as ordens de serviço</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#9ACD32] text-black px-4 py-2.5 rounded-lg hover:bg-[#7BA428] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Criar Ordem de Serviço
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ordens de serviço..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent"
          />
        </div>
      </div>

      {/* Service Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma ordem de serviço cadastrada. Clique em "Criar Ordem de Serviço" para
            começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Placa da Moto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Nome do Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Código do Serviço
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Serviço
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <tr key={order.key} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-medium text-gray-900">
                        {order.value.plate}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {order.value.clientName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-gray-900">
                        {order.value.serviceCode}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{order.value.service}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.value.status
                        )}`}
                      >
                        {order.value.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{order.value.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteOrder(order.key)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddServiceOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddOrder}
      />
    </div>
  );
}
