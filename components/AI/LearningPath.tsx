// "use client";

// import {
//     BrainCircuit,
//     Bot,
//     Sparkles,
//     Cpu,
//     CheckCircle2,
// } from "lucide-react";

// const steps = [
//     {
//         number: "01",
//         title: "Fundamental AI",
//         icon: BrainCircuit,
//         description:
//             "Memahami konsep dasar Artificial Intelligence serta perkembangan teknologi AI.",
//         materi: [
//             "Pengenalan Artificial Intelligence",
//             "Konsep Dasar Machine Learning",
//             "Etika Penggunaan AI",
//         ],
//     },
//     {
//         number: "02",
//         title: "Prompt Engineering",
//         icon: Bot,
//         description:
//             "Belajar membuat prompt yang efektif untuk menghasilkan output AI yang optimal.",
//         materi: [
//             "Prompt Engineering",
//             "Pemanfaatan ChatGPT",
//         ],
//     },
//     {
//         number: "03",
//         title: "AI Productivity",
//         icon: Sparkles,
//         description:
//             "Menggunakan AI untuk meningkatkan produktivitas kerja dan pembuatan konten.",
//         materi: [
//             "AI untuk Produktivitas Kerja",
//             "AI untuk Content Creation",
//             "AI Image Generator",
//             "AI Video Generator",
//             "AI Presentation Tools",
//             "AI untuk Digital Marketing",
//         ],
//     },
//     {
//         number: "04",
//         title: "Automation & Project",
//         icon: Cpu,
//         description:
//             "Implementasi AI pada studi kasus nyata dan otomatisasi pekerjaan.",
//         materi: [
//             "AI Automation",
//             "Studi Kasus Implementasi AI",
//         ],
//     },
// ];

// export default function LearningPath() {
//     return (
//         <section
//             id="learning-path"
//             className="py-20 bg-background transition-colors duration-300"
//         >
//             <div className="max-w-7xl mx-auto px-6">

//                 {/* Header */}

//                 <div className="text-center max-w-3xl mx-auto mb-20">

//                     <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">

//                         <Sparkles className="w-4 h-4" />

//                         Learning Path

//                     </span>

//                     <h2 className="mt-5 text-3xl md:text-4xl font-black text-foreground">
//                         Alur Pembelajaran Artificial Intelligence
//                     </h2>

//                     <p className="mt-5 text-muted-foreground leading-7">
//                         Kurikulum dirancang secara bertahap mulai dari memahami konsep dasar
//                         Artificial Intelligence hingga implementasi AI pada dunia kerja
//                         melalui studi kasus dan project nyata.
//                     </p>

//                 </div>

//                 {/* Timeline */}

//                 <div className="relative">

//                     {/* Garis Tengah */}

//                     <div className="hidden lg:block absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-primary/20"></div>

//                     <div className="space-y-20">

//                         {steps.map((step, index) => {

//                             const Icon = step.icon;

//                             return (

//                                 <div
//                                     key={index}
//                                     className={`relative flex items-center ${index % 2 === 0
//                                             ? "lg:justify-start"
//                                             : "lg:justify-end"
//                                         }`}
//                                 >

//                                     {/* Dot */}

//                                     <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-gradient-to-r from-primary to-orange-500 border-4 border-background shadow-lg z-20"></div>

//                                     {/* Card */}

//                                     <div
//                                         className="
//                     group
//                     w-full
//                     lg:w-[46%]
//                     rounded-3xl
//                     border
//                     border-border
//                     bg-card
//                     p-7
//                     shadow-sm
//                     transition-all
//                     duration-500
//                     hover:-translate-y-2
//                     hover:border-orange-500
//                     hover:shadow-xl
//                   "
//                                     >

//                                         {/* Number */}

//                                         <span className="text-5xl font-black text-primary/10">
//                                             {step.number}
//                                         </span>

//                                         {/* Icon */}

//                                         <div className="mt-2 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-12">

//                                             <Icon className="w-7 h-7" />

//                                         </div>

//                                         {/* Title */}

//                                         <h3 className="text-2xl font-bold text-foreground group-hover:text-orange-500 transition-colors">
//                                             {step.title}
//                                         </h3>

//                                         <p className="mt-3 text-muted-foreground leading-7">
//                                             {step.description}
//                                         </p>

//                                         {/* Materi */}

//                                         <div className="mt-6 space-y-3">

