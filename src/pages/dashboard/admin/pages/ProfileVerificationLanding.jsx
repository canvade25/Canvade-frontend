import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Building2,
  Award,
  Users,
  GraduationCap,
  CheckCircle,
  UserCheck,
  Clock,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { useMyPlan } from "../../../../hooks/useMyPlan";

const EMPTY_PROFILE = {
  form: {
    name: "",
    ownerName: "",
    tagline: "",
    description: "",
    establishDate: "",
    phoneNumber: "",
    email: "",
    panCard: "",
    gstNumber: "",
  },
  highlights: {},
  customInputs: {},
  locations: [],
  verification: {},
};

const getVerificationFields = (verification = {}) => [
  {
    label: "Institute Name",
    value:
      verification.instituteName?.value ||
      verification.name?.value ||
      "Institute Name",
    verified:
      verification.instituteName?.verified ??
      verification.name?.verified ??
      true,
  },
  {
    label: "Owner Name",
    value:
      verification.ownerName?.value ||
      verification.owner?.value ||
      "Owner Name",
    verified:
      verification.ownerName?.verified ?? verification.owner?.verified ?? true,
  },
  {
    label: "Email",
    value: verification.email?.value || "Email",
    verified: verification.email?.verified ?? true,
  },
  {
    label: "Phone",
    value:
      verification.phoneNumber?.value ||
      verification.phone?.value ||
      "Phone Number",
    verified:
      verification.phoneNumber?.verified ??
      verification.phone?.verified ??
      true,
  },
  {
    label: "GST Number",
    value: verification.gstNumber?.value || "GST Number",
    verified: verification.gstNumber?.verified ?? true,
  },
  {
    label: "Address",
    value: verification.address?.value || "Address",
    verified: verification.address?.verified ?? true,
  },
];

const getVerificationDocs = (verification = {}) => [
  {
    name: "Institute Registration Certificate",
    status: verification.registration?.verified ? "Verified" : "Pending",
  },
  {
    name: "GST Certificate",
    status: verification.gstNumber?.verified ? "Verified" : "Pending",
  },
  {
    name: "PAN Card",
    status: verification.panCard?.verified ? "Verified" : "Pending",
  },
];

