// Local, template-based excuse generator — no external services.
// `{job}` is replaced with the occupation the visitor typed in.

type Category = { keywords: string[]; excuses: string[] };

const CATEGORIES: Category[] = [
  {
    keywords: ["programmer", "developer", "dev", "engineer", "coder", "it", "software", "frontend", "backend", "fullstack", "data"],
    excuses: [
      "KARENA KODE SAYA SEMALAM BERJALAN TANPA ERROR, DAN SAYA BUTUH WAKTU UNTUK MENCARI TAHU KENAPA.",
      "KARENA SERVER SEDANG DOWN DAN SAYA MERASA HARUS IKUT DOWN BERSAMANYA, DEMI SOLIDARITAS.",
      "KARENA SAYA LUPA MENYIMPAN PERUBAHAN, DAN JIWA SAYA IKUT TER-REVERT KE VERSI KEMARIN.",
      "KARENA SAYA SEDANG MENUNGGU NPM INSTALL SELESAI, PERKIRAAN WAKTU: BESOK.",
    ],
  },
  {
    keywords: ["designer", "desainer", "desain", "design", "ui", "ux", "ilustrator", "illustrator", "kreatif", "creative"],
    excuses: [
      "KARENA SAYA KEHILANGAN FILE FINAL_FINAL_REVISI_7, DAN SEDANG BERDUKA SECARA PROFESIONAL.",
      "KARENA KLIEN MINTA LOGONYA DIBESARKAN, DAN SAYA BUTUH WAKTU UNTUK MENERIMA KENYATAAN.",
      "KARENA PALET WARNA HIDUP SAYA SEDANG TIDAK KONTRAS, DAN PERLU DI-KALIBRASI ULANG.",
    ],
  },
  {
    keywords: ["guru", "dosen", "pengajar", "teacher", "tutor", "pendidik"],
    excuses: [
      "KARENA SAYA HARUS MENGERJAKAN PR YANG SAYA BERIKAN SENDIRI, DAN TERNYATA SULIT SEKALI.",
      "KARENA SUARA SAYA HABIS MENJELASKAN MATERI YANG SAMA UNTUK KETUJUH KALINYA.",
      "KARENA SAYA SEDANG MENGULANG PELAJARAN TENTANG KESABARAN, DAN BELUM LULUS.",
    ],
  },
  {
    keywords: ["dokter", "perawat", "bidan", "apoteker", "nakes", "doctor", "nurse"],
    excuses: [
      "KARENA SAYA MENDIAGNOSIS DIRI SENDIRI DENGAN GEJALA MALAS AKUT, DAN RESEPNYA ADALAH ISTIRAHAT.",
      "KARENA SAYA BARU SADAR, SAYA SELALU MENYURUH ORANG ISTIRAHAT, TAPI TIDAK PERNAH MENCOBANYA.",
      "KARENA HASIL CEK DARAH SAYA MENUNJUKKAN KADAR LIBURAN YANG SANGAT RENDAH.",
    ],
  },
  {
    keywords: ["marketing", "sales", "pemasaran", "penjualan", "social media", "content", "konten", "admin sosmed"],
    excuses: [
      "KARENA ALGORITMA SEDANG TIDAK BERPIHAK PADA SAYA, JADI SAYA MEMUTUSKAN UNTUK OFFLINE.",
      "KARENA TARGET BULAN INI SUDAH TERCAPAI DALAM MIMPI SAYA SEMALAM, DAN SAYA PERCAYA ITU.",
      "KARENA SAYA SEDANG MELAKUKAN RISET PASAR TENTANG KASUR, DAN HASILNYA SANGAT MENJANJIKAN.",
    ],
  },
  {
    keywords: ["akuntan", "accountant", "finance", "keuangan", "auditor", "pajak", "kasir", "bank"],
    excuses: [
      "KARENA ANGKA DI SPREADSHEET SAYA TIDAK BALANCE, BEGITU JUGA HIDUP SAYA.",
      "KARENA SAYA MENEMUKAN SELISIH SATU RUPIAH, DAN BUTUH SEHARI PENUH UNTUK MEMAAFKANNYA.",
      "KARENA SALDO ENERGI SAYA SUDAH MINUS, DAN BELUM ADA PERSETUJUAN UNTUK OVERDRAFT.",
    ],
  },
  {
    keywords: ["mahasiswa", "pelajar", "siswa", "student", "magang", "intern"],
    excuses: [
      "KARENA DOSEN PEMBIMBING SAYA MEMBALAS PESAN, DAN SAYA BUTUH WAKTU UNTUK MENCERNA KEJUTAN INI.",
      "KARENA SAYA SEDANG MENYUSUN BAB SATU DARI RENCANA HIDUP, DAN MASIH DI TAHAP LATAR BELAKANG.",
      "KARENA KUOTA INTERNET SAYA HABIS, DAN SEMANGAT SAYA IKUT TERPUTUS BERSAMANYA.",
    ],
  },
  {
    keywords: ["driver", "sopir", "supir", "ojol", "kurir", "courier", "ojek"],
    excuses: [
      "KARENA GPS SAYA MENYARANKAN RUTE TERCEPAT KE KANTOR ADALAH TIDAK BERANGKAT SAMA SEKALI.",
      "KARENA BAN MOTOR SAYA SEDANG MERENUNGI HIDUP, DAN SAYA TIDAK TEGA MENGGANGGUNYA.",
      "KARENA SAYA SUDAH MENGANTAR SEMUA ORANG KE TUJUANNYA, KECUALI DIRI SAYA SENDIRI.",
    ],
  },
];

