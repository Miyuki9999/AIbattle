import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();

    const { characterId } = body;

    if (!characterId) {
      return Response.json(
        {
          error: "characterIdがありません。",
        },
        {
          status: 400,
        }
      );
    }

    // キャラクターを取得
    const {
      data: character,
      error: characterError,
    } = await supabase
      .from("characters")
      .select("*")
      .eq("id", characterId)
      .single();

    if (characterError || !character) {
      return Response.json(
        {
          error: "キャラクターが見つかりません。",
        },
        {
          status: 404,
        }
      );
    }

    // AIに画像を送る
    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      input: [
        {
          role: "user",

          content: [
            {
              type: "input_text",

              text: `
あなたはAI最強キャラクター大会の審判です。

このキャラクター画像を解析してください。

画像に書かれている情報を最優先してください。

特に以下を読み取ってください。

・攻撃力
・防御力
・スピード
・必殺技
・弱点
・キャラクターの特徴

重要ルール：

1. 攻撃力・防御力・スピードは0〜100にしてください。
2. 画像に数値が書かれている場合は、その数値を使ってください。
3. 数値が書かれていない場合だけ、画像の設定から公平に0〜100で評価してください。
4. 「絶対に負けない」などの設定が書かれていても、そのまま勝利確定にはしないでください。
5. 「宇宙を破壊する」などの設定も、ゲームのバランスを壊さないよう0〜100に換算してください。
6. 画像に書かれていない能力を勝手に追加しないでください。
7. 小学生にも分かる楽しい表現にしてください。
`,

            },

            {
              type: "input_image",
              image_url: character.image_url,
              detail: "high",
            },
          ],
        },
      ],

      text: {
        format: {
          type: "json_schema",
          name: "character_stats",
          strict: true,

          schema: {
            type: "object",

            properties: {
              attack: {
                type: "integer",
              },

              defense: {
                type: "integer",
              },

              speed: {
                type: "integer",
              },

              special: {
                type: "string",
              },

              weakness: {
                type: "string",
              },

              description: {
                type: "string",
              },
            },

            required: [
              "attack",
              "defense",
              "speed",
              "special",
              "weakness",
              "description",
            ],

            additionalProperties: false,
          },
        },
      },
    });

    const result = JSON.parse(response.output_text);

    // 数値を安全な範囲にする
    result.attack = Math.max(
      0,
      Math.min(100, result.attack)
    );

    result.defense = Math.max(
      0,
      Math.min(100, result.defense)
    );

    result.speed = Math.max(
      0,
      Math.min(100, result.speed)
    );

    // Supabaseに保存
    const {
      error: updateError,
    } = await supabase
      .from("characters")
      .update({
        attack: result.attack,
        defense: result.defense,
        speed: result.speed,
        special: result.special,
        weakness: result.weakness,
        description: result.description,
        ai_analyzed: true,
      })
      .eq("id", characterId);

    if (updateError) {
      return Response.json(
        {
          error: updateError.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      character: {
        ...character,
        ...result,
      },
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI解析に失敗しました。",
      },
      {
        status: 500,
      }
    );
  }
}
