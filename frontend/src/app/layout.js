import './globals.css';

export const metadata = {
  title: 'PageCraft Bookstore | Cloud-Native Enterprise Book Management',
  description: 'A modern, high-performance online bookstore and order management system built with Next.js 14, Spring Boot 3.2, MySQL 8.0, and Docker containerization on AWS EC2.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#07090e" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Ambient Aurora Gradient Orbs for immersive luxury background */}
        <div className="aurora-bg">
          <div className="aurora-orb aurora-orb-1"></div>
          <div className="aurora-orb aurora-orb-2"></div>
          <div className="aurora-orb aurora-orb-3"></div>
        </div>
        <div className="app-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
