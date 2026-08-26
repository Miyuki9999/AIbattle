import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function CompletePage() {

  const { data: characters, error } =
    await supabase
      .from("characters")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  return (

    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(#dcfce7, #ffffff, #dbeafe)",
        padding: "40px 20px",
        fontFamily:
          'Arial, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* 登録完了 */}

        <section
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "35px",
            textAlign: "center",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.1)",
            marginBottom: "40px",
          }}
        >

          <div
            style={{
              fontSize: "65px",
            }}
          >
            🎉
          </div>

          <h1
            style={{
              fontSize: "40px",
              fontWeight: "900",
              color: "#16a34a",
              margin: "10px 0",
            }}
          >
            登録完了！
          </h1>

          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#374151",
            }}
          >
            キャラクターが大会に参加しました！
          </p>

        </section>


        {/* みんなのキャラクター */}

        <section>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >

            <h2
              style={{
                fontSize: "30px",
                fontWeight: "900",
              }}
            >
              🔥 みんなのキャラクター
            </h2>

            <div
              style={{
                background: "#ffedd5",
                color: "#ea580c",
                padding: "8px 15px",
                borderRadius: "999px",
                fontWeight: "bold",
              }}
            >
              {characters?.length || 0}人
            </div>

          </div>


          {/* エラー */}

          {error && (

            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "20px",
                borderRadius: "15px",
                fontWeight: "bold",
              }}
            >
              キャラクターを読み込めませんでした。
              <br />
              {error.message}
            </div>

          )}


          {/* 0人 */}

          {!error &&
            characters &&
            characters.length === 0 && (

              <div
                style={{
                  background: "white",
                  padding: "40px",
                  borderRadius: "20px",
                  textAlign: "center",
                }}
              >
                まだキャラクターが登録されていません。
              </div>

            )}


          {/* キャラクター一覧 */}

          {!error &&
            characters &&
            characters.length > 0 && (

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >

                {characters.map((character) => (

                  <article
                    key={character.id}
                    style={{
                      background: "white",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow:
                        "0 8px 20px rgba(0,0,0,0.1)",
                    }}
                  >

                    <img
                      src={character.image_url}
                      alt={character.name}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                      }}
                    />

                    <div
                      style={{
                        padding: "15px",
                      }}
                    >

                      <h3
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "900",
                        }}
                      >
                        {character.name}
                      </h3>

                    </div>

                  </article>

                ))}

              </div>

            )}

        </section>


        {/* ボタン */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "40px",
          }}
        >

          <Link
            href="/"
            style={{
              background: "#f97316",
              color: "white",
              padding: "15px 25px",
              borderRadius: "15px",
              fontWeight: "900",
              textDecoration: "none",
            }}
          >
            ➕ もう一人登録する
          </Link>


          <Link
            href="/characters"
            style={{
              background: "#2563eb",
              color: "white",
              padding: "15px 25px",
              borderRadius: "15px",
              fontWeight: "900",
              textDecoration: "none",
            }}
          >
            📖 キャラクター図鑑
          </Link>

        </div>

      </div>

    </main>

  );
}
