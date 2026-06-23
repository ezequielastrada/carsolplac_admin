import type { Product } from "../types";
import styles from "./ProductCard.module.css";

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
};

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.imagesColumn}>
        {product.images?.length ? (
          product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={product.name}
              className={styles.image}
            />
          ))
        ) : (
          <span className={styles.noImage}>Sin imágenes</span>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.titleRow}>
          <h2 className={styles.name}>{product.name}</h2>

          <span className={styles.brand}>{product.brand || "Sin marca"}</span>
        </div>

        <p className={styles.description}>
          {product.description || "Sin descripción"}
        </p>

        <p className={styles.price}>${product.price}</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(product)}>
          Editar
        </button>

        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(product.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
