// Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

// Content Base Path
const CONTENT_BASE = "./content/";

// Fetch Markdown File
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

// Parse Hero Content
function parseHeroContent(md) {
  const lines = md.split("\n");
  const content = {};
  let currentKey = null;
  let currentValue = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentKey) content[currentKey] = currentValue.join("\n").trim();
      currentKey = "title";
      currentValue = [line.replace("## ", "")];
    } else if (line.startsWith("### ")) {
      if (currentKey) content[currentKey] = currentValue.join("\n").trim();
      currentKey = "description";
      currentValue = [line.replace("### ", "")];
    } else if (line.startsWith("- stat:")) {
      if (currentKey) content[currentKey] = currentValue.join("\n").trim();
      currentKey = "stats";
      currentValue = [line.replace("- stat:", "").trim()];
    } else if (line.trim() && !line.startsWith("#")) {
      currentValue.push(line);
    }
  }
  if (currentKey) content[currentKey] = currentValue.join("\n").trim();
  return content;
}

// Render Hero Section
function renderHero(content) {
  if (content.title) {
    const titleElement = document.getElementById("hero-title");
    titleElement.innerHTML = content.title;
  }
  if (content.description) {
    document.getElementById("hero-description").innerHTML = marked.parse(
      content.description,
    );
  }
  if (content.stats) {
    const statsContainer = document.getElementById("hero-stats");
    const stats = content.stats.split("\n").filter((s) => s.trim());

    // Clear existing stat items
    statsContainer.innerHTML = "";

    // Create stat items dynamically based on number of stats
    stats.forEach((stat) => {
      const parts = stat.split("|");
      if (parts.length >= 2) {
        const statItem = document.createElement("div");
        statItem.className = "stat-item";
        statItem.innerHTML = `
          <span class="stat-number">${parts[0].trim()}</span>
          <span class="stat-label">${parts[1].trim()}</span>
        `;
        statsContainer.appendChild(statItem);
      }
    });
  }
}

// Parse Skills Content
function parseSkillsContent(md) {
  const skills = [];
  const blocks = md.split("---").filter((b) => b.trim());
  for (const block of blocks) {
    const skill = {};
    const lines = block.split("\n");
    for (const line of lines) {
      if (line.startsWith("- icon:"))
        skill.icon = line.replace("- icon:", "").trim();
      else if (line.startsWith("- title:"))
        skill.title = line.replace("- title:", "").trim();
      else if (line.startsWith("- description:"))
        skill.description = line.replace("- description:", "").trim();
    }
    if (skill.icon && skill.title) skills.push(skill);
  }
  return skills;
}

// Render Skills Section
function renderSkills(skills) {
  const container = document.getElementById("skills-container");
  container.innerHTML = skills
    .map(
      (skill) => `
    <div class="skill-card">
      <i class="${skill.icon}"></i>
      <h3>${skill.title}</h3>
      <p>${skill.description || ""}</p>
    </div>
  `,
    )
    .join("");
}

// Parse Team Content
function parseTeamContent(md) {
  const members = [];
  const blocks = md.split("---").filter((b) => b.trim());
  for (const block of blocks) {
    const member = {};
    const lines = block.split("\n");
    for (const line of lines) {
      if (line.startsWith("- name:"))
        member.name = line.replace("- name:", "").trim();
      else if (line.startsWith("- role:"))
        member.role = line.replace("- role:", "").trim();
      else if (line.startsWith("- bio:"))
        member.bio = line.replace("- bio:", "").trim();
      else if (line.startsWith("- linkedin:"))
        member.linkedin = line.replace("- linkedin:", "").trim();
      else if (line.startsWith("- github:"))
        member.github = line.replace("- github:", "").trim();
      else if (line.startsWith("- twitter:"))
        member.twitter = line.replace("- twitter:", "").trim();
    }
    if (member.name && member.role) members.push(member);
  }
  return members;
}

// Render Team Section
function renderTeam(members) {
  const container = document.getElementById("team-container");
  container.innerHTML = members
    .map(
      (member) => `
    <div class="team-card">
      <div class="team-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <h3>${member.name}</h3>
      <div class="team-role">${member.role}</div>
      <p class="team-bio">${member.bio || ""}</p>
      <div class="team-social">
        ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>` : ""}
        ${member.github ? `<a href="${member.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ""}
        ${member.twitter ? `<a href="${member.twitter}" target="_blank" rel="noopener noreferrer"><i class="fab fa-x-twitter"></i></a>` : ""}
      </div>
    </div>
  `,
    )
    .join("");
}

// Parse Projects Content
function parseProjectsContent(md) {
  const projects = [];
  const blocks = md.split("---").filter((b) => b.trim());
  for (const block of blocks) {
    const project = {};
    const lines = block.split("\n");
    for (const line of lines) {
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
    }
    if (project.icon && project.title) projects.push(project);
  }
  return projects;
}

// Render Projects Section
function renderProjects(projects) {
  const container = document.getElementById("projects-container");
  container.innerHTML = projects
    .map(
      (project) => `
    <div class="project-card">
      <div class="project-icon"><i class="${project.icon}"></i></div>
      <h3>${project.title}</h3>
      <div class="project-tags">
        ${(project.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <p>${project.description || ""}</p>
      ${project.link ? `<a href="${project.link}" class="project-link">Case study <i class="fas fa-arrow-right"></i></a>` : ""}
    </div>
  `,
    )
    .join("");
}

// Load All Content
async function loadContent() {
  // Load Hero Content
  const heroMd = await fetchMarkdown("intro.md");
  if (heroMd) {
    const heroContent = parseHeroContent(heroMd);
    renderHero(heroContent);
  }

  // Load About Content
  const aboutMd = await fetchMarkdown("about.md");
  if (aboutMd) {
    const lines = aboutMd.split("\n");
    for (const line of lines) {
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
    }
  }

  // Load Skills Content
  const skillsMd = await fetchMarkdown("skills.md");
  if (skillsMd) {
    const skills = parseSkillsContent(skillsMd);
    renderSkills(skills);
  }

  // Load Team Content
  const teamMd = await fetchMarkdown("team.md");
  if (teamMd) {
    const lines = teamMd.split("\n");
    for (const line of lines) {
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
    }
    const members = parseTeamContent(teamMd);
    renderTeam(members);
  }

  // Load Projects Content
  const projectsMd = await fetchMarkdown("projects.md");
  if (projectsMd) {
    const lines = projectsMd.split("\n");
    for (const line of lines) {
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
    }
    const projects = parseProjectsContent(projectsMd);
    renderProjects(projects);
  }
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", loadContent);
