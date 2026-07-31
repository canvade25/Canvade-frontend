import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Plus,
  MapPin,
  ChevronLeft,
  Play,
  Image as ImageIcon,
  Video,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const HIGHLIGHTS = {
  "Recognition & Affiliation": [
    "UGC Recognized",
    "Central University",
    "State University",
    "Deemed University",
    "Private University UGC Recognized",
    "Affiliated to University",
    "Autonomous College",
    "Constituent College",
    "CBSE Affiliated",
    "CISCE (ICSE/ISC) Affiliated",
    "State Board Affiliated",
    "NIOS Affiliated",
    "IB School",
    "Cambridge International",
  ],
  "Quality & Accreditation": [
    "NAAC A++",
    "NAAC A+",
    "NAAC A",
    "NAAC B++",
    "NAAC B+",
  ],
  "Professional & Regulatory Approvals": [
    "AICTE Approved",
    "NMC Approved",
    "DCI Approved",
    "INC Approved",
    "PCI Approved",
    "BCI Approved",
    "CoA Approved",
    "NCTE Approved",
  ],
  "Skill & Vocational Trust": [
    "NSDC Partner",
    "NSQF Aligned",
    "Skill India Partner",
    "Sector Skill Council Certified",
  ],
  "Operational Certifications": [
    "ISO 9001 Certified",
    "ISO 21001 Certified",
    "Government Registered Institution",
    "Registered Trust",
    "Registered Society",
    "Section 8 Company",
  ],
  "International Quality": [
    "AACSB Accredited",
    "EQUIS Accredited",
    "AMBA Accredited",
    "ABET Accredited",
  ],
};

const parseStoredJson = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const getValueAtPath = (source, path) => {
  if (!source || !path) return "";
  let current = source;

  for (const segment of path.split(".")) {
    if (!current || typeof current !== "object") return "";
    current = current[segment];
  }

  return typeof current === "string" && current.trim() ? current : "";
};

const resolveInstituteProfileId = (...sources) => {
  const paths = [
    "instituteId",
    "institute_id",
    "profileId",
    "profile_id",
    "ownerId",
    "owner_id",
    "userId",
    "user_id",
    "uid",
    "firebaseUid",
    "firebase_uid",
    "_id",
    "id",
    "user._id",
    "user.id",
    "user.uid",
  ];

  for (const source of sources) {
    for (const path of paths) {
      const value = getValueAtPath(source, path);
      if (value) return value;
    }
  }

  return "";
};

const getStoredIdHints = () => ({
  instituteId: localStorage.getItem("instituteId"),
  institute_id: localStorage.getItem("institute_id"),
  profileId: localStorage.getItem("profileId"),
  profile_id: localStorage.getItem("profile_id"),
  ownerId: localStorage.getItem("ownerId"),
  owner_id: localStorage.getItem("owner_id"),
  userId: localStorage.getItem("userId"),
  user_id: localStorage.getItem("user_id"),
  uid: localStorage.getItem("uid"),
});

// ─── Sub-components ───────────────────────────────────────────────────────────

const Label = ({ children, required }) => (
  <label
    style={{
      display: "block",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "#6b7280",
      marginBottom: 6,
      textTransform: "uppercase",
    }}
  >
    {children}
    {required && <span style={{ color: "#10b981", marginLeft: 2 }}>*</span>}
  </label>
);

const Input = ({
  placeholder,
  value,
  onChange,
  style = {},
  readOnly = false,
  ...props
}) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    style={{
      width: "100%",
      padding: "11px 14px",
      border: "1.5px solid #e5e7eb",
      borderRadius: 10,
      fontSize: 14,
      color: "#111827",
      outline: "none",
      background: readOnly ? "#f8fafc" : "#fff",
      boxSizing: "border-box",
      transition: "border 0.2s",
      cursor: readOnly ? "not-allowed" : "text",
      ...style,
    }}
    onFocus={(e) => (e.target.style.borderColor = "#10b981")}
    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
    {...props}
  />
);

const Select = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "11px 14px",
      border: "1.5px solid #e5e7eb",
      borderRadius: 10,
      fontSize: 14,
      color: "#111827",
      outline: "none",
      background: "#fff",
      boxSizing: "border-box",
      transition: "border 0.2s",
    }}
    onFocus={(e) => (e.target.style.borderColor = "#10b981")}
    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
  >
    {children}
  </select>
);

