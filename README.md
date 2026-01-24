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
  A hub for my portfolio, blog, and professional services.
  <br />
  <br />
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/stargazers">⭐ Stars are welcome 😊</a>
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/issues">🐛 Report an issue</a>
  <a href="https://maurogioberti.com">🌐 Visit my site</a>
</p>

<p>
  <a href="https://github.com/maurogioberti/next-clean-architecture" title="CodeScouts Academy" target="_blank">
    <img src="https://img.shields.io/badge/built_with-Next.js | Clean Architecture-blue?style=for-the-badge" alt="Built with Next.js, Clean Architecture, used Codescouts React Clean Architecture as Reference" />
  </a>
</p>

<span>
  <img src="https://img.shields.io/badge/maintained-yes-green" alt="maintained - yes">
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/contribute"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen" alt="contributions - welcome"></a>
  <a href="https://github.com/maurogioberti/maurogioberti.github.io/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="license - MIT"></a>
</span>

---

## 🚀 About This Project

This website is my personal platform to showcase my work, share blog posts, and present my professional services. It’s built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**, following **Clean Architecture** principles.

The codebase is organized to keep **business logic** independent from the **UI layer**, with clear separation between domain models, use cases, infrastructure, and presentation. Dependency Injection is used to wire services, repositories, and use cases together in a predictable way.

### Key Features
- **Portfolio**: Highlighting my skills, work history, and key achievements.
- **Blog**: Sharing insights and lessons learned from my experience in technology and consulting.
- **Talks**: Showcasing presentations and speaking engagements.
- **Resume**: Comprehensive timeline and professional recommendations.
- **Services**: A dedicated section for showcasing the professional services I offer.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router under `src/app`)
- **Language**: TypeScript
- **UI**: React 18 + Tailwind CSS (with CSS variables and light/dark theme support)
- **Architecture**: Clean Architecture (domain, application, infrastructure, crosscutting)
- **Styling**: Custom design tokens via CSS variables in `src/app/globals.css`
- **Data Source**: Local JSON files under `src/data` for posts, profile, timeline, services, and recommendations
- **Dependency Injection**: Custom DI container (`src/core/crosscutting/injection/DependencyInjectionContainer.ts`) configured in `src/di.ts`
- **Testing**: Jest + ts-jest + Testing Library (React + jest-dom)

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

🏁 **Run the app in development**
```bash
npm run dev
```

🧪 **Run the test suite**
```bash
npm test
```

📦 **Create a production build**
```bash
npm run build
```

🌐 **Start the production server**
```bash
npm start
```

No environment variables are required to run the project locally; all content is loaded from JSON files in `src/data`.

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
- Clear separation between **business logic** and **presentation**.
- Testable, composable use cases and repositories.
- A predictable layout for Next.js routes and static content.

---

## 🧪 Testing

Testing is focused on business logic, repositories, and view models:

- **Unit Tests**: Implemented with **Jest** and **ts-jest** for TypeScript support.
- **React Components**: Tested with **@testing-library/react** and **@testing-library/jest-dom** where applicable.
- **Architecture-Friendly**: Use cases and repositories depend on interfaces and can be easily mocked.

Run the full test suite with:
```bash
npm test
```

---

## 📜 License

Released under [MIT License](https://github.com/maurogioberti/maurogioberti.github.io/blob/master/LICENSE) by [Mauro Gioberti](https://maurogioberti.com).

---