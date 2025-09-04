# 🚀 ChatApp - Modern Local Chat System

Welcome to ChatApp! This is a modern, responsive chat application built with
pure HTML, CSS, and JavaScript. All data is stored locally in your browser (no
backend required).

## 🔗 Live Demo

Production Deployment: https://chat-erwj7iwi6-muhammad-nadeem-akbars-projects.vercel.app

> If this per-deployment URL ever changes, use the project domain from Vercel dashboard and update here.

## ✨ Features

- 📝 Sign Up & Login (with email, password, and verification code)
- 💬 Real-time chat between users (local browser storage)
- 👥 Add contacts by email
- 🗑️ Delete messages (for me or for everyone)
- ✏️ Edit your own messages
- 🌗 Light/Dark mode toggle
- 🔒 Forgot password & password reset
- 📱 Responsive design (works on mobile & desktop)
- 🎨 Beautiful UI with Bootstrap

## 🛠️ How to Use

1. **Clone or Download** this repository.
2. Open `signup.html` in your browser and create a new account.
3. Login with your credentials.
4. Add contacts by their email (they must be signed up).
5. Start chatting! Edit or delete your own messages, and enjoy the UI.

## 📦 Project Structure

```
ChatApp/
├── dashboard.html
├── forgot.html
├── login.html
├── signup.html
├── Javascript/
│   ├── dash.js
│   ├── forgot.js
│   ├── login.js
│   └── signup.js
├── styling/
│   └── signUp.css
└── backgroud-image.avif
```

## 🧑‍💻 Technologies Used

- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (ES6)

## ⚡ Quick Demo

- No server required! Just open the HTML files in your browser.
- All chat and user data is stored in your browser's localStorage.

## 📝 Notes

- This app is for demo/learning purposes. For real-time, multi-device chat, you
  need a backend (Node.js, Firebase, etc).
- You can customize the UI, add avatars, or connect to a server if you want!

## 🌐 Deployment (Vercel or Any Static Host)

This project is 100% front-end (no build step). To deploy on **Vercel**:

1. Ensure `index.html` exists in the project root (already added).
2. Push the repo to GitHub.
3. In Vercel: `Add New Project` → Import the GitHub repo.
4. Framework preset: choose `Other` (because it's plain HTML/JS).
5. Build Command: leave **empty**.
6. Output Directory: leave **empty** (Vercel will serve root files).
7. Deploy.

Custom domain or preview should now open `https://<your-domain>/` showing the
landing page with links to Sign Up / Login.

If you change only static files, each push will instantly redeploy.

### Alternate Hosting

- GitHub Pages: Move all files to repo root (already) → Settings → Pages →
  Deploy from Branch.
- Netlify: Drag & drop the folder or connect repo (no build command needed).

## 🙏 Credits

Made with ❤️ by Muhammad Nadeem Akbar & contributors.

## 📧 Contact

For questions or feedback, open an issue or email: nadeemakbar1201@gmail.com

Enjoy chatting! 😃
