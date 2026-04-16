export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="material-symbols-outlined shrink-0 scale-110 text-primary">storefront</span>
          <span className="font-headline text-base font-black tracking-tight text-on-surface sm:text-xl lg:text-2xl">
            Chawla <span className="text-primary">Gift</span> Centre
          </span>
        </div>
        <a
          aria-label="Chat on WhatsApp"
          className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-[#25D366]/10 hover:text-[#25D366]"
          href="https://wa.me/910000000000"
        >
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.3 1.592 5.548 0 10.064-4.516 10.066-10.066.002-5.548-4.52-10.065-10.063-10.065-5.548 0-10.067 4.519-10.067 10.068 0 2.113.6 4.163 1.738 5.893l-1.005 3.674 3.768-.989-.271-.147z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
