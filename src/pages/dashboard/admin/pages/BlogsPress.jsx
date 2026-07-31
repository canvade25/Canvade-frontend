import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FileText,
  Eye,
  MousePointer,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Edit2,
  Send,
  Archive,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import api from "../../../../../api/axios";
import { useMyPlan } from "../../../../hooks/useMyPlan";
import { showError } from "../../../../utils/toast";

const STAT_CARDS = [
  {
    key: "totalPosts",
    label: "Total Post",
    icon: FileText,
    wrapperBg: "bg-emerald-50 text-emerald-600 border-emerald-100/30",
  },
  {
    key: "totalViews",
    label: "Total Views",
    icon: Eye,
    wrapperBg: "bg-blue-50 text-blue-600 border-blue-100/30",
  },
  {
    key: "totalClicks",
    label: "Clicks to Courses",
    icon: MousePointer,
    wrapperBg: "bg-purple-50 text-purple-600 border-purple-100/30",
  },
];

const PAGE_SIZE_OPTIONS = [4, 10, 20, 50];

// Windowed page numbers with "…" gaps, e.g. [1, "…", 4, 5, 6, "…", 12].
const getPaginationRange = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const range = new Set([1, total, current, current - 1, current + 1]);
  const sorted = Array.from(range)
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const withGaps = [];
  sorted.forEach((page, idx) => {
    if (idx > 0 && page - sorted[idx - 1] > 1) {
      withGaps.push("…");
    }
    withGaps.push(page);
  });

  return withGaps;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&q=60";

// Canonical status values used everywhere in this file: "publish" | "draft" | "archived"
const STATUS_TABS = [
  { value: "publish", label: "Published", icon: CheckCircle },
  { value: "draft", label: "Draft", icon: FileText },
  { value: "archived", label: "Archived", icon: Archive },
];

const STATUS_BADGE_CLASSES = {
  publish: "bg-emerald-100 text-emerald-700 border border-emerald-100/30",
  draft: "bg-slate-100 text-slate-500 border border-slate-200/40",
  archived: "bg-amber-100 text-amber-600 border border-amber-100/30",
};

const STATUS_LABELS = {
  publish: "Published",
  draft: "Draft",
  archived: "Archived",
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-4 pl-1 pr-4">
      <div className="flex flex-row items-start gap-3">
        <div className="w-26 h-16 rounded-xl bg-slate-100 shrink-0" />
        <div className="min-w-0 flex-1 flex flex-col gap-2 pt-1">
          <div className="h-3.5 w-2/3 rounded bg-slate-100" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    </td>
    <td className="py-4">
      <div className="h-5 w-16 rounded-md bg-slate-100" />
    </td>
    <td className="py-4">
      <div className="h-5 w-16 rounded-md bg-slate-100" />
    </td>
    <td className="py-4">
      <div className="h-3.5 w-20 rounded bg-slate-100" />
    </td>
    <td className="py-4">
      <div className="h-3.5 w-10 rounded bg-slate-100" />
    </td>
    <td className="py-4">
      <div className="flex items-center justify-center gap-2">
        <div className="w-8 h-8 rounded-md bg-slate-100" />
        <div className="w-8 h-8 rounded-md bg-slate-100" />
        <div className="w-8 h-8 rounded-md bg-slate-100" />
        <div className="w-8 h-8 rounded-md bg-slate-100" />
      </div>
    </td>
  </tr>
);

const TableImageSkeleton = () => (
  <div className="w-26 h-16 rounded-xl bg-slate-100 shrink-0 animate-pulse" />
);

const splitList = (value) =>
  String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

