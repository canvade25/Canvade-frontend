import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Archive,
  FileText,
  Plus,
  Trash2,
  Upload,
  BookOpen,
  DollarSign,
  Layout,
  Calendar,
  Users,
  FileUp,
  HelpCircle,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../utils/toast";

const STEPS = [
  { id: 1, label: "Basic Details", icon: BookOpen },
  { id: 2, label: "Price Details", icon: DollarSign },
  { id: 3, label: "Curriculum", icon: Layout },
  { id: 4, label: "Batch Plan", icon: Calendar },
  { id: 5, label: "Faculty", icon: Users },
  { id: 6, label: "Upload Materials", icon: FileUp },
  { id: 7, label: "FAQs", icon: HelpCircle },
];

const ACCREDITATION_OPTIONS = [
  "UGC Recognized", "AICTE Approved", "NAAC Accredited", "NSDC Certified",
  "Skill India Aligned", "Government Recognized", "Industry Recognized",
  "ISO Certified", "Internationally Accredited", "Certification Included",
  "Placement Assistance Available", "Internship Included",
  "Authorized Training Partner", "Authorized Examination Centre",
  "University Affiliated", "Corporate Certified Program",
];

const STATUS_OPTIONS = ["Active", "Closed for Intake", "Inactive", "Archived"];

const CATEGORY_OPTIONS = [
  "Government Exams", "Engineering", "Information Technology", "Software Development",
  "Data Science", "Artificial Intelligence", "Cyber Security", "Cloud Computing",
  "Business Management", "Finance", "Digital Marketing", "Sales", "Entrepreneurship",
  "Design", "Animation", "Video Editing", "Healthcare", "Law", "Architecture",
  "Interior Design", "Languages", "Personality Development", "Hospitality", "Aviation",
  "Travel & Tourism", "Event Management", "Fashion Design", "Beauty & Wellness",
  "Music & Performing Arts", "Sports & Fitness",
];

const BATCH_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

const asArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const firstFilled = (...values) =>
  values.find((value) => asArray(value).filter(Boolean).length > 0);

const fileUrlFromValue = (value) => {
  if (!value || typeof value === "string") return value || "";
  return (
    value.url ||
    value.secureUrl ||
    value.secure_url ||
    value.fileUrl ||
    value.file_url ||
    value.imageUrl ||
    value.image_url ||
    value.videoUrl ||
    value.video_url ||
    value.documentUrl ||
    value.document_url ||
    value.materialUrl ||
    value.material_url ||
    value.thumbnailUrl ||
    value.thumbnail_url ||
    value.path ||
    value.location ||
    ""
  );
};

const toText = (value) => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return value.name || value.title || value.label || value.reason || value.description || "";
};

// An institute location (from GET /api/institute/view/my-institute) is an
// address object; older/legacy course data may still hold plain strings.
// This formats either into the single display/storage label used for
// course.basicDetails.locations.
const formatLocationLabel = (loc) => {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  return [loc.addressLine1 || loc.address1, loc.city, loc.state]
    .filter(Boolean)
    .join(", ");
};

const normalizeCurriculumSection = (section) => {
  const modules = asArray(section?.modules).map((module) => ({
    name: toText(module?.name || module?.moduleName),
    description: toText(module?.description),
  }));

  return {
    heading: toText(section?.heading || section?.title || section?.moduleTitle),
    duration: toText(section?.duration),
    modules: modules.length ? modules : [{ name: "", description: "" }],
  };
};

const normalizeCouponCode = (value) => {
  if (!value) return { code: "", discountAmount: "" };
  if (typeof value === "string") {
    return { code: value, discountAmount: "" };
  }

  return {
    code: value.code || value.couponCode || value.name || "",
    discountAmount: value.discountAmount ?? value.amount ?? value.discount ?? "",
  };
};

const generateStrongCouponCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomPart = Array.from({ length: 16 }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join("");
  return `CVD-${randomPart}`;
};

// A course's batch plan is a pricing/seat "tier" (e.g. Weekday / Weekend / Fast-track),
// distinct from an actual scheduled Batch. planId lets other parts of the app
// (like the Batch Planner) reference exactly which tier a real batch was booked under.
const normalizePlan = (plan, index) => ({
  planId: plan?.planId || "",
  batchId: plan?.batchId || "",
  name: toText(plan?.planName || plan?.name) || "",
  duration: toText(plan?.duration) || "",
  seats: plan?.openSeats ?? plan?.seats ?? "",
  price: plan?.price ?? plan?.currentPrice ?? "",
});

// A faculty member is identified by facultyCode everywhere in this app (institute
// faculty records don't carry a Mongo/Firestore _id in the API responses we get back).
const normalizeFacultyRef = (value) => {
  if (!value) return null;
  if (typeof value === "string") return { facultyCode: value };
  return {
    facultyCode: value.facultyCode || value.code || "",
    name: value.name || "",
    profileImage: value.profileImage || null,
    subjects: asArray(value.subjects),
    experience: value.experience || "",
  };
};

const fileNameFromValue = (value, fallback = "Existing file") => {
  if (!value) return fallback;
  if (typeof value === "string") {
    return decodeURIComponent(value.split("?")[0].split("/").filter(Boolean).pop() || fallback);
  }
  const url = fileUrlFromValue(value);
  return (
    value.name ||
    value.fileName ||
    value.file_name ||
    value.originalName ||
    value.original_name ||
    value.title ||
    (url ? decodeURIComponent(url.split("?")[0].split("/").filter(Boolean).pop() || "") : "") ||
    fallback
  );
};

const normalizeFileRef = (value, fallback) => {
  if (!value) return null;
  if (typeof value === "string") {
    return { name: fileNameFromValue(value, fallback), url: value };
  }
  return {
    ...value,
    url: fileUrlFromValue(value),
    name: fileNameFromValue(value, fallback),
  };
};

const normalizeFileRefs = (value, fallback) =>
  asArray(value).map((file) => normalizeFileRef(file, fallback)).filter(Boolean);

const isPdfRef = (file) => {
  if (!file) return false;
  const name = fileNameFromValue(file, "").toLowerCase();
  return file.type === "application/pdf" || name.endsWith(".pdf");
};
const isFileInstance = (v) => typeof File !== "undefined" && v instanceof File;

// ── Formatting helpers for the read-only batch cards ─────────────────────────
const formatBatchDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

const formatBatchTime = (start, end) => {
  if (!start && !end) return "—";
  return [start, end].filter(Boolean).join(" – ");
};

const authHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("Token");
  return { Authorization: `Bearer ${token}` };
};

// ── Validation functions ─────────────────────────────────────────────────────

function validateStep1(data) {
  const errors = {};
  if (!data.code.trim()) errors.code = "Course Code is required";
  if (!data.title.trim()) errors.title = "Course Title is required";
  if (!data.about.trim()) errors.about = "About the Course is required";
  if (!data.duration) errors.duration = "Course Duration is required";
  if (!data.minQual) errors.minQual = "Minimum Qualification is required";
  if (!data.priorQual.trim()) errors.priorQual = "Prior Knowledge Required is required";
  if (!data.language.trim()) errors.language = "Course Language is required";
  const filledLocations = data.locations.filter((l) => l.trim());
  if (filledLocations.length === 0) errors.locations = "At least 1 location is required";
  if (!data.level.trim()) errors.level = "Course Level is required";
  if (!data.difficulty) errors.difficulty = "Course Difficulty is required";
  if (!data.certification) errors.certification = "Certification Type is required";
  if (!data.materials) errors.materials = "Supporting Materials selection is required";
  if (!data.placement) errors.placement = "Placement Assistance selection is required";
  if (!data.status) errors.status = "Course Status is required";
  if (!data.category) errors.category = "Course Category is required";
  if (data.accreditation.length === 0) errors.accreditation = "Select at least 1 accreditation";
  const filledOutcomes = data.outcomes.filter((o) => o.trim());
  if (filledOutcomes.length < 4) errors.outcomes = "At least 4 learning outcomes are required";
  const filledJobs = data.jobs.filter((j) => j.trim());
  if (filledJobs.length < 1) errors.jobs = "At least 1 career path is required";
  if (!data.keywords.trim()) errors.keywords = "Keywords are required";
  return errors;
}

