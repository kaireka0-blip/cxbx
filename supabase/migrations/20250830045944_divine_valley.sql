/*
  # Insert Mock Data for Vena Pictures

  1. Mock Data
    - Sample user and profile
    - Sample clients
    - Sample packages and add-ons
    - Sample projects
    - Sample team members
    - Sample transactions
    - Sample cards and pockets
    - Sample leads
    - Sample assets
    - Sample contracts
    - Sample promo codes
    - Sample SOPs
    - Sample client feedback
    - Sample social media posts
    - Sample notifications

  2. Data Relationships
    - All data is linked to the sample profile
    - Projects are linked to clients and packages
    - Transactions are linked to projects and cards
    - Contracts are linked to clients and projects
*/

-- Insert sample user
INSERT INTO users (id, email, password_hash, full_name, company_name, role, permissions) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@vena.pictures', '$2a$10$dummy_hash_for_admin', 'Admin Vena Pictures', 'Vena Pictures', 'Admin', '[]'::jsonb),
('550e8400-e29b-41d4-a716-446655440001', 'member@vena.pictures', '$2a$10$dummy_hash_for_member', 'Member Vena Pictures', 'Vena Pictures', 'Member', '["Prospek", "Booking", "Manajemen Klien", "Proyek"]'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- Insert sample profile
INSERT INTO profiles (id, admin_user_id, full_name, email, phone, company_name, website, address, bank_account, authorized_signer, bio) VALUES
('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Nina Vena', 'admin@vena.pictures', '085693762240', 'Vena Pictures', 'https://venapictures.com', 'Jl. Fotografi No. 123, Jakarta', 'BCA 1234567890 a.n. Nina Vena', 'Nina Vena', 'Fotografer profesional dengan pengalaman 5+ tahun dalam dokumentasi pernikahan dan acara spesial.')
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (id, profile_id, name, email, phone, whatsapp, instagram, client_type, status, since, portal_access_id) VALUES
('750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Budi & Sari', 'budi.sari@email.com', '081234567890', '081234567890', '@budisari_wedding', 'Langsung', 'Aktif', '2024-01-15', uuid_generate_v4()),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'PT. Teknologi Maju', 'info@teknologimaju.com', '021-12345678', '081987654321', '@teknologi_maju', 'Vendor', 'Aktif', '2024-02-01', uuid_generate_v4()),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Andi & Lisa', 'andi.lisa@email.com', '082345678901', '082345678901', '@andilisa_couple', 'Langsung', 'Aktif', '2024-03-10', uuid_generate_v4())
ON CONFLICT (id) DO NOTHING;

-- Insert sample packages
INSERT INTO packages (id, profile_id, name, price, category, physical_items, digital_items, processing_time, photographers, videographers, cover_image) VALUES
('850e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Paket Pernikahan Premium', 15000000, 'Pernikahan', '[{"name": "Album 30x30 cm (50 halaman)", "price": 2000000}, {"name": "Flashdisk Custom", "price": 500000}]'::jsonb, '["500+ Foto High Resolution", "Video Highlight 5-7 menit", "Video Raw Ceremony"]'::jsonb, '30 hari kerja', '2 Fotografer', '1 Videografer', ''),
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'Paket Prewedding Outdoor', 3500000, 'Prewedding', '[{"name": "Cetak Foto 4R (20 lembar)", "price": 300000}]'::jsonb, '["100+ Foto Edited", "Video Cinematic 2-3 menit"]'::jsonb, '14 hari kerja', '1 Fotografer', '1 Videografer', ''),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Paket Korporat Basic', 2500000, 'Korporat', '[]'::jsonb, '["200+ Foto Event", "Video Dokumentasi 3-5 menit"]'::jsonb, '7 hari kerja', '1 Fotografer', '1 Videografer', '')
ON CONFLICT (id) DO NOTHING;