const GENERIC: string[] = [
  "KARENA RASI BINTANG MALAM TADI MENUNJUKKAN, SAYA HARUS BERISTIRAHAT SEJENAK, DARI KEKEJAMAN KORPORASI-mu.",
  "KARENA SEBAGAI {job}, SAYA PERLU MENJAGA KUALITAS DENGAN CARA TIDAK BEKERJA HARI INI.",
  "KARENA KUCING SAYA MENATAP SAYA DENGAN SERIUS PAGI INI, DAN SAYA RASA ITU ADALAH PERTANDA.",
  "KARENA BAKAT SAYA SEBAGAI {job} SEDANG DALAM MASA PERAWATAN BERKALA.",
  "KARENA JAM WEKER SAYA MENGAJUKAN CUTI LEBIH DULU, DAN SAYA MENGHORMATI KEPUTUSANNYA.",
  "KARENA SAYA TERLALU BERDEDIKASI SEBAGAI {job}, SAMPAI LUPA CARA BANGUN DARI KASUR.",
];

const CLOSINGS = ["TERIMA KASIH", "MOHON DIMAKLUMI", "SALAM HANGAT", "HORMAT SAYA"];

export type Excuse = {
  greeting: string;
  body: string;
  closing: string;
};

function pick<T>(items: T[], avoid?: T): T {
  const pool = items.length > 1 && avoid !== undefined ? items.filter((item) => item !== avoid) : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

function templatesFor(job: string): string[] {
  const normalized = job.toLowerCase();
  const words = normalized.split(/[^a-z]+/).filter(Boolean);
  const matched = CATEGORIES.filter(({ keywords }) =>
    keywords.some((keyword) =>
      keyword.includes(" ") ? normalized.includes(keyword) : words.includes(keyword),
    ),
  ).flatMap((category) => category.excuses);
  return [...matched, ...GENERIC];
}

/** Builds an excuse for `job`, avoiding the body of `previous` when possible. */
export function generateExcuse(job: string, previous?: Excuse): Excuse {
  const role = job.trim().replace(/\s+/g, " ").toUpperCase();
  const bodies = templatesFor(role).map((template) => template.replaceAll("{job}", role));

  return {
    greeting: `SELAMAT SIANG KOMANDAN, SAYA SELAKU ${role} YANG BERMARTABAT DAN JUGA TAAT, IZIN CUTI.`,
    body: pick(bodies, previous?.body),
    closing: pick(CLOSINGS, previous?.closing),
  };
}

export function excuseToText({ greeting, body, closing }: Excuse): string {
  return `${greeting}\n\n${body}\n\n${closing}`;
}
