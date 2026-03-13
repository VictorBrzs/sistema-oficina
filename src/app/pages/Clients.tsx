import { useState, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { AddClientModal } from "../components/AddClientModal";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function Clients() {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2f9023b`;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${apiUrl}/clients`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setClients(result.data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (clientData: any) => {
    try {
      const response = await fetch(`${apiUrl}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(clientData),
      });
      const result = await response.json();
      if (result.success) {
        await fetchClients();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      const response = await fetch(`${apiUrl}/clients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        await fetchClients();
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gerencie sua base de clientes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#9ACD32] text-black px-4 py-2.5 rounded-lg hover:bg-[#7BA428] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Adicionar Cliente
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum cliente cadastrado. Clique em "Adicionar Cliente" para começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    ID Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Nome do Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Telefone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Serviço Realizado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Data do Serviço
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Valor (R$)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client: any) => (
                  <tr key={client.key} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {client.value.clientId}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{client.value.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{client.value.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{client.value.service}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{client.value.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {client.value.value}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteClient(client.key)}
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

      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddClient}
      />
    </div>
  );
}
