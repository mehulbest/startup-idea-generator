# Startup Idea Generator

AI-powered startup idea generator built with vanilla HTML, CSS, and JavaScript, backed by a Vercel serverless API route and Groq.

Live demo: [https://startup-idea-generator-psi.vercel.app/](https://startup-idea-generator-psi.vercel.app/)

## Features

- Generate 4 startup ideas from any topic, keyword, or industry
- Each idea includes a name, tagline, description, and problem solved
- Fast static frontend with no framework dependency
- Secure server-side API integration using Vercel Functions
- Groq API key stays private in environment variables
- Responsive UI for desktop and mobile

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Vercel Serverless Function
- AI Provider: Groq
- Model: `openai/gpt-oss-120b`

## Project Structure

```text
startup-idea-generator/
|-- api/
|   |-- generate.js
|-- index.html
|-- script.js
|-- style.css
|-- README.md
```

## How It Works

1. The user enters a topic in the frontend.
2. The browser sends a `POST` request to `/api/generate`.
3. The Vercel function reads `GROQ_API_KEY` from environment variables.
4. The function calls Groq and returns structured JSON.
5. The frontend renders the startup ideas.

This keeps the API key off the client and avoids asking users to paste their own key.

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/startup-idea-generator.git
cd startup-idea-generator
```

### 2. Install Vercel CLI

```bash
npm install -g vercel
```

### 3. Add local environment variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Start the local dev server

```bash
vercel dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

### 1. Push this project to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/startup-idea-generator.git
git push -u origin main
```

### 2. Import the repo into Vercel

- Go to [Vercel](https://vercel.com/)
- Click `Add New...`
- Click `Project`
- Import your GitHub repository

### 3. Add environment variable

In Vercel project settings, add:

```text
GROQ_API_KEY=your_groq_api_key_here
```

Apply it to:

- Production
- Preview
- Development

### 4. Redeploy

Redeploy the project after adding the environment variable so the API function can access it.

## API Route

The backend route is:

```text
POST /api/generate
```

Example request body:

```json
{
  "topic": "climate tech"
}
```

Example response shape:

```json
{
  "ideas": [
    {
      "name": "Carbon Pilot",
      "tagline": "Track emissions before they become risk",
      "description": "A platform that helps mid-sized manufacturers monitor emissions and automate reporting workflows.",
      "problem": "Many companies struggle to measure and act on sustainability data without hiring expensive consultants."
    }
  ]
}
```

## Security

- The Groq API key is stored only in Vercel environment variables
- The browser never receives the secret key
- Do not commit `.env.local`
- Do not move the API key into frontend files

## Customization

If you want to change the model, edit the `MODEL` constant in [`api/generate.js`](./api/generate.js).

If you want to tune creativity or response size, update the Groq request options in [`api/generate.js`](./api/generate.js).

## License

MIT
