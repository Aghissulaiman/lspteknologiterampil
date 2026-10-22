
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
    const router = useRouter();

    const [profile, setProfile] = useState({
        nik: "",
        fullName: "",
        gender: "",
        birthPlace: "",
        birthDate: "",
        address: "",
        province: "",
        city: "",
        district: "",
        phone: "",
        email: "",
        education: "",
        schoolName: "",
        major: "",
        jobStatus: "",
        companyName: "",
        jobTitle: "",
        companyAddress: "",
        postalCode: "",
        companyPhone: "",
        companyEmail: "",
    });

    const [photoFile, setPhotoFile] = useState("");
    const [ktpFile, setKtpFile] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard/skema");
    };

    return (
        <form onSubmit={handleSubmit} className="apl-card">
            {/* HEADER UTAMA */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                <h2 className="apl-header-title">
                    FR.APL.01 Formulir Permohonan Sertifikasi Kompetensi
                </h2>
                <h3 className="apl-header-subtitle">
                    Bagian 1 : Rincian Data Pemohon Sertifikasi
                </h3>
                <p className="apl-header-desc">
                    Pada bagian ini, cantumkan data pribadi, data pendidikan formal anda pada saat ini.
                </p>
            </div>

            {/* a. DATA PRIBADI */}
            <div>
                <h4 className="apl-section-title">a. Data Pribadi</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">NIK<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <input type="text" required placeholder="Masukkan Nomor Induk Kependudukan" value={profile.nik} onChange={(e) => setProfile({ ...profile, nik: e.target.value.replace(/\D/g, "") })} className="apl-input" />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Nama Lengkap<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <input type="text" required placeholder="Masukkan Nama Lengkap" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="apl-input" />
                        <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">Nama yang diinput akan tertera di sertifikat (Jika Kompeten)</p>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Jenis Kelamin<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3 flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                            <input type="radio" name="gender" value="Laki-Laki" onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="accent-[#0070BA]" required /> Laki-Laki
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                            <input type="radio" name="gender" value="Perempuan" onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="accent-[#0070BA]" required /> Perempuan
                        </label>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Tempat & Tgl Lahir<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" required placeholder="Masukkan Tempat Lahir" value={profile.birthPlace} onChange={(e) => setProfile({ ...profile, birthPlace: e.target.value })} className="apl-input" />
                        <div>
                            <input type="date" required value={profile.birthDate} onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })} className="apl-input" />
                            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">Format: Tanggal-Bulan-Tahun</p>
                        </div>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Alamat Domisili<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <textarea rows={2} required placeholder="Alamat Lengkap Domisili atau Sesuai dengan KTP" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="apl-input" />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Wilayah</label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select value={profile.province} onChange={(e) => setProfile({ ...profile, province: e.target.value })} className="apl-input">
                            <option value="">-- PILIH PROVINSI --</option>
                            <option value="Jawa Barat">Jawa Barat</option>
                            <option value="DKI Jakarta">DKI Jakarta</option>
                        </select>
                        <select value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="apl-input">
                            <option value="">-- PILIH KOTA --</option>
                            <option value="Bandung">Bandung</option>
                        </select>
                        <select value={profile.district} onChange={(e) => setProfile({ ...profile, district: e.target.value })} className="apl-input">
                            <option value="">-- PILIH KECAMATAN --</option>
                            <option value="Sukajadi">Sukajadi</option>
                        </select>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Kontak<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="tel" required placeholder="No WhatsApp Aktif" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="apl-input" />
                        <input type="email" required placeholder="Alamat Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="apl-input" />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Pendidikan<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <select required value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} className="apl-input">
                            <option value="">Pilih Pendidikan Terakhir</option>
                            <option value="SMK / Sederajat">SMK / Sederajat</option>
                            <option value="D3 / D4">D3 / D4</option>
                            <option value="S1">S1</option>
                        </select>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Institusi<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <input type="text" required placeholder="Nama Sekolah / Perguruan Tinggi" value={profile.schoolName} onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })} className="apl-input" />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Jurusan<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <input type="text" required placeholder="Jurusan / Program Studi" value={profile.major} onChange={(e) => setProfile({ ...profile, major: e.target.value })} className="apl-input" />
                    </div>
                </div>
            </div>

            {/* b. DATA PEKERJAAN SEKARANG */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="apl-section-title">b. Data Pekerjaan Sekarang</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Pekerjaan<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <select required value={profile.jobStatus} onChange={(e) => setProfile({ ...profile, jobStatus: e.target.value })} className="apl-input">
                            <option value="">Pilih Status Pekerjaan</option>
                            <option value="Bekerja">Bekerja</option>
                            <option value="Belum Bekerja">Belum Bekerja</option>
                            <option value="Mahasiswa/Pelajar">Mahasiswa/Pelajar</option>
                        </select>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Perusahaan</label>
                    </div>
                    <div className="md:col-span-3">
                        <input type="text" placeholder="Nama Perusahaan / Instansi / Freelance / -" value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} className="apl-input" />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Jabatan</label>
                    </div>
                    <div className="md:col-span-3">
                        <input type="text" placeholder="Jabatan di Perusahaan" value={profile.jobTitle} onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })} className="apl-input" />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Alamat Kantor</label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <textarea rows={2} placeholder="Alamat Perusahaan" className="sm:col-span-2 apl-input" value={profile.companyAddress} onChange={(e) => setProfile({ ...profile, companyAddress: e.target.value })} />
                        <input type="text" placeholder="Kode POS" value={profile.postalCode} onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })} className="apl-input self-start" />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Kontak Kantor</label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="tel" placeholder="No Telp Perusahaan" value={profile.companyPhone} onChange={(e) => setProfile({ ...profile, companyPhone: e.target.value })} className="apl-input" />
                        <input type="email" placeholder="Email Perusahaan" value={profile.companyEmail} onChange={(e) => setProfile({ ...profile, companyEmail: e.target.value })} className="apl-input" />
                    </div>
                </div>
            </div>

            {/* UPLOAD BERKAS DASAR */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="apl-file-card">
                    <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white mb-2">Pasfoto Formal (3x4)</p>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setPhotoFile(e.target.files[0].name)} className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#0070BA] file:text-white file:font-semibold hover:file:bg-blue-700 cursor-pointer dark:text-slate-300" />
                    {photoFile && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">✓ {photoFile}</p>}
                </div>
                <div className="apl-file-card">
                    <p className="font-semibold text-sm text-[#1a2b4c] dark:text-white mb-2">Scan KTP / Kartu Pelajar</p>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => e.target.files?.[0] && setKtpFile(e.target.files[0].name)} className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#0070BA] file:text-white file:font-semibold hover:file:bg-blue-700 cursor-pointer dark:text-slate-300" />
                    {ktpFile && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">✓ {ktpFile}</p>}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="apl-button"
                >
                    Simpan & Lanjut ke Skema 
                </button>
            </div>
        </form>
    );
}