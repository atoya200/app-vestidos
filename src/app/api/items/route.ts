import { NextResponse } from "next/server";
import { getArticlesByFilters, getAvailableSizesForArticle } from "@/lib/dao/productsDao";
import { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const category = (searchParams.get("category") as Category) || undefined;
    const size = searchParams.get("size") || undefined;
    const color = searchParams.get("color") || undefined;
    const style = searchParams.get("style") || undefined;

    const articles = await getArticlesByFilters({ q, category, color, style });

    const items = await Promise.all(
      articles.map(async (article: any) => {
        const sizes = await getAvailableSizesForArticle(article.id);

        return {
          id: article.id,
          name: article.name,
          category: article.category,
          pricePerDay: parseFloat(article.pricePerDay),
          sizes,
          color: article.color,
          style: article.style,
          image: article.image_url || `/images/dresses/${article.id}.jpeg`,
          alt: `${article.name} - ${article.color}`,
        };
      })
    );

    const filteredItems = size
      ? items.filter(item => item.sizes.includes(size))
      : items;

    return NextResponse.json({ items: filteredItems });
  } catch (error) {
    console.error("Items API error:", error);
    return NextResponse.json({ items: [], error: "Failed to load items" }, { status: 500 });
  }
}
