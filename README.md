# Startup Idea Generator

**by mehulbest**

A fast, minimal web tool that generates startup ideas from any topic, industry, or keyword.

## Architecture

This project is now set up for Vercel:

- the frontend is served as static files
- the backend lives at `/api/generate`
- your Groq key stays in Vercel environment variables
- users do not need to enter any API key

Do not put your Groq API key into frontend files. Anything in the browser is public.

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

The browser sends this:

```json
{ "topic": "climate tech" }
```

The Vercel function in [generate.js](d:\Mehul\solo projects\startup-idea-generator\api\generate.js) reads your `GROQ_API_KEY`, calls Groq server-side, and returns the ideas JSON back to the page.

The frontend calls the same-origin endpoint in [script.js](d:\Mehul\solo projects\startup-idea-generator\script.js):

```js
fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic })
});
```

## Deploy On Vercel

### 1. Push this repo to GitHub

Create a GitHub repo and push the project.

### 2. Import the repo into Vercel

In Vercel:

1. Click `Add New...`
2. Click `Project`
3. Import your GitHub repository

Vercel automatically detects the static files and the `/api` function.

### 3. Add the Groq API key

In the Vercel project:

1. Open `Settings`
2. Open `Environment Variables`
3. Add:

```text
Name: GROQ_API_KEY
Value: your actual Groq API key
```

Apply it to:

- Production
- Preview
- Development

### 4. Redeploy

After adding the environment variable, trigger a redeploy from Vercel so the function gets access to `GROQ_API_KEY`.

## Local Development

If you want to test the frontend and API together locally, use Vercel CLI.

### Install Vercel CLI

```bash
npm install -g vercel
```

### Run locally

From the project root:

```bash
vercel dev
```

Then open:

```text
http://localhost:3000
```

### Local environment variable

Create a `.env.local` file in the project root:

```text
GROQ_API_KEY=your_actual_groq_key
```

Do not commit `.env.local`.

## Model

The Vercel function currently uses `openai/gpt-oss-120b` on Groq. Change the `MODEL` constant in [generate.js](d:\Mehul\solo projects\startup-idea-generator\api\generate.js) if you want a different Groq model.

## Notes

- The frontend no longer asks users for API keys
- The key is not exposed to the browser
- If you previously planned to host on GitHub Pages, do not use GitHub Pages for this version; deploy the whole project to Vercel so `/api/generate` works on the same origin
