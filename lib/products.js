import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const productsDirectory = path.join(process.cwd(), "content");
const productsSubdirectory = path.join(productsDirectory, "products");

// Helper to get store configuration
export function getStoreConfig() {
  const filePath = path.join(productsDirectory, "store-config.json");
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading store configuration:", error);
    return {
      name: "F&L Essentials",
      location: "Cotorro, La Habana",
      whatsappNumber: "+5355555555",
      currency: { code: "USD", symbol: "$" }
    };
  }
}

// Helper to get all products parsed
export async function getProducts() {
  // Ensure the directory exists
  if (!fs.existsSync(productsSubdirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(productsSubdirectory);
  const allProductsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const fullPath = path.join(productsSubdirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Parse front matter
        const { data, content } = matter(fileContents);

        // Compile markdown content to HTML
        const contentHtml = await marked.parse(content);

        // Formulate a card aspect ratio based on category or ID to create the Pinterest style
        // We alternate aspect ratios so the grid looks nicely randomized but consistent
        let ratioClass = "ratio-square";
        const idLength = id.length;
        if (idLength % 3 === 0) {
          ratioClass = "ratio-tall";
        } else if (idLength % 3 === 1) {
          ratioClass = "ratio-square";
        } else {
          ratioClass = "ratio-wide";
        }

        // Parse images — supports single `image` or array `images`
        const rawImages = data.images || (data.image ? [data.image] : []);
        const imageList = Array.isArray(rawImages) ? rawImages : [rawImages];
        const images = imageList.map((img) => {
          if (img.startsWith("/") || img.startsWith("http")) return img;
          return `/api/images/products/${encodeURIComponent(img)}`;
        });

        return {
          id: data.id || id,
          name: data.name || "Producto sin nombre",
          priceUSD: parseFloat(data.priceUSD) || 0,
          category: data.category || "General",
          image: images[0] || "/images/placeholder.png",
          images,
          description: data.description || "",
          featured: !!data.featured,
          offer: !!data.offer,
          originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
          attributes: data.attributes ? { ...data.attributes } : {},
          contentHtml,
          ratioClass,
        };
      })
  );

  // Group by category or just return all. We will sort featured first, then name.
  return allProductsData.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });
}
