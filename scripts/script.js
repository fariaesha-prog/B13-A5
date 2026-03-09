const totalIssueCount = document.getElementById("total-issue-count");
const loadingSpinner = document.getElementById("loading-spinner");
const issueContainer = document.getElementById("issue-container");
let allIssues = [];

function showSpinner(show) {
  if (show) {
    loadingSpinner.classList.remove("hidden");
    issueContainer.classList.add("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
    issueContainer.classList.remove("hidden");
  }
}

function toggleTabStyle(id) {
  const tabs = document.querySelectorAll(".filter-btn");

  tabs.forEach((tab) => {
    tab.classList.remove("bg-blue-500", "text-white");
    tab.classList.add("border", "text-gray-600");
  });

  const activeTab = document.getElementById(id);
  activeTab.classList.remove("border", "text-gray-600");
  activeTab.classList.add("bg-blue-500", "text-white");

  if (id === "allTab") {
    displayIssues(allIssues);
  } else if (id === "openTab") {
    displayIssues(allIssues.filter(issue => issue.status === "open"));
  } else if (id === "closedTab") {
    displayIssues(allIssues.filter(issue => issue.status === "closed"));
  }
}

function loadIssues() {
  showSpinner(true);
  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((result) => {
      allIssues = result.data;
      displayIssues(allIssues);
    });
}

function getLabel(label) {
  if (label === "bug") {
    return `<div class="rounded-full bg-[#FEECEC] text-[#EF4444] text-xs font-medium w-fit gap-0.5 px-2 py-1.5 flex justify-center items-center border border-[#FECACA]">
      <i class="fa-solid fa-bug"></i> BUG
    </div>`;
  } else if (label === "help wanted") {
    return `<div class="rounded-full bg-[#FFF8DB] text-[#D97706] text-xs font-medium w-fit gap-0.5 px-2 py-1.5 flex justify-center items-center border border-[#FDE68A]">
      <i class="fa-solid fa-life-ring"></i> HELP WANTED
    </div>`;
  } else if (label === "enhancement") {
    return `<div class="rounded-full bg-[#DEFCE8] text-[#00A96E] text-xs font-medium w-fit gap-0.5 px-2 py-1.5 flex justify-center items-center border border-[#BBF7D0]">
      <i class="fa-solid fa-wand-magic-sparkles"></i> ENHANCEMENT
    </div>`;
  } else if (label === "good first issue") {
    return `<div class="rounded-full bg-[#E0E7FF] text-[#6366F1] text-xs font-medium w-fit gap-0.5 px-2 py-1.5 flex justify-center items-center border border-[#C7D2FE]">
      <i class="fa-solid fa-hands-helping"></i> GOOD FIRST ISSUE
    </div>`;
  } else if (label === "documentation") {
    return `<div class="rounded-full bg-[#E8F4FD] text-[#0EA5E9] text-xs font-medium w-fit gap-0.5 px-2 py-1.5 flex justify-center items-center border border-[#BAE6FD]">
      <i class="fa-solid fa-book"></i> DOCUMENTATION
    </div>`;
  }
  return "";
}

function getPriority(priority) {
  if (priority === "high") {
    return `<div class="rounded-full bg-[#FEECEC] text-[#EF4444] text-xs font-medium w-20 py-1.5 flex justify-center items-center">HIGH</div>`;
  } else if (priority === "medium") {
    return `<div class="rounded-full bg-[#FFF6D1] text-[#F59E0B] text-xs font-medium w-20 py-1.5 flex justify-center items-center">MEDIUM</div>`;
  } else {
    return `<div class="rounded-full bg-[#EEEFF2] text-[#9CA3AF] text-xs font-medium w-20 py-1.5 flex justify-center items-center">LOW</div>`;
  }
}

function displayIssues(issues) {
  showSpinner(true);
  const container = document.getElementById("issue-container");
  container.innerHTML = "";
  totalIssueCount.textContent = `${issues.length} Issues`;

  if (issues.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-16">
                        <i class="fa-brands fa-earlybirds text-7xl mb-4"></i>
                        <h1 class="text-xl font-semibold">No issues found</h1>
                        <p class="text-[#64748B]">Try adjusting your search to find what you're looking for.
                        </p>
                    </div>`;
    showSpinner(false);
    return;
  }

  issues.forEach((issue) => {
    const borderColor = issue.status === "open" ? "#00A96E" : "#A855F7";
    const statusImg =
      issue.status === "open"
        ? "./assets/Open-Status.png"
        : "./assets/Closed-Status.png";
    const statusAlt = issue.status === "open" ? "Open status" : "Closed status";
    const labels = issue.labels.map((label) => getLabel(label)).join("");
    const priority = getPriority(issue.priority);
    const date = new Date(issue.createdAt).toLocaleDateString();

    const card = `
      <div onclick="showIssueModal(${issue.id})" class="card w-full bg-base-100 border-t-3 border-[${borderColor}] shadow-md cursor-pointer">
        <div class="border-b border-[#E4E4E7] p-4">
          <div class="flex justify-between items-center mb-3">
            <img src="${statusImg}" alt="${statusAlt}">
            ${priority}
          </div>
          <div>
            <h2 class="font-semibold text-[#1F2937] text-sm mb-2">${issue.title}</h2>
            <p class="line-clamp-2 text-[#64748B] font-normal mb-3">${issue.description}</p>
            <div class="flex justify-start items-center flex-wrap gap-1">
              ${labels}
            </div>
          </div>
        </div>
        <div class="p-4 space-y-2">
          <p class="text-[#64748B] text-xs font-normal">#${issue.id} by ${issue.author}</p>
          <p class="text-[#64748B] text-xs font-normal">${date}</p>
        </div>
      </div>
    `;

    container.innerHTML += card;
  });

  showSpinner(false);
}

function showIssueModal(id) {
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then((res) => res.json())
    .then((result) => {
      const issue = result.data;
      const modal = document.getElementById("my_modal_1");

      document.getElementById("modal-title").textContent = issue.title;
      document.getElementById("modal-description").textContent =
        issue.description;
      document.getElementById("modal-assignee").textContent =
        issue.assignee || "Unassigned";
      document.getElementById("modal-date").textContent = new Date(
        issue.createdAt,
      ).toLocaleDateString();
      document.getElementById("modal-meta").textContent =
        `Opened by ${issue.author}`;

      const statusBadge = document.getElementById("modal-status-badge");
      if (issue.status === "open") {
        statusBadge.innerHTML = `<span class="badge bg-[#00A96E] text-white border-none text-xs rounded-full">Opened</span>`;
      } else {
        statusBadge.innerHTML = `<span class="badge bg-[#A855F7] text-white border-none text-xs rounded-full">Closed</span>`;
      }

      document.getElementById("modal-labels").innerHTML = issue.labels
        .map((label) => getLabel(label))
        .join("");
      document.getElementById("modal-priority").innerHTML = getPriority(
        issue.priority,
      );

      modal.showModal();
    });
}

loadIssues();

document.getElementById("search-button").addEventListener("click", () => {
  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase();

  if (searchValue.length > 0) {
    showSpinner(true);

    const tabs = document.querySelectorAll("#tab-all, #tab-open, #tab-closed");
    tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.classList.add("inactive");
    });

    fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`,
    )
      .then((res) => res.json())
      .then((json) => displayIssues(json.data));
  }
});

