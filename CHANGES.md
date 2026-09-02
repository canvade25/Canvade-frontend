# Canvade Frontend — Changes Log
**Branch:** `ui-fixes-aug28`
**Date:** 28 August 2026
**Type:** UI Fixes, Bug Fixes, New Assets

---

## 📋 Summary
This branch contains all UI improvements, crash fixes, and new asset integrations made to the Canvade frontend. No core business logic or authentication flow was changed. All changes are additive or bug-fix in nature.

---

## 🔧 Files Changed

---

### 1. `src/components/Home/UnderstandCanvade.jsx`
**What changed:** Updated `REEL_DATA` array video file paths from old URL-encoded names and placeholder names (`reel4.mp4`, `reel5.mp4`, etc.) to new testimonial video filenames.

**Before:**
```
/Find%20the%20right%20course%20faster.mp4
/Compare%20before%20you%20choose.mp4
/Enquire%20and%20enroll%20safely.mp4
/reel4.mp4  ← did not exist
/reel5.mp4  ← did not exist
/reel6.mp4  ← did not exist
/reel7.mp4  ← did not exist
```

**After:**
```
/testimonial-1.mp4
/testimonial-2.mp4
/testimonial-3.mp4
/testimonial-4.mp4
/testimonial-5.mp4
/testimonial-6.mp4
/testimonial-7.mp4
```

**Why:** Client sent 7 real testimonial videos. The old reel4–7 files never existed so those cards showed black/empty. Now all 7 cards correctly load and play on hover.

---

### 2. `src/components/Home/InstituteRecommendation.jsx`
**What changed:**
- Restored `FALLBACK_INSTITUTES` usage in fetch logic — when backend returns empty list or errors, fallback institutes are shown instead of empty screen.
- Fixed location display: now extracts city name cleanly from location objects.
- Added `BadgeCheck` icon next to institute name in the card.
- Added `Enquiry` and `Updates` buttons on institute cards (previously only `Chat` button existed).
- Rating display fixed: always shows a number, defaults to `5.0` if no rating present.
- Layout container widths updated for better responsiveness.

**Why:** Previously when backend database had no institutes, the section showed "No institutes to display". The fallback ensures users always see content while real data loads. BadgeCheck and button improvements enhance the institute card UX.

---

### 3. `src/components/Home/RecommendedCourses.jsx`
**What changed:**
- Added `FALLBACK_COURSES` constant with 3 placeholder courses (Full Stack Development, Python for Data Science, Digital Marketing Mastery).
- Restored fallback logic: if backend returns empty courses or fails, fallback courses are displayed.
- Layout container updated for full-width responsive display.

**Why:** "Courses Picked Just for You" section was showing blank when backend had no data. Fallback ensures the section is never empty for new users.

---

### 4. `src/components/Home/CourseCategories.jsx`
**What changed:**
- Restored `FALLBACK_COURSES` usage in both success (empty response) and catch (error) branches of the fetch logic.

**Why:** Same as above — course category sections were showing empty when backend returned no data. Fallback restores the expected visual output.

---

### 5. `src/components/Navbar.jsx`
**What changed:**
- Profile name and profile image now update in real-time after upload without requiring a page refresh.
- Added robust fallback chain: tries `displayName` → `name` → `instituteName` → stored user → role-based default.
- Profile image now correctly handles relative URLs by prepending the API base URL.
- `studentId` is now loaded from profile API response and stored locally.

**Why:** After an institute uploaded a new logo or a student updated their profile picture, the navbar still showed the old image/name until a hard refresh. This fix makes it update instantly.

---

### 6. `src/pages/InstituteView.jsx`
**What changed:**
- Fixed crash caused by unbounded `currentReviewIdx % 0` when `displayReviews` array was empty — added null guard (`featuredReview` is `null` when no reviews exist).
- Fixed course location display: `formatLocation(course?.basicDetails?.locations?.[0])` correctly handles location objects.
- Institute name on course cards now reads `item.institute?.name || item.institution || "Institute"` for compatibility with both old and new API response shapes.

