import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY belum ditemukan.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      productTitle,
      description,
      keywords,
      productInfo,
    } = body;

    if (!productTitle?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul produk wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Deskripsi produk wajib diisi.",
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
Kamu adalah AI Optimizer untuk seller marketplace Indonesia.

Tugas kamu adalah menganalisis listing produk lama dan memberikan rekomendasi optimasi.

ATURAN:

- Gunakan hanya informasi yang diberikan seller.
- Jangan mengarang spesifikasi produk.
- Jangan mengarang material.
- Jangan mengarang ukuran.
- Jangan mengarang warna.
- Jangan mengarang fitur.
- Jangan membuat klaim kesehatan atau performa yang tidak didukung.
- Jangan menggunakan emoji.
- Jangan menggunakan hashtag.
- Jangan melakukan keyword stuffing.
- Gunakan Bahasa Indonesia.
- Judul harus natural dan relevan.
- Fokus pada kejelasan, relevansi, struktur, dan daya tarik listing.

DATA LISTING LAMA

Judul Produk:
${productTitle}

Deskripsi Produk:
${description}

Keyword Lama:
${keywords || "Tidak diberikan"}

Informasi Produk:
${productInfo || "Tidak diberikan"}

Berikan hasil menggunakan format berikut:

=== ANALISIS LISTING ===

Jelaskan:
- Kelebihan listing
- Kekurangan listing
- Masalah judul
- Masalah deskripsi
- Masalah keyword
- Informasi yang kurang

=== JUDUL SEO BARU ===

Buat 1 judul SEO yang lebih optimal.

=== 3 ALTERNATIF JUDUL ===

Buat 3 alternatif judul.

=== DESKRIPSI YANG DIPERBAIKI ===

Tulis ulang deskripsi produk agar lebih jelas, informatif, dan menarik.

=== KEYWORD UTAMA ===

Berikan 10 keyword utama yang relevan.

=== KEYWORD LONG-TAIL ===

Berikan 10 keyword long-tail yang relevan.

=== INFORMASI YANG MASIH KURANG ===

Sebutkan informasi produk yang sebaiknya ditambahkan.

=== KLAIM YANG PERLU DICEK ===

Sebutkan klaim yang perlu diverifikasi.

=== CHECKLIST PERBAIKAN ===

Buat maksimal 10 checklist menggunakan format [ ].
`;

    let response;

    try {
      console.log(
        "Optimizer: mencoba Gemini 3.8 Flash..."
      );

      response = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt,
      });

      console.log(
        "Optimizer: Gemini 3.8 Flash berhasil."
      );
    } catch (primaryError) {
      console.error(
        "Gemini 3.8 Flash gagal:",
        primaryError
      );

      try {
        console.log(
          "Optimizer: mencoba Gemini 3.7 Flash..."
        );

        response = await ai.interactions.create({
          model: "gemini-3.7-flash",
          input: prompt,
        });

        console.log(
          "Optimizer: Gemini 3.7 Flash berhasil."
        );
      } catch (fallbackError) {
        console.error(
          "Gemini cadangan juga gagal:",
          fallbackError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Gemini sedang mengalami kepadatan atau layanan sedang tidak tersedia. Silakan coba lagi beberapa saat lagi.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      result: response.output_text,
    });
  } catch (error) {
    console.error(
      "OPTIMIZER ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada AI Optimizer.",
      },
      { status: 500 }
    );
  }
}