import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Product, Category, Banner } from "../types";
import styles from "./ProductPage.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImages, setNewImages] = useState<(File | null)[]>([null]);

  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [submittingCategory, setSubmittingCategory] = useState(false);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBannerImage, setNewBannerImage] = useState<File | null>(null);
  const [submittingBanner, setSubmittingBanner] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("https://parsoplac-back.onrender.com/products"),
      fetch("https://parsoplac-back.onrender.com/categories"),
      fetch("https://parsoplac-back.onrender.com/banners"),
    ])
      .then(async ([resProducts, resCategories, resBanners]) => {
        if (!resProducts.ok) throw new Error("Error al cargar productos");
        if (!resCategories.ok) throw new Error("Error al cargar categorías");
        if (!resBanners.ok) throw new Error("Error al cargar banners");
        const [products, categories, banners] = await Promise.all([
          resProducts.json(),
          resCategories.json(),
          resBanners.json(),
        ]);
        setProducts(products);
        setCategories(categories);
        setBanners(banners);
      })
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

  function handleDelete(id: string) {
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

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    setSubmittingCategory(true);
    try {
      const res = await fetch(
        "https://parsoplac-back.onrender.com/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        },
      );
      if (!res.ok) throw new Error(await res.text());
      const created: Category = await res.json();
      setCategories((prev) => [...prev, created]);
      setNewCategory("");
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    } finally {
      setSubmittingCategory(false);
    }
  }

  async function handleAddBanner() {
    if (!newBannerImage) return;
    setSubmittingBanner(true);
    try {
      const formData = new FormData();
      formData.append("image", newBannerImage);

      const res = await fetch("https://parsoplac-back.onrender.com/banners", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      const created: Banner = await res.json();
      setBanners((prev) => [...prev, created]);
      setNewBannerImage(null);
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    } finally {
      setSubmittingBanner(false);
    }
  }

  function handleDeleteBanner(id: string) {
    if (!window.confirm("¿Eliminar banner?")) return;

    fetch(`https://parsoplac-back.onrender.com/banners/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
        if (!res.ok) throw new Error(text);
        setBanners((prev) => prev.filter((b) => b.id !== id));
      })
      .catch((err) => alert(err.message));
  }

  function handleDeleteCategory(id: string) {
    if (!window.confirm("¿Eliminar categoría?")) return;

    fetch(`https://parsoplac-back.onrender.com/categories/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar categoría");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((err) => alert(err.message));
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>AGREGAR NUEVO PRODUCTO</h1>

      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre</label>
            <input
              className={styles.input}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Marca</label>
            <input
              className={styles.input}
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Precio</label>
            <input
              className={`${styles.input} ${styles.priceInput}`}
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

        <div className={styles.row}>
          <div className={styles.descriptionField}>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.textarea}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.categorySection}>
        <h1 className={styles.title}>CATEGORÍAS</h1>

        <div className={styles.categoryForm}>
          <div className={styles.field}>
            <label className={styles.label}>Nueva categoría</label>
            <input
              className={styles.input}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ej: Herramientas"
            />
          </div>
          <button
            className={styles.submitBtn}
            onClick={handleAddCategory}
            disabled={submittingCategory}
          >
            {submittingCategory ? "Creando..." : "Crear"}
          </button>
        </div>

        <div className={styles.categoryList}>
          {categories.map((cat) => (
            <div key={cat.id} className={styles.categoryChip}>
              <span>{cat.name}</span>
              <button onClick={() => handleDeleteCategory(cat.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.categorySection}>
        <h1 className={styles.title}>BANNER</h1>

        <div className={styles.categoryForm}>
          <div className={styles.field}>
            <label className={styles.label}>Nueva imagen de banner</label>
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={(e) => setNewBannerImage(e.target.files?.[0] ?? null)}
            />
          </div>
          <button
            className={styles.submitBtn}
            onClick={handleAddBanner}
            disabled={submittingBanner || !newBannerImage}
          >
            {submittingBanner ? "Subiendo..." : "Agregar"}
          </button>
        </div>

        <div className={styles.categoryList}>
          {banners.map((banner) => (
            <div key={banner.id} className={styles.categoryChip}>
              <img
                src={banner.imageUrl}
                alt="banner"
                style={{ maxWidth: 120, display: "block", marginBottom: 4 }}
              />
              <button onClick={() => handleDeleteBanner(banner.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
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
