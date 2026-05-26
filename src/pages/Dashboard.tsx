import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) navigate("/");
  }, [navigate]);

  useEffect(() => {
    fetch("https://parsoplac-back.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleCreate = async () => {
    if (!newName || !newPrice) return;
    setLoading(true);
    try {
      const res = await fetch("https://parsoplac-back.onrender.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, price: Number(newPrice) }),
      });
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
      setNewName("");
      setNewPrice("");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`https://parsoplac-back.onrender.com/products/${id}`, {
      method: "DELETE",
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          Panel de productos
        </h1>

        {/* Layout: columna en mobile, dos columnas en desktop */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Columna izquierda: formulario nuevo producto */}
          <div className="md:w-72 shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                Nuevo producto
              </p>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-gray-400"
                placeholder="Nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-gray-400"
                placeholder="Precio"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <button
                className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Crear producto"}
              </button>
            </div>
          </div>

          {/* Columna derecha: lista de productos */}
          <div className="flex-1">
            {products.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                Sin productos aún.
              </p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl px-5 py-4 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                        Editar
                      </button>
                      <button
                        className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
