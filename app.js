const planSelect = document.querySelector("#plan");
const paymentSelect = document.querySelector("#payment");
const summaryText = document.querySelector("#summary-text");
const form = document.querySelector("#premium-form");
const agree = document.querySelector("#agree");
const agreeError = document.querySelector("#agree-error");
const message = document.querySelector("#form-message");
const modeButtons = document.querySelectorAll(".mode-btn");
const fieldGroups = document.querySelectorAll(".field-group");

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const plans = {
  "CapCut Pro": 49000,
  "Netflix": 59000,
  "Canva Pro": 55000,
  "ChatGPT Premium": 79000,
};

const updateSummary = (planName) => {
  if (!planName || !plans[planName]) {
    summaryText.textContent = "Belum ada paket dipilih.";
    return;
  }

  summaryText.textContent = `${planName} - ${currency.format(plans[planName])} / bulan`;
};

const setError = (field, text) => {
  const group = document.querySelector(`[data-field="${field}"]`);
  if (!group) return;
  const error = group.querySelector(".error");
  if (error) error.textContent = text;
};

const clearErrors = () => {
  document.querySelectorAll(".error").forEach((node) => {
    node.textContent = "";
  });
  agreeError.textContent = "";
  message.textContent = "";
};

const toggleMode = (mode) => {
  modeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  fieldGroups.forEach((group) => {
    const only = group.dataset.only;
    if (only === "signup") {
      group.style.display = mode === "signup" ? "grid" : "none";
      const input = group.querySelector("input");
      if (input) input.required = mode === "signup";
    }
  });
};

document.querySelectorAll(".choose").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const card = event.target.closest(".service");
    if (!card) return;
    const plan = card.dataset.plan;
    planSelect.value = plan;
    updateSummary(plan);
    document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
  });
});

planSelect.addEventListener("change", (event) => {
  updateSummary(event.target.value);
});

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => toggleMode(btn.dataset.mode));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  let valid = true;
  const nama = document.querySelector("#nama");
  const email = document.querySelector("#email");
  const telepon = document.querySelector("#telepon");
  const password = document.querySelector("#password");
  const confirm = document.querySelector("#confirm");

  if (nama && nama.required && nama.value.trim().length < 3) {
    setError("nama", "Nama minimal 3 karakter.");
    valid = false;
  }

  if (!email.value.includes("@")) {
    setError("email", "Email tidak valid.");
    valid = false;
  }

  if (telepon && telepon.required && telepon.value.trim().length < 9) {
    setError("telepon", "No. telepon minimal 9 digit.");
    valid = false;
  }

  if (password.value.trim().length < 6) {
    setError("password", "Password minimal 6 karakter.");
    valid = false;
  }

  if (confirm && confirm.required && confirm.value !== password.value) {
    setError("confirm", "Konfirmasi password tidak cocok.");
    valid = false;
  }

  if (!paymentSelect.value) {
    setError("payment", "Pilih metode pembayaran.");
    valid = false;
  }

  if (!planSelect.value) {
    setError("plan", "Pilih layanan terlebih dahulu.");
    valid = false;
  }

  if (!agree.checked) {
    agreeError.textContent = "Kamu harus menyetujui syarat & ketentuan.";
    valid = false;
  }

  if (!valid) {
    message.textContent = "Periksa kembali data yang wajib diisi.";
    return;
  }

  message.textContent = "Berhasil! Data kamu sudah tercatat untuk proses langganan.";
  form.reset();
  updateSummary("");
  toggleMode("signup");
});

updateSummary("");
toggleMode("signup");
