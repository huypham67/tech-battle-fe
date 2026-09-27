import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { ROUTES } from '@/routes/paths';
import Home from '@/screens/Home';
import Login from '@/screens/Login';
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
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </AppLayout>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;
