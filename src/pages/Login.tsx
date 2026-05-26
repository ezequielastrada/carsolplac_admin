import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "admin123") {
      localStorage.setItem("admin", "true");

      navigate("/product");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>

        <div className={styles.field}>
          <label className={styles.label}>Contraseña</label>

          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <button onClick={handleLogin} className={styles.button}>
          Ingresar
        </button>
      </div>
    </div>
  );
}