// --- API helpers ----------------------------------------------------------
// Endpoints confirmed by you:
//   GET    /api/updates/                  -> list
//   GET    /api/updates/:updateId         -> single record (used to populate edit form)
//   POST   /api/updates/create            -> create
//   PUT    /api/updates/status/:updateId  -> { status } only
//   DELETE /api/updates/destroy/:updateId -> delete
// NOT given: an endpoint to save a full edit (title/description/etc). I'm
// guessing PUT /api/updates/update/:updateId to match your naming pattern —
// please confirm/replace this if it's different.
const fetchUpdateById = (updateId) => api.get(`/api/updates/${updateId}`);
const updateStatus = (updateId, status) =>
  api.put(`/api/updates/status/${updateId}`, { status });
const deleteUpdate = (updateId) => api.delete(`/api/updates/destroy/${updateId}`);
const saveFullUpdate = (updateId, payload) =>
  api.put(`/api/updates/update/${updateId}`, payload); // <-- guessed route, please confirm
const fetchUpdatesStats = () => api.get("/api/updates/stats");

// --- Response mapping helpers ----------------------------------------------

const mapStatus = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "publish" || s === "published") return "publish";
  if (s === "archived") return "archived";
  return "draft";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Maps a raw API record (see /api/updates/ response) into the row shape
// the table renders. "Publish on" always reflects createdAt from the DB,
// regardless of current status.
const mapUpdateToPost = (item) => ({
  id: item.updateId,
  title: item.title || "Untitled update",
  description: item.description || "",
  type: item.tag || "News",
  status: mapStatus(item.status),
  date: formatDate(item.createdAt),
  views: item.views != null ? String(item.views) : "-",
  image:
    item.thumbnail ||
    (Array.isArray(item.images) && item.images[0]) ||
    FALLBACK_IMAGE,
});

// Maps a single-record API response into the UpdateForm's field shape.
const mapUpdateToFormValues = (item) => ({
  title: item.title || "",
  description: item.description || "",
  tag: item.tag || "Event",
  link: item.link || "",
  keywords: Array.isArray(item.keywords) ? item.keywords.join(", ") : item.keywords || "",
  relatedCourse: item.relatedCourse || "",
  status: mapStatus(item.status),
});