function validateStep2(data) {
  const errors = {};
  if (!data.actualPrice || isNaN(Number(data.actualPrice)) || Number(data.actualPrice) < 0)
    errors.actualPrice = "Actual Price is required";
  if (!data.discount && data.discount !== 0 && data.discount !== "0")
    errors.discount = "Discount is required (enter 0 if no discount)";
  else if (isNaN(Number(data.discount)) || Number(data.discount) < 0 || Number(data.discount) > 100)
    errors.discount = "Discount must be between 0 and 100";
  if (!data.currentPrice && data.currentPrice !== 0 && data.currentPrice !== "0")
    errors.currentPrice = "Current Price is required";
  else if (isNaN(Number(data.currentPrice)) || Number(data.currentPrice) < 0)
    errors.currentPrice = "Current Price must be a valid number";
  const emptyBreaks = data.priceBreaks.filter((b) => !b.reason.trim() || !b.price);
  if (emptyBreaks.length > 0) errors.priceBreaks = "All price break reason and amount are required";
  else {
    const invalidBreaks = data.priceBreaks.filter((b) => isNaN(Number(b.price)));
    if (invalidBreaks.length > 0) errors.priceBreaks = "All price break amounts must be valid numbers";
  }
  const emptyExpenses = data.expenses.filter((e) => !e.reason.trim() || !e.amount);
  if (emptyExpenses.length > 0) errors.expenses = "All expense reason and amount are required";
  else {
    const invalidExpenses = data.expenses.filter((e) => isNaN(Number(e.amount)));
    if (invalidExpenses.length > 0) errors.expenses = "Expense amounts must be valid numbers";
  }
  const emptyScholarships = data.scholarships.filter((s) => !toText(s).trim());
  if (emptyScholarships.length > 0) errors.scholarships = "All scholarship fields must be filled";
  const couponCode = String(data.couponCode?.code || "").trim();
  const couponAmount = data.couponCode?.discountAmount;
  if (couponCode || couponAmount) {
    if (!couponCode) errors.couponCode = "Coupon code is required";
    else if (!/^[A-Z0-9-]{6,24}$/.test(couponCode)) {
      errors.couponCode = "Use 6-24 uppercase letters, numbers or hyphen";
    }
    if (!couponAmount && couponAmount !== 0 && couponAmount !== "0") {
      errors.couponAmount = "Discount amount is required";
    } else if (isNaN(Number(couponAmount)) || Number(couponAmount) <= 0) {
      errors.couponAmount = "Discount amount must be greater than 0";
    }
  }
  return errors;
}

function validateStep3(data) {
  const errors = {};
  const hasEmpty = data.curriculum.some(
    (sec) => !toText(sec.heading).trim() || asArray(sec.modules).some((m) => !toText(m.name || m.moduleName).trim())
  );
  if (hasEmpty) errors.curriculum = "All section headings and module names are required";
  return errors;
}

function validateStep4(data) {
  const errors = {};
  if (!data.plans || data.plans.length === 0) {
    errors.plans = "Select at least one batch to publish this course under";
  }
  return errors;
}

function validateStep5(data) {
  const errors = {};
  // For now, no validation on faculty
  return errors;
}

// Upload step validation
// uploadData shape: { thumbnail: File|null, images: File[], previewVideo: File|null, documents: File[], materials: File[] }
function validateStep6(data) {
  const errors = {};

  // Thumbnail: required, max 1 MB
  if (!data.thumbnail) {
    errors.thumbnail = "Thumbnail is required";
  } else if (data.thumbnail.size && data.thumbnail.size > 1 * 1024 * 1024) {
    errors.thumbnail = "Thumbnail must be under 1 MB";
  }

  // Course images: required (at least 1), up to 5, each max 1 MB
  if (!data.images || data.images.length === 0) {
    errors.images = "At least 1 course image is required";
  } else if (data.images.length > 5) {
    errors.images = "Maximum 5 course images allowed";
  } else {
    const oversized = data.images.some((f) => f.size && f.size > 1 * 1024 * 1024);
    if (oversized) errors.images = "Each course image must be under 1 MB";
  }

  // Preview video: optional — no validation

  // Institute documents: at least 1 required
  if (!data.documents || data.documents.length === 0) {
    errors.documents = "At least one institute document is required";
  }

  // Student materials: required, PDF only
  if (!data.materials || data.materials.length === 0) {
    errors.materials = "At least one student material (PDF) is required";
  } else {
    const nonPdf = data.materials.some(
      (f) => !isPdfRef(f)
    );
    if (nonPdf) errors.materials = "Only PDF files are allowed for student materials";
  }

  return errors;
}

function validateStep7(data) {
  const errors = {};
  const hasEmpty = data.faqs.some((f) => !f.question.trim() || !f.answer.trim());
  if (hasEmpty) errors.faqs = "All FAQ questions and answers are required";
  return errors;
}

function getStepErrors(stepIndex, stepData) {
  switch (stepIndex) {
    case 0: return validateStep1(stepData[0]);
    case 1: return validateStep2(stepData[1]);
    case 2: return validateStep3(stepData[2]);
    case 3: return validateStep4(stepData[3]);
    case 4: return validateStep5(stepData[4]);
    case 5: return validateStep6(stepData[5]);
    case 6: return validateStep7(stepData[6]);
    default: return {};
  }
}

function isStepComplete(stepIndex, stepData) {
  return Object.keys(getStepErrors(stepIndex, stepData)).length === 0;
}

// ── Reusable primitives ──────────────────────────────────────────────────────

const Label = ({ children, required }) => (
  <label className="block text-[12px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">
    {children}{required && <span className="text-emerald-500 ml-0.5">*</span>}
  </label>
);

const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
      <AlertCircle className="w-3 h-3 flex-shrink-0" /> {msg}
    </p>
  ) : null;

const Input = ({ className = "", error, ...props }) => (
  <input
    className={`w-full border rounded-lg px-3.5 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-white ${error
      ? "border-red-400 focus:border-red-400 focus:ring-red-50"
      : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-50"
      } ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", error, ...props }) => (
  <textarea
    className={`w-full border rounded-lg px-3.5 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-white resize-none ${error
      ? "border-red-400 focus:border-red-400 focus:ring-red-50"
      : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-50"
      } ${className}`}
    {...props}
  />
);

const Select = ({ children, className = "", error, ...props }) => (
  <select
    className={`w-full border rounded-lg px-3.5 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:ring-2 transition-all bg-white ${error
      ? "border-red-400 focus:border-red-400 focus:ring-red-50"
      : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-50"
      } ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-[15px] font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">
    {children}
  </h3>
);

const AddButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors mt-2"
  >
    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
      <Plus className="w-3 h-3" />
    </div>
    {label}
  </button>
);

const RemoveButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
  >
    <Trash2 className="w-3.5 h-3.5" />
  </button>
);

// ── Steps ────────────────────────────────────────────────────────────────────

