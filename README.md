# FindBack 

### Lost something? Let's bring it back.

FindBack is a campus-focused Lost & Found platform designed to help students discover lost belongings and report items they have found. It provides a simple, user-friendly interface to make finding lost items easier within a campus community.

## Features

- **Browse Items** — Explore reported lost and found belongings.
- **Search & Filter** — Find items using search and category filters.
- **Report Items** — Submit details about lost or found belongings.
- **Responsive Design** — A clean interface designed for convenient browsing across screen sizes.
- **Local Storage** — Save listings in the browser for persistence across page refreshes on the same browser.

## Tech Stack

- **React** — Component-based user interface
- **Vite** — Fast development server and build tooling
- **CSS** — Styling and responsive layouts
- **JavaScript** — Application logic and interactivity
- **Local Storage** — Browser-side data persistence

## Getting Started

Follow these steps to run FindBack locally.

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/purvakale16/findback.git
   ```

2. Navigate to the project folder:

   ```bash
   cd findback
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173/`.

## Project Structure

```text
findback/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Data Storage

FindBack currently uses browser Local Storage to persist item listings. Data is stored locally in the browser and is not shared automatically between different users or devices. A backend and database can be integrated in the future to support a shared campus-wide platform.

## Future Improvements

- User authentication and profiles
- Backend API and database integration
- Image uploads for lost and found items
- Item ownership verification and claim workflow
- Notifications when a matching item is reported

## Author

**Purva Kale**

- GitHub: [@purvakale16](https://github.com/purvakale16)

---

*Built with React and Vite to make campus lost and found simpler.*
