import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY tidak ditemukan di server.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
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
    } = body;

    // ============================================
    // VALIDASI INPUT
    // ============================================

    if (!productName?.trim() || !category?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama produk dan kategori wajib diisi.",
        },
        { status: 400 }
      );
    }

    // ============================================
    // GEMINI CLIENT
    // ============================================

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        // Batasi waktu setiap request supaya tidak menggantung
        timeout: 20000,

        // Batasi retry otomatis SDK.
        // 1 = hanya 1 percobaan, tanpa retry berulang.
        retryOptions: {
          attempts: 1,
        },
      },
    });

    // ============================================
    // PROMPT
    // ============================================

    const prompt = `
Kamu adalah "Seller AI Indonesia", AI Listing Assistant khusus seller marketplace Indonesia.

Tugas kamu adalah membantu seller membuat listing produk yang:
- relevan dengan produk
- mudah dipahami pembeli
- SEO-friendly
- natural
- tidak melakukan keyword stuffing
- tidak mengarang spesifikasi
- tidak membuat klaim yang tidak diberikan seller

PENTING:
Gunakan HANYA informasi yang diberikan seller.

Jika sebuah spesifikasi tidak diberikan, jangan mengarangnya.

Jangan mengklaim:
- waterproof
- anti air
- premium
- original
- tahan lama
- anti slip
- nyaman
- berkualitas tinggi
- garansi
- BPOM
- SNI
- halal
- atau klaim lainnya

kecuali informasi tersebut memang diberikan oleh seller.

DATA PRODUK

Marketplace:
${marketplace || "-"}

Nama Produk:
${productName}

Kategori:
${category}

Material:
${material || "-"}

Warna:
${color || "-"}

Ukuran:
${size || "-"}

Target Pembeli:
${target || "-"}

Fitur Produk:
${features || "-"}

Keyword Tambahan:
${keywords || "-"}

Gaya Bahasa:
${style || "Profesional"}


TUGAS:

Buat listing produk lengkap untuk marketplace ${marketplace || "marketplace Indonesia"}.


================================
1. JUDUL SEO UTAMA
================================

Buat 1 judul utama.

Ketentuan:
- jelas
- natural
- mengandung keyword penting
- tidak berlebihan
- tidak menggunakan simbol yang tidak perlu
- tidak menggunakan emoji


================================
2. ALTERNATIF JUDUL
================================

Buat 3 alternatif judul.

Setiap judul harus memiliki variasi keyword dan susunan kata yang berbeda.


================================
3. DESKRIPSI PRODUK
================================

Buat deskripsi yang siap copy-paste ke marketplace.

Struktur:

Pembuka singkat

Keunggulan / manfaat produk

Detail produk

Cocok digunakan untuk siapa

Penutup / CTA


================================
4. KEUNGGULAN PRODUK
================================

Buat 5 poin keunggulan.

Gunakan hanya informasi yang benar-benar tersedia.


================================
5. SPESIFIKASI PRODUK
================================

Tampilkan:

- Nama Produk:
- Kategori:
- Material:
- Warna:
- Ukuran:
- Target Pembeli:

Jika data kosong, tulis:
"Belum diinformasikan"


================================
6. KEYWORD UTAMA
================================

Buat 10 keyword utama yang relevan.

Jangan mengarang kategori yang tidak berhubungan dengan produk.


================================
7. KEYWORD LONG-TAIL
================================

Buat 10 keyword long-tail.

Keyword harus terdengar seperti pencarian nyata calon pembeli Indonesia.


================================
8. FAQ
================================

Buat 5 pertanyaan dan jawaban yang kemungkinan ditanyakan pembeli.

Jangan mengarang informasi yang tidak tersedia.

Jika jawabannya belum diketahui, arahkan pembeli untuk menghubungi seller.


================================
9. CTA
================================

Buat 3 pilihan kalimat CTA singkat.

CTA harus cocok untuk marketplace Indonesia.


================================
10. PERINGATAN KLAIM
================================

Buat daftar informasi atau klaim yang TIDAK boleh digunakan karena belum diberikan oleh seller.

Jika tidak ada masalah, tulis:

"Aman. Tidak ditemukan klaim yang berisiko."


================================
ATURAN TAMBAHAN
================================

1. Gunakan Bahasa Indonesia.
2. Jangan menggunakan emoji.
3. Jangan menggunakan hashtag.
4. Jangan melakukan keyword stuffing.
5. Jangan mengarang spesifikasi.
6. Jangan mengarang ukuran.
7. Jangan mengarang bahan.
8. Jangan mengarang garansi.
9. Jangan mengklaim produk original jika tidak disebutkan.
10. Jangan mengklaim produk premium jika tidak disebutkan.
11. Jangan memberikan informasi medis.
12. Jangan membuat klaim yang tidak dapat dibuktikan.
13. Gunakan gaya bahasa: ${style || "Profesional"}.
14. Fokus pada kebutuhan seller marketplace Indonesia.
15. Hasil harus siap digunakan seller.
`;

    // ============================================
    // FUNGSI PANGGIL GEMINI
    // ============================================

    async function generateWithModel(model: string) {
      console.log(`Mencoba model: ${model}`);

      const result = await ai.interactions.create({
        model,
        input: prompt,
      });

      console.log(`Model ${model} berhasil.`);

      return result;
    }

    // ============================================
    // MODEL UTAMA
    // ============================================

    try {
      const response = await generateWithModel(
        "gemini-3.8-flash"
      );

      return NextResponse.json({
        success: true,
        result: response.output_text,
      });
    } catch (primaryError) {
      console.error(
        "Gemini 3.8 Flash gagal:",
        primaryError
      );
    }

    // ============================================
    // MODEL CADANGAN
    // ============================================

    try {
      const response = await generateWithModel(
        "gemini-3.7-flash"
      );

      return NextResponse.json({
        success: true,
        result: response.output_text,
      });
    } catch (fallbackError) {
      console.error(
        "Gemini 3.7 Flash juga gagal:",
        fallbackError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Gemini tidak dapat memproses permintaan saat ini. Silakan coba lagi beberapa saat kemudian.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Listing API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}