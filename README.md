# Chaos Theory Live

A web application for Chaos Theory, built using:

* HTML
* CSS
* JavaScript (Vanilla JS)
* Node.js
* Express.js

---

## Project Structure

```text
chaos-theory-live/
│
├── frontend/
│   ├── Home.html
│   ├── About.html
│   ├── Events.html
│   ├── event.html
│   └── assets/
│
├── backend/
│   ├── routes/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

# Getting Started

## Clone the Repository

```bash
git clone <repository-url>
```

Navigate to the project folder:

```bash
cd chaos-theory-live
```

---

## Checkout the Development Branch

All development work should be done from the `dev` branch.

```bash
git checkout dev
```

Pull the latest changes before starting work:

```bash
git pull origin dev
```

---

# Frontend Setup

The frontend is built using **Vanilla HTML, CSS, and JavaScript**.

### Install Live Server

Install the **Live Server** extension in VS Code.

### Run the Frontend

1. Open the project in VS Code.
2. Navigate to:

```text
frontend/Home.html
```

3. Right-click on `Home.html`.
4. Select:

```text
Open with Live Server
```

The application will launch in your browser.

---

# Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

or

```bash
node server.js
```

---

# Development Workflow

### 1. Switch to Development Branch

```bash
git checkout dev
git pull origin dev
```

### 2. Create a Feature Branch

Create a new feature branch from `dev`.

Branch naming convention:

```text
feature/<your-name>
```

Example:

```bash
git checkout -b feature/john
```

or

```bash
git checkout -b feature/event-registration
```

---

### 3. Make Your Changes

Implement your assigned feature or fix.

---

### 4. Stage Changes

```bash
git add .
```

---

### 5. Commit Changes

```bash
git commit -m "Add event registration feature"
```

Use meaningful commit messages.

Examples:

```bash
git commit -m "Fix navbar responsiveness"
git commit -m "Add event details page"
git commit -m "Update booking API"
```

---

### 6. Push Your Feature Branch

```bash
git push origin feature/<your-branch-name>
```

Example:

```bash
git push origin feature/john
```

---

### 7. Create a Pull Request

After pushing:

1. Go to GitHub.
2. Open the repository.
3. Create a Pull Request.
4. Set:

```text
Base Branch: dev
Compare Branch: feature/<your-branch-name>
```

5. Submit the Pull Request for review.

---

# Important Rules

* Do not commit directly to `main`.
* Do not commit directly to `dev`.
* Always create a feature branch from `dev`.
* Always pull the latest changes from `dev` before starting work.
* Create Pull Requests only to the `dev` branch.
* Ensure code is tested before raising a Pull Request.

---

# Branch Strategy

```text
main
 └── dev
      ├── feature/member-1
      ├── feature/member-2
      ├── feature/member-3
      └── feature/member-n
```

* `main` → Production-ready code.
* `dev` → Active development branch.
* `feature/*` → Individual developer work branches.

---

# Contribution Checklist

Before creating a Pull Request:

* Pull latest changes from `dev`
* Resolve merge conflicts if any
* Test your changes locally
* Commit with meaningful messages
* Push to your feature branch
* Create PR to `dev`

Happy Coding 🚀
