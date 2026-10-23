export type UnitKompetensi = {
    kode: string;
    judul: string;
};

export type JadwalUjian = {
    id: string;
    tanggal: string;
    tuk: string;
    kuota: string;
};

export type Skema = {
    id: string;
    code: string;
    nomorSkema: string;
    masaBerlaku: string;
    title: string;
    category: string;
    jenis: string;
    unitsCount: number;
    level: number;
    methods: string[];
    price: string;
    rating: number;
    reviewsCount: number;
    asesiCount: number;
    image: string;
    description: string;
    persyaratan: string[];
    jadwal: JadwalUjian[];
    units: UnitKompetensi[];
};

export const skemaList: Skema[] = [
    {
        id: "skm-01",
        code: "SKM-01",
        nomorSkema: "SKM/BNSP/001/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Teknisi Desktop (Desktop Technician)",
        category: "Programming Dan Pengembangan Software",
        jenis: "Okupasi",
        unitsCount: 1,
        level: 3,
        methods: ["Tatap Muka"],
        price: "Rp 1.200.000",
        rating: 4.8,
        reviewsCount: 12,
        asesiCount: 50,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
        description: "Lakukan instalasi, konfigurasi, perawatan, dan penanganan masalah pada perangkat keras serta sistem operasi komputer desktop.",
        persyaratan: ["Ijazah minimal SMP/SMA/SMK sederajat", "Pasfoto formal 3×4", "Identitas diri (KTP)"],
        jadwal: [{ id: "jdw-1", tanggal: "15 Nov 2026", tuk: "TUK Lab Komputer A", kuota: "12 Kuota Tersisa" }],
        units: [{ kode: "J.620900.010.02", judul: "Memasang Motherboard" }],
    },
    {
        id: "skm-02",
        code: "SKM-02",
        nomorSkema: "SKM/BNSP/002/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Teknisi Perbaikan Komputer (Computer Repair Technician)",
        category: "IT And Computing Facilities Management",
        jenis: "Okupasi",
        unitsCount: 1,
        level: 3,
        methods: ["Tatap Muka"],
        price: "Rp 1.250.000",
        rating: 4.9,
        reviewsCount: 15,
        asesiCount: 42,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
        description: "Analisis kerusakan, troubleshooting, dan perbaikan perangkat keras maupun luncur komputer.",
        persyaratan: ["Ijazah minimal SMA/SMK sederajat", "Pasfoto formal", "KTP"],
        jadwal: [{ id: "jdw-2", tanggal: "18 Nov 2026", tuk: "TUK Mandiri", kuota: "15 Kuota Tersisa" }],
        units: [{ kode: "J.620900.030.02", judul: "Mendiagnosis Kerusakan Perangkat Keras" }],
    },
    {
        id: "skm-03",
        code: "SKM-03",
        nomorSkema: "SKM/BNSP/003/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Asisten Instalasi dan Pemeliharaan Perangkat Keras",
        category: "IT And Computing Facilities Management",
        jenis: "Klaster",
        unitsCount: 1,
        level: 2,
        methods: ["Tatap Muka"],
        price: "Rp 1.000.000",
        rating: 4.7,
        reviewsCount: 8,
        asesiCount: 35,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        description: "Membantu proses instalasi perangkat keras jaringan dan komputer serta pemeliharaan berkala.",
        persyaratan: ["Ijazah minimal SMP/SMA", "Pasfoto formal", "KTP"],
        jadwal: [{ id: "jdw-3", tanggal: "20 Nov 2026", tuk: "TUK Lab B", kuota: "10 Kuota Tersisa" }],
        units: [{ kode: "J.620900.040.02", judul: "Instalasi Perangkat Keras Pendukung" }],
    },
    {
        id: "skm-04",
        code: "SKM-04",
        nomorSkema: "SKM/BNSP/004/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Analis Web (Web Analyst)",
        category: "Programming Dan Pengembangan Software",
        jenis: "Okupasi",
        unitsCount: 1,
        level: 4,
        methods: ["Blended Learning"],
        price: "Rp 1.500.000",
        rating: 4.9,
        reviewsCount: 20,
        asesiCount: 65,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        description: "Menganalisis kebutuhan sistem web, performa website, struktur data, dan kebutuhan fungsional.",
        persyaratan: ["Ijazah SMA/SMK/Mahasiswa", "Portofolio web", "KTP"],
        jadwal: [{ id: "jdw-4", tanggal: "22 Nov 2026", tuk: "TUK Utama", kuota: "20 Kuota Tersisa" }],
        units: [{ kode: "M.722000.001.02", judul: "Menganalisis Kebutuhan Sistem Web" }],
    },
    {
        id: "skm-05",
        code: "SKM-05",
        nomorSkema: "SKM/BNSP/005/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Pemrogram Muda (Associate Programmer)",
        category: "Programming Dan Pengembangan Software",
        jenis: "Okupasi",
        unitsCount: 1,
        level: 3,
        methods: ["Tatap Muka"],
        price: "Rp 1.350.000",
        rating: 4.9,
        reviewsCount: 30,
        asesiCount: 80,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        description: "Menulis, menguji, dan memelihara kode program sederhana hingga menengah menggunakan bahasa standar industri.",
        persyaratan: ["Ijazah SMA/SMK", "Logika pemrograman", "KTP"],
        jadwal: [{ id: "jdw-5", tanggal: "25 Nov 2026", tuk: "TUK Utama", kuota: "15 Kuota Tersisa" }],
        units: [{ kode: "J.620900.001.01", judul: "Menggunakan Struktur Data" }],
    },
    {
        id: "skm-06",
        code: "SKM-06",
        nomorSkema: "SKM/BNSP/006/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Skema Pemasaran Digital Berbasis AI (AI Powered Digital Marketing)",
        category: "AI & Digital",
        jenis: "Klaster",
        unitsCount: 1,
        level: 3,
        methods: ["Online / Daring"],
        price: "Rp 1.100.000",
        rating: 4.8,
        reviewsCount: 18,
        asesiCount: 60,
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80",
        description: "Mengoptimalkan strategi pemasaran digital menggunakan tools kecerdasan buatan (AI) untuk konten dan iklan.",
        persyaratan: ["Aktif medsos", "Laptop & internet", "KTP"],
        jadwal: [{ id: "jdw-6", tanggal: "28 Nov 2026", tuk: "Online TUK", kuota: "30 Kuota Tersisa" }],
        units: [{ kode: "N.791000.010.01", judul: "Membuat Konten Pemasaran dengan AI" }],
    },
    {
        id: "skm-07",
        code: "SKM-07",
        nomorSkema: "SKM/BNSP/007/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Skema Penerapan AI Untuk Pembelajaran",
        category: "AI & Digital",
        jenis: "Klaster",
        unitsCount: 1,
        level: 3,
        methods: ["Blended Learning"],
        price: "Rp 1.150.000",
        rating: 4.7,
        reviewsCount: 10,
        asesiCount: 25,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        description: "Memanfaatkan teknologi AI generatif dan sistem cerdas untuk merancang media pembelajaran interaktif.",
        persyaratan: ["Pendidik/Trainer", "KTP"],
        jadwal: [{ id: "jdw-7", tanggal: "30 Nov 2026", tuk: "TUK Hybrid", kuota: "15 Kuota Tersisa" }],
        units: [{ kode: "E.850000.001.01", judul: "Merancang Media Pembelajaran Berbasis AI" }],
    },
    {
        id: "skm-08",
        code: "SKM-08",
        nomorSkema: "SKM/BNSP/008/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Skema Pengembang AI Agent (AI Agent Developer)",
        category: "AI & Digital",
        jenis: "Okupasi",
        unitsCount: 1,
        level: 4,
        methods: ["Tatap Muka"],
        price: "Rp 1.750.000",
        rating: 5.0,
        reviewsCount: 22,
        asesiCount: 40,
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
        description: "Membangun, melatih, dan mengintegrasikan agen cerdas (AI agents) menggunakan LLM dan kerangka kerja modern.",
        persyaratan: ["Dasar Python & API", "KTP"],
        jadwal: [{ id: "jdw-8", tanggal: "02 Des 2026", tuk: "TUK Lab AI", kuota: "12 Kuota Tersisa" }],
        units: [{ kode: "AI.010.01", judul: "Memetakan Kebutuhan AI Agent" }],
    },
    {
        id: "skm-09",
        code: "SKM-09",
        nomorSkema: "SKM/BNSP/009/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Skema Pengembang AI Otomasi (AI Automation Developer)",
        category: "AI & Digital",
        jenis: "Okupasi",
        unitsCount: 1,
        level: 4,
        methods: ["Blended Learning"],
        price: "Rp 1.600.000",
        rating: 4.9,
        reviewsCount: 14,
        asesiCount: 38,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        description: "Merancang alur kerja otomatis (workflow automation) yang digabungkan dengan kecerdasan buatan untuk efisiensi bisnis.",
        persyaratan: ["Logika otomatisasi", "KTP"],
        jadwal: [{ id: "jdw-9", tanggal: "05 Des 2026", tuk: "TUK Utama", kuota: "10 Kuota Tersisa" }],
        units: [{ kode: "AUTO.001.01", judul: "Mendesain Business Workflow Otomasi" }],
    },
    {
        id: "skm-10",
        code: "SKM-10",
        nomorSkema: "SKM/BNSP/010/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        title: "Skema Teknisi Laptop (Laptop Technician)",
        category: "IT And Computing Facilities Management",
        jenis: "Okupasi",
        unitsCount: 1,
        level: 3,
        methods: ["Tatap Muka"],
        price: "Rp 1.300.000",
        rating: 4.8,
        reviewsCount: 25,
        asesiCount: 55,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        description: "Bongkar pasang, pemeliharaan, deteksi kerusakan motherboard, serta perbaikan komponen fisik laptop.",
        persyaratan: ["Ijazah SMA/SMK", "Pasfoto & KTP"],
        jadwal: [{ id: "jdw-10", tanggal: "08 Des 2026", tuk: "TUK Hardware", kuota: "15 Kuota Tersisa" }],
        units: [{ kode: "J.620900.050.02", judul: "Pembongkaran dan Pemasangan Komponen Laptop" }],
    },
];

export const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const methods = ["SJJ", "Tatap Muka", "Blended Learning", "Online / Daring"];
export const categories = [...new Set(skemaList.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b)
);