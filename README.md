# CU List

A lightweight Next.js frontend that lists Christian Unions using the UCCF public data API.

## Definition
A Christian Union (CU) is a student-led Christian group at a university or college that gathers for worship, community, and outreach.

## Features
- Live data from the UCCF API via a server-side fetch
- Responsive grid layout with a bold editorial look
- Automatic refresh every hour using Next.js ISR

## Requirements
- Node.js 18.17+ minimum (Node.js 20 LTS recommended, run `nvm use` if you use nvm)

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file and add:
   ```bash
   UCCF_API_URL=http://v1.data.uccf.io/api/christian-unions/expand
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

## Production
1. Build the app:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Notes
- The API URL is read server-side in `app/page.js` so it stays out of client bundles.
