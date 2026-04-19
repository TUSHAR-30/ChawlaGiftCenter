import { Link } from "react-router-dom";

export default function LocationSection() {
  return (
    <section className="mx-auto mt-16 mb-10 max-w-7xl px-4 sm:px-6 lg:px-8" id="location">
      <div className="overflow-hidden rounded-xl bg-surface-container-high shadow-lg lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="group relative h-56 sm:h-72 lg:h-full lg:min-h-[24rem]">
          {/* <img
            alt="Stylized map view of a city neighborhood with pin markers and soft clean aesthetic"
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX6Lh0NjVxaUf-P-oZ2zp2nCABYFMIGiQBGuI7jd7zjvLhlMj0dUwzNO9Z8EJqZn9le5GY_Nw9Yk6_3Wbw1KDOIxmGwvzx7betxLQ0iELoo8FZ5IZ4zq49_aBAgRzuRzvADOuVylF0-2pD3fmCoGa8hr2ti6B3VN6GlZ5cPmRer_8MLC2SOaV3pMO4xplT2zwteS6XAnmXlSMveJHmPJ7VWpf2E_lSQu-dqvCdP6xJ5HNdI-VpCZiGUU41M6cwlirN0xG64QA7PE8"
          /> */}
          <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2959.2337235462915!2d76.1291585!3d28.795706799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39126735010a1ead%3A0x293c38a45347a826!2sChawla%20Gift%20Centre!5e1!3m2!1sen!2sin!4v1776452916342!5m2!1sen!2sin" 
           className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" 
          style={{border:0}} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"></iframe>

          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white animate-bounce shadow-2xl">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
            </div>
          </div> */}
        </div>

        <div className="p-6 sm:p-8 lg:flex lg:flex-col lg:justify-center lg:p-10">
          <h3 className="mb-2 font-headline text-2xl font-bold text-on-surface sm:text-3xl lg:text-4xl">
            Find the Magic
          </h3>
          <p className="mb-6 font-medium text-on-surface-variant">
            Visit our landmark outlet in the heart of Bhiwani.
          </p>
          <div className="mb-4 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">pin_drop</span>
            <div>
              <p className="font-bold text-on-surface">Main Market Area</p>
              <p className="text-sm text-on-surface-variant">Bhiwani, Haryana - 127021</p>
            </div>
          </div>
          {/* <Link
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/20 py-4 font-bold text-primary transition-colors hover:bg-primary-container/10"
            to="/location"
          >
            <span className="material-symbols-outlined">directions</span>
            Get Directions
          </Link> */}
        </div>
      </div>
    </section>
  );
}
