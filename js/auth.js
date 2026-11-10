/**
 * Authentication Script for STACKLY AUTO Platform
 * Handles Signup and Login Validations, Password Strength Meters, and Session Management
 */

// ==========================================================================
// 1. SIGNUP / CREATE ACCOUNT FORM
// ==========================================================================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const agreeTerms = document.getElementById("agreeTerms");

  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const agreeTermsError = document.getElementById("agreeTermsError");
  const roleError = document.getElementById("signupRoleError");

  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  const matchMsg = document.getElementById("matchMsg");

  // Helper UI functions
  function setFieldError(input, box, errorEl, msg) {
    if (box) box.style.borderColor = "#dc3545";
    if (errorEl) {
      if (msg) errorEl.textContent = msg;
      errorEl.style.display = "block";
    }
  }

  function clearFieldError(input, box, errorEl) {
    if (box) box.style.borderColor = "rgba(0,0,0,0.06)";
    if (errorEl) errorEl.style.display = "none";
  }

  // Real-time restriction: Name takes ONLY alphabets, NO spaces, max 16 characters
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^A-Za-z]/g, "").slice(0, 16);
      if (this.value.length > 0) {
        clearFieldError(this, this.closest(".signup-field-box"), nameError);
      }
    });
  }

  // Real-time restriction: Phone takes ONLY numbers, max 10 digits
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 10);
      if (this.value.length === 10) {
        clearFieldError(this, this.closest(".signup-field-box"), phoneError);
      }
    });
  }

  // Real-time Gmail validation
  if (emailInput) {
    emailInput.addEventListener("input", function () {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (gmailRegex.test(this.value.trim())) {
        clearFieldError(this, this.closest(".signup-field-box"), emailError);
      }
    });
  }

  // Password Strength Checker (all 5: length >= 8, uppercase, lowercase, number, symbol)
  function checkSignupPasswordStrength(v) {
    if (!v) return { passed: 0, isStrong: false };
    const rules = {
      len: v.length >= 8,
      upper: /[A-Z]/.test(v),
      lower: /[a-z]/.test(v),
      num: /[0-9]/.test(v),
      sym: /[^A-Za-z0-9]/.test(v)
    };
    let passed = 0;
    Object.values(rules).forEach(val => { if (val) passed++; });
    return { passed, rules, isStrong: passed === 5 };
  }

  function updateSignupStrengthMeter() {
    if (!passwordInput || !strengthBar || !strengthText) return;
    const v = passwordInput.value;
    if (v.length === 0) {
      strengthBar.style.width = "0%";
      strengthText.textContent = "Enter password";
      strengthText.style.color = "inherit";
      checkPasswordsMatch();
      return;
    }
    const { passed, isStrong } = checkSignupPasswordStrength(v);
    if (passed <= 2) {
      strengthBar.style.width = "35%";
      strengthBar.style.setProperty("background-color", "#dc3545", "important");
      strengthText.textContent = "Weak (needs A-Z, a-z, 0-9, symbol)";
      strengthText.style.color = "#dc3545";
    } else if (passed === 3) {
      strengthBar.style.width = "60%";
      strengthBar.style.setProperty("background-color", "#fd7e14", "important");
      strengthText.textContent = "Fair (almost there)";
      strengthText.style.color = "#fd7e14";
    } else if (passed === 4) {
      strengthBar.style.width = "80%";
      strengthBar.style.setProperty("background-color", "#ffc107", "important");
      strengthText.textContent = "Good (add missing requirement)";
      strengthText.style.color = "#d97706";
    } else if (isStrong) {
      strengthBar.style.width = "100%";
      strengthBar.style.setProperty("background-color", "#10b981", "important");
      strengthText.textContent = "Strong Password \u2714";
      strengthText.style.color = "#10b981";
    }
    checkPasswordsMatch();
  }

  function checkPasswordsMatch() {
    if (!confirmPasswordInput) return;
    const p1 = passwordInput ? passwordInput.value : "";
    const p2 = confirmPasswordInput.value;
    if (p2.length > 0) {
      if (p1 === p2) {
        if (matchMsg) {
          matchMsg.style.color = "#10b981";
          matchMsg.innerHTML = '<i class="fas fa-check-circle me-1"></i>Passwords match';
        }
        clearFieldError(confirmPasswordInput, confirmPasswordInput.closest(".signup-field-box"), confirmPasswordError);
      } else {
        if (matchMsg) {
          matchMsg.style.color = "#dc3545";
          matchMsg.innerHTML = '<i class="fas fa-times-circle me-1"></i>Passwords do not match';
        }
      }
    } else {
      if (matchMsg) matchMsg.innerHTML = "";
    }
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      updateSignupStrengthMeter();
      const { isStrong } = checkSignupPasswordStrength(this.value);
      if (isStrong) {
        clearFieldError(this, this.closest(".signup-field-box"), passwordError);
      }
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", function () {
      checkPasswordsMatch();
      const p1 = passwordInput ? passwordInput.value : "";
      if (this.value === p1 && this.value.length > 0) {
        clearFieldError(this, this.closest(".signup-field-box"), confirmPasswordError);
      }
    });
  }

  if (agreeTerms) {
    agreeTerms.addEventListener("change", function () {
      if (this.checked && agreeTermsError) {
        agreeTermsError.style.display = "none";
      }
    });
  }

  // Form Submit Handler
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    let firstInvalid = null;

    // 1. Role validation (Mandatory)
    const selectedRoleInput = document.querySelector('input[name="role"]:checked');
    const role = selectedRoleInput ? selectedRoleInput.value : '';
    if (!role) {
      isValid = false;
      if (roleError) roleError.style.display = "block";
    } else if (roleError) {
      roleError.style.display = "none";
    }

    // 2. Name validation: ONLY ALPHABETS, NO SPACES, MAX 16 LETTERS, MANDATORY
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const nameBox = nameInput ? nameInput.closest(".signup-field-box") : null;
    const nameRegex = /^[A-Za-z]{1,16}$/;

    if (!nameVal) {
      isValid = false;
      if (!firstInvalid) firstInvalid = nameInput;
      setFieldError(nameInput, nameBox, nameError, "Full Name is mandatory.");
    } else if (!nameRegex.test(nameVal)) {
      isValid = false;
      if (!firstInvalid) firstInvalid = nameInput;
      setFieldError(nameInput, nameBox, nameError, "Name must contain only alphabets with no spaces (maximum 16 letters).");
    } else {
      clearFieldError(nameInput, nameBox, nameError);
    }

    // 3. Phone validation: NUMBERS ONLY, EXACTLY 10 DIGITS, MANDATORY
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const phoneBox = phoneInput ? phoneInput.closest(".signup-field-box") : null;
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneVal) {
      isValid = false;
      if (!firstInvalid) firstInvalid = phoneInput;
      setFieldError(phoneInput, phoneBox, phoneError, "Phone number is mandatory.");
    } else if (!phoneRegex.test(phoneVal)) {
      isValid = false;
      if (!firstInvalid) firstInvalid = phoneInput;
      setFieldError(phoneInput, phoneBox, phoneError, "Phone number must be exactly 10 digits.");
    } else {
      clearFieldError(phoneInput, phoneBox, phoneError);
    }

    // 4. Gmail validation: MANDATORY & STRICT GMAIL FORMAT (@gmail.com)
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailBox = emailInput ? emailInput.closest(".signup-field-box") : null;
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    if (!emailVal) {
      isValid = false;
      if (!firstInvalid) firstInvalid = emailInput;
      setFieldError(emailInput, emailBox, emailError, "Gmail address is mandatory.");
    } else if (!gmailRegex.test(emailVal)) {
      isValid = false;
      if (!firstInvalid) firstInvalid = emailInput;
      setFieldError(emailInput, emailBox, emailError, "Please enter a valid Gmail address (@gmail.com).");
    } else {
      clearFieldError(emailInput, emailBox, emailError);
    }

    // 5. Password validation: MANDATORY & STRONG PASSWORD
    const pwdVal = passwordInput ? passwordInput.value : '';
    const pwdBox = passwordInput ? passwordInput.closest(".signup-field-box") : null;
    const { isStrong } = checkSignupPasswordStrength(pwdVal);

    if (!pwdVal) {
      isValid = false;
      if (!firstInvalid) firstInvalid = passwordInput;
      setFieldError(passwordInput, pwdBox, passwordError, "Password is mandatory.");
    } else if (!isStrong) {
      isValid = false;
      if (!firstInvalid) firstInvalid = passwordInput;
      setFieldError(passwordInput, pwdBox, passwordError, "Password must be a strong password: min 8 chars with uppercase, lowercase, number, and special character.");
    } else {
      clearFieldError(passwordInput, pwdBox, passwordError);
    }

    // 6. Confirm Password validation: MANDATORY & MUST MATCH PASSWORD
    const confirmVal = confirmPasswordInput ? confirmPasswordInput.value : '';
    const confirmBox = confirmPasswordInput ? confirmPasswordInput.closest(".signup-field-box") : null;

    if (!confirmVal) {
      isValid = false;
      if (!firstInvalid) firstInvalid = confirmPasswordInput;
      setFieldError(confirmPasswordInput, confirmBox, confirmPasswordError, "Confirm password is mandatory.");
    } else if (confirmVal !== pwdVal) {
      isValid = false;
      if (!firstInvalid) firstInvalid = confirmPasswordInput;
      setFieldError(confirmPasswordInput, confirmBox, confirmPasswordError, "Passwords do not match.");
    } else {
      clearFieldError(confirmPasswordInput, confirmBox, confirmPasswordError);
    }

    // 7. Terms Agreement: MANDATORY
    if (agreeTerms && !agreeTerms.checked) {
      isValid = false;
      if (!firstInvalid) firstInvalid = agreeTerms;
      if (agreeTermsError) agreeTermsError.style.display = "block";
    } else if (agreeTermsError) {
      agreeTermsError.style.display = "none";
    }

    // If ALL mandatory details are valid, save account and render to login.html
    if (isValid) {
      localStorage.setItem(
        "user_" + emailVal,
        JSON.stringify({ name: nameVal, role: role, email: emailVal, phone: phoneVal, password: pwdVal })
      );
      window.location.href = "login.html";
    } else if (firstInvalid) {
      firstInvalid.focus();
    }
  });
}

