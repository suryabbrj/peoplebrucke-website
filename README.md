# People Brücke Website

Website for [People Brücke](https://www.peoplebrucke.com) — a UAE-based people and organisational consultancy.

## Quick start (local)

```bash
npm install
npm run build
npm start
```

Open http://localhost:3456

- Homepage: http://localhost:3456/index.html
- Careers: http://localhost:3456/careers.html

## Deploy to Netlify

This project is configured for **Netlify** with a serverless careers API.

### Build settings (auto-read from `netlify.toml`)

| Setting | Value |
|---------|--------|
| Build command | `npm run build:netlify` |
| Publish directory | `dist` |
| Functions | `netlify/functions` |

**Important:** In Netlify → Site configuration → Build & deploy, leave publish directory **empty** or set to `dist` so it matches `netlify.toml`. If the UI says `.` or another folder, the site will 404.

### If you see “Page not found”

1. Open **Deploys** → latest deploy → **Deploy log** and confirm the build succeeded.
2. Confirm **Publish directory** is `dist` (not `.` or blank with a wrong UI override).
3. Re-deploy: **Deploys → Trigger deploy → Clear cache and deploy site**.
4. Visit `https://your-site.netlify.app/index.html` — if that works but `/` does not, contact support; otherwise the build did not publish files.

### Environment variables (Netlify dashboard → Site settings → Environment variables)

Copy from your `.env`:

| Variable | Description |
|----------|-------------|
| `TEAM_EMAILS` | Comma-separated round-robin recipients |
| `SMTP_HOST` | Your SMTP server hostname |
| `SMTP_PORT` | SMTP port (often 587) |
| `SMTP_USER` | Sender email / SMTP username |
| `SMTP_PASS` | SMTP password or app password |
| `MAIL_FROM` | From address shown on emails |
| `GOOGLE_SHEET_ID` | *(Optional)* Spreadsheet ID for application log |
| `GOOGLE_DRIVE_FOLDER_ID` | *(Optional)* Drive folder ID for uploaded resumes |
| `GOOGLE_SHEET_TAB` | *(Optional)* Sheet tab name (default: `Applications`) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | *(Optional)* Service account JSON key (Netlify — paste full JSON) |

The form posts to `/api/careers`, which Netlify proxies to the `careers` serverless function. Round-robin state is stored in **Netlify Blobs** (no file system needed).

### Local Netlify preview

```bash
npm run netlify:dev
```

Uses Netlify Dev with functions + redirects (loads `.env` automatically).

### Deploy steps

1. Push the repo to GitHub/GitLab/Bitbucket
2. In [Netlify](https://app.netlify.com): **Add new site → Import an existing project**
3. Set environment variables (above)
4. Deploy

## Careers application form

The careers page includes a structured application form with resume upload. Submissions are emailed to team members in round-robin order.

### Configure email delivery (local)

1. Copy `.env.example` to `.env`
2. Set `TEAM_EMAILS` and SMTP credentials
3. Run `npm run test-smtp` to verify

Locally, the round-robin counter is stored in `server/data/submission-counter.json` (gitignored). On Netlify, it uses Netlify Blobs.

### Google Sheet log (optional)

Each submission can append a row to a master Google Sheet with all form fields and a **clickable resume link** (file stored in Google Drive).

**One-time setup (~10 min):**

1. **Google Cloud** — [console.cloud.google.com](https://console.cloud.google.com)
   - Create a project (or use an existing one)
   - Enable **Google Sheets API** and **Google Drive API**
   - **IAM → Service accounts → Create** → download the JSON key file
   - Copy the service account email (e.g. `something@project.iam.gserviceaccount.com`)

2. **Google Sheet**
   - Create a spreadsheet (your master applications sheet)
   - Add a tab named `Applications` (or set `GOOGLE_SHEET_TAB` to your tab name)
   - **Share the sheet** with the service account email as **Editor**
   - Copy the spreadsheet ID from the URL:  
     `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

3. **Google Drive folder** (for resume files)
   - Create a folder e.g. “Careers Resumes”
   - **Share the folder** with the service account email as **Editor**
   - Copy the folder ID from the URL:  
     `https://drive.google.com/drive/folders/`**`THIS_PART`**

4. **Local `.env`**
   ```env
   GOOGLE_SHEET_ID=your-spreadsheet-id
   GOOGLE_DRIVE_FOLDER_ID=your-folder-id
   GOOGLE_SHEET_TAB=Applications
   GOOGLE_SERVICE_ACCOUNT_PATH=./google-service-account.json
   ```
   Save the downloaded JSON as `google-service-account.json` in the project root (gitignored).

5. **Netlify** — add the same IDs plus `GOOGLE_SERVICE_ACCOUNT_JSON` (paste the entire JSON key as the value). Scope: **Functions**.

6. **Test**
   ```bash
   npm run test-google-sheet
   ```

Sheet columns (header row is created automatically on first submission):

`Submitted At | First Name | Last Name | Email | Phone | Location | LinkedIn | Area of Interest | Experience | Message | Resume Link | Routed To`

If Google Sheet env vars are not set, the form still works — email delivery is unchanged; sheet logging is skipped.

## Rebuild content

Edit `build.js` then:

```bash
npm run build
```

## Structure

```
├── index.html              # Generated homepage
├── careers.html            # Generated careers page
├── netlify.toml            # Netlify build + redirects
├── netlify/functions/      # Serverless API (careers form)
├── build.js                # Content & brand configuration
├── server/                 # Shared handler + local Express dev server
├── css/
├── js/
└── assets/
```
