document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Check for saved theme preference (using in-memory storage for demo)
    let currentTheme = 'light'; // Default theme

    // Theme toggle event
    themeToggle.addEventListener('click', function () {
        body.classList.toggle('dark');
        if (body.classList.contains('dark')) {
            if (themeIcon) themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
            currentTheme = 'dark';
        } else {
            if (themeIcon) themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
            currentTheme = 'light';
        }
    });

    // Password visibility toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
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

    // Real-time validation
    const inputs = ['email', 'password', 'verification-code'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidation);
        }
    });

    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (input.id) {
            case 'email':
                isValid = validateEmail(value.toLowerCase());
                errorMessage = 'Please enter a valid email address';
                break;
            case 'password':
                isValid = value.length >= 1;
                errorMessage = 'Password is required';
                break;
            case 'verification-code':
                isValid = validateVerificationCode(value);
                errorMessage = 'Code must be 6 digits';
                break;
        }

        showValidation(input.id, !isValid, errorMessage);
    }

    function clearValidation(e) {
        const input = e.target;
        if (input.classList.contains('is-invalid')) {
            showValidation(input.id, false);
        }
    }

    function showValidation(inputId, isInvalid, message = '') {
        const input = document.getElementById(inputId);
        const validation = document.getElementById(inputId + '-validation');

        if (isInvalid) {
            input.classList.add('is-invalid');
            if (validation) {
                validation.textContent = message;
                validation.style.display = 'block';
            }
        } else {
            input.classList.remove('is-invalid');
            if (validation) {
                validation.style.display = 'none';
            }
        }
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form values
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value.trim();
        const verificationCode = document.getElementById('verification-code').value.trim();

        // Validate all inputs
        let isValid = true;

        if (!validateEmail(email)) {
            showValidation('email', true, 'Please enter a valid email address');
            isValid = false;
        } else {
            showValidation('email', false);
        }

        if (password.length < 1) {
            showValidation('password', true, 'Password is required');
            isValid = false;
        } else {
            showValidation('password', false);
        }

        if (!validateVerificationCode(verificationCode)) {
            showValidation('verification-code', true, 'Code must be 6 digits');
            isValid = false;
        } else {
            showValidation('verification-code', false);
        }

        if (!isValid) return;

        // Show loading state
        submitText.textContent = 'Signing in...';
        submitSpinner.classList.remove('d-none');
        submitBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // Read real users from localStorage
            const allUserData = JSON.parse(localStorage.getItem('formData')) || [];
            const user = allUserData.find(user =>
                user.userEmail === email &&
                user.userPassword === password &&
                user.userPincode == verificationCode
            );

            if (user) {
                // Store login state and user info
                localStorage.setItem('isLogin', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    userEmail: user.userEmail,
                    username: user.username
                }));

                // Remember me
                const rememberMe = document.getElementById('remember-me').checked;
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Show error message
                alert("Invalid credentials. Please check your email, password, and verification code.");
                submitText.textContent = 'Sign In';
                submitSpinner.classList.add('d-none');
                submitBtn.disabled = false;
            }
        }, 1000);
    });

    // Remember me functionality (demo)
    const rememberedEmail = ''; // Demo remembered email
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember-me').checked = true;
    }

    // Add smooth scroll behavior for mobile
    if (window.innerWidth <= 768) {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }

    // Add input formatting for verification code
    const verificationInput = document.getElementById('verification-code');
    verificationInput.addEventListener('input', function (e) {
        // Only allow digits
        this.value = this.value.replace(/\D/g, '');
    });

    // Add loading animation to theme toggle
    themeToggle.addEventListener('click', function () {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });

    // Preload images for better performance
    const preloadImg = new Image();
    preloadImg.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
});