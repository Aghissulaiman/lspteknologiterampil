export const SCHEMES = [
    {
        id: "skm-desktop",
        code: "SKM-01",
        nomorSkema: "SKM/BNSP/001/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Teknisi Desktop (Desktop Technician)",
        level: "Level 3",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.200.000",
        rating: 4.8,
        reviewCount: 12,
        asesiCount: 50,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80",
        description: "Lakukan instalasi, konfigurasi, perawatan, dan penanganan masalah pada perangkat keras serta sistem operasi komputer desktop sesuai standar industri.",
        units: [
            { code: "J.620900.010.02", title: "Memasang Motherboard" },
            { code: "J.620900.014.02", title: "Merawat CPU" },
            { code: "J.620900.025.02", title: "Melakukan Instalasi Sistem Operasi" }
        ],
        reqs: [
            "Ijazah minimal SMP/SMA/SMK sederajat",
            "Pasfoto formal 3×4 latar belakang merah",
            "Identitas diri resmi (KTP / Kartu Pelajar)"
        ]
    },
    {
        id: "skm-repair",
        code: "SKM-02",
        nomorSkema: "SKM/BNSP/002/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Teknisi Perbaikan Komputer (Computer Repair Technician)",
        level: "Level 3",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.250.000",
        rating: 4.9,
        reviewCount: 18,
        asesiCount: 42,
        image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
        description: "Periksa, diagnosis, dan perbaiki kerusakan perangkat keras maupun perangkat lunak pada komputer secara menyeluruh.",
        units: [
            { code: "J.620200.004.01", title: "Mendiagnosis Kerusakan Perangkat Keras" },
            { code: "J.620200.005.01", title: "Melakukan Perbaikan Perangkat Keras" }
        ],
        reqs: [
            "Ijazah minimal SMA/SMK sederajat",
            "Sertifikat Pelatihan Perbaikan Komputer"
        ]
    },
    {
        id: "skm-hardware",
        code: "SKM-03",
        nomorSkema: "SKM/BNSP/003/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Asisten Instalasi dan Pemeliharaan Perangkat Keras",
        level: "Level 2",
        type: "Klaster",
        method: "Tatap Muka",
        price: "Rp 1.000.000",
        rating: 4.7,
        reviewCount: 10,
        asesiCount: 28,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        description: "Bantu proses persiapan, instalasi, pemeriksaan, dan pemeliharaan berkala perangkat keras komputer sesuai prosedur kerja standar.",
        units: [
            { code: "J.620200.006.01", title: "Menyiapkan Perangkat Keras Komputer" },
            { code: "J.620200.007.01", title: "Melakukan Pemeliharaan Rutin" }
        ],
        reqs: [
            "Ijazah minimal SMP sederajat",
            "Surat Keterangan Sehat"
        ]
    },
    {
        id: "skm-web",
        code: "SKM-04",
        nomorSkema: "SKM/BNSP/004/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Analis Web (Web Analyst)",
        level: "Level 4",
        type: "Okupasi",
        method: "Blended Learning",
        price: "Rp 1.500.000",
        rating: 5.0,
        reviewCount: 8,
        asesiCount: 35,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        description: "Analisis struktur, kebutuhan pengguna, fungsi, dan kinerja situs web untuk menentukan rekomendasi arsitektur serta perbaikan.",
        units: [
            { code: "M.722000.001.02", title: "Menganalisis Kebutuhan Sistem Web" },
            { code: "M.722000.005.02", title: "Melakukan Audit Performa Web" }
        ],
        reqs: [
            "Ijazah minimal SMA/SMK atau sederajat",
            "Portofolio Laporan Analisis Web"
        ]
    },
    {
        id: "skm-prog",
        code: "SKM-05",
        nomorSkema: "SKM/BNSP/005/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Pemrogram Muda (Associate Programmer)",
        level: "Level 3",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.350.000",
        rating: 4.9,
        reviewCount: 22,
        asesiCount: 60,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
        description: "Menulis, menguji, dan memelihara kode program sederhana hingga menengah menggunakan bahasa standar industri.",
        units: [
            { code: "J.620900.001.01", title: "Menggunakan Struktur Data" },
            { code: "J.620900.002.01", title: "Mengimplementasikan Algoritma Pemrograman" }
        ],
        reqs: [
            "Ijazah minimal SMA/SMK atau sederajat",
            "Tautan Repository / Source Code Aplikasi"
        ]
    },
    {
        id: "skm-ai-marketing",
        code: "SKM-06",
        nomorSkema: "SKM/BNSP/006/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Skema Pemasaran Digital Berbasis AI (AI Powered Digital Marketing)",
        level: "Level 3",
        type: "Klaster",
        method: "Online / Daring",
        price: "Rp 1.100.000",
        rating: 4.8,
        reviewCount: 15,
        asesiCount: 45,
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=600&q=80",
        description: "Mengoptimalkan strategi pemasaran digital menggunakan tools kecerdasan buatan (AI) untuk konten, analisis pasar, dan iklan.",
        units: [
            { code: "N.791000.010.01", title: "Membuat Konten Pemasaran dengan AI" },
            { code: "N.791000.012.01", title: "Menganalisis Kampanye Iklan Digital" }
        ],
        reqs: [
            "Aktif menggunakan media sosial",
            "Memiliki perangkat terhubung internet"
        ]
    },
    {
        id: "skm-ai-learning",
        code: "SKM-07",
        nomorSkema: "SKM/BNSP/007/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Skema Penerapan AI Untuk Pembelajaran",
        level: "Level 3",
        type: "Klaster",
        method: "Blended Learning",
        price: "Rp 1.150.000",
        rating: 4.7,
        reviewCount: 11,
        asesiCount: 30,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
        description: "Memanfaatkan teknologi AI generatif dan sistem cerdas untuk merancang media serta materi pembelajaran yang interaktif.",
        units: [
            { code: "E.850000.001.01", title: "Merancang Media Pembelajaran Berbasis AI" },
            { code: "E.850000.003.01", title: "Evaluasi Pembelajaran Berbantuan AI" }
        ],
        reqs: [
            "Pendidik / Trainer / Profesional bidang pelatihan"
        ]
    },
    {
        id: "skm-ai-agent",
        code: "SKM-08",
        nomorSkema: "SKM/BNSP/008/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Skema Pengembang AI Agent (AI Agent Developer)",
        level: "Level 4",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.750.000",
        rating: 5.0,
        reviewCount: 19,
        asesiCount: 40,
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
        description: "Membangun, melatih, dan mengintegrasikan agen cerdas menggunakan Large Language Models (LLM) dan kerangka kerja modern.",
        units: [
            { code: "AI.010.01", title: "Memetakan Kebutuhan AI Agent" },
            { code: "AI.012.01", title: "Mengintegrasikan LLM dan Vector Database" }
        ],
        reqs: [
            "Memahami dasar pemrograman Python dan API"
        ]
    },
    {
        id: "skm-ai-auto",
        code: "SKM-09",
        nomorSkema: "SKM/BNSP/009/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Skema Pengembang AI Otomasi (AI Automation Developer)",
        level: "Level 4",
        type: "Okupasi",
        method: "Blended Learning",
        price: "Rp 1.600.000",
        rating: 4.9,
        reviewCount: 14,
        asesiCount: 38,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        description: "Merancang alur kerja otomatis (workflow automation) yang digabungkan dengan kecerdasan buatan untuk efisiensi bisnis.",
        units: [
            { code: "AUTO.001.01", title: "Mendesain Business Workflow Otomasi" },
            { code: "AUTO.003.01", title: "Menghubungkan API & AI Services" }
        ],
        reqs: [
            "Memahami konsep logika sistem otomatisasi"
        ]
    },
    {
        id: "skm-laptop",
        code: "SKM-10",
        nomorSkema: "SKM/BNSP/010/LSP-TTM/2026",
        masaBerlaku: "3 Tahun",
        name: "Skema Teknisi Laptop (Laptop Technician)",
        level: "Level 3",
        type: "Okupasi",
        method: "Tatap Muka",
        price: "Rp 1.300.000",
        rating: 4.8,
        reviewCount: 25,
        asesiCount: 55,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        description: "Bongkar pasang, pemeliharaan, deteksi kerusakan motherboard, serta perbaikan komponen fisik laptop berbagai merk.",
        units: [
            { code: "J.620900.050.02", title: "Pembongkaran dan Pemasangan Komponen Laptop" },
            { code: "J.620900.055.02", title: "Perbaikan Modul Catu Daya dan Motherboard Laptop" }
        ],
        reqs: [
            "Ijazah minimal SMA/SMK sederajat",
            "Pasfoto formal dan KTP"
        ]
    }
];

export const SCHEDULES = [
    { id: "jdw-1", tukName: "TUK Sewaktu Lab Komputer A", date: "15 Nov 2026", time: "08:00 WIB", quota: 12 },
    { id: "jdw-2", tukName: "TUK Mandiri Teknologi Terampil", date: "22 Nov 2026", time: "09:00 WIB", quota: 20 },
];