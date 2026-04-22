import { MdAccessTime, MdPinDrop } from "react-icons/md";

const shopTimings = [
  { label: "Monday - Saturday", value: "10:00 AM - 09:00 PM" },
  { label: "Sunday", value: "11:00 AM - 09:00 PM" },
];

export default function LocationSection() {
  return (
    <section className="relative mx-auto mt-16 mb-10 max-w-7xl px-4 sm:px-6 lg:px-8" id="location">
      <div className="soft-shapes left-[3%] top-6 h-24 w-24 rounded-full bg-primary-container/40" />
      <div className="soft-shapes right-[4%] bottom-6 h-28 w-28 rounded-full bg-secondary-container/35" />

      <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(254,252,232,0.92)_52%,rgba(239,246,255,0.82)_100%)] shadow-[0_28px_70px_-42px_rgba(31,41,55,0.36)] ring-1 ring-white/70 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="group relative h-56 sm:h-72 lg:h-full lg:min-h-[24rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_42%)]" />
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2959.2337235462915!2d76.1291585!3d28.795706799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39126735010a1ead%3A0x293c38a45347a826!2sChawla%20Gift%20Centre!5e1!3m2!1sen!2sin!4v1776452916342!5m2!1sen!2sin"
            className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="p-6 sm:p-8 lg:flex lg:flex-col lg:justify-center lg:p-10">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-primary/85">Visit the Store</p>
          <h3 className="mb-2 font-headline text-2xl font-bold text-on-surface sm:text-3xl lg:text-4xl">
            Find the Magic
          </h3>
          <p className="mb-6 max-w-lg font-medium text-on-surface-variant">
            Visit our landmark outlet in the heart of Bhiwani.
          </p>
          <div className="mb-4 flex items-start gap-4 rounded-[1.4rem] bg-white/70 px-4 py-4 shadow-[0_18px_40px_-28px_rgba(31,41,55,0.25)] backdrop-blur-sm">
            <MdPinDrop className="mt-0.5 shrink-0 text-xl text-primary" />
            <div>
              <p className="font-bold text-on-surface">Krishna Colony,Near Sanatan Dharam Mandir</p>
              <p className="text-sm text-on-surface-variant">Bhiwani, Haryana - 127021</p>
            </div>
          </div>
          <div className="rounded-[1.4rem] bg-white/70 px-4 py-4 shadow-[0_18px_40px_-28px_rgba(31,41,55,0.25)] backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-3">
              <MdAccessTime className="text-xl text-primary" />
              <p className="font-bold text-on-surface">Shop Timings</p>
            </div>
            <div className="space-y-2">
              {shopTimings.map((timing) => (
                <div key={timing.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-on-surface-variant">{timing.label}</span>
                  <span className="font-bold text-on-surface">{timing.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
