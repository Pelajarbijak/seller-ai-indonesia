"use client";

import { useEffect, useState } from "react";

type ListingHistory = {
  id: string;
  productName: string;
  category: string;
  marketplace: string;
  material: string;
  color: string;
  size: string;
  target: string;
  features: string;
  keywords: string;
  style: string;
  createdAt: string;
  result: string;
};

export default function ListingPage() {
  const [marketplace, setMarketplace] = useState("Shopee");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [target, setTarget] = useState("");
  const [features, setFeatures] = useState("");
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState("Profesional");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState("");
  const [history, setHistory] = useState<ListingHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // ============================================
  // LOAD HISTORY
  // ============================================

  useEffect(() => {
    const savedHistory = localStorage.getItem(
      "seller-ai-listing-history"
    );

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);

        // Kompatibel dengan history versi lama
        const upgradedHistory: ListingHistory[] =
          parsed.map((item: Partial<ListingHistory>) => ({
            id: item.id || Date.now().toString(),
            productName: item.productName || "",
            category: item.category || "",
            marketplace: item.marketplace || "Shopee",
            material: item.material || "",
            color: item.color || "",
            size: item.size || "",
            target: item.target || "",
            features: item.features || "",
            keywords: item.keywords || "",
            style: item.style || "Profesional",
            createdAt:
              item.createdAt ||
              new Date().toLocaleString("id-ID"),
            result: item.result || "",
          }));

        setHistory(upgradedHistory);
      } catch {
        localStorage.removeItem(
          "seller-ai-listing-history"
        );
      }
    }
  }, []);

  // ============================================
  // SAVE HISTORY
  // ============================================

  function saveToHistory(newResult: string) {
    const newHistory: ListingHistory = {
      id: Date.now().toString(),
      productName,
      category,
      marketplace,
      material,
      color,
      size,
      target,
      features,
      keywords,
      style,
      createdAt: new Date().toLocaleString("id-ID"),
      result: newResult,
    };

    const updatedHistory = [
      newHistory,
      ...history,
    ].slice(0, 20);

    setHistory(updatedHistory);

    localStorage.setItem(
      "seller-ai-listing-history",
      JSON.stringify(updatedHistory)
    );
  }

  // ============================================
  // GENERATE LISTING
  // ============================================

  async function generateListing() {
    if (!productName.trim() || !category.trim()) {
      alert("Nama produk dan kategori wajib diisi.");
      return;
    }

    setLoading(true);
    setResult("");
    setCopiedSection("");

    try {
      const response = await fetch("/api/listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marketplace,
          productName,
          category,
          material,
          color,
          size,
          target,
          features,
          keywords,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal membuat listing."
        );
      }

      setResult(data.result);

      // Simpan hasil ke history
      saveToHistory(data.result);
    } catch (error) {
      setResult(
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

  function copyText(text: string, section: string) {
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
  // OPEN HISTORY
  // ============================================

  function openHistory(item: ListingHistory) {
    setProductName(item.productName);
    setCategory(item.category);
    setMarketplace(item.marketplace);
    setMaterial(item.material || "");
    setColor(item.color || "");
    setSize(item.size || "");
    setTarget(item.target || "");
    setFeatures(item.features || "");
    setKeywords(item.keywords || "");
    setStyle(item.style || "Profesional");
    setResult(item.result);
    setShowHistory(false);
  }

  // ============================================
  // OPTIMIZE HISTORY
  // ============================================

  function optimizeHistory(item: ListingHistory) {
    const optimizerData = {
      productTitle: item.productName,
      description: item.result,
      keywords: item.keywords,
      productInfo: `
Kategori: ${item.category}
Marketplace: ${item.marketplace}
Material: ${item.material || "Tidak diberikan"}
Warna: ${item.color || "Tidak diberikan"}
Ukuran: ${item.size || "Tidak diberikan"}
Target Pembeli: ${item.target || "Tidak diberikan"}
Fitur Produk: ${item.features || "Tidak diberikan"}
Gaya Bahasa: ${item.style || "Profesional"}
      `.trim(),
    };

    localStorage.setItem(
      "seller-ai-optimizer-data",
      JSON.stringify(optimizerData)
    );

    window.location.href = "/optimizer";
  }

  // ============================================
  // DELETE HISTORY
  // ============================================

  function deleteHistory(id: string) {
    const updatedHistory = history.filter(
      (item) => item.id !== id
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "seller-ai-listing-history",
      JSON.stringify(updatedHistory)
    );
  }

  // ============================================
  // CLEAR ALL HISTORY
  // ============================================

  function clearHistory() {
    const confirmed = window.confirm(
      "Hapus semua history listing?"
    );

    if (!confirmed) return;

    setHistory([]);

    localStorage.removeItem(
      "seller-ai-listing-history"
    );
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

    const contentStart = start + title.length;

    if (!nextTitle) {
      return result.slice(contentStart).trim();
    }

    const end = result.indexOf(
      nextTitle,
      contentStart
    );

    if (end === -1) {
      return result.slice(contentStart).trim();
    }

    return result
      .slice(contentStart, end)
      .trim();
  }

  const judulUtama = getSection(
    "1. JUDUL SEO UTAMA",
    "2. ALTERNATIF JUDUL"
  );

  const alternatifJudul = getSection(
    "2. ALTERNATIF JUDUL",
    "3. DESKRIPSI PRODUK"
  );

  const deskripsi = getSection(
    "3. DESKRIPSI PRODUK",
    "4. KEUNGGULAN PRODUK"
  );

  const keunggulan = getSection(
    "4. KEUNGGULAN PRODUK",
    "5. SPESIFIKASI PRODUK"
  );

  const spesifikasi = getSection(
    "5. SPESIFIKASI PRODUK",
    "6. KEYWORD UTAMA"
  );

  const keywordUtama = getSection(
    "6. KEYWORD UTAMA",
    "7. KEYWORD LONG-TAIL"
  );

  const keywordLongTail = getSection(
    "7. KEYWORD LONG-TAIL",
    "8. FAQ"
  );

  const faq = getSection(
    "8. FAQ",
    "9. CTA"
  );

  const cta = getSection(
    "9. CTA",
    "10. PERINGATAN KLAIM"
  );

  const peringatan = getSection(
    "10. PERINGATAN KLAIM",
    "================================\nATURAN TAMBAHAN"
  );

  const hasStructuredResult =
    judulUtama ||
    alternatifJudul ||
    deskripsi ||
    keunggulan ||
    spesifikasi ||
    keywordUtama ||
    keywordLongTail ||
    faq ||
    cta ||
    peringatan;

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
                AI Listing V2
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                AI Listing
              </h1>

              <p className="mt-2 text-gray-600">
                Buat listing marketplace lengkap
                menggunakan AI.
              </p>
            </div>

            <div className="flex gap-2">
              {history.length > 0 && (
                <button
                  onClick={() =>
                    setShowHistory(!showHistory)
                  }
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  History ({history.length})
                </button>
              )}

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
        </div>

        {/* HISTORY PANEL */}
        {showHistory && (
          <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-gray-900">
                  History Listing
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Maksimal 20 listing terakhir disimpan di browser.
                </p>
              </div>

              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs font-medium text-red-600 hover:text-red-800"
                >
                  Hapus Semua
                </button>
              )}
            </div>

            <div className="divide-y divide-gray-100">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
                >
                  <button
                    onClick={() =>
                      openHistory(item)
                    }
                    className="text-left"
                  >
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.category} •{" "}
                      {item.marketplace} •{" "}
                      {item.createdAt}
                    </p>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        openHistory(item)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Buka
                    </button>

                    <button
                      onClick={() =>
                        optimizeHistory(item)
                      }
                      className="rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                    >
                      Optimalkan
                    </button>

                    <button
                      onClick={() =>
                        deleteHistory(item.id)
                      }
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">

          {/* FORM */}
          <section className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Data Produk
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Isi informasi produk untuk mendapatkan
                listing terbaik.
              </p>
            </div>

            <div className="space-y-5">

              {/* Marketplace */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Marketplace
                </label>

                <select
                  value={marketplace}
                  onChange={(e) =>
                    setMarketplace(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                >
                  <option>Shopee</option>
                  <option>TikTok Shop</option>
                  <option>Tokopedia</option>
                </select>
              </div>

              {/* Nama Produk */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nama Produk *
                </label>

                <input
                  type="text"
                  value={productName}
                  onChange={(e) =>
                    setProductName(e.target.value)
                  }
                  placeholder="Contoh: Sandal Gunung Jepit Pria"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kategori *
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  placeholder="Contoh: Sandal Pria"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Material */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Material
                </label>

                <input
                  type="text"
                  value={material}
                  onChange={(e) =>
                    setMaterial(e.target.value)
                  }
                  placeholder="Contoh: Rubber"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Warna */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Warna
                </label>

                <input
                  type="text"
                  value={color}
                  onChange={(e) =>
                    setColor(e.target.value)
                  }
                  placeholder="Contoh: Hitam"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Ukuran */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Ukuran
                </label>

                <input
                  type="text"
                  value={size}
                  onChange={(e) =>
                    setSize(e.target.value)
                  }
                  placeholder="Contoh: 38-43"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Target */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Target Pembeli
                </label>

                <input
                  type="text"
                  value={target}
                  onChange={(e) =>
                    setTarget(e.target.value)
                  }
                  placeholder="Contoh: Pria, remaja, mahasiswa"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Fitur */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Fitur Produk
                </label>

                <textarea
                  value={features}
                  onChange={(e) =>
                    setFeatures(e.target.value)
                  }
                  placeholder="Contoh: ringan, nyaman dipakai, sol tebal"
                  className="min-h-[120px] w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Keyword */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Keyword Tambahan
                </label>

                <textarea
                  value={keywords}
                  onChange={(e) =>
                    setKeywords(e.target.value)
                  }
                  placeholder="Contoh: sandal gunung, sandal outdoor, sandal pria"
                  className="min-h-[100px] w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* Style */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Gaya Bahasa
                </label>

                <select
                  value={style}
                  onChange={(e) =>
                    setStyle(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                >
                  <option>Profesional</option>
                  <option>Hard Selling</option>
                  <option>Friendly</option>
                  <option>Premium</option>
                  <option>Singkat & Padat</option>
                </select>
              </div>

              {/* Generate */}
              <button
                onClick={generateListing}
                disabled={loading}
                className="w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "AI Sedang Membuat Listing..."
                  : "Generate Listing"}
              </button>
            </div>
          </section>

          {/* HASIL */}
          <section>
            {!result && !loading && (
              <div className="flex min-h-[600px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <div className="max-w-md">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                    AI
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Hasil Listing Akan Muncul Di Sini
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Isi data produk di sebelah kiri kemudian
                    klik Generate Listing untuk membuat
                    listing produk.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[600px] items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
                <div className="text-center">
                  <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                  <h2 className="text-lg font-semibold text-gray-900">
                    AI sedang bekerja...
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Sedang membuat listing produk kamu.
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-5">

                {judulUtama && (
                  <ResultCard
                    number="01"
                    title="Judul SEO Utama"
                    content={judulUtama}
                    onCopy={() =>
                      copyText(
                        judulUtama,
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
                    number="02"
                    title="Alternatif Judul"
                    content={alternatifJudul}
                    onCopy={() =>
                      copyText(
                        alternatifJudul,
                        "alternatif"
                      )
                    }
                    copied={
                      copiedSection === "alternatif"
                    }
                  />
                )}

                {deskripsi && (
                  <ResultCard
                    number="03"
                    title="Deskripsi Produk"
                    content={deskripsi}
                    onCopy={() =>
                      copyText(
                        deskripsi,
                        "deskripsi"
                      )
                    }
                    copied={
                      copiedSection === "deskripsi"
                    }
                    large
                  />
                )}

                {keunggulan && (
                  <ResultCard
                    number="04"
                    title="Keunggulan Produk"
                    content={keunggulan}
                    onCopy={() =>
                      copyText(
                        keunggulan,
                        "keunggulan"
                      )
                    }
                    copied={
                      copiedSection === "keunggulan"
                    }
                  />
                )}

                {spesifikasi && (
                  <ResultCard
                    number="05"
                    title="Spesifikasi Produk"
                    content={spesifikasi}
                    onCopy={() =>
                      copyText(
                        spesifikasi,
                        "spesifikasi"
                      )
                    }
                    copied={
                      copiedSection === "spesifikasi"
                    }
                  />
                )}

                {keywordUtama && (
                  <ResultCard
                    number="06"
                    title="Keyword Utama"
                    content={keywordUtama}
                    onCopy={() =>
                      copyText(
                        keywordUtama,
                        "keyword"
                      )
                    }
                    copied={
                      copiedSection === "keyword"
                    }
                  />
                )}

                {keywordLongTail && (
                  <ResultCard
                    number="07"
                    title="Keyword Long-tail"
                    content={keywordLongTail}
                    onCopy={() =>
                      copyText(
                        keywordLongTail,
                        "longtail"
                      )
                    }
                    copied={
                      copiedSection === "longtail"
                    }
                  />
                )}

                {faq && (
                  <ResultCard
                    number="08"
                    title="FAQ"
                    content={faq}
                    onCopy={() =>
                      copyText(faq, "faq")
                    }
                    copied={
                      copiedSection === "faq"
                    }
                    large
                  />
                )}

                {cta && (
                  <ResultCard
                    number="09"
                    title="CTA"
                    content={cta}
                    onCopy={() =>
                      copyText(cta, "cta")
                    }
                    copied={
                      copiedSection === "cta"
                    }
                  />
                )}

                {peringatan && (
                  <ResultCard
                    number="10"
                    title="Peringatan Klaim"
                    content={peringatan}
                    onCopy={() =>
                      copyText(
                        peringatan,
                        "peringatan"
                      )
                    }
                    copied={
                      copiedSection ===
                      "peringatan"
                    }
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