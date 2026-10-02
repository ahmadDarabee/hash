import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from './app/hooks'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import Wojak from './components/wojak/Wojak'
import { fetchMe } from './features/auth/authThunks'
import { changeLanguage } from './i18n'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminSdsPage from './pages/admin/AdminSdsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import CompliancePage from './pages/CompliancePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'
import QuotePage from './pages/QuotePage'
import RegisterPage from './pages/RegisterPage'
import { getAccessToken } from './services/api'

export default function App() {
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.i18n.language)

  useEffect(() => {
    changeLanguage(language)
  }, [language])

  useEffect(() => {
    if (getAccessToken()) {
      void dispatch(fetchMe())
    }
  }, [dispatch])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminProductsPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="sds" element={<AdminSdsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Wojak />
    </div>
  )
}
