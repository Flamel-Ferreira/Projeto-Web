import OverviewHeader from '../components/overview/OverviewHeader.jsx';
import FocusSummaryCard from '../components/overview/FocusSummaryCard.jsx';
import PriorityTasksCard from '../components/overview/PriorityTasksCard.jsx';
import TodayHabitsCard from '../components/overview/TodayHabitsCard.jsx';
import QuoteBar from '../components/overview/QuoteBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { usePomodoro } from '../context/PomodoroContext.jsx';
import { useTasks } from '../context/TasksContext.jsx';
import { useHabits } from '../context/HabitsContext.jsx';
import { QUOTE, TASK_STATUS } from '../utils/constants.js';
import {
  formatLongDate,
  getPeriodMessage,
  toDateKey,
} from '../utils/date.js';

export default function OverviewPage() {
  const { user } = useAuth();
  const {
    mode,
    duration,
    remaining,
    progress,
    isRunning,
    sessionCount,
    cycleLength,
    setMode,
    start,
    pause,
    reset,
  } = usePomodoro();
  const { tasks, counts, priorityTasks, toggleComplete } = useTasks();
  const { todayHabits, dailyConsistency, currentStreak, toggleDay } =
    useHabits();

  const displayedTasks = priorityTasks(3);
  const completedInList = displayedTasks.filter(
    (task) => task.status === TASK_STATUS.DONE,
  ).length;

  // A lista de hábitos de hoje é derivada do contexto com o estado do dia.
  const todayKey = toDateKey();
  const habitsForCard = todayHabits.map((habit) => ({
    ...habit,
    done: habit.history?.[todayKey] === true,
  }));

  const allTasksCount = tasks.length;

  return (
    <div className="space-y-5">
      <OverviewHeader
        name={user?.displayName}
        dateLabel={formatLongDate()}
        periodLabel={getPeriodMessage()}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1.05fr_1fr_1fr]">
        <FocusSummaryCard
          mode={mode}
          setMode={setMode}
          remaining={remaining}
          progress={progress}
          duration={duration}
          isRunning={isRunning}
          start={start}
          pause={pause}
          reset={reset}
          sessionCount={sessionCount}
          cycleLength={cycleLength}
        />

        <PriorityTasksCard
          tasks={displayedTasks}
          completedInList={completedInList}
          totalCompleted={counts.completed}
          totalPending={counts.pending}
          onToggle={toggleComplete}
        />

        <TodayHabitsCard
          habits={habitsForCard}
          consistency={dailyConsistency}
          currentStreak={currentStreak}
          onToggle={(id) => toggleDay(id, todayKey)}
        />
      </div>

      <div className="md:col-span-2 xl:col-span-3">
        <QuoteBar
          quote={QUOTE.text}
          author={QUOTE.author}
          version={`LifePulse v2.4`}
        />
      </div>

      <p className="sr-only">{allTasksCount} tarefas no total.</p>
    </div>
  );
}
