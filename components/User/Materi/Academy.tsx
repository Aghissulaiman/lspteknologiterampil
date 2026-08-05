// "use client";

// import {
//     BrainCircuit,
//     CheckCircle2,
//     Sparkles,
// } from "lucide-react";

// export default function Academy() {
//     const materi = [
//         "Pengenalan Artificial Intelligence",
//         "Konsep Dasar Machine Learning",
//         "Prompt Engineering",
//         "Pemanfaatan ChatGPT",
//         "AI untuk Produktivitas Kerja",
//         "AI untuk Content Creation",
//         "AI Image Generator",
//         "AI Video Generator",
//         "AI Presentation Tools",
//         "AI untuk Digital Marketing",
//         "AI Automation",
//         "Etika Penggunaan AI",
//         "Studi Kasus Implementasi AI",
//     ];

//     return (
//         <section
//             id="academy"
//             className="py-20 bg-muted/30 transition-colors duration-300"
//         >
//             <div className="mx-auto max-w-7xl px-6">


//                 {/* Content */}
//                 <div className="mt-1 grid lg:grid-cols-2 gap-8">

//                     {/* Materi */}
//                     <div className="rounded-2xl border border-border bg-background p-6">

//                         <div className="flex items-center gap-3 mb-6">
//                             <BrainCircuit className="w-8 h-8 text-primary" />
//                             <h3 className="text-xl font-semibold text-foreground">
//                                 Materi Pelatihan
//                             </h3>
//                         </div>

//                         <div className="grid gap-3">

//                             {materi.map((item, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex items-start gap-3 rounded-xl border border-border p-3 transition hover:border-orange-500"
//                                 >
//                                     <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />

//                                     <span className="text-sm text-foreground">
//                                         {item}
//                                     </span>
//                                 </div>
//                             ))}

//                         </div>

//                     </div>

//                     {/* Kompetensi */}
//                     <div className="rounded-2xl border border-border bg-background p-6">

//                         <h3 className="text-xl font-semibold text-foreground mb-6">
//                             Kompetensi Peserta
//                         </h3>

//                         <div className="space-y-4">

//                             {[
//                                 "Memahami konsep dasar Artificial Intelligence.",
//                                 "Menggunakan berbagai tools AI untuk kebutuhan pekerjaan.",
//                                 "Membuat prompt yang efektif.",
//                                 "Menghasilkan konten dengan bantuan AI.",
//                                 "Mengoptimalkan produktivitas menggunakan AI.",
//                                 "Menerapkan AI secara etis dan bertanggung jawab.",
//                             ].map((item, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex gap-3"
//                                 >
//                                     <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />

//                                     <p className="text-sm text-muted-foreground">
//                                         {item}
//                                     </p>

//                                 </div>
//                             ))}

//                         </div>

//                     </div>

//                 </div>

//             </div>
//         </section>
//     );
// }
"use client";