//                                             {step.materi.map((item, i) => (

//                                                 <div
//                                                     key={i}
//                                                     className="flex items-start gap-3"
//                                                 >

//                                                     <CheckCircle2 className="mt-1 h-5 w-5 text-orange-500 shrink-0" />

//                                                     <span className="text-sm text-foreground">
//                                                         {item}
//                                                     </span>

//                                                 </div>

//                                             ))}

//                                         </div>

//                                     </div>

//                                 </div>

//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

"use client";

import {
    BrainCircuit,
    Bot,
    Sparkles,
    Cpu,
    CheckCircle2,
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Fundamental AI",
        icon: BrainCircuit,
        description:
            "Memahami konsep dasar Artificial Intelligence dan perkembangan teknologi AI.",
        materi: [
            "Pengenalan Artificial Intelligence",
            "Konsep Dasar Machine Learning",
            "Etika Penggunaan AI",
        ],
    },
    {
        number: "02",
        title: "Prompt Engineering",
        icon: Bot,
        description:
            "Belajar membuat prompt yang efektif menggunakan ChatGPT dan AI Assistant.",
        materi: [
            "Prompt Engineering",
            "Pemanfaatan ChatGPT",
        ],
    },
    {
        number: "03",
        title: "AI Productivity",
        icon: Sparkles,
        description:
            "Menggunakan AI untuk meningkatkan produktivitas dan pembuatan konten.",
        materi: [
            "AI untuk Produktivitas Kerja",
            "AI untuk Content Creation",
            "AI Image Generator",
            "AI Video Generator",
            "AI Presentation Tools",
            "AI untuk Digital Marketing",
        ],
    },
    {
        number: "04",
        title: "Automation & Project",
        icon: Cpu,
        description:
            "Implementasi AI melalui studi kasus dan otomatisasi pekerjaan.",
        materi: [
            "AI Automation",
            "Studi Kasus Implementasi AI",
        ],
    },
];

export default function LearningPath() {
    return (
        <section
            id="learning-path"
            className="py-14 bg-background transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}

                <div className="text-center max-w-2xl mx-auto mb-14">

                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        Learning Path
                    </span>

                    <h2 className="mt-4 text-2xl md:text-3xl font-bold text-foreground">
                        Alur Pembelajaran AI
                    </h2>

                    <p className="mt-3 text-sm text-muted-foreground leading-7">
                        Kurikulum disusun secara bertahap agar peserta memahami konsep
                        Artificial Intelligence hingga mampu mengimplementasikannya
                        dalam dunia kerja.
                    </p>

                </div>

                {/* Timeline */}

                <div className="relative">

                    {/* Vertical Line */}

                    <div className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border"></div>

                    <div className="space-y-10">

                        {steps.map((step, index) => {

                            const Icon = step.icon;

                            return (

                                <div
                                    key={index}
                                    className={`relative flex ${index % 2 === 0
                                            ? "lg:justify-start"
                                            : "lg:justify-end"
                                        }`}
                                >

                                    {/* Dot */}

                                    <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 h-4 w-4 rounded-full bg-gradient-to-r from-primary to-orange-500 border-2 border-background shadow-md z-20"></div>

                                    {/* Card */}

                                    <div
                                        className="
                    group
                    w-full
                    lg:w-[45%]
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-orange-500
                    hover:shadow-lg
                  "
                                    >

                                        {/* Number */}

                                        <span className="text-3xl font-black text-primary/10">
                                            {step.number}
                                        </span>

                                        {/* Icon */}

                                        <div
                                            className="
                      mt-2
                      mb-4
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                      transition-all
                      duration-300
                      group-hover:bg-orange-500
                      group-hover:text-white
                    "
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        {/* Title */}

                                        <h3 className="text-lg font-bold text-foreground group-hover:text-orange-500 transition-colors">
                                            {step.title}
                                        </h3>

                                        {/* Description */}

                                        <p className="mt-2 text-sm text-muted-foreground leading-6">
                                            {step.description}
                                        </p>

                                        {/* Materi */}

                                        <div className="mt-5 space-y-2">

                                            {step.materi.map((item, i) => (

                                                <div
                                                    key={i}
                                                    className="flex items-start gap-2"
                                                >

                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-500 shrink-0" />

                                                    <span className="text-sm text-foreground">
                                                        {item}
                                                    </span>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>

            </div>
        </section>
    );
}