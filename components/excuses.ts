// Local, template-based excuse generator — no external services.
// `{job}` is replaced with the occupation the visitor typed in.

type Category = { keywords: string[]; excuses: string[] };

const CATEGORIES: Category[] = [
  {
    keywords: ["programmer", "developer", "dev", "engineer", "coder", "it", "software", "frontend", "backend", "fullstack", "data"],
    excuses: [
      "Karena kode saya semalam berjalan tanpa error, dan saya butuh waktu untuk mencari tahu kenapa.",
      "Karena server sedang down dan saya merasa harus ikut down bersamanya, demi solidaritas.",
      "Karena saya lupa menyimpan perubahan, dan jiwa saya ikut ter-revert ke versi kemarin.",
      "Karena saya sedang menunggu npm install selesai, perkiraan waktu: besok.",
    ],
  },
  {
    keywords: ["designer", "desainer", "desain", "design", "ui", "ux", "ilustrator", "illustrator", "kreatif", "creative"],
    excuses: [
      "Karena saya kehilangan file FINAL_FINAL_REVISI_7, dan sedang berduka secara profesional.",
      "Karena klien minta logonya dibesarkan, dan saya butuh waktu untuk menerima kenyataan.",
      "Karena palet warna hidup saya sedang tidak kontras, dan perlu di-kalibrasi ulang.",
    ],
  },
  {
    keywords: ["guru", "dosen", "pengajar", "teacher", "tutor", "pendidik"],
    excuses: [
      "Karena saya harus mengerjakan PR yang saya berikan sendiri, dan ternyata sulit sekali.",
      "Karena suara saya habis menjelaskan materi yang sama untuk ketujuh kalinya.",
      "Karena saya sedang mengulang pelajaran tentang kesabaran, dan belum lulus.",
    ],
  },
  {
    keywords: ["dokter", "perawat", "bidan", "apoteker", "nakes", "doctor", "nurse"],
    excuses: [
      "Karena saya mendiagnosis diri sendiri dengan gejala malas akut, dan resepnya adalah istirahat.",
      "Karena saya baru sadar, saya selalu menyuruh orang istirahat, tapi tidak pernah mencobanya.",
      "Karena hasil cek darah saya menunjukkan kadar liburan yang sangat rendah.",
    ],
  },
  {
    keywords: ["marketing", "sales", "pemasaran", "penjualan", "social media", "content", "konten", "admin sosmed"],
    excuses: [
      "Karena algoritma sedang tidak berpihak pada saya, jadi saya memutuskan untuk offline.",
      "Karena target bulan ini sudah tercapai dalam mimpi saya semalam, dan saya percaya itu.",
      "Karena saya sedang melakukan riset pasar tentang kasur, dan hasilnya sangat menjanjikan.",
    ],
  },
  {
    keywords: ["akuntan", "accountant", "finance", "keuangan", "auditor", "pajak", "kasir", "bank"],
    excuses: [
      "Karena angka di spreadsheet saya tidak balance, begitu juga hidup saya.",
      "Karena saya menemukan selisih satu rupiah, dan butuh sehari penuh untuk memaafkannya.",
      "Karena saldo energi saya sudah minus, dan belum ada persetujuan untuk overdraft.",
    ],
  },
  {
    keywords: ["mahasiswa", "pelajar", "siswa", "student", "magang", "intern"],
    excuses: [
      "Karena dosen pembimbing saya membalas pesan, dan saya butuh waktu untuk mencerna kejutan ini.",
      "Karena saya sedang menyusun bab satu dari rencana hidup, dan masih di tahap latar belakang.",
      "Karena kuota internet saya habis, dan semangat saya ikut terputus bersamanya.",
    ],
  },
  {
    keywords: ["driver", "sopir", "supir", "ojol", "kurir", "courier", "ojek"],
    excuses: [
      "Karena GPS saya menyarankan rute tercepat ke kantor adalah tidak berangkat sama sekali.",
      "Karena ban motor saya sedang merenungi hidup, dan saya tidak tega mengganggunya.",
      "Karena saya sudah mengantar semua orang ke tujuannya, kecuali diri saya sendiri.",
    ],
  },
];

