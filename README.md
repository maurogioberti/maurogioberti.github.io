<p align="center">
  <a href="https://maurogioberti.com" target="_blank">
    <img alt="Mauro Gioberti" src="https://www.maurogioberti.com/assets/profile/maurogioberti-avatar.png" width="200" />
  </a>
</p>

<h1 align="center">
  My Personal Portfolio 🚀
</h1>

<p align="center">
  Welcome to my personal website! 🌟
  <br />
  A hub for my portfolio, blog, talks, resume, and professional services.
  <br />
  <br />
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/stargazers">⭐ Stars are welcome 😊</a>
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/issues">🐛 Report an issue</a>
  <a href="https://maurogioberti.com">🌐 Visit my site</a>
</p>

<p>
  <a href="https://github.com/maurogioberti/next-clean-architecture" title="CodeScouts Academy" target="_blank">
    <img src="https://img.shields.io/badge/built_with-Next.js | Clean Architecture-blue?style=for-the-badge" alt="Built with Next.js, Clean Architecture, inspired by Codescouts React Clean Architecture" />
  </a>
</p>

<span>
  <img src="https://img.shields.io/badge/maintained-yes-green" alt="maintained - yes">
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/contribute"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen" alt="contributions - welcome"></a>
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="license - MIT"></a>
</span>

---

## 🚀 About This Project

This website is my personal platform to showcase my work, share blog posts, and present my professional services.

Built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS 4**, following **Clean Architecture** principles.

The codebase is designed to keep **business logic** independent from the **UI layer**, with clear separation between domain models, use cases, infrastructure, and presentation. Dependency Injection is used to wire services, repositories, and use cases in a predictable and maintainable way.

The goal is simple:
👉 Keep business logic independent from the UI  
👉 Make everything scalable, testable, and easy to evolve  

### ✨ Key Features

- **Portfolio** → Skills, experience, and key achievements  
- **Blog** → Real insights from software engineering and consulting  
- **Talks** → Conferences, meetups, and presentations  
- **Resume** → Timeline + recommendations  
- **Services** → What I can help you with  

## 🛠 Tech Stack

- **Runtime**: Node.js 25.8.1 (via `.nvmrc`)
- **Framework**: Next.js 15 (App Router under `src/app`)
- **Language**: TypeScript 5
- **UI**: React 19 + Tailwind CSS 4 (with custom design tokens and theme support)
- **Architecture**: Clean Architecture (domain, application, infrastructure, crosscutting)
- **Styling**: Design tokens via CSS variables in `src/app/globals.css`
- **Data Source**: Local JSON files under `src/data` for posts, profile, timeline, services, and recommendations
- **Dependency Injection**: Custom DI container (`src/di.ts`) wiring services, repositories, and use cases
- **Testing**: Jest + next/jest + Testing Library (React + jest-dom)

---

## 🚀 Getting Started

⬇️ **Clone this repo**
```bash
git clone https://github.com/maurogioberti/maurogioberti.github.io.git
cd maurogioberti.github.io
```

🟢 **Set Node version (recommended)**
```bash
nvm install 25.8.1
nvm use 25.8.1
```

📦 **Install dependencies**
```bash
npm install
```

🏁 **Run in development**
```bash
npm run dev
```

🧪 **Run tests**
```bash
npm test
```

📦 **Build**
```bash
npm run build
```

🌐 **Preview production (static export)**
```bash
npx serve@latest out
```

No environment variables required. Everything runs from JSON files in `src/data`.

---

## 📂 Folder Structure

This project is structured to align with **Clean Architecture** principles:

```bash
project-root/
├── src/
│   ├── core/
│   │   ├── domain/          # Business entities and domain models
│   │   ├── application/     # Use cases (application services)
│   │   ├── infrastructure/  # Repositories, services, data access
│   │   └── crosscutting/    # Shared concerns (DI, mapping, SEO, utils)
│   ├── app/                 # Next.js App Router entrypoint
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Root page
│   │   ├── globals.css      # Global styles & design tokens
│   │   ├── components/      # Reusable UI components (Header, Footer, Theme, etc.)
│   │   ├── pages/           # App Router segments (home, blog, talks, resume, services)
│   │   │   ├── home/
│   │   │   ├── blog/
│   │   │   ├── talks/
│   │   │   ├── resume/
│   │   │   └── services/
│   │   └── standalone/      # Standalone pages (e.g. linktree, talktree)
│   ├── data/                # JSON data files (posts, profile, timeline, services, recommendations)
│   └── di.ts                # Dependency injection configuration (wires services, repos, use cases)
└── public/                  # Static assets (images, icons, open graph assets)
```

This structure ensures:
- Clear separation between **business logic** and **presentation**
- Testable and composable use cases and repositories
- A predictable and scalable layout for Next.js routes and static content

---

## 🧪 Testing

Testing is focused on business logic, repositories, and view models:

- **Unit Tests** → Jest + next/jest for TypeScript and Next.js-aware transforms  
- **UI Tests** → Testing Library (React + jest-dom)  
- **Architecture-Friendly** → Use cases and repositories depend on interfaces and can be easily mocked  

Run the full test suite with:
```bash
npm test
```

---

## 📜 License

Released under [MIT License](https://github.com/maurogioberti/maurogioberti.github.io/blob/master/LICENSE) by [Mauro Gioberti](https://maurogioberti.com).

---