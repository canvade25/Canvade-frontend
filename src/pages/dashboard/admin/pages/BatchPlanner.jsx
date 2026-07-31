import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, X, Check, MapPin } from "lucide-react";

const STORAGE_KEY = "canvade_simple_batch_planner_v1";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const defaultCourses = [
  { id: "course_data_science", name: "Data Science Professional Course", type: "Course" },
  { id: "course_digital_marketing", name: "Digital Marketing Masterclass", type: "Course" },
  { id: "course_ui_ux", name: "UI/UX Design Fundamentals", type: "Course" },
  { id: "workshop_full_stack", name: "Full Stack Web Development Workshop", type: "Workshop" },
];

const defaultTeachers = [
  { id: "teacher_ananya", name: "Ananya Sharma", code: "TCH-101" },
  { id: "teacher_rohan", name: "Rohan Mehta", code: "TCH-102" },
  { id: "teacher_meera", name: "Meera Iyer", code: "TCH-103" },
  { id: "teacher_aditya", name: "Aditya Rao", code: "TCH-104" },
];

const defaultStudents = [
  { id: "CV-STU-1001", name: "Rohit Sharma", status: "Enrolled" },
  { id: "CV-STU-1002", name: "Ananya Verma", status: "Ongoing" },
  { id: "CV-STU-1003", name: "Karan Mehta", status: "Enrolled" },
  { id: "CV-STU-1004", name: "Pooja Singh", status: "Ongoing" },
  { id: "CV-STU-1005", name: "Aditya Raj", status: "Enrolled" },
];

const blankBatch = {
  id: "",
  startDate: "",
  endDate: "",
  name: "",
  code: "",
  capacity: 40,
  courseId: defaultCourses[0].id,
  teacherId: defaultTeachers[0].id,
  students: [],
  startTime: "09:00",
  endTime: "10:30",
  days: [],
  status: "active",
  locations: [],
};

// An institute location (from GET /api/institute/view/my-institute) is an
// address object; this formats either that or a plain string into the
// single display/storage label used for a batch's location.
const formatLocationLabel = (loc) => {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  return [loc.addressLine1 || loc.address1, loc.city, loc.state]
    .filter(Boolean)
    .join(", ");
};

const INPUT_CLASS =
  "min-h-[42px] w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#13b981] focus:ring-4 focus:ring-emerald-50";

const getToken = () => localStorage.getItem("token") || localStorage.getItem("Token");

