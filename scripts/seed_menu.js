const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Baca .env.local dari root folder syalala-digital-menu
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Environment variables tidak ditemukan!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function runSeed() {
  console.log('--- Memulai input menu resmi Syalala ---');

  // 1. Update restaurant_settings: take_away_additional_fee = 2000
  const { data: currentSettings } = await supabase.from('restaurant_settings').select('*').single();
  if (currentSettings) {
    const { error: settingsErr } = await supabase
      .from('restaurant_settings')
      .update({ take_away_additional_fee: 2000 })
      .eq('id', currentSettings.id);

    if (settingsErr) {
      console.warn('Peringatan update settings:', settingsErr.message);
    } else {
      console.log('✓ Biaya Take Away berhasil diupdate ke Rp 2.000');
    }
  }

  // 2. Hapus menu_items lama
  console.log('Menghapus data menu lama...');
  const { error: delMenuErr } = await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delMenuErr) {
    console.error('Gagal menghapus menu lama:', delMenuErr);
    process.exit(1);
  }
  console.log('✓ Menu lama berhasil dibersihkan.');

  // 3. Hapus categories lama
  console.log('Menghapus data kategori lama...');
  const { error: delCatErr } = await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delCatErr) {
    console.error('Gagal menghapus kategori lama:', delCatErr);
    process.exit(1);
  }
  console.log('✓ Kategori lama berhasil dibersihkan.');

  // 4. Masukkan 5 Kategori Baru
  const categoriesData = [
    { name: 'Menu Paket', slug: 'menu-paket', order_number: 1, is_active: true, description: 'Paket hemat komplit sudah termasuk Es Teh segar.' },
    { name: 'Menu Regular', slug: 'menu-regular', order_number: 2, is_active: true, description: 'Menu mie sosis favorit dan kids meal lezat.' },
    { name: 'Additional', slug: 'additional', order_number: 3, is_active: true, description: 'Pilihan topping dan tambahan ekstra untuk menu Anda.' },
    { name: 'Snacks', slug: 'snacks', order_number: 4, is_active: true, description: 'Cemilan gurih, manis, dan gorengan renyah.' },
    { name: 'Beverages', slug: 'beverages', order_number: 5, is_active: true, description: 'Pilihan minuman segar, jus buah, kopi, dan teh.' },
  ];

  const { data: insertedCats, error: insCatErr } = await supabase
    .from('categories')
    .insert(categoriesData)
    .select('*');

  if (insCatErr || !insertedCats) {
    console.error('Gagal memasukkan kategori baru:', insCatErr);
    process.exit(1);
  }
  console.log(`✓ ${insertedCats.length} Kategori berhasil dibuat:`, insertedCats.map(c => c.name).join(', '));

  const catMap = Object.fromEntries(insertedCats.map(c => [c.slug, c.id]));

  // 5. Siapkan 59 Menu Items Baru
  const items = [
    // --- Kategori 1: MENU PAKET ---
    {
      name: 'Paket 01: Mie Sosis Sumo + Esteh',
      category_slug: 'menu-paket',
      price: 28000,
      description: 'Mie sosis porsi jumbo spesial sumo berpadu dengan sosis lezat, lengkap dengan Es Teh segar.',
      is_best_seller: true,
      is_chef_choice: false,
      supports_jumbo: true,
      order_number: 1,
    },
    {
      name: 'Paket 02: Mie Sosis Keju + Esteh',
      category_slug: 'menu-paket',
      price: 28000,
      description: 'Mie sosis dengan lelehan keju gurih mantap, disajikan bersama Es Teh manis segar.',
      is_best_seller: false,
      is_chef_choice: true,
      supports_jumbo: true,
      order_number: 2,
    },
    {
      name: 'Paket 03: Mie Sosis Telur + Esteh',
      category_slug: 'menu-paket',
      price: 22000,
      description: 'Mie sosis gurih pedas dengan topping telur mata sapi dan Es Teh manis dingin.',
      is_best_seller: true,
      is_chef_choice: false,
      supports_jumbo: true,
      order_number: 3,
    },
    {
      name: 'Paket 04: Mie Sosis Kuah Ori + Esteh',
      category_slug: 'menu-paket',
      price: 15000,
      description: 'Mie sosis kuah hangat gurih bumbu rempah original, pas ditemani Es Teh segar.',
      is_best_seller: false,
      is_chef_choice: false,
      supports_jumbo: true,
      order_number: 4,
    },
    {
      name: 'Paket 05: Bakso Syalala + Esteh',
      category_slug: 'menu-paket',
      price: 23000,
      description: 'Bakso daging sapi kenyal khas Syalala dengan kuah sedap gurih, lengkap bersama Es Teh.',
      is_best_seller: false,
      is_chef_choice: false,
      supports_jumbo: false,
      order_number: 5,
    },

    // --- Kategori 2: MENU REGULAR ---
    {
      name: 'Mie Sosis Original',
      category_slug: 'menu-regular',
      price: 10000,
      description: 'Menu legendaris Syalala! Mie kenyal berbumbu spesial gurih pedas dengan potongan sosis bakar sedap.',
      is_best_seller: true,
      is_chef_choice: false,
      supports_jumbo: true,
      order_number: 1,
    },
    {
      name: 'Mie Sosis Kuah Original',
      category_slug: 'menu-regular',
      price: 10000,
      description: 'Mie kuah berkaldu gurih lezat dengan bumbu original khas Syalala dan sosis.',
      is_best_seller: false,
      is_chef_choice: false,
      supports_jumbo: true,
      order_number: 2,
    },
    {
      name: 'Mie Sosis Kuah Seblak',
      category_slug: 'menu-regular',
      price: 20000,
      description: 'Sensasi pedas gurih aroma kencur khas kuah seblak berpadu dengan mie kenyal dan sosis berlimpah.',
      is_best_seller: false,
      is_chef_choice: true,
      supports_jumbo: true,
      order_number: 3,
    },
    {
      name: 'Kids Meal Nugget Sayur',
      category_slug: 'menu-regular',
      price: 25000,
      description: 'Paket menu ramah anak dengan nugget sayur bergizi, nasi lembut, dan pelengkap lezat tanpa pedas.',
      is_best_seller: false,
      is_chef_choice: false,
      supports_jumbo: false,
      order_number: 4,
    },
    {
      name: 'Kids Meal Egg Roll',
      category_slug: 'menu-regular',
      price: 25000,
      description: 'Paket menu anak egg roll renyah gurih disajikan dengan porsi pas dan higienis.',
      is_best_seller: false,
      is_chef_choice: false,
      supports_jumbo: false,
      order_number: 5,
    },

    // --- Kategori 3: ADDITIONAL (Topping & Tambahan) ---
    { name: 'Jumbo', category_slug: 'additional', price: 4000, description: 'Tambahan porsi mie ekstra besar dan kenyang.', order_number: 1 },
    { name: 'Telur', category_slug: 'additional', price: 5000, description: 'Topping telur mata sapi / ceplok gurih.', order_number: 2 },
    { name: 'Gyoza', category_slug: 'additional', price: 4000, description: 'Pangsit Jepang gurih renyah.', order_number: 3 },
    { name: 'Sosis Keju', category_slug: 'additional', price: 15000, description: 'Sosis premium isi keju lumer.', order_number: 4 },
    { name: 'Sosis Kenkou', category_slug: 'additional', price: 15000, description: 'Sosis sapi kualitas premium kenkou gurih.', order_number: 5 },
    { name: 'Sosis Cocktail', category_slug: 'additional', price: 10000, description: 'Sosis sapi mini cocktail empuk.', order_number: 6 },
    { name: 'Nugget', category_slug: 'additional', price: 15000, description: 'Potongan nugget ayam renyah empuk.', order_number: 7 },
    { name: 'Ayam Geprek', category_slug: 'additional', price: 10000, description: 'Ayam goreng krispi gurih pedas sambal geprek.', order_number: 8 },
    { name: 'Ceker Mercon', category_slug: 'additional', price: 10000, description: 'Ceker empuk bumbu mercon extra pedas mantap.', order_number: 9 },
    { name: 'Bakso Bakar', category_slug: 'additional', price: 10000, description: 'Bakso sapi bakar berlumur saus sedap aroma asap.', order_number: 10 },
    { name: 'Enoki', category_slug: 'additional', price: 5000, description: 'Jamur enoki segar krispi.', order_number: 11 },
    { name: 'Fishmix', category_slug: 'additional', price: 10000, description: 'Olahan seafood ikan aneka bentuk gurih kenyal.', order_number: 12 },
    { name: 'Tahu', category_slug: 'additional', price: 2000, description: 'Tahu lembut gurih penyedap kuah.', order_number: 13 },
    { name: 'Toge', category_slug: 'additional', price: 2000, description: 'Sayuran toge segar renyah alami.', order_number: 14 },
    { name: 'Keju Parut', category_slug: 'additional', price: 2000, description: 'Taburan keju cheddar parut melimpah.', order_number: 15 },

    // --- Kategori 4: SNACKS (Cemilan) ---
    { name: 'Pangsit Goreng', category_slug: 'snacks', price: 2000, description: 'Pangsit renyah kriuk gurih khas Syalala.', order_number: 1 },
    { name: 'Kerupuk Udang', category_slug: 'snacks', price: 2000, description: 'Kerupuk udang gurih mekar renyah.', order_number: 2 },
    { name: 'Canai Ori', category_slug: 'snacks', price: 10000, description: 'Roti canai pipih lembut gurih aroma mentega.', order_number: 3 },
    { name: 'Canai Coklat', category_slug: 'snacks', price: 10000, description: 'Roti canai lembut dengan lumuran coklat manis lezat.', order_number: 4 },
    { name: 'Nugget Crumble', category_slug: 'snacks', price: 13000, description: 'Nugget krispi dengan baluran crumble gurih keemasan.', order_number: 5 },
    { name: 'Donut Gula', category_slug: 'snacks', price: 13000, description: 'Donat lembut empuk dengan taburan gula halus manis.', order_number: 6 },
    { name: 'French Fries', category_slug: 'snacks', price: 15000, description: 'Kentang goreng renyah di luar lembut di dalam.', is_best_seller: true, order_number: 7 },
    { name: 'Lumpia Rebung', category_slug: 'snacks', price: 15000, description: 'Lumpia goreng isi rebung khas gurih sedap.', order_number: 8 },
    { name: 'Risol Matcha Cheese', category_slug: 'snacks', price: 15000, description: 'Risol manis dengan isian saus matcha dan keju meleleh.', order_number: 9 },
    { name: 'Risol Smoke Beef Mayo', category_slug: 'snacks', price: 15000, description: 'Risol renyah berisi daging asap gurih dan mayones creamy.', order_number: 10 },
    { name: 'Roti Sisir', category_slug: 'snacks', price: 15000, description: 'Roti sisir klasik manis mentega lembut harum.', order_number: 11 },
    { name: 'Mix Platter', category_slug: 'snacks', price: 25000, description: 'Kombinasi aneka cemilan gorengan favorit dalam satu porsi besar.', is_best_seller: true, order_number: 12 },

    // --- Kategori 5: BEVERAGES (Minuman) ---
    { name: 'Ice+ Free Refill Air Putih', category_slug: 'beverages', price: 5000, description: 'Es batu dingin segar dengan fasilitas isi ulang air putih.', order_number: 1 },
    { name: 'Mineral Botol', category_slug: 'beverages', price: 5000, description: 'Air mineral botol dingin higienis.', order_number: 2 },
    { name: 'Ice Tea', category_slug: 'beverages', price: 5000, description: 'Es teh manis segar pelepas dahaga.', is_best_seller: true, order_number: 3 },
    { name: 'Hot Tea', category_slug: 'beverages', price: 5000, description: 'Teh manis hangat sedap menenangkan.', order_number: 4 },
    { name: 'Jeruk Peras', category_slug: 'beverages', price: 8000, description: 'Air perasan jeruk asli segar alami manis asam pas.', is_best_seller: true, order_number: 5 },
    { name: 'Lemon Tea', category_slug: 'beverages', price: 8000, description: 'Kombinasi teh segar dan perasan lemon kaya vitamin C.', order_number: 6 },
    { name: 'Milo', category_slug: 'beverages', price: 8000, description: 'Minuman coklat malt Milo nikmat dingin/hangat.', order_number: 7 },
    { name: 'Kopi Susu Gula Aren Hot', category_slug: 'beverages', price: 15000, description: 'Kopi susu hangat dengan legitnya gula aren asli.', order_number: 8 },
    { name: 'Kopi Susu Gula Aren Ice', category_slug: 'beverages', price: 15000, description: 'Es kopi susu gula aren dingin creamy dan wangi.', is_best_seller: true, order_number: 9 },
    { name: 'Vanilla Latte Hot', category_slug: 'beverages', price: 15000, description: 'Kopi latte hangat dengan aroma manis lembut vanilla.', order_number: 10 },
    { name: 'Vanilla Latte Ice', category_slug: 'beverages', price: 15000, description: 'Es kopi latte dingin beraroma vanilla nikmat.', order_number: 11 },
    { name: 'Jus Alpukat', category_slug: 'beverages', price: 15000, description: 'Jus buah alpukat segar kental dengan saus coklat.', is_best_seller: true, order_number: 12 },
    { name: 'Jus Jambu', category_slug: 'beverages', price: 15000, description: 'Jus buah jambu merah segar manis menyegarkan.', order_number: 13 },
    { name: 'Jus Mangga', category_slug: 'beverages', price: 15000, description: 'Jus buah mangga manis kental kaya serat.', order_number: 14 },
    { name: 'Jus Melon', category_slug: 'beverages', price: 15000, description: 'Jus buah melon segar dingin pelepas haus.', order_number: 15 },
    { name: 'Jus Nanas', category_slug: 'beverages', price: 15000, description: 'Jus nanas asam manis segar membangkitkan stamina.', order_number: 16 },
    { name: 'Jus Sirsak', category_slug: 'beverages', price: 15000, description: 'Jus sirsak asli manis asam segar creamy.', order_number: 17 },
    { name: 'Jus Strawberry', category_slug: 'beverages', price: 15000, description: 'Jus strawberry segar kaya antioksidan.', order_number: 18 },
    { name: 'Avocado Milk Yakult', category_slug: 'beverages', price: 18000, description: 'Kombinasi unik alpukat, susu creamy, dan probiotik segar Yakult.', is_chef_choice: true, order_number: 19 },
    { name: 'Strawberry Milk Ori', category_slug: 'beverages', price: 18000, description: 'Susu strawberry lembut dengan sensasi buah manis segar.', order_number: 20 },
    { name: 'Es Buah', category_slug: 'beverages', price: 18000, description: 'Es buah segar aneka potongan buah segar dengan kuah manis wangi.', is_best_seller: true, order_number: 21 },
    { name: 'Creamy Cookies Cream', category_slug: 'beverages', price: 25000, description: 'Minuman blended creamy kental berpadu remah biskuit coklat mewah.', is_chef_choice: true, order_number: 22 },
  ];

  // Siapkan baris untuk di-insert ke menu_items
  const rows = items.map((it) => ({
    name: it.name,
    slug: slugify(it.name),
    category_id: catMap[it.category_slug],
    price: it.price,
    description: it.description || null,
    image_url: null,
    is_available: true,
    is_best_seller: it.is_best_seller || false,
    is_chef_choice: it.is_chef_choice || false,
    supports_jumbo: it.supports_jumbo || false,
    order_number: it.order_number,
  }));

  console.log(`Menginput ${rows.length} menu items ke database...`);
  const { data: insertedItems, error: insItemsErr } = await supabase
    .from('menu_items')
    .insert(rows)
    .select('id, name');

  if (insItemsErr) {
    console.error('Gagal memasukkan menu items:', insItemsErr);
    process.exit(1);
  }

  console.log(`✓ BERHASIL! Sebanyak ${insertedItems.length} menu resmi Syalala berhasil disimpan di database.`);
}

runSeed();
