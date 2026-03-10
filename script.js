/**
 * Startup Idea Generator by mehulbest
 * script.js - All UI logic + Vercel API integration
 *
 * Architecture: Static frontend + Vercel serverless function.
 * The browser sends only the topic to /api/generate.
 * Your Groq API key stays in Vercel environment variables.
 *
 * Open Source: MIT License
 */

const AI_CONFIG = {
  proxyUrl: '/api/generate'
};

// Helpers
function $(id) { return document.getElementById(id); }

function setTopic(text) {
  $('topic-input').value = text;
  $('topic-input').focus();
}

function showError(msg) {
  const box = $('error-box');
  $('error-message').textContent = msg;
  box.style.display = 'flex';
}

function hideError() {
  $('error-box').style.display = 'none';
}

function setLoading(on) {
  $('loading').style.display = on ? 'flex' : 'none';
  $('results').style.display = on ? 'none' : '';
  $('generate-btn').disabled = on;
}

function parseIdeasPayload(payload) {
  if (payload && typeof payload === 'object') {
    return payload;
  }

  const clean = String(payload).replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Could not parse AI response. Please try again.');
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      throw new Error('Could not parse AI response. Please try again.');
    }
  }
}

async function callIdeasAPI(topic) {
  const response = await fetch(AI_CONFIG.proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topic })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
      err.message ||
      `API error ${response.status}`
    );
  }

  const data = await response.json();
  return parseIdeasPayload(data);
}

function renderIdeas(ideas, topic) {
  const grid = $('ideas-grid');
  grid.innerHTML = '';

  $('results-topic-label').textContent = `"${topic}"`;
  $('results').style.display = 'block';

  ideas.forEach((idea, i) => {
    const card = document.createElement('div');
    card.className = 'idea-card';
    card.style.animationDelay = `${i * 80}ms`;

    card.innerHTML = `
      <span class="card-number">0${i + 1}</span>
      <h3 class="idea-name">${escapeHtml(idea.name)}</h3>
      <p class="idea-tagline">${escapeHtml(idea.tagline)}</p>
      <p class="idea-description">${escapeHtml(idea.description)}</p>
      <div class="idea-problem">
        <span class="problem-label">Problem solved</span>
        <p class="problem-text">${escapeHtml(idea.problem)}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function generateIdeas() {
  hideError();

  const topic = $('topic-input').value.trim();

  if (!topic) {
    $('topic-input').focus();
    showError('Please enter a topic, industry, or keyword to get started.');
    return;
  }

  setLoading(true);

  try {
    const result = await callIdeasAPI(topic);
    const ideas = result?.ideas;

    if (!Array.isArray(ideas) || ideas.length === 0) {
      throw new Error('No ideas returned. Please try a different topic.');
    }

    renderIdeas(ideas, topic);
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
    $('results').style.display = 'none';
  } finally {
    setLoading(false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $('topic-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generateIdeas();
  });
});
