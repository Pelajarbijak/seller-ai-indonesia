"use client";

import { useEffect, useState } from "react";

type OptimizerData = {
  productTitle: string;
  description: string;
  keywords: string;
  productInfo: string;
};

export default function OptimizerPage() {
  const [productTitle, setProductTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [productInfo, setProductInfo] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState("");

  // ============================================
  // LOAD DATA DARI HISTORY
  // ============================================

  useEffect(() => {
    const savedData = localStorage.getItem(
      "seller-ai-optimizer-data"
    );

    if (!savedData) return;

    try {
      const data: OptimizerData =
        JSON.parse(savedData);

      setProductTitle(data.productTitle || "");
      setDescription(data.description || "");
      setKeywords(data.keywords || "");
      setProductInfo(data.productInfo || "");

      // Hapus data setelah berhasil dipindahkan
      localStorage.removeItem(
        "seller-ai-optimizer-data"
      );
    } catch {
      localStorage.removeItem(
        "seller-ai-optimizer-data"
      );
    }
  }, []);

  // ============================================
  // OPTIMIZE
  // ============================================

  async function optimizeListing() {
    if (!productTitle.trim()) {
      setError("Judul produk wajib diisi.");
      return;
    }

    if (!description.trim()) {
      setError("Deskripsi produk wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    setCopiedSection("");

    try {
      const response = await fetch(
        "/api/optimizer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productTitle,
            description,
            keywords,
            productInfo,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server mengembalikan response yang tidak valid. Pastikan API Optimizer tersedia."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Gagal melakukan optimasi listing."
        );
      }

      setResult(data.result || "");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // COPY
  // ============================================

  function copyText(
    text: string,
    section: string
  ) {
    if (!text) return;

    navigator.clipboard.writeText(text);

    setCopiedSection(section);

    setTimeout(() => {
      setCopiedSection("");
    }, 1500);
  }

  function copyAll() {
    if (!result) return;

    navigator.clipboard.writeText(result);

    setCopiedSection("all");

    setTimeout(() => {
      setCopiedSection("");
    }, 1500);
  }

  // ============================================
  // PARSE RESULT
  // ============================================

  function getSection(
    title: string,
    nextTitle?: string
  ) {
    if (!result) return "";

    const start = result.indexOf(title);

    if (start === -1) return "";

    const contentStart =
      start + title.length;

    if (!nextTitle) {
      return result
        .slice(contentStart)
        .trim();
    }

    const end = result.indexOf(
      nextTitle,
      contentStart
    );

    if (end === -1) {
      return result
        .slice(contentStart)
        .trim();
    }

    return result
      .slice(contentStart, end)
      .trim();
  }

  const analisis = getSection(
    "=== ANALISIS LISTING ===",
    "=== JUDUL SEO BARU ==="
  );

  const judulSeo = getSection(
    "=== JUDUL SEO BARU ===",
    "=== 3 ALTERNATIF JUDUL ==="
  );

  const alternatifJudul = getSection(
    "=== 3 ALTERNATIF JUDUL ===",
    "=== DESKRIPSI YANG DIPERBAIKI ==="
  );

  const deskripsiBaru = getSection(
    "=== DESKRIPSI YANG DIPERBAIKI ===",
    "=== KEYWORD UTAMA ==="
  );

  const keywordUtama = getSection(
    "=== KEYWORD UTAMA ===",
    "=== KEYWORD LONG-TAIL ==="
  );

  const keywordLongTail = getSection(
    "=== KEYWORD LONG-TAIL ===",
    "=== INFORMASI YANG MASIH KURANG ==="
  );

  const informasiKurang = getSection(
    "=== INFORMASI YANG MASIH KURANG ===",
    "=== KLAIM YANG PERLU DICEK ==="
  );

  const klaimDicek = getSection(
    "=== KLAIM YANG PERLU DICEK ===",
    "=== CHECKLIST PERBAIKAN ==="
  );

  const checklist = getSection(
    "=== CHECKLIST PERBAIKAN ==="
  );

  const hasStructuredResult =
    analisis ||
    judulSeo ||
    alternatifJudul ||
    deskripsiBaru ||
    keywordUtama ||
    keywordLongTail ||
    informasiKurang ||
    klaimDicek ||
    checklist;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() =>
              (window.location.href = "/")
            }
            className="mb-5 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            ← Kembali ke Dashboard
          </button>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                AI Optimizer V2
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                AI Optimizer
              </h1>

              <p className="mt-2 text-gray-600">
                Analisis dan optimalkan listing
                produk lama menggunakan AI.
              </p>
            </div>

            {result && (
              <button
                onClick={copyAll}
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                {copiedSection === "all"
                  ? "Berhasil Disalin"
                  : "Copy Semua"}
              </button>
            )}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">

          {/* FORM */}
          <section className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Listing Lama
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Data dari History Listing akan
                otomatis masuk ke sini.
              </p>
            </div>

            <div className="space-y-5">

              {/* Judul */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Judul Produk
                </label>

                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) =>
                    setProductTitle(
                      e.target.value
                    )
                  }
                  placeholder="Judul produk lama"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deskripsi Produk
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Deskripsi produk lama"
                  className="min-h-[220px] w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-black"
                />
              </div>

              {/* Keyword */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Keyword
                </label>

                <textarea
                  value={keywords}
                  onChange={(e) =>
                    setKeywords(
                      e.target.value
                    )
                  }
                  placeholder="Keyword produk"
                  className="min-h-[100px] w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-black"
                />
              </div>

              {/* Informasi Produk */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Informasi Produk
                </label>

                <textarea
                  value={productInfo}
                  onChange={(e) =>
                    setProductInfo(
                      e.target.value
                    )
                  }
                  placeholder="Informasi produk"
                  className="min-h-[180px] w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-black"
                />
              </div>

              {/* Button */}
              <button
                onClick={optimizeListing}
                disabled={loading}
                className="w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "AI Sedang Menganalisis..."
                  : "Analisis & Optimalkan"}
              </button>
            </div>
          </section>

          {/* HASIL */}
          <section>

            {!result && !loading && (
              <div className="flex min-h-[600px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <div className="max-w-md">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl font-bold text-gray-700">
                    OPT
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Hasil Optimizer Akan Muncul Di Sini
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Masukkan listing lama atau buka
                    dari History Listing kemudian
                    klik Analisis & Optimalkan.
                  </p>

                </div>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[600px] items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
                <div className="text-center">

                  <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                  <h2 className="text-lg font-semibold text-gray-900">
                    AI sedang menganalisis...
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Sedang mencari masalah dan
                    peluang optimasi listing.
                  </p>

                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-5">

                {analisis && (
                  <ResultCard
                    number="01"
                    title="Analisis Listing"
                    content={analisis}
                    onCopy={() =>
                      copyText(
                        analisis,
                        "analisis"
                      )
                    }
                    copied={
                      copiedSection ===
                      "analisis"
                    }
                    large
                  />
                )}

                {judulSeo && (
                  <ResultCard
                    number="02"
                    title="Judul SEO Baru"
                    content={judulSeo}
                    onCopy={() =>
                      copyText(
                        judulSeo,
                        "judul"
                      )
                    }
                    copied={
                      copiedSection === "judul"
                    }
                  />
                )}

                {alternatifJudul && (
                  <ResultCard
                    number="03"
                    title="3 Alternatif Judul"
                    content={
                      alternatifJudul
                    }
                    onCopy={() =>
                      copyText(
                        alternatifJudul,
                        "alternatif"
                      )
                    }
                    copied={
                      copiedSection ===
                      "alternatif"
                    }
                  />
                )}

                {deskripsiBaru && (
                  <ResultCard
                    number="04"
                    title="Deskripsi yang Diperbaiki"
                    content={
                      deskripsiBaru
                    }
                    onCopy={() =>
                      copyText(
                        deskripsiBaru,
                        "deskripsi"
                      )
                    }
                    copied={
                      copiedSection ===
                      "deskripsi"
                    }
                    large
                  />
                )}

                {keywordUtama && (
                  <ResultCard
                    number="05"
                    title="Keyword Utama"
                    content={
                      keywordUtama
                    }
                    onCopy={() =>
                      copyText(
                        keywordUtama,
                        "keyword"
                      )
                    }
                    copied={
                      copiedSection ===
                      "keyword"
                    }
                  />
                )}

                {keywordLongTail && (
                  <ResultCard
                    number="06"
                    title="Keyword Long-tail"
                    content={
                      keywordLongTail
                    }
                    onCopy={() =>
                      copyText(
                        keywordLongTail,
                        "longtail"
                      )
                    }
                    copied={
                      copiedSection ===
                      "longtail"
                    }
                  />
                )}

                {informasiKurang && (
                  <ResultCard
                    number="07"
                    title="Informasi yang Masih Kurang"
                    content={
                      informasiKurang
                    }
                    onCopy={() =>
                      copyText(
                        informasiKurang,
                        "informasi"
                      )
                    }
                    copied={
                      copiedSection ===
                      "informasi"
                    }
                  />
                )}

                {klaimDicek && (
                  <ResultCard
                    number="08"
                    title="Klaim yang Perlu Dicek"
                    content={
                      klaimDicek
                    }
                    onCopy={() =>
                      copyText(
                        klaimDicek,
                        "klaim"
                      )
                    }
                    copied={
                      copiedSection ===
                      "klaim"
                    }
                  />
                )}

                {checklist && (
                  <ResultCard
                    number="09"
                    title="Checklist Perbaikan"
                    content={checklist}
                    onCopy={() =>
                      copyText(
                        checklist,
                        "checklist"
                      )
                    }
                    copied={
                      copiedSection ===
                      "checklist"
                    }
                    large
                  />
                )}

                {!hasStructuredResult && (
                  <ResultCard
                    number="AI"
                    title="Hasil AI"
                    content={result}
                    onCopy={() =>
                      copyText(
                        result,
                        "result"
                      )
                    }
                    copied={
                      copiedSection ===
                      "result"
                    }
                    large
                  />
                )}

              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}

function ResultCard({
  number,
  title,
  content,
  onCopy,
  copied,
  large = false,
}: {
  number: string;
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
  large?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
            {number}
          </div>

          <h2 className="font-semibold text-gray-900">
            {title}
          </h2>

        </div>

        <button
          onClick={onCopy}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
        >
          {copied ? "Disalin" : "Copy"}
        </button>

      </div>

      <div
        className={`whitespace-pre-wrap px-5 py-5 text-sm leading-7 text-gray-700 ${
          large ? "min-h-[180px]" : ""
        }`}
      >
        {content}
      </div>

    </div>
  );
}