// ==========================================================================
// 2. LOGIN FORM VALIDATION & STRONG PASSWORD ENFORCEMENT
// ==========================================================================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const rememberMe = document.getElementById("rememberMe");
  const loginStrengthBar = document.getElementById("loginStrengthBar");
  const loginStrengthText = document.getElementById("loginStrengthText");

  const emailError = document.getElementById("loginEmailError");
  const passwordError = document.getElementById("loginPasswordError");
  const rememberError = document.getElementById("loginRememberError");
  const roleError = document.getElementById("loginRoleError");

  function setLoginFieldError(input, box, errorEl, msg) {
    if (box) box.style.borderColor = "#dc3545";
    if (errorEl) {
      if (msg) errorEl.textContent = msg;
      errorEl.style.display = "block";
    }
  }

  function clearLoginFieldError(input, box, errorEl) {
    if (box) box.style.borderColor = "rgba(0,0,0,0.06)";
    if (errorEl) errorEl.style.display = "none";
  }

  function checkLoginPasswordStrength(v) {
    if (!v) return { passed: 0, isStrong: false };
    const rules = {
      len: v.length >= 8,
      upper: /[A-Z]/.test(v),
      lower: /[a-z]/.test(v),
      num: /[0-9]/.test(v),
      sym: /[^A-Za-z0-9]/.test(v)
    };
    let passed = 0;
    Object.values(rules).forEach(val => { if (val) passed++; });
    return { passed, rules, isStrong: passed === 5 };
  }

  function updateLoginStrengthMeter() {
    if (!loginPassword || !loginStrengthBar || !loginStrengthText) return;
    const v = loginPassword.value;
    if (v.length === 0) {
      loginStrengthBar.style.width = "0%";
      loginStrengthText.textContent = "Enter password";
      loginStrengthText.style.color = "inherit";
      return;
    }
    const { passed, isStrong } = checkLoginPasswordStrength(v);
    
    if (passed <= 2) {
      loginStrengthBar.style.width = "35%";
      loginStrengthBar.style.setProperty("background-color", "#dc3545", "important");
      loginStrengthText.textContent = "Weak (needs A-Z, a-z, 0-9, symbol)";
      loginStrengthText.style.color = "#dc3545";
    } else if (passed === 3) {
      loginStrengthBar.style.width = "60%";
      loginStrengthBar.style.setProperty("background-color", "#fd7e14", "important");
      loginStrengthText.textContent = "Fair (almost there)";
      loginStrengthText.style.color = "#fd7e14";
    } else if (passed === 4) {
      loginStrengthBar.style.width = "80%";
      loginStrengthBar.style.setProperty("background-color", "#ffc107", "important");
      loginStrengthText.textContent = "Good (add missing requirement)";
      loginStrengthText.style.color = "#d97706";
    } else if (isStrong) {
      loginStrengthBar.style.width = "100%";
      loginStrengthBar.style.setProperty("background-color", "#10b981", "important");
      loginStrengthText.textContent = "Strong Password \u2714";
      loginStrengthText.style.color = "#10b981";
    }
  }

  if (loginPassword) {
    loginPassword.addEventListener("input", function() {
      updateLoginStrengthMeter();
      const box = this.closest(".login-field-box");
      const { isStrong } = checkLoginPasswordStrength(this.value);
      if (isStrong) {
        clearLoginFieldError(this, box, passwordError);
      }
    });
  }

  if (loginEmail) {
    loginEmail.addEventListener("input", function() {
      const box = this.closest(".login-field-box");
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (gmailRegex.test(this.value.trim())) {
        clearLoginFieldError(this, box, emailError);
      }
    });
  }

  if (rememberMe) {
    rememberMe.addEventListener("change", function() {
      if (this.checked && rememberError) {
        rememberError.style.display = "none";
      }
    });
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    let firstInvalid = null;

    // 1. Role validation (Mandatory)
    const selectedRoleInput = document.querySelector('input[name="role"]:checked');
    const role = selectedRoleInput ? selectedRoleInput.value : '';
    if (!role) {
      isValid = false;
      if (roleError) roleError.style.display = "block";
    } else if (roleError) {
      roleError.style.display = "none";
    }

    // 2. Gmail validation (Mandatory & strictly Gmail format)
    const emailVal = loginEmail ? loginEmail.value.trim() : '';
    const emailBox = loginEmail ? loginEmail.closest(".login-field-box") : null;
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    if (!emailVal) {
      isValid = false;
      if (!firstInvalid) firstInvalid = loginEmail;
      setLoginFieldError(loginEmail, emailBox, emailError, "Gmail address is mandatory.");
    } else if (!gmailRegex.test(emailVal)) {
      isValid = false;
      if (!firstInvalid) firstInvalid = loginEmail;
      setLoginFieldError(loginEmail, emailBox, emailError, "Please enter a valid Gmail address (@gmail.com).");
    } else {
      clearLoginFieldError(loginEmail, emailBox, emailError);
    }

    // 3. Password validation (Mandatory & must be Strong Password)
    const pwdVal = loginPassword ? loginPassword.value : '';
    const pwdBox = loginPassword ? loginPassword.closest(".login-field-box") : null;
    const { isStrong } = checkLoginPasswordStrength(pwdVal);

    if (!pwdVal) {
      isValid = false;
      if (!firstInvalid) firstInvalid = loginPassword;
      setLoginFieldError(loginPassword, pwdBox, passwordError, "Password is mandatory.");
    } else if (!isStrong) {
      isValid = false;
      if (!firstInvalid) firstInvalid = loginPassword;
      setLoginFieldError(loginPassword, pwdBox, passwordError, "Password must be a strong password: min 8 chars with uppercase, lowercase, number, and special character.");
    } else {
      clearLoginFieldError(loginPassword, pwdBox, passwordError);
    }

    // 4. Remember Me validation (Mandatory)
    if (rememberMe && !rememberMe.checked) {
      isValid = false;
      if (!firstInvalid) firstInvalid = rememberMe;
      if (rememberError) rememberError.style.display = "block";
    } else if (rememberError) {
      rememberError.style.display = "none";
    }

    if (isValid) {
      const user = { name: emailVal.split("@")[0], role: role, email: emailVal };
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else if (firstInvalid) {
      firstInvalid.focus();
    }
  });
}

// ==========================================================================
// 3. UNIVERSAL PASSWORD VISIBILITY TOGGLE
// ==========================================================================
document.querySelectorAll('.toggle-password').forEach(toggle => {
  toggle.addEventListener('click', function () {
    const input = this.parentElement.querySelector('input');
    if (input) {
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);

      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      }
    }
  });
});