const UpdateForm = ({
  onCancel,
  onCreated,
  updateId = null,
  initialValues = null,
  isLoadingInitialValues = false,
}) => {
  const isEditMode = Boolean(updateId);

  const [form, setForm] = useState(
    initialValues || {
      title: "",
      description: "",
      tag: "Event",
      link: "",
      keywords: "",
      relatedCourse: "",
    },
  );
  const [files, setFiles] = useState({ thumbnail: null, images: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState(null);
  const [error, setError] = useState("");

  // Populate the form once the edit-mode fetch resolves.
  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleFileChange = (field) => (event) => {
    const { files: inputFiles } = event.target;

    if (field === "thumbnail") {
      setFiles((current) => ({ ...current, thumbnail: inputFiles?.[0] || null }));
      return;
    }

    setFiles((current) => ({
      ...current,
      images: Array.from(inputFiles || []).slice(0, 3),
    }));
  };

  const submitUpdate = async (status) => {
    setIsSubmitting(true);
    setSubmittingStatus(status);
    setError("");

    try {
      const now = new Date().toISOString();
      const payload = new FormData();

      if (!isEditMode) {
        payload.append("updateId", `UPDATE_${Date.now()}`);
        payload.append("createdAt", now);
      }

      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("tag", form.tag);
      payload.append("link", form.link.trim());
      payload.append("keywords", splitList(form.keywords).join(","));
      payload.append("relatedCourse", form.relatedCourse.trim());
      payload.append("status", status);
      payload.append("isDeleted", "false");
      payload.append("deletedAt", "");
      payload.append("updatedAt", now);

      if (files.thumbnail) {
        payload.append("thumbnail", files.thumbnail);
      }

      files.images.forEach((file) => {
        payload.append("images", file);
      });

      if (isEditMode) {
        await saveFullUpdate(updateId, payload);
      } else {
        await api.post("/api/updates/create", payload);
      }

      if (typeof onCreated === "function") {
        onCreated();
      }
    } catch (submitError) {
      console.error("Save update error:", submitError);
      setError(
        submitError?.response?.data?.message ||
          "Unable to save update. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      setSubmittingStatus(null);
    }
  };

  if (isLoadingInitialValues) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 shadow-sm flex items-center justify-center gap-2 text-slate-400 text-[13px] font-semibold">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading update...
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-[15px] font-bold text-slate-900">
        {isEditMode ? "Edit Update" : "Create a Update"}
      </h2>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-[12px] font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-[12px] font-semibold text-slate-600">
          Upload thumbnail
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange("thumbnail")}
            className="mt-2 block w-full text-[12px]"
          />
        </label>
        <label className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-[12px] font-semibold text-slate-600">
          Max 3 images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange("images")}
            className="mt-2 block w-full text-[12px]"
          />
        </label>
        <input
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          placeholder="Title"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-emerald-300"
        />
        <textarea
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Description"
          rows={4}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-emerald-300 md:col-span-2 xl:col-span-3"
        />
        <label className="grid gap-1">
          <span className="px-1 text-[12px] font-semibold text-slate-600">
            Tag
          </span>
          <select
            value={form.tag}
            onChange={handleChange("tag")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 outline-none focus:border-emerald-300"
          >
            <option>Press Release</option>
            <option>Institutional Update</option>
            <option>Partnership</option>
            <option>Event</option>
            <option>News</option>
          </select>
        </label>
        <input
          type="text"
          value={form.link}
          onChange={handleChange("link")}
          placeholder="Link"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-emerald-300"
        />
        <input
          type="text"
          value={form.keywords}
          onChange={handleChange("keywords")}
          placeholder="Keywords separated by commas"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-emerald-300"
        />
        <input
          type="text"
          value={form.relatedCourse}
          onChange={handleChange("relatedCourse")}
          placeholder="Related course ID"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-emerald-300"
        />
        <div className="flex flex-col justify-end gap-3 md:col-span-2 md:flex-row xl:col-span-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => submitUpdate("draft")}
            disabled={isSubmitting}
            className="rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submittingStatus === "draft" ? "Saving..." : "Draft Update"}
          </button>
          <button
            type="button"
            onClick={() => submitUpdate("publish")}
            disabled={isSubmitting}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submittingStatus === "publish" ? "Publishing..." : "Publish Update"}
          </button>
        </div>
      </div>
    </form>
  );
};