-- Insert sample add-ons
INSERT INTO add_ons (id, profile_id, name, price) VALUES
('950e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Drone Photography', 1500000),
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'Make Up Artist', 2000000),
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Extra Photographer', 1000000),
('950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440000', 'Same Day Edit', 3000000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample team members
INSERT INTO team_members (id, profile_id, name, role, email, phone, standard_fee, no_rek, reward_balance, rating, portal_access_id) VALUES
('a50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Eko Prasetyo', 'Fotografer', 'eko@email.com', '081111111111', 800000, 'BCA 9876543210', 500000, 4.8, uuid_generate_v4()),
('a50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'Dina Sari', 'Videografer', 'dina@email.com', '082222222222', 1000000, 'Mandiri 1122334455', 750000, 4.9, uuid_generate_v4()),
('a50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Rudi Editor', 'Editor', 'rudi@email.com', '083333333333', 600000, 'BNI 5566778899', 300000, 4.7, uuid_generate_v4())
ON CONFLICT (id) DO NOTHING;

-- Insert sample cards
INSERT INTO cards (id, profile_id, card_holder_name, bank_name, card_type, last_four_digits, expiry_date, balance, color_gradient) VALUES
('b50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Nina Vena', 'BCA', 'Debit', '1234', '12/26', 25000000, 'from-blue-500 to-sky-400'),
('b50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'Nina Vena', 'Mandiri', 'Kredit', '5678', '08/25', 15000000, 'from-green-500 to-emerald-400'),
('b50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Nina Vena', 'Tunai', 'Tunai', 'CASH', '', 5000000, 'from-slate-600 to-slate-500')
ON CONFLICT (id) DO NOTHING;

-- Insert sample pockets
INSERT INTO pockets (id, profile_id, name, description, icon, type, amount, goal_amount) VALUES
('c50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Dana Darurat', 'Simpanan untuk keperluan mendesak', 'lock', 'Terkunci', 10000000, 20000000),
('c50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'Upgrade Peralatan', 'Tabungan untuk beli kamera baru', 'piggy-bank', 'Nabung & Bayar', 8000000, 50000000),
('c50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Pool Hadiah Tim', 'Tabungan hadiah untuk freelancer', 'star', 'Tabungan Hadiah Freelancer', 2000000, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, profile_id, client_id, package_id, project_name, client_name, project_type, package_name, add_ons, date, location, progress, status, total_cost, amount_paid, payment_status, team) VALUES
('d50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440000', '850e8400-e29b-41d4-a716-446655440000', 'Pernikahan Budi & Sari', 'Budi & Sari', 'Pernikahan', 'Paket Pernikahan Premium', '[{"id": "950e8400-e29b-41d4-a716-446655440000", "name": "Drone Photography", "price": 1500000}]'::jsonb, '2024-06-15', 'Ballroom Hotel Mulia, Jakarta', 75, 'Post-Produksi', 16500000, 8250000, 'DP Terbayar', '[{"memberId": "a50e8400-e29b-41d4-a716-446655440000", "name": "Eko Prasetyo", "role": "Fotografer", "fee": 800000, "reward": 0}, {"memberId": "a50e8400-e29b-41d4-a716-446655440001", "name": "Dina Sari", "role": "Videografer", "fee": 1000000, "reward": 0}]'::jsonb),
('d50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', 'Prewedding Andi & Lisa', 'Andi & Lisa', 'Prewedding', 'Paket Prewedding Outdoor', '[]'::jsonb, '2024-05-20', 'Pantai Ancol, Jakarta', 100, 'Selesai', 3500000, 3500000, 'Lunas', '[{"memberId": "a50e8400-e29b-41d4-a716-446655440000", "name": "Eko Prasetyo", "role": "Fotografer", "fee": 800000, "reward": 100000}]'::jsonb),
('d50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', 'Event Launching Produk', 'PT. Teknologi Maju', 'Korporat', 'Paket Korporat Basic', '[{"id": "950e8400-e29b-41d4-a716-446655440002", "name": "Extra Photographer", "price": 1000000}]'::jsonb, '2024-07-10', 'Convention Center, Jakarta', 50, 'Produksi', 3500000, 1750000, 'DP Terbayar', '[{"memberId": "a50e8400-e29b-41d4-a716-446655440000", "name": "Eko Prasetyo", "role": "Fotografer", "fee": 800000, "reward": 0}, {"memberId": "a50e8400-e29b-41d4-a716-446655440001", "name": "Dina Sari", "role": "Videografer", "fee": 1000000, "reward": 0}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert sample leads
INSERT INTO leads (id, profile_id, name, contact_channel, location, status, date, notes, whatsapp) VALUES
('e50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Maya & Rizki', 'Instagram', 'Bandung', 'Sedang Diskusi', '2024-04-01', 'Tertarik paket prewedding outdoor. Budget sekitar 3-4 juta.', '081555666777'),
('e50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'CV. Kreatif Media', 'Website', 'Surabaya', 'Menunggu Follow Up', '2024-04-05', 'Butuh dokumentasi event company gathering. Tanggal masih fleksibel.', '081666777888'),
('e50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Keluarga Santoso', 'WhatsApp', 'Jakarta', 'Sedang Diskusi', '2024-04-10', 'Mau foto keluarga besar. Sekitar 20 orang.', '081777888999')
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (id, profile_id, project_id, card_id, date, description, amount, type, category, method) VALUES
('f50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440000', 'b50e8400-e29b-41d4-a716-446655440000', '2024-04-01', 'DP Pernikahan Budi & Sari', 8250000, 'Pemasukan', 'DP Proyek', 'Transfer Bank'),
('f50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440000', '2024-03-15', 'Pelunasan Prewedding Andi & Lisa', 3500000, 'Pemasukan', 'Pelunasan', 'Transfer Bank'),
('f50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', NULL, 'b50e8400-e29b-41d4-a716-446655440002', '2024-04-05', 'Beli Memory Card 128GB', 800000, 'Pengeluaran', 'Peralatan', 'Tunai'),
('f50e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440001', '2024-04-08', 'DP Event PT. Teknologi Maju', 1750000, 'Pemasukan', 'DP Proyek', 'Transfer Bank')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assets
INSERT INTO assets (id, profile_id, name, category, purchase_date, purchase_price, serial_number, status, notes) VALUES
('g50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Canon EOS R5', 'Kamera', '2023-01-15', 65000000, 'CR5001234567', 'Tersedia', 'Kamera utama untuk wedding'),
('g50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'Sony FX3', 'Kamera', '2023-06-20', 45000000, 'FX3987654321', 'Digunakan', 'Kamera video untuk cinematic'),
('g50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'DJI Mini 3 Pro', 'Aksesoris', '2023-11-10', 12000000, 'DJI123456789', 'Tersedia', 'Drone untuk aerial shot')
ON CONFLICT (id) DO NOTHING;

-- Insert sample promo codes
INSERT INTO promo_codes (id, profile_id, code, discount_type, discount_value, is_active, usage_count, max_usage, expiry_date) VALUES
('h50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'NEWCLIENT2024', 'percentage', 10, true, 5, 50, '2024-12-31'),
('h50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'EARLYBIRD', 'fixed', 500000, true, 2, 20, '2024-08-31'),
('h50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'REFERRAL', 'percentage', 15, true, 8, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample SOPs
INSERT INTO sops (id, profile_id, title, category, content, last_updated) VALUES
('i50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Persiapan Pemotretan Wedding', 'Fotografi', 'Checklist persiapan:\n1. Cek kondisi kamera dan lensa\n2. Charge semua baterai\n3. Format memory card\n4. Siapkan backup equipment\n5. Konfirmasi rundown dengan klien\n6. Cek lokasi dan lighting\n7. Koordinasi dengan tim videografer', now()),
('i50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'Workflow Editing Video', 'Videografi', 'Langkah editing video:\n1. Import semua footage\n2. Buat rough cut sesuai musik\n3. Color grading\n4. Audio mixing\n5. Add graphics/text\n6. Export preview untuk klien\n7. Revisi jika diperlukan\n8. Final export', now()),
('i50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Komunikasi dengan Klien', 'Client Service', 'Panduan komunikasi:\n1. Respon maksimal 2 jam di jam kerja\n2. Gunakan bahasa yang sopan dan profesional\n3. Berikan update progress secara berkala\n4. Konfirmasi setiap perubahan\n5. Dokumentasikan semua komunikasi penting', now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample client feedback
INSERT INTO client_feedback (id, profile_id, client_name, satisfaction, rating, feedback, date) VALUES
('j50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Andi & Lisa', 'Sangat Puas', 5, 'Hasil foto prewedding sangat memuaskan! Tim sangat profesional dan kreatif. Highly recommended!', '2024-03-25'),
('j50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'PT. Teknologi Maju', 'Puas', 4, 'Dokumentasi event bagus, namun ada sedikit keterlambatan dalam pengiriman hasil. Overall good service.', '2024-02-15'),
('j50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Keluarga Wijaya', 'Sangat Puas', 5, 'Foto keluarga hasilnya luar biasa! Anak-anak juga senang dengan fotografernya. Terima kasih Vena Pictures!', '2024-01-20')
ON CONFLICT (id) DO NOTHING;

-- Insert sample social media posts
INSERT INTO social_media_posts (id, profile_id, project_id, client_name, post_type, platform, scheduled_date, caption, status) VALUES
('k50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440001', 'Andi & Lisa', 'Instagram Feed', 'Instagram', '2024-04-15', 'Love is in the air! ✨ Prewedding session dengan Andi & Lisa di pantai yang indah. Terima kasih sudah mempercayakan momen spesial kalian kepada kami! 📸💕 #VenaPictures #PreweddingShoot #LoveStory', 'Diposting'),
('k50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440000', 'Budi & Sari', 'Instagram Story', 'Instagram', '2024-06-16', 'Behind the scenes dari wedding Budi & Sari! Stay tuned untuk hasil lengkapnya 🎬✨', 'Terjadwal'),
('k50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440002', 'PT. Teknologi Maju', 'Instagram Feed', 'Instagram', '2024-07-12', 'Corporate event documentation untuk PT. Teknologi Maju. Professional photography untuk acara launching produk terbaru! 🏢📸 #CorporateEvent #VenaPictures', 'Draf')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, profile_id, title, message, timestamp, is_read, icon, link_data) VALUES
('l50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Prospek Baru!', 'Maya & Rizki tertarik dengan paket prewedding. Segera follow up!', now() - interval '2 hours', false, 'lead', '{"view": "Prospek", "action": {"type": "VIEW_LEAD_DETAILS", "id": "e50e8400-e29b-41d4-a716-446655440000"}}'::jsonb),
('l50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'Deadline Mendekat', 'Proyek Pernikahan Budi & Sari deadline dalam 3 hari. Pastikan semua sesuai jadwal.', now() - interval '1 day', false, 'deadline', '{"view": "Proyek", "action": {"type": "VIEW_PROJECT_DETAILS", "id": "d50e8400-e29b-41d4-a716-446655440000"}}'::jsonb),
('l50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'Pembayaran Diterima', 'DP sebesar Rp 8.250.000 untuk proyek Pernikahan Budi & Sari telah diterima.', now() - interval '3 days', true, 'payment', '{"view": "Keuangan"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert sample team project payments
INSERT INTO team_project_payments (id, profile_id, project_id, team_member_id, team_member_name, date, status, fee, reward) VALUES
('m50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440000', 'Eko Prasetyo', '2024-03-25', 'Paid', 800000, 100000),
('m50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440000', 'Eko Prasetyo', '2024-06-15', 'Unpaid', 800000, 0),
('m50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440001', 'Dina Sari', '2024-06-15', 'Unpaid', 1000000, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample contracts
INSERT INTO contracts (id, profile_id, client_id, project_id, contract_number, signing_date, signing_location, client_name1, client_address1, client_phone1, shooting_duration, guaranteed_photos, album_details, delivery_timeframe) VALUES
('n50e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440000', 'd50e8400-e29b-41d4-a716-446655440000', 'VP/CTR/2024/001', '2024-04-01', 'Jakarta', 'Budi Santoso', 'Jl. Mawar No. 123, Jakarta', '081234567890', '8 jam (akad + resepsi)', '500+ foto edited', 'Album 30x30 cm, 50 halaman', '30 hari kerja'),
('n50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440002', 'd50e8400-e29b-41d4-a716-446655440001', 'VP/CTR/2024/002', '2024-03-10', 'Jakarta', 'Andi Wijaya', 'Jl. Melati No. 456, Jakarta', '082345678901', '4 jam outdoor session', '100+ foto edited', 'Cetak foto 4R (20 lembar)', '14 hari kerja')
ON CONFLICT (id) DO NOTHING;