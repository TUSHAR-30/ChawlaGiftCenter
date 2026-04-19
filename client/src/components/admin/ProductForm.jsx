import { Field, FilePicker, Input, MediaPreview, Status, Textarea } from "./AdminUi";

export default function ProductForm({
  form,
  onChange,
  onSubmit,
  categories,
  status,
  isSaving,
  submitLabel,
  currentImage,
  onCancel,
  title,
  subtitle,
}) {
  return (
    <section className="rounded-[2rem] border border-outline-variant bg-white p-6 shadow-[0_20px_40px_-30px_rgba(31,41,55,0.28)] sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface">{title}</h2>
          <p className="mt-2 text-sm font-medium text-on-surface-variant">{subtitle}</p>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Product Name" required>
            <Input onChange={(event) => onChange("title", event.target.value)} required value={form.title} />
          </Field>
          <Field label="Category">
            <select
              className="w-full rounded-2xl border border-outline-variant bg-white px-4 py-3 text-sm font-medium text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              onChange={(event) => onChange("category", event.target.value)}
              value={form.category}
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Short Description">
          <Textarea onChange={(event) => onChange("description", event.target.value)} value={form.description} />
        </Field>

        <Field label="Image Alt Text">
          <Input onChange={(event) => onChange("alt", event.target.value)} value={form.alt} />
        </Field>

        <FilePicker
          accept="image/*"
          required={!currentImage}
          hint={form.image ? form.image.name : currentImage ? "Choose a new image if you want to replace the current one" : "Choose product image"}
          label="Product Image"
          onChange={(event) => onChange("image", event.target.files?.[0] || null)}
        />

        {(currentImage || form.image) ? (
          <div className="grid gap-4 md:grid-cols-2">
            <MediaPreview fallbackUrl={currentImage} file={null} label="Current Image" type="image" />
            <MediaPreview file={form.image} label="New Image Preview" type="image" />
          </div>
        ) : null}

        <label className="flex items-center gap-3 rounded-2xl bg-surface-container px-4 py-3 text-sm font-semibold text-on-surface">
          <input
            checked={form.trending}
            className="h-4 w-4 accent-primary"
            onChange={(event) => onChange("trending", event.target.checked)}
            type="checkbox"
          />
          Mark this product as trending
        </label>

        <Status value={status} />

        <button
          className="inline-flex items-center justify-center rounded-full bg-on-surface px-6 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