import { useState } from "react";
import {
    BrainCircuit,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

const materi = [
    {
        title: "Pengenalan Artificial Intelligence",
        content:
            "Artificial Intelligence (AI) merupakan teknologi yang memungkinkan komputer membantu manusia menyelesaikan berbagai pekerjaan secara lebih cepat, efisien, dan cerdas.",
    },
    {
        title: "Konsep Dasar Machine Learning",
        content:
            "Machine Learning merupakan cabang AI yang memungkinkan sistem belajar dari data sehingga mampu mengenali pola dan membuat prediksi.",
    },
    {
        title: "Prompt Engineering",
        content:
            "Teknik menyusun prompt yang efektif agar AI menghasilkan jawaban yang akurat sesuai kebutuhan pengguna.",
    },
    {
        title: "Pemanfaatan ChatGPT",
        content:
            "Menggunakan ChatGPT untuk membantu membuat ide, laporan, email, artikel, hingga menyelesaikan pekerjaan sehari-hari.",
    },
    {
        title: "AI untuk Produktivitas Kerja",
        content:
            "Memanfaatkan AI untuk meningkatkan produktivitas kerja melalui otomatisasi dan efisiensi pekerjaan.",
    },
    {
        title: "AI untuk Content Creation",
        content:
            "Membuat artikel, caption media sosial, copywriting, hingga script video menggunakan AI.",
    },
    {
        title: "AI Image Generator",
        content:
            "Membuat gambar menggunakan AI dengan teknik prompt yang tepat.",
    },
    {
        title: "AI Video Generator",
        content:
            "Menghasilkan video berbasis AI dari teks maupun gambar.",
    },
    {
        title: "AI Presentation Tools",
        content:
            "Membuat presentasi profesional dengan bantuan AI.",
    },
    {
        title: "AI untuk Digital Marketing",
        content:
            "Mengoptimalkan strategi digital marketing menggunakan AI.",
    },
    {
        title: "AI Automation",
        content:
            "Mengotomatisasi pekerjaan yang berulang agar lebih cepat dan efisien.",
    },
    {
        title: "Etika Penggunaan AI",
        content:
            "Memahami penggunaan AI secara bertanggung jawab serta menjaga keamanan data.",
    },
    {
        title: "Studi Kasus Implementasi AI",
        content:
            "Menerapkan seluruh materi melalui studi kasus sederhana di dunia kerja.",
    },
];

export default function Academy() {
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <section
            id="academy"
            className="py-20 bg-muted/30 transition-colors duration-300"
        >
            <div className="mx-auto max-w-7xl px-6">
                <div className="mt-1 grid lg:grid-cols-2 gap-8">

                    {/* Materi */}
                    <div className="rounded-2xl border border-border bg-background p-6">

                        <div className="flex items-center gap-3 mb-6">
                            <BrainCircuit className="w-8 h-8 text-primary" />

                            <h3 className="text-xl font-semibold text-foreground">
                                Materi Pelatihan
                            </h3>
                        </div>

                        <div className="grid gap-3">

                            {materi.map((item, index) => (

                                <button
                                    key={index}
                                    onClick={() => setSelected(index)}
                                    className="
            w-full
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-border
            p-3
            text-left
            transition-all
            duration-300
            hover:border-orange-500
            hover:bg-orange-50
            dark:hover:bg-orange-500/10
            hover:shadow-md
          "
                                >

                                    <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />

                                    <div>

                                        <h4 className="text-sm font-semibold text-foreground">
                                            {item.title}
                                        </h4>

                                        <p className="text-xs text-muted-foreground mt-1">
                                            Klik untuk melihat materi
                                        </p>

                                    </div>

                                </button>

                            ))}

                        </div>

                    </div>

                    {/* Kompetensi */}
                    <div className="rounded-2xl border border-border bg-background p-6">

                        <h3 className="text-xl font-semibold text-foreground mb-6">
                            Kompetensi Peserta
                        </h3>

                        <div className="space-y-4">

                            {[
                                "Memahami konsep dasar Artificial Intelligence.",
                                "Menggunakan berbagai tools AI untuk kebutuhan pekerjaan.",
                                "Membuat prompt yang efektif.",
                                "Menghasilkan konten dengan bantuan AI.",
                                "Mengoptimalkan produktivitas menggunakan AI.",
                                "Menerapkan AI secara etis dan bertanggung jawab.",
                            ].map((item, index) => (

                                <div
                                    key={index}
                                    className="flex gap-3"
                                >

                                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />

                                    <p className="text-sm text-muted-foreground">
                                        {item}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>
        
                {/* ================= Modal Materi ================= */}
                {selected !== null && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setSelected(null)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="
              w-full
              max-w-2xl
              rounded-2xl
              border
              border-border
              bg-background
              shadow-2xl
              animate-in
              fade-in
              zoom-in-95
              duration-300
            "
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-border px-6 py-5">
                                <h2 className="text-xl font-bold text-foreground">
                                    {materi[selected].title}
                                </h2>

                                <button
                                    onClick={() => setSelected(null)}
                                    className="rounded-lg p-2 hover:bg-muted transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Isi */}
                            <div className="px-6 py-6">

                                <p className="text-muted-foreground leading-7">
                                    {materi[selected].content}
                                </p>

                                <div className="mt-6 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-4">
                                    <h4 className="font-semibold text-orange-600 mb-2">
                                        Yang akan dipelajari
                                    </h4>

                                    <ul className="space-y-2 text-sm text-muted-foreground list-disc ml-5">
                                        <li>Konsep dasar materi.</li>
                                        <li>Penerapan dalam pekerjaan sehari-hari.</li>
                                        <li>Praktik menggunakan tools AI.</li>
                                        <li>Tips dan studi kasus sederhana.</li>
                                    </ul>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-border px-6 py-5">

                                <button
                                    onClick={() =>
                                        selected > 0 && setSelected(selected - 1)
                                    }
                                    disabled={selected === 0}
                                    className="
                  flex items-center gap-2
                  rounded-lg
                  border
                  border-border
                  px-4
                  py-2
                  text-sm
                  transition
                  hover:border-orange-500
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Sebelumnya
                                </button>

                                <span className="text-sm text-muted-foreground">
                                    {selected + 1} / {materi.length}
                                </span>

                                <button
                                    onClick={() =>
                                        selected < materi.length - 1 &&
                                        setSelected(selected + 1)
                                    }
                                    disabled={selected === materi.length - 1}
                                    className="
                  flex items-center gap-2
                  rounded-lg
                  bg-orange-500
                  px-4
                  py-2
                  text-sm
                  text-white
                  transition
                  hover:bg-orange-600
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
                                >
                                    Selanjutnya
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}