import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  X, Star, Clock, Laptop, BarChart2, IndianRupee,
  Percent, CreditCard, Calendar, CheckCircle2,
  Briefcase, ShieldCheck, HelpCircle, FileText, Plus, Sparkles, ShoppingCart
} from 'lucide-react';
import { removeFromCompare, addToCompare, getCompareItems } from '../../../../../api/courseApi';

const Compare = () => {
  const location = useLocation();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState(1);
  const [pickerCourses, setPickerCourses] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');

  const formatPrice = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return '₹ 0';
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const toList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.flatMap(toList);
    if (typeof value === 'object') return Object.values(value).flatMap(toList);
    return String(value)
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const yesNo = (value) => {
    if (typeof value === 'boolean') return value ? 'Yes' : '';
    if (value === undefined || value === null) return '';
    return String(value).trim();
  };

  const uniqueItems = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      const key = String(item).toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const getCourseHighlights = (course, basicDetails, courseInformation) => {
    const mappedHighlights = [
      ...toList(course?.highlights),
      ...toList(basicDetails?.highlights),
      ...toList(courseInformation?.highlights),
      ...toList(courseInformation?.accreditation).map((item) => `Accreditation: ${item}`),
      basicDetails?.learningMode && `Learning Mode: ${basicDetails.learningMode}`,
      courseInformation?.courseLanguage && `Course Language: ${courseInformation.courseLanguage}`,
      courseInformation?.language && `Course Language: ${courseInformation.language}`,
      courseInformation?.courseLevel && `Course Level: ${courseInformation.courseLevel}`,
      basicDetails?.difficulty && `Course Difficulty: ${basicDetails.difficulty}`,
      courseInformation?.difficulty && `Course Difficulty: ${courseInformation.difficulty}`,
      courseInformation?.certification && `Certification: ${courseInformation.certification}`,
      courseInformation?.certificationType && `Certification Type: ${courseInformation.certificationType}`,
      ...toList(courseInformation?.supportingMaterials).map((item) => `Supporting Materials: ${item}`),
      yesNo(courseInformation?.placementAssistance) && `Placement Assistance: ${yesNo(courseInformation.placementAssistance)}`,
      ...toList(basicDetails?.learningOutcomes),
    ].filter(Boolean);

    return uniqueItems(mappedHighlights).slice(0, 5);
  };

  const getCourseDisplayData = (course) => {
    if (!course) return null;

    const basicDetails = course?.basicDetails || {};
    const pricing = course?.priceDetails || {};
    const uploadMaterials = course?.uploadMaterials || {};
    const courseInformation = basicDetails.courseInformation || course?.courseInformation || {};
    const highlights = getCourseHighlights(course, basicDetails, courseInformation);

    return {
      title: basicDetails.courseTitle || 'Untitled Course',
      provider: course?.createdByName || 'Unknown Provider',
      image: uploadMaterials.thumbnail || uploadMaterials.images?.[0] || null,
      rating: course?.rating ?? 0,
      reviews: course?.reviews ?? 0,
      mode: basicDetails.learningMode || '—',
      duration: basicDetails.duration || '—',
      level: courseInformation.courseLevel || basicDetails.difficulty || '—',
      fee: formatPrice(pricing.actualPrice ?? pricing.currentPrice ?? 0),
      discount: pricing.actualPrice && pricing.currentPrice ? `- ₹ ${pricing.actualPrice - pricing.currentPrice}` : '—',
      finalPrice: formatPrice(pricing.currentPrice ?? pricing.actualPrice ?? 0),
      emi: basicDetails.isEmiAvailable ? `₹ ${Math.ceil(pricing.currentPrice / 12).toLocaleString('en-IN')}/month` : "EMI not available",
      nextBatch: course?.batchPlan?.[0]?.batchStartDate || '—',
      certificate: courseInformation?.certification || '—',
      placementSupport: courseInformation?.placementAssistance,
      highlights,
      syllabus: 'View Syllabus',
    };
  };

  const initialCourse1 = getCourseDisplayData(location.state?.course1) || null;

  const [course1Data, setCourse1Data] = useState(initialCourse1);
  const [course2Data, setCourse2Data] = useState(null);
  const [course1Raw, setCourse1Raw] = useState(location.state?.course1 || null);
  const [course2Raw, setCourse2Raw] = useState(null);

  // Load saved compare items on mount so refresh shows persisted selections
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // nothing to load when not authenticated
        const res = await getCompareItems(token);
        const items = res?.compare || res?.data || [];
        if (!mounted || !Array.isArray(items) || items.length === 0) return;
        if (items[0]) {
          setCourse1Raw(items[0]);
          setCourse1Data(getCourseDisplayData(items[0]) || null);
        }
        if (items[1]) {
          setCourse2Raw(items[1]);
          setCourse2Data(getCourseDisplayData(items[1]) || null);
        }
      } catch (err) {
        console.error('Failed to load compare items', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const removeCourse = (slot) => {
    // Optimistic UI: remove locally first
    if (slot === 1) {
      const raw = course1Raw;
      setCourse1Data(null);
      setCourse1Raw(null);
      if (raw && (raw.courseId || raw._id || raw.id)) {
        const id = raw.courseId || raw._id || raw.id;
        const token = localStorage.getItem('token');
        removeFromCompare(id, token).catch((err) => console.error('Failed to remove compare item', err));
      }
    } else {
      const raw = course2Raw;
      setCourse2Data(null);
      setCourse2Raw(null);
      if (raw && (raw.courseId || raw._id || raw.id)) {
        const id = raw.courseId || raw._id || raw.id;
        const token = localStorage.getItem('token');
        removeFromCompare(id, token).catch((err) => console.error('Failed to remove compare item', err));
      }
    }
  };

  const addCourse = (slot) => {
    setPickerSlot(slot);
    setPickerOpen(true);
  };

  // Fetch courses when picker opens or search changes
  useEffect(() => {
    if (!pickerOpen) return;
    let mounted = true;
    const fetchCourses = async () => {
      setPickerLoading(true);
      try {
        const api = (await import('../../../../../api/axios')).default;
        const res = await api.get('/api/courses');
        if (!mounted) return;
        const data = res.data?.data || res.data?.courses || res.data || [];
        const arr = Array.isArray(data) ? data : [];
        const filtered = arr.filter((c) => {
          const id = c.courseId || c._id || c.id;
          // exclude already selected courses
          if (course1Raw && (course1Raw.courseId || course1Raw._id || course1Raw.id)) {
            const id1 = course1Raw.courseId || course1Raw._id || course1Raw.id;
            if (id === id1) return false;
          }
          if (course2Raw && (course2Raw.courseId || course2Raw._id || course2Raw.id)) {
            const id2 = course2Raw.courseId || course2Raw._id || course2Raw.id;
            if (id === id2) return false;
          }
          if (!pickerQuery) return true;
          return JSON.stringify(c).toLowerCase().includes(pickerQuery.toLowerCase());
        });
        setPickerCourses(filtered);
      } catch (err) {
        console.error(err);
        setPickerCourses([]);
      } finally {
        if (mounted) setPickerLoading(false);
      }
    };

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, [pickerOpen, pickerQuery]);

  const handlePickerSelect = (course) => {
    const display = getCourseDisplayData(course) || {
      title: course.title || course.courseTitle || course.name || 'Untitled',
      provider: course.createdByName || course.institution || 'Unknown',
      image: course.uploadMaterials?.thumbnail || course.image || null,
      rating: course.rating || 0,
      reviews: course.reviews || 0,
      mode: course.basicDetails?.learningMode || '—',
      duration: course.basicDetails?.duration || '—',
      level: course.basicDetails?.courseLevel || '—',
      fee: course.priceDetails?.currentPrice || course.currentPrice || '₹ 0',
      discount: '—',
      finalPrice: course.priceDetails?.currentPrice || course.currentPrice || '₹ 0',
      emi: '—',
      nextBatch: course.batchPlan?.[0]?.batchStartDate || '—',
      certificate: course.basicDetails?.courseInformation?.certification || '—',
      placementSupport: course.basicDetails?.courseInformation?.placementAssistance || false,
      highlights: course.basicDetails?.learningOutcomes || [],
    };

    if (pickerSlot === 1) {
      setCourse1Data(display);
      setCourse1Raw(course);
    } else {
      setCourse2Data(display);
      setCourse2Raw(course);
    }
    // Persist to backend compare collection
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const id = course.courseId || course._id || course.id;
        if (id) await addToCompare(id, token);
      } catch (err) {
        console.error('Failed to add to compare', err);
      }
    })();
    setPickerOpen(false);
    setPickerQuery('');
    setPickerCourses([]);
  };

  const features = [
    { label: 'Duration', icon: Clock, key: 'duration' },
    { label: 'Mode', icon: Laptop, key: 'mode' },
    { label: 'Level', icon: BarChart2, key: 'level' },
    { label: 'Course Fee', icon: IndianRupee, key: 'fee' },
    { label: 'Discount', icon: Percent, key: 'discount', isDiscount: true },
    { label: 'Final Price', icon: IndianRupee, key: 'finalPrice', isBoldPrice: true },
    { label: 'EMI Options', icon: CreditCard, key: 'emi' },
    { label: 'Next Batch', icon: Calendar, key: 'nextBatch' },
    { label: 'Certificate', icon: CheckCircle2, key: 'certificate', isCertRow: true },
    { label: 'Placement Support', icon: Briefcase, key: 'placementSupport', isVerifiedText: true },
    { label: 'Course Highlights', icon: Star, key: 'highlights', isList: true },
    { label: 'Syllabus', icon: FileText, key: 'syllabus', isLink: true },
    { label: 'Student Rating', icon: Star, key: 'rating', isRatingRow: true },
  ];

  const renderCell = (row, data) => {
    if (!data) {
      return <span className="text-slate-300 text-xs font-medium">—</span>;
    }
    const value = data[row.key];

    if (row.isList) return (
      <ul className="list-disc list-inside space-y-1 text-slate-950 font-medium text-xs">
        {value?.length
          ? value.map((li, i) => <li key={i}>{li}</li>)
          : <li>No course highlights added yet</li>}
      </ul>
    );
    if (row.isDiscount) return <span className="text-emerald-600 font-medium text-xs">{value}</span>;
    if (row.isBoldPrice) return <span className="text-slate-950 font-medium text-sm">{value}</span>;
    if (row.isLink) return <button className="text-[#10b981] font-medium text-xs hover:underline">{value}</button>;
    if (row.isVerifiedText) return (
      <div className="flex items-center gap-1.5 text-slate-950 font-medium text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50 stroke-[2.5] shrink-0" />
        <span>{value ? 'Yes' : 'No'}</span>
      </div>
    );
    if (row.isCertRow) return (
      <div className="flex items-center gap-1.5 text-slate-950 font-medium text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50 stroke-[2.5] shrink-0" />
        <span>{value}</span>
      </div>
    );
    if (row.isRatingRow) return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-slate-950">{value}</span>
        <div className="flex items-center gap-0.5 text-amber-500">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
        </div>
        <span className="text-[11px] text-slate-900 font-medium">({data.reviews})</span>
      </div>
    );
    return <span className="text-slate-950 font-medium text-xs">{value}</span>;
  };

  const AddCourseSlot = ({ onAdd }) => (
    <div className="border-l border-slate-200 bg-white p-3">
      <button
        onClick={onAdd}
        className="group relative w-full h-full min-h-[132px] flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-transparent px-4 py-6 text-center transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-medium text-emerald-600/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Sparkles className="w-3 h-3" />
        </span>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100 transition-all duration-200 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-emerald-200 group-hover:shadow-md">
          <Plus className="h-5 w-5 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
        </div>
        <div className="space-y-0.5">
          <span className="block text-sm font-medium text-emerald-700">Add a course</span>
          <span className="block text-[11px] font-normal text-slate-500 leading-snug">Compare fees, duration & more</span>
        </div>
      </button>
    </div>
  );

  const navigate = useNavigate();

  const trackCourseViewAndNavigate = async (courseId) => {
    const token = localStorage.getItem("token") || localStorage.getItem("Token");

    if (token && courseId) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com"}/api/courses/${courseId}/view`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error incrementing course view:", error);
      }
    }

    navigate(`/courseview/${courseId}`);
  };

  const handleEnroll = (raw) => {
    if (!raw) return;
    const token = localStorage.getItem('token') || localStorage.getItem('Token');
    if (!token) {
      navigate('/login');
      return;
    }
    const id = raw.courseId || raw._id || raw.id;
    localStorage.setItem('checkoutCourse', JSON.stringify(raw));
    navigate(`/checkout/${id || ''}`);
  };

  const CourseSlot = ({ data, onRemove, raw }) => (
    <div className="p-4 sm:p-6 border-l border-slate-200 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 relative bg-white min-h-[140px] sm:min-h-0">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-slate-500 hover:text-rose-600 transition-colors p-1 hover:bg-slate-50 rounded-lg"
      >
        <X className="w-4 h-4 stroke-[2.5]" />
      </button>
      {data.image ? (
        <img
          src={data.image}
          alt={data.title}
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 shadow-sm"
        />
      ) : (
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl shrink-0 shadow-sm bg-emerald-50 flex items-center justify-center text-emerald-600 font-medium text-lg">
          {data.title?.[0] || '?'}
        </div>
      )}
      <div className="space-y-2 pt-1 w-full min-w-0">
        <h3 className="text-sm font-medium text-slate-950 leading-snug break-words pr-4 sm:pr-0">
          <button
            type="button"
            onClick={() => {
              const id = raw?.courseId || raw?._id || raw?.id;
              if (id) trackCourseViewAndNavigate(id);
            }}
            className="text-left p-0 m-0 underline-offset-2 hover:underline"
            style={{ cursor: raw ? 'pointer' : 'default' }}
          >
            {data.title}
          </button>
        </h3>
        <p className="text-xs text-slate-900 font-medium break-words">by {data.provider}</p>
        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-500 flex-wrap">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{data.rating}</span>
          <span className="text-slate-900 font-medium">({data.reviews} Reviews)</span>
        </div>
        <div className="pt-0.5">
          <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">{data.mode}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-6 w-full max-w-[1400px] mx-auto p-2">

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: '768px' }}>

            <div className="grid grid-cols-3 border-b border-slate-200 items-stretch">
              <div className="p-4 sm:p-6 flex items-center bg-white">
                <h2 className="text-base font-medium text-slate-900 tracking-tight">Course Details</h2>
              </div>

              {course1Data ? <CourseSlot data={course1Data} raw={course1Raw} onRemove={() => removeCourse(1)} /> : <AddCourseSlot onAdd={() => addCourse(1)} />}
              {course2Data ? <CourseSlot data={course2Data} raw={course2Raw} onRemove={() => removeCourse(2)} /> : <AddCourseSlot onAdd={() => addCourse(2)} />}
            </div>

            <div className="divide-y divide-slate-200 bg-white">
              {features.map((row, idx) => {
                const RowIcon = row.icon;
                return (
                  <div key={idx} className="grid grid-cols-3 items-stretch hover:bg-slate-50/40 transition-colors">
                    <div className="p-4 px-4 sm:px-6 flex items-center gap-3 text-slate-900 font-medium text-[14px] bg-slate-50">
                      <RowIcon className="w-5 h-5 text-slate-700 stroke-[2.5] shrink-0" />
                      <span>{row.label}</span>
                    </div>

                    <div className="p-4 px-4 sm:px-6 border-l border-slate-200 bg-white flex items-center">
                      {renderCell(row, course1Data)}
                    </div>

                    <div className="p-4 px-4 sm:px-6 border-l border-slate-200 bg-white flex items-center">
                      {renderCell(row, course2Data)}
                    </div>
                  </div>
                );
              })}

              <div className="grid grid-cols-3 items-stretch bg-slate-50/40">
                <div className="p-4 px-4 sm:px-6 flex items-center gap-3 text-slate-900 font-medium text-[14px] bg-slate-50">
                  <ShoppingCart className="w-5 h-5 text-slate-700 stroke-[2.5] shrink-0" />
                  <span>Actions</span>
                </div>

                <div className="p-4 px-4 sm:px-6 border-l border-slate-200 bg-white flex items-center">
                  {course1Data ? (
                    <button
                      onClick={() => handleEnroll(course1Raw)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#007965] px-4 text-xs font-semibold text-white transition hover:bg-[#006252]"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Enroll Now
                    </button>
                  ) : (
                    <span className="text-slate-300 text-xs font-medium">—</span>
                  )}
                </div>

                <div className="p-4 px-4 sm:px-6 border-l border-slate-200 bg-white flex items-center">
                  {course2Data ? (
                    <button
                      onClick={() => handleEnroll(course2Raw)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#007965] px-4 text-xs font-semibold text-white transition hover:bg-[#006252]"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Enroll Now
                    </button>
                  ) : (
                    <span className="text-slate-300 text-xs font-medium">—</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-[#f4fbf9] border border-emerald-200 rounded-xl py-3 px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium text-slate-900">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
          <span>All institutes are verified</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
          <span>100% Secure Payment</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
          <span>24/7 Support</span>
        </div>
      </div>
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPickerOpen(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-medium">Select a course</h3>
              <button onClick={() => setPickerOpen(false)} className="text-slate-500 hover:text-slate-900">Close</button>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <input
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="max-h-72 overflow-auto space-y-2">
                {pickerLoading ? (
                  <div className="p-4 text-sm text-slate-500">Loading...</div>
                ) : pickerCourses.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">No courses found</div>
                ) : (
                  pickerCourses.map((c) => (
                    <div
                      key={c.courseId || c._id || c.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handlePickerSelect(c)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePickerSelect(c)}
                      className="w-full text-left p-3 rounded-md hover:bg-slate-50 flex items-center gap-3 cursor-pointer"
                    >
                      {c.uploadMaterials?.thumbnail || c.image ? (
                        <img src={c.uploadMaterials?.thumbnail || c.image} alt={c.title || c.courseTitle} className="w-12 h-12 rounded-md object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">{(c.title || c.courseTitle || '')?.[0] || '?'}</div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">{c.title || c.courseTitle || c.name}</div>
                        <div className="text-xs text-slate-500">{c.createdByName || c.institution || ''}</div>
                      </div>
                      <div className="text-xs text-slate-500">{c.priceDetails?.currentPrice || c.currentPrice || ''}</div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnroll(c);
                        }}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#007965] px-3 text-xs font-semibold text-white transition hover:bg-[#006252] shrink-0"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Enroll
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Compare;
