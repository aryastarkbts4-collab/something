STUDYPILOT SIMPLE - no Node.js, no .env file

1. TRY IT NOW: double-click index.html. Everything works in the browser
   (subjects, offline smart plan, checklist, progress). Data saves in the browser.

2. FIREBASE (login + cloud save) - about 5 minutes
   - console.firebase.google.com > Add project
   - Build > Authentication > Get started > turn on Google
   - Build > Firestore Database > Create database
   - Firestore > Rules: paste the contents of firestore.rules > Publish
   - Project settings > Your apps > Web (</>) > copy the config object
   - Paste it into FIREBASE_CONFIG near the top of the <script> in index.html
   - After deploying, add your Netlify domain: Authentication > Settings > Authorized domains
   (Firebase web config is meant to be public. Security comes from the rules.)

3. NETLIFY + AI PLANS
   - Put this folder in a GitHub repository, then Netlify > Add new site > Import from Git.
     (Do NOT drag-and-drop: functions are not reliably deployed that way.)
   - Site configuration > Environment variables: add GEMINI_API_KEY (key from aistudio.google.com/apikey).
     Optional: GEMINI_MODEL if the default model name is not available for your account.
   - Redeploy. The "Generate my plan" button now uses AI.
     If AI fails, the site falls back to the offline plan automatically.

Never paste the Gemini key into index.html. Before public use, add sign-in checks
and rate limits to the function. Describe honestly which parts you wrote and which were AI-assisted.
