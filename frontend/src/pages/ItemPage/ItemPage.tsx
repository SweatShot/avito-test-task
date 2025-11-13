import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAdByIdQuery, useApproveAdMutation, useRejectAdMutation, useRequestChangesMutation } from "../../app/shared/api/adsApi";
import { Advertisement, RejectAdRequest, RequestChangesRequest } from "../../types/apiTypes";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const adId = Number(id);

  const { data: ad, isLoading, isError } = useGetAdByIdQuery(adId);
  
  const [approveAd] = useApproveAdMutation();
  const [rejectAd] = useRejectAdMutation();
  const [requestChanges] = useRequestChangesMutation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [reason, setReason] = useState<RejectAdRequest["reason"] | RequestChangesRequest["reason"]>("Запрещенный товар");
  const [comment, setComment] = useState("");

  if (isLoading) return <p>Загрузка...</p>;
  if (isError || !ad) return <p>Ошибка загрузки объявления</p>;

  const handleApprove = async () => {
    await approveAd(adId);
    alert("Объявление одобрено");
  };

  const handleReject = async () => {
    await rejectAd({ id: adId, reason, comment });
    alert("Объявление отклонено");
    setShowRejectModal(false);
  };

  const handleRequestChanges = async () => {
    await requestChanges({ id: adId, reason, comment });
    alert("Запрос на доработку отправлен");
    setShowChangesModal(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/list")}>Назад к списку</button>

      <h1>{ad.title}</h1>

      {/* Галерея */}
      <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
        {ad.images.slice(0, 3).map((img, idx) => (
          <img key={idx} src={img || "https://via.placeholder.com/200x150"} alt={`${ad.title} ${idx}`} style={{ width: "200px", height: "150px", objectFit: "cover" }} />
        ))}
      </div>

      {/* Описание */}
      <p>{ad.description}</p>

      {/* Характеристики */}
      <h3>Характеристики</h3>
      <table border={1} cellPadding={5} style={{ marginBottom: "15px" }}>
        <tbody>
          {Object.entries(ad.characteristics).map(([key, value]) => (
            <tr key={key}>
              <td><strong>{key}</strong></td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Продавец */}
      <h3>Информация о продавце</h3>
      <p>Имя: {ad.seller.name}</p>
      <p>Рейтинг: {ad.seller.rating}</p>
      <p>Количество объявлений: {ad.seller.totalAds}</p>
      <p>Дата регистрации: {new Date(ad.seller.registeredAt).toLocaleDateString()}</p>

      {/* История модерации */}
      <h3>История модерации</h3>
      <table border={1} cellPadding={5} style={{ marginBottom: "15px" }}>
        <thead>
          <tr>
            <th>Модератор</th>
            <th>Дата и время</th>
            <th>Действие</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {ad.moderationHistory.map(h => (
            <tr key={h.id}>
              <td>{h.moderatorName}</td>
              <td>{new Date(h.timestamp).toLocaleString()}</td>
              <td>{h.action}</td>
              <td>{h.comment || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Панель действий модератора */}
      <div style={{ marginTop: "20px" }}>
        <button style={{ backgroundColor: "green", color: "white", marginRight: "10px" }} onClick={handleApprove}>
          Одобрить
        </button>
        <button style={{ backgroundColor: "red", color: "white", marginRight: "10px" }} onClick={() => setShowRejectModal(true)}>
          Отклонить
        </button>
        <button style={{ backgroundColor: "yellow", color: "black" }} onClick={() => setShowChangesModal(true)}>
          Вернуть на доработку
        </button>
      </div>

      {/* Модальные окна */}
      {showRejectModal && (
        <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
          <h4>Причина отклонения</h4>
          <select value={reason} onChange={e => setReason(e.target.value as any)}>
            {["Запрещенный товар","Неверная категория","Некорректное описание","Проблемы с фото","Подозрение на мошенничество","Другое"].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {reason === "Другое" && <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Введите причину" />}
          <button onClick={handleReject}>Подтвердить</button>
          <button onClick={() => setShowRejectModal(false)}>Отмена</button>
        </div>
      )}

      {showChangesModal && (
        <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
          <h4>Причина доработки</h4>
          <select value={reason} onChange={e => setReason(e.target.value as any)}>
            {["Запрещенный товар","Неверная категория","Некорректное описание","Проблемы с фото","Подозрение на мошенничество","Другое"].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {reason === "Другое" && <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Введите комментарий" />}
          <button onClick={handleRequestChanges}>Подтвердить</button>
          <button onClick={() => setShowChangesModal(false)}>Отмена</button>
        </div>
      )}
    </div>
  );
}
