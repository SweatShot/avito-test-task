import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./AdCard.module.css";
import { Advertisement } from "../../../types/apiTypes";

interface AdCardProps {
  ad: Advertisement;
  allIds: number[];
}

export default function AdCard({ ad, allIds }: AdCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={styles.cardWrapper}
    >
      <Link
        to={`/item/${ad.id}`}
        state={{ adsIds: allIds }}
        className={styles.cardLink}
      >
        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <img
              src={ad.images[0] || "https://via.placeholder.com/200x150"}
              alt={ad.title}
              className={styles.image}
            />

            <div
              className={`${styles.priorityBadge} ${
                ad.priority === "urgent" ? styles.urgent : styles.normal
              }`}
            >
              {ad.priority === "urgent" ? "Срочно" : "Обычный"}
            </div>
          </div>

          <div className={styles.content}>
            <h3 className={styles.title}>{ad.title}</h3>

            <p className={styles.price}>Цена: {ad.price} ₽</p>
            <p className={styles.category}>Категория: {ad.category}</p>
            <p className={styles.date}>
              Дата создания: {new Date(ad.createdAt).toLocaleDateString()}
            </p>

            <p className={styles.status}>
              Статус:{" "}
              <strong>
                {ad.status === "pending"
                  ? "На модерации"
                  : ad.status === "approved"
                  ? "Одобрено"
                  : ad.status === "rejected"
                  ? "Отклонено"
                  : "Черновик"}
              </strong>
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
