// "use client";

// import Link from "next/link";
// import {
//     Sparkles,
//     ArrowRight,
//     BrainCircuit,
//     Bot,
//     Cpu,
//     BadgeCheck,
// } from "lucide-react";

// export default function Hero() {
//     return (
//         <section
//             id="home"
//             className="relative overflow-hidden bg-background transition-colors duration-300"
//         >
//             {/* Background Blur */}
//             <div className="absolute inset-0 -z-10 overflow-hidden">
//                 <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
//                 <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
//             </div>

//             <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 lg:py-14">

//                 <div className="grid items-center gap-10 lg:grid-cols-2">

//                     {/* ================= LEFT ================= */}

//                     <div>

//                         {/* Badge */}
//                         <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
//                             <Sparkles className="h-4 w-4 text-orange-500" />
//                             Program Artificial Intelligence
//                         </div>

//                         {/* Heading */}
//                         <h1 className="mt-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
//                             Belajar{" "}
//                             <span className="text-primary">
//                                 Artificial Intelligence
//                             </span>
//                             <br />
//                             untuk Dunia{" "}
//                             <span className="text-orange-500">
//                                 Kerja Modern
//                             </span>
//                         </h1>

//                         {/* Description */}
//                         <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
//                             Kuasai Artificial Intelligence mulai dari dasar,
//                             Prompt Engineering, ChatGPT, AI Productivity,
//                             hingga Automation untuk meningkatkan produktivitas
//                             dan daya saing di dunia kerja.
//                         </p>

//                         {/* Button */}
//                         <div className="mt-8 flex flex-wrap gap-3">

//                             <Link
//                                 href="#materi"
//                                 className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-500 hover:scale-105"
//                             >
//                                 Lihat Materi
//                                 <ArrowRight className="ml-2 h-4 w-4" />
//                             </Link>

//                             <Link
//                                 href="#academy"
//                                 className="inline-flex items-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-orange-500 hover:text-orange-500"
//                             >
//                                 Tentang Program
//                             </Link>

//                         </div>

//                         {/* Statistics */}
//                         <div className="mt-8 flex flex-wrap gap-8">

//                             <div>
//                                 <h3 className="text-2xl font-bold text-primary">
//                                     500+
//                                 </h3>
//                                 <p className="text-xs text-muted-foreground">
//                                     Peserta
//                                 </p>
//                             </div>

//                             <div>
//                                 <h3 className="text-2xl font-bold text-orange-500">
//                                     12+
//                                 </h3>
//                                 <p className="text-xs text-muted-foreground">
//                                     Modul AI
//                                 </p>
//                             </div>

//                             <div>
//                                 <h3 className="text-2xl font-bold text-primary">
//                                     100%
//                                 </h3>
//                                 <p className="text-xs text-muted-foreground">
//                                     Project Based
//                                 </p>
//                             </div>

//                         </div>

//                     </div>

//                     {/* ================= RIGHT ================= */}

//                     <div>

//                         <div className="rounded-3xl border border-border bg-card p-6 shadow-lg transition-colors">

//                             <div className="grid grid-cols-2 gap-4">

//                                 <div className="rounded-2xl border border-border bg-background p-5 transition-all hover:border-orange-500 hover:-translate-y-1">
//                                     <BrainCircuit className="mb-3 h-8 w-8 text-primary" />
//                                     <h3 className="text-sm font-semibold text-foreground">
//                                         Prompt Engineering
//                                     </h3>
//                                 </div>

//                                 <div className="rounded-2xl border border-border bg-background p-5 transition-all hover:border-orange-500 hover:-translate-y-1">
//                                     <Bot className="mb-3 h-8 w-8 text-orange-500" />
//                                     <h3 className="text-sm font-semibold text-foreground">
//                                         AI Chatbot
//                                     </h3>
//                                 </div>

//                                 <div className="rounded-2xl border border-border bg-background p-5 transition-all hover:border-orange-500 hover:-translate-y-1">
//                                     <Cpu className="mb-3 h-8 w-8 text-primary" />
//                                     <h3 className="text-sm font-semibold text-foreground">
//                                         Automation
//                                     </h3>
//                                 </div>

//                                 <div className="rounded-2xl border border-border bg-background p-5 transition-all hover:border-orange-500 hover:-translate-y-1">
//                                     <BadgeCheck className="mb-3 h-8 w-8 text-orange-500" />
//                                     <h3 className="text-sm font-semibold text-foreground">
//                                         Sertifikat Resmi
//                                     </h3>
//                                 </div>

//                             </div>

//                         </div>

//                     </div>

//                 </div>

//             </div>
//         </section>
//     );
// }