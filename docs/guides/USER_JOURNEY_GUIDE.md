# 👤 User Journey Guide - Enki Reality Expansion

**Version:** 1.0.0
**Last Updated:** 9 octobre 2025
**Target Audience:** End Users, Product Managers, QA Testers

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Complete User Flow](#complete-user-flow)
3. [Detailed Step-by-Step Journey](#detailed-step-by-step-journey)
4. [Mobile Experience](#mobile-experience)
5. [Key Features](#key-features)
6. [Expected Behaviors](#expected-behaviors)
7. [Troubleshooting User Issues](#troubleshooting-user-issues)

---

## Overview

The Enki Reality Expansion system provides an immersive, inline property exploration experience with three main phases:

1. **Grid Phase:** Browse multiple properties in a responsive grid
2. **Expanded Phase:** Deep-dive into a single property with tabs
3. **Lexaia Phase:** Advanced fiscal analysis and recommendations

**Core Principle:** Inline expansion without page navigation = Faster, smoother UX

---

## Complete User Flow

```
Hero Landing Page
      ↓
[Click "Search" Button]
      ↓
Automatic Scroll to Properties Grid
      ↓
[Click Property Card]
      ↓
Property Expands Inline (4 Tabs: Photos, Details, Map, Fiscal)
      ↓
[Navigate Tabs]
      ↓
[Click "Open Lexaia Analysis" in Fiscal Tab]
      ↓
Lexaia Panel Slides In (Dashboard, Charts, Recommendations)
      ↓
[Explore Analysis]
      ↓
[Click Close Lexaia]
      ↓
Return to Property Expanded View
      ↓
[Click Close Property]
      ↓
Return to Properties Grid
```

**Duration:** 3-5 minutes for complete journey

---

## Detailed Step-by-Step Journey

### Step 1: Landing - Hero Section

**What User Sees:**
- Full-screen Hero with stunning Cyprus background
- Multilingual typewriter effect showing example searches
- Search input bar (large, centered)
- "Start Your Search" button

**What User Can Do:**
- Type a search query in the input
- Click "Start Your Search" button
- Or press Enter key

**What Happens:**
- Hero triggers search event
- Page scrolls smoothly to ExpansionContainer
- SmartTrustBar appears at top (sticky)
- Loading state shows (1.5 seconds)

**User Expectations:**
- Smooth scroll animation
- No page reload
- Immediate feedback

---

### Step 2: Properties Grid Display

**What User Sees:**
- Grid of 3-5 property cards
- Cards enter with stagger animation (cascade effect)
- Each card shows:
  - Property hero image
  - Title (project name)
  - Price (formatted in EUR)
  - Location (city, area)
  - Golden Visa badge (if eligible)
  - Fiscal Preview badge (tax savings preview)
  - Key specs (bedrooms, surface area)

**What User Can Do:**
- Hover over cards (scale effect + shadow)
- Click any property card to expand
- Scroll through grid if more properties

**What Happens on Click:**
- Loading skeletons appear (1.5s)
- Selected property expands inline
- Grid shifts to accommodate expanded view
- Smooth spring animation

**User Expectations:**
- Hover feedback (visual response)
- No page jump
- Smooth animations

**Layout:**
- Mobile (< 768px): 1 column
- Tablet (768-1024px): 2 columns
- Desktop (> 1024px): 3 columns

---

### Step 3: Property Expanded View

**What User Sees:**
- Large property card expanded inline
- Hero image gallery at top
- Property title, price, location
- 4 navigation tabs:
  1. Photos (default)
  2. Details
  3. Map
  4. Fiscal
- Close button (top-right)
- Breadcrumb (top): Home / Results / **Property**

**What User Can Do:**
- Navigate between tabs
- View gallery (if Photos tab)
- Explore specifications (if Details tab)
- View map with POI (if Map tab)
- Use fiscal calculator (if Fiscal tab)
- Click close to return to grid

**What Happens:**
- Tab content switches instantly
- No reload or flicker
- Smooth transitions
- ChatMiniMode appears (20% width, right side)

**User Expectations:**
- Fast tab switching
- Rich content in each tab
- Clear navigation
- Easy to close

---

### Step 4: Tab Navigation - Photos

**What User Sees:**
- Image gallery slider
- Navigation buttons (prev/next)
- Image indicators (dots)
- Fullscreen option (optional)

**What User Can Do:**
- Click prev/next buttons
- Click image indicators
- Swipe on mobile (touch gesture)

**What Happens:**
- Images transition smoothly
- No loading delay (images pre-loaded)
- Responsive to all interactions

**User Expectations:**
- High-quality images
- Smooth transitions
- Easy navigation

---

### Step 5: Tab Navigation - Details

**What User Sees:**
- Specifications grid (2-3 columns)
- Icons for each spec
- Values clearly formatted
- Sections:
  - Configuration (bedrooms, bathrooms, surface)
  - Equipment (appliances, features)
  - Outdoor (balcony, terrace, garden)
  - Technical (energy class, orientation)

**What User Can Do:**
- Scroll through specs
- Read detailed information

**What Happens:**
- Specs display in organized grid
- Icons add visual clarity

**User Expectations:**
- Complete information
- Easy to scan
- Clear formatting

---

### Step 6: Tab Navigation - Map

**What User Sees:**
- Google Maps embedded
- Property marker (pin)
- Points of Interest (POI) markers:
  - Beach (blue)
  - School (green)
  - Hospital (red)
  - Airport (purple)
- Zoom controls
- Distance indicators

**What User Can Do:**
- Zoom in/out
- Pan map
- Click POI markers (info popups)
- View distances to amenities

**What Happens:**
- Map loads dynamically
- Markers animate on load
- Interactive controls respond

**User Expectations:**
- Fast map loading
- Accurate property location
- Useful POI information

---

### Step 7: Tab Navigation - Fiscal

**What User Sees:**
- Fiscal Calculator widget
- Input fields:
  - Purchase price (pre-filled from property)
  - Current tax residence
  - Annual income
  - Investment goals
- Fiscal Preview Badge showing potential savings
- "Open Lexaia Analysis" button (prominent)
- Tax comparison preview

**What User Can Do:**
- Adjust calculator inputs
- See real-time tax calculations
- Click "Open Lexaia Analysis" for detailed report

**What Happens:**
- Calculator updates instantly
- Preview badge updates with savings
- Ready to open Lexaia for deep analysis

**User Expectations:**
- Simple inputs
- Clear calculations
- Easy to understand savings

---

### Step 8: Open Lexaia Analysis

**What User Does:**
- Clicks "Open Lexaia Analysis" button in Fiscal tab

**What Happens:**
- LexaiaPanel slides in from right
- Spring animation (smooth, natural)
- Panel occupies 95% width
- PropertyExpanded shrinks to 5% (left edge visible)
- ChatMiniMode becomes burger menu (5%)

**What User Sees:**
- Dashboard header "Lexaia Fiscal Analysis"
- 4 KPI cards at top:
  1. Current Tax Rate (e.g., 45%)
  2. Cyprus Tax Rate (e.g., 12.5%)
  3. Annual Savings (e.g., €32,500)
  4. 10-Year Savings (e.g., €325,000)
- Country Comparison table
- Savings Projection chart (10 years)
- Tax Structure Recommendations
- Close button (top-right)
- Breadcrumb updates: Home / Results / Property / **Lexaia Analysis**

**User Expectations:**
- Professional dashboard layout
- Clear, actionable data
- Easy to understand charts
- Trustworthy calculations

---

### Step 9: Explore Lexaia Dashboard

**What User Can Do:**
- Scroll through dashboard sections
- Read KPI cards
- Compare countries in table
- View savings chart
- Read tax recommendations
- Export PDF (optional - button visible)

**What Happens:**
- Smooth scrolling
- All data visible and formatted
- Interactive charts (hover tooltips)

**Key Sections:**

1. **KPI Cards (Top):**
   - Large numbers
   - Color-coded (green = savings)
   - Icons for context

2. **Country Comparison Table:**
   - Current residence vs Cyprus
   - Tax rates, deductions, net income
   - Highlight best option

3. **Savings Projection Chart:**
   - Line chart showing 10-year savings
   - X-axis: Years (1-10)
   - Y-axis: Cumulative savings (EUR)
   - Visual growth trajectory

4. **Tax Structure Recommendations:**
   - Personalized advice
   - Bullet points
   - Action items

**User Expectations:**
- Professional presentation
- Accurate calculations
- Actionable insights

---

### Step 10: Close Lexaia, Return to Property

**What User Does:**
- Clicks close button (X) in Lexaia header

**What Happens:**
- LexaiaPanel slides out to right
- Spring animation (reverse)
- PropertyExpanded expands back to full width
- ChatMiniMode returns to 20%
- Fiscal tab still selected
- Smooth transition, no "pop"

**User Expectations:**
- Smooth return animation
- Context preserved (same tab)
- No data loss

---

### Step 11: Close Property, Return to Grid

**What User Does:**
- Clicks close button (X) in PropertyExpanded header

**What Happens:**
- PropertyExpanded collapses
- Spring animation (smooth height transition)
- Grid properties re-appear
- Scroll position maintained (stays near clicked property)
- Breadcrumb updates: Home / **Results**

**User Expectations:**
- Smooth collapse animation
- Return to same scroll position
- Grid still available

---

### Step 12: Continue Browsing

**What User Can Do:**
- Click another property card
- Repeat journey for different property
- Scroll to explore more properties
- Return to Hero to search again

**What Happens:**
- New property expands
- Previous property state cleared
- Smooth transitions maintained

---

## Mobile Experience

### Viewport Breakpoints

| Viewport | Width | Grid Layout | Expanded Behavior |
|----------|-------|-------------|-------------------|
| **Mobile S** | 320px | 1 column | Fullscreen |
| **Mobile M** | 375px | 1 column | Fullscreen |
| **Mobile L** | 414px | 1 column | Fullscreen |
| **Tablet** | 768px | 2 columns | 90% width |
| **Desktop** | 1024px+ | 3 columns | Inline |

### Mobile-Specific Features

**Touch Gestures:**
- **Swipe down** on PropertyExpanded → Collapse
- **Horizontal swipe** on gallery → Next/prev image
- **Pinch zoom** on map → Zoom in/out
- **Horizontal scroll** on breadcrumb → Navigate

**Mobile Optimizations:**
- Larger touch targets (minimum 44px)
- Simplified navigation
- Reduced animations (performance)
- Optimized images (WebP, smaller sizes)

**Mobile Layout Changes:**
- Tabs: Horizontal scroll if needed
- PropertyExpanded: Fullscreen overlay
- LexaiaPanel: Fullscreen overlay
- ChatMiniMode: Hidden on mobile (< 768px)

### Mobile Testing

**Test Devices:**
- iPhone SE (320px)
- iPhone 12 (375px)
- iPhone 14 Pro Max (414px)
- iPad (768px)
- iPad Pro (1024px)

**Test Scenarios:**
- Portrait and landscape modes
- Touch gestures (tap, swipe, pinch)
- Virtual keyboard behavior
- Scroll performance

---

## Key Features

### 1. Inline Expansion

**Benefit:** No page navigation = Faster browsing
**Mechanism:** Grid dynamically shifts to accommodate expanded view
**Animation:** Spring physics for natural movement

### 2. SmartTrustBar Persistence

**What:** Sticky bar showing trust signals
**When:** Appears after first search
**Where:** Top of page, below navbar (if any)
**Purpose:** Build credibility throughout journey

### 3. ChatMiniMode

**What:** Minimized chat assistant (20% width)
**When:** Visible during PropertyExpanded and Lexaia
**Purpose:** Provide help without obstructing content
**Interaction:** Click expand to full width, click collapse to minimize

### 4. Breadcrumb Navigation

**Location:** Top of ExpansionContainer
**States:**
- Grid: "Home / Results"
- Expanded: "Home / Results / Property"
- Lexaia: "Home / Results / Property / Lexaia Analysis"

**Clickable:** Yes, click to navigate back

### 5. Loading States

**Skeletons:** Show during data loading (1.5s)
**Shimmer Effect:** Gradient animation on skeletons
**Purpose:** Smooth perceived performance

### 6. Stagger Animations

**Where:** Grid properties entrance
**Effect:** Cards appear in cascade (0.1s delay between each)
**Purpose:** Visual elegance, guide attention

---

## Expected Behaviors

### Performance

- **Page Load:** < 3s (LCP < 2.5s)
- **Interaction:** < 100ms (FID < 100ms)
- **Animations:** 60 FPS (smooth)
- **Scroll:** Smooth, no jank

### Accessibility

- **Keyboard Navigation:** Tab through elements
- **Screen Readers:** ARIA labels on buttons
- **Color Contrast:** WCAG AA compliant
- **Focus Indicators:** Visible focus states

### Error Handling

- **No Properties:** Show "No results" message
- **Image 404:** Show placeholder image
- **Map Load Fail:** Show static map image
- **Lexaia Error:** Show error message, disable button

### Browser Support

- **Chrome:** Latest 2 versions ✅
- **Safari:** Latest 2 versions ✅
- **Firefox:** Latest 2 versions ✅
- **Edge:** Latest 2 versions ✅
- **IE11:** Not supported ❌

---

## Troubleshooting User Issues

### Issue: "Search button doesn't work"

**Possible Causes:**
- Empty search input
- JavaScript disabled
- Network error

**Solutions:**
- Ensure input has text
- Check browser console for errors
- Refresh page

### Issue: "Property doesn't expand when clicked"

**Possible Causes:**
- Loading state still active
- JavaScript error
- Button disabled

**Solutions:**
- Wait for loading to complete
- Check console for errors
- Try another property

### Issue: "Map doesn't load"

**Possible Causes:**
- Google Maps API key invalid
- Network firewall blocking maps
- Ad blocker interfering

**Solutions:**
- Verify API key configured
- Disable ad blocker temporarily
- Check network connectivity

### Issue: "Lexaia panel is blank"

**Possible Causes:**
- Data not loaded
- Calculation error
- Missing inputs

**Solutions:**
- Refresh page and try again
- Ensure all calculator inputs filled
- Check console for errors

### Issue: "Mobile: Can't close expanded property"

**Possible Causes:**
- Touch target too small
- Scroll interfering
- JavaScript error

**Solutions:**
- Tap close button firmly
- Try swipe down gesture
- Refresh page

---

## User Feedback & Analytics

### Trackable Events

1. **Search Initiated:** User clicks search button
2. **Property Viewed:** User expands property
3. **Tab Changed:** User switches tabs
4. **Lexaia Opened:** User opens Lexaia analysis
5. **PDF Exported:** User exports PDF (if feature enabled)

### Key Metrics

- **Engagement Rate:** % users who expand properties
- **Average Time:** Time spent in expanded view
- **Conversion Rate:** % users who open Lexaia
- **Bounce Rate:** % users who leave without interaction

### User Satisfaction

- **NPS Score:** Net Promoter Score surveys
- **Feedback Forms:** In-app feedback widgets
- **User Testing:** Observe real users navigating

---

## Conclusion

The Enki Reality Expansion system provides a **premium, immersive property browsing experience** with:

✅ **Smooth animations** (spring physics)
✅ **Inline expansion** (no page navigation)
✅ **Advanced fiscal analysis** (Lexaia integration)
✅ **Mobile responsive** (320px to 4K)
✅ **Performance optimized** (< 200 kB bundle)

**User Goal:** Find and analyze Cyprus properties effortlessly

**System Goal:** Convert browsers into leads

**Outcome:** Win-win for users and business

---

**Last Updated:** 9 octobre 2025
**Maintained By:** Claude Code Assistant
**Version:** 1.0.0
**Status:** ✅ Production Ready