const Textarea = ({ placeholder, value, onChange, rows = 4 }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    style={{
      width: "100%",
      padding: "11px 14px",
      border: "1.5px solid #e5e7eb",
      borderRadius: 10,
      fontSize: 14,
      color: "#111827",
      outline: "none",
      background: "#fff",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "inherit",
      transition: "border 0.2s",
    }}
    onFocus={(e) => (e.target.style.borderColor = "#10b981")}
    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
  />
);

const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: "#fff",
      border: "1.5px solid #e5e7eb",
      borderRadius: 16,
      padding: "28px 32px",
      marginBottom: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ marginBottom: 20 }}>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
      {children}
    </h3>
    <div style={{ height: 2, background: "#f3f4f6", marginTop: 10 }} />
  </div>
);
const generateFacultyCode = (index) => {
  return `FAC-${String(index + 1).padStart(3, "0")}`;
};

const emptyFaculty = (index = 0) => ({
  profileImage: null,
  name: "",
  facultyCode: generateFacultyCode(index),
  subjects: [],
  subjectInput: "",
  experience: "",
});

// ─── Image Upload Section ─────────────────────────────────────────────────────

const ImageUploadSection = ({
  logo,
  setLogo,
  video,
  setVideo,
  photos,
  setPhotos,
}) => {
  const logoRef = useRef();
  const videoRef = useRef();
  const photoRef = useRef();

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) setLogo({ file, url: URL.createObjectURL(file) });
  };
  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file)
      setVideo({ file, url: URL.createObjectURL(file), name: file.name });
  };
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 15 - photos.length;
    const toAdd = files
      .slice(0, remaining)
      .map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPhotos((prev) => [...prev, ...toAdd]);
  };

  // FIX: removal handlers now take the event, stop it from bubbling/being
  // intercepted by anything above them (e.g. a wrapping <form>), and
  // explicitly preventDefault so nothing else on the page can react to
  // the same click before React updates state.
  const removeLogo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogo(null);
  };
  const removeVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVideo(null);
  };
  const removePhoto = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const UploadBox = ({ onClick, children, height = 120, style = {} }) => (
    <div
      onClick={onClick}
      style={{
        border: "2px dashed #d1fae5",
        borderRadius: 12,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: "#f0fdf4",
        transition: "all 0.2s",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#10b981";
        e.currentTarget.style.background = "#dcfce7";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#d1fae5";
        e.currentTarget.style.background = "#f0fdf4";
      }}
    >
      {children}
    </div>
  );

  return (
    <Card>
      <SectionTitle>Media & Branding</SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        {/* Logo */}
        <div>
          <Label required>Institute Logo</Label>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleLogo}
          />
          {logo ? (
            // CHANGE — logo preview height
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                height: 220, // ye theek hai
                border: "1.5px solid #e5e7eb",
                background: "#fff",
              }}
            >
              <img
                src={logo.url}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "20px",
                  background: "#fff",
                }}
              />
              <button
                type="button"
                onClick={removeLogo}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  pointerEvents: "auto",
                }}
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <UploadBox onClick={() => logoRef.current.click()} height={220}>
              <ImageIcon size={32} color="#10b981" />
              <span style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
                Upload Logo
              </span>
            </UploadBox>
          )}
        </div>

        {/* Video */}
        <div>
          <Label>
            Intro Video{" "}
            <span
              style={{
                color: "#9ca3af",
                fontWeight: 400,
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
            >
              (max 1 min)
            </span>
          </Label>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={handleVideo}
          />
          {video ? (
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                height: 220,
                border: "1.5px solid #e5e7eb",
                background: "#111",
              }}
            >
              <video
                src={video.url}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.3)",
                  pointerEvents: "none",
                }}
              >
                <Play size={28} color="#fff" fill="#fff" />
              </div>
              <button
                type="button"
                onClick={removeVideo}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  pointerEvents: "auto",
                }}
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <UploadBox onClick={() => videoRef.current.click()} height={220}>
              <Video size={32} color="#10b981" />
              <span style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
                Upload Video
              </span>
            </UploadBox>
          )}
        </div>

        {/* Photos */}
        <div>
          <Label>
            Photos{" "}
            <span
              style={{
                color: "#9ca3af",
                fontWeight: 400,
                textTransform: "none",
              }}
            >
              (2–15 photos)
            </span>
          </Label>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handlePhotos}
          />
          {photos.length === 0 ? (
            <UploadBox onClick={() => photoRef.current.click()} height={220}>
              <Plus size={32} color="#10b981" />
              <span style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
                Add Photos
              </span>
            </UploadBox>
          ) : (
            <div
              style={{
                border: "1.5px solid #e5e7eb",
                borderRadius: 12,
                padding: 10,
                height: 220,
                background: "#fff",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
                  gap: 8,
                }}
              >
                {photos.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      borderRadius: 8,
                      overflow: "hidden",
                      height: 90,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <img
                      src={p.url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => removePhoto(e, i)}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        zIndex: 2,
                        background: "rgba(0,0,0,0.65)",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                        color: "#fff",
                        pointerEvents: "auto",
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {photos.length < 15 && (
                  <div
                    onClick={() => photoRef.current.click()}
                    style={{
                      height: 90,
                      border: "2px dashed #d1fae5",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: "#f0fdf4",
                    }}
                  >
                    <Plus size={22} color="#10b981" />
                  </div>
                )}
              </div>
            </div>
          )}
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
            {photos.length}/15 photos added
          </p>
        </div>
      </div>
    </Card>
  );
};

