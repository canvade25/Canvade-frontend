import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { tagColorMap } from "../components/Updates/UpdateCard";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

const getUpdateId = (item) => item?.updateId || item?._id || item?.id;

const formatPrice = (value) => {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number <= 0) return "Price on request";
  return `Rs. ${number.toLocaleString("en-IN")}`;
};

export default function UpdateDetail() {
  const { updateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [update, setUpdate] = useState(location.state?.update || null);
  const [isLoading, setIsLoading] = useState(!location.state?.update);
  const [notFound, setNotFound] = useState(false);

  const [relatedCourse, setRelatedCourse] = useState(null);
  const [isCourseLoading, setIsCourseLoading] = useState(false);

  // Track a view once per mount, regardless of visitor auth state.
  const viewedUpdateId = useRef(null);
  useEffect(() => {
    const id = getUpdateId(update);
    if (!id || viewedUpdateId.current === id) return;
    viewedUpdateId.current = id;
    fetch(`${API_BASE_URL}/api/updates/${id}/view`, { method: "POST" }).catch(
      (error) => console.error("Error tracking update view:", error),
    );
  }, [update]);

  // Full update data (images/tag/description/relatedCourse) already comes back
  // from the public /api/updates/all list, so a direct link / refresh can just
  // re-fetch that list and find the matching entry — no auth-gated endpoint needed.
  useEffect(() => {
    if (location.state?.update) {
      setUpdate(location.state.update);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const fetchUpdate = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/updates/all`);
        const data = await response.json();
        const match = Array.isArray(data?.data)
          ? data.data.find((item) => getUpdateId(item) === updateId)
          : null;
        if (!cancelled) {
          setUpdate(match || null);
          setNotFound(!match);
        }
      } catch (error) {
        console.error("Error fetching update:", error);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchUpdate();
    return () => {
      cancelled = true;
    };
  }, [updateId, location.state]);

  useEffect(() => {
    const courseId = update?.relatedCourse;
    if (!courseId) {
      setRelatedCourse(null);
      return;
    }

    let cancelled = false;
    const fetchCourse = async () => {
      setIsCourseLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`);
        const data = await response.json();
        if (!cancelled) setRelatedCourse(data?.success ? data.data : null);
      } catch (error) {
        console.error("Error fetching related course:", error);
        if (!cancelled) setRelatedCourse(null);
      } finally {
        if (!cancelled) setIsCourseLoading(false);
      }
    };

    fetchCourse();
    return () => {
      cancelled = true;
    };
  }, [update?.relatedCourse]);

  const images = Array.from(
    new Set([update?.thumbnail, ...(update?.images || [])].filter(Boolean)),
  );
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [update]);

  const tagClass =
    tagColorMap[update?.tag] || "bg-gray-50 text-gray-700 border border-gray-100";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-24">
        <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to Updates
          </button>

          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                <p className="text-sm font-semibold text-slate-700">
                  Loading update...
                </p>
              </div>
            </div>
          ) : notFound || !update ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-8 py-20 text-center">
              <h2 className="mb-2 text-xl font-bold text-slate-950">
                Update not found
              </h2>
              <p className="mb-6 text-sm text-slate-600">
                This update may have been removed.
              </p>
              <button
                type="button"
                onClick={() => navigate("/updates")}
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Back to Updates
              </button>
            </div>
          ) : (
            <article className="space-y-8">
              {/* Images */}
              {images.length > 0 && (
                <div className="space-y-3">
                  <div className="h-64 w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-96">
                    <img
                      src={images[activeImage]}
                      alt={update.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/900x500?text=No+Image";
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto">
                      {images.map((src, index) => (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          onClick={() => setActiveImage(index)}
                          className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            index === activeImage
                              ? "border-emerald-500"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={src} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tag */}
              <span
                className={`inline-block w-fit rounded-md px-2.5 py-1 text-[11px] font-bold ${tagClass}`}
              >
                {update.tag}
              </span>

              {/* Heading */}
              <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                {update.title}
              </h1>

              {update.createdAt && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={15} />
                  {new Date(update.createdAt).toLocaleDateString()}
                </div>
              )}

              {/* Full body text */}
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-gray-700">
                {update.description}
              </p>

              {Array.isArray(update.keywords) && update.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {update.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              {/* Related Course */}
              {update.relatedCourse && (
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <BookOpen size={16} />
                    Related Course
                  </h2>

                  {isCourseLoading ? (
                    <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
                  ) : relatedCourse ? (
                    <button
                      type="button"
                      onClick={() => {
                        const id = getUpdateId(update);
                        if (id) {
                          fetch(`${API_BASE_URL}/api/updates/${id}/click`, {
                            method: "POST",
                          }).catch((error) =>
                            console.error("Error tracking update click:", error),
                          );
                        }
                        navigate(`/courseview/${update.relatedCourse}`);
                      }}
                      className="group flex w-full items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={
                            relatedCourse.uploadMaterials?.thumbnail ||
                            relatedCourse.thumbnail ||
                            "course.png"
                          }
                          alt=""
                          onError={(e) => {
                            e.currentTarget.src = "course.png";
                          }}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="truncate font-bold text-gray-900">
                          {relatedCourse.basicDetails?.courseTitle ||
                            relatedCourse.title ||
                            "View course"}
                        </p>
                        <p className="text-sm font-semibold text-emerald-700">
                          {formatPrice(
                            relatedCourse.priceDetails?.currentPrice ||
                              relatedCourse.currentPrice,
                          )}
                        </p>
                      </div>
                      <ArrowRight
                        size={18}
                        className="flex-shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                      />
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      This course is no longer available.
                    </p>
                  )}
                </div>
              )}
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
