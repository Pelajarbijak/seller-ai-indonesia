"use client";

import { useState } from "react";

export default function ProfitPage() {
  const [modal, setModal] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [admin, setAdmin] = useState("8.25");
  const [gratisOngkir, setGratisOngkir] = useState("6.5");
  const [affiliate, setAffiliate] = useState("13");
  const [iklan, setIklan] = useState("");
  const [packing, setPacking] = useState("");
  const [result, setResult] = useState<{
    omzet: number;
    biayaAdmin: number;
    biayaGratisOngkir: number;
    biayaAffiliate: number;
    totalBiaya: number;
    profit: number;
    margin: number;
  } | null>(null);

  function hitungProfit() {
    const modalNumber = Number(modal) || 0;
    const hargaJualNumber = Number(hargaJual) || 0;
    const adminNumber = Number(admin) || 0;
    const gratisOngkirNumber = Number(gratisOngkir) || 0;
    const affiliateNumber = Number(affiliate) || 0;
    const iklanNumber = Number(iklan) || 0;
    const packingNumber = Number(packing) || 0;

    const biayaAdmin = hargaJualNumber * (adminNumber / 100);
    const biayaGratisOngkir =
      hargaJualNumber * (gratisOngkirNumber / 100);
    const biayaAffiliate =
      hargaJualNumber * (affiliateNumber / 100);

    const totalBiaya =
      modalNumber +
      biayaAdmin +
      biayaGratisOngkir +
      biayaAffiliate +
      iklanNumber +
      packingNumber;

    const profit = hargaJualNumber - totalBiaya;

    const margin =
      hargaJualNumber > 0
        ? (profit / hargaJualNumber) * 100
        : 0;

    setResult({
      omzet: hargaJualNumber,
      biayaAdmin,
      biayaGratisOngkir,
      biayaAffiliate,
      totalBiaya,
      profit,
      margin,
    });
  }

  function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <a
          href="/"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Kembali ke Dashboard
        </a>

        <div className="mb-8 mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            Profit Calculator
          </h1>

          <p className="mt-2 text-gray-600">
            Hitung estimasi keuntungan bersih produk marketplace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* INPUT */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold">
              Data Produk
            </h2>

            <label className="mb-2 block text-sm font-medium">
              Harga Modal
            </label>

            <input
              type="number"
              value={modal}
              onChange={(e) => setModal(e.target.value)}
              placeholder="Contoh: 30000"
              className="mb-5 w-full rounded-lg border p-3"
            />

            <label className="mb-2 block text-sm font-medium">
              Harga Jual
            </label>

            <input
              type="number"
              value={hargaJual}
              onChange={(e) => setHargaJual(e.target.value)}
              placeholder="Contoh: 59900"
              className="mb-5 w-full rounded-lg border p-3"
            />

            <label className="mb-2 block text-sm font-medium">
              Admin Marketplace (%)
            </label>

            <input
              type="number"
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
              className="mb-5 w-full rounded-lg border p-3"
            />

            <label className="mb-2 block text-sm font-medium">
              Gratis Ongkir (%)
            </label>

            <input
              type="number"
              value={gratisOngkir}
              onChange={(e) => setGratisOngkir(e.target.value)}
              className="mb-5 w-full rounded-lg border p-3"
            />

            <label className="mb-2 block text-sm font-medium">
              Affiliate (%)
            </label>

            <input
              type="number"
              value={affiliate}
              onChange={(e) => setAffiliate(e.target.value)}
              className="mb-5 w-full rounded-lg border p-3"
            />

            <label className="mb-2 block text-sm font-medium">
              Biaya Iklan
            </label>

            <input
              type="number"
              value={iklan}
              onChange={(e) => setIklan(e.target.value)}
              placeholder="Contoh: 3000"
              className="mb-5 w-full rounded-lg border p-3"
            />

            <label className="mb-2 block text-sm font-medium">
              Biaya Packing
            </label>

            <input
              type="number"
              value={packing}
              onChange={(e) => setPacking(e.target.value)}
              placeholder="Contoh: 1000"
              className="mb-6 w-full rounded-lg border p-3"
            />

            <button
              onClick={hitungProfit}
              className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Hitung Profit
            </button>

          </div>

          {/* HASIL */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold">
              Hasil Perhitungan
            </h2>

            {result ? (
              <div className="space-y-4">

                <div className="flex justify-between border-b pb-3">
                  <span>Omzet</span>
                  <strong>
                    {formatRupiah(result.omzet)}
                  </strong>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>Biaya Admin</span>
                  <strong>
                    {formatRupiah(result.biayaAdmin)}
                  </strong>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>Gratis Ongkir</span>
                  <strong>
                    {formatRupiah(result.biayaGratisOngkir)}
                  </strong>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>Affiliate</span>
                  <strong>
                    {formatRupiah(result.biayaAffiliate)}
                  </strong>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>Total Biaya</span>
                  <strong>
                    {formatRupiah(result.totalBiaya)}
                  </strong>
                </div>

                <div className="rounded-xl bg-gray-100 p-5">

                  <p className="text-sm text-gray-500">
                    PROFIT BERSIH
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {formatRupiah(result.profit)}
                  </p>

                  <p className="mt-2 text-sm">
                    Margin: {result.margin.toFixed(2)}%
                  </p>

                </div>

              </div>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center rounded-lg border-2 border-dashed text-center text-gray-400">
                <p>
                  Masukkan data produk kemudian klik
                  <br />
                  "Hitung Profit".
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}