import { Field, FilePicker, Input, MediaPreview, Status, Textarea } from "./AdminUi";

export default function UnboxingForm({
  form,
  onChange,
  onSubmit,
  status,
  isSaving,
  submitLabel,
  currentPoster,
  currentVideo,
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
          <Field label="Video Title" required>
            <Input onChange={(event) => onChange("title", event.target.value)} required value={form.title} />
          </Field>
          <Field label="Product Name" required>
            <Input onChange={(event) => onChange("productName", event.target.value)} required value={form.productName} />
          </Field>
        </div>

        <Field label="Short Description">
          <Textarea onChange={(event) => onChange("description", event.target.value)} value={form.description} />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <FilePicker
            accept="image/*"
            required={!currentPoster}
            hint={form.poster ? form.poster.name : currentPoster ? "Choose a new poster if you want to replace the current one" : "Choose poster image"}
            label="Poster Image"
            onChange={(event) => onChange("poster", event.target.files?.[0] || null)}
          />
          <FilePicker
            accept="video/*"
            required={!currentVideo}
            hint={form.video ? form.video.name : currentVideo ? "Choose a new video if you want to replace the current one" : "Choose video file"}
            label="Video File"
            onChange={(event) => onChange("video", event.target.files?.[0] || null)}
          />
        </div>

        {(currentPoster || form.poster || currentVideo || form.video) ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <MediaPreview fallbackUrl={currentPoster} file={null} label="Current Poster" type="image" />
              <MediaPreview fallbackUrl={currentVideo} file={null} label="Current Video" type="video" />
            </div>
            <div className="space-y-4">
              <MediaPreview file={form.poster} label="New Poster Preview" type="image" />
              <MediaPreview file={form.video} label="New Video Preview" type="video" />
            </div>
          </div>
        ) : null}

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
