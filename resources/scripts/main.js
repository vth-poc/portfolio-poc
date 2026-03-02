// Sanitize all marked output via DOMPurify
const renderer = new marked.Renderer();
marked.use({
  renderer,
  hooks: {
    postprocess(html) {
      return DOMPurify.sanitize(html);
    },
  },
});

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector("i");

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  document.body.classList.add("dark-theme");
  themeIcon?.classList.replace("fa-moon", "fa-sun");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  themeIcon?.classList.replace(
    isDark ? "fa-moon" : "fa-sun",
    isDark ? "fa-sun" : "fa-moon",
  );
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Mobile Navigation
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger?.addEventListener("click", () => {
  navMenu?.classList.toggle("active");
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("active");
  });
});

// Content Loading
const CONTENT_BASE = "./content/";

async function fetchMarkdown(filename) {
  try {
    const response = await fetch(CONTENT_BASE + filename);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return null;
  }
}

function parsePortfolioContent(md) {
  const content = {};
  let currentKey = null;
  let currentValue = [];

  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) {
      if (currentKey) content[currentKey] = currentValue.join("\n").trim();
      currentKey = "title";
      currentValue = [line.replace("## ", "")];
    } else if (line.startsWith("### ")) {
      if (currentKey) content[currentKey] = currentValue.join("\n").trim();
      currentKey = "description";
      currentValue = [line.replace("### ", "")];
    } else if (line.startsWith("- stat:")) {
      if (currentKey !== "stats") {
        if (currentKey) content[currentKey] = currentValue.join("\n").trim();
        currentKey = "stats";
        currentValue = [];
      }
      currentValue.push(line.replace("- stat:", "").trim());
    } else if (line.trim() && !line.startsWith("#")) {
      currentValue.push(line);
    }
  }
  if (currentKey) content[currentKey] = currentValue.join("\n").trim();
  return content;
}

function renderPortfolio(content) {
  if (content.title) {
    document.getElementById("portfolio-title").innerHTML = content.title;
  }
  if (content.description) {
    document.getElementById("portfolio-description").innerHTML = marked.parse(
      content.description,
    );
  }
  if (content.stats) {
    const container = document.getElementById("portfolio-stats");
    container.innerHTML = content.stats
      .split("\n")
      .filter((s) => s.trim())
      .map((stat) => {
        const [number, label] = stat.split("|").map((s) => s.trim());
        return number && label
          ? `
        <div class="stat-item">
          <span class="stat-number">${number}</span>
          <span class="stat-label">${label}</span>
        </div>
      `
          : "";
      })
      .join("");
  }
}

function parseSkillsContent(md) {
  return md
    .split("---")
    .filter((b) => b.trim())
    .map((block) => {
      const skill = {};
      block.split("\n").forEach((line) => {
        if (line.startsWith("- icon:"))
          skill.icon = line.replace("- icon:", "").trim();
        else if (line.startsWith("- title:"))
          skill.title = line.replace("- title:", "").trim();
        else if (line.startsWith("- description:"))
          skill.description = line.replace("- description:", "").trim();
      });
      return skill;
    })
    .filter((s) => s.icon && s.title);
}

function renderSkills(skills) {
  const container = document.getElementById("skills-container");
  container.innerHTML = skills.length
    ? skills
        .map(
          (skill) => `
    <div class="skill-card">
      <i class="${skill.icon}"></i>
      <h3>${skill.title}</h3>
      <p>${skill.description || ""}</p>
    </div>
  `,
        )
        .join("")
    : '<div class="empty-content">No skills to display</div>';
}

function parseTeamContent(md) {
  return md
    .split("---")
    .filter((b) => b.trim())
    .map((block) => {
      const member = {};
      block.split("\n").forEach((line) => {
        if (line.startsWith("- name:"))
          member.name = line.replace("- name:", "").trim();
        else if (line.startsWith("- role:"))
          member.role = line.replace("- role:", "").trim();
        else if (line.startsWith("- bio:"))
          member.bio = line.replace("- bio:", "").trim();
      });
      return member;
    })
    .filter((m) => m.name && m.role);
}

function renderTeam(members) {
  const container = document.getElementById("team-container");
  container.innerHTML = members.length
    ? members
        .map(
          (member) => `
    <div class="team-card">
      <div class="team-avatar"><i class="fas fa-user-circle"></i></div>
      <h3>${member.name}</h3>
      <div class="team-role">${member.role}</div>
      <p class="team-bio">${member.bio || ""}</p>
    </div>
  `,
        )
        .join("")
    : '<div class="empty-content">No team members to display</div>';
}

function parseProjectsContent(md) {
  return md
    .split("---")
    .filter((b) => b.trim())
    .map((block) => {
      const project = {};
      block.split("\n").forEach((line) => {
        if (line.startsWith("- icon:"))
          project.icon = line.replace("- icon:", "").trim();
        else if (line.startsWith("- title:"))
          project.title = line.replace("- title:", "").trim();
        else if (line.startsWith("- description:"))
          project.description = line.replace("- description:", "").trim();
        else if (line.startsWith("- tags:"))
          project.tags = line
            .replace("- tags:", "")
            .trim()
            .split(",")
            .map((t) => t.trim());
        else if (line.startsWith("- link:"))
          project.link = line.replace("- link:", "").trim();
      });
      return project;
    })
    .filter((p) => p.icon && p.title);
}

function renderProjects(projects) {
  const container = document.getElementById("projects-container");
  container.innerHTML = projects.length
    ? projects
        .map(
          (project) => `
    <div class="project-card">
      <div class="project-icon"><i class="${project.icon}"></i></div>
      <h3>${project.title}</h3>
      <div class="project-tags">${(project.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <p>${project.description || ""}</p>
      ${project.link ? `<a href="${project.link}" class="project-link">Case study <i class="fas fa-arrow-right"></i></a>` : ""}
    </div>
  `,
        )
        .join("")
    : '<div class="empty-content">No projects to display</div>';
}

async function loadContent() {
  const portfolioMd = await fetchMarkdown("intro.md");
  if (portfolioMd) renderPortfolio(parsePortfolioContent(portfolioMd));

  const aboutMd = await fetchMarkdown("about.md");
  if (aboutMd) {
    aboutMd.split("\n").forEach((line) => {
      if (line.startsWith("## "))
        document.getElementById("about-title").textContent = line.replace(
          "## ",
          "",
        );
      else if (line.startsWith("### "))
        document.getElementById("about-subhead").textContent = line.replace(
          "### ",
          "",
        );
    });
  }

  const skillsMd = await fetchMarkdown("skills.md");
  if (skillsMd) renderSkills(parseSkillsContent(skillsMd));

  const teamMd = await fetchMarkdown("team.md");
  if (teamMd) {
    teamMd.split("\n").forEach((line) => {
      if (line.startsWith("## "))
        document.getElementById("team-title").textContent = line.replace(
          "## ",
          "",
        );
      else if (line.startsWith("### "))
        document.getElementById("team-subhead").textContent = line.replace(
          "### ",
          "",
        );
    });
    renderTeam(parseTeamContent(teamMd));
  }

  const projectsMd = await fetchMarkdown("projects.md");
  if (projectsMd) {
    projectsMd.split("\n").forEach((line) => {
      if (line.startsWith("## "))
        document.getElementById("projects-title").textContent = line.replace(
          "## ",
          "",
        );
      else if (line.startsWith("### "))
        document.getElementById("projects-subhead").textContent = line.replace(
          "### ",
          "",
        );
    });
    renderProjects(parseProjectsContent(projectsMd));
  }
}

document.addEventListener("DOMContentLoaded", loadContent);
