import { NextRequest } from "next/server";
import { parse } from "node-html-parser";

function extractAsin(url: string): string | null {
  const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

function extractImageFromScripts(html: string): string {
  // Amazonのページ内JavaScriptから画像URLを抽出
  // colorImages パターン
  const colorMatch = html.match(/"colorImages"\s*:\s*\{\s*"initial"\s*:\s*(\[[\s\S]*?\])\s*\}/);
  if (colorMatch) {
    try {
      const images = JSON.parse(colorMatch[1]);
      const first = images[0];
      const imgUrl: string = first?.hiRes || first?.large || first?.main || "";
      if (imgUrl.startsWith("http")) return imgUrl;
    } catch {}
  }

  // 'colorImages' シングルクォートパターン
  const colorMatch2 = html.match(/'colorImages'\s*:\s*\{\s*'initial'\s*:\s*(\[[\s\S]*?\])/);
  if (colorMatch2) {
    try {
      const images = JSON.parse(colorMatch2[1]);
      const first = images[0];
      const imgUrl: string = first?.hiRes || first?.large || "";
      if (imgUrl.startsWith("http")) return imgUrl;
    } catch {}
  }

  // data-old-hires パターン（スクリプト外でも検索）
  const hiResMatch = html.match(/data-old-hires="(https:\/\/[^"]+)"/);
  if (hiResMatch) return hiResMatch[1];

  // data-a-dynamic-image パターン
  const dynamicMatch = html.match(/data-a-dynamic-image="([^"]+)"/);
  if (dynamicMatch) {
    try {
      const decoded = dynamicMatch[1].replace(/&quot;/g, '"');
      const obj = JSON.parse(decoded);
      const firstUrl = Object.keys(obj)[0];
      if (firstUrl?.startsWith("http")) return firstUrl;
    } catch {}
  }

  return "";
}

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url || typeof url !== "string") {
    return Response.json({ error: "URLが必要です" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return Response.json({ error: "ページの取得に失敗しました" }, { status: 502 });
    }

    const html = await res.text();
    const root = parse(html);

    // タイトル取得
    const ogTitle = root.querySelector('meta[property="og:title"]')?.getAttribute("content");
    const titleEl = root.querySelector("#productTitle");
    const title = ogTitle || titleEl?.text?.trim() || "";

    // 著者取得
    const authorEl = root.querySelector(".author .contributorNameID, .author a, #bylineInfo .author a");
    const author = authorEl?.text?.trim() || "";

    // 画像URL取得（複数の方法を順番に試す）
    const asin = extractAsin(url);

    // 方法1: OGタグ
    const ogImage = root.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";

    // 方法2: #landingImage の data-old-hires
    const landingHiRes =
      root.querySelector("#landingImage")?.getAttribute("data-old-hires") ||
      root.querySelector("#imgBlkFront")?.getAttribute("data-old-hires") ||
      root.querySelector("#imgTagWrapperId img")?.getAttribute("data-old-hires") ||
      "";

    // 方法3: JavaScriptデータから抽出
    const jsImage = extractImageFromScripts(html);

    // 方法4: ASINからの直接URL（最後の手段）
    const asinImage = asin ? `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg` : "";

    const coverImageUrl = (ogImage || landingHiRes || jsImage || asinImage).replace(/\._[A-Z0-9_,]+_\./g, "._SL500_.");

    if (!title) {
      return Response.json(
        { error: "本の情報を取得できませんでした。AmazonのURLを確認してください。" },
        { status: 422 }
      );
    }

    return Response.json({ title, author, coverImageUrl });
  } catch (e) {
    console.error("fetch-book error:", e);
    return Response.json({ error: "情報の取得中にエラーが発生しました" }, { status: 500 });
  }
}
