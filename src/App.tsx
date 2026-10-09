import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { OnboardingLayout } from './pages/onboarding/OnboardingLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ProfilePage } from './pages/profile/ProfilePage';
import { getCurrentUser } from './lib/auth';

function RootRedirect() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setTarget('/dashboard');
      } else {
        setTarget('/login');
      }
    });
  }, []);

  if (!target) return null;
  return <Navigate to={target} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<OnboardingLayout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Public profile route: /:username */}
        <Route path="/:username" element={<ProfilePage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
