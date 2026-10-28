import './globals.css';

export const metadata = {
  title: 'PageCraft Bookstore | Dynamic Online Bookstore & Orders Manager',
  description: 'A modern, full-stack online bookstore web application built with Next.js, Spring Boot, MySQL, and Docker for full CRUD operations and order management.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
