/**
 * Generic list editor used by Experience, Projects, Certs.
 * - Renders a list of items with inline edit / delete
 * - Supports drag-and-drop reorder via @dnd-kit
 */
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import { useState } from "react";

interface RowProps<T extends { id: string }> {
  item: T;
  renderRow: (item: T) => ReactNode;
}

function SortableRow<T extends { id: string }>({ item, renderRow }: RowProps<T>): React.ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="admin-row">
      <button className="admin-drag-handle" {...attributes} {...listeners} aria-label="drag">
        ⋮⋮
      </button>
      {renderRow(item)}
    </div>
  );
}

interface ListEditorProps<T extends { id: string }> {
  items: T[];
  renderRow: (item: T) => ReactNode;
  onReorder: (orderedIds: string[]) => void | Promise<void>;
  emptyLabel?: string;
}

export function ListEditor<T extends { id: string }>({
  items,
  renderRow,
  onReorder,
  emptyLabel,
}: ListEditorProps<T>): React.ReactElement {
  const [working, setWorking] = useState<T[]>(items);
  // sync external changes
  if (working.length !== items.length || working.some((w, i) => w.id !== items[i]?.id)) {
    if (
      items.length !== working.length ||
      items.some((it, i) => it.id !== working[i]?.id)
    ) {
      setWorking(items);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent): void => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = working.findIndex((i) => i.id === active.id);
    const newIndex = working.findIndex((i) => i.id === over.id);
    const next = arrayMove(working, oldIndex, newIndex);
    setWorking(next);
    void onReorder(next.map((i) => i.id));
  };

  if (working.length === 0) {
    return <div className="admin-empty">{emptyLabel ?? "no items"}</div>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={working.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="admin-list">
          {working.map((item) => (
            <SortableRow key={item.id} item={item} renderRow={renderRow} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
