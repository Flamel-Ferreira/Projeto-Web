import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import TaskColumn from './TaskColumn.jsx';
import { TaskCardOverlay } from './TaskCard.jsx';
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from '../../utils/constants.js';

function byOrder(a, b) {
  if (a.order !== b.order) return a.order - b.order;
  return String(a.createdAt).localeCompare(String(b.createdAt));
}

export default function TaskBoard({ tasks, onMove, onAddCard, onToggle, onDelete }) {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeTask = tasks.find((task) => task.id === activeId) ?? null;

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const task = tasks.find((item) => item.id === active.id);
    if (!task) return;

    const overData = over.data.current;
    let toStatus = task.status;
    let toIndex = 0;

    if (overData?.type === 'column') {
      toStatus = overData.status;
      toIndex = tasks.filter(
        (item) => item.status === toStatus && item.id !== task.id,
      ).length;
    } else {
      toStatus = overData?.status ?? task.status;
      const column = tasks
        .filter((item) => item.status === toStatus && item.id !== task.id)
        .sort(byOrder);
      const index = column.findIndex((item) => item.id === over.id);
      toIndex = index >= 0 ? index : column.length;
    }

    onMove?.(task.id, toStatus, toIndex);
  }

  return (
    <>
      <p id="task-dnd-instructions" className="sr-only">
        Para mover uma tarefa com o teclado, foque o cartão, pressione espaço
        para pegá-lo, use as setas para escolher a coluna e a posição e pressione
        espaço novamente para soltar.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => setActiveId(event.active.id)}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              'Para mover uma tarefa, pressione espaço para pegá-la, use as setas para escolher a posição e pressione espaço para soltar. Pressione Escape para cancelar.',
          },
        }}
      >
        <div className="flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {TASK_STATUS_ORDER.map((status) => {
            const columnTasks = tasks
              .filter((task) => task.status === status)
              .sort(byOrder);

            return (
              <TaskColumn
                key={status}
                status={status}
                label={TASK_STATUS_LABELS[status]}
                tasks={columnTasks}
                count={columnTasks.length}
                onAddCard={onAddCard}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
