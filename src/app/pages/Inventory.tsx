import { useState, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { AddProductModal } from "../components/AddProductModal";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function Inventory() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2f9023b`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/inventory`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const response = await fetch(`${apiUrl}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(productData),
      });
      const result = await response.json();
      if (result.success) {
        await fetchProducts();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta peça?")) return;

    try {
      const response = await fetch(`${apiUrl}/inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity < 20) return "text-red-600 bg-red-50";
    if (quantity < 50) return "text-yellow-600 bg-yellow-50";
    return "text-[#7BA428] bg-[#9ACD32] bg-opacity-20";
  };

  const lowStockCount = products.filter(
    (p: any) => p.value.quantity < 20
  ).length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Estoque</h1>
          <p className="text-gray-600 mt-2">Gerencie seu estoque de peças</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#9ACD32] text-black px-4 py-2.5 rounded-lg hover:bg-[#7BA428] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Adicionar Peça
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar peças..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ACD32] focus:border-transparent"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma peça cadastrada. Clique em "Adicionar Peça" para começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Código da Peça
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Nome da Peça
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Quantidade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product: any) => (
                  <tr key={product.key} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-gray-900">
                        {product.value.code}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{product.value.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getQuantityColor(
                          product.value.quantity
                        )}`}
                      >
                        {product.value.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{product.value.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteProduct(product.key)}
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

      {/* Stock Alert */}
      {lowStockCount > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-medium text-yellow-900">Alerta de Estoque Baixo</p>
              <p className="text-sm text-yellow-700 mt-1">
                {lowStockCount} peças estão com estoque baixo
              </p>
            </div>
          </div>
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}