export const CreateUpdatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [initialValues, setInitialValues] = useState(null);
  const [isLoadingInitialValues, setIsLoadingInitialValues] = useState(Boolean(editId));
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!editId) {
      setInitialValues(null);
      setIsLoadingInitialValues(false);
      return;
    }

    let isCancelled = false;

    (async () => {
      setIsLoadingInitialValues(true);
      setLoadError("");
      try {
        const { data } = await fetchUpdateById(editId);
        const record = data?.data || data;
        if (!isCancelled) {
          setInitialValues(mapUpdateToFormValues(record));
        }
      } catch (fetchError) {
        console.error("Fetch update by id error:", fetchError);
        if (!isCancelled) {
          setLoadError(
            fetchError?.response?.data?.message ||
              "Unable to load this update. Please try again.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingInitialValues(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [editId]);

  const handleCreated = () => {
    navigate("/admin/dashboard/blogs");
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard/blogs")}
          className="w-fit text-[12px] font-bold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          Back to Updates
        </button>
        <h1 className="ds-page-title">
          {editId ? "Edit Update" : "Create Update"}
        </h1>
        <p className="ds-page-subtitle">
          Add institute updates, announcements, news and press releases.
        </p>
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">
          {loadError}
        </div>
      ) : (
        <UpdateForm
          onCancel={() => navigate("/admin/dashboard/blogs")}
          onCreated={handleCreated}
          updateId={editId}
          initialValues={initialValues}
          isLoadingInitialValues={isLoadingInitialValues}
        />
      )}
    </div>
  );
};

export default function BlogsPressDashboard() {
  const navigate = useNavigate();
  const { plan } = useMyPlan();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, totalClicks: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState("publish");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [pendingActionId, setPendingActionId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  const fetchUpdates = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get("/api/updates/");
      // API shape: { success, total, data: [...] } — also tolerate a bare array.
      const list = Array.isArray(data) ? data : data?.data || [];
      setPosts(list.map(mapUpdateToPost));
    } catch (fetchError) {
      console.error("Fetch updates error:", fetchError);
      setLoadError(
        fetchError?.response?.data?.message ||
          "Unable to load updates. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const { data } = await fetchUpdatesStats();
      const record = data?.data || data || {};
      setStats({
        totalPosts: record.totalPosts || 0,
        totalViews: record.totalViews || 0,
        totalClicks: record.totalClicks || 0,
      });
    } catch (statsError) {
      console.error("Fetch updates stats error:", statsError);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
    fetchStats();
  }, [fetchUpdates, fetchStats]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTab = post.status === activeTab;

      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, posts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));

  // Keep currentPage in range whenever the filtered set or page size shrinks it out of bounds.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  const handleSharePost = async (post) => {
    const shareUrl = `${window.location.origin}/updates/${post.id}`;
    const shareText = `${post.title}\n${post.description}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
    } catch {
      // User cancelled native share or clipboard is unavailable.
    }
  };

  const handleStatusAction = async (post) => {
    const nextStatus = post.status === "publish" ? "archived" : "publish";
    setActionError("");
    setPendingActionId(post.id);

    // Optimistic update, rolled back on failure.
    const previousPosts = posts;
    setPosts((currentPosts) =>
      currentPosts.map((item) =>
        item.id === post.id ? { ...item, status: nextStatus } : item,
      ),
    );

    try {
      await updateStatus(post.id, nextStatus);
    } catch (statusError) {
      console.error("Update status error:", statusError);
      setPosts(previousPosts);
      setActionError(
        statusError?.response?.data?.message ||
          "Unable to update status. Please try again.",
      );
    } finally {
      setPendingActionId(null);
    }
  };

  const performDeletePost = async (post) => {
    const postId = post.id;
    setActionError("");
    setPendingActionId(postId);

    const previousPosts = posts;
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));

    try {
      await deleteUpdate(postId);
      fetchStats();
    } catch (deleteError) {
      console.error("Delete update error:", deleteError);
      setPosts(previousPosts);
      setActionError(
        deleteError?.response?.data?.message ||
          "Unable to delete this post. Please try again.",
      );
    } finally {
      setPendingActionId(null);
    }
  };

  const handleDeletePost = (post) => {
    setDeleteCandidate(post);
  };

  const closeDeleteModal = () => {
    setDeleteCandidate(null);
  };

  const confirmDeletePost = async () => {
    if (!deleteCandidate) {
      return;
    }

    await performDeletePost(deleteCandidate);
    setDeleteCandidate(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col gap-5 select-none text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 shrink-0">
        <div>
          <h1 className="ds-page-title">
            Updates
          </h1>
          <p className="ds-page-subtitle">
            Manage institute updates, announcements, news and press releases.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (
              plan?.tier === "free" &&
              plan?.usage?.updatesThisMonth >= plan?.limits?.updatesPerMonth
            ) {
              showError(
                `You've reached the Free plan's ${plan.limits.updatesPerMonth}-updates-per-month limit. Upgrade to Pro for up to 20/month.`,
              );
              navigate("/admin/dashboard/promotions");
              return;
            }
            navigate("/admin/dashboard/blogs/create");
          }}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" strokeWidth={2.75} />
          Create a Update
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full shrink-0">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className="bg-white border border-slate-100/80 p-4 rounded-2xl shadow-3xs flex flex-row items-start gap-4"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border border-slate-100/40 ${s.wrapperBg}`}
              >
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="ds-card-label block tracking-tight">
                  {s.label}
                </span>
                <div className="mt-1">
                  {isLoadingStats ? (
                    <div className="h-6 w-16 rounded-md bg-slate-100 animate-pulse" />
                  ) : (
                    <p className="ds-stat-value">
                      {stats[s.key].toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex flex-col justify-between mt-1">
        <div>
          {actionError ? (
            <div className="mb-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-[12px] font-semibold text-rose-700">
              {actionError}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 pb-4 mb-1">
            <div className="max-w-full overflow-x-auto pb-0.5">
              <div className="flex items-center bg-white border-2 border-slate-200/50 rounded-md text-[12px] font-bold text-slate-600 shadow-3xs overflow-hidden w-fit">
                {STATUS_TABS.map((tab, idx, arr) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.value);
                        setCurrentPage(1);
                      }}
                      className={`px-5 py-2 whitespace-nowrap transition-all cursor-pointer flex items-center justify-center text-slate-700 font-bold h-full ${
                        isActive
                          ? "bg-emerald-50/60 text-emerald-700"
                          : "hover:text-slate-900 bg-white"
                      } ${idx !== arr.length - 1 ? "border-r border-slate-200/50" : ""} ${
                        idx === 0
                          ? "rounded-l-xl"
                          : idx === arr.length - 1
                            ? "rounded-r-xl"
                            : ""
                      }`}
                    >
                      <TabIcon className="mr-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap shrink-0">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border-2 border-slate-200/50 bg-white rounded-md text-[12px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 shadow-3xs transition-all"
                />
              </div>

              <button
                type="button"
                className="flex items-center gap-2 border-2 border-slate-200/50 rounded-md px-3.5 py-2 text-[12px] font-semibold text-slate-600 bg-white shadow-3xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                <span>Latest</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto text-[13px] font-medium text-slate-500">
              <thead className="bg-gray-100">
                <tr className="text-left text-[11px]  font-bold text-slate-600 tracking-wider border-b border-slate-100/60">
                  <th className="py-2.5 font-semibold pl-1 w-[45%]">Post</th>
                  <th className="py-2.5 font-semibold w-[12%]">Tag</th>
                  <th className="py-2.5 font-semibold w-[12%]">Status</th>
                  <th className="py-2.5 font-semibold w-[13%]">Publish on</th>
                  <th className="py-2.5 font-semibold w-[10%]">Views</th>
                  <th className="py-2.5 text-center font-semibold w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100/60">
                {isLoading ? (
                  Array.from({ length: pageSize }, (_, i) => <SkeletonRow key={i} />)
                ) : loadError ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-rose-500 text-xs font-semibold">
                      {loadError}{" "}
                      <button
                        type="button"
                        onClick={fetchUpdates}
                        className="underline font-bold"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : filteredPosts.length > 0 ? (
                  paginatedPosts.map((post) => {
                    const isPending = pendingActionId === post.id;
                    return (
                      <tr
                        key={post.id}
                        className="hover:bg-slate-50/30 transition-colors group"
                      >
                        <td className="py-4 pl-1 pr-4">
                          <a
                            href={`/updates/${post.id}`}
                            title="View live update page"
                            className="flex flex-row items-start gap-3"
                          >
                            {loadedImages[post.id] ? (
                              <img
                                src={post.image}
                                className="w-26 h-16 rounded-xl object-cover border border-slate-200/50 bg-slate-50 shrink-0 shadow-3xs"
                                alt=""
                                loading="lazy"
                              />
                            ) : (
                              <TableImageSkeleton />
                            )}
                            <img
                              src={post.image}
                              alt=""
                              loading="lazy"
                              onLoad={() => setLoadedImages((prev) => ({ ...prev, [post.id]: true }))}
                              onError={() => setLoadedImages((prev) => ({ ...prev, [post.id]: true }))}
                              className="hidden"
                            />
                            <div className="min-w-0 flex flex-col space-y-2">
                              <h4 className="text-[13.5px] font-bold text-slate-800 leading-tight truncate group-hover:text-blue-600 transition-colors">
                                {post.title}
                              </h4>
                              <p className="text-[11.5px] text-slate-600 font-normal leading-normal line-clamp-2 pr-2">
                                {post.description}
                              </p>
                            </div>
                          </a>
                        </td>

                        <td className="py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide border ${
                              post.type === "Blog"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-100/30"
                                : "bg-purple-100 text-purple-700 border-purple-100/30"
                            }`}
                          >
                            {post.type}
                          </span>
                        </td>

                        <td className="py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide ${
                              STATUS_BADGE_CLASSES[post.status] || STATUS_BADGE_CLASSES.draft
                            }`}
                          >
                            {STATUS_LABELS[post.status] || post.status}
                          </span>
                        </td>

                        <td className="py-4 text-slate-600 font-medium whitespace-nowrap">
                          {post.date}
                        </td>

                        <td className="py-4 text-slate-700 font-semibold whitespace-nowrap">
                          {post.views}
                        </td>

                        <td className="py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              title="Edit Post"
                              onClick={() => navigate(`/admin/dashboard/blogs/create?edit=${post.id}`)}
                              disabled={isPending}
                              className="w-8 h-8 text-slate-400 hover:text-slate-600 border-2 border-slate-200/60 rounded-md bg-white shadow-3xs hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Edit2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              title="Share Post"
                              onClick={() => void handleSharePost(post)}
                              disabled={isPending}
                              className="w-8 h-8 text-slate-400 hover:text-slate-600 border-2 border-slate-200/60 rounded-md bg-white shadow-3xs hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              title={post.status === "publish" ? "Archive" : "Publish"}
                              onClick={() => handleStatusAction(post)}
                              disabled={isPending}
                              className="w-8 h-8 text-slate-400 hover:text-slate-600 border-2 border-slate-200/60 rounded-md bg-white shadow-3xs hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : post.status === "publish" ? (
                                <Archive className="w-3.5 h-3.5" strokeWidth={2.5} />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                              )}
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => handleDeletePost(post)}
                              disabled={isPending}
                              className="w-8 h-8 text-rose-400 hover:text-rose-600 border-2 border-slate-200/60 rounded-md bg-white shadow-3xs hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-slate-400 font-medium text-xs"
                    >
                      {searchQuery
                        ? "No posts match your search."
                        : `No ${STATUS_LABELS[activeTab] || "matching"} updates yet.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full border-t border-slate-100/80 mt-2 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] font-semibold text-slate-500">
          <span>
            {filteredPosts.length === 0
              ? `Showing 0 of ${filteredPosts.length} posts`
              : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredPosts.length)} of ${filteredPosts.length} posts`}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 border border-slate-200 rounded-lg flex items-center justify-center bg-white hover:bg-slate-50 disabled:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {getPaginationRange(currentPage, totalPages).map((page, idx) =>
              page === "…" ? (
                <span key={`gap-${idx}`} className="px-1 text-slate-300">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${currentPage === page ? "bg-[#00875a] text-white" : "border border-slate-200 hover:bg-slate-50"}`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 border border-slate-200 rounded-lg flex items-center justify-center bg-white hover:bg-slate-50 disabled:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1 bg-white shadow-3xs">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none bg-transparent pr-4 text-[12px] font-semibold text-slate-500 outline-none cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 pointer-events-none absolute right-2" />
          </div>
        </div>
      </div>

      {deleteCandidate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-[16px] font-bold text-slate-900">Delete Update</h3>
            <p className="mt-2 text-[13px] text-slate-600">
              Are you sure you want to delete
              <span className="font-semibold text-slate-800"> {deleteCandidate.title}</span>?
              This action cannot be undone.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={pendingActionId === deleteCandidate.id}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                disabled={pendingActionId === deleteCandidate.id}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {pendingActionId === deleteCandidate.id ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}