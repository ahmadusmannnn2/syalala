-- Seed Restaurant Settings
INSERT INTO restaurant_settings (name, tagline, hero_text, take_away_additional_fee, jumbo_size_upgrade_fee, tax_percentage, tax_status)
VALUES (
    'Syalala',
    'Mie Sosis Bakar Extra Pedas',
    'Nikmati cita rasa pedas yang bikin nagih! Pilihan tepat untuk kamu pecinta kuliner extra pedas.',
    1000,
    4000,
    10,
    'Belum termasuk PPN 10%'
);

-- Seed Promotions
INSERT INTO promotions (name, start_date, end_date, min_transaction, reward, valid_days, valid_time_start, valid_time_end, valid_time_start_2, valid_time_end_2)
VALUES (
    'Promo Merdeka',
    '2026-08-01',
    '2026-08-31',
    81000,
    'Gratis 1 porsi Cireng / Kentang Goreng',
    ARRAY['saturday', 'sunday'],
    '11:00', '14:00',
    '17:00', '19:00'
);

-- Seed Categories
INSERT INTO categories (id, name, slug, order_number) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis & Paket', 'mie-sosis-paket', 1),
    ('22222222-2222-2222-2222-222222222222', 'Varian Topping Lain', 'varian-topping-lain', 2),
    ('33333333-3333-3333-3333-333333333333', 'Cemilan & Side Dishes', 'cemilan-side-dishes', 3),
    ('44444444-4444-4444-4444-444444444444', 'Sosis Bakar', 'sosis-bakar', 4),
    ('55555555-5555-5555-5555-555555555555', 'Minuman & Boba', 'minuman-boba', 5);

-- Seed Menu Items (Mie Sosis & Paket)
INSERT INTO menu_items (category_id, name, slug, price, is_best_seller, is_chef_choice, supports_jumbo, description, order_number) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Keju', 'mie-sosis-keju', 27000, true, false, true, 'Mie sosis dengan taburan keju melimpah.', 1),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Sumo', 'mie-sosis-sumo', 28000, false, false, true, 'Porsi besar mie sosis.', 2),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Kuah Sumo', 'mie-sosis-kuah-sumo', 31000, false, true, true, 'Mie sosis kuah porsi sumo.', 3),
    ('11111111-1111-1111-1111-111111111111', 'Paket 1 (Mie Sosis Telur & Es Teh)', 'paket-1', 22000, false, false, true, 'Paket kombo mie sosis telur dan es teh.', 4),
    ('11111111-1111-1111-1111-111111111111', 'Paket 3 (Mie Sosis Cocktail & Es Teh)', 'paket-3', 25000, false, false, true, 'Paket kombo mie sosis cocktail dan es teh.', 5),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Chicken Nugget', 'mie-sosis-chicken-nugget', 17000, false, false, true, 'Mie sosis dengan topping chicken nugget.', 6),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Kenkou', 'mie-sosis-kenkou', 21000, false, false, true, 'Mie sosis dengan sosis kenkou.', 7),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Telur', 'mie-sosis-telur', 20000, false, false, true, 'Mie sosis goreng dengan topping telur.', 8),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Kuah Telur', 'mie-sosis-kuah-telur', 28500, false, false, true, 'Mie sosis kuah dengan topping telur.', 9),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Bockwurst', 'mie-sosis-bockwurst', 26000, false, false, true, 'Mie sosis dengan sosis bockwurst.', 10),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Kuah Bockwurst', 'mie-sosis-kuah-bockwurst', 29000, false, false, true, 'Mie sosis kuah dengan sosis bockwurst.', 11),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Cocktail', 'mie-sosis-cocktail', 23000, false, false, true, 'Mie sosis dengan sosis cocktail.', 12),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Kuah Cocktail', 'mie-sosis-kuah-cocktail', 26000, false, false, true, 'Mie sosis kuah dengan sosis cocktail.', 13),
    ('11111111-1111-1111-1111-111111111111', 'Mie Sosis Kuah Fish Mix', 'mie-sosis-kuah-fish-mix', 24000, false, false, true, 'Mie sosis kuah dengan campuran olahan ikan.', 14),
    ('11111111-1111-1111-1111-111111111111', 'Vegetable Mix', 'vegetable-mix', 30000, false, false, true, 'Sayuran mix dengan pilihan saus BBQ atau Asam Manis.', 15);

