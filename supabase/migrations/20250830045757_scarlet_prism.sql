/*
  # Initial Database Schema for Vena Pictures

  1. New Tables
    - `profiles` - User profile and company settings
    - `users` - Authentication and user management
    - `clients` - Client information and contact details
    - `packages` - Service packages offered
    - `add_ons` - Additional services
    - `projects` - Photography/videography projects
    - `team_members` - Freelancer/team member information
    - `leads` - Prospect management
    - `transactions` - Financial transactions
    - `cards` - Payment cards and accounts
    - `pockets` - Financial pockets/budgets
    - `assets` - Equipment and asset management
    - `contracts` - Legal contracts
    - `promo_codes` - Discount codes
    - `sops` - Standard Operating Procedures
    - `client_feedback` - Customer satisfaction feedback
    - `social_media_posts` - Social media planning
    - `notifications` - System notifications
    - `team_project_payments` - Freelancer project payments
    - `team_payment_records` - Payment records for freelancers
    - `reward_ledger_entries` - Freelancer reward tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public forms to insert data

  3. Features
    - JSON columns for complex data structures
    - Proper foreign key relationships
    - Default values for common fields
    - Comprehensive indexing for performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  company_name text,
  role text NOT NULL DEFAULT 'Member' CHECK (role IN ('Admin', 'Member')),
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  company_name text NOT NULL DEFAULT '',
  website text DEFAULT '',
  address text DEFAULT '',
  bank_account text DEFAULT '',
  authorized_signer text DEFAULT '',
  id_number text DEFAULT '',
  bio text DEFAULT '',
  income_categories jsonb DEFAULT '["DP Proyek", "Pelunasan", "Add-On", "Transport"]'::jsonb,
  expense_categories jsonb DEFAULT '["Operasional", "Marketing", "Peralatan", "Transport", "Fee Freelancer"]'::jsonb,
  project_types jsonb DEFAULT '["Pernikahan", "Lamaran", "Prewedding", "Korporat", "Ulang Tahun", "Produk", "Keluarga"]'::jsonb,
  event_types jsonb DEFAULT '["Meeting Klien", "Survey Lokasi", "Libur", "Workshop", "Lainnya"]'::jsonb,
  asset_categories jsonb DEFAULT '["Kamera", "Lensa", "Lighting", "Audio", "Aksesoris", "Komputer", "Software"]'::jsonb,
  sop_categories jsonb DEFAULT '["Fotografi", "Videografi", "Editing", "Client Service", "Administrasi"]'::jsonb,
  package_categories jsonb DEFAULT '["Pernikahan", "Lamaran", "Prewedding", "Korporat", "Ulang Tahun", "Produk", "Keluarga"]'::jsonb,
  project_status_config jsonb DEFAULT '[
    {"id": "1", "name": "Dikonfirmasi", "color": "#10b981", "subStatuses": [], "note": "Proyek telah dikonfirmasi"},
    {"id": "2", "name": "Persiapan", "color": "#3b82f6", "subStatuses": [{"name": "Brief Klien", "note": "Diskusi kebutuhan dengan klien"}], "note": "Tahap persiapan"},
    {"id": "3", "name": "Produksi", "color": "#8b5cf6", "subStatuses": [{"name": "Pemotretan", "note": "Sesi foto/video"}], "note": "Tahap produksi"},
    {"id": "4", "name": "Post-Produksi", "color": "#f97316", "subStatuses": [{"name": "Editing", "note": "Proses editing"}], "note": "Tahap editing"},
    {"id": "5", "name": "Review", "color": "#06b6d4", "subStatuses": [{"name": "Review Klien", "note": "Klien review hasil"}], "note": "Tahap review"},
    {"id": "6", "name": "Selesai", "color": "#eab308", "subStatuses": [], "note": "Proyek selesai"},
    {"id": "7", "name": "Dibatalkan", "color": "#ef4444", "subStatuses": [], "note": "Proyek dibatalkan"}
  ]'::jsonb,
  notification_settings jsonb DEFAULT '{"newProject": true, "paymentConfirmation": true, "deadlineReminder": true}'::jsonb,
  security_settings jsonb DEFAULT '{"twoFactorEnabled": false}'::jsonb,
  briefing_template text DEFAULT '',
  terms_and_conditions text DEFAULT '',
  contract_template text DEFAULT '',
  logo_base64 text DEFAULT '',
  brand_color text DEFAULT '#3b82f6',
  public_page_config jsonb DEFAULT '{"template": "modern", "title": "Paket Fotografi & Videografi", "introduction": "Abadikan momen berharga Anda dengan layanan profesional kami.", "galleryImages": []}'::jsonb,
  package_share_template text DEFAULT 'Halo {leadName}! Terima kasih sudah menghubungi {companyName}. Silakan lihat paket-paket kami di: {packageLink}',
  booking_form_template text DEFAULT 'Halo {leadName}! Untuk melanjutkan booking, silakan isi formulir berikut: {bookingFormLink}',
  chat_templates jsonb DEFAULT '[
    {"id": "greeting", "title": "Salam Pembuka", "template": "Halo {clientName}! Terima kasih sudah mempercayakan {companyName} untuk proyek {projectName}. Kami akan memberikan layanan terbaik untuk Anda."},
    {"id": "reminder", "title": "Pengingat", "template": "Halo {clientName}, ini pengingat untuk proyek {projectName}. Jangan lupa untuk..."},
    {"id": "update", "title": "Update Progress", "template": "Update untuk {clientName}: Proyek {projectName} sudah mencapai tahap..."}
  ]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  whatsapp text DEFAULT '',
  instagram text DEFAULT '',
  client_type text NOT NULL DEFAULT 'Langsung' CHECK (client_type IN ('Langsung', 'Vendor')),
  status text NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Prospek', 'Aktif', 'Tidak Aktif', 'Hilang')),
  since date DEFAULT CURRENT_DATE,
  last_contact timestamptz DEFAULT now(),
  portal_access_id uuid DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  physical_items jsonb DEFAULT '[]'::jsonb,
  digital_items jsonb DEFAULT '[]'::jsonb,
  processing_time text DEFAULT '',
  default_printing_cost numeric DEFAULT 0,
  default_transport_cost numeric DEFAULT 0,
  photographers text DEFAULT '',
  videographers text DEFAULT '',
  cover_image text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add-ons table
CREATE TABLE IF NOT EXISTS add_ons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  standard_fee numeric NOT NULL DEFAULT 0,
  no_rek text DEFAULT '',
  reward_balance numeric DEFAULT 0,
  rating numeric DEFAULT 5.0 CHECK (rating >= 1 AND rating <= 5),
  performance_notes jsonb DEFAULT '[]'::jsonb,
  portal_access_id uuid DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  package_id uuid REFERENCES packages(id) ON DELETE SET NULL,
  project_name text NOT NULL,
  client_name text NOT NULL,
  project_type text NOT NULL,
  package_name text DEFAULT '',
  add_ons jsonb DEFAULT '[]'::jsonb,
  date date NOT NULL,
  deadline_date date,
  location text NOT NULL,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'Dikonfirmasi',
  active_sub_statuses jsonb DEFAULT '[]'::jsonb,
  total_cost numeric NOT NULL DEFAULT 0,
  amount_paid numeric DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Belum Bayar' CHECK (payment_status IN ('Lunas', 'DP Terbayar', 'Belum Bayar')),
  team jsonb DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  accommodation text DEFAULT '',
  drive_link text DEFAULT '',
  client_drive_link text DEFAULT '',
  final_drive_link text DEFAULT '',
  start_time text DEFAULT '',
  end_time text DEFAULT '',
  image text DEFAULT '',
  revisions jsonb DEFAULT '[]'::jsonb,
  promo_code_id uuid,
  discount_amount numeric DEFAULT 0,
  shipping_details text DEFAULT '',
  dp_proof_url text DEFAULT '',
  printing_details jsonb DEFAULT '[]'::jsonb,
  printing_cost numeric DEFAULT 0,
  transport_cost numeric DEFAULT 0,
  is_editing_confirmed_by_client boolean DEFAULT false,
  is_printing_confirmed_by_client boolean DEFAULT false,
  is_delivery_confirmed_by_client boolean DEFAULT false,
  confirmed_sub_statuses jsonb DEFAULT '[]'::jsonb,
  client_sub_status_notes jsonb DEFAULT '{}'::jsonb,
  sub_status_confirmation_sent_at jsonb DEFAULT '{}'::jsonb,
  completed_digital_items jsonb DEFAULT '[]'::jsonb,
  invoice_signature text DEFAULT '',
  custom_sub_statuses jsonb DEFAULT '[]'::jsonb,
  booking_status text DEFAULT 'Baru' CHECK (booking_status IN ('Baru', 'Terkonfirmasi', 'Ditolak')),
  rejection_reason text DEFAULT '',
  chat_history jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_channel text NOT NULL DEFAULT 'Lainnya' CHECK (contact_channel IN ('WhatsApp', 'Instagram', 'Website', 'Telepon', 'Referensi', 'Form Saran', 'Lainnya')),
  location text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Sedang Diskusi' CHECK (status IN ('Sedang Diskusi', 'Menunggu Follow Up', 'Dikonversi', 'Ditolak')),
  date date DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  whatsapp text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  card_id uuid,
  pocket_id uuid,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('Pemasukan', 'Pengeluaran')),
  category text NOT NULL DEFAULT '',
  method text NOT NULL DEFAULT 'Transfer Bank' CHECK (method IN ('Transfer Bank', 'Tunai', 'E-Wallet', 'Sistem', 'Kartu')),
  printing_item_id text DEFAULT '',
  vendor_signature text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  card_holder_name text NOT NULL,
  bank_name text NOT NULL,
  card_type text NOT NULL DEFAULT 'Debit' CHECK (card_type IN ('Prabayar', 'Kredit', 'Debit', 'Tunai')),
  last_four_digits text NOT NULL,
  expiry_date text DEFAULT '',
  balance numeric DEFAULT 0,
  color_gradient text DEFAULT 'from-blue-500 to-sky-400',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pockets table
CREATE TABLE IF NOT EXISTS pockets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  icon text NOT NULL DEFAULT 'piggy-bank' CHECK (icon IN ('piggy-bank', 'lock', 'users', 'clipboard-list', 'star')),
  type text NOT NULL DEFAULT 'Nabung & Bayar' CHECK (type IN ('Nabung & Bayar', 'Terkunci', 'Bersama', 'Anggaran Pengeluaran', 'Tabungan Hadiah Freelancer')),
  amount numeric DEFAULT 0,
  goal_amount numeric DEFAULT 0,
  lock_end_date date,
  members jsonb DEFAULT '[]'::jsonb,
  source_card_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  purchase_price numeric NOT NULL DEFAULT 0,
  serial_number text DEFAULT '',
  status text NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Digunakan', 'Perbaikan')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  contract_number text NOT NULL,
  signing_date date NOT NULL DEFAULT CURRENT_DATE,
  signing_location text DEFAULT '',
  client_name1 text NOT NULL,
  client_address1 text DEFAULT '',
  client_phone1 text DEFAULT '',
  client_name2 text DEFAULT '',
  client_address2 text DEFAULT '',
  client_phone2 text DEFAULT '',
  shooting_duration text DEFAULT '',
  guaranteed_photos text DEFAULT '',
  album_details text DEFAULT '',
  digital_files_format text DEFAULT 'JPG High-Resolution',
  other_items text DEFAULT '',
  personnel_count text DEFAULT '',
  delivery_timeframe text DEFAULT '30 hari kerja',
  dp_date date,
  final_payment_date date,
  cancellation_policy text DEFAULT '',
  jurisdiction text DEFAULT '',
  vendor_signature text DEFAULT '',
  client_signature text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  code text NOT NULL,
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  max_usage integer,
  expiry_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SOPs table
CREATE TABLE IF NOT EXISTS sops (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Client feedback table
CREATE TABLE IF NOT EXISTS client_feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  satisfaction text NOT NULL DEFAULT 'Puas' CHECK (satisfaction IN ('Sangat Puas', 'Puas', 'Biasa Saja', 'Tidak Puas')),
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  feedback text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Social media posts table
CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  post_type text NOT NULL DEFAULT 'Instagram Feed' CHECK (post_type IN ('Instagram Feed', 'Instagram Story', 'Instagram Reels', 'TikTok Video', 'Artikel Blog')),
  platform text NOT NULL DEFAULT 'Instagram' CHECK (platform IN ('Instagram', 'TikTok', 'Website')),
  scheduled_date date NOT NULL DEFAULT CURRENT_DATE,
  caption text DEFAULT '',
  media_url text DEFAULT '',
  status text NOT NULL DEFAULT 'Draf' CHECK (status IN ('Draf', 'Terjadwal', 'Diposting', 'Dibatalkan')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  icon text NOT NULL DEFAULT 'comment' CHECK (icon IN ('lead', 'deadline', 'revision', 'feedback', 'payment', 'completed', 'comment')),
  link_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team project payments table
CREATE TABLE IF NOT EXISTS team_project_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  team_member_name text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Unpaid')),
  fee numeric NOT NULL DEFAULT 0,
  reward numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team payment records table
CREATE TABLE IF NOT EXISTS team_payment_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  record_number text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  project_payment_ids jsonb DEFAULT '[]'::jsonb,
  total_amount numeric NOT NULL DEFAULT 0,
  vendor_signature text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reward ledger entries table
CREATE TABLE IF NOT EXISTS reward_ledger_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  date date DEFAULT CURRENT_DATE,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints for cards and pockets
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_card_id FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_pocket_id FOREIGN KEY (pocket_id) REFERENCES pockets(id) ON DELETE SET NULL;
ALTER TABLE pockets ADD CONSTRAINT fk_pockets_source_card_id FOREIGN KEY (source_card_id) REFERENCES cards(id) ON DELETE SET NULL;
ALTER TABLE promo_codes ADD CONSTRAINT fk_promo_codes_profile_id FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add foreign key for promo codes in projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_projects_promo_code_id'
  ) THEN
    ALTER TABLE projects ADD CONSTRAINT fk_projects_promo_code_id FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE pockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_project_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_ledger_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
CREATE POLICY "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE TO authenticated USING (auth.uid()::text = id::text);

-- Profile policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (admin_user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (admin_user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (admin_user_id = auth.uid());

-- Client policies
CREATE POLICY "Users can manage own clients" ON clients FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Public can insert clients" ON clients FOR INSERT TO anon WITH CHECK (true);

-- Package policies
CREATE POLICY "Users can manage own packages" ON packages FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Public can read packages" ON packages FOR SELECT TO anon USING (true);

-- Add-on policies
CREATE POLICY "Users can manage own add_ons" ON add_ons FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Public can read add_ons" ON add_ons FOR SELECT TO anon USING (true);

-- Team member policies
CREATE POLICY "Users can manage own team_members" ON team_members FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Project policies
CREATE POLICY "Users can manage own projects" ON projects FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Public can insert projects" ON projects FOR INSERT TO anon WITH CHECK (true);

-- Lead policies
CREATE POLICY "Users can manage own leads" ON leads FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Public can insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);

-- Transaction policies
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Card policies
CREATE POLICY "Users can manage own cards" ON cards FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Pocket policies
CREATE POLICY "Users can manage own pockets" ON pockets FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Asset policies
CREATE POLICY "Users can manage own assets" ON assets FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Contract policies
CREATE POLICY "Users can manage own contracts" ON contracts FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Promo code policies
CREATE POLICY "Users can manage own promo_codes" ON promo_codes FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Public can read active promo_codes" ON promo_codes FOR SELECT TO anon USING (is_active = true);

-- SOP policies
CREATE POLICY "Users can manage own sops" ON sops FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Client feedback policies
CREATE POLICY "Users can manage own client_feedback" ON client_feedback FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Public can insert client_feedback" ON client_feedback FOR INSERT TO anon WITH CHECK (true);

-- Social media post policies
CREATE POLICY "Users can manage own social_media_posts" ON social_media_posts FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Notification policies
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Team payment policies
CREATE POLICY "Users can manage own team_project_payments" ON team_project_payments FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Users can manage own team_payment_records" ON team_payment_records FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));
CREATE POLICY "Users can manage own reward_ledger_entries" ON reward_ledger_entries FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE admin_user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_profile_id ON clients(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_profile_id ON transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_profile_id ON leads(profile_id);
CREATE INDEX IF NOT EXISTS idx_team_members_profile_id ON team_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_contracts_profile_id ON contracts(profile_id);