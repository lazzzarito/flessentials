import "./globals.css";

export const metadata = {
  title: "F&L Essentials | Catálogo Online",
  description: "Catálogo de productos online y tienda simple de F&L Essentials en Cotorro, La Habana. Haz tus pedidos de forma rápida y directa por WhatsApp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
