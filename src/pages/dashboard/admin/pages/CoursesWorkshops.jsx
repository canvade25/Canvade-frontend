import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyPlan } from "../../../../hooks/useMyPlan";
import {
  BookOpen,
  Users,
  Search,
  Plus,
  Pencil,
  ArchiveIcon,
  History,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";

import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../utils/toast";
import CourseCreateForm from "../../../../components/Coursecreateform";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

const typeStyle = {
  Course: "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

const statusStyle = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-amber-50 text-amber-600",
  Archived: "bg-slate-100 text-slate-600",
};

const getActionButtons = (status) => {
  if (status === "Active")
    return ["Edit Seats", "Edit Details", "Archive", "History", "Delete"];
  if (status === "Inactive")
    return ["Edit Seats", "Edit Details", "Activate", "History", "Delete"];
  if (status === "Archived")
    return ["Edit Seats", "Edit Details", "Unarchive", "History", "Delete"];
  return ["Edit Seats", "Edit Details", "Archive", "History", "Delete"];
};

const actionIcons = {
  "Edit Seats": <Users className="w-4 h-4" />,
  "Edit Details": <Pencil className="w-4 h-4" />,
  Archive: <ArchiveIcon className="w-4 h-4" />,
  Unarchive: <ArchiveIcon className="w-4 h-4" />,
  Activate: <BookOpen className="w-4 h-4" />,
  History: <History className="w-4 h-4" />,
  Delete: <Trash className="w-4 h-4" />,
};

// Maps the button label a user clicks to the status value the API expects
const STATUS_ACTION_MAP = {
  Archive: "archived",
  Activate: "active",
  Unarchive: "active",
};

const STATUS_SUCCESS_MESSAGE = {
  Archive: "Course archived successfully",
  Activate: "Course activated successfully",
  Unarchive: "Course unarchived successfully",
};

// Normalize API status to display status
const getNormalizedStatus = (status) => {
  const s = (status || "").toLowerCase();
  if (["active", "published"].includes(s)) return "Active";
  if (["inactive", "draft"].includes(s)) return "Inactive";
  if (["archived"].includes(s)) return "Archived";
  return "Inactive";
};

const getCourseRecordId = (course) =>
  course?._id ||
  course?.id ||
  course?.courseId ||
  course?.courseID ||
  course?.basicDetails?._id ||
  course?.basicDetails?.id;

const getAuthToken = () =>
  localStorage.getItem("token") || localStorage.getItem("Token");

// PATCH /api/courses/seats/:id  { seats }
const updateCourseSeats = async (courseId, seats) => {
  const token = getAuthToken();
  const response = await fetch(
    `${API_BASE_URL}/api/courses/seats/${courseId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seats: String(seats) }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update seats");
  }
  return data;
};

// PATCH /api/courses/status/:id  { status }
const updateCourseStatus = async (courseId, status) => {
  const token = getAuthToken();
  const response = await fetch(
    `${API_BASE_URL}/api/courses/status/${courseId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update status");
  }
  return data;
};

const CoursesAndWorkshops = () => {
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-2xl bg-slate-200 shrink-0"></div>
          <div>
            <div className="h-5 bg-slate-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="h-6 bg-slate-200 rounded-lg w-20 mx-auto"></div>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="h-5 bg-slate-200 rounded w-16 mx-auto"></div>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="h-5 bg-slate-200 rounded w-12 mx-auto mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="h-6 bg-slate-200 rounded-lg w-20 mx-auto"></div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-0.5">
          <div className="w-10 h-16 rounded-lg bg-slate-200"></div>
        </div>
      </td>
    </tr>
  );
  const navigate = useNavigate();
  const { plan } = useMyPlan();
  const [activeTab, setActiveTab] = useState("Active"); // draft comes as Inactive
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Edit Seats modal state
  const [seatsModal, setSeatsModal] = useState({
    open: false,
    course: null,
    value: "",
    submitting: false,
  });

  // Tracks which course's status PATCH is in-flight (disables its action buttons)
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const token = getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/api/courses/my-courses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Courses API:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      // Support both data.data and data.courses
      setCourses(data.data || data.courses || []);
    } catch (error) {
      console.error(error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const openSeatsModal = (course) => {
    const currentSeats = course?.batchPlan?.[0]?.openSeats ?? "";
    setSeatsModal({
      open: true,
      course,
      value: currentSeats === "" ? "" : String(currentSeats),
      submitting: false,
    });
  };

  const closeSeatsModal = () => {
    if (seatsModal.submitting) return;
    setSeatsModal({ open: false, course: null, value: "", submitting: false });
  };

  const handleSeatsSave = async () => {
    const courseId = getCourseRecordId(seatsModal.course);
    if (!courseId) {
      showError("Course id not found for this course.");
      return;
    }

    const seatsNum = Number(seatsModal.value);
    if (seatsModal.value.trim() === "" || isNaN(seatsNum) || seatsNum < 0) {
      showError("Enter a valid number of seats.");
      return;
    }

    try {
      setSeatsModal((prev) => ({ ...prev, submitting: true }));
      await updateCourseSeats(courseId, seatsNum);
      showSuccess("Seats updated successfully");
      setSeatsModal({ open: false, course: null, value: "", submitting: false });
      fetchCourses();
    } catch (error) {
      console.error(error);
      showError(error.message || "Failed to update seats");
      setSeatsModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleStatusAction = async (action, course) => {
    const courseId = getCourseRecordId(course);
    if (!courseId) {
      showError("Course id not found for this course.");
      return;
    }

    const newStatus = STATUS_ACTION_MAP[action];
    if (!newStatus) return;

    try {
      setStatusUpdatingId(courseId);
      await updateCourseStatus(courseId, newStatus);
      showSuccess(STATUS_SUCCESS_MESSAGE[action] || "Status updated successfully");
      await fetchCourses();
    } catch (error) {
      console.error(error);
      showError(error.message || `Failed to ${action.toLowerCase()} course`);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDeleteCourse = async (course) => {
    const batchId = course?.batchPlan?.[0]?._id;
    if (!batchId) {
      showError("Batch ID not found for this course.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this batch?")) {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${API_BASE_URL}/api/batches/delete/${batchId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to delete batch");
        }

        showSuccess("Batch deleted successfully");
        fetchCourses();
      } catch (error) {
        console.error(error);
        showError(error.message || "Failed to delete batch");
      }
    }
  };

  const handleActionClick = (action, course) => {
    if (action === "Edit Details") {
      const courseId = getCourseRecordId(course);
      if (!courseId) {
        showError("Course id not found for edit.");
        return;
      }
      setEditingCourseId(courseId);
      setIsCreating(true);
    } else if (action === "Edit Seats") {
      openSeatsModal(course);
    } else if (action === "Delete") {
      handleDeleteCourse(course);
    } else if (STATUS_ACTION_MAP[action]) {
      handleStatusAction(action, course);
    } else {
      showInfo(`${action} clicked for ${course?.basicDetails?.courseTitle || 'course'}`);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const tabs = [
    {
      label: "Active",
      count: courses.filter((c) => getNormalizedStatus(c.status) === "Active")
        .length,
    },
    {
      label: "Inactive",
      count: courses.filter((c) => getNormalizedStatus(c.status) === "Inactive")
        .length,
    },
    {
      label: "Archived",
      count: courses.filter((c) => getNormalizedStatus(c.status) === "Archived")
        .length,
    },
  ];

  const filtered = courses.filter((c) => {
    const normalizedStatus = getNormalizedStatus(c.status);
    const matchTab = normalizedStatus === activeTab;

    const matchSearch =
      (c?.basicDetails?.courseTitle || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (c?.basicDetails?.courseCode || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  if (isCreating) {
    return (
      <CourseCreateForm
        editCourseId={editingCourseId}
        onCancel={() => {
          setIsCreating(false);
          setEditingCourseId(null);
          fetchCourses();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 px-4 ">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Courses
          </h1>
          <p className="text-sm text-[#2e5c42] font-medium mt-0.5">
            Create, manage and organize all your courses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (
              plan?.tier === "free" &&
              plan?.limits?.courses != null &&
              plan?.usage?.courses >= plan.limits.courses
            ) {
              showError(
                `You've reached the Free plan's ${plan.limits.courses}-course limit. Upgrade to Pro for unlimited courses.`,
              );
              navigate("/admin/dashboard/promotions");
              return;
            }
            setEditingCourseId(null);
            setIsCreating(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0ea271] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Course
        </button>
      </div>

      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 py-4 gap-4 w-full select-none">
          <div className="flex flex-row items-center gap-2.5 flex-wrap">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveTab(tab.label);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-lg text-xs font-bold border transition-all ${
                    isSelected
                      ? "bg-[#eefbf7] border-[#b2ddce] text-[#00875a] shadow-sm"
                      : "bg-white border-slate-200/70 text-slate-500 hover:bg-slate-50/80"
                  }`}
                >
                  <span>{tab.label}</span>

                  <span
                    className={`w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-[#00875a] text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-row items-center gap-2.5 w-full sm:w-auto flex-wrap">
            <div className="relative w-full sm:w-56 lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search courses..."
                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto space-y-4 pb-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-center text-xs font-semibold text-slate-700 px-4 py-3">
                  Course
                </th>
                <th className="text-center text-xs font-semibold text-slate-700 px-5 py-3">
                  Type
                </th>
                <th className="text-center text-xs font-semibold text-slate-700 px-5 py-3">
                  Duration
                </th>
                <th className="text-center text-xs font-semibold text-slate-700 px-5 py-3">
                  Seats
                </th>
                <th className="text-center text-xs font-semibold text-slate-700 px-5 py-3">
                  Status
                </th>
                <th className="text-center text-xs font-semibold text-slate-700 px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                paginated.map((c) => {
                  const normalizedStatus = getNormalizedStatus(c.status);
                  const courseId = getCourseRecordId(c);
                  return (
                    <tr
                      key={courseId || c?.basicDetails?.courseCode}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                            {c?.uploadMaterials?.thumbnail ? (
                              <img
                                src={c.uploadMaterials.thumbnail}
                                alt={c?.basicDetails?.courseTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";

                                  const fallback =
                                    e.target.parentElement.querySelector(
                                      ".image-fallback",
                                    );

                                  if (fallback) {
                                    fallback.classList.remove("hidden");
                                  }
                                }}
                              />
                            ) : null}

                            <div
                              className={`image-fallback absolute inset-0 flex flex-col items-center justify-center bg-slate-100 ${
                                c?.uploadMaterials?.thumbnail ? "hidden" : ""
                              }`}
                            >
                              <img
                                src="/dummy-course-image.jpg"
                                alt="Course Placeholder"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-[20px] font-semibold text-slate-900">
                              {c?.basicDetails?.courseTitle}
                            </h3>

                            <p className="text-[14px] text-slate-500 mt-2">
                              ID: {c?.basicDetails?.courseCode}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${typeStyle["Course"]}`}
                        >
                          Course
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[14px] text-gray-700">
                        <div className="text-[16px] text-slate-700 font-medium">
                          {c?.basicDetails?.duration}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[18px] font-bold text-slate-900">
                          {c?.batchPlan?.[0]?.openSeats  || 0}
                        </p>

                        <p className="text-[14px] text-emerald-600 font-semibold">
                          ({c?.batchPlan?.[0]?.openSeats - c?.totalStudents   || 0} left)
                        </p>
                        <p
                          className={`text-xs font-medium ${c.seatsLeftColor}`}
                        >
                          {c.seatsLeft}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-lg ${statusStyle[normalizedStatus]}`}
                        >
                          {normalizedStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-0.5">
                          {getActionButtons(normalizedStatus).map((action) => {
                            const isStatusAction = !!STATUS_ACTION_MAP[action];
                            const isDisabled =
                              isStatusAction && statusUpdatingId === courseId;
                            return (
                              <button
                                key={action}
                                title={action}
                                onClick={() => handleActionClick(action, c)}
                                disabled={isDisabled}
                                className={`flex flex-col items-center gap-0 p-1 rounded-lg text-slate-500 hover:text-slate-700 transition-colors ${
                                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              >
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center transition-colors border border-slate-200">
                                  {actionIcons[action]}
                                </div>
                                <span className="text-[10px] font-bold leading-none mt-3">
                                  {isDisabled ? "..." : action}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-t border-slate-200 gap-4">
        <p className="text-sm text-slate-500">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
          to {Math.min(currentPage * perPage, filtered.length)} of{" "}
          {filtered.length} courses
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === p
                  ? "bg-[#10b981] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <select className="ml-2 text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200">
            <option>10 / page</option>
            <option>20 / page</option>
            <option>50 / page</option>
          </select>
        </div>
      </div>

      {/* Edit Seats modal */}
      {seatsModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeSeatsModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Edit Seats
            </h3>
            <p className="text-sm text-slate-500 mb-4 truncate">
              {seatsModal.course?.basicDetails?.courseTitle || "Course"}
            </p>

            <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
              Open Seats
            </label>
            <input
              type="number"
              min="0"
              autoFocus
              value={seatsModal.value}
              onChange={(e) =>
                setSeatsModal((prev) => ({ ...prev, value: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSeatsSave();
              }}
              placeholder="e.g. 30"
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all"
            />

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeSeatsModal}
                disabled={seatsModal.submitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSeatsSave}
                disabled={seatsModal.submitting}
                className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#0ea271] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {seatsModal.submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesAndWorkshops;