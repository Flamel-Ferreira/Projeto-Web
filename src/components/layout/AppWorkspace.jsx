import AppShell from './AppShell.jsx';
import { HabitsProvider } from '../../context/HabitsContext.jsx';
import { NotesProvider } from '../../context/NotesContext.jsx';
import { PomodoroProvider } from '../../context/PomodoroContext.jsx';
import { TasksProvider } from '../../context/TasksContext.jsx';

export default function AppWorkspace() {
  return (
    <TasksProvider>
      <HabitsProvider>
        <NotesProvider>
          <PomodoroProvider>
            <AppShell />
          </PomodoroProvider>
        </NotesProvider>
      </HabitsProvider>
    </TasksProvider>
  );
}
