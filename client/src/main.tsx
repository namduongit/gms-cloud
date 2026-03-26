import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/auth/login/login'
import RegisterPage from './pages/auth/register/register'
import MainPage from './pages/main/main'
import NotificateProvider from './common/contexts/notificate'
import AuthenticateProvider from './common/contexts/authenticate'
import ProtectedRoute from './components/protected-route/protected-route'
import PublicRoute from './components/public-route/public-route'

createRoot(document.getElementById('root')!).render(
  <NotificateProvider>
    <AuthenticateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage />} />
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthenticateProvider>
  </NotificateProvider>
)