const authHeaders = (withJson = false) => {
  const token = getToken();
  return {
    ...(withJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseMaybeJson = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const getResponseItems = (data, keys = ["batches", "batch", "data", "results"]) => {
  const parsed = parseMaybeJson(data);
  if (Array.isArray(parsed)) return parsed;
  for (const key of keys) {
    const directValue = parseMaybeJson(parsed?.[key]);
    const nestedValue = parseMaybeJson(parsed?.data?.[key]);
    if (Array.isArray(directValue)) return directValue;
    if (Array.isArray(nestedValue)) return nestedValue;
  }
  if (parsed?.data && !Array.isArray(parsed.data)) return [parsed.data];
  return [];
};

const normalizeCourse = (course) => ({
  id: course?._id || course?.id || course?.courseId || course?.course_id || "",
  name:
    course?.basicDetails?.courseTitle ||
    course?.courseTitle ||
    course?.title ||
    course?.name ||
    "Untitled Course",
  type: course?.type || course?.courseType || "Course",
});

const normalizeTeacher = (teacher) => ({
  id:
    teacher?._id ||
    teacher?.id ||
    teacher?.facultyId ||
    teacher?.teacherId ||
    teacher?.userId ||
    teacher?.facultyCode ||
    teacher?.code ||
    teacher?.name ||
    "",
  name:
    teacher?.name ||
    teacher?.fullName ||
    teacher?.facultyName ||
    teacher?.teacherName ||
    teacher?.profile?.name ||
    "Faculty",
  code: teacher?.code || teacher?.facultyCode || teacher?.teacherCode || teacher?.employeeCode || "Faculty",
  image: teacher?.image || teacher?.photo || teacher?.avatar || teacher?.profileImage || "",
});

const normalizeStudent = (student) => ({
  id:
    student?.id ||
    student?._id ||
    student?.userId ||
    student?.user_id ||
    student?.student?.id ||
    student?.student?._id ||
    student?.user?.id ||
    student?.user?._id ||
    "",
  name:
    student?.name ||
    student?.fullName ||
    student?.studentName ||
    student?.student?.name ||
    student?.student?.fullName ||
    student?.user?.name ||
    student?.user?.fullName ||
    "Student",
  status: student?.status || student?.enrollmentStatus || "Enrolled",
});

const normalizeBatch = (batch) => {
  const startDate = batch?.startDate || batch?.batchStartDate || batch?.fromDate || "";
  const endDate = batch?.endDate || batch?.batchEndDate || batch?.toDate || startDate;
  const studentIds = Array.isArray(batch?.studentIds) ? batch.studentIds : [];
  const studentNames = Array.isArray(batch?.studentNames) ? batch.studentNames : [];

  return {
    id: batch?._id || batch?.id || batch?.batchId || batch?.batch_id || "",
    startDate: String(startDate).split("T")[0],
    endDate: String(endDate).split("T")[0],
    name: batch?.name || batch?.batchName || batch?.title || "Untitled Batch",
    code: batch?.code || batch?.batchCode || batch?.batch_code || "",
    capacity: Number(batch?.capacity ?? batch?.openSeats ?? batch?.seats ?? 0),
    courseId: batch?.courseId || batch?.course_id || batch?.course?._id || batch?.course?.id,
    teacherId: batch?.teacherId || batch?.teacher_id || batch?.teacher?._id || batch?.teacher?.id,
    // pair the two arrays up so edit mode shows names immediately, no roster fetch needed
    students: studentIds.map((id, idx) => ({
      id,
      name: studentNames[idx] || "",
      status: "Enrolled",
    })),
    startTime: batch?.startTime || batch?.batchStartTime || batch?.batchTime || "09:00",
    endTime: batch?.endTime || batch?.batchEndTime || batch?.batchTimeEnd || "10:30",
    days: Array.isArray(batch?.days) ? batch.days : Array.isArray(batch?.batchDays) ? batch.batchDays : [],
    status: batch?.status || "active",
    // fall back to the older single "location" string for batches saved before multi-location support
    locations: Array.isArray(batch?.locations)
      ? batch.locations
      : batch?.location
        ? [batch.location]
        : [],
  };
};

const toBatchPayload = (form) => ({
  batchName: form.name,
  batchCode: form.code,
  courseId: form.courseId,
  teacherId: form.teacherId,
  capacity: Number(form.capacity || 0),
  startDate: form.startDate,
  endDate: form.endDate,
  startTime: form.startTime,
  endTime: form.endTime,
  days: form.days,
  studentIds: form.students.map((student) => student.id),
  studentNames: form.students.map((student) => student.name || ""), // parallel array, same order/index as studentIds
  status: form.status || "active",
  locations: form.locations || [],
});

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addMonths(dateValue, months) {
  const date = new Date(`${dateValue || todayIso()}T00:00:00`);
  date.setMonth(date.getMonth() + Number(months));
  return date.toISOString().slice(0, 10);
}

function timeToMinutes(value) {
  const [hour, minute] = String(value || "00:00").split(":").map(Number);
  return hour * 60 + minute;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";
  const [rawHour, minute] = value.split(":").map(Number);
  const suffix = rawHour >= 12 ? "PM" : "AM";
  const hour = rawHour % 12 || 12;
  return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function getBatchStatus(batch) {
  if (batch.status === "closed") return "closed";
  return new Date(`${batch.endDate}T23:59:59`) < new Date() ? "closed" : "active";
}

function initials(text) {
  return String(text || "B")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function dateRangesOverlap(startA, endA, startB, endB) {
  return (
    new Date(`${startA}T00:00:00`) <= new Date(`${endB}T23:59:59`) &&
    new Date(`${startB}T00:00:00`) <= new Date(`${endA}T23:59:59`)
  );
}

function timeOverlaps(startA, endA, startB, endB) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(startB) < timeToMinutes(endA);
}

function seatsLeft(form) {
  return Math.max(0, Number(form.capacity || 0) - form.students.length);
}

function loadPlannerState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      courses: saved.courses || defaultCourses,
      teachers: saved.teachers || defaultTeachers,
      students: saved.students || defaultStudents,
      batches: (saved.batches || []).map(normalizeBatch),
    };
  } catch {
    return {
      courses: defaultCourses,
      teachers: defaultTeachers,
      students: defaultStudents,
      batches: [],
    };
  }
}

const BatchPlanner = () => {
  const [planner, setPlanner] = useState(loadPlannerState);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [filters, setFilters] = useState({
    search: "",
    courseId: "all",
    teacherId: "all",
    date: "",
    time: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(() => ({
    ...blankBatch,
    startDate: todayIso(),
    endDate: addMonths(todayIso(), 3),
    code: "BAT-001",
  }));
  const [studentUserId, setStudentUserId] = useState("");
  const [studentSelect, setStudentSelect] = useState("");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [instituteLocations, setInstituteLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationsError, setLocationsError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planner));
  }, [planner]);

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
        setInstituteLocations(Array.isArray(institute?.locations) ? institute.locations : []);
      } catch (error) {
        console.error("Error fetching institute locations:", error);
        setLocationsError(error.message || "An error occurred while fetching institute locations.");
      } finally {
        setLocationsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const fetchPlannerData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [batchesResponse, coursesResponse, facultiesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/batches/get-my-batches`, {
          headers: authHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/courses/my-courses`, {
          headers: authHeaders(),
        }).catch(() => null),
        fetch(`${API_BASE_URL}/api/institute/my-faculties`, {
          headers: authHeaders(),
        }).catch(() => null),
      ]);

      const batchesData = await batchesResponse.json().catch(() => ({}));
      if (!batchesResponse.ok) {
        throw new Error(batchesData.message || "Failed to fetch batches");
      }

      const fetchedBatches = getResponseItems(batchesData).map(normalizeBatch).filter((batch) => batch.id);
      let fetchedCourses = [];
      let didFetchCourses = false;
      if (coursesResponse?.ok) {
        didFetchCourses = true;
        const coursesData = await coursesResponse.json().catch(() => ({}));
        fetchedCourses = getResponseItems(coursesData, ["courses", "course", "data", "results"])
          .map(normalizeCourse)
          .filter((course) => course.id);
      }

      let fetchedTeachers = [];
      let didFetchTeachers = false;
      if (facultiesResponse?.ok) {
        didFetchTeachers = true;
        const facultiesData = await facultiesResponse.json().catch(() => ({}));
        fetchedTeachers = getResponseItems(facultiesData, ["faculties", "faculty", "teachers", "data", "results"])
          .map(normalizeTeacher)
          .filter((teacher) => teacher.id);
      }

      setPlanner((current) => ({
        ...current,
        courses: didFetchCourses ? fetchedCourses : current.courses,
        teachers: didFetchTeachers ? fetchedTeachers : current.teachers,
        batches: fetchedBatches,
      }));
    } catch (error) {
      setToast(error.message || "Could not load batches.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlannerData();
  }, [fetchPlannerData]);

  const fetchStudentsForCourse = useCallback(async (courseId) => {
    if (!courseId) {
      setPlanner((current) => ({ ...current, students: [] }));
      return;
    }
    try {
      setStudentsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/courses/my-students/${courseId}`, {
        headers: authHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Failed to fetch students");
      const fetchedStudents = getResponseItems(data, ["students", "enrollments", "data", "results"])
        .map(normalizeStudent)
        .filter((student) => student.id);
      setPlanner((current) => ({ ...current, students: fetchedStudents }));
    } catch (error) {
      setPlanner((current) => ({ ...current, students: [] }));
      setToast(error.message || "Could not load students for this course.");
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    fetchStudentsForCourse(form.courseId);
  }, [fetchStudentsForCourse, form.courseId, modalOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const coursesById = useMemo(
    () => Object.fromEntries(planner.courses.map((course) => [course.id, course])),
    [planner.courses],
  );
  const teachersById = useMemo(
    () => Object.fromEntries(planner.teachers.map((teacher) => [teacher.id, teacher])),
    [planner.teachers],
  );
  const studentsById = useMemo(
    () => Object.fromEntries(planner.students.map((student) => [student.id, student])),
    [planner.students],
  );

  // Batches loaded from the server only carry student IDs. Once the roster
  // for the selected course arrives, backfill display names for any
  // already-selected students that don't have one yet.
  useEffect(() => {
    if (!modalOpen || !planner.students.length) return;
    setForm((current) => {
      let changed = false;
      const students = current.students.map((student) => {
        if (student.name) return student;
        const match = studentsById[student.id];
        if (!match) return student;
        changed = true;
        return { ...student, name: match.name, status: match.status };
      });
      return changed ? { ...current, students } : current;
    });
  }, [planner.students, studentsById, modalOpen]);

  const activeCount = planner.batches.filter((batch) => getBatchStatus(batch) === "active").length;
  const closedCount = planner.batches.filter((batch) => getBatchStatus(batch) === "closed").length;

  const filteredBatches = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return planner.batches.filter((batch) => {
      const course = coursesById[batch.courseId];
      const teacher = teachersById[batch.teacherId];
      const haystack = `${batch.name} ${batch.code} ${course?.name || ""} ${teacher?.name || ""} ${teacher?.code || ""}`.toLowerCase();
      const selectedDate = filters.date ? new Date(`${filters.date}T00:00:00`) : null;

      return (
        getBatchStatus(batch) === selectedStatus &&
        (filters.courseId === "all" || batch.courseId === filters.courseId) &&
        (filters.teacherId === "all" || batch.teacherId === filters.teacherId) &&
        (!selectedDate ||
          (new Date(`${batch.startDate}T00:00:00`) <= selectedDate &&
            selectedDate <= new Date(`${batch.endDate}T23:59:59`))) &&
        (!filters.time ||
          (timeToMinutes(batch.startTime) <= timeToMinutes(filters.time) &&
            timeToMinutes(filters.time) <= timeToMinutes(batch.endTime))) &&
        (!query || haystack.includes(query))
      );
    });
  }, [coursesById, filters, planner.batches, selectedStatus, teachersById]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const openModal = async (batchId) => {
    let batch = planner.batches.find((item) => item.id === batchId);
    if (batchId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/batches/${batchId}`, {
          headers: authHeaders(),
        });
        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          batch = normalizeBatch(data.batch || data.data?.batch || data.data || data);
        }
      } catch {
        // Keep local row as fallback if detail API is temporarily unavailable.
      }
    }
    const startDate = todayIso();
    setForm(
      batch || {
        ...blankBatch,
        id: "",
        startDate,
        endDate: addMonths(startDate, 3),
        code: `BAT-${String(planner.batches.length + 1).padStart(3, "0")}`,
        courseId: planner.courses[0]?.id || "",
        teacherId: planner.teachers[0]?.id || "",
      },
    );
    setStudentUserId("");
    setStudentSelect("");
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError("");
  };

  const setEndDate = (months) => {
    setForm((current) => ({ ...current, endDate: addMonths(current.startDate, months) }));
  };

  const toggleDay = (day) => {
    setForm((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day],
    }));
  };

  const applyDays = (daysText) => {
    setForm((current) => ({
      ...current,
      days: daysText ? daysText.split(",") : [],
    }));
  };

  const addStudent = () => {
    const id = (studentUserId || studentSelect).trim();

    if (!form.courseId) {
      setFormError("Select a course before adding students.");
      return;
    }
    if (!id) {
      setFormError("Enter a user ID or select a student from the list.");
      return;
    }
    if (form.students.some((student) => student.id.toLowerCase() === id.toLowerCase())) {
      setFormError("This student is already added to the batch.");
      return;
    }
    if (seatsLeft(form) <= 0) {
      setFormError("Batch capacity reached. Increase capacity to add more students.");
      return;
    }

    const student = studentsById[id];
    setForm((current) => ({
      ...current,
      students: [
        ...current.students,
        {
          id,
          name: student?.name || "Student",
          status: student?.status || "Manual",
        },
      ],
    }));
    setStudentUserId("");
    setStudentSelect("");
    setFormError("");
  };

  const removeStudent = (id) => {
    setForm((current) => ({
      ...current,
      students: current.students.filter((student) => student.id !== id),
    }));
  };

  const findTeacherConflict = (candidate) =>
    planner.batches.find((batch) => {
      if (batch.id === candidate.id) return false;
      if (getBatchStatus(batch) !== "active") return false;
      if (batch.teacherId !== candidate.teacherId) return false;
      if (!dateRangesOverlap(batch.startDate, batch.endDate, candidate.startDate, candidate.endDate)) return false;
      const hasSameDay = (batch.days || []).some((day) => candidate.days.includes(day));
      return hasSameDay && timeOverlaps(batch.startTime, batch.endTime, candidate.startTime, candidate.endTime);
    });

  const saveBatch = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.days.length) {
      setFormError("Select at least one batch day.");
      return;
    }
    if (form.endDate < form.startDate) {
      setFormError("End date must be after start date.");
      return;
    }
    if (form.endTime <= form.startTime) {
      setFormError("Batch end time must be after start time.");
      return;
    }
    if (form.students.length > Number(form.capacity || 0)) {
      setFormError("Selected students cannot be more than the batch capacity.");
      return;
    }

    const payload = {
      ...form,
      id: form.id || `batch_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      capacity: Number(form.capacity),
      status: form.status || "active",
    };
    const conflict = findTeacherConflict(payload);
    if (conflict) {
      const teacher = teachersById[payload.teacherId];
      setFormError(`${teacher?.name || "This teacher"} is already assigned to ${conflict.name} during this time.`);
      return;
    }

    try {
      setIsSaving(true);
      const url = form.id
        ? `${API_BASE_URL}/api/batches/update/${form.id}`
        : `${API_BASE_URL}/api/batches/create`;
      const response = await fetch(url, {
        method: form.id ? "PATCH" : "POST",
        headers: authHeaders(true),
        body: JSON.stringify(toBatchPayload(payload)),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || (form.id ? "Batch update failed" : "Batch creation failed"));
      }

      await fetchPlannerData();
      setToast(form.id ? "Batch updated." : "Batch created.");
      closeModal();
    } catch (error) {
      setFormError(error.message || "Unable to save batch.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleBatchStatus = async (batchId) => {
    const currentBatch = planner.batches.find((batch) => batch.id === batchId);
    if (!currentBatch) return;
    const nextBatch = {
      ...currentBatch,
      status: getBatchStatus(currentBatch) === "active" ? "closed" : "active",
    };
    setPlanner((current) => ({
      ...current,
      batches: current.batches.map((batch) => (batch.id === batchId ? nextBatch : batch)),
    }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/batches/update/${batchId}`, {
        method: "PATCH",
        headers: authHeaders(true),
        body: JSON.stringify(toBatchPayload(nextBatch)),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Batch status update failed");
      setToast("Batch status updated.");
    } catch (error) {
      setPlanner((current) => ({
        ...current,
        batches: current.batches.map((batch) => (batch.id === batchId ? currentBatch : batch)),
      }));
      setToast(error.message || "Batch status update failed.");
    }
  };

  const deleteBatch = async (batchId) => {
    const previousBatches = planner.batches;
    setPlanner((current) => ({
      ...current,
      batches: current.batches.filter((batch) => batch.id !== batchId),
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/batches/delete/${batchId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete batch");
      }
      setToast("Batch deleted.");
    } catch (error) {
      setPlanner((current) => ({ ...current, batches: previousBatches }));
      setToast(error.message || "Batch deletion failed.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent p-0 text-left">
      <section className="min-h-[calc(100vh-32px)]">
        <header className="mb-7 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-[22px] font-bold leading-tight tracking-tight text-slate-950 md:text-2xl">
              Batch Planner
            </h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[#005b32]">
              {isLoading ? "Loading your batches..." : "Create, manage and organize all your batches."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#24977a] px-6 text-sm font-bold text-white transition hover:bg-[#1d7a63] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            Add New Batch
          </button>
        </header>

        <section className="mb-5 flex flex-col gap-3 sm:flex-row" aria-label="Batch stats">
          {[
            { label: "Active Batches", value: activeCount, status: "active" },
            { label: "Closed Batches", value: closedCount, status: "closed" },
          ].map((stat) => {
            const active = selectedStatus === stat.status;
            return (
              <button
                key={stat.status}
                type="button"
                onClick={() => setSelectedStatus(stat.status)}
                className={`inline-flex min-h-[54px] min-w-[142px] items-center justify-center gap-3 rounded-[10px] border px-6 text-sm font-bold transition ${
                  active
                    ? "border-emerald-300 bg-emerald-50 text-[#008a66]"
                    : "border-slate-100 bg-white text-slate-600 hover:border-emerald-200"
                }`}
              >
                <span>{stat.label}</span>
                <strong
                  className={`grid h-6 min-w-6 place-items-center rounded-full px-2 text-xs ${
                    active ? "bg-[#009b70] text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {stat.value}
                </strong>
              </button>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 overflow-x-auto px-4 py-4">
            <h2 className="shrink-0 text-lg font-bold text-slate-950">All Batches</h2>
            <div className="flex min-w-max flex-1 items-center gap-2">
              <label className="flex h-10 w-[240px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-400">
                <Search className="h-4 w-4" />
                <input
                  value={filters.search}
                  onChange={(event) => updateFilter("search", event.target.value)}
                  type="search"
                  placeholder="Search batches..."
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
                />
              </label>
              <select
                value={filters.courseId}
                onChange={(event) => updateFilter("courseId", event.target.value)}
                className="h-10 w-[190px] rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">All Courses</option>
                {planner.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <select
                value={filters.teacherId}
                onChange={(event) => updateFilter("teacherId", event.target.value)}
                className="h-10 w-[190px] rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">All Teachers</option>
                {planner.teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.code}
                  </option>
                ))}
              </select>
              <input
                value={filters.date}
                onChange={(event) => updateFilter("date", event.target.value)}
                type="date"
                className="h-10 w-[150px] rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              <input
                value={filters.time}
                onChange={(event) => updateFilter("time", event.target.value)}
                type="time"
                className="h-10 w-[120px] rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto border-t border-slate-100">
            {filteredBatches.length ? (
              <table className="w-full min-w-[1320px] border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Batch", "Course", "Location", "Assigned Teacher", "Students", "Schedule", "Dates", "Status", "Actions"].map((head) => (
                      <th key={head} className="px-5 py-4 text-left text-sm font-bold text-slate-900">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.map((batch) => {
                    const course = coursesById[batch.courseId];
                    const teacher = teachersById[batch.teacherId];
                    const status = getBatchStatus(batch);
                    const percent = Math.min(100, Math.round((batch.students.length / Number(batch.capacity || 1)) * 100));
                    return (
                      <tr key={batch.id} className="border-t border-slate-100">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-bold text-[#009b70]">
                              {initials(batch.name)}
                            </div>
                            <div>
                              <strong className="block text-[15px] text-slate-950">{batch.name}</strong>
                              <span className="mt-1 block text-xs text-slate-500">{batch.code}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <strong className="block text-slate-800">{course?.name || "Course not found"}</strong>
                          <span className="mt-1 block text-xs text-slate-500">{course?.type || "Course / Workshop"}</span>
                        </td>
                        <td className="px-5 py-4">
                          {batch.locations?.length > 0 ? (
                            <div className="flex max-w-[200px] flex-col gap-1">
                              {batch.locations.slice(0, 2).map((loc, idx) => (
                                <span
                                  key={idx}
                                  title={loc}
                                  className="inline-flex items-center gap-1 truncate rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                                >
                                  <MapPin className="h-3 w-3 shrink-0 text-emerald-500" />
                                  <span className="truncate">{loc}</span>
                                </span>
                              ))}
                              {batch.locations.length > 2 && (
                                <span
                                  title={batch.locations.slice(2).join(", ")}
                                  className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#008a66]"
                                >
                                  +{batch.locations.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300">No location</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <strong className="block text-slate-800">{teacher?.name || "Teacher not assigned"}</strong>
                          <span className="mt-1 block text-xs text-slate-500">{teacher?.code || "No code"}</span>
                        </td>
                        <td className="px-5 py-4">
                          <strong className="text-slate-800">
                            {batch.students.length} / {batch.capacity}
                          </strong>
                          <div className="mt-2 h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#20a082] to-[#61d2b3]" style={{ width: `${percent}%` }} />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex min-h-7 items-center rounded-full bg-emerald-50 px-3 text-xs font-bold text-[#0d6b56]">
                            {batch.days.map((day) => DAY_SHORT[day]).join(", ") || "No days"}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <strong className="block text-slate-800">{formatDate(batch.startDate)}</strong>
                          <span className="mt-1 block text-xs text-slate-500">to {formatDate(batch.endDate)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-bold ${
                              status === "active"
                                ? "bg-emerald-100 text-[#008a66]"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {status === "active" ? "Active" : "Closed"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => openModal(batch.id)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                              Edit
                            </button>
                            <button type="button" onClick={() => toggleBatchStatus(batch.id)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                              {status === "active" ? "Close" : "Reopen"}
                            </button>
                            <button type="button" onClick={() => deleteBatch(batch.id)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="grid min-h-[250px] place-items-center px-6 py-10 text-center">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl font-bold text-[#0f9b76]">
                    BP
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">No batches yet</h3>
                  <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                    Create your first batch and connect it with a course or workshop.
                  </p>
                  <button
                    type="button"
                    onClick={() => openModal()}
                    className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#13b981] px-5 text-sm font-bold text-white transition hover:bg-[#07896f]"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Batch
                  </button>
                </div>
              </div>
            )}
          </div>

          <footer className="flex min-h-[86px] flex-col justify-between gap-3 border-t border-slate-100 px-5 py-5 text-sm font-medium text-slate-500 sm:flex-row sm:items-center">
            <span>
              Showing {filteredBatches.length ? 1 : 0} to {filteredBatches.length} of {filteredBatches.length} batches
            </span>
          </footer>
        </section>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/45 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section className="max-h-[calc(100vh-40px)] w-full max-w-[1040px] overflow-auto rounded-[18px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                  {form.id ? "Edit Batch" : "Create Batch"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill batch details, course, students, time and recurring days.
                </p>
              </div>
              <button type="button" onClick={closeModal} className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={saveBatch} className="px-6 py-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Field label="Start Date">
                  <input required type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value, endDate: current.endDate < event.target.value ? addMonths(event.target.value, 3) : current.endDate }))} className={INPUT_CLASS} />
                </Field>
                <Field label="End Date">
                  <input required type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} className={INPUT_CLASS} />
                </Field>

                <div className="flex flex-wrap content-end gap-2 lg:col-span-1">
                  {[3, 6, 12].map((months) => (
                    <button key={months} type="button" onClick={() => setEndDate(months)} className="min-h-9 rounded-full border border-emerald-100 bg-emerald-50 px-3 text-xs font-bold text-[#008a66] hover:bg-[#1fa184] hover:text-white">
                      {months === 3 ? "Last date + 3 months" : months === 6 ? "+ 6 months" : "+ 1 year"}
                    </button>
                  ))}
                </div>

                <Field label="Batch Name">
                  <input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Example: UX Evening Batch" className={INPUT_CLASS} />
                </Field>
                <Field label="Batch Code">
                  <input required value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} placeholder="Example: UX-2601" className={INPUT_CLASS} />
                </Field>
                <Field label="Student Capacity">
                  <input required min="1" type="number" value={form.capacity} onChange={(event) => setForm((current) => ({ ...current, capacity: event.target.value }))} placeholder="40" className={INPUT_CLASS} />
                </Field>

                <Field label="Course / Workshop" helper="Only your courses/workshops are listed here.">
                  <select
                    required
                    value={form.courseId}
                    onChange={(event) => {
                      setStudentSelect("");
                      setStudentUserId("");
                      setForm((current) => ({ ...current, courseId: event.target.value, students: [] }));
                    }}
                    className={INPUT_CLASS}
                  >
                    {!planner.courses.length && <option value="">No courses found</option>}
                    {planner.courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Assigned Teacher" helper="Teacher name and teacher code are used to prevent clashes.">
                  <select required value={form.teacherId} onChange={(event) => setForm((current) => ({ ...current, teacherId: event.target.value }))} className={INPUT_CLASS}>
                    {!planner.teachers.length && <option value="">No faculties found</option>}
                    {planner.teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.code}</option>
                    ))}
                  </select>
                </Field>

                <div className="lg:col-span-3">
                  <Field label="Batch Locations" helper="Select one or more of your institute's registered locations.">
                    {locationsLoading ? (
                      <p className="text-xs text-slate-400 py-1">Loading locations...</p>
                    ) : locationsError ? (
                      <p className="text-xs text-rose-500 py-1">{locationsError}</p>
                    ) : instituteLocations.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {instituteLocations.map((loc, i) => {
                          const label = formatLocationLabel(loc);
                          const active = (form.locations || []).includes(label);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setForm((current) => ({
                                ...current,
                                locations: active
                                  ? (current.locations || []).filter((v) => v !== label)
                                  : [...(current.locations || []).filter(Boolean), label],
                              }))}
                              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                                active
                                  ? "bg-emerald-500 text-white border-emerald-500"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                              }`}
                            >
                              {active && <Check className="w-3 h-3 inline mr-1" />}
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-1">
                        No locations found on your institute profile. Add one from your institute settings first.
                      </p>
                    )}
                  </Field>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 lg:col-span-3">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-700">Add Students</span>
                      <small className="mt-1 block text-xs text-slate-400">Select a course first, then choose enrolled students for that course.</small>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#008a66]">
                        {form.students.length} selected
                      </strong>
                      <strong
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          seatsLeft(form) === 0
                            ? "bg-rose-50 text-rose-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {seatsLeft(form)} seats left
                      </strong>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <Field label="User ID" compact>
                      <input value={studentUserId} onChange={(event) => setStudentUserId(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addStudent(); } }} placeholder="CV-STU-1024" className={INPUT_CLASS} />
                    </Field>
                    <Field label="Student List" compact>
                      <select
                        value={studentSelect}
                        onChange={(event) => setStudentSelect(event.target.value)}
                        disabled={!form.courseId || studentsLoading}
                        className={`${INPUT_CLASS} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
                      >
                        <option value="">
                          {!form.courseId
                            ? "Select course first"
                            : studentsLoading
                              ? "Loading students..."
                              : "Select enrolled / ongoing student"}
                        </option>
                        {planner.students.map((student) => (
                          <option key={student.id} value={student.id}>{student.name} - {student.id} ({student.status})</option>
                        ))}
                      </select>
                    </Field>
                    <button type="button" onClick={addStudent} disabled={seatsLeft(form) === 0} className="h-[42px] rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                      Add
                    </button>
                  </div>
                  <div className="mt-4 flex min-h-9 flex-wrap gap-2">
                    {form.students.length ? form.students.map((student) => (
                      <span key={student.id} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 pl-3 pr-1 text-xs font-bold text-[#0f6b56]">
                        {student.name || student.id} - {student.id}
                        <button type="button" onClick={() => removeStudent(student.id)} className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )) : (
                      <span className="text-xs text-slate-500">No students added yet.</span>
                    )}
                  </div>
                </section>

                <Field label="Batch Start Time">
                  <input required type="time" value={form.startTime} onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))} className={INPUT_CLASS} />
                </Field>
                <Field label="Batch End Time">
                  <input required type="time" value={form.endTime} onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))} className={INPUT_CLASS} />
                </Field>

                <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 lg:col-span-3">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-700">Batch Dates / Days</span>
                    <small className="mt-1 block text-xs text-slate-400">Select manually or use a preset.</small>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {[
                      ["MWF", "Monday,Wednesday,Friday"],
                      ["TTS", "Tuesday,Thursday,Saturday"],
                      ["Sat and Sun", "Saturday,Sunday"],
                      ["Select days", ""],
                    ].map(([label, value]) => (
                      <button key={label} type="button" onClick={() => applyDays(value)} className="min-h-9 rounded-full border border-emerald-100 bg-emerald-50 px-3 text-xs font-bold text-[#008a66] hover:bg-[#1fa184] hover:text-white">
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`min-h-10 rounded-xl border text-xs font-bold transition ${
                          form.days.includes(day)
                            ? "border-[#1fa184] bg-[#1fa184] text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                        }`}
                      >
                        {DAY_SHORT[day]}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {formError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {formError}
                </div>
              )}

              <footer className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="button" onClick={closeModal} className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="min-h-11 rounded-xl bg-[#13b981] px-6 text-sm font-bold text-white hover:bg-[#07896f] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSaving ? "Saving..." : form.id ? "Update Batch" : "Create Batch"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] rounded-xl bg-[#143e34] px-4 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
};

const Field = ({ label, helper, compact = false, children }) => (
  <label className="grid gap-2">
    <span className="text-xs font-bold text-slate-700">{label}</span>
    {children}
    {helper && <small className="text-[11px] text-slate-400">{helper}</small>}
  </label>
);

export default BatchPlanner;