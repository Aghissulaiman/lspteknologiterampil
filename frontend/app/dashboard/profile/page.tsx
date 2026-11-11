"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Region = { code: string; name: string };

async function getRegions(path: string, signal: AbortSignal): Promise<Region[]> {
    const response = await fetch(path, { signal, cache: "force-cache" });
    if (!response.ok) throw new Error("Daftar wilayah belum dapat dimuat.");
    const result = (await response.json()) as { data?: unknown };
    if (!Array.isArray(result.data)) throw new Error("Format data wilayah tidak valid.");
    return result.data as Region[];
}

export default function ProfilPage() {
    const router = useRouter();
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [cities, setCities] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [provinceCode, setProvinceCode] = useState("");
    const [cityCode, setCityCode] = useState("");
    const [loadingProvinces, setLoadingProvinces] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [regionError, setRegionError] = useState("");
    const [activeApplicationId, setActiveApplicationId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        nik: "",
        fullName: "",
        gender: "male",
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
        jobStatus: "Belum Bekerja",
        companyName: "",
        jobTitle: "",
        companyAddress: "",
        postalCode: "",
        companyPhone: "",
        companyEmail: "",
    });

    // 1. Ambil data akun login (/api/auth/me) dan riwayat aplikasi (/api/applications)
    useEffect(() => {
        let active = true;

        async function initData() {
            try {
                // Ambil data user
                const meRes = await fetch("/api/auth/me", { cache: "no-store" });
                let userNik = "";
                let userFullName = "";
                let userPhone = "";
                let userEmail = "";

                if (meRes.ok) {
                    const meData = await meRes.json();
                    if (meData?.user) {
                        userNik = meData.user.nik || "";
                        userFullName = meData.user.fullName || "";
                        userPhone = meData.user.phone || "";
                        userEmail = meData.user.email || "";
                    }
                }

                // Cek apakah ada draft permohonan yang sudah ada
                let existingApl01: Record<string, string> = {};
                const appRes = await fetch("/api/applications", { cache: "no-store" });
                if (appRes.ok) {
                    const appData = await appRes.json();
                    const applications = appData?.applications || [];
                    if (applications.length > 0) {
                        const first = applications[0];
                        if (first.status === "draft" || first.status === "revision_required") {
                            setActiveApplicationId(first.id);
                        }
                        if (first.apl01 && typeof first.apl01 === "object") {
                            existingApl01 = first.apl01;
                        }
                    }
                }

                // Cek juga localStorage jika belum ada dari database
                if (Object.keys(existingApl01).length === 0) {
                    const localDraft = localStorage.getItem("apl01_draft");
                    if (localDraft) {
                        try {
                            existingApl01 = JSON.parse(localDraft);
                        } catch {}
                    }
                }

                if (active) {
                    setProfile((prev) => ({
                        ...prev,
                        nik: existingApl01.nik || userNik || prev.nik,
                        fullName: existingApl01.fullName || userFullName || prev.fullName,
                        phone: existingApl01.phone || userPhone || prev.phone,
                        email: existingApl01.email || userEmail || prev.email,
                        gender: existingApl01.gender || prev.gender,
                        birthPlace: existingApl01.birthPlace || prev.birthPlace,
                        birthDate: existingApl01.birthDate || prev.birthDate,
                        address: existingApl01.address || prev.address,
                        province: existingApl01.province || prev.province,
                        city: existingApl01.city || prev.city,
                        district: existingApl01.district || prev.district,
                        education: existingApl01.education || existingApl01.educationLevel || prev.education,
                        schoolName: existingApl01.schoolName || existingApl01.institution || prev.schoolName,
                        major: existingApl01.major || existingApl01.studyProgram || prev.major,
                        jobStatus: existingApl01.jobStatus || prev.jobStatus,
                        companyName: existingApl01.companyName || prev.companyName,
                        jobTitle: existingApl01.jobTitle || prev.jobTitle,
                        companyAddress: existingApl01.companyAddress || prev.companyAddress,
                        postalCode: existingApl01.postalCode || prev.postalCode,
                        companyPhone: existingApl01.companyPhone || prev.companyPhone,
                        companyEmail: existingApl01.companyEmail || prev.companyEmail,
                    }));
                }
            } catch (err) {
                console.error("Gagal memuat profil awal:", err);
            }
        }

        void initData();
        return () => {
            active = false;
        };
    }, []);

    // 2. Fetch Wilayah (Provinsi)
    useEffect(() => {
        const controller = new AbortController();
        getRegions("/regions/provinces", controller.signal)
            .then(setProvinces)
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setRegionError(error instanceof Error ? error.message : "Daftar provinsi belum dapat dimuat.");
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingProvinces(false);
            });
        return () => controller.abort();
    }, []);

    // 3. Fetch Wilayah (Kota/Kabupaten saat provinsi berubah)
    useEffect(() => {
        if (!provinceCode) return;
        const controller = new AbortController();
        getRegions(`/regions/regencies/${encodeURIComponent(provinceCode)}`, controller.signal)
            .then(setCities)
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setRegionError(error instanceof Error ? error.message : "Daftar kota/kabupaten belum dapat dimuat.");
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingCities(false);
            });
        return () => controller.abort();
    }, [provinceCode]);

    // 4. Fetch Wilayah (Kecamatan saat kota berubah)
    useEffect(() => {
        if (!cityCode) return;
        const controller = new AbortController();
        getRegions(`/regions/districts/${encodeURIComponent(cityCode)}`, controller.signal)
            .then(setDistricts)
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setRegionError(error instanceof Error ? error.message : "Daftar kecamatan belum dapat dimuat.");
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingDistricts(false);
            });
        return () => controller.abort();
    }, [cityCode]);

    const selectProvince = (code: string) => {
        const selected = provinces.find((p) => p.code === code);
        setProfile((current) => ({ ...current, province: selected?.name ?? "", city: "", district: "" }));
        setProvinceCode(code);
        setCityCode("");
        setCities([]);
        setDistricts([]);
        setLoadingCities(Boolean(code));
        setLoadingDistricts(false);
        setRegionError("");
    };

    const selectCity = (code: string) => {
        const selected = cities.find((c) => c.code === code);
        setProfile((current) => ({ ...current, city: selected?.name ?? "", district: "" }));
        setCityCode(code);
        setDistricts([]);
        setLoadingDistricts(Boolean(code));
        setRegionError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const apl01Payload = {
            ...profile,
            educationLevel: profile.education,
            institution: profile.schoolName,
            studyProgram: profile.major,
            employment: profile.jobStatus === "Bekerja" ? `${profile.jobTitle} di ${profile.companyName}` : profile.jobStatus,
        };

        // Simpan ke localStorage agar bisa langsung diakses tahap berikutnya
        localStorage.setItem("apl01_draft", JSON.stringify(apl01Payload));

        // Jika sudah ada aplikasi aktif di server, update via API
        if (activeApplicationId) {
            try {
                await fetch(`/api/applications/${activeApplicationId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ apl01: apl01Payload }),
                });
            } catch (err) {
                console.error("Gagal sinkronisasi APL-01 ke server:", err);
            }
        }

        setSaving(false);
        router.push("/dashboard/skema");
    };

    return (
        <form onSubmit={handleSubmit} className="apl-card">
            {/* HEADER UTAMA */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0070BA] dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Tahap 01 • Formulir FR.APL.01
                </span>
                <h2 className="apl-header-title">
                    Permohonan Sertifikasi Kompetensi
                </h2>
                <h3 className="apl-header-subtitle">
                    Bagian 1 : Rincian Data Pribadi & Biodata Pemohon
                </h3>
                <p className="apl-header-desc">
                    Isi data diri Anda secara lengkap dan akurat. Nama dan identitas yang diinput akan dicetak pada Sertifikat Resmi BNSP jika dinyatakan Kompeten.
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
                        <input
                            type="text"
                            required
                            maxLength={16}
                            placeholder="Nomor Induk Kependudukan (16 angka)"
                            value={profile.nik}
                            onChange={(e) => setProfile({ ...profile, nik: e.target.value.replace(/\D/g, "") })}
                            className="apl-input font-mono"
                        />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Nama Lengkap<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <input
                            type="text"
                            required
                            placeholder="Masukkan Nama Lengkap sesuai KTP"
                            value={profile.fullName}
                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                            className="apl-input"
                        />
                        <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">Nama yang diinput akan tertera di sertifikat (Jika Kompeten)</p>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Jenis Kelamin<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3 flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={profile.gender === "male"}
                                onChange={() => setProfile({ ...profile, gender: "male" })}
                                className="accent-[#0070BA]"
                                required
                            /> Laki-Laki
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={profile.gender === "female"}
                                onChange={() => setProfile({ ...profile, gender: "female" })}
                                className="accent-[#0070BA]"
                                required
                            /> Perempuan
                        </label>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Tempat & Tgl Lahir<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            required
                            placeholder="Kota Tempat Lahir"
                            value={profile.birthPlace}
                            onChange={(e) => setProfile({ ...profile, birthPlace: e.target.value })}
                            className="apl-input"
                        />
                        <div>
                            <input
                                type="date"
                                required
                                value={profile.birthDate}
                                onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                                className="apl-input"
                            />
                            <p className="text-[10px] font-medium text-slate-400 mt-1">Format: YYYY-MM-DD</p>
                        </div>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Alamat Domisili<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <textarea
                            rows={2}
                            required
                            placeholder="Alamat Lengkap Domisili atau Sesuai dengan KTP"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            className="apl-input"
                        />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Wilayah Domisili<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                            required
                            aria-label="Provinsi"
                            value={provinceCode}
                            onChange={(e) => selectProvince(e.target.value)}
                            className="apl-input"
                            disabled={loadingProvinces}
                        >
                            <option value="">{profile.province ? `Terpilih: ${profile.province}` : "-- PILIH PROVINSI --"}</option>
                            {provinces.map((p) => (
                                <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                        </select>
                        <select
                            required
                            aria-label="Kota atau kabupaten"
                            value={cityCode}
                            onChange={(e) => selectCity(e.target.value)}
                            className="apl-input"
                            disabled={!provinceCode || loadingCities}
                        >
                            <option value="">{loadingCities ? "MEMUAT KOTA..." : profile.city ? `Terpilih: ${profile.city}` : "-- PILIH KOTA/KABUPATEN --"}</option>
                            {cities.map((c) => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                        <select
                            required
                            aria-label="Kecamatan"
                            value={districts.find((d) => d.name === profile.district)?.code ?? ""}
                            onChange={(e) => setProfile((current) => ({
                                ...current,
                                district: districts.find((d) => d.code === e.target.value)?.name ?? current.district,
                            }))}
                            className="apl-input"
                            disabled={!cityCode || loadingDistricts}
                        >
                            <option value="">{loadingDistricts ? "MEMUAT KECAMATAN..." : profile.district ? `Terpilih: ${profile.district}` : "-- PILIH KECAMATAN --"}</option>
                            {districts.map((d) => (
                                <option key={d.code} value={d.code}>{d.name}</option>
                            ))}
                        </select>
                        {regionError && (
                            <p role="alert" className="sm:col-span-3 text-xs text-red-700 dark:text-red-300">
                                {regionError}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Kontak<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="tel"
                            required
                            placeholder="No. WhatsApp Aktif (e.g. 08123456789)"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="apl-input"
                        />
                        <input
                            type="email"
                            required
                            placeholder="Alamat Email Aktif"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="apl-input"
                        />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Pendidikan Terakhir<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <select
                            required
                            value={profile.education}
                            onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                            className="apl-input"
                        >
                            <option value="">Pilih Pendidikan Terakhir</option>
                            <option value="SMA / SMK / Sederajat">SMA / SMK / Sederajat</option>
                            <option value="Diploma (D1 / D2 / D3 / D4)">Diploma (D1 / D2 / D3 / D4)</option>
                            <option value="Sarjana (S1)">Sarjana (S1)</option>
                            <option value="Magister (S2) / Doktoral (S3)">Magister (S2) / Doktoral (S3)</option>
                        </select>
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Institusi Pendidikan<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <input
                            type="text"
                            required
                            placeholder="Nama Sekolah / Universitas / Politeknik"
                            value={profile.schoolName}
                            onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                            className="apl-input"
                        />
                    </div>

                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Jurusan / Program Studi<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <input
                            type="text"
                            required
                            placeholder="Jurusan / Program Studi (e.g. Teknik Informatika, RPL, Multimedia)"
                            value={profile.major}
                            onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                            className="apl-input"
                        />
                    </div>
                </div>
            </div>

            {/* b. DATA PEKERJAAN SEKARANG */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="apl-section-title">b. Data Pekerjaan Sekarang</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                    <div className="md:col-span-1 flex items-center">
                        <label className="apl-label">Status Pekerjaan<span className="text-red-500 ml-0.5">*</span></label>
                    </div>
                    <div className="md:col-span-3">
                        <select
                            required
                            value={profile.jobStatus}
                            onChange={(e) => setProfile({ ...profile, jobStatus: e.target.value })}
                            className="apl-input"
                        >
                            <option value="Belum Bekerja">Belum Bekerja</option>
                            <option value="Bekerja">Bekerja / Karyawan</option>
                            <option value="Mahasiswa/Pelajar">Mahasiswa / Pelajar</option>
                            <option value="Freelancer/Wirausaha">Freelancer / Wirausaha</option>
                        </select>
                    </div>

                    {profile.jobStatus === "Bekerja" && (
                        <>
                            <div className="md:col-span-1 flex items-center">
                                <label className="apl-label">Nama Perusahaan / Instansi</label>
                            </div>
                            <div className="md:col-span-3">
                                <input
                                    type="text"
                                    placeholder="Nama Tempat Bekerja"
                                    value={profile.companyName}
                                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                    className="apl-input"
                                />
                            </div>

                            <div className="md:col-span-1 flex items-center">
                                <label className="apl-label">Jabatan / Posisi</label>
                            </div>
                            <div className="md:col-span-3">
                                <input
                                    type="text"
                                    placeholder="Jabatan Pekerjaan Saat Ini"
                                    value={profile.jobTitle}
                                    onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                                    className="apl-input"
                                />
                            </div>

                            <div className="md:col-span-1 flex items-center">
                                <label className="apl-label">Alamat Kantor</label>
                            </div>
                            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <textarea
                                    rows={2}
                                    placeholder="Alamat Lengkap Perusahaan"
                                    className="sm:col-span-2 apl-input"
                                    value={profile.companyAddress}
                                    onChange={(e) => setProfile({ ...profile, companyAddress: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Kode Pos"
                                    value={profile.postalCode}
                                    onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                                    className="apl-input self-start"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">
                    * Dokumen KTP, Ijazah, dan Portofolio akan diunggah pada Tahap 3 (Form APL).
                </p>
                <button
                    type="submit"
                    disabled={saving}
                    className="apl-button flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    {saving ? "Menyimpan..." : "Simpan & Lanjut ke Skema →"}
                </button>
            </div>
        </form>
    );
}
