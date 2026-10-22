
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin');

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role function (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  short_description TEXT,
  long_description TEXT,
  hero_image_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  accent_color TEXT NOT NULL DEFAULT '#3B82F6',
  price_from NUMERIC(10,2),
  show_price BOOLEAN NOT NULL DEFAULT true,
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  ideal_for JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active services are public" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins read all services" ON public.services
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert services" ON public.services
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update services" ON public.services
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete services" ON public.services
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- contact_requests
CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  district TEXT,
  service_slug TEXT,
  preferred_date TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact" ON public.contact_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins read contacts" ON public.contact_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update contacts" ON public.contact_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete contacts" ON public.contact_requests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- job_applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  document TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  district TEXT,
  service_slug TEXT,
  experience TEXT,
  availability TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.job_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply" ON public.job_applications
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins read applications" ON public.job_applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update applications" ON public.job_applications
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete applications" ON public.job_applications
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed services
INSERT INTO public.services (slug, title, subtitle, short_description, long_description, accent_color, price_from, category, sort_order, includes, benefits, ideal_for, faqs)
VALUES
('limpieza-residencial',
 'Limpieza Residencial',
 'Tu hogar impecable, sin que muevas un dedo',
 'Limpieza profunda y mantenimiento del hogar con personal capacitado, productos seguros y atención al detalle.',
 'Nuestro servicio de limpieza residencial está diseñado para que vuelvas a casa y solo te concentres en disfrutar. Personal verificado, productos seguros para tu familia y un sistema de trabajo profesional que garantiza resultados visibles desde la primera visita.',
 '#0EA5E9', 80, 'Limpieza', 1,
 '["Limpieza de dormitorios, salas y comedores","Cocina: muebles, electrodomésticos y pisos","Baños desinfectados a fondo","Trapeado y aspirado de toda la casa","Cambio de ropa de cama (a pedido)","Productos de limpieza incluidos"]'::jsonb,
 '["Personal verificado y capacitado","Tarifas claras sin sorpresas","Reprogramación flexible","Garantía de satisfacción"]'::jsonb,
 '["Familias ocupadas","Profesionales con poco tiempo","Departamentos y casas","Limpiezas semanales o quincenales"]'::jsonb,
 '[{"q":"¿Llevan sus propios productos?","a":"Sí, incluimos productos profesionales seguros. Si prefieres los tuyos, también los usamos."},{"q":"¿Cuánto dura una limpieza?","a":"Entre 3 y 6 horas según el tamaño del hogar."}]'::jsonb),

('limpieza-oficinas',
 'Limpieza de Oficinas',
 'Espacios de trabajo limpios, ordenados y productivos',
 'Mantenimiento profesional para oficinas, coworkings y locales comerciales con horarios flexibles.',
 'Mantenemos tu oficina lista para recibir clientes y colaboradores todos los días. Personal uniformado, supervisión periódica y horarios adaptados a tu operación, incluyendo madrugadas y fines de semana.',
 '#1D4ED8', 120, 'Limpieza', 2,
 '["Limpieza de escritorios y áreas comunes","Baños y kitchenettes","Desinfección de superficies de alto contacto","Vaciado de papeleras","Vidrios y mamparas","Reposición de insumos básicos"]'::jsonb,
 '["Horarios flexibles","Personal uniformado","Supervisión periódica","Facturación con RUC"]'::jsonb,
 '["Oficinas corporativas","Coworkings","Consultorios y clínicas","Locales comerciales"]'::jsonb,
 '[{"q":"¿Trabajan fines de semana?","a":"Sí, ofrecemos turnos de sábado, domingo y madrugada sin recargo en planes mensuales."}]'::jsonb),

('cuidado-infantil',
 'Cuidado Infantil / Niñera',
 'Manos confiables para los más pequeños de la casa',
 'Niñeras capacitadas en primeros auxilios y estimulación temprana, evaluadas para que tu familia esté tranquila.',
 'Sabemos lo importante que es dejar a tus hijos en buenas manos. Por eso nuestro personal pasa por entrevistas, verificación de antecedentes y capacitación continua en cuidado, juegos educativos y primeros auxilios.',
 '#10B981', 35, 'Cuidado', 3,
 '["Cuidado activo y supervisión","Apoyo con tareas escolares","Preparación de comidas para niños","Juegos didácticos y actividades","Rutinas de sueño y baño","Reporte diario para los padres"]'::jsonb,
 '["Personal con antecedentes verificados","Capacitación en primeros auxilios","Horarios por hora, día completo o nocturno","Reemplazo garantizado"]'::jsonb,
 '["Padres que trabajan","Eventos y reuniones","Apoyo en vacaciones","Cuidado nocturno"]'::jsonb,
 '[{"q":"¿Atienden bebés?","a":"Sí, contamos con niñeras especializadas en bebés desde los 3 meses."},{"q":"¿Pueden cuidar varios niños?","a":"Sí, ajustamos la tarifa según la cantidad y edades."}]'::jsonb),

('cuidado-adulto-mayor',
 'Cuidado del Adulto Mayor',
 'Compañía, asistencia y cariño para quienes más queremos',
 'Cuidadoras y técnicas en enfermería capacitadas para acompañar y asistir a adultos mayores con respeto y empatía.',
 'Cuidamos a tus seres queridos como si fueran nuestra propia familia. Brindamos acompañamiento, apoyo en la rutina diaria, asistencia médica básica y, sobre todo, mucha calidez humana.',
 '#8B5CF6', 40, 'Cuidado', 4,
 '["Acompañamiento permanente","Apoyo en higiene y vestido","Control de medicación","Preparación de alimentos","Movilización y paseos","Apoyo en terapias indicadas"]'::jsonb,
 '["Personal con experiencia comprobada","Técnicas en enfermería disponibles","Turnos de 8, 12 o 24 horas","Supervisión y seguimiento"]'::jsonb,
 '["Adultos mayores independientes","Postoperatorios","Pacientes con movilidad reducida","Acompañamiento nocturno"]'::jsonb,
 '[{"q":"¿Tienen personal con conocimientos médicos?","a":"Sí, contamos con técnicas en enfermería para casos que lo requieran."}]'::jsonb),

('soulclean',
 'SoulClean',
 'Limpieza profunda y energética para renovar tu espacio',
 'Servicio especial de limpieza intensiva, ordenamiento y armonización para reiniciar la energía de tu hogar.',
 'SoulClean va más allá de la limpieza tradicional. Combinamos limpieza profunda, ordenamiento consciente y armonización del espacio para que tu hogar se sienta nuevo, ligero y lleno de buena energía.',
 '#0F172A', 250, 'Especial', 5,
 '["Limpieza profunda de todos los ambientes","Ordenamiento y organización","Aromatización natural","Limpieza energética del espacio","Recomendaciones para mantener el orden","Equipo especializado"]'::jsonb,
 '["Experiencia transformadora","Resultados visibles y duraderos","Productos naturales","Personal entrenado en el método"]'::jsonb,
 '["Mudanzas","Cierres de ciclo","Inicio de año","Pre y post eventos importantes"]'::jsonb,
 '[{"q":"¿Cuánto dura el servicio?","a":"Entre 6 y 10 horas dependiendo del tamaño del espacio."}]'::jsonb),

('servicios-mascotas',
 'Servicios para Mascotas',
 'Cuidado, paseos y atención para tu engreído de cuatro patas',
 'Paseadores, cuidadores y limpieza especial para hogares con mascotas, con personal que ama a los animales.',
 'Tus mascotas también son familia. Ofrecemos paseos, cuidado a domicilio, alimentación, juego y limpieza profunda de espacios con mascotas, todo con personal cariñoso y capacitado.',
 '#F97316', 25, 'Mascotas', 6,
 '["Paseos individuales o grupales","Cuidado a domicilio","Alimentación y agua","Juego y socialización","Limpieza de área de mascota","Reporte con fotos"]'::jsonb,
 '["Personal amante de los animales","Seguro ante imprevistos","Horarios flexibles","Servicio recurrente con descuento"]'::jsonb,
 '["Dueños con jornadas largas","Viajes cortos","Mascotas que necesitan compañía","Hogares con varias mascotas"]'::jsonb,
 '[{"q":"¿Cuidan gatos también?","a":"Sí, atendemos perros, gatos y otras mascotas pequeñas."}]'::jsonb);
