<p align="center">
  <a href="https://maurogioberti.com" target="_blank">
    <img alt="Mauro Gioberti" src="https://maurogioberti.com/maurogioberti.png" width="200" />
  </a>
</p>

<h1 align="center">
  My Personal Portfolio 🚀
</h1>
<p align="center">
  Welcome to my personal website! 🌟
  <br />
  A hub for my portfolio, blog, and professional services.
  <br />
  <br />
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/stargazers">⭐ Stars are welcome 😊</a>
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/issues">🐛 Report an issue</a>
  <a href="https://maurogioberti.com">🌐 Visit my site</a>
</p>

<p>
  <a href="https://github.com/maurogioberti/next-clean-architecture" title="CodeScouts Academy" target="_blank">
    <img src="https://img.shields.io/badge/built_with-Next.js | Clean Architecture | " alt="Built with Next.js, Clean Architecture, used Codescouts as Reference" />
  </a>
</p>

<span>
  <img src="https://img.shields.io/badge/maintained-yes-green" alt="maintained - yes">
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/contribute"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen" alt="contributions - welcome"></a>
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="license - MIT"></a>
</span>

---

## 🚀 About This Project

This website serves as a personal platform to showcase my work, share my blog posts, and offer professional services. It's designed with simplicity and scalability in mind, following **Clean Architecture** principles.

### Key Features
- **Portfolio**: Highlighting my skills, work history, and key achievements.
- **Blog**: Sharing insights and lessons learned from my experience in technology and consulting.
- **Professional Services**: A dedicated section for showcasing the services I offer.

---

## 🚀 Getting Started

⬇️ **Clone this repo**
```bash
git clone https://github.com/maurogioberti/maurogioberti.github.io.git
cd maurogioberti.github.io
```

🏂 **Install dependencies**
```bash
npm install
```

🏁 **Run the app**
```bash
npm run dev
```

---

## 📂 Folder Structure

This project is structured to align with **Clean Architecture** principles:

```
project-root/
├── src/
│   ├── core/
│   │   ├── domain/  # Business rules
│   │   ├── application/  # Use cases
│   │   └── infrastructure/  # External services
│   └── app/
│       ├── layout.tsx  # Global layout
│       ├── pages/  # Next.js pages
│       │   ├── index.tsx  # Homepage
│       │   ├── blogs/  # Blog section
│       │   ├── events/  # Events section
│       │   └── services/  # Services section
│       └── components/  # Reusable UI components
├── public/  # Static assets
└── di.ts  # Dependency injection configuration
```

This structure ensures:
- Separation of concerns between business logic and UI.
- Easy scalability and maintainability.

---

## 🧪 Testing

Clean Architecture makes testing simple:
- **Mockable Dependencies**: Repositories and services can be easily mocked using `jest`.
- **Unit Testing**: Business logic and use cases are isolated for thorough testing.

---

## 📜 License

Released under [MIT License](https://github.com/maurogioberti/maurogioberti.github.io/blob/master/LICENSE) by [Mauro Gioberti](https://maurogioberti.com).

---