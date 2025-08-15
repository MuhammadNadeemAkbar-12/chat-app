// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeIcon.className = dark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
});

// Initialize theme from localStorage or prefer-color-scheme
const preferredTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(preferredTheme === 'dark');

// Form validation and submission
document.addEventListener('DOMContentLoaded', function () {
    const signUpForm = document.getElementById('signup-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const verificationCodeInput = document.getElementById('verification-code');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');

    // Toggle password visibility (if button exists)
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').className = type === 'password' ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill';
        });
    }

    // Password strength indicator (if bar exists)
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const strengthBar = document.getElementById('password-strength-bar');
            if (!strengthBar) return;
            const strength = calculatePasswordStrength(this.value);
            strengthBar.style.width = strength.percentage + '%';
            strengthBar.style.backgroundColor = strength.color;
        });
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length === 0) return { percentage: 0, color: 'transparent' };
        if (password.length > 6) strength += 20;
        if (password.length > 10) strength += 20;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^A-Za-z0-9]/.test(password)) strength += 15;
        if (password.match(/password|123456|qwerty/i)) strength = Math.max(10, strength - 30);
        strength = Math.min(100, strength);
        let color;
        if (strength < 40) color = '#dc3545';
        else if (strength < 70) color = '#fd7e14';
        else if (strength < 90) color = '#ffc107';
        else color = '#28a745';
        return { percentage: strength, color };
    }

    // Real-time validation
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    verificationCodeInput.addEventListener('input', validateVerificationCode);

    function validateUsername() {
        const isValid = usernameInput.value.trim().length >= 3;
        toggleValidation(usernameInput, isValid, 'username-validation');
        return isValid;
    }
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailInput.value.trim());
        toggleValidation(emailInput, isValid, 'email-validation');
        return isValid;
    }
    function validatePassword() {
        const isValid = passwordInput.value.trim().length >= 6;
        toggleValidation(passwordInput, isValid, 'password-validation');
        return isValid;
    }
    function validateConfirmPassword() {
        const isValid = confirmPasswordInput.value.trim() === passwordInput.value.trim();
        toggleValidation(confirmPasswordInput, isValid, 'confirm-password-validation');
        return isValid;
    }
    function validateVerificationCode() {
        const isValid = /^\d{6}$/.test(verificationCodeInput.value.trim());
        toggleValidation(verificationCodeInput, isValid, 'verification-code-validation');
        return isValid;
    }
    function toggleValidation(inputElement, isValid, validationMessageId) {
        const validationMessage = document.getElementById(validationMessageId);
        if (!validationMessage) return;
        if (inputElement.value.trim() === '') {
            inputElement.classList.remove('is-valid', 'is-invalid');
            validationMessage.style.display = 'none';
            return;
        }
        if (isValid) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
            validationMessage.style.display = 'none';
        } else {
            inputElement.classList.remove('is-valid');
            inputElement.classList.add('is-invalid');
            validationMessage.style.display = 'block';
        }
    }

    // Form submission
    signUpForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Validate all fields
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isVerificationCodeValid = validateVerificationCode();
        const isTermsChecked = document.getElementById('terms').checked;

        if (!isTermsChecked) {
            alert('Please agree to the Terms and Conditions');
            return;
        }

        if (isUsernameValid && isEmailValid && isPasswordValid &&
            isConfirmPasswordValid && isVerificationCodeValid) {
            // Show loading state
            if (submitText) submitText.textContent = 'Creating Account...';
            if (submitSpinner) submitSpinner.classList.remove('d-none');
            if (submitBtn) submitBtn.disabled = true;

            // Simulate API call with setTimeout
            setTimeout(() => {
                // Generate a unique id (string) for each user
                function generateUserId() {
                    return 'u_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
                }

                // Get form values
                const username = usernameInput.value.trim();
                const userEmail = emailInput.value.trim().toLowerCase();
                const userPassword = passwordInput.value.trim();
                const userPincode = verificationCodeInput.value.trim();

                // Store Data In Local Storage
                const storedData = localStorage.getItem('formData');
                const allUsers = storedData ? JSON.parse(storedData) : [];

                if (allUsers.some(user => user.userEmail.toLowerCase() === userEmail)) {
                    alert('Email already exists');
                    if (submitText) submitText.textContent = 'Sign Up';
                    if (submitSpinner) submitSpinner.classList.add('d-none');
                    if (submitBtn) submitBtn.disabled = false;
                    return;
                }

                const newUser = {
                    id: generateUserId(), // unique string id
                    username,
                    userEmail,
                    userPassword,
                    userPincode,
                    friends: [], // store only ids
                    chat: {},
                    createdAt: new Date().toISOString()
                };

                allUsers.push(newUser);
                localStorage.setItem('formData', JSON.stringify(allUsers));

                // Show success message
                if (submitText) submitText.textContent = 'Success! Redirecting...';

                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }, 1000);
        }
    });
});