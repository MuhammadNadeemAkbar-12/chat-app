document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
    }

    // Theme toggle event
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark');
        if (body.classList.contains('dark')) {
            themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
            localStorage.setItem('theme', 'light');
        }
    });

    // Password visibility toggle (if button exists)
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye-slash-fill');
        });
    }

    // Form validation and submission
    const loginForm = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');

    // Input validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    function validateVerificationCode(code) {
        return /^\d{6}$/.test(code);
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form values
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value.trim();
        const verificationCode = document.getElementById('verification-code').value.trim();

        // Validate inputs
        let isValid = true;

        // Email validation
        if (!validateEmail(email)) {
            document.getElementById('email-validation').style.display = 'block';
            document.getElementById('email').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('email-validation').style.display = 'none';
            document.getElementById('email').classList.remove('is-invalid');
        }

        // Password validation
        if (password.length < 1) {
            document.getElementById('password-validation').style.display = 'block';
            document.getElementById('password').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('password-validation').style.display = 'none';
            document.getElementById('password').classList.remove('is-invalid');
        }

        // Verification code validation
        if (!validateVerificationCode(verificationCode)) {
            document.getElementById('verification-code-validation').style.display = 'block';
            document.getElementById('verification-code').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('verification-code-validation').style.display = 'none';
            document.getElementById('verification-code').classList.remove('is-invalid');
        }

        if (!isValid) return;

        // Show loading state
        submitText.textContent = 'Logging in...';
        submitSpinner.classList.remove('d-none');
        submitBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // Check credentials against localStorage
            const allUserData = JSON.parse(localStorage.getItem('formData')) || [];
            const user = allUserData.find(user =>
                user.userEmail === email &&
                user.userPassword === password &&
                user.userPincode == verificationCode
            );

            if (user) {
                // Store login state and full user object (including id)
                localStorage.setItem('isLogin', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    userEmail: user.userEmail,
                    username: user.username
                }));

                // Store remember me preference
                const rememberMe = document.getElementById('remember-me').checked;
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Redirect to dashboard
                window.location.href = "/ChatApp/dashboard.html";
            } else {
                // Show error message
                alert("Invalid credentials. Please check your email, password, and verification code.");

                // Reset form state
                submitText.textContent = 'Log In';
                submitSpinner.classList.add('d-none');
                submitBtn.disabled = false;
            }
        }, 1000);
    });

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember-me').checked = true;
    }
});