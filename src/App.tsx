import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { ToastProvider } from "./context/ToastContext";
import { UIProvider } from "./context/UIContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Categorias } from "./pages/Categorias";
import { Lista } from "./pages/Lista";
import { Produto } from "./pages/Produto";
import { Carrinho } from "./pages/Carrinho";
import { Checkout } from "./pages/Checkout";
import { Club } from "./pages/Club";
import { Login } from "./pages/Login";
import { Conta } from "./pages/Conta";
import { Pedidos } from "./pages/Pedidos";
import { Enderecos } from "./pages/Enderecos";
import { Atacado } from "./pages/Atacado";
import { Privacidade, Termos } from "./pages/Legal";
import { AdminLayout } from "./admin/AdminLayout";
import { Dashboard } from "./admin/Dashboard";
import { AdminProdutos } from "./admin/AdminProdutos";
import { AdminPedidos } from "./admin/AdminPedidos";

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <ToastProvider>
          <UIProvider>
          <HashRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/lista/:kind" element={<Lista />} />
                <Route path="/produto/:id" element={<Produto />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/club" element={<Club />} />
                <Route path="/login" element={<Login />} />
                <Route path="/conta" element={<Conta />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/enderecos" element={<Enderecos />} />
                <Route path="/atacado" element={<Atacado />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="/termos" element={<Termos />} />

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="produtos" element={<AdminProdutos />} />
                  <Route path="pedidos" element={<AdminPedidos />} />
                </Route>

                <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </HashRouter>
          </UIProvider>
        </ToastProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