function Step1({ data, setData, fieldErrors, submitted }) {
  const [instituteLocations, setInstituteLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationsError, setLocationsError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLocationsLoading(true);
        setLocationsError("");
        const response = await fetch(`${API_BASE_URL}/api/institute/view/my-institute`, {
          method: "GET",
          headers: authHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch institute locations");
        }
        const institute = result.institute || result.data || result;
        setInstituteLocations(asArray(institute?.locations));
      } catch (error) {
        console.error("Error fetching institute locations:", error);
        setLocationsError(error.message || "An error occurred while fetching institute locations.");
      } finally {
        setLocationsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const add = (key) => setData((p) => ({ ...p, [key]: [...p[key], ""] }));
  const remove = (key, i) => setData((p) => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }));
  const update = (key, i, val) => setData((p) => ({ ...p, [key]: p[key].map((v, j) => j === i ? val : v) }));
  const toggleLocation = (label) => {
    if (!label) return;
    setData((p) => ({
      ...p,
      locations: p.locations.includes(label)
        ? p.locations.filter((v) => v !== label)
        : [...p.locations.filter(Boolean), label],
    }));
  };
  const toggleAcc = (val) => setData((p) => ({
    ...p,
    accreditation: p.accreditation.includes(val)
      ? p.accreditation.filter((v) => v !== val)
      : [...p.accreditation, val],
  }));

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>Course Identity</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Course Code</Label>
            <Input
              placeholder="e.g. CS-2024-001"
              value={data.code}
              error={submitted && fieldErrors.code}
              onChange={(e) => setData((p) => ({ ...p, code: e.target.value }))}
            />
            <FieldError msg={submitted && fieldErrors.code} />
          </div>
          <div>
            <Label required>Course Title</Label>
            <Input
              placeholder="Enter course title"
              value={data.title}
              error={submitted && fieldErrors.title}
              onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
            />
            <FieldError msg={submitted && fieldErrors.title} />
          </div>
        </div>
        <div className="mt-4">
          <Label required>About the Course</Label>
          <Textarea rows={4} placeholder="Describe what this course is about..." value={data.about} error={submitted && fieldErrors.about} onChange={(e) => setData((p) => ({ ...p, about: e.target.value }))} />
          <FieldError msg={submitted && fieldErrors.about} />
        </div>
      </Card>

      <Card>
        <SectionTitle>Duration & Qualification</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Course Duration</Label>
            <Select
              value={data.duration}
              error={submitted && fieldErrors.duration}
              onChange={(e) => setData((p) => ({ ...p, duration: e.target.value }))}
            >
              <option value="">Select duration</option>
              {["0–3 months", "3–6 months", "6–12 months", "1–2 years", "2–4 years"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
            <FieldError msg={submitted && fieldErrors.duration} />
          </div>
          <div>
            <Label required>Minimum Qualification</Label>
            <Select
              value={data.minQual}
              error={submitted && fieldErrors.minQual}
              onChange={(e) => setData((p) => ({ ...p, minQual: e.target.value }))}
            >
              <option value="">Select qualification</option>
              {["No Education", "K-5", "K-10", "K-12", "Undergraduate", "Graduate", "Post Graduate", "Masters", "Doctoral"].map((q) => (
                <option key={q}>{q}</option>
              ))}
            </Select>
            <FieldError msg={submitted && fieldErrors.minQual} />
          </div>
        </div>
        <div className="mt-4">
          <Label required>Prior Knowledge Required</Label>
          <Textarea rows={2} placeholder="Describe any prior knowledge or skills needed..." value={data.priorQual} error={submitted && fieldErrors.priorQual} onChange={(e) => setData((p) => ({ ...p, priorQual: e.target.value }))} />
          <FieldError msg={submitted && fieldErrors.priorQual} />
        </div>
      </Card>

      <Card>
        <SectionTitle>Delivery</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Learning Mode</Label>
            <div className="flex gap-2 mt-1">
              {["Onsite", "Online", "Hybrid"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setData((p) => ({ ...p, mode: m }))}
                  className={`flex-1 py-2.5 rounded-lg text-[12px] font-medium border transition-all ${data.mode === m ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label required>Course Language</Label>
            <Input placeholder="e.g. English, Hindi" value={data.language} error={submitted && fieldErrors.language} onChange={(e) => setData((p) => ({ ...p, language: e.target.value }))} />
            <FieldError msg={submitted && fieldErrors.language} />
          </div>
        </div>

        <div className="mt-4">
          <Label required>Course Locations</Label>
          <p className="text-[11px] text-gray-400 mb-2">
            Select from your institute's registered locations.
          </p>
          {submitted && fieldErrors.locations && <FieldError msg={fieldErrors.locations} />}
          {locationsLoading ? (
            <p className="text-[12px] text-gray-400 py-1">Loading locations...</p>
          ) : locationsError ? (
            <p className="text-[12px] text-red-500 py-1">{locationsError}</p>
          ) : instituteLocations.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {instituteLocations.map((loc, i) => {
                const label = formatLocationLabel(loc);
                const active = data.locations.includes(label);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleLocation(label)}
                    className={`text-[11px] px-3 py-1.5 rounded-full border font-medium transition-all ${active ? "bg-emerald-500 text-white border-emerald-500" : submitted && fieldErrors.locations ? "bg-white text-red-500 border-red-300 hover:border-red-400" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[12px] text-gray-400 py-1">
              No locations found on your institute profile. Add one from your institute settings first.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <SectionTitle>Course Information</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label required>Course Level</Label>
            <Input placeholder="e.g. Intermediate" value={data.level} error={submitted && fieldErrors.level} onChange={(e) => setData((p) => ({ ...p, level: e.target.value }))} />
            <FieldError msg={submitted && fieldErrors.level} />
          </div>
          <div>
            <Label required>Course Difficulty</Label>
            <Select value={data.difficulty} error={submitted && fieldErrors.difficulty} onChange={(e) => setData((p) => ({ ...p, difficulty: e.target.value }))}>
              <option value="">Select difficulty</option>
              {["Beginner", "Intermediate", "Advanced"].map((d) => <option key={d}>{d}</option>)}
            </Select>
            <FieldError msg={submitted && fieldErrors.difficulty} />
          </div>
          <div>
            <Label required>Certification Type</Label>
            <Select value={data.certification} error={submitted && fieldErrors.certification} onChange={(e) => setData((p) => ({ ...p, certification: e.target.value }))}>
              <option value="">Select type</option>
              {["Degree", "Diploma", "Certificate of Completion", "Certificate of Participation"].map((c) => <option key={c}>{c}</option>)}
            </Select>
            <FieldError msg={submitted && fieldErrors.certification} />
          </div>
          <div>
            <Label required>Supporting Materials</Label>
            <Select value={data.materials} error={submitted && fieldErrors.materials} onChange={(e) => setData((p) => ({ ...p, materials: e.target.value }))}>
              <option value="">Select</option>
              <option>Provided</option>
              <option>Not Provided</option>
            </Select>
            <FieldError msg={submitted && fieldErrors.materials} />
          </div>
          <div>
            <Label required>Placement Assistance</Label>
            <Select value={data.placement} error={submitted && fieldErrors.placement} onChange={(e) => setData((p) => ({ ...p, placement: e.target.value }))}>
              <option value="">Select</option>
              <option>Guaranteed</option>
              <option>Connection</option>
              <option>No</option>
            </Select>
            <FieldError msg={submitted && fieldErrors.placement} />
          </div>
          <div>
            <Label required>Course Status</Label>
            <Select value={data.status} error={submitted && fieldErrors.status} onChange={(e) => setData((p) => ({ ...p, status: e.target.value }))}>
              <option value="">Select status</option>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </Select>
            <FieldError msg={submitted && fieldErrors.status} />
          </div>
          <div>
            <Label required>Course Category</Label>
            <Select value={data.category} error={submitted && fieldErrors.category} onChange={(e) => setData((p) => ({ ...p, category: e.target.value }))}>
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <FieldError msg={submitted && fieldErrors.category} />
          </div>
        </div>

        <div className="mt-4">
          <Label required>Accreditation</Label>
          {submitted && fieldErrors.accreditation && <FieldError msg={fieldErrors.accreditation} />}
          <div className="flex flex-wrap gap-2 mt-1">
            {ACCREDITATION_OPTIONS.map((opt) => {
              const active = data.accreditation.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleAcc(opt)}
                  className={`text-[11px] px-3 py-1.5 rounded-full border font-medium transition-all ${active ? "bg-emerald-500 text-white border-emerald-500" : submitted && fieldErrors.accreditation ? "bg-white text-red-500 border-red-300 hover:border-red-400" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}
                >
                  {active && <Check className="w-3 h-3 inline mr-1" />}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Learning Outcomes</SectionTitle>
        <p className="text-[11px] text-gray-400 mb-3">Add 4 to 10 learning outcomes</p>
        {submitted && fieldErrors.outcomes && <FieldError msg={fieldErrors.outcomes} />}
        {data.outcomes.map((out, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              placeholder={`Outcome ${i + 1} — What will students achieve?`}
              value={out}
              error={submitted && fieldErrors.outcomes && !out.trim()}
              onChange={(e) => update("outcomes", i, e.target.value)}
            />
            {data.outcomes.length > 1 && <RemoveButton onClick={() => remove("outcomes", i)} />}
          </div>
        ))}
        {data.outcomes.length < 10 && (
          <AddButton onClick={() => add("outcomes")} label="Add Learning Outcome" />
        )}
      </Card>

      <Card>
        <SectionTitle>Career Path</SectionTitle>
        {submitted && fieldErrors.jobs && <FieldError msg={fieldErrors.jobs} />}
        {data.jobs.map((job, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              placeholder={`Job role / career path ${i + 1}`}
              value={job}
              error={submitted && fieldErrors.jobs && !job.trim()}
              onChange={(e) => update("jobs", i, e.target.value)}
            />
            {data.jobs.length > 1 && <RemoveButton onClick={() => remove("jobs", i)} />}
          </div>
        ))}
        <AddButton onClick={() => add("jobs")} label="Add Career Path" />
      </Card>

      <Card>
        <SectionTitle>Keywords</SectionTitle>
        <Textarea rows={2} placeholder="Enter keywords separated by commas (e.g. Python, Data Science, Machine Learning)" value={data.keywords} error={submitted && fieldErrors.keywords} onChange={(e) => setData((p) => ({ ...p, keywords: e.target.value }))} />
        <FieldError msg={submitted && fieldErrors.keywords} />
      </Card>
    </div>
  );
}

function Step2({ data, setData, fieldErrors, submitted }) {
  const addExpense = () => setData((p) => ({ ...p, expenses: [...p.expenses, { reason: "", amount: "" }] }));
  const removeExpense = (i) => setData((p) => ({ ...p, expenses: p.expenses.filter((_, j) => j !== i) }));
  const updateExpense = (i, key, val) => setData((p) => ({ ...p, expenses: p.expenses.map((e, j) => j === i ? { ...e, [key]: val } : e) }));
  const addScholarship = () => setData((p) => ({ ...p, scholarships: [...p.scholarships, ""] }));
  const removeScholarship = (i) => setData((p) => ({ ...p, scholarships: p.scholarships.filter((_, j) => j !== i) }));
  const updateScholarship = (i, val) => setData((p) => ({ ...p, scholarships: p.scholarships.map((s, j) => j === i ? val : s) }));
  const addPriceBreak = () => setData((p) => ({ ...p, priceBreaks: [...p.priceBreaks, { reason: "", price: "" }] }));
  const removePriceBreak = (i) => setData((p) => ({ ...p, priceBreaks: p.priceBreaks.filter((_, j) => j !== i) }));
  const updatePriceBreak = (i, key, val) => setData((p) => ({ ...p, priceBreaks: p.priceBreaks.map((b, j) => j === i ? { ...b, [key]: val } : b) }));
  const updateCoupon = (key, value) =>
    setData((p) => ({
      ...p,
      couponCode: { ...p.couponCode, [key]: key === "code" ? value.toUpperCase() : value },
    }));
  const generateCoupon = () =>
    setData((p) => ({
      ...p,
      couponCode: { ...p.couponCode, code: generateStrongCouponCode() },
    }));

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>Pricing</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label required>Actual Price (₹)</Label>
            <Input
              type="number"
              placeholder="0"
              value={data.actualPrice}
              error={submitted && fieldErrors.actualPrice}
              onChange={(e) => setData((p) => ({ ...p, actualPrice: e.target.value }))}
            />
            <FieldError msg={submitted && fieldErrors.actualPrice} />
          </div>
          <div>
            <Label required>Discount (%)</Label>
            <Input
              type="number"
              placeholder="0"
              value={data.discount}
              error={submitted && fieldErrors.discount}
              onChange={(e) => setData((p) => ({ ...p, discount: e.target.value }))}
            />
            <FieldError msg={submitted && fieldErrors.discount} />
          </div>
          <div>
            <Label required>Current Price (₹)</Label>
            <Input
              type="number"
              placeholder="Enter current price"
              value={data.currentPrice}
              error={submitted && fieldErrors.currentPrice}
              onChange={(e) => setData((p) => ({ ...p, currentPrice: e.target.value }))}
            />
            <FieldError msg={submitted && fieldErrors.currentPrice} />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Price Breakdown</SectionTitle>
        <p className="text-[11px] text-gray-400 mb-3">Explain what's included in the price</p>
        {submitted && fieldErrors.priceBreaks && <FieldError msg={fieldErrors.priceBreaks} />}
        {data.priceBreaks.map((b, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input placeholder="Reason (e.g. Lab fees)" value={b.reason} error={submitted && fieldErrors.priceBreaks && !b.reason.trim()} onChange={(e) => updatePriceBreak(i, "reason", e.target.value)} />
            <Input
              placeholder="₹ Amount"
              className="w-32"
              type="number"
              value={b.price}
              error={submitted && fieldErrors.priceBreaks && !b.price}
              onChange={(e) => updatePriceBreak(i, "price", e.target.value)}
            />
            {data.priceBreaks.length > 1 && <RemoveButton onClick={() => removePriceBreak(i)} />}
          </div>
        ))}
        <AddButton onClick={addPriceBreak} label="Add Price Break" />
      </Card>

      <Card>
        <SectionTitle>Extra Course Expenses</SectionTitle>
        <p className="text-[11px] text-gray-400 mb-3">Any additional costs the student may incur (e.g. Study materials, Domain, Projects, Certificate)</p>
        {submitted && fieldErrors.expenses && <FieldError msg={fieldErrors.expenses} />}
        {data.expenses.map((exp, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input placeholder="Reason (e.g. Study materials)" value={exp.reason} error={submitted && fieldErrors.expenses && !exp.reason.trim()} onChange={(e) => updateExpense(i, "reason", e.target.value)} />
            <Input
              placeholder="Amount or number"
              type="number"
              value={exp.amount}
              error={submitted && fieldErrors.expenses && !exp.amount}
              onChange={(e) => updateExpense(i, "amount", e.target.value)}
            />
            {data.expenses.length > 1 && <RemoveButton onClick={() => removeExpense(i)} />}
          </div>
        ))}
        <AddButton onClick={addExpense} label="Add Expense" />
      </Card>

      <Card>
        <SectionTitle>Scholarships</SectionTitle>
        {submitted && fieldErrors.scholarships && <FieldError msg={fieldErrors.scholarships} />}
        {data.scholarships.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input placeholder={`Scholarship ${i + 1}`} value={toText(s)} error={submitted && fieldErrors.scholarships && !toText(s).trim()} onChange={(e) => updateScholarship(i, e.target.value)} />
            {data.scholarships.length > 1 && <RemoveButton onClick={() => removeScholarship(i)} />}
          </div>
        ))}
        <AddButton onClick={addScholarship} label="Add Scholarship" />
      </Card>

      <Card>
        <SectionTitle>Coupon Code</SectionTitle>
        <p className="text-[11px] text-gray-400 mb-3">
          Coupon will be valid only for this course.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_220px] gap-3 items-start">
          <div>
            <Label>Write Code</Label>
            <Input
              placeholder="CVD-8X4K2Q9P"
              value={data.couponCode?.code || ""}
              error={submitted && fieldErrors.couponCode}
              onChange={(e) => updateCoupon("code", e.target.value)}
            />
            <FieldError msg={submitted && fieldErrors.couponCode} />
          </div>
          <button
            type="button"
            onClick={generateCoupon}
            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            Generate strong code
          </button>
          <div>
            <Label>Discount Amount</Label>
            <Input
              type="number"
              min="1"
              placeholder="Amount"
              value={data.couponCode?.discountAmount || ""}
              error={submitted && fieldErrors.couponAmount}
              onChange={(e) => updateCoupon("discountAmount", e.target.value)}
            />
            <FieldError msg={submitted && fieldErrors.couponAmount} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function Step3({ data, setData, fieldErrors, submitted }) {
  const addHeading = () => setData((p) => ({ ...p, curriculum: [...p.curriculum, { heading: "", duration: "", modules: [{ name: "", description: "" }] }] }));
  const removeHeading = (i) => setData((p) => ({ ...p, curriculum: p.curriculum.filter((_, j) => j !== i) }));
  const updateHeading = (i, key, val) => setData((p) => ({ ...p, curriculum: p.curriculum.map((h, j) => j === i ? { ...h, [key]: val } : h) }));
  const addModule = (i) => setData((p) => ({ ...p, curriculum: p.curriculum.map((h, j) => j === i ? { ...h, modules: [...h.modules, { name: "", description: "" }] } : h) }));
  const removeModule = (hi, mi) => setData((p) => ({ ...p, curriculum: p.curriculum.map((h, j) => j === hi ? { ...h, modules: h.modules.filter((_, k) => k !== mi) } : h) }));
  const updateModule = (hi, mi, key, val) => setData((p) => ({ ...p, curriculum: p.curriculum.map((h, j) => j === hi ? { ...h, modules: h.modules.map((m, k) => k === mi ? { ...m, [key]: val } : m) } : h) }));

  return (
    <div className="space-y-5">
      {submitted && fieldErrors.curriculum && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <FieldError msg={fieldErrors.curriculum} />
        </div>
      )}
      {data.curriculum.map((section, i) => (
        <Card key={i}>
          <div className="flex items-start justify-between mb-4">
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Section {i + 1}</span>
            {data.curriculum.length > 1 && (
              <button type="button" onClick={() => removeHeading(i)} className="text-[11px] text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Remove Section
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="md:col-span-2">
              <Label>Section Heading</Label>
              <Input
                placeholder="e.g. Introduction to Python"
                value={section.heading}
                error={submitted && fieldErrors.curriculum && !section.heading.trim()}
                onChange={(e) => updateHeading(i, "heading", e.target.value)}
              />
            </div>
            <div>
              <Label>Duration</Label>
              <Input placeholder="e.g. 2 weeks" value={section.duration} onChange={(e) => updateHeading(i, "duration", e.target.value)} />
            </div>
          </div>

          <div className="pl-4 border-l-2 border-gray-100">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">Modules</p>
            {section.modules.map((mod, mi) => (
              <div key={mi} className="bg-[#f8fafc] rounded-xl p-3 mb-2">
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder={`Module ${mi + 1} name`}
                    value={mod.name}
                    error={submitted && fieldErrors.curriculum && !mod.name.trim()}
                    onChange={(e) => updateModule(i, mi, "name", e.target.value)}
                  />
                  {section.modules.length > 1 && <RemoveButton onClick={() => removeModule(i, mi)} />}
                </div>
                <Input placeholder="Short description (optional)" value={mod.description} onChange={(e) => updateModule(i, mi, "description", e.target.value)} />
              </div>
            ))}
            <AddButton onClick={() => addModule(i)} label="Add Module" />
          </div>
        </Card>
      ))}
      <button
        type="button"
        onClick={addHeading}
        className="w-full py-3 border-2 border-dashed border-emerald-200 rounded-2xl text-[13px] font-medium text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Section
      </button>
    </div>
  );
}

function Step4({ data, setData, fieldErrors, submitted }) {
  const [instituteBatches, setInstituteBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batchesError, setBatchesError] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setBatchesLoading(true);
        setBatchesError("");
        const response = await fetch(`${API_BASE_URL}/api/batches/get-my-batches`, {
          method: "GET",
          headers: authHeaders(),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch batches");
        }
        setInstituteBatches(result.batches || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
        setBatchesError(error.message || "An error occurred while fetching batches data.");
        showError(error.message || "An error occurred while fetching batches data.");
      } finally {
        setBatchesLoading(false);
      }
    };
    fetchBatches();
  }, []);

  // A "plan" is now just a reference to a real, already-scheduled batch (picked
  // from Batch Management) rather than something typed in by hand. batchId is
  // the join key between the two.
  const isSelected = (batch) => {
    const batchId = batch.id || batch.batchId;
    return data.plans.some((p) => p.batchId === batchId);
  };

  const toggleBatch = (batch) => {
    const batchId = batch.id || batch.batchId;
    if (isSelected(batch)) {
      setData((p) => ({ ...p, plans: p.plans.filter((pl) => pl.batchId !== batchId) }));
      return;
    }
    setData((p) => ({
      ...p,
      plans: [
        ...p.plans,
        {
          planId: "",
          batchId,
          name: batch.batchName || batch.batchCode || "Untitled Batch",
          duration: `${formatBatchDate(batch.startDate)} – ${formatBatchDate(batch.endDate)}`,
          seats: batch.capacity ?? "",
          price: "",
        },
      ],
    }));
  };

  const updatePlanPrice = (batchId, value) =>
    setData((p) => ({
      ...p,
      plans: p.plans.map((pl) => (pl.batchId === batchId ? { ...pl, price: value } : pl)),
    }));

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>Select Batches for This Course</SectionTitle>
        <p className="text-[11px] text-gray-400 mb-3">
          Pick one or more already-scheduled batches from Batch Management to publish this course
          under — each selected batch becomes a plan students can enrol into. Set an optional price
          per plan below.
        </p>
        {submitted && fieldErrors.plans && <FieldError msg={fieldErrors.plans} />}

        {batchesLoading ? (
          <p className="text-gray-400 text-center text-[13px] py-6">Loading batches...</p>
        ) : batchesError ? (
          <p className="text-red-500 text-center text-[13px] py-6">{batchesError}</p>
        ) : instituteBatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instituteBatches.map((batch, i) => {
              const batchId = batch.id || batch.batchId || i;
              const selected = isSelected(batch);
              const selectedPlan = data.plans.find((pl) => pl.batchId === batchId);
              const studentCount = Array.isArray(batch.studentIds)
                ? batch.studentIds.length
                : Array.isArray(batch.studentNames)
                  ? batch.studentNames.length
                  : 0;
              const statusStyles =
                batch.status === "active"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : batch.status === "completed"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-gray-100 text-gray-500 border-gray-200";

              return (
                <div
                  key={batchId}
                  onClick={() => toggleBatch(batch)}
                  role="button"
                  tabIndex={0}
                  className={`relative rounded-xl border bg-white p-4 shadow-sm cursor-pointer transition-all ${selected
                    ? "border-emerald-500 ring-2 ring-emerald-100"
                    : "border-gray-200 hover:border-emerald-300 hover:shadow-sm"
                    }`}
                >
                  {selected && (
                    <div className="absolute top-3 right-3 p-1 bg-emerald-500 rounded-full text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 pr-6">
                    <div>
                      <p className="text-[14px] font-semibold text-gray-800">{batch.batchName || `Batch ${i + 1}`}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{batch.batchCode || "—"} · {batch.courseName || "Unlinked course"}</p>
                    </div>
                    {batch.status && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${statusStyles}`}>
                        {batch.status}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Faculty</p>
                      <p className="text-[12px] text-gray-700">{batch.teacherName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Capacity</p>
                      <p className="text-[12px] text-gray-700">
                        {studentCount}/{batch.capacity ?? "—"} students
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Duration</p>
                      <p className="text-[12px] text-gray-700">
                        {formatBatchDate(batch.startDate)} → {formatBatchDate(batch.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">Time</p>
                      <p className="text-[12px] text-gray-700">{formatBatchTime(batch.startTime, batch.endTime)}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Days</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {BATCH_DAYS.map((day) => {
                        const active = (batch.days || []).some((d) => d.startsWith(day));
                        return (
                          <span
                            key={day}
                            className={`w-9 h-7 flex items-center justify-center rounded-md text-[11px] font-medium border ${active
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-gray-50 text-gray-400 border-gray-200"
                              }`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {Array.isArray(batch.locations) && batch.locations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Locations</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {batch.locations.map((loc, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium"
                          >
                            {loc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* {selected && (
                    <div
                      className="mt-3 pt-3 border-t border-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Label>Price for this plan (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={selectedPlan?.price ?? ""}
                        onChange={(e) => updatePlanPrice(batchId, e.target.value)}
                      />
                    </div>
                  )} */}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No batches found yet. Create a batch in Batch Management first, then come back to select it here.
          </p>
        )}
      </Card>
    </div>
  );
}

function Step5({ data, setData, fieldErrors, submitted }) {
  const [instituteFaculty, setInstituteFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState("");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setFacultyLoading(true);
        setFacultyError("");
        const response = await fetch(`${API_BASE_URL}/api/institute/my-faculties`, {
          method: "GET",
          headers: authHeaders(),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch faculty");
        }
        setInstituteFaculty((result.faculties || []).map(normalizeFacultyRef).filter(Boolean));
      } catch (error) {
        console.error("Error fetching faculty:", error);
        setFacultyError(error.message || "An error occurred while fetching faculty data.");
        showError(error.message || "An error occurred while fetching faculty data.");
      } finally {
        setFacultyLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  // Faculty is identified by facultyCode — institute faculty records don't carry a
  // separate document id in the API responses this app receives.
  const toggleFaculty = (facultyMember) => {
    const isSelected = data.faculty.some((f) => f.facultyCode === facultyMember.facultyCode);
    if (isSelected) {
      setData((prev) => ({
        ...prev,
        faculty: prev.faculty.filter((f) => f.facultyCode !== facultyMember.facultyCode),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        faculty: [...prev.faculty, facultyMember],
      }));
    }
  };

  return (
    <Card>
      <SectionTitle>Assign Faculty</SectionTitle>
      <p className="text-[11px] text-gray-400 mb-4">Tap to select one or more teachers for this course.</p>

      {facultyLoading ? (
        <p className="text-gray-400 text-center text-[13px]">Loading faculty...</p>
      ) : facultyError ? (
        <p className="text-red-500 text-center text-[13px]">{facultyError}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {instituteFaculty.length > 0 ? (
            instituteFaculty.map((facultyMember) => {
              const selected = data.faculty.some((f) => f.facultyCode === facultyMember.facultyCode);
              return (
                <button
                  type="button"
                  key={facultyMember.facultyCode}
                  onClick={() => toggleFaculty(facultyMember)}
                  className={`relative flex flex-col items-center p-4 rounded-xl border bg-white transition-all duration-150 text-left ${selected
                    ? "border-emerald-500 shadow-md ring-2 ring-emerald-100"
                    : "border-gray-200 hover:border-emerald-300 hover:shadow-sm"
                    }`}
                >
                  {selected && (
                    <div className="absolute top-2 right-2 p-0.5 bg-emerald-500 rounded-full text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <img
                    src={facultyMember.profileImage?.url || "https://via.placeholder.com/80x80?text=No+Image"}
                    alt={facultyMember.name || "Faculty Member"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                  />
                  <p className="text-center text-[13px] font-semibold mt-2 text-gray-800 leading-tight">
                    {facultyMember.name || "N/A"}
                  </p>
                  <span className="mt-1 text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {facultyMember.facultyCode || "N/A"}
                  </span>
                  {facultyMember.subjects && facultyMember.subjects.length > 0 && (
                    <p className="text-center text-[10px] text-gray-400 mt-1.5 line-clamp-2">
                      {facultyMember.subjects.join(", ")}
                    </p>
                  )}
                  {facultyMember.experience && (
                    <p className="text-center text-[10px] text-gray-400">{facultyMember.experience} experience</p>
                  )}
                </button>
              );
            })
          ) : (
            <p className="text-gray-500 text-center col-span-full">No faculty members found for this institute.</p>
          )}
        </div>
      )}
    </Card>
  );
}

// ── Upload Box with external state control ───────────────────────────────────

function UploadBox({ label, hint, multiple, accept, required, files, onFilesChange, error }) {
  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    onFilesChange(multiple ? (prev) => [...prev, ...selected] : selected);
    // reset input so same file can be re-selected if removed
    e.target.value = "";
  };
  const remove = (i) => onFilesChange((prev) => prev.filter((_, j) => j !== i));

  return (
    <div className="mb-4">
      <Label required={required}>{label}</Label>
      {hint && <p className="text-[11px] text-gray-400 mb-2">{hint}</p>}
      <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${error ? "border-red-300 hover:border-red-400 bg-red-50/30" : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"}`}>
        <Upload className={`w-5 h-5 mb-1 ${error ? "text-red-400" : "text-gray-400"}`} />
        <span className={`text-[12px] ${error ? "text-red-500" : "text-gray-500"}`}>
          Click to upload{multiple ? " (multiple)" : ""}
        </span>
        <input type="file" className="hidden" multiple={multiple} accept={accept} onChange={handleChange} />
      </label>
      {error && <FieldError msg={error} />}
      {files.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-[#f8fafc] px-3 py-2 rounded-lg text-[12px] text-gray-700">
              <span className="truncate">{fileNameFromValue(f)}</span>
              <button type="button" onClick={() => remove(i)} className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step6({ data, setData, fieldErrors, submitted }) {
  const setField = (key) => (updater) =>
    setData((prev) => ({
      ...prev,
      [key]: typeof updater === "function" ? updater(prev[key]) : updater,
    }));

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>Course Thumbnail & Images</SectionTitle>
        <UploadBox
          label="Thumbnail"
          hint="Required · 1280 × 720 px · max 1 MB"
          accept="image/*"
          required
          files={data.thumbnail ? [data.thumbnail] : []}
          onFilesChange={(updater) => {
            const result = typeof updater === "function" ? updater(data.thumbnail ? [data.thumbnail] : []) : updater;
            setData((prev) => ({ ...prev, thumbnail: result[result.length - 1] || null }));
          }}
          error={submitted && fieldErrors.thumbnail}
        />
        <UploadBox
          label="Course Images"
          hint="Required · up to 5 images · max 1 MB each"
          multiple
          accept="image/*"
          required
          files={data.images}
          onFilesChange={setField("images")}
          error={submitted && fieldErrors.images}
        />
      </Card>
      <Card>
        <SectionTitle>Course Video</SectionTitle>
        <UploadBox
          label="Preview Video"
          hint="Optional"
          accept="video/*"
          files={data.previewVideo ? [data.previewVideo] : []}
          onFilesChange={(updater) => {
            const result = typeof updater === "function" ? updater(data.previewVideo ? [data.previewVideo] : []) : updater;
            setData((prev) => ({ ...prev, previewVideo: result[result.length - 1] || null }));
          }}
        />
      </Card>
      <Card>
        <SectionTitle>Institute Supporting Documents</SectionTitle>
        <p className="text-[11px] text-gray-400 mb-3">e.g. Module curriculum, certificates</p>
        <UploadBox
          label="Documents"
          hint="Required · at least one document"
          multiple
          accept=".pdf,.doc,.docx"
          required
          files={data.documents}
          onFilesChange={setField("documents")}
          error={submitted && fieldErrors.documents}
        />
      </Card>
      <Card>
        <SectionTitle>Student Supporting Materials</SectionTitle>
        <p className="text-[11px] text-gray-400 mb-3">PDF files only</p>
        <UploadBox
          label="Materials"
          hint="PDF only"
          multiple
          accept=".pdf"
          files={data.materials}
          onFilesChange={setField("materials")}
          error={submitted && fieldErrors.materials}
        />
      </Card>
    </div>
  );
}

function Step7({ data, setData, fieldErrors, submitted }) {
  const addFaq = () => setData((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));
  const removeFaq = (i) => setData((p) => ({ ...p, faqs: p.faqs.filter((_, j) => j !== i) }));
  const updateFaq = (i, key, val) => setData((p) => ({ ...p, faqs: p.faqs.map((f, j) => j === i ? { ...f, [key]: val } : f) }));

  return (
    <div className="space-y-4">
      {submitted && fieldErrors.faqs && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <FieldError msg={fieldErrors.faqs} />
        </div>
      )}
      {data.faqs.map((faq, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">FAQ {i + 1}</span>
            {data.faqs.length > 1 && (
              <button type="button" onClick={() => removeFaq(i)} className="text-[11px] text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Input
                placeholder="Enter frequently asked question"
                value={faq.question}
                error={submitted && fieldErrors.faqs && !faq.question.trim()}
                onChange={(e) => updateFaq(i, "question", e.target.value)}
              />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                rows={3}
                placeholder="Enter the answer"
                value={faq.answer}
                error={submitted && fieldErrors.faqs && !faq.answer.trim()}
                onChange={(e) => updateFaq(i, "answer", e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}
      <button
        type="button"
        onClick={addFaq}
        className="w-full py-3 border-2 border-dashed border-emerald-200 rounded-2xl text-[13px] font-medium text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add FAQ
      </button>
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────────────────────

export default function CourseCreateForm({ onCancel, editCourseId }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // visitedSteps tracks which steps have actually been visited (user landed on them)
  // submittedSteps tracks which steps had "Next" pressed (validation triggered)
  const [visitedSteps, setVisitedSteps] = useState({ 0: true }); // step 1 visited by default
  const [submittedSteps, setSubmittedSteps] = useState({});

  const [step1, setStep1] = useState({
    code: "", title: "", about: "", duration: "", minQual: "", priorQual: "",
    locations: [], mode: "Onsite", language: "", level: "", difficulty: "",
    certification: "", materials: "", placement: "", accreditation: [],
    status: "", category: "",
    outcomes: ["", "", "", ""], jobs: [""], keywords: "",
  });

  const [step2, setStep2] = useState({
    actualPrice: "", discount: "", currentPrice: "",
    priceBreaks: [{ reason: "", price: "" }],
    expenses: [{ reason: "", amount: "" }],
    scholarships: [""],
    couponCode: { code: "", discountAmount: "" },
  });

  const [step3, setStep3] = useState({
    curriculum: [{ heading: "", duration: "", modules: [{ name: "", description: "" }] }],
  });

  // Plans are pricing/seat tiers on the course (planId/planName/openSeats/duration/price).
  // These are what the Batch Planner's "plan picker" reads when someone schedules an
  // actual batch — distinct from real Batch documents in the batches collection.
  const [step4, setStep4] = useState({
    plans: [],
  });

  const [step5, setStep5] = useState({
    faculty: [],
  });

  // Upload data lives here — step6 reads/writes this
  const [step6, setStep6] = useState({
    thumbnail: null,
    images: [],
    previewVideo: null,
    documents: [],
    materials: [],
  });

  const [step7, setStep7] = useState({
    faqs: [{ question: "", answer: "" }],
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!editCourseId) return;
      try {
        setIsFetching(true);
        const response = await fetch(`${API_BASE_URL}/api/courses/${editCourseId}`, {
          method: "GET",
          headers: authHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch course details");

        const course = data.data?.course || data.data || data.course || data;
        const basicDetails = course.basicDetails || {};
        const courseInformation = basicDetails.courseInformation || course.courseInformation || {};
        const priceDetails = course.priceDetails || {};
        const uploadMaterials =
          course.uploadMaterials ||
          course.upload_materials ||
          course.uploads ||
          course.media ||
          course.courseMedia ||
          {};

        setStep1(prev => ({
          ...prev,
          code: basicDetails.courseCode || course.courseCode || "",
          title: basicDetails.courseTitle || course.courseTitle || course.title || "",
          about: basicDetails.aboutCourse || course.aboutCourse || course.description || "",
          duration: basicDetails.duration || course.duration || "",
          minQual: basicDetails.minimumQualification || course.minimumQualification || "",
          priorQual: basicDetails.priorQualificationNeed || course.priorQualificationNeed || "",
          locations: asArray(basicDetails.locations || course.locations),
          mode: basicDetails.learningMode || course.learningMode || "Onsite",
          language: courseInformation.language || "",
          level: courseInformation.courseLevel || "",
          difficulty: courseInformation.difficulty || "",
          certification: courseInformation.certification || "",
          materials: courseInformation.supportingMaterials || "",
          placement: courseInformation.placementAssistance || "",
          accreditation: asArray(courseInformation.accreditation),
          status: basicDetails.status || course.status || "",
          category: basicDetails.category || course.category || "",
          outcomes: asArray(basicDetails.learningOutcomes || course.learningOutcomes).length
            ? asArray(basicDetails.learningOutcomes || course.learningOutcomes)
            : ["", "", "", ""],
          jobs: asArray(basicDetails.careerPaths || course.careerPaths).length
            ? asArray(basicDetails.careerPaths || course.careerPaths)
            : [""],
          keywords: asArray(basicDetails.keywords || course.keywords).join(", "),
        }));

        setStep2(prev => ({
          ...prev,
          actualPrice: priceDetails.actualPrice ?? "",
          discount: priceDetails.discount ?? "",
          currentPrice: priceDetails.currentPrice ?? "",
          priceBreaks: asArray(priceDetails.priceBreakReasons).length
            ? asArray(priceDetails.priceBreakReasons).map((r) => ({ reason: r.reason || "", price: r.price ?? "" }))
            : [{ reason: "", price: "" }],
          expenses: asArray(priceDetails.courseExpenses).length
            ? asArray(priceDetails.courseExpenses).map((r) => ({ reason: r.reason || "", amount: r.expense ?? r.amount ?? "" }))
            : [{ reason: "", amount: "" }],
          scholarships: asArray(priceDetails.scholarships).length
            ? asArray(priceDetails.scholarships).map((item) => toText(item))
            : [""],
          couponCode: normalizeCouponCode(
            priceDetails.couponCode || priceDetails.coupon || course.couponCode || course.coupon
          ),
        }));

        setStep3(prev => ({
          ...prev,
          curriculum: asArray(course.curriculumDetails).length
            ? asArray(course.curriculumDetails).map((section) => normalizeCurriculumSection(section))
            : [{ heading: "", duration: "", modules: [{ name: "", description: "" }] }],
        }));

        setStep4(prev => ({
          ...prev,
          plans: asArray(course.batchPlan).length
            ? asArray(course.batchPlan).map((plan, i) => normalizePlan(plan, i))
            : [],
        }));

        // course.faculty is persisted as an array of facultyCode strings (see
        // handlePublishCourse below). The full profile (image, subjects, etc.) gets
        // filled in once Step5 loads the institute's faculty list and matches by code.
        setStep5(prev => ({
          ...prev,
          faculty: asArray(course.faculty || course.facultyCodes || course.teacherIds)
            .map((entry) => normalizeFacultyRef(entry))
            .filter((f) => f && f.facultyCode),
        }));

        setStep6({
          thumbnail: normalizeFileRef(
            firstFilled(
              uploadMaterials.thumbnail,
              uploadMaterials.courseThumbnail,
              uploadMaterials.course_thumbnail,
              course.thumbnail,
              course.thumbnailUrl,
              course.thumbnail_url,
              course.courseThumbnail,
              course.courseThumbnailUrl,
              course.coverImage
            ),
            "Existing thumbnail"
          ),
          images: normalizeFileRefs(
            firstFilled(
              uploadMaterials.images,
              uploadMaterials.courseImages,
              uploadMaterials.course_images,
              uploadMaterials.galleryImages,
              course.images,
              course.courseImages,
              course.course_images,
              course.galleryImages,
              course.gallery
            ),
            "Existing image"
          ),
          previewVideo: normalizeFileRef(
            firstFilled(
              uploadMaterials.previewVideo,
              uploadMaterials.preview_video,
              uploadMaterials.video,
              course.previewVideo,
              course.previewVideoUrl,
              course.preview_video,
              course.video,
              course.videoUrl,
              course.courseVideo
            ),
            "Existing video"
          ),
          documents: normalizeFileRefs(
            firstFilled(
              uploadMaterials.documents,
              uploadMaterials.instituteDocuments,
              uploadMaterials.institute_documents,
              uploadMaterials.supportingDocuments,
              course.documents,
              course.instituteDocuments,
              course.supportingDocuments,
              course.moduleCurriculum,
              course.certificates
            ),
            "Existing document"
          ),
          materials: normalizeFileRefs(
            firstFilled(
              uploadMaterials.materials,
              uploadMaterials.studentMaterials,
              uploadMaterials.student_materials,
              uploadMaterials.studentSupportingMaterials,
              course.studentMaterials,
              course.studentSupportingMaterials,
              course.materials,
              course.pdfMaterials
            ),
            "Existing material"
          ),
        });

        setStep7(prev => ({
          ...prev,
          faqs: asArray(course.faqs).length ? asArray(course.faqs) : [{ question: "", answer: "" }],
        }));

      } catch (err) {
        showError(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCourseDetails();
  }, [editCourseId]);

  const allStepData = [step1, step2, step3, step4, step5, step6, step7];

  const getErrors = (idx) => getStepErrors(idx, allStepData);
  const stepComplete = (idx) => isStepComplete(idx, allStepData);

  // Determine the visual state of each step tab
  // Rules:
  // - active: currently on this step
  // - complete (green check): was submitted (Next pressed) AND has no errors
  // - error (red X): was submitted (Next pressed) AND has errors
  //   OR: was skipped (jumped past without visiting — not visited but steps before it were submitted)
  // - neutral: visited but not yet submitted
  //
  // "Skipped" means: user jumped from step A directly to step C (via indicator),
  //   so step B was never visited. We show it as red.
  // When going back, skipped steps that were never submitted become neutral again
  //   (no submitted entry for them).

  const getTabState = (stepId) => {
    const idx = stepId - 1;
    const isActive = step === stepId;
    const wasSubmitted = !!submittedSteps[idx];
    const wasVisited = !!visitedSteps[idx];

    if (isActive) return "active";

    if (wasSubmitted) {
      return stepComplete(idx) ? "complete" : "error";
    }

    // Not submitted. Was it skipped?
    // A step is "skipped" if: it was never visited, but some later step was visited
    // (meaning user jumped over it)
    if (!wasVisited) {
      // Check if any step with higher index was visited
      const anyLaterVisited = Object.keys(visitedSteps).some(
        (k) => Number(k) > idx && visitedSteps[k]
      );
      if (anyLaterVisited) return "error"; // skipped over → show red
    }

    return "neutral";
  };

  const handleIndicatorClick = (targetStepId) => {
    const currentIdx = step - 1;
    const targetIdx = targetStepId - 1;

    if (targetStepId === step) return;

    if (targetStepId > step) {
      // Going FORWARD: mark all skipped steps (current up to target-1) as submitted
      // so they show red if invalid
      const newSubmitted = { ...submittedSteps };
      for (let i = currentIdx; i < targetIdx; i++) {
        newSubmitted[i] = true;
      }
      setSubmittedSteps(newSubmitted);
    } else {
      // Going BACKWARD: remove submitted state for target step and everything after it
      // so they revert to neutral
      const newSubmitted = { ...submittedSteps };
      for (let i = targetIdx; i < STEPS.length; i++) {
        delete newSubmitted[i];
      }
      setSubmittedSteps(newSubmitted);
      // Also clear visited for steps after target so skipped-red logic resets
      const newVisited = { ...visitedSteps };
      for (let i = targetIdx + 1; i < STEPS.length; i++) {
        delete newVisited[i];
      }
      setVisitedSteps(newVisited);
    }

    setVisitedSteps((prev) => ({ ...prev, [targetIdx]: true }));
    setStep(targetStepId);
  };

  const handleNext = () => {
    const currentIdx = step - 1;
    setSubmittedSteps((prev) => ({ ...prev, [currentIdx]: true }));

    const errors = getErrors(currentIdx);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      showError(firstError);
      return;
    }

    const nextStep = step + 1;
    setVisitedSteps((prev) => ({ ...prev, [nextStep - 1]: true }));
    setStep(nextStep);
  };

  const handlePrev = () => {
    const prevStep = Math.max(1, step - 1);
    const prevIdx = prevStep - 1;

    // Remove submitted state for prevStep and everything after it
    setSubmittedSteps((prev) => {
      const next = { ...prev };
      for (let i = prevIdx; i < STEPS.length; i++) delete next[i];
      return next;
    });
    // Clear visited for steps after prevStep so they go neutral
    setVisitedSteps((prev) => {
      const next = { ...prev };
      for (let i = prevIdx + 1; i < STEPS.length; i++) delete next[i];
      return next;
    });

    setStep(prevStep);
  };

  const handlePublishCourse = async (status = "published") => {
    const allSubmitted = {};
    STEPS.forEach((_, idx) => {
      allSubmitted[idx] = true;
    });

    setSubmittedSteps(allSubmitted);

    for (let idx = 0; idx < STEPS.length; idx++) {
      const errors = getErrors(idx);

      if (Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];

        showError(
          `Step ${idx + 1} (${STEPS[idx].label}): ${firstError}`
        );

        setVisitedSteps((prev) => ({
          ...prev,
          [idx]: true,
        }));

        setStep(idx + 1);
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("basicDetails", JSON.stringify({
        courseCode: step1.code,
        courseTitle: step1.title,
        aboutCourse: step1.about,
        duration: step1.duration,
        minimumQualification: step1.minQual,
        priorQualificationNeed: step1.priorQual,
        locations: step1.locations.filter(Boolean),
        learningMode: step1.mode,
        learningOutcomes: step1.outcomes.filter(Boolean),
        status: step1.status,
        category: step1.category,
        courseInformation: {
          language: step1.language,
          courseLevel: step1.level,
          accreditation: step1.accreditation,
          difficulty: step1.difficulty,
          certification: step1.certification,
          supportingMaterials: step1.materials,
          placementAssistance: step1.placement,
        },
        careerPaths: step1.jobs.filter(Boolean),
        keywords: step1.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      }));

      formData.append("priceDetails", JSON.stringify({
        actualPrice: Number(step2.actualPrice || 0),
        discount: Number(step2.discount || 0),
        currentPrice: Number(step2.currentPrice || 0),
        priceBreakReasons: step2.priceBreaks.map((item) => ({
          reason: item.reason,
          price: Number(item.price || 0),
        })),
        courseExpenses: step2.expenses.map((item) => ({
          reason: item.reason,
          expense: Number(item.amount || 0),
        })),
        scholarships: step2.scholarships.filter(Boolean),
        couponCode:
          step2.couponCode?.code && step2.couponCode?.discountAmount
            ? {
              code: String(step2.couponCode.code).trim().toUpperCase(),
              discountAmount: Number(step2.couponCode.discountAmount || 0),
            }
            : null,
      }));

      formData.append("curriculumDetails", JSON.stringify(step3.curriculum));

      // Send the plan tiers as-is; the backend assigns a stable planId to any plan
      // that doesn't already have one (existing plans on an edit keep their planId).
      // Each plan is now sourced from a real batch selected in Step 4, so batchId
      // is included to keep the plan linked back to that batch.
      formData.append("batchPlan", JSON.stringify(
        step4.plans.map((plan) => ({
          planId: plan.planId || undefined,
          batchId: plan.batchId || undefined,
          planName: plan.name,
          openSeats: Number(plan.seats || 0),
          duration: plan.duration,
          price: Number(plan.price || 0),
        }))
      ));

      // Faculty is stored and matched by facultyCode throughout the app.
      formData.append("faculty", JSON.stringify(step5.faculty.map((f) => f.facultyCode)));

      formData.append("faqs", JSON.stringify(step7.faqs));
      formData.append("status", status);

      // ---- files ----
      if (isFileInstance(step6.thumbnail)) {
        formData.append("thumbnail", step6.thumbnail);
      }

      step6.images.forEach((file) => {
        if (isFileInstance(file)) formData.append("images", file);
      });

      if (isFileInstance(step6.previewVideo)) {
        formData.append("video", step6.previewVideo);
      }

      step6.documents.forEach((file) => {
        if (isFileInstance(file)) formData.append("documents", file);
      });

      step6.materials.forEach((file) => {
        if (isFileInstance(file)) formData.append("materials", file);
      });

      const url = editCourseId
        ? `${API_BASE_URL}/api/courses/update/${editCourseId}`
        : `${API_BASE_URL}/api/courses/create`;
      const method = editCourseId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders(),
        // no Content-Type — browser sets multipart boundary automatically
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || (editCourseId ? "Course update failed" : "Course creation failed")
        );
      }
      const statusLabel =
        status === "draft" ? "Draft Course" : status === "archived" ? "Archive Course" : "Publish Course";
      showSuccess(editCourseId ? "Course Updated Successfully" : `${statusLabel} saved successfully`);

      if (onCancel) {
        onCancel();
      } else {
        // Reset Form
        setStep(1);
        setSubmittedSteps({});
        setVisitedSteps({ 0: true });

        setStep1({
          code: "",
          title: "",
          about: "",
          duration: "",
          minQual: "",
          priorQual: "",
          locations: [],
          mode: "Onsite",
          language: "",
          level: "",
          difficulty: "",
          certification: "",
          materials: "",
          placement: "",
          accreditation: [],
          status: "",
          category: "",
          outcomes: ["", "", "", ""],
          jobs: [""],
          keywords: "",
        });

        setStep2({
          actualPrice: "",
          discount: "",
          currentPrice: "",
          priceBreaks: [
            {
              reason: "",
              price: "",
            },
          ],
          expenses: [
            {
              reason: "",
              amount: "",
            },
          ],
          scholarships: [""],
          couponCode: { code: "", discountAmount: "" },
        });

        setStep3({
          curriculum: [
            {
              heading: "",
              duration: "",
              modules: [
                {
                  name: "",
                  description: "",
                },
              ],
            },
          ],
        });

        setStep4({
          plans: [],
        });

        setStep5({
          faculty: [],
        });

        setStep6({
          thumbnail: null,
          images: [],
          previewVideo: null,
          documents: [],
          materials: [],
        });

        setStep7({
          faqs: [
            {
              question: "",
              answer: "",
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
      showError(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const currentIdx = step - 1;
    const fe = submittedSteps[currentIdx] ? getErrors(currentIdx) : {};
    const submitted = !!submittedSteps[currentIdx];

    switch (step) {
      case 1: return <Step1 data={step1} setData={setStep1} fieldErrors={fe} submitted={submitted} />;
      case 2: return <Step2 data={step2} setData={setStep2} fieldErrors={fe} submitted={submitted} />;
      case 3: return <Step3 data={step3} setData={setStep3} fieldErrors={fe} submitted={submitted} />;
      case 4: return <Step4 data={step4} setData={setStep4} fieldErrors={fe} submitted={submitted} />;
      case 5: return <Step5 data={step5} setData={setStep5} fieldErrors={fe} submitted={submitted} />;
      case 6: return <Step6 data={step6} setData={setStep6} fieldErrors={fe} submitted={submitted} />;
      case 7: return <Step7 data={step7} setData={setStep7} fieldErrors={fe} submitted={submitted} />;
      default: return null;
    }
  };

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Courses
          </button>
        )}
        <div>
          <h1 className="text-2xl md:text-4xl font-medium text-gray-800 tracking-tight mb-1">
            {editCourseId ? (
              <>Edit <span className="text-emerald-600">Course</span></>
            ) : (
              <>Create a <span className="text-emerald-600">New Course</span></>
            )}
          </h1>
          <p className="text-gray-500 text-sm">Fill in the details below to publish your course listing.</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max md:min-w-0">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const tabState = getTabState(s.id);

            const baseClass = "flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium transition-all whitespace-nowrap";
            let stateClass = "";

            switch (tabState) {
              case "active":
                stateClass = "bg-emerald-500 text-white shadow-sm";
                break;
              case "complete":
                stateClass = "text-emerald-600 bg-emerald-50";
                break;
              case "error":
                stateClass = "text-red-600 bg-red-50";
                break;
              default: // neutral
                stateClass = "text-gray-500 hover:bg-gray-50";
            }

            const showCheck = tabState === "complete";
            const showX = tabState === "error";
            const showIcon = !showCheck && !showX;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleIndicatorClick(s.id)}
                className={`${baseClass} ${stateClass}`}
              >
                {showCheck ? (
                  <Check className="w-3.5 h-3.5" />
                ) : showX ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-[12px] text-gray-400 font-medium">
          Step {step} of {STEPS.length}
        </span>

        {step < STEPS.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] font-medium hover:bg-emerald-600 transition-all shadow-sm active:scale-95"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handlePublishCourse("draft")}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 transition-all shadow-sm ${loading ? "cursor-not-allowed opacity-70" : "bg-white hover:bg-gray-50 active:scale-95"
                }`}
            >
              <FileText className="w-4 h-4" />
              Draft Course
            </button>
            <button
              type="button"
              onClick={() => handlePublishCourse("archived")}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-200 text-[13px] font-medium text-amber-700 transition-all shadow-sm ${loading ? "cursor-not-allowed opacity-70" : "bg-amber-50 hover:bg-amber-100 active:scale-95"
                }`}
            >
              <Archive className="w-4 h-4" />
              Archive Course
            </button>
            <button
              type="button"
              onClick={() => handlePublishCourse("published")}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-[13px] font-medium transition-all shadow-sm ${loading ? "bg-emerald-500 cursor-not-allowed opacity-70" : "bg-emerald-500 hover:bg-emerald-600 active:scale-95"
                }`}
            >
              <Check className="w-4 h-4" />
              {editCourseId ? "Update Course" : "Publish Course"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}