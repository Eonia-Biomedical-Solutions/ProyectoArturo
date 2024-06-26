import "./globals.css";



export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>
          <div className="eoniadiv">
            <p className='eonia'>Bookstore online by EONIA</p>
          </div>
        </header>
      </body>
      <body>{children}</body>
    </html>
  );
}
