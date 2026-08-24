"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("キャラクターの名前を入力してください。");
      return;
    }

    if (!image) {
      setError("キャラクター画像を選んでください。");
      return;
    }

    if (!image.type.startsWith("image/")) {
      setError("画像ファイルを選んでください。");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      setError("画像は5MB以下にしてください。");
      return;
    }

    setLoading(true);

    try {
      // -------------------------
      // ① 画像ファイル名を作る
      // -------------------------

      const extension =
        image.name.split(".").pop() || "png";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      // -------------------------
      // ② Supabase Storageに画像を保存
      // -------------------------

      const { error: uploadError } =
        await supabase.storage
          .from("characters")
          .upload(fileName, image, {
            cacheControl: "3600",
            upsert: false,
          });

      if (uploadError) {
        throw new Error(
          "画像のアップロードに失敗しました。\n" +
          uploadError.message
        );
      }

      // -------------------------
      // ③ 画像の公開URLを取得
      // -------------------------

      const { data: publicUrlData } =
        supabase.storage
          .from("characters")
          .getPublicUrl(fileName);

      const imageUrl =
        publicUrlData.publicUrl;

      // -------------------------
      // ④ データベースに保存
      // -------------------------

      const { error: insertError } =
        await supabase
          .from("characters")
          .insert({
            name: name.trim(),
            image_url: imageUrl,
          });

      if (insertError) {
        throw new Error(
          "キャラクター情報の保存に失敗しました。\n" +
          insertError.message
        );
      }

      // -------------------------
      // ⑤ 登録完了ページへ移動
      // -------------------------

      router.push("/complete");

    } catch (error) {

      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("登録中にエラーが発生しました。");
      }

    } finally {

      setLoading(false);

    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(#fff7ed, #ffffff, #eff6ff)",
        padding: "40px 20px",
        fontFamily:
          'Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
      }}
    >

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >

        {/* タイトル */}

        <header
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >

          <div
            style={{
              fontSize: "60px",
            }}
          >
            🔥
          </div>

          <h1
            style={{
              fontSize: "38px",
              fontWeight: "900",
              color: "#ea580c",
              margin: "10px 0",
            }}
          >
            AI最強キャラクター大会
          </h1>

          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#374151",
            }}
          >
            自分だけの最強キャラクターを登録しよう！
          </p>

        </header>


        {/* 登録フォーム */}

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "30px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >

          <h2
            style={{
              fontSize: "26px",
              fontWeight: "900",
              marginBottom: "25px",
            }}
          >
            📝 キャラクター登録
          </h2>


          {/* 名前 */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >

            <label
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              キャラクターの名前
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="例：ドラゴンX"
              maxLength={50}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "18px",
                borderRadius: "15px",
                border: "2px solid #e5e7eb",
                outline: "none",
              }}
            />

          </div>


          {/* 画像 */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >

            <label
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              キャラクター画像
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => {
                const selected =
                  event.target.files?.[0];

                setImage(selected || null);
              }}
              style={{
                width: "100%",
                padding: "15px",
                background: "#f9fafb",
                borderRadius: "15px",
                border:
                  "2px dashed #d1d5db",
              }}
            />

            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              PNG・JPG・WEBP / 5MB以下
            </p>

          </div>


          {/* エラー */}

          {error && (
            <div
              style={{
                whiteSpace: "pre-line",
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "15px",
                borderRadius: "15px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              ⚠️ {error}
            </div>
          )}


          {/* 登録ボタン */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "17px",
              border: "none",
              borderRadius: "18px",
              background:
                loading ? "#9ca3af" : "#f97316",
              color: "white",
              fontSize: "20px",
              fontWeight: "900",
              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "登録しています..."
              : "🚀 キャラクターを登録する"}
          </button>

        </section>


        {/* 図鑑へのリンク */}

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >

          <a
            href="/characters"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            📖 みんなのキャラクターを見る
          </a>

        </div>

      </div>

    </main>
  );
}
