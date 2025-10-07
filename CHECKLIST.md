# SkillWagers UI Color Fixes and ESLint Errors Checklist

## Step 0: Brand Button Color Discovery ✅
**Login/Register Button Analysis:**
- Located in: `src/components/AuthWidget.jsx` and `src/pages/Login.jsx`
- Current classes: `border-primaryAccent text-primaryAccent hover:bg-primaryAccent` and `bg-primaryAccent`
- Tailwind config shows: `primaryAccent: '#6f4cff'` 
- **brandAccent already defined as: '#6f4cff'** ✅

**Status:** Brand accent color is already properly exposed in tailwind.config.js

---

## Step 1: Navbar Title Color + Logo ✅
- [x] Set top-left site name to match Login/Register button color (text-brandAccent)
- [x] Add logo icon to left of title (already present)
- [x] Ensure rest of page doesn't inherit this color globally (only applied to navbar title)

## Step 2: "How it works" Colored Circles ✅
- [x] Step 1: blue (bg-blue-500)
- [x] Step 2: purple (bg-purple-500)
- [x] Step 3: pink (bg-pink-500)
- [x] Step 4: red (bg-red-500)

## Step 3: Logged-in Home Footer Text
- [ ] Hide "Join SkillWagers Today" for authenticated users

## Step 4: Button Hover/Click Color
- [ ] Unify all buttons to use brandAccent color
- [ ] Same color on hover/active (no darker variant)

## Step 5: Middle Hero Tags
- [ ] Make badges/text purple (brand primary)
- [ ] Ensure contrast on dark background

## Step 6: ESLint Fixes
- [ ] Fix DailyCoinsReward.jsx no-use-before-define
- [ ] Fix Profile.jsx no-use-before-define

## Step 7: Verification
- [ ] Navbar wordmark matches Login/Register color
- [ ] How it works circles: 1 blue, 2 purple, 3 pink, 4 red
- [ ] Logged-in users don't see join CTA
- [ ] All buttons use same hover/active color
- [ ] Hero badges are purple
- [ ] npm run lint → 0 errors
- [ ] npm run build → success

---

## Commits Made: