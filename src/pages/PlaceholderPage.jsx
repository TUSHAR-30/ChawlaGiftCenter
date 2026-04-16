export default function PlaceholderPage({ title, description }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-24 pb-32 sm:px-6 lg:px-8">
      <section className="joy-shadow w-full max-w-3xl rounded-[2rem] bg-surface-container p-8 text-center sm:p-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">Future Page</p>
        <h1 className="mb-4 font-headline text-4xl font-black tracking-tight text-on-surface sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-base font-medium text-on-surface-variant sm:text-lg">
          {description}
        </p>
      </section>
    </main>
  );
}
