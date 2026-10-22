import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "./pages/Home";
import ServicesList from "./pages/ServicesList";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";
import Tienda from "./pages/Tienda";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServicesList from "./pages/admin/AdminServicesList";
import AdminServiceEditor from "./pages/admin/AdminServiceEditor";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductEditor from "./pages/admin/AdminProductEditor";
import { AdminContacts, AdminApplications } from "./pages/admin/AdminRequests";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminContent from "./pages/admin/AdminContent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServicesList />} />
          <Route path="/servicios/:slug" element={<ServiceDetail />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/postula" element={<Apply />} />
          <Route path="/contratos" element={<Apply />} />
          <Route path="/tienda" element={<Tienda />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="servicios" element={<AdminServicesList />} />
            <Route path="servicios/nuevo" element={<AdminServiceEditor />} />
            <Route path="servicios/:id/editar" element={<AdminServiceEditor />} />
            <Route path="tienda" element={<AdminProducts />} />
            <Route path="tienda/nuevo" element={<AdminProductEditor />} />
            <Route path="tienda/:id/editar" element={<AdminProductEditor />} />
            <Route path="galeria" element={<AdminGallery />} />
            <Route path="contenido" element={<AdminContent />} />
            <Route path="contactos" element={<AdminContacts />} />
            <Route path="postulaciones" element={<AdminApplications />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
