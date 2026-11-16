import { Navigate, Route, Routes } from 'react-router-dom';
import AppWorkspace from '../components/layout/AppWorkspace.jsx';
import AuthPage from '../pages/AuthPage.jsx';
import FocusPage from '../pages/FocusPage.jsx';
import HabitsPage from '../pages/HabitsPage.jsx';
import NotesPage from '../pages/NotesPage.jsx';
import OverviewPage from '../pages/OverviewPage.jsx';
import TasksPage from '../pages/TasksPage.jsx';
import { ROUTES } from '../utils/constants.js';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute guestOnly />}>
        <Route path={ROUTES.auth} element={<AuthPage mode="login" />} />
        <Route path={ROUTES.register} element={<AuthPage mode="register" />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppWorkspace />}>
          <Route path={ROUTES.overview} element={<OverviewPage />} />
          <Route path={ROUTES.focus} element={<FocusPage />} />
          <Route path={ROUTES.habits} element={<HabitsPage />} />
          <Route path={ROUTES.tasks} element={<TasksPage />} />
          <Route path={ROUTES.notes} element={<NotesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.overview} replace />} />
    </Routes>
  );
}
