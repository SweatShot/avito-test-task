import React from "react";
import { Checkbox } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store/store";
import { selectAll, clear } from "../../../app/store/bulkSelectionSlice";

interface BulkModerationControlsProps {
  allIds: number[];
  onApprove: (ids: number[]) => void;
  onReject: (ids: number[]) => void;
}

export const BulkModerationControls: React.FC<BulkModerationControlsProps> = ({
  allIds,
  onApprove,
  onReject,
}) => {
  const selectedIds = useSelector(
    (state: RootState) => state.bulkSelection.selectedIds
  );

  const dispatch = useDispatch();

  const isAllSelected =
    allIds.length > 1 && selectedIds.length === allIds.length;

  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < allIds.length;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <Checkbox
        checked={isAllSelected}
        indeterminate={isIndeterminate}
        onChange={(e) =>
          e.target.checked
            ? dispatch(selectAll(allIds))
            : dispatch(clear())
        }
      >
        Выбрать все
      </Checkbox>

      {/* Счётчик */}
      <div style={{ fontWeight: 600, marginLeft: 4 }}>
        Выбрано: {selectedIds.length}
      </div>

      {/* Кнопка сброса */}
      <button
        className="nav-btn"
        disabled={selectedIds.length === 0}
        onClick={() => dispatch(clear())}
      >
        Сбросить
      </button>

      {/* Одобрить выбранные */}
      <button
        className="nav-btn"
        disabled={selectedIds.length === 0}
        onClick={() => {
          onApprove(selectedIds);
          dispatch(clear());   // <-- ЗДЕСЬ СБРОС
        }}
      >
        Одобрить
      </button>

      {/* Отклонить выбранные */}
      <button
        className="nav-btn"
        disabled={selectedIds.length === 0}
        onClick={() => {
          onReject(selectedIds);
          dispatch(clear());   
        }}
      >
        Отклонить
      </button>
    </div>
  );
};