const GENERIC: string[] = [
  "Karena rasi bintang malam tadi menunjukkan, saya harus beristirahat sejenak, dari kekejaman korporasi-mu.",
  "Karena sebagai {job}, saya perlu menjaga kualitas dengan cara tidak bekerja hari ini.",
  "Karena kucing saya menatap saya dengan serius pagi ini, dan saya rasa itu adalah pertanda.",
  "Karena bakat saya sebagai {job} sedang dalam masa perawatan berkala.",
  "Karena jam weker saya mengajukan cuti lebih dulu, dan saya menghormati keputusannya.",
  "Karena saya terlalu berdedikasi sebagai {job}, sampai lupa cara bangun dari kasur.",
];

// Longer, self-contained excuses (science, philosophy, office absurdity).
// The comments are only labels; the body text is what gets shown.
const ESSAYS: string[] = [
  // Hukum konservasi energi
  "Saya sedang menjalankan efisiensi energi. Karena energi tidak dapat diciptakan atau dimusnahkan, saya memilih untuk tidak menghabiskannya hari ini.",
  // Krisis eksistensial
  "Saya tadi sudah mau bekerja, tapi tiba-tiba bertanya: siapa yang sebenarnya bekerja, dan untuk apa pekerjaan itu ada? Sekarang saya masih menunggu jawaban dari diri sendiri.",
  // Masalah dengan kucing
  "Mohon dimaklumi, Komandan. Kucing saya barusan duduk di atas keyboard. Secara teknis, dia telah mengambil alih posisi saya dan saya tidak ingin merusak struktur organisasi.",
  // Server kehidupan
  "Saya bukan tidak mau bekerja. Sistem kehidupan saya sedang mengalami latensi tinggi. Mohon tunggu sampai realitas selesai melakukan reconnect.",
  // Kesalahan dimensi
  "Saya sudah menyelesaikan pekerjaan hari ini, tetapi sepertinya di dimensi yang berbeda. Saya mohon waktu tambahan untuk menyinkronkan kedua realitas tersebut.",
  // Prioritas dan kualitas
  "Saya memilih menyelesaikan pekerjaan dengan benar daripada terburu-buru menghasilkan sesuatu yang harus diperbaiki berulang kali. Saya membutuhkan sedikit waktu untuk memastikan hasilnya layak.",
  // Beban kognitif
  "Setelah memproses terlalu banyak informasi, kemampuan saya dalam mengambil keputusan mulai menurun. Saya membutuhkan waktu untuk menata ulang prioritas agar tidak salah langkah.",
  // Eksperimen yang belum selesai
  "Saya sedang menguji pendekatan yang berbeda. Hasilnya belum sesuai ekspektasi, tetapi saya sudah mendapatkan data yang berguna. Saya membutuhkan waktu untuk menentukan langkah berikutnya.",
  // Teorema ketidakpastian
  "Berdasarkan prinsip ketidakpastian Heisenberg, kita tidak dapat mengetahui posisi dan momentum partikel secara simultan dengan ketelitian tak terbatas. Demikian pula, saya belum bisa memastikan posisi karier saya sekaligus momentum produktivitas saya.",
  // Persamaan produktivitas
  "Misalkan produktivitas P = hasil kerja / waktu. Jika waktu terus bertambah sementara hasil tetap, maka produktivitas mendekati nol. Saya sedang menyelidiki mengapa kita masih mengadakan rapat tambahan.",
  // Entropi
  "Menurut hukum kedua termodinamika, entropi total sistem terisolasi tidak akan berkurang. Setelah melihat kondisi folder proyek ini, saya menyimpulkan bahwa alam semesta sedang bekerja sesuai prosedur.",
  // Paradoks Zeno
  "Untuk menyelesaikan pekerjaan, saya harus menyelesaikan setengahnya terlebih dahulu. Namun sebelum itu, saya harus menyelesaikan setengah dari setengah tersebut. Saya sekarang sedang mencoba membuktikan bahwa pekerjaan ini akan selesai dalam jumlah langkah terbatas.",
  // Dilatasi waktu
  "Menurut relativitas khusus, pengamat yang bergerak relatif terhadap pengamat lain dapat mengukur waktu yang berbeda. Saya mohon toleransi, karena lima menit di depan komputer terasa seperti satu eon.",
  // Optimasi sistem
  "Saya sedang mencari nilai optimum dari fungsi produktivitas saya. Turunan pertama menunjukkan arah perubahan, sementara turunan kedua membantu menganalisis bentuk kurvanya. Sayangnya, saya belum menemukan titik maksimum selain jam pulang.",
  // Kapal Theseus
  "Jika seluruh bagian kapal Theseus diganti satu per satu, apakah ia masih kapal yang sama? Demikian pula, jika seluruh tugas saya diganti oleh AI, apakah saya masih karyawan yang sama? Saya membutuhkan waktu untuk menjawab pertanyaan ini.",
  // Simulasi realitas
  "Kita tidak memiliki bukti konklusif bahwa realitas kita adalah simulasi. Namun, jika semua ini adalah simulasi, saya ingin mengajukan keluhan kepada developer-nya karena sistem kerja ini kurang optimal.",
  // Kapasitas memori
  "Otak manusia memiliki keterbatasan dalam memproses informasi secara sadar. Saya sudah membuka terlalu banyak tab di kepala saya, dan sekarang saya tidak ingat tab mana yang sedang memutar musik.",
  // Waktu dan kesadaran
  "Kita tidak pernah mengalami masa depan kecuali sebagai sekarang yang baru saja tiba. Jadi, secara filosofis, saya tidak menunda pekerjaan. Saya hanya belum tiba pada versi diri saya yang menyelesaikannya.",
  // Bias pengukuran
  "Ketika produktivitas diukur terlalu ketat, perilaku manusia cenderung berubah untuk mengejar angka yang diukur. Saya sedang menguji apakah tidak mengerjakan apa-apa dapat meningkatkan metrik efisiensi.",
  // Kesalahan pada sistem
  "Saya sudah mencoba menyelesaikan tugas ini secara normal. Namun, setelah melakukan analisis akar masalah, saya menemukan bahwa masalah utamanya adalah saya sedang mengerjakan tugas ini.",
];

