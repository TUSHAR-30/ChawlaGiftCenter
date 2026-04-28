import { MdStorefront } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link className="flex min-w-0 items-center gap-2 sm:gap-3" to="/">
          <MdStorefront className="shrink-0 scale-110 text-2xl text-primary" />
          <span className="text-sm sm:text-xl lg:text-2xl">
            Chawla <span className="text-primary">Gift</span> Centre
          </span>
        </Link>
        <a
          aria-label="Chat on WhatsApp"
          className="flex items-center justify-center rounded-full p-2 bg-[#25D366]/10 text-[#25D366]"
          href="https://wa.me/919466074466"
        >
          <RiWhatsappFill className="text-[1.4rem]" />
        </a>
      </div>
    </header>
  );
}
