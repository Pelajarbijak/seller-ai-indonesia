import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-black">
            Seller AI Indonesia
          </h1>

          <p className="mt-2 text-gray-600">
            AI Assistant untuk Seller Marketplace Indonesia
          </p>

          <p className="mt-1 text-sm text-gray-400">
            MVP v0.1
          </p>
        </div>

        {/* MENU */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* AI LISTING */}
          <Link
            href="/listing"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-black hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              AI
            </div>

            <h2 className="text-xl font-semibold text-black">
              AI Listing
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Buat judul SEO, deskripsi, keyword,
              FAQ, CTA, dan konten listing produk
              menggunakan AI.
            </p>

            <div className="mt-5 text-sm font-semibold text-black">
              Buka AI Listing →
            </div>
          </Link>

          {/* PROFIT CALCULATOR */}
          <Link
            href="/profit"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-black hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              Rp
            </div>

            <h2 className="text-xl font-semibold text-black">
              Profit Calculator
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Hitung modal, biaya marketplace,
              affiliate, iklan, packing, profit,
              dan margin produk.
            </p>

            <div className="mt-5 text-sm font-semibold text-black">
              Buka Profit Calculator →
            </div>
          </Link>

          {/* AI OPTIMIZER */}
          <Link
            href="/optimizer"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-black hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              OPT
            </div>

            <h2 className="text-xl font-semibold text-black">
              AI Optimizer
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Analisis listing lama dan dapatkan
              rekomendasi judul, deskripsi,
              keyword, serta checklist perbaikan.
            </p>

            <div className="mt-5 text-sm font-semibold text-black">
              Buka AI Optimizer →
            </div>
          </Link>

        </div>

        {/* INFO */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-black">
            Status Seller AI
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            AI Listing, Profit Calculator, dan AI
            Optimizer tersedia untuk digunakan.
          </p>
        </div>

      </div>
    </main>
  );
}