// Easter egg: occupations with their own private pool. The first result is
// always the first entry; ALASAN LAIN then cycles within the same pool.
const SECRET_JOBS: Record<string, string[]> = {
  pengangguran: [
    "Saya tidak sedang menganggur. Saya sedang melakukan riset lapangan tentang batas minimum produktivitas manusia.",
    "Secara teknis saya tidak bisa izin cuti, karena saya belum pernah masuk. Namun saya tetap ingin menghormati prosedur.",
    "Jadwal saya hari ini sangat padat: menunggu panggilan wawancara sambil memastikan kasur tetap pada tempatnya.",
    "Saya sedang menjalani masa transisi karier yang cukup panjang. Sejauh ini, transisinya berjalan sangat stabil.",
  ],
};

const CLOSINGS =["Terima kasih", "Mohon dimaklumi", "Salam hangat", "Hormat saya"];

export type Excuse = {
  greeting: string;
  body: string;
  closing: string;
};

function pick<T>(items: T[], avoid?: T): T {
  const pool = items.length > 1 && avoid !== undefined ? items.filter((item) => item !== avoid) : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Excuses for `job`'s occupation categories, plus the full pool. */
function templatesFor(job: string): { matched: string[]; all: string[] } {
  const normalized = job.toLowerCase();
  const words = normalized.split(/[^a-z]+/).filter(Boolean);
  const matched = CATEGORIES.filter(({ keywords }) =>
    keywords.some((keyword) =>
      keyword.includes(" ") ? normalized.includes(keyword) : words.includes(keyword),
    ),
  ).flatMap((category) => category.excuses);
  return { matched, all: [...matched, ...GENERIC, ...ESSAYS] };
}

/** Builds an excuse for `job`, avoiding the body of `previous` when possible. */
export function generateExcuse(job: string, previous?: Excuse): Excuse {
  // Kept as the visitor typed it, so it reads naturally inside sentence-case prose.
  const role = job.trim().replace(/\s+/g, " ");
  const secret = SECRET_JOBS[role.toLowerCase()];
  let body: string;
  if (secret) {
    body = previous ? pick(secret, previous.body) : secret[0];
  } else {
    const { matched, all } = templatesFor(role);
    // A recognised occupation gets its own excuses half the time; otherwise the
    // whole pool is used, so every template stays reachable for everyone.
    const pool = matched.length > 0 && Math.random() < 0.5 ? matched : all;
    const bodies = pool.map((template) => template.replaceAll("{job}", role));
    body = pick(bodies, previous?.body);
  }

  return {
    greeting: `Selamat siang Komandan, saya selaku ${role} yang bermartabat dan juga taat, izin cuti.`,
    body,
    closing: pick(CLOSINGS, previous?.closing),
  };
}

export function excuseToText({ greeting, body, closing }: Excuse): string {
  return `${greeting}\n\n${body}\n\n${closing}`;
}
