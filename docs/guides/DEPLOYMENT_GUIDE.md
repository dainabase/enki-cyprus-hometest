# 🚀 Deployment Guide - Enki Reality Expansion

**Version:** 1.0.0
**Last Updated:** 9 octobre 2025
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Production Build](#production-build)
4. [Deployment Platforms](#deployment-platforms)
5. [Post-Deployment Checklist](#post-deployment-checklist)
6. [Rollback Procedure](#rollback-procedure)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Tools

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Git:** v2.30.0 or higher

### Verify Installation

```bash
node --version
npm --version
git --version
```

---

## Environment Variables

### Development (.env)

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_development_supabase_url
VITE_SUPABASE_ANON_KEY=your_development_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Production (.env.production)

Create `.env.production` file in project root:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_production_google_maps_key
```

**Security Notes:**
- NEVER commit `.env` or `.env.production` to Git
- Use environment variable management from hosting platform
- Rotate keys regularly (every 3-6 months)
- Use different Supabase projects for dev/staging/production

---

## Production Build

### 1. Clean Install Dependencies

```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

### 2. Type Check

```bash
# Verify TypeScript compilation
npx tsc --noEmit
```

Expected output: No errors

### 3. Lint Check

```bash
# Run ESLint
npm run lint
```

Expected output: No critical errors (warnings acceptable)

### 4. Production Build

```bash
# Build for production
npm run build
```

**Expected Metrics:**
- Build time: < 60s
- Bundle size Home.js: < 200 kB
- Total dist size: < 5 MB
- No TypeScript errors
- Max 5 warnings (non-blocking)

### 5. Preview Build Locally

```bash
# Test production build locally
npm run preview
```

Access: http://localhost:4173

**Test Checklist:**
- [ ] Homepage loads without errors
- [ ] Hero section renders
- [ ] Search functionality works
- [ ] ExpansionContainer displays
- [ ] PropertyExpanded opens
- [ ] LexaiaPanel functions
- [ ] No console errors
- [ ] Assets load correctly

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Advantages:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Serverless functions support
- Preview deployments

**Steps:**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
# Production deployment
vercel --prod

# Preview deployment (for testing)
vercel
```

4. **Configure Environment Variables:**
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add all variables from `.env.production`

5. **Configure Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Domain Configuration:**
- Add custom domain in Vercel Dashboard
- Update DNS records (A/CNAME)
- SSL certificate auto-provisioned

---

### Option 2: Netlify

**Advantages:**
- Simple drag-and-drop
- Form handling
- Netlify Functions
- Split testing

**Steps:**

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Deploy:**
```bash
# Production deployment
netlify deploy --prod

# Preview deployment
netlify deploy
```

4. **Configure:**
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in Netlify Dashboard

**netlify.toml Configuration:**

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### Option 3: AWS S3 + CloudFront

**Advantages:**
- Full control
- Scalability
- Cost-effective at scale
- Advanced caching

**Steps:**

1. **Build:**
```bash
npm run build
```

2. **Upload to S3:**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. **Configure S3:**
- Enable static website hosting
- Set index document: `index.html`
- Set error document: `index.html`

4. **Create CloudFront Distribution:**
- Origin: S3 bucket
- Default root object: `index.html`
- SSL certificate: AWS Certificate Manager

5. **Invalidate CloudFront Cache (after deployment):**
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Post-Deployment Checklist

### Immediate Checks (< 5 minutes)

- [ ] **Homepage loads:** Visit production URL
- [ ] **No 404 errors:** Check browser console
- [ ] **SSL active:** Check padlock icon in browser
- [ ] **Assets load:** Images, fonts, CSS, JS
- [ ] **Environment variables:** Verify Supabase connection works
- [ ] **Google Maps:** Verify maps load in Map tab

### Functional Checks (< 15 minutes)

- [ ] **Hero → Search:** Click search button
- [ ] **Scroll automatic:** Verify scroll to ExpansionContainer
- [ ] **Grid display:** Property cards render
- [ ] **Property expand:** Click card, verify expansion
- [ ] **Tabs navigation:** All 4 tabs functional
- [ ] **Lexaia panel:** Opens and displays data
- [ ] **Mobile responsive:** Test on DevTools mobile view
- [ ] **SmartTrustBar:** Persistence verified

### Performance Checks (< 10 minutes)

- [ ] **Lighthouse audit:** Score > 90 Performance
- [ ] **LCP:** < 2.5s (Largest Contentful Paint)
- [ ] **FID:** < 100ms (First Input Delay)
- [ ] **CLS:** < 0.1 (Cumulative Layout Shift)
- [ ] **Bundle size:** Home.js < 200 kB

**Run Lighthouse:**
```bash
# Chrome DevTools → Lighthouse tab → Generate report
# Or use CLI:
npx lighthouse https://your-production-url.com --view
```

### Security Checks

- [ ] **HTTPS enforced:** No mixed content warnings
- [ ] **Headers set:** X-Frame-Options, CSP, etc.
- [ ] **API keys secured:** Not exposed in client code
- [ ] **Supabase RLS:** Row Level Security enabled
- [ ] **CORS configured:** Only allowed origins

---

## Rollback Procedure

### Quick Rollback (< 5 minutes)

**Vercel:**
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

**Netlify:**
```bash
# Go to Netlify Dashboard → Deploys → Find previous deploy → Publish deploy
```

### Manual Rollback

1. **Checkout previous commit:**
```bash
git log --oneline
git checkout <previous-commit-hash>
```

2. **Build and redeploy:**
```bash
npm run build
vercel --prod
# or
netlify deploy --prod
```

---

## Monitoring & Maintenance

### Monitoring Tools

1. **Vercel Analytics:**
   - Automatic with Vercel deployment
   - Real User Monitoring (RUM)
   - Core Web Vitals tracking

2. **Google Analytics:**
   - Already integrated (react-ga4)
   - Track user journeys
   - Monitor conversion funnels

3. **Sentry (Optional):**
   - Error tracking
   - Performance monitoring
   - Breadcrumbs for debugging

### Log Monitoring

**Vercel Logs:**
```bash
vercel logs [deployment-url]
```

**Netlify Logs:**
```bash
netlify logs
```

### Performance Monitoring

**Weekly Checks:**
- Run Lighthouse audit
- Check Core Web Vitals
- Review bundle sizes
- Monitor error rates

**Monthly Checks:**
- Update dependencies: `npm outdated`
- Security audit: `npm audit`
- Review analytics data
- Optimize images if needed

### Maintenance Schedule

**Weekly:**
- Monitor error logs
- Check uptime (should be 99.9%+)
- Review user feedback

**Monthly:**
- Update dependencies (minor versions)
- Run security audit
- Performance optimization review
- Backup Supabase database

**Quarterly:**
- Major dependency updates
- Feature releases
- Security penetration testing
- Infrastructure cost review

---

## Troubleshooting

### Build Fails

**Error:** TypeScript errors
**Solution:**
```bash
npx tsc --noEmit
# Fix all errors before deploying
```

**Error:** Out of memory
**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Deployment Fails

**Error:** Environment variables missing
**Solution:**
- Verify all env vars set in platform dashboard
- Check spelling and format

**Error:** Assets not loading (404)
**Solution:**
- Verify `dist/` folder contains all assets
- Check `.gitignore` doesn't exclude assets
- Verify base path in `vite.config.ts`

### Production Issues

**Issue:** Blank page on production
**Solution:**
1. Check browser console for errors
2. Verify environment variables
3. Check network tab for failed requests
4. Verify Supabase URL/keys correct

**Issue:** Google Maps not loading
**Solution:**
1. Verify API key set correctly
2. Check API key restrictions (HTTP referrer)
3. Enable Maps JavaScript API in Google Cloud Console

**Issue:** Slow performance
**Solution:**
1. Enable Gzip/Brotli compression
2. Configure CDN caching
3. Optimize images (WebP format)
4. Code splitting (already configured with Vite)

---

## Support & Contact

**Project Repository:** https://github.com/your-org/enki-reality-expansion

**Documentation:** /docs folder

**Issues:** GitHub Issues

**Email:** support@enki-realty.com

---

## Changelog

### v1.0.0 (2025-10-09)
- Initial production release
- Expansion system complete (10 étapes)
- PropertyExpanded inline expansion
- LexaiaPanel fiscal analysis
- ChatMiniMode integration
- Mobile responsive
- Performance optimized

---

**Last Updated:** 9 octobre 2025
**Maintained By:** Claude Code Assistant
**Status:** ✅ Production Ready
