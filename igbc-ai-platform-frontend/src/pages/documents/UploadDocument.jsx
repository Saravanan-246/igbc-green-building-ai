import { useCallback, useMemo, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const categories = [
  "Architectural",
  "Energy",
  "Water",
  "Waste",
  "Indoor Environment",
  "Materials",
  "Other",
];

const acceptedTypes = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "application/vnd.ms-excel": "Excel",
  "image/png": "Image",
  "image/jpeg": "Image",
  "image/jpg": "Image",
};

const acceptedExtensions = [".pdf", ".xlsx", ".xls", ".png", ".jpg", ".jpeg"];

const mockUploads = [
  {
    id: "doc-001",
    name: "Energy Performance Report.pdf",
    size: 2860000,
    category: "Energy",
    progress: 100,
    status: "Uploaded",
    type: "PDF",
  },
  {
    id: "doc-002",
    name: "Water Metering Schedule.xlsx",
    size: 824000,
    category: "Water",
    progress: 72,
    status: "Uploading",
    type: "Excel",
  },
];

const statusClasses = {
  Ready:
    "bg-slate-100 text-slate-700 ring-slate-200",
  Uploading:
    "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Uploaded:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Error:
    "bg-red-50 text-red-700 ring-red-200",
};

const iconPaths = {
  upload:
    "M12 3 6.8 8.2l1.4 1.4L11 6.8V16h2V6.8l2.8 2.8 1.4-1.4L12 3ZM5 18h14v2H5v-2Z",
  file: "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 1.5V9h4.5L13 4.5ZM8 13h8v1.5H8V13Zm0 3h8v1.5H8V16Z",
  pdf: "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 13h1.5v-2h1a2 2 0 0 0 0-4H9v6Zm5 0h1.5v-2H17v-1.5h-1.5V11H17V9.5h-3V16Z",
  excel:
    "M4 4h16v16H4V4Zm3 3v10h10V7H7Zm2 2h2v2H9V9Zm4 0h2v2h-2V9Zm-4 4h2v2H9v-2Zm4 0h2v2h-2v-2Z",
  image:
    "M5 5h14v14H5V5Zm2 10.6L9.8 12l2.1 2.5 2.8-3.6L17 15.6V7H7v8.6Z",
  check:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.8 7.6-5.6 5.6-3-3 1.4-1.4 1.6 1.6 4.2-4.2 1.4 1.4Z",
  close:
    "m7.4 5.9 4.6 4.6 4.6-4.6 1.5 1.5-4.6 4.6 4.6 4.6-1.5 1.5-4.6-4.6-4.6 4.6-1.5-1.5 4.6-4.6-4.6-4.6 1.5-1.5Z",
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const getFileType = (file) => {
  if (acceptedTypes[file.type]) return acceptedTypes[file.type];

  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if ([".xlsx", ".xls"].includes(extension)) return "Excel";
  if ([".png", ".jpg", ".jpeg"].includes(extension)) return "Image";
  if (extension === ".pdf") return "PDF";
  return "Unsupported";
};

const isAcceptedFile = (file) => {
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  return acceptedTypes[file.type] || acceptedExtensions.includes(extension);
};

const createUploadId = (file) => {
  const randomPart =
    globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);

  return `${file.name}-${file.lastModified}-${randomPart}`;
};

function Icon({ name, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 fill-current ${className}`}>
      <path d={iconPaths[name]} />
    </svg>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClasses[status]}`}>
      {status}
    </span>
  );
}

function FileTypeIcon({ type }) {
  const iconName = type === "PDF" ? "pdf" : type === "Excel" ? "excel" : type === "Image" ? "image" : "file";

  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <Icon name={iconName} />
    </div>
  );
}

