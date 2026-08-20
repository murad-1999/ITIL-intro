# ITIL 4 Interactive Learning Roadmap

An interactive visual learning platform for exploring the ITIL 4 framework. Built with Next.js App Router, React Flow (`@xyflow/react`), and Dagre graph layout math.

Visualizes the ITIL 4 Service Value System (SVS), Service Value Chain (SVC), Management Practices, Guiding Principles, and Four Dimensions with interactive nodes, detailed breakdown sheets, and practice quizzes.

## Features

- **Interactive Canvas Graph:** Directed node canvas with auto-layout powered by Dagre positioning. Supports zoom, pan, node search, and domain filtering.
- **Master Grid View:** Alternative data-dense tabular view with sorting and filtering for quick reference across all ITIL topics.
- **Detailed Practice Drawers:** In-depth sheets covering practice objectives, inputs/outputs, key activities, real-world examples, and metrics.
- **Knowledge Quizzes:** Interactive quiz engine attached to roadmap topics for self-assessment and progress verification.
- **Progress Tracking:** Zustand state store with local storage persistence to track completed concepts, quiz scores, and user preferences.
- **Dark & Light Mode:** Theme toggle with system sync and persistent preference storage.
- **Responsive Design:** Mobile-ready navigation, adaptive side drawers, and responsive graph controls.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Graph & Layout:** [@xyflow/react](https://reactflow.dev/) and [@dagrejs/dagre](https://github.com/dagrejs/dagre)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Styling & Icons:** [Tailwind CSS](https://tailwindcss.com/) and [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm (or yarn / pnpm / bun)

### Development Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` – Starts the local development server.
- `npm run build` – Builds the application for production.
- `npm run start` – Launches the production build.
- `npm run lint` – Runs ESLint checks across source code.

## Project Structure

```
src/
├── app/                  # App Router pages and global styles
├── components/
│   ├── drawer/           # Node detail sheet & quiz panel
│   ├── graph/            # XyFlow custom nodes, custom edges & canvas
│   └── grid/             # Master Grid tabular view
├── data/
│   ├── itil-roadmap.json # Core ITIL nodes, connections & content
│   └── quizzes.json      # Practice quiz questions mapped to topics
├── store/                # Zustand global state & persistence
└── types/                # TypeScript interface definitions
```

## Content Configuration

Roadmap content and quizzes are decoupled from rendering logic and stored as JSON:
- `src/data/itil-roadmap.json`: Contains node metadata, domain categories, prerequisite relationships, inputs/outputs, and detail content.
- `src/data/quizzes.json`: Contains multiple-choice questions mapped to node IDs.

## Deployment (GitHub Pages)

This project can be exported as a static site and hosted on GitHub Pages.

### 1. Static Export Config

In `next.config.mjs`, enable static output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }
};

export default nextConfig;
```

### 2. GitHub Actions Deployment

Add `.github/workflows/deploy.yml` to automatically build and deploy on push:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build static site
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Repository Settings

1. Navigate to **Settings > Pages** in your GitHub repository.
2. Select **GitHub Actions** as the source.
3. Push to `main` to trigger the build.

