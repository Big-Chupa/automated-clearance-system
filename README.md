# Design and Implementation of an Automated Clearance System for Graduates
### Ekiti State University (EKSU) Clearance Portal

An automated, paperless undergraduate and graduate clearance portal built with **React.js**, **React Router**, **React Context API**, and pure **Vanilla CSS**. Features persistent browser Local Storage state simulation, multi-departmental approval tracking, supporting document uploads, immutable audit logging, compliance analytics reporting, and tamper-resistant digital final clearance certificates.

---

## 🏛️ Key Features

- **Multi-Role Portal Architecture:**
  - 👨‍🎓 **Student Portal:** Initiate clearance, real-time 10-unit tracking, upload verification receipts/project sheets, view notifications, and print verified final clearance certificate.
  - 🏢 **Department Officer Portal:** Review submitted applications, inspect attached student proofs, approve or reject with comments, and track pending departmental rosters.
  - ⚡ **Administrator Portal:** System overview, user management, department unit configuration, statistical reports with CSV export, system settings toggles, and security audit trail.
- **Supporting Document Verification:** Graduating students can upload PDFs and image proofs (Bursary school fees receipt, Library return slip, Project approval page, Result slip, and Student Affairs ID) for desk officer inspection before approval.
- **Tamper-Resistant Digital Certification:** Dynamic certificate unlocking equipped with verification serial numbers, university crests, registrar signatures, and print-optimized stylesheet.
- **Fully Responsive UI:** Adaptive off-canvas drawer navigation, responsive table containers, auto-scaling metric widgets, and touch-friendly controls across smartphones, tablets, laptops, and desktops.
- **Zero-Backend Prototype Persistence:** Pure client-side data layer utilizing `localStorage` and `sessionStorage` for portable academic demonstrations.

---

## 📁 Project Structure

```
automated-clearance-system/
├── public/
│   └── index.html               # Entry HTML with university branding
├── src/
│   ├── components/
│   │   └── common/              # Navbar, Sidebar, Modal, ProgressBar, Badges
│   ├── context/
│   │   ├── AuthContext.js       # Role-based auth & session management
│   │   ├── ClearanceContext.js  # Clearance workflow & document uploads
│   │   └── NotificationContext.js # Toast notifications
│   ├── data/
│   │   └── initialData.js       # Seed mock records & officers
│   ├── pages/
│   │   ├── AdminDashboard.js    # Administrator overview
│   │   ├── CertificatePage.js   # Final printable certificate
│   │   ├── ClearancePage.js     # Progress tracker & document uploader
│   │   ├── DepartmentManagementPage.js # Clearance unit management & document verification
│   │   ├── LoginPage.js         # Role-based sign-in
│   │   ├── NotificationsPage.js # Activity & approval notifications
│   │   ├── RegisterPage.js      # Student onboarding
│   │   ├── ReportsPage.js       # Compliance reports & CSV export
│   │   ├── SettingsPage.js      # System settings & prototype controls
│   │   ├── StudentDashboard.js  # Student dashboard
│   │   └── StudentManagementPage.js # Student user roster
│   ├── services/
│   │   └── storageService.js    # LocalStorage CRUD & transaction layer
│   ├── styles/
│   │   ├── certificate.css      # Print & certificate layout
│   │   ├── global.css           # Pure Vanilla CSS design tokens & responsive rules
│   │   └── variables.css        # EKSU deep wine red color palette
│   ├── App.js                   # Client-side routing configuration
│   └── index.js                 # React DOM mount point
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v16 or higher)
- npm (installed with Node.js)

### Installation & Execution

1. Clone the repository:
   ```bash
   git clone https://github.com/Big-Chupa/automated-clearance-system.git
   cd automated-clearance-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application will open automatically in your default browser at:
   `http://localhost:3000`

---

## 🔑 Demo User Credentials

| Role | Identifier | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@eksu.edu.ng` | `password123` | System Settings, Department Management, Analytics Reports, Audit Logs |
| **Student** | `EKSU/CSC/22/0063` | `password123` | Clearance Application, Document Upload, Progress Tracking, Certificate |
| **Bursary Officer** | `bursary@eksu.edu.ng` | `password123` | Financial Review, Document Verification, Endorsements |
| **Library Officer** | `library@eksu.edu.ng` | `password123` | Book Return Verification, Library Approval |

---

## 📜 License
This project is an academic research prototype developed for Final Year Computer Science graduation project requirements.