-- Seed Menu Items (Varian Topping Lain)
INSERT INTO menu_items (category_id, name, slug, price, order_number) VALUES
    ('22222222-2222-2222-2222-222222222222', 'Odeng Isi 2', 'odeng-isi-2', 22000, 1),
    ('22222222-2222-2222-2222-222222222222', 'Kembang Cumi Isi 4', 'kembang-cumi-isi-4', 21000, 2),
    ('22222222-2222-2222-2222-222222222222', 'Crab Stick Isi 2', 'crab-stick-isi-2', 21000, 3),
    ('22222222-2222-2222-2222-222222222222', 'Chikuwa Isi 3', 'chikuwa-isi-3', 21000, 4),
    ('22222222-2222-2222-2222-222222222222', 'Baso Ikan Isi 4', 'baso-ikan-isi-4', 21000, 5);

-- Seed Menu Items (Cemilan & Side Dishes)
INSERT INTO menu_items (category_id, name, slug, price, order_number) VALUES
    ('33333333-3333-3333-3333-333333333333', 'Nugget', 'nugget', 12000, 1),
    ('33333333-3333-3333-3333-333333333333', 'Minipao Coklat', 'minipao-coklat', 14000, 2),
    ('33333333-3333-3333-3333-333333333333', 'Siomay Ayam (Goreng/Kukus)', 'siomay-ayam', 14000, 3),
    ('33333333-3333-3333-3333-333333333333', 'French Fries', 'french-fries', 12000, 4),
    ('33333333-3333-3333-3333-333333333333', 'Banana Crispy', 'banana-crispy', 12000, 5),
    ('33333333-3333-3333-3333-333333333333', 'Banana Crispy Chocolate', 'banana-crispy-chocolate', 14000, 6),
    ('33333333-3333-3333-3333-333333333333', 'Banana Crispy Cheese', 'banana-crispy-cheese', 14000, 7),
    ('33333333-3333-3333-3333-333333333333', 'Banana Crispy Choco Cheese', 'banana-crispy-choco-cheese', 15000, 8),
    ('33333333-3333-3333-3333-333333333333', 'Cireng', 'cireng', 12000, 9),
    ('33333333-3333-3333-3333-333333333333', 'Telur', 'telur', 5000, 10),
    ('33333333-3333-3333-3333-333333333333', 'Nasi Putih', 'nasi-putih', 5000, 11);

-- Seed Menu Items (Sosis Bakar)
INSERT INTO menu_items (category_id, name, slug, price, order_number) VALUES
    ('44444444-4444-4444-4444-444444444444', 'Sosis Sapi Cocktail + Baso Ayam', 'sosis-sapi-cocktail-baso', 10500, 1),
    ('44444444-4444-4444-4444-444444444444', 'Sosis Sapi Keju', 'sosis-sapi-keju', 11000, 2),
    ('44444444-4444-4444-4444-444444444444', 'Sosis Sapi Bockwurst', 'sosis-sapi-bockwurst', 11000, 3),
    ('44444444-4444-4444-4444-444444444444', 'Sosis Sapi Kenkou', 'sosis-sapi-kenkou', 11000, 4);

-- Seed Menu Items (Minuman & Boba)
INSERT INTO menu_items (category_id, name, slug, price, order_number) VALUES
    ('55555555-5555-5555-5555-555555555555', 'Boba Original', 'boba-original', 14000, 1),
    ('55555555-5555-5555-5555-555555555555', 'Boba Thai Tea', 'boba-thai-tea', 16000, 2),
    ('55555555-5555-5555-5555-555555555555', 'Boba Taro', 'boba-taro', 16000, 3),
    ('55555555-5555-5555-5555-555555555555', 'Boba Green Tea', 'boba-green-tea', 16000, 4),
    ('55555555-5555-5555-5555-555555555555', 'Strawberry Milk Original', 'strawberry-milk-original', 14000, 5),
    ('55555555-5555-5555-5555-555555555555', 'Strawberry Milk Taro', 'strawberry-milk-taro', 16000, 6),
    ('55555555-5555-5555-5555-555555555555', 'Strawberry Milk Green Tea', 'strawberry-milk-green-tea', 19000, 7),
    ('55555555-5555-5555-5555-555555555555', 'Manggo Cheese', 'manggo-cheese', 16000, 8),
    ('55555555-5555-5555-5555-555555555555', 'Mineral Botol', 'mineral-botol', 5000, 9);