function UploadDocument() {
  const fileInputRef = useRef(null);
  const [category, setCategory] = useState("Energy");
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState(mockUploads);

  const uploadSummary = useMemo(() => {
    const total = uploads.length;
    const completed = uploads.filter((file) => file.status === "Uploaded").length;
    const uploading = uploads.filter((file) => file.status === "Uploading").length;

    return { total, completed, uploading };
  }, [uploads]);

  const addFiles = useCallback(
    (fileList) => {
      const incomingFiles = Array.from(fileList || []);

      if (incomingFiles.length === 0) return;

      const nextUploads = incomingFiles.map((file) => {
        const accepted = isAcceptedFile(file);

        return {
          id: createUploadId(file),
          name: file.name,
          size: file.size,
          category,
          progress: accepted ? 42 : 0,
          status: accepted ? "Uploading" : "Error",
          type: getFileType(file),
        };
      });

      setUploads((current) => [...nextUploads, ...current]);

      nextUploads
        .filter((file) => file.status === "Uploading")
        .forEach((file) => {
          window.setTimeout(() => {
            setUploads((current) =>
              current.map((item) =>
                item.id === file.id ? { ...item, progress: 100, status: "Uploaded" } : item,
              ),
            );
          }, 900);
        });
    },
    [category],
  );

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const removeUpload = (id) => {
    setUploads((current) => current.filter((file) => file.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card variant="gradient" className="overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Document Management
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Upload Documents
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Upload drawings, compliance evidence, spreadsheets, and supporting images for AI-assisted IGBC validation.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-emerald-100 bg-white p-3 text-center backdrop-blur-xl">
            <div>
              <p className="text-2xl font-bold text-slate-900">{uploadSummary.total}</p>
              <p className="text-xs text-slate-500">Files</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{uploadSummary.completed}</p>
              <p className="text-xs text-slate-500">Uploaded</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{uploadSummary.uploading}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card variant="glass" className="p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Upload Area</h2>
              <p className="mt-1 text-sm text-slate-500">
                PDF, Excel, and image files up to 20MB
              </p>
            </div>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 sm:w-auto"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={[
              "group flex min-h-[14rem] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed p-4 text-center transition-all duration-300 sm:min-h-[18rem] sm:p-6",
              isDragging
                ? "border-emerald-500 bg-emerald-50/80 shadow-lg"
                : "border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/60",
            ].join(" ")}
          >
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/25 transition group-hover:scale-105">
              <Icon name="upload" className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-950">
              Drag and drop files here
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Upload architectural drawings, energy sheets, water calculations, material evidence, and site photographs.
            </p>
            <Button as="span" variant="primary" className="mt-6 w-full sm:w-auto">
              Browse Files
            </Button>
            <p className="mt-4 text-xs font-medium text-slate-400">
              Supported formats: PDF, XLSX, XLS, PNG, JPG, JPEG
            </p>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
            onChange={(event) => addFiles(event.target.files)}
          />
        </Card>

        <Card variant="normal" className="p-4 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">Categories</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose the evidence category before uploading.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={[
                  "flex min-w-0 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                  category === item
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/60",
                ].join(" ")}
              >
                <span className="truncate">{item}</span>
                {category === item && <Icon name="check" className="h-4 w-4 shrink-0" />}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="normal" padding="none" className="overflow-hidden">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <h2 className="text-xl font-bold text-slate-950">Upload Queue</h2>
          <p className="mt-1 text-sm text-slate-500">
            Review file names, sizes, progress, and upload status.
          </p>
        </div>

        {uploads.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
              <Icon name="file" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-950">No files selected</h3>
            <p className="mt-2 text-sm text-slate-500">
              Drag files into the upload area to begin.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {uploads.map((file) => (
              <div key={file.id} className="grid min-w-0 gap-4 p-4 transition hover:bg-emerald-50/40 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                <div className="flex min-w-0 items-start gap-3">
                  <FileTypeIcon type={file.type} />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-950">{file.name}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {file.type} - {file.category} - {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="w-full min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                    <span>Upload Progress</span>
                    <span>{file.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-700",
                        file.status === "Error"
                          ? "bg-red-500"
                          : "bg-gradient-to-r from-emerald-600 to-teal-400",
                        file.progress === 0 ? "w-0" : file.progress < 50 ? "w-[42%]" : file.progress < 100 ? "w-[72%]" : "w-full",
                      ].join(" ")}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
                  <StatusBadge status={file.status} />
                  <button
                    type="button"
                    onClick={() => removeUpload(file.id)}
                    className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${file.name}`}
                  >
                    <Icon name="close" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default UploadDocument;
