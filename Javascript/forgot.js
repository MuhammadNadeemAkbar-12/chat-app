const forgotContainer = document.getElementById('forgot-container');
const forgotForm = document.getElementById('forgot-form');

forgotContainer.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailAddress = document.getElementById('email').value.trim().toLowerCase();
    const userVerificationCode = document.getElementById('verification-code').value.trim();
    const userData = JSON.parse(localStorage.getItem('formData')) || [];

    const user = userData.find(item => item.userEmail === emailAddress && item.userPincode == userVerificationCode);

    if(user) {
        alert("Your email and verification code match. Please reset your password.");
        forgotContainer.style.display = 'none';
        forgotForm.style.display = 'block';
        
        forgotForm.setAttribute('data-email', emailAddress);
    } else {
        alert('Email or verification code is incorrect. Please try again.');
    }
});

forgotForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userNewPassword = document.getElementById('new-password').value;
    const userPasswordConfirm = document.getElementById('confirm-password').value;
    const emailAddress = forgotForm.getAttribute('data-email');
    
    if(userNewPassword !== userPasswordConfirm) {
        alert("Passwords don't match!");
        return;
    }
    
    let userData = JSON.parse(localStorage.getItem('formData')) || [];
    
    const userIndex = userData.findIndex(item => item.userEmail === emailAddress);
    
    if(userIndex !== -1) {
        userData[userIndex].userPassword = userNewPassword;
        localStorage.setItem('formData', JSON.stringify(userData));
        alert("Password updated successfully!");
        window.location.href = "login.html"; 
    } else {
        alert("User not found. Please try the verification process again.");
    }
});