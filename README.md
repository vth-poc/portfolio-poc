# IS Engineering Portfolio

A modern, responsive portfolio website for IS Engineering teams, powered by GitHub Pages and GitHub Actions.

## 🚀 Features

- **Markdown-based Content**: Easy to edit content in human-readable markdown files
- **Automatic Deployment**: GitHub Actions automatically deploys on every push to main
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations
- **Organized Resources**: CSS, JS, and images stored in dedicated resources folder
- **Clean Code**: Separation of concerns with HTML, CSS, and JS in separate files

## 📁 File Structure

```
├── index.html             # Main website file (HTML only)
├── content/               # Markdown content files
│   ├── intro.md           # Main section content
│   ├── about.md           # About section content
│   ├── skills.md          # Skills/services content
│   ├── team.md            # Team members content
│   └── projects.md        # Projects content
├── resources/
│   ├── styles.css         # All CSS styles
│   ├── scripts/
│   │   └── main.js        # All JavaScript functionality
│   └── images/            # Image assets
│       ├── favicon.ico    # Browser tab icon
│       └── portfolio.png  # Main section image
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment workflow
├── .gitignore
└── README.md              # This file
```

## 🛠️ Setup Instructions

### 1. Create Repository

1. Create a new GitHub repository (e.g., `yourusername.github.io`)
2. Clone the repository to your local machine

### 2. Add Files

Copy all files from this template to your repository maintaining the folder structure.

### 3. Configure GitHub Pages

1. Go to your repository **Settings**
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 4. Add Portfolio Image

Place your portfolio image in `resources/images/portfolio.png`

### 5. Customize Content

- Edit markdown files in `content/` folder for content
- Edit `resources/styles.css` for styling
- Edit `resources/scripts/main.js` for functionality

### 6. Deploy

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## 🎨 Customization

### Colors

Edit `resources/styles.css`:

```css
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary: #0f172a;
  --accent: #38bdf8;
}
```
