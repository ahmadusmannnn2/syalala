const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const DOWNLOADS_DIR = 'C:\\Users\\user\\Downloads\\WhatsApp Unknown 2026-11-21 at 23.40.38';

// Baca env Supabase
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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Mapping file awal -> nama baru di folder -> nama menu di database
const MAPPINGS = [
  // 100% Exact Matches
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.11.jpeg',
    newName: 'Risol Matcha Cheese.jpeg',
    dbMenuName: 'Risol Matcha Cheese',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.12 (1).jpeg',
    newName: 'Donut Gula.jpeg',
    dbMenuName: 'Donut Gula',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.12 (2).jpeg',
    newName: 'Risol Smoke Beef Mayo.jpeg',
    dbMenuName: 'Risol Smoke Beef Mayo',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.12 (3).jpeg',
    newName: 'Lumpia Rebung.jpeg',
    dbMenuName: 'Lumpia Rebung',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.12.jpeg',
    newName: 'Canai Coklat.jpeg',
    dbMenuName: 'Canai Coklat',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.13 (2).jpeg',
    newName: 'Canai Ori.jpeg',
    dbMenuName: 'Canai Ori',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.13 (3).jpeg',
    newName: 'Roti Sisir.jpeg',
    dbMenuName: 'Roti Sisir',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.13 (4).jpeg',
    newName: 'Pangsit Goreng.jpeg',
    dbMenuName: 'Pangsit Goreng',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.13.jpeg',
    newName: 'Ice Tea.jpeg',
    dbMenuName: 'Ice Tea',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.14 (1).jpeg',
    newName: 'Kids Meal Nugget Sayur.jpeg',
    dbMenuName: 'Kids Meal Nugget Sayur',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.14.jpeg',
    newName: 'Kids Meal Egg Roll.jpeg',
    dbMenuName: 'Kids Meal Egg Roll',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.14 (3).jpeg',
    newName: 'Paket 05 - Bakso Syalala + Esteh.jpeg',
    dbMenuName: 'Paket 05: Bakso Syalala + Esteh',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.15.jpeg',
    newName: 'Strawberry Milk Ori.jpeg',
    dbMenuName: 'Strawberry Milk Ori',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.10 (2).jpeg',
    newName: 'Mie Sosis Original.jpeg',
    dbMenuName: 'Mie Sosis Original',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.13 (1).jpeg',
    newName: 'Paket 03 - Mie Sosis Telur + Esteh.jpeg',
    dbMenuName: 'Paket 03: Mie Sosis Telur + Esteh',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.15 (3).jpeg',
    newName: 'Paket 01 - Mie Sosis Sumo + Esteh.jpeg',
    dbMenuName: 'Paket 01: Mie Sosis Sumo + Esteh',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.11 (3).jpeg',
    newName: 'Paket 02 - Mie Sosis Keju + Esteh.jpeg',
    dbMenuName: 'Paket 02: Mie Sosis Keju + Esteh',
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.11 (1).jpeg',
    newName: 'Mie Sosis Kuah Seblak.jpeg',
    dbMenuName: 'Mie Sosis Kuah Seblak',
  },
  // Varian Sudut / Tambahan yang sudah jelas menunya:
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.10 (1).jpeg',
    newName: 'Paket 03 - Mie Sosis Telur + Esteh (Varian Telur Matang).jpeg',
    dbMenuName: null, // Telur setengah matang di atas sudah dijadikan foto utama
  },
  {
    oldName: 'WhatsApp Image 2026-11-21 at 16.59.15 (4).jpeg',
    newName: 'Mie Sosis Original (Varian 2).jpeg',
    dbMenuName: null, // Sudah ada foto utama
  },
];

async function main() {
  console.log('=== MEMULAI PROSES RENAME & UPDATE SUPABASE ===\n');

  // Ambil semua menu_items dari Supabase
  const { data: dbItems, error: itemsErr } = await supabase
    .from('menu_items')
    .select('id, name, slug, image_url');

  if (itemsErr) {
    console.error('Error mengambil data menu_items:', itemsErr);
    process.exit(1);
  }

  const itemsMap = new Map(dbItems.map((item) => [item.name, item]));

  // Langkah 1: Rename file di folder lokal
  console.log('--- Langkah 1: Merename File Gambar di Folder Lokal ---');
  for (const item of MAPPINGS) {
    const oldPath = path.join(DOWNLOADS_DIR, item.oldName);
    const newPath = path.join(DOWNLOADS_DIR, item.newName);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`✓ Berhasil Rename: "${item.oldName}" -> "${item.newName}"`);
    } else if (fs.existsSync(newPath)) {
      console.log(`ℹ File sudah direname sebelumnya: "${item.newName}"`);
    } else {
      console.warn(`⚠ File tidak ditemukan: "${item.oldName}"`);
    }
  }

  // Langkah 2: Upload ke Supabase Storage & Update database menu_items
  console.log('\n--- Langkah 2: Upload ke Supabase Storage & Update Database ---');
  for (const item of MAPPINGS) {
    if (!item.dbMenuName) continue;

    const dbItem = itemsMap.get(item.dbMenuName);
    if (!dbItem) {
      console.warn(`⚠ Menu item tidak ditemukan di database: "${item.dbMenuName}"`);
      continue;
    }

    const filePath = path.join(DOWNLOADS_DIR, item.newName);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ File tidak ada untuk diupload: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    // Nama file di bucket storage
    const storageFileName = `menu-${dbItem.slug}-${Date.now()}.jpeg`;

    console.log(`Mengupload "${item.newName}" untuk menu "${item.dbMenuName}"...`);
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('menu-images')
      .upload(storageFileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadErr) {
      console.error(`❌ Gagal upload "${item.newName}":`, uploadErr.message);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(storageFileName);

    const publicUrl = urlData.publicUrl;
    console.log(`  URL: ${publicUrl}`);

    // Update menu_items di Supabase
    const { error: updateErr } = await supabase
      .from('menu_items')
      .update({ image_url: publicUrl })
      .eq('id', dbItem.id);

    if (updateErr) {
      console.error(`❌ Gagal update database untuk "${item.dbMenuName}":`, updateErr.message);
    } else {
      console.log(`  ✓ Database updated! Menu "${item.dbMenuName}" kini memiliki gambar resmi.`);
    }
  }

  console.log('\n=== SEMUA TAHAP BERHASIL DISELESAIKAN ===');
}

main().catch(console.error);
