import React from "react"
import { Checkbox } from "antd"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../../app/store/store"
import { selectAll, clear } from "../../../app/store/bulkSelectionSlice"

interface BulkModerationControlsProps {
  allIds: number[]
  onApprove: (ids: number[]) => void
  onReject: (ids: number[]) => void
  onRequestChanges: (ids: number[]) => void
}

export const BulkModerationControls: React.FC<BulkModerationControlsProps> = ({
  allIds,
  onApprove,
  onReject,
  onRequestChanges,
}) => {
  const dispatch = useDispatch()
  const selectedIds = useSelector((state: RootState) => state.bulkSelection.selectedIds)

  const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allIds.length

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <Checkbox
        checked={isAllSelected}
        indeterminate={isIndeterminate}
        onChange={e => e.target.checked ? dispatch(selectAll(allIds)) : dispatch(clear())}
      >
        Выбрать все
      </Checkbox>

      <div style={{ fontWeight: 600 }}>Выбрано: {selectedIds.length}</div>

      <button className="nav-btn" disabled={!selectedIds.length} onClick={() => dispatch(clear())}>
        Сбросить
      </button>

      <button className="nav-btn" disabled={!selectedIds.length} onClick={() => { onApprove(selectedIds); dispatch(clear()) }}>
        Одобрить
      </button>

      <button className="nav-btn" disabled={!selectedIds.length} onClick={() => { onReject(selectedIds); dispatch(clear()) }}>
        Отклонить
      </button>

      <button className="nav-btn" disabled={!selectedIds.length} onClick={() => { onRequestChanges(selectedIds); dispatch(clear()) }}>
        На доработку
      </button>
    </div>
  )
}
