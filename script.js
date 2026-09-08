"use strict";

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