export default function ProfileVerificationLanding() {
  const navigate = useNavigate();
  const { plan } = useMyPlan();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllHighlights, setShowAllHighlights] = useState(false);

  // ─── Lightbox gallery state ────────────────────────────────────────────
  // Single boolean drives everything. No timers, no separate "mounted vs
  // visible" flags — that kind of split state is what was causing close
  // to silently fail (a stale timeout could re-open or re-close the
  // modal out of sequence). The modal is always mounted; visibility and
  // the fade/scale animation are both just CSS classes tied to this flag.
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const loadInstituteProfile = async () => {
      setIsLoading(true);

      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";
      const token =
        localStorage.getItem("token") || localStorage.getItem("Token");

      const parseIfJson = (value) => {
        if (typeof value !== "string") return value;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      };

      if (!token) {
        navigate("/admin/dashboard/profile/edit");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/institute/view/my-institute`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          return;
        }

        const rawData = await response.json();
        const payload =
          rawData?.data || rawData?.institute || rawData?.profile || rawData;
        const serverLocations = parseIfJson(payload.locations);
        const loadedHighlights = parseIfJson(payload.highlights) || {};
        const loadedCustomInputs = parseIfJson(payload.customInputs) || {};
        const media = payload.media || {};
        const firstLocation = Array.isArray(serverLocations)
          ? serverLocations[0]
          : null;

        const addressValue = firstLocation
          ? [
              firstLocation.addressLine1 || firstLocation.address1,
              firstLocation.addressLine2 || firstLocation.address2,
              firstLocation.city,
              firstLocation.state,
            ]
              .filter(Boolean)
              .join(", ")
          : "";
        const loadedVerification = {
          ...(payload.verification || rawData?.verification || {}),

          ownerName: {
            value: payload.ownerName || payload.form?.ownerName || "",
            verified: true,
          },

          instituteName: {
            value: payload.name || payload.form?.name || "",
            verified: true,
          },
          email: {
            value:
              payload.email ||
              payload.form?.email ||
              (payload.verification || rawData?.verification || {})?.email
                ?.value ||
              "",
            verified: true,
          },

          phoneNumber: {
            value:
              payload.phoneNumber ||
              payload.form?.phoneNumber ||
              (payload.verification || rawData?.verification || {})?.phoneNumber
                ?.value ||
              (payload.verification || rawData?.verification || {})?.phone
                ?.value ||
              "",
            verified: true,
          },

          gstNumber: {
            value:
              payload.gstNumber ||
              payload.form?.gstNumber ||
              (payload.verification || rawData?.verification || {})?.gstNumber
                ?.value ||
              "",
            verified: true,
          },
          address: {
            value: addressValue || "Address",
            verified: true,
          },

          logo: media.logo || "",
          video: media.video || "",
          photos: media.photos || [],
        };

        const loadedProfile = {
          form: {
            ...EMPTY_PROFILE.form,
            name: payload.name || payload.form?.name || "",
            ownerName: payload.ownerName || payload.form?.ownerName || "",
            tagline: payload.tagline || payload.form?.tagline || "",
            description: payload.description || payload.form?.description || "",
            establishDate:
              payload.establishDate || payload.form?.establishDate || "",
            phoneNumber: payload.phoneNumber || payload.form?.phoneNumber || "",
            email: payload.email || payload.form?.email || "",
            panCard: payload.panCard || payload.form?.panCard || "",
            gstNumber: payload.gstNumber || payload.form?.gstNumber || "",
          },
          highlights: loadedHighlights,
          customInputs: loadedCustomInputs,
          logo: loadedVerification.logo,
          video: loadedVerification.video,
          photos: loadedVerification.photos,
          verification: loadedVerification,
          locations: Array.isArray(serverLocations)
            ? serverLocations.map((location) => ({
                address1: location.addressLine1 || location.address1 || "",
                address2: location.addressLine2 || location.address2 || "",
                city: location.city || "",
                zip: location.zipCode || location.zip || "",
                state: location.state || "",
                country: location.country || "",
                mapLink: location.googleMapLink || location.mapLink || "",
                latitude: location.latitude || location.lat || "",
                longitude:
                  location.longitude || location.lng || location.long || "",
              }))
            : EMPTY_PROFILE.locations,
        };

        const meaningfulProfile = Boolean(
          loadedProfile.form.name?.trim() ||
          loadedProfile.form.ownerName?.trim() ||
          loadedProfile.form.tagline?.trim() ||
          loadedProfile.form.description?.trim() ||
          loadedProfile.locations?.length > 0 ||
          Object.values(loadedHighlights).flat().filter(Boolean).length > 0,
        );

        setProfile(loadedProfile);
        setHasProfile(meaningfulProfile);
      } catch (error) {
        console.error("Unable to load institute profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstituteProfile();
  }, []);

  const handleEdit = () => {
    navigate("/admin/dashboard/profile/edit");
  };

  const heroTitle = profile.form.name || "Institute Name";
  const heroTagline = profile.form.tagline || "Add your institute tagline here";
  const heroDescription =
    profile.form.description ||
    "Add your institute description to show what you offer and why students should choose you.";
  const locationText =
    profile.locations?.[0]?.address1 ||
    "Your institute location will appear here once added.";
  const primaryLocation = profile.locations?.[0] || {};
  const latitude = primaryLocation.latitude;
  const longitude = primaryLocation.longitude;
  const hasCoordinates = Boolean(latitude && longitude);
  const mapSrc = hasCoordinates
    ? `https://maps.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}&z=14&ie=UTF8&iwloc=&output=embed`
    : primaryLocation.mapLink ||
      `https://maps.google.com/maps?q=${encodeURIComponent(locationText)}&z=14&ie=UTF8&iwloc=&output=embed`;
  const googleMapsLink = hasCoordinates
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`
    : primaryLocation.mapLink ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`;
  const highlightList = Object.values(profile.highlights || {})
    .flat()
    .filter(Boolean);
  const verificationFields = getVerificationFields(profile.verification);
  const verificationDocs = getVerificationDocs(profile.verification);
  const mainImage =
    profile.photos?.[0] ||
    profile.logo ||
    "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80";
  const photos = profile.photos || [];

  // ─── Unified image list for the lightbox ───────────────────────────────
  // This is the key fix: previously the hero image (profile.logo) and the
  // gallery thumbnails (profile.photos) were two separate, unrelated
  // sources, but clicking either one opened an index into `photos` alone.
  // That's why clicking the hero (a logo) popped open an unrelated photo.
  // Now there is exactly ONE array behind everything you can click, so
  // whatever thumbnail you click is guaranteed to be the image that opens.
  const lightboxImages = [mainImage, ...photos];

  // Thumbnail strip shows photos[0] and photos[1] normally, and photos[2]
  // blurred with a "+N" overlay if there are more.
  const galleryImages = photos.slice(0, 2);
  const hasMorePhotos = photos.length > 2;
  const blurredThumbnail = hasMorePhotos ? photos[2] : null;
  const remainingPhotos = Math.max(0, photos.length - 2);

  // ─── Lightbox controls ──────────────────────────────────────────────────
  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) =>
      lightboxImages.length ? (prev + 1) % lightboxImages.length : 0,
    );
  }, [lightboxImages.length]);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      lightboxImages.length
        ? (prev - 1 + lightboxImages.length) % lightboxImages.length
        : 0,
    );
  }, [lightboxImages.length]);

  // Only close when the click lands directly on the backdrop itself, never
  // when it bubbles up from a child (image, buttons, counter, etc).
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  };

  // Keyboard navigation while the lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, showNext, showPrev]);

  return (
    <div className=" min-h-screen bg-slate-50 text-slate-800 antialiased">
      {hasProfile && !isLoading && (
        <div className=" max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 flex justify-end ">
          <button
            type="button"
            onClick={handleEdit}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0ea271] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Edit
          </button>
        </div>
      )}
      <main className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-6">
        <div className="rounded-[2rem] border border-gray-200 bg-white shadow-sm p-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid gap-8 xl:grid-cols-[1.2fr_1.6fr] animate-pulse">
                <div className="space-y-4">
                  <div className="h-[360px] w-full rounded-[1.5rem] bg-slate-200" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-28 rounded-2xl bg-slate-200" />
                    <div className="h-28 rounded-2xl bg-slate-200" />
                    <div className="h-28 rounded-2xl bg-slate-200" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="h-12 w-3/4 rounded-2xl bg-slate-200" />
                  <div className="h-6 w-1/2 rounded-2xl bg-slate-200" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 rounded-2xl bg-slate-200" />
                    <div className="h-12 rounded-2xl bg-slate-200" />
                    <div className="h-12 rounded-2xl bg-slate-200" />
                    <div className="h-12 rounded-2xl bg-slate-200" />
                  </div>
                  <div className="h-40 rounded-2xl bg-slate-200" />
                </div>
              </div>
            </div>
          ) : !hasProfile ? (
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-100 p-10 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Add your institute profile to get started.
                </p>
                <p className="mt-3 text-slate-600">
                  Your verification landing page will show institute details
                  here after setup.
                </p>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#007965] px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#006252]"
                >
                  Add Institute
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-8 xl:grid-cols-[1.2fr_1.6fr]">
                <div>
                  <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    className="relative overflow-hidden rounded-[1.5rem] border border-gray-200 cursor-pointer group w-full text-left p-0"
                  >
                    <div className="h-[360px] w-full bg-slate-100">
                      <img
                        src={mainImage}
                        alt="Institute"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                      />
                    </div>
                  </button>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {galleryImages.map((img, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => openLightbox(i + 1)}
                        className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-100 cursor-pointer group text-left p-0 border-0"
                      >
                        <img
                          src={img}
                          alt={`Gallery image ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                        />
                      </button>
                    ))}

                    {blurredThumbnail && (
                      <button
                        type="button"
                        onClick={() => openLightbox(3)}
                        className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-100 cursor-pointer group text-left p-0 border-0"
                      >
                        <img
                          src={blurredThumbnail}
                          alt="More photos"
                          className="h-full w-full object-cover blur-[2px] brightness-50 scale-105 transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-white text-xl font-bold drop-shadow-sm">
                            +{remainingPhotos}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl font-bold text-slate-900">
                        {heroTitle}
                      </h1>
                      {plan?.tier === "pro" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-600">
                          <Crown className="w-3.5 h-3.5" strokeWidth={2.5} />
                          PRO
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-xl text-slate-600">{heroTagline}</p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <span className="rounded-xl border border-gray-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                        Est. {profile.form.establishDate || "Year"}
                      </span>

                      {highlightList.length > 0 ? (
                        <>
                          {(showAllHighlights
                            ? highlightList
                            : highlightList.slice(0, 6)
                          ).map((item, index) => (
                            <span
                              key={`${item}-${index}`}
                              className="rounded-xl border border-gray-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                            >
                              {item}
                            </span>
                          ))}
                          {highlightList.length > 6 && (
                            <button
                              onClick={() =>
                                setShowAllHighlights(!showAllHighlights)
                              }
                              className="rounded-xl border border-gray-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer"
                            >
                              {showAllHighlights
                                ? "Hide"
                                : `+${highlightList.length - 6} more`}
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="rounded-xl border border-gray-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                          Accreditation
                        </span>
                      )}
                    </div>

                    <p className="mt-6 text-base leading-8 text-slate-600">
                      {heroDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-6">
                <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <UserCheck className="h-6 w-6 text-[#10b981]" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      Profile Verification Status
                    </h3>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {verificationFields.map((field, index) => (
                      <div
                        key={`${field.label}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">
                            {field.label}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {field.value}
                          </p>
                        </div>
                        {field.verified ? (
                          <CheckCircle className="h-5 w-5 text-[#10b981]" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Document Verification</h3>
                  <div className="flex flex-col gap-3">
                    {verificationDocs.map((doc, index) => (
                      <div key={`${doc.name}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="text-sm text-slate-700">{doc.name}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {doc.status === 'Verified' ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">
                    Location
                  </span>
                  {profile.locations?.[0]?.city && (
                    <span className="text-sm text-slate-500">
                      {profile.locations[0].city}, {profile.locations[0].state}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {locationText}
                </p>
                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
                  <iframe
                    title="Google Map"
                    width="100%"
                    height="320"
                    loading="lazy"
                    src={mapSrc}
                  />
                </div>
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <MapPin className="h-5 w-5 text-red-500" />
                  Open in Google Maps
                </a>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ─── Lightbox / slideshow gallery ──────────────────────────────────
          Always mounted; visibility + fade/scale animation are driven
          purely by the `lightboxOpen` boolean via CSS classes. This avoids
          any timing race between opening/closing that a setTimeout-based
          mount/unmount approach could hit. */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 transition-opacity duration-300 ease-out ${
          lightboxOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
        aria-hidden={!lightboxOpen}
      >
        <button
          type="button"
          onClick={handleCloseClick}
          className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Close gallery"
        >
          <X className="h-5 w-5 pointer-events-none" />
        </button>

        <div className="absolute top-5 left-5 z-20 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
          {lightboxIndex + 1} / {lightboxImages.length}
        </div>

        {lightboxImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-4 md:left-8 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6 pointer-events-none" />
          </button>
        )}

        <div className="relative max-w-5xl w-full flex items-center justify-center pointer-events-none">
          <div
            className={`transition-all duration-300 ease-out ${
              lightboxOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            {lightboxOpen && lightboxImages[lightboxIndex] && (
              <img
                key={lightboxIndex}
                src={lightboxImages[lightboxIndex]}
                alt={`Photo ${lightboxIndex + 1}`}
                className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
            )}
          </div>
        </div>

        {lightboxImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 md:right-8 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6 pointer-events-none" />
          </button>
        )}
      </div>
    </div>
  );
}
