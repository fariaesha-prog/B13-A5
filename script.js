let allIssues = [];

fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  .then(res => res.json())
  .then(data => {
    allIssues = data.data;
    toggleTabStyle('allTab');
  });

function toggleTabStyle(btnId) {
  const buttons = [
    document.getElementById('allTab'),
    document.getElementById('openTab'),
    document.getElementById('closedTab')
  ];

  buttons.forEach(btn => {
    if (btn.id === btnId) {
      btn.classList.remove('bg-white', 'text-gray-700', 'border');
      btn.classList.add('bg-blue-500', 'text-white');
    } else {
      btn.classList.remove('bg-blue-500', 'text-white');
      btn.classList.add('bg-white', 'text-gray-700', 'border');
    }
  });

  if (btnId === 'allTab') displayIssues(allIssues);
  else if (btnId === 'openTab') displayIssues(allIssues.filter(i => i.status.toLowerCase() === 'open'));
  else if (btnId === 'closedTab') displayIssues(allIssues.filter(i => i.status.toLowerCase() === 'closed'));
}

function displayIssues(issues) {
  const container = document.getElementById("issuesContainer");
  container.innerHTML = "";

  issues.forEach(issue => {
    const borderColor = issue.status.toLowerCase() === "open"
      ? "border-green-500"
      : "border-purple-500";

    const card = document.createElement("div");
    card.className = `bg-white border-t-4 ${borderColor} p-4 rounded shadow cursor-pointer`;

    card.innerHTML = `
      <h3 class="font-semibold mb-2">${issue.title}</h3>
      <p class="text-gray-500 text-sm mb-3">${issue.description.slice(0, 80)}...</p>
      <p class="text-xs text-gray-500 mb-1">Author: ${issue.author}</p>
      <p class="text-xs text-gray-400">${issue.createdAt}</p>
    `;

    card.onclick = () => openModal(issue);

    container.appendChild(card);
  });
}


function openModal(issue) {
  document.getElementById("modalTitle").innerText = issue.title;
  document.getElementById("modalStatus").innerText = `${issue.status} • Opened by ${issue.author}`;
  document.getElementById("modalDescription").innerText = issue.description;
  document.getElementById("modalAuthor").innerText = issue.author;
  document.getElementById("modalPriority").innerText = issue.priority;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

