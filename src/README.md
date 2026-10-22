# ToimmyArt Studio Portfolio Website

A creative portfolio website for **ToimmyArt Studio**, showcasing the design work and projects of graphic designer Iretomiwa Akinbobola.

## About the Project

The website is designed to present the designer's work in a bold, artistic, and professional way. Visitors can explore projects by category, view the complete collection of designs for each project, learn about the designer, and find contact information.

## Features

- Responsive portfolio website for desktop, tablet, and mobile devices.
- Bold visual design using orange, black, off-white, and grey.
- Portfolio divided into two main categories:
  - Social Media Graphics
  - Branding
- Project folders with galleries of related designs.
- Character-by-character hero typing, staggered scroll reveals, and responsive hover transitions.
- About, Services, Resume, and Contact sections.
- Mobile navigation with keyboard dismissal and reduced-motion support.
- Navigation between the homepage, work categories, project folders, and galleries.
- Supplied software icons and selected End Work images.

## Clean Routes and Hosting

The portfolio uses browser-history routes without hash fragments:

- `/` — home
- `/work` — selected work categories
- `/work/branding` and `/work/social-media` — project folders
- `/work/branding/aycon` (and matching folder slugs) — project image galleries
- `/about`, `/services`, `/resume`, and `/contact` — scroll to the matching section

The `public/_redirects` rule sends unknown paths to the SPA entry point for Netlify and Cloudflare Pages, so refreshing a nested portfolio route loads the app rather than returning a 404. Vite's development and preview servers also use SPA fallback.

## Technology Stack

- **React** — building the user interface.
- **JavaScript** — application logic and interactive functionality.
- **Vite** — development server and build tool.
- **CSS** — styling, responsive layouts, and animations.
- **Intersection Observer API** — detecting when elements enter the viewport for scroll animations.

## Project Structure

```text
02-Asset-Library/
├── Brand/                 # Original branding project masters
├── Graphics/              # Original social media graphic masters
├── software_icons/        # Supplied software/tool icons
└── End-Work/              # Two selected end-work images

03-Website-Project/toimmyart-react/
├── public/
│   ├── projects/
│   │   ├── brand/         # Runtime copies of Brand/
│   │   └── graphics/      # Runtime copies of Graphics/
│   ├── software/          # Runtime copies of software_icons/
│   └── end-work/          # Runtime copies of End-Work/
└── src/
    ├── App.jsx
    ├── App.css
    └── useScrollReveal.js
```

## Getting Started

### Requirements

Install the following before running the project:

- Node.js
- npm
- A code editor such as Visual Studio Code

### Installation

1. Open the portfolio workspace or `03-Website-Project` in Visual Studio Code.
2. Install the active app's dependencies:

   ```bash
   cd 03-Website-Project/toimmyart-react
   npm.cmd install
   ```

3. Start the development server from either the portfolio workspace root or `03-Website-Project`:

   ```bash
   npm.cmd run dev
   ```

4. For a production preview, build and preview from either of those same folders:

   ```bash
   npm.cmd run build
   npm.cmd run preview
   ```

Both folders delegate these commands to `03-Website-Project/toimmyart-react`, which is the canonical app. This avoids accidentally running the older duplicate app.

Open the local URL displayed in the terminal: development uses `http://localhost:5181/`, and the production preview uses `http://localhost:4181/`. The dedicated ports prevent an older Vite app on the default ports from being mistaken for this portfolio.

**Windows note:** If PowerShell blocks `npm.ps1`, use `npm.cmd` for npm commands.

## Managing Portfolio Projects

The canonical editable design assets are in `02-Asset-Library/Brand` and `02-Asset-Library/Graphics`. The active site serves synchronized deployment copies from `public/projects/brand` and `public/projects/graphics`. Update the relevant public copy when a master changes, and update the matching folder's image list in `src/App.jsx` when adding or renaming a file.

Likewise, `02-Asset-Library/software_icons` is published under `public/software`, and `02-Asset-Library/End-Work` is published under `public/end-work`. Keep these deployment copies synchronized with their originals. Do not add another flattened gallery copy under `public/portfolio`.

## Development Guidelines

- Keep project data separate from the page layout.
- Use reusable React components where appropriate.
- Maintain responsive layouts across different screen sizes.
- Optimize images before adding them to the website.
- Use descriptive filenames for project assets.
- Test navigation and project galleries after making changes.
- Respect reduced-motion preferences when implementing animations.

## Future Improvements

- Admin dashboard for managing projects and images.
- Upload, edit, and delete project functionality.
- Improved image loading and gallery presentation.
- Search or filtering for portfolio projects.
- Deployment to a public hosting platform.
- Additional performance and accessibility improvements.

## Project Status

**In development.** The project gallery uses the supplied portfolio artwork in `02-Asset-Library`. The supplied software icons are shown with their matching names: Concepts, Adobe Photoshop, Adobe Illustrator, and Sketchbook.

## Designer

**Iretomiwa Akinbobola**  
ToimmyArt Studio

- Email: timothyiretomiwa@gmail.com
- Instagram: [@Toimmyart_Studio](https://www.instagram.com/Toimmyart_Studio/)
- TikTok: Toimmyart
- LinkedIn: Iretomiwa Timothy
