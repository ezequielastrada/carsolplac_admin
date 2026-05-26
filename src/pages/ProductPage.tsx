import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";
import styles from "./ProductPage.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  // imagen: listo para cuando lo implementes
  const [newImages, setNewImages] = useState<(File | null)[]>([null]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("https://parsoplac-back.onrender.com/products")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!newName || !newPrice) return;

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", newName);
      formData.append("price", newPrice);
      formData.append("stock", "1");

      newImages.forEach((image) => {
        if (image) {
          formData.append("images", image);
        }
      });

      const res = await fetch("https://parsoplac-back.onrender.com/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();

        console.log(text);

        throw new Error(text);
      }

      const created: Product = await res.json();

      setProducts((prev) => [...prev, created]);

      setNewName("");
      setNewPrice("");
      setNewImages([null]);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleImageChange(index: number, file: File | null) {
    const updated = [...newImages];

    updated[index] = file;

    const isLastInput = index === newImages.length - 1;

    if (file && isLastInput) {
      updated.push(null);
    }

    setNewImages(updated);
  }

  function handleEdit(product: Product) {
    const name = window.prompt("Nuevo nombre:", product.name);

    const price = window.prompt("Nuevo precio:", String(product.price));

    if (!name || !price) return;

    const updated = {
      name,
      price: Number(price),
    };

    fetch(`https://parsoplac-back.onrender.com/products/${product.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar");

        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, ...updated } : p)),
        );
      })
      .catch((err) => alert(err.message));
  }

  function handleDelete(id: number) {
    if (!window.confirm("¿Eliminar producto?")) return;

    fetch(`https://parsoplac-back.onrender.com/products/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => alert(err.message));
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>AGREGAR NUEVO PRODUCTO</h1>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Nombre</label>
          <input
            className={styles.input}
            placeholder="Nombre del producto"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Precio</label>
          <input
            className={styles.input}
            placeholder="0"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </div>

        <div className={styles.imagesContainer}>
          {newImages.map((image, index) => (
            <div key={index} className={styles.imageField}>
              <input
                className={`${styles.input} ${styles.imageInput}`}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(index, e.target.files?.[0] ?? null)
                }
              />

              {image && <span className={styles.imageName}>{image.name}</span>}
            </div>
          ))}
        </div>

        <button
          className={styles.submitBtn}
          onClick={handleAdd}
          disabled={submitting}
        >
          {submitting ? "Subiendo..." : "Agregar"}
        </button>
      </div>

      <h1 className={styles.title}>LISTA DE PRODUCTOS</h1>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <h1 className={styles.title}>VENTAS EFECTUADAS</h1>
    </div>
  );
}
