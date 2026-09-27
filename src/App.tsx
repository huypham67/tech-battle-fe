import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { ROUTES } from '@/routes/paths';
import Home from '@/screens/Home';
import Login from '@/screens/Login';
import ModeSelect from '@/screens/ModeSelect';
import PracticeQuestion from '@/screens/PracticeQuestion';
import PracticeResult from '@/screens/PracticeResult';
import PracticeSetup from '@/screens/PracticeSetup';
import Profile from '@/screens/Profile';
import Register from '@/screens/Register';

function App() {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.register} element={<Register />} />
          <Route path={ROUTES.profile} element={<Profile />} />
          <Route path={ROUTES.modeSelect} element={<ModeSelect />} />
          <Route path={ROUTES.practiceSetup} element={<PracticeSetup />} />
          <Route path={ROUTES.practiceSession} element={<PracticeQuestion />} />
          <Route path={ROUTES.practiceResult} element={<PracticeResult />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </AppLayout>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;
