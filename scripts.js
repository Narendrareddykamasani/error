const API_BASE = "/api";

async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  const data = await res.json();
  renderProjects(data);
}

function renderProjects(projects) {
  const row = document.getElementById("projectsRow");
  row.innerHTML = "";
  if (!projects.length) {
    row.innerHTML = `<div class="col-12"><p class="text-muted">No projects yet. Use 'Add Project' to create one.</p></div>`;
    return;
  }
  projects.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card project-card h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(p.title)}</h5>
          <p class="card-text flex-grow-1">${escapeHtml(p.description)}</p>
          ${p.link ? `<a href="${escapeAttr(p.link)}" target="_blank" class="btn btn-sm btn-primary mt-3">View on GitHub</a>` : ''}
        </div>
      </div>`;
    row.appendChild(col);
  });
}

function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe.replace(/[&<"'>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function escapeAttr(s){ return s ? s.replace(/"/g,'&quot;') : s; }

document.getElementById("showAddBtn").addEventListener("click", async () => {
  const title = prompt("Project title:");
  if (!title) return;
  const description = prompt("Short description:");
  if (!description) return;
  const link = prompt("Link (GitHub URL) (optional):") || "";
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, link })
  });
  if (res.ok) { alert("Project added"); fetchProjects(); }
  else { const err = await res.json(); alert("Error: " + (err.error || "unknown")); }
});

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("cname").value;
  const email = document.getElementById("cemail").value;
  const message = document.getElementById("cmessage").value;
  const status = document.getElementById("contactStatus");
  status.textContent = "Sending...";
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, message })
  });
  if (res.ok) {
    status.textContent = "Message sent. Thank you!";
    document.getElementById("contactForm").reset();
  } else {
    const err = await res.json();
    status.textContent = "Error: " + (err.error || "unable to send");
  }
});

fetchProjects();
