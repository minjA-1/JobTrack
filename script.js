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

  saveApplications();
  updateStats();
  renderApplications(applications);
  form.reset();

  console.log(applications);
});

const renderApplications = function (apps) {
  applicationsGrid.innerHTML = "";

  apps.forEach((job) => {
    const html = `
      <div class="job-card" data-id="${job.id}">
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
      </div>
    `;

    applicationsGrid.insertAdjacentHTML("beforeend", html);
  });

  if (apps.length > 0) {
    emptyState.classList.add("hidden");
  } else {
    emptyState.classList.remove("hidden");
  }
};

const saveApplications = function () {
  localStorage.setItem("applications", JSON.stringify(applications));
};

const applyFilters = function () {
  const query = searchInput.value.toLowerCase().trim();

  const selectFiltered = applications.filter((job) => {
    return (
      (job.company.toLowerCase().includes(query) ||
        job.position.toLowerCase().includes(query)) &&
      (filterStatus.value === "all" || job.status === filterStatus.value)
    );
  });

  renderApplications(selectFiltered);

  return selectFiltered;
};

const updateStats = function () {
  totalApplications.textContent = applications.length;

  totalInterviews.textContent = applications.filter(
    (job) => job.status === "Interview",
  ).length;

  totalOffers.textContent = applications.filter(
    (job) => job.status === "Offer",
  ).length;

  totalRejected.textContent = applications.filter(
    (job) => job.status === "Rejected",
  ).length;
};

applicationsGrid.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-delete")) {
    const card = e.target.closest(".job-card");
    const id = card.dataset.id;

    const index = applications.findIndex((job) => {
      return job.id === Number(id);
    });

    if (index !== -1) {
      applications.splice(index, 1);

      if (editingId === Number(id)) {
        editingId = null;
        submitBtn.textContent = "Add Application";
        form.reset();
      }

      saveApplications();
      updateStats();
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

searchInput.addEventListener("input", applyFilters);

filterStatus.addEventListener("change", applyFilters);

sortInput.addEventListener("change", function (e) {
  const selectSort = e.target.value;

  const filteredApplications = applyFilters();

  const newApplications = [...filteredApplications];

  newApplications.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (selectSort === "newest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  renderApplications(newApplications);
});

updateStats();
