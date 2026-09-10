"use strict";

// JobTrack - Job Application Tracker

const form = document.getElementById("application-form");

const companyInput = document.getElementById("company-input");
const positionInput = document.getElementById("position-input");
const statusInput = document.getElementById("status-input");
const dateInput = document.getElementById("date-input");
const notesInput = document.getElementById("notes-input");

const applicationsGrid = document.getElementById("applications-grid");
const emptyState = document.getElementById("empty-state");
const formError = document.getElementById("form-error");

const searchInput = document.getElementById("search-input");
const filterStatus = document.getElementById("filter-status");
const sortInput = document.getElementById("sort-input");

const totalApplications = document.getElementById("total-applications");
const totalInterviews = document.getElementById("total-interviews");
const totalOffers = document.getElementById("total-offers");
const totalRejected = document.getElementById("total-rejected");

const submitBtn = document.getElementById("btn-submit");
const savedApplications = localStorage.getItem("applications");

const applications = savedApplications ? JSON.parse(savedApplications) : [];

let editingId = null;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const company = companyInput.value.trim();
  const position = positionInput.value.trim();
  const status = statusInput.value.trim();
  const date = dateInput.value.trim();
  const notes = notesInput.value.trim();

  if (!company || !position || !date) {
    formError.classList.remove("hidden");
    return;
  }
  formError.classList.add("hidden");

  if (editingId === null) {
    const job = {
      id: Date.now(),
      company,
      position,
      status,
      date,
      notes,
    };

    applications.push(job);
  } else {
    const jobToUpdate = applications.find(function (job) {
      return job.id === editingId;
    });
    jobToUpdate.company = company;
    jobToUpdate.position = position;
    jobToUpdate.status = status;
    jobToUpdate.date = date;
    jobToUpdate.notes = notes;

    editingId = null;
    submitBtn.textContent = "Add Application";
  }
  localStorage.setItem("applications", JSON.stringify(applications));
  renderApplications(applications);
  form.reset();
  console.log(applications);
});

const renderApplications = function (apps) {
  applicationsGrid.innerHTML = "";

  apps.forEach((job) => {
    const html = `<div class="job-card" data-id="${job.id}">
  <div class="job-card-header">
    <div class="company-logo">${job.company[0]}</div>

    <div>
      <h3 class="job-company">${job.company}</h3>
      <p class="job-position">${job.position}</p>
    </div>
  </div>

  <span class="status-badge status-${job.status.toLowerCase()}">
    ${job.status}
  </span>

  <div class="job-info">
    <p>📅 ${job.date}</p>
    <p class="job-note">${job.notes}</p>
  </div>

  <div class="card-actions">
    <button class="btn-edit">Edit</button>
    <button class="btn-delete">Delete</button>
  </div>
</div>`;

    applicationsGrid.insertAdjacentHTML("beforeend", html);
  });

  if (apps.length > 0) {
    emptyState.classList.add("hidden");
  } else {
    emptyState.classList.remove("hidden");
  }
};

applicationsGrid.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    const card = e.target.closest(".job-card");
    const id = card.dataset.id;

    const index = applications.findIndex(function (job) {
      return job.id === Number(id);
    });

    if (index !== -1) {
      applications.splice(index, 1);
      localStorage.setItem("applications", JSON.stringify(applications));
      renderApplications(applications);
    }
  }

  if (e.target.classList.contains("btn-edit")) {
    const card = e.target.closest(".job-card");
    const id = card.dataset.id;

    const job = applications.find(function (job) {
      return job.id === Number(id);
    });

    companyInput.value = job.company;
    positionInput.value = job.position;
    statusInput.value = job.status;
    dateInput.value = job.date;
    notesInput.value = job.notes;
    editingId = job.id;

    submitBtn.textContent = "Update Application";
  }
});
renderApplications(applications);

searchInput.addEventListener("input", function (e) {
  const query = e.target.value.trim().toLowerCase();

  const filteredApplications = applications.filter((job) => {
    return (
      (job.company.toLowerCase().includes(query) ||
        job.position.toLowerCase().includes(query)) &&
      (filterStatus.value === "all" || job.status === filterStatus.value)
    );
  });
  renderApplications(filteredApplications);
});

filterStatus.addEventListener("change", function (e) {
  const selectStatus = e.target.value;

  const selectFiltered = applications.filter((job) => {
    return filterStatus.value === "all" || job.status === filterStatus.value;
  });
  renderApplications(selectFiltered);
});