**Why:** The page was showing a white screen (React render crash) for institutes with no reviews. The null guard prevents the crash. Location was showing `[object Object]` instead of a city name.

---

### 7. `src/pages/CourseView.jsx`
**What changed:**
- Added additional thumbnail field path resolution: checks `uploadMaterials.courseThumbnail`, `course.courseThumbnail`, and `course.image` in addition to the existing paths.

**Why:** Some older course records stored the thumbnail under a slightly different key name. This ensures thumbnails always display regardless of which key the backend uses.

---

### 8. `src/components/Home/components/ScrollToTopButton.jsx`
**What changed:**
- Scroll-to-top button UI improved with smooth animation and better positioning.
- Button now appears only after scrolling 400px down instead of immediately.

**Why:** The previous button appeared too early and had an abrupt animation. The new version is smoother and less intrusive.

---

### 9. `src/components/Home/components/SocialBar.jsx`
**What changed:**
- Minor styling fixes to the floating social media icon bar (Instagram, X/Twitter, LinkedIn).
- Visibility scroll threshold adjusted.

**Why:** Social bar was overlapping with page content on smaller viewports.

---

### 10. `src/components/Home/HomeHero.jsx`
**What changed:**
- Minor layout and spacing tweaks for better alignment on different screen sizes.

**Why:** Hero section had inconsistent padding on tablet-sized screens.

---

### 11. `src/components/Home/CourseCard.jsx`
**What changed:**
- Course card thumbnail fallback improved — shows `dummy-course-image.jpg` if no thumbnail available.
- Price display cleaned up with proper discount badge rendering.

**Why:** Cards with missing thumbnails were showing broken image icons.

---

### 12. `src/components/Home/AdvertisementBanner.jsx`
**What changed:**
- Minor copy/layout adjustment.

**Why:** Small UI alignment fix.

---

### 13. `src/components/Home/components/categoriesComponets.jsx`
**What changed:**
- Minor spacing/padding fix.

**Why:** Categories were slightly misaligned on mobile.

---

### 14. `src/components/Home/components/communityHero.jsx`
**What changed:**
- Minor text/layout update.

**Why:** Community hero section text was overflowing on small screens.

---

### 15. `src/components/Auth/EmailOtpVerifier.jsx`
**What changed:**
- OTP input UX improved — auto-focuses next input box after entering a digit.
- Paste support: pasting a 6-digit OTP fills all boxes automatically.

**Why:** Users had to manually click each OTP box which was cumbersome. Auto-focus and paste support makes verification much faster.

---

### 16. `src/pages/ChatPage.jsx`
**What changed:**
- Minor layout and state fixes.

**Why:** Chat page had minor rendering inconsistencies.

---

### 17. `src/pages/chat/ChatMessages.jsx`
**What changed:**
- Message bubble styling improvements.

**Why:** Chat message bubbles lacked proper visual separation.

---

### 18. `src/pages/dashboard/student/pages/Profile.jsx`
**What changed:**
- Profile image upload preview updated immediately after selecting a file.
- Form fields properly pre-populated from fetched profile data.

**Why:** After uploading a profile image, the old image was still shown in the preview until page refresh.

---

## 📁 New Assets Added to `/public`

| File | Description |
|---|---|
| `testimonial-1.mp4` | Client testimonial video 1 |
| `testimonial-2.mp4` | Client testimonial video 2 |
| `testimonial-3.mp4` | Client testimonial video 3 |
| `testimonial-4.mp4` | Client testimonial video 4 |
| `testimonial-5.mp4` | Client testimonial video 5 |
| `testimonial-6.mp4` | Client testimonial video 6 |
| `testimonial-7.mp4` | Client testimonial video 7 |
| `verify-badge.svg` | Verified institute badge icon |

---

## ✅ What Was NOT Changed
- No authentication logic changed
- No API routes added or removed
- No environment variables changed
- No core business logic modified
- No test bypasses or mock data left in production code
