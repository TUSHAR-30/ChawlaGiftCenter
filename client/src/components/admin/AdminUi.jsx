import { useEffect, useState } from "react";

export function Status({ value }) {
  if (!value.message) {
    return null;
  }

  return (
    <p
      className={[
        "rounded-2xl px-4 py-3 text-sm font-semibold",
        value.type === "success" ? "bg-mint-container text-on-mint" : "bg-error-container text-on-error-container",
      ].join(" ")}
    >
      {value.message}
    </p>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-outline-variant bg-white px-4 py-3 text-sm font-medium text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className="min-h-28 w-full rounded-2xl border border-outline-variant bg-white px-4 py-3 text-sm font-medium text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
    />
  );
}

export function Field({ label, required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-on-surface">
        {label}
        {required ? <span className="ml-1 text-error">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export function FilePicker({ label, required = false, hint, accept, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-sm font-bold text-on-surface">
        {label}
        {required ? <span className="ml-1 text-error">*</span> : null}
      </span>
      <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-outline bg-surface-container px-4 py-5 text-center transition hover:border-primary hover:bg-primary-container/25">
        <input accept={accept} className="hidden" onChange={onChange} type="file" />
        <span className="text-sm font-semibold text-on-surface-variant">{hint}</span>
      </label>
    </div>
  );
}

export function TableWrap({ children }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-outline-variant bg-white shadow-[0_20px_40px_-30px_rgba(31,41,55,0.28)]">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-[1.75rem] border border-outline-variant bg-white px-6 py-10 text-center shadow-[0_18px_36px_-30px_rgba(31,41,55,0.25)]">
      <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface">{title}</h2>
      <p className="mt-2 text-sm font-medium text-on-surface-variant">{description}</p>
    </div>
  );
}

export function MediaPreview({ file, type, fallbackUrl, label }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const source = previewUrl || fallbackUrl;

  if (!source) {
    return null;
  }

  return (
    <div className="space-y-2 rounded-[1.5rem] border border-outline-variant bg-surface-container p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
      {type === "video" ? (
        <video className="aspect-[4/3] w-full rounded-2xl bg-black object-cover" controls src={source} />
      ) : (
        <img alt={label} className="aspect-[4/3] w-full rounded-2xl object-cover" src={source} />
      )}
    </div>
  );
}

export function EditModal({ title, isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-8 sm:px-6">
      <div className="w-full max-w-4xl rounded-[2.25rem] bg-white shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4 sm:px-8">
          <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface">{title}</h2>
          <button className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