// ─── Highlights Section ───────────────────────────────────────────────────────

const HighlightsSection = ({
  selected,
  setSelected,
  customInputs,
  setCustomInputs,
}) => {
  const toggle = (cat, item) => {
    setSelected((prev) => {
      const current = prev[cat] || [];
      const exists = current.includes(item);
      const next = exists
        ? current.filter((i) => i !== item)
        : [...current, item];
      return { ...prev, [cat]: next };
    });
  };
  const addCustom = (cat, val) => {
    if (!val.trim()) return;
    toggle(cat, val.trim());
    setCustomInputs((prev) => ({ ...prev, [cat]: "" }));
  };

  return (
    <Card>
      <SectionTitle>Highlights</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {Object.entries(HIGHLIGHTS).map(([cat, items]) => (
          <div key={cat}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 10,
              }}
            >
              {cat}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 10,
              }}
            >
              {items.map((item) => {
                const active = (selected[cat] || []).includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggle(cat, item)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      border: active
                        ? "1.5px solid #10b981"
                        : "1.5px solid #e5e7eb",
                      background: active ? "#ecfdf5" : "#f9fafb",
                      color: active ? "#065f46" : "#6b7280",
                      transition: "all 0.15s",
                    }}
                  >
                    {active && <span style={{ marginRight: 4 }}>✓</span>}
                    {item}
                  </button>
                );
              })}
              {[...(selected[cat] || [])]
                .filter((i) => !items.includes(i))
                .map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggle(cat, item)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      border: "1.5px solid #10b981",
                      background: "#ecfdf5",
                      color: "#065f46",
                      transition: "all 0.15s",
                    }}
                  >
                    ✓ {item}
                  </button>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8, maxWidth: 360 }}>
              <input
                placeholder="Add custom..."
                value={customInputs[cat] || ""}
                onChange={(e) =>
                  setCustomInputs((prev) => ({
                    ...prev,
                    [cat]: e.target.value,
                  }))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && addCustom(cat, customInputs[cat] || "")
                }
                style={{
                  flex: 1,
                  padding: "7px 12px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  outline: "none",
                  color: "#111827",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                type="button"
                onClick={() => addCustom(cat, customInputs[cat] || "")}
                style={{
                  padding: "7px 14px",
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ─── Locations Section ────────────────────────────────────────────────────────

const emptyLocation = () => ({
  address1: "",
  address2: "",
  city: "",
  zip: "",
  state: "",
  country: "",
  mapLink: "",
});

const LOCATION_FIELDS = [
  ["address1", "Address Line 1", false],
  ["address2", "Address Line 2", false],
  ["city", "City", false],
  ["zip", "Zip Code", true], // FIX: Zip Code is now marked required
  ["state", "State", false],
  ["country", "Country", false],
];

const LocationsSection = ({ locations, setLocations }) => {
  const update = (i, field, val) =>
    setLocations((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)),
    );
  const add = () => setLocations((prev) => [...prev, emptyLocation()]);
  const remove = (i) =>
    setLocations((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <Card>
      <SectionTitle>Locations</SectionTitle>
      {locations.map((loc, i) => (
        <div
          key={i}
          style={{
            border: "1.5px solid #e5e7eb",
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            background: "#fafafa",
            position: "relative",
          }}
        >
          {locations.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "#fee2e2",
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
                color: "#ef4444",
                fontSize: 12,
              }}
            >
              Remove
            </button>
          )}
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 14,
            }}
          >
            <MapPin
              size={14}
              style={{ marginRight: 4, verticalAlign: "middle" }}
            />
            Location {i + 1}
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {LOCATION_FIELDS.map(([f, lbl, required]) => (
              <div key={f}>
                <Label required={required}>{lbl}</Label>
                <Input
                  value={loc[f]}
                  onChange={(e) => update(i, f, e.target.value)}
                  placeholder={lbl}
                />
              </div>
            ))}
            <div style={{ gridColumn: "span 2" }}>
              <Label required>Google Map Link</Label>
              <Input
                value={loc.mapLink}
                onChange={(e) => update(i, "mapLink", e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "9px 18px",
          border: "1.5px dashed #10b981",
          borderRadius: 10,
          background: "#f0fdf4",
          color: "#10b981",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        <Plus size={16} /> Add More Locations
      </button>
    </Card>
  );
};

const FacultySection = ({ faculties, setFaculties }) => {
  const updateFaculty = (index, field, value) => {
    setFaculties((current) =>
      current.map((faculty, facultyIndex) =>
        facultyIndex === index ? { ...faculty, [field]: value } : faculty,
      ),
    );
  };

  const addFaculty = () =>
    setFaculties((current) => [...current, emptyFaculty(current.length)]);

  const removeFaculty = (index) => {
    setFaculties((current) =>
      current.filter((_, facultyIndex) => facultyIndex !== index),
    );
  };

  const addSubject = (index) => {
    const value = String(faculties[index]?.subjectInput || "").trim();
    if (!value) return;

    setFaculties((current) =>
      current.map((faculty, facultyIndex) =>
        facultyIndex === index
          ? {
            ...faculty,
            subjects: faculty.subjects.includes(value)
              ? faculty.subjects
              : [...faculty.subjects, value],
            subjectInput: "",
          }
          : faculty,
      ),
    );
  };

  const removeSubject = (facultyIndex, subject) => {
    setFaculties((current) =>
      current.map((faculty, index) =>
        index === facultyIndex
          ? {
            ...faculty,
            subjects: faculty.subjects.filter((item) => item !== subject),
          }
          : faculty,
      ),
    );
  };

  const handleProfileImage = (index, file) => {
    if (!file) return;
    updateFaculty(index, "profileImage", {
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    });
  };

  return (
    <Card>
      <SectionTitle>Add Faculty</SectionTitle>
      {faculties.map((faculty, index) => (
        <div
          key={index}
          style={{
            border: "1.5px solid #e5e7eb",
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            background: "#fafafa",
            position: "relative",
          }}
        >
          {faculties.length > 1 && (
            <button
              type="button"
              onClick={() => removeFaculty(index)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "#fee2e2",
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
                color: "#ef4444",
                fontSize: 12,
              }}
            >
              Remove
            </button>
          )}

          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 14,
            }}
          >
            Faculty {index + 1}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr 1fr",
              gap: 14,
              alignItems: "end",
            }}
          >
            <div>
              <Label>Profile Image</Label>
              <label
                style={{
                  height: 96,
                  border: "2px dashed #d1fae5",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f0fdf4",
                  cursor: "pointer",
                  overflow: "hidden",
                  color: "#059669",
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {faculty.profileImage?.url ? (
                  <img
                    src={faculty.profileImage.url}
                    alt={faculty.name || "Faculty"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "Click to upload"
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleProfileImage(index, e.target.files?.[0])
                  }
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div>
              <Label>Name</Label>
              <Input
                placeholder="Faculty name"
                value={faculty.name}
                onChange={(e) => updateFaculty(index, "name", e.target.value)}
              />
            </div>

            <div>
              <Label>Faculty Code</Label>
              <Input value={faculty.facultyCode} readOnly />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 14,
              marginTop: 16,
            }}
          >
            <div>
              <Label>Subject Teacher</Label>
              <div style={{ display: "flex", gap: 10 }}>
                <Input
                  placeholder="Write subject"
                  value={faculty.subjectInput}
                  onChange={(e) =>
                    updateFaculty(index, "subjectInput", e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubject(index);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addSubject(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0 16px",
                    border: "1.5px solid #10b981",
                    borderRadius: 10,
                    background: "#10b981",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Plus size={15} /> Add
                </button>
              </div>

              {faculty.subjects.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  {faculty.subjects.map((subject) => (
                    <span
                      key={subject}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#ecfdf5",
                        color: "#047857",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => removeSubject(index, subject)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#047857",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        aria-label={`Remove ${subject}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Experience</Label>
              <Input
                placeholder="e.g. 5 Years"
                value={faculty.experience}
                onChange={(e) =>
                  updateFaculty(index, "experience", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addFaculty}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "9px 18px",
          border: "1.5px dashed #10b981",
          borderRadius: 10,
          background: "#f0fdf4",
          color: "#10b981",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        <Plus size={16} /> Add More Faculty
      </button>
    </Card>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InstituteProfileForm() {
  const DEFAULT_FORM = {
    name: "",
    institutionType: "",
    ownerName: "",
    tagline: "",
    description: "",
    establishDate: "",
    phoneNumber: "",
    email: "",
    panCard: "",
    gstNumber: "",
  };

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [logo, setLogo] = useState(null);
  const [video, setVideo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [highlights, setHighlights] = useState({});
  const [customInputs, setCustomInputs] = useState({});
  const [locations, setLocations] = useState([emptyLocation()]);
  const [faculties, setFaculties] = useState([emptyFaculty(0)]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileId, setProfileId] = useState("");

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

      const readValueAtPath = (source, path) => {
        if (!source || !path) return "";
        const segments = path.split(".");
        let current = source;

        for (const segment of segments) {
          if (!current || typeof current !== "object") return "";
          current = current[segment];
        }

        if (typeof current === "string" && current.trim()) return current;
        if (typeof current === "number" && Number.isFinite(current))
          return String(current);
        return "";
      };

      const resolveField = (source, paths = []) => {
        for (const path of paths) {
          const value = readValueAtPath(source, path);
          if (value) return value;
        }
        return "";
      };

      const storedUser = parseIfJson(localStorage.getItem("user")) || {};
      const storedProfileId = resolveInstituteProfileId(
        storedUser,
        getStoredIdHints(),
      );

      const resolvedPhone = (source) =>
        resolveField(source, [
          "phoneNumber",
          "phone_number",
          "phone",
          "mobile",
          "mobileNumber",
          "mobile_number",
          "contactNumber",
          "contact_number",
          "contact.phoneNumber",
          "contact.phone_number",
          "contact.phone",
          "contactInfo.phoneNumber",
          "contactInfo.phone_number",
          "verification.phoneNumber.value",
          "verification.phone_number.value",
          "form.phoneNumber",
          "form.phone_number",
        ]);

      const resolvedEmail = (source) =>
        resolveField(source, [
          "email",
          "emailId",
          "email_id",
          "emailAddress",
          "email_address",
          "contactEmail",
          "contact_email",
          "contact.email",
          "contact.emailAddress",
          "contactInfo.email",
          "contactInfo.emailAddress",
          "verification.email.value",
          "form.email",
        ]);

      const resolvedOwnerName = (source) =>
        resolveField(source, [
          "ownerName",
          "owner_name",
          "owner.name",
          "owner.fullName",
          "owner.full_name",
          "ownerId.name",
          "ownerId.fullName",
          "owner_id.name",
          "ownerDetails.name",
          "ownerDetails.fullName",
          "createdBy.name",
          "createdBy.fullName",
          "user.ownerName",
          "user.owner_name",
          "contactPerson",
          "contact_person",
          "verification.ownerName.value",
          "verification.owner.value",
          "form.ownerName",
        ]) || "";

      const resolvedPan = (source) =>
        resolveField(source, [
          "panCard",
          "pan_card",
          "pan",
          "panNumber",
          "pan_number",
          "panNo",
          "pan_no",
          "taxDetails.panCard",
          "taxDetails.pan_card",
          "verification.panCard.value",
          "verification.pan_card.value",
          "form.panCard",
        ]);

      const resolvedGst = (source) =>
        resolveField(source, [
          "gstNumber",
          "gst_number",
          "gst",
          "gstNo",
          "gst_no",
          "gstin",
          "gstIn",
          "taxDetails.gstNumber",
          "taxDetails.gst_number",
          "verification.gstNumber.value",
          "verification.gst_number.value",
          "form.gstNumber",
        ]);
      const resolvedInstitutionType = (source) =>
        resolveField(source, [
          "instituteType",
          "institute_type",
          "instituteType",
          "institute_type",
          "organizationType",
          "organization_type",
          "verification.institutionType.value",
          "verification.instituteType.value",
          "type",
          "category",
          "form.institutionType",
        ]);

      const normalizeInstitutionType = (value) => {
        const normalized = String(value || "")
          .trim()
          .toLowerCase();
        const typeMap = {
          institute: "Institute",
          institution: "Institute",
          academy: "Academy",
          school: "School",
          college: "College",
          university: "University",
        };

        return typeMap[normalized] || value || "";
      };

      try {
        if (!token) {
          throw new Error(
            "Authorization token is missing. Please login again.",
          );
        }

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
          setForm((current) => ({
            ...current,
            name:
              current.name ||
              storedUser.instituteName ||
              storedUser.institutionName ||
              storedUser.registeredName ||
              storedUser.name ||
              "",
            ownerName: current.ownerName || resolvedOwnerName(storedUser),
            phoneNumber: current.phoneNumber || resolvedPhone(storedUser),
            email: current.email || resolvedEmail(storedUser),
            panCard: current.panCard || resolvedPan(storedUser),
            gstNumber: current.gstNumber || resolvedGst(storedUser),
            institutionType:
              current.institutionType ||
              normalizeInstitutionType(resolvedInstitutionType(storedUser)),
          }));
          setProfileId(storedProfileId);
          setHasProfile(false);
          return;
        }

        const rawData = await response.json();
        const data =
          rawData?.institute || rawData?.data || rawData?.profile || rawData;
        const resolvedProfileId =
          rawData?.institute?._id ||
          rawData?.data?._id ||
          rawData?.profile?._id ||
          rawData?._id ||
          rawData?.institute?.id ||
          rawData?.data?.id ||
          rawData?.profile?.id ||
          rawData?.id ||
          data?._id ||
          data?.id ||
          resolveInstituteProfileId(
            data,
            rawData,
            storedUser,
            getStoredIdHints(),
          ) ||
          "";

        const serverLocations = parseIfJson(data.locations);
        const serverFaculties = parseIfJson(data.faculties);
        const loadedHighlights = parseIfJson(data.highlights) || {};

        const meaningfulProfile = Boolean(
          data?.name?.trim() ||
          resolvedOwnerName(data) ||
          data?.tagline?.trim() ||
          data?.description?.trim() ||
          resolvedPhone(data) ||
          resolvedEmail(data) ||
          resolvedPan(data) ||
          resolvedGst(data) ||
          (Array.isArray(serverLocations) && serverLocations.length > 0) ||
          Object.values(loadedHighlights).flat().filter(Boolean).length > 0,
        );

        setForm({
          ...DEFAULT_FORM,
          name:
            data.name ||
            storedUser.instituteName ||
            storedUser.institutionName ||
            storedUser.registeredName ||
            storedUser.name ||
            "",
          institutionType: normalizeInstitutionType(
            resolvedInstitutionType(data) ||
            resolvedInstitutionType(storedUser),
          ),
          ownerName: resolvedOwnerName(data) || resolvedOwnerName(storedUser),
          tagline: data.tagline || "",
          description: data.description || "",
          establishDate: data.establishDate || "",
          phoneNumber: resolvedPhone(data) || resolvedPhone(storedUser),
          email: resolvedEmail(data) || resolvedEmail(storedUser),
          panCard: resolvedPan(data) || resolvedPan(storedUser),
          gstNumber: resolvedGst(data) || resolvedGst(storedUser),
        });

        setHighlights(loadedHighlights);
        setCustomInputs(parseIfJson(data.customInputs) || {});
        setProfileId(resolvedProfileId);
        setLocations(
          Array.isArray(serverLocations) && serverLocations.length > 0
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
            : [emptyLocation()],
        );
        setFaculties(
          Array.isArray(serverFaculties) && serverFaculties.length > 0
            ? serverFaculties.map((faculty) => ({
              profileImage: faculty.profileImage
                ? {
                  url: faculty.profileImage.url || faculty.profileImage,
                  name: faculty.profileImage.name || "",
                }
                : null,
              name: faculty.name || "",
              facultyCode: faculty.facultyCode || faculty.code || "",
              subjects: Array.isArray(faculty.subjects)
                ? faculty.subjects.filter(Boolean)
                : faculty.subject
                  ? [faculty.subject]
                  : [],
              subjectInput: "",
              experience: faculty.experience || "",
            }))
            : [emptyFaculty()],
        );
        const media = data.media || {};

        setLogo(
          media.logo
            ? {
              url: media.logo,
              file: null,
            }
            : null,
        );

        setVideo(
          media.video
            ? {
              url: media.video,
              file: null,
              name: media.video.split("/").pop(),
            }
            : null,
        );

        setPhotos(
          Array.isArray(media.photos)
            ? media.photos.map((url) => ({
              url,
              file: null,
            }))
            : [],
        );
        setHasProfile(meaningfulProfile);
      } catch (error) {
        console.error("Failed to load institute profile", error);
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstituteProfile();
  }, []);

  const setField = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const submitProfile = async () => {
    setSubmitError("");

    const missingMapLink = locations.some(
      (location) => !String(location.mapLink || "").trim(),
    );
    if (missingMapLink) {
      setSubmitError("Google Map Link is required for every location.");
      return;
    }

    // FIX: Zip Code is now required for every location, same pattern as
    // the Google Map Link check above.
    const missingZip = locations.some(
      (location) => !String(location.zip || "").trim(),
    );
    if (missingZip) {
      setSubmitError("Zip Code is required for every location.");
      return;
    }

    setIsSubmitting(true);

    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";
    const token =
      localStorage.getItem("token") || localStorage.getItem("Token");
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("ownerName", form.ownerName);
    formData.append("instituteType", form.institutionType);
    formData.append("tagline", form.tagline);
    formData.append("description", form.description);
    formData.append("establishDate", form.establishDate);

    formData.append("phoneNumber", form.phoneNumber);
    formData.append("email", form.email);
    formData.append("panCard", form.panCard);
    formData.append("gstNumber", form.gstNumber);

    formData.append("highlights", JSON.stringify(highlights));
    formData.append("customInputs", JSON.stringify(customInputs));

    formData.append(
      "locations",
      JSON.stringify(
        locations.map((location) => ({
          addressLine1: location.address1,
          addressLine2: location.address2,
          city: location.city,
          zipCode: location.zip,
          state: location.state,
          country: location.country,
          googleMapLink: location.mapLink,
        })),
      ),
    );

    const facultyData = faculties.map((faculty) => {
      if (faculty.profileImage?.file) {
        formData.append("facultyImages", faculty.profileImage.file);
      }

      return {
        name: faculty.name,
        facultyCode: faculty.facultyCode,
        subjects: faculty.subjects,
        experience: faculty.experience,

        profileImage: faculty.profileImage
          ? {
            hasNewImage: !!faculty.profileImage.file,
            url: faculty.profileImage.url || "",
            name: faculty.profileImage.name || "",
          }
          : null,
      };
    });

    formData.append("faculties", JSON.stringify(facultyData));

    if (logo?.file) {
      formData.append("logo", logo.file);
    }
    if (video?.file) {
      formData.append("video", video.file);
    }
    photos.forEach((photo) => {
      if (photo.file) {
        formData.append("photos", photo.file);
      }
    });

    try {
      const submitToEndpoint = async (endpoint, method = "POST") => {
        const response = await fetch(endpoint, {
          method,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const message = errorBody?.message || `API error: ${response.status}`;
          throw new Error(message);
        }

        return response.json();
      };

      const submitToFirstAvailable = async (requests) => {
        let lastError;

        for (const request of requests) {
          try {
            return await submitToEndpoint(request.endpoint, request.method);
          } catch (error) {
            lastError = error;
            if (!String(error.message || "").includes("404")) throw error;
          }
        }

        throw lastError;
      };

      const storedUser = parseStoredJson(localStorage.getItem("user")) || {};
      const effectiveProfileId =
        profileId || resolveInstituteProfileId(storedUser, getStoredIdHints());

      if (hasProfile && effectiveProfileId) {
        await submitToFirstAvailable([
          {
            endpoint: `${API_BASE_URL}/api/institute/update-profile/${effectiveProfileId}`,
            method: "PATCH",
          },
          {
            endpoint: `${API_BASE_URL}/api/institute/update/${effectiveProfileId}`,
            method: "PATCH",
          },
        ]);
      } else {
        await submitToEndpoint(`${API_BASE_URL}/api/institute/create-profile`, "POST");
      }

      navigate("/admin/dashboard/profile");
    } catch (error) {
      console.error("Profile submission failed:", error);
      setSubmitError(error.message || "Unable to submit profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div className="mb-8 flex items-start justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard/profile")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Profile
        </button>
      </div>

      {activeTab === "basic" && (
        <div>
          <ImageUploadSection
            logo={logo}
            setLogo={setLogo}
            video={video}
            setVideo={setVideo}
            photos={photos}
            setPhotos={setPhotos}
          />

          <Card>
            <SectionTitle>Course Identity</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div>
                <Label required>Institute Name</Label>
                <Input
                  placeholder="e.g. ExcelR Solutions"
                  value={form.name}
                  onChange={setField("name")}
                  readOnly={false}
                />
              </div>
              <div>
                <Label required>Institution Type</Label>
                <Select
                  value={form.institutionType}
                  onChange={setField("institutionType")}
                >
                  <option value="">Select institution type</option>
                  <option value="Institute">Institute</option>
                  <option value="Academy">Academy</option>
                  <option value="School">School</option>
                  <option value="College">College</option>
                  {/* <option value="University">University</option> */}
                </Select>
              </div>
              <div>
                <Label>Owner Name</Label>
                <Input
                  placeholder="e.g. Rajesh Kumar"
                  value={form.ownerName}
                  onChange={setField("ownerName")}
                  readOnly={false}
                />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Tagline</Label>
              <Input
                placeholder="e.g. Empowering future leaders"
                value={form.tagline}
                onChange={setField("tagline")}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe what this institute is about..."
                value={form.description}
                onChange={setField("description")}
                rows={5}
              />
            </div>
            <div style={{ maxWidth: 260 }}>
              <Label>Establish Date</Label>
              <input
                type="date"
                value={form.establishDate}
                onChange={setField("establishDate")}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#111827",
                  outline: "none",
                  background: "#fff",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 20,
                marginTop: 20,
              }}
            >
              <div>
                <Label required>Phone Number</Label>
                <Input
                  placeholder="+91 98765 43210"
                  value={form.phoneNumber}
                  onChange={setField("phoneNumber")}
                />
              </div>
              <div>
                <Label required>Email</Label>
                <Input
                  placeholder="contact@institute.com"
                  value={form.email}
                  onChange={setField("email")}
                />
              </div>
              <div>
                <Label>PAN Card</Label>
                <Input
                  placeholder="ABCDE1234F"
                  value={form.panCard}
                  onChange={(e) => setForm(p => ({ ...p, panCard: e.target.value.toUpperCase() }))}
                  readOnly={Boolean(hasProfile && form.panCard)}
                  maxLength={10}
                />
              </div>
              <div>
                <Label>GST Number</Label>
                <Input
                  placeholder="08ABCDE1234F1Z5"
                  value={form.gstNumber}
                  onChange={(e) => setForm(p => ({ ...p, gstNumber: e.target.value.toUpperCase() }))}
                  readOnly={Boolean(hasProfile && form.gstNumber)}
                  maxLength={15}
                />
              </div>
            </div>
          </Card>

          <FacultySection faculties={faculties} setFaculties={setFaculties} />
          <HighlightsSection
            selected={highlights}
            setSelected={setHighlights}
            customInputs={customInputs}
            setCustomInputs={setCustomInputs}
          />
          <LocationsSection locations={locations} setLocations={setLocations} />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 8,
              alignItems: "center",
            }}
          >
            <span style={{ color: "#d32f2f", fontSize: 13, minWidth: 260 }}>
              {submitError}
            </span>
            <button
              type="button"
              onClick={submitProfile}
              disabled={isSubmitting}
              style={{
                padding: "12px 32px",
                borderRadius: 10,
                border: "none",
                background: isSubmitting ? "#10b98180" : "#10b981",
                color: "#fff",
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: 14,
                boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Profile"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
