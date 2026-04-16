import { homeFeatures } from "../../data/homeData";

export default function FeaturesSection() {
  return (
    <section className="relative mx-4 mt-12 overflow-hidden rounded-xl bg-surface-container-low p-6 sm:mx-6 sm:p-8 lg:mx-auto lg:mt-16 lg:max-w-7xl lg:px-10 lg:py-12">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-container/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary-container/20 blur-3xl" />

      <h3 className="mb-10 text-center font-headline text-3xl font-black leading-tight text-primary sm:text-4xl lg:text-5xl">
        Why We&apos;re
        <br />
        Extraordinary
      </h3>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
        {homeFeatures.map((feature) => (
          <div key={feature.title} className="flex items-center gap-6">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-lg ${feature.iconClasses}`}>
              <span
                className="material-symbols-outlined text-3xl"
                style={feature.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {feature.icon}
              </span>
            </div>
            <div>
              <h4 className="font-headline text-2xl font-bold text-on-surface">{feature.title}</h4>
              <p className="text-sm font-medium text-on-surface-variant">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
