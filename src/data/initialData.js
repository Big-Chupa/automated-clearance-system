export const INITIAL_DEPARTMENTS = [
  {
    id: 'dept-1',
    code: 'DEPARTMENT',
    name: 'Department',
    description: 'Academic unit verification',
    officerName: 'Dr. T. Ogunleye',
    email: 'department@eksu.edu.ng',
    pendingCount: 24,
    status: 'Active',
    icon: '💻'
  },
  {
    id: 'dept-2',
    code: 'FACULTY',
    name: 'Faculty',
    description: 'Faculty-level verification',
    officerName: 'Mrs. R. Akande',
    email: 'faculty@eksu.edu.ng',
    pendingCount: 19,
    status: 'Active',
    icon: '🏛️'
  },
  {
    id: 'dept-3',
    code: 'LIBRARY',
    name: 'Library',
    description: 'Books and fines',
    officerName: 'Mrs. Funmi Adeyemi',
    email: 'library@eksu.edu.ng',
    pendingCount: 18,
    status: 'Active',
    icon: '📚'
  },
  {
    id: 'dept-4',
    code: 'BURSARY',
    name: 'Bursary',
    description: 'Fees and financial obligations',
    officerName: 'Mr. K. Ojo',
    email: 'bursary@eksu.edu.ng',
    pendingCount: 57,
    status: 'Active',
    icon: '💰'
  },
  {
    id: 'dept-5',
    code: 'STUDENT_AFFAIRS',
    name: 'Student Affairs',
    description: 'Student affairs obligations',
    officerName: 'Mrs. A. Faleye',
    email: 'affairs@eksu.edu.ng',
    pendingCount: 14,
    status: 'Active',
    icon: '👥'
  },
  {
    id: 'dept-6',
    code: 'REGISTRY',
    name: 'Registry',
    description: 'Final clearance verification',
    officerName: 'Mr. P. Adebayo',
    email: 'registry@eksu.edu.ng',
    pendingCount: 42,
    status: 'Active',
    icon: '🎓'
  }
];

export const INITIAL_USERS = [
  // Administrator
  {
    id: 'usr-admin-1',
    matricNo: 'EKSU/ADM/01',
    fullName: 'David Akinyemi',
    email: 'admin@eksu.edu.ng',
    password: 'password123',
    role: 'ADMIN',
    initials: 'DA',
    departmentName: 'ICT Directorate',
    phone: '08031234567',
    status: 'ACTIVE'
  },
  // Department Officers
  {
    id: 'usr-dept-1',
    matricNo: 'BUR/01',
    fullName: 'Mr. K. Ojo',
    email: 'bursary@eksu.edu.ng',
    password: 'password123',
    role: 'OFFICER',
    initials: 'KO',
    departmentCode: 'BURSARY',
    departmentName: 'Bursary',
    phone: '08039876543',
    status: 'ACTIVE'
  },
  {
    id: 'usr-dept-2',
    matricNo: 'LIB/01',
    fullName: 'Mrs. Funmi Adeyemi',
    email: 'library@eksu.edu.ng',
    password: 'password123',
    role: 'OFFICER',
    initials: 'FA',
    departmentCode: 'LIBRARY',
    departmentName: 'Library',
    phone: '08023456789',
    status: 'ACTIVE'
  },
  {
    id: 'usr-dept-3',
    matricNo: 'DEP/01',
    fullName: 'Dr. T. Ogunleye',
    email: 'department@eksu.edu.ng',
    password: 'password123',
    role: 'OFFICER',
    initials: 'TO',
    departmentCode: 'DEPARTMENT',
    departmentName: 'Department',
    phone: '08054321987',
    status: 'ACTIVE'
  },
  // Students
  {
    id: 'usr-stud-1',
    matricNo: 'EKSU/CSC/22/0063',
    fullName: 'Moses Ochopelu',
    email: 'moses@eksu.edu.ng',
    password: 'password123',
    role: 'STUDENT',
    initials: 'MO',
    departmentName: 'Computer Science',
    faculty: 'Science',
    graduationYear: '2025/2026',
    degree: 'B.Sc. (Hons) Computer Science',
    phone: '08167890123',
    status: 'ACTIVE'
  },
  {
    id: 'usr-stud-2',
    matricNo: 'EKSU/CSC/22/0088',
    fullName: 'Amina Zainab Yusuf',
    email: 'amina.yusuf@eksu.edu.ng',
    password: 'password123',
    role: 'STUDENT',
    initials: 'AY',
    departmentName: 'Computer Science',
    faculty: 'Science',
    graduationYear: '2025/2026',
    degree: 'B.Sc. (Hons) Computer Science',
    phone: '08034567891',
    status: 'ACTIVE'
  },
  {
    id: 'usr-stud-3',
    matricNo: 'EKSU/MTH/22/0112',
    fullName: 'Oluwaseun Emmanuel Adeleke',
    email: 'seun.adeleke@eksu.edu.ng',
    password: 'password123',
    role: 'STUDENT',
    initials: 'OA',
    departmentName: 'Mathematics',
    faculty: 'Science',
    graduationYear: '2025/2026',
    degree: 'B.Sc. (Hons) Mathematics',
    phone: '08098765432',
    status: 'ACTIVE'
  },
  {
    id: 'usr-stud-4',
    matricNo: 'EKSU/GEO/22/0045',
    fullName: 'Blessing Chioma Okon',
    email: 'blessing.okon@eksu.edu.ng',
    password: 'password123',
    role: 'STUDENT',
    initials: 'BO',
    departmentName: 'Geology',
    faculty: 'Science',
    graduationYear: '2025/2026',
    degree: 'B.Sc. (Hons) Geology',
    phone: '08123456780',
    status: 'ACTIVE'
  }
];

export const INITIAL_CLEARANCE_REQUESTS = [
  {
    id: 'clr-req-0063',
    studentId: 'usr-stud-1',
    matricNo: 'EKSU/CSC/22/0063',
    studentName: 'Moses Ochopelu',
    departmentName: 'Computer Science',
    faculty: 'Science',
    session: '2025/2026',
    submittedAt: '2026-04-15T09:18:00.000Z',
    overallStatus: 'APPROVED',
    completionPercentage: 100,
    certificateNumber: 'EKSU/2026/CLR/0063',
    documents: [
      { id: 'doc-101', type: 'Bursary School Fees & Convocation Receipt', name: 'EKSU_Bursary_Receipt_0063.pdf', size: '245 KB', uploadedAt: '2026-04-15T09:20:00.000Z' },
      { id: 'doc-102', type: 'Departmental Project Approval Sheet', name: 'Project_Approval_Signed.pdf', size: '180 KB', uploadedAt: '2026-04-15T09:25:00.000Z' }
    ],
    departments: {
      DEPARTMENT: { status: 'APPROVED', date: '2026-04-15T11:00:00.000Z', officer: 'Dr. T. Ogunleye', comments: 'Departmental project submitted and approved.' },
      FACULTY: { status: 'APPROVED', date: '2026-04-16T14:05:00.000Z', officer: 'Mrs. R. Akande', comments: 'Faculty results verified and endorsed.' },
      LIBRARY: { status: 'APPROVED', date: '2026-04-17T10:42:00.000Z', officer: 'Mrs. Funmi Adeyemi', comments: 'No outstanding book or fine was found.' },
      BURSARY: { status: 'APPROVED', date: '2026-04-17T12:30:00.000Z', officer: 'Mr. K. Ojo', comments: 'School fees and graduation payments verified.' },
      STUDENT_AFFAIRS: { status: 'APPROVED', date: '2026-04-18T09:15:00.000Z', officer: 'Mrs. A. Faleye', comments: 'No disciplinary record found.' },
      REGISTRY: { status: 'APPROVED', date: '2026-04-18T14:00:00.000Z', officer: 'Mr. P. Adebayo', comments: 'Final clearance endorsed.' }
    }
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-001',
    timestamp: '2026-04-15T09:18:00.000Z',
    userId: 'usr-stud-1',
    userRole: 'STUDENT',
    userName: 'Moses Ochopelu',
    action: 'CLEARANCE_SUBMITTED',
    description: 'Submitted clearance application CLR-2026-0063.'
  },
  {
    id: 'log-002',
    timestamp: '2026-04-17T10:42:00.000Z',
    userId: 'usr-dept-2',
    userRole: 'OFFICER',
    userName: 'Mrs. Funmi Adeyemi (Library)',
    action: 'STATUS_APPROVED',
    description: 'Approved library clearance for Moses Ochopelu.'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Library clearance approved',
    text: 'Your library clearance has been approved. No outstanding book or fine was found.',
    timestamp: '17 Apr 10:42',
    type: 'success',
    icon: '✓',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Bursary review in progress',
    text: 'Your request is currently being checked against the student payment record.',
    timestamp: '17 Apr 9:16',
    type: 'progress',
    icon: '🕒',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Faculty clearance approved',
    text: 'Faculty-level verification has been completed successfully.',
    timestamp: '16 Apr 14:05',
    type: 'success',
    icon: '✓',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Clearance request submitted',
    text: 'Your request CLR-2026-0063 has been sent to the required clearance units.',
    timestamp: '15 Apr 9:18',
    type: 'submit',
    icon: '↗',
    read: true
  },
  {
    id: 'notif-5',
    title: 'Profile verification completed',
    text: 'Your student registration information has been matched to the prototype record.',
    timestamp: '15 Apr 8:51',
    type: 'info',
    icon: 'ℹ',
    read: true
  }
];

export const INITIAL_DEPARTMENT_STATS = [
  { department: 'Computer Science', registered: 142, submitted: 131, fullyCleared: 96, pending: 35, completion: '73%' },
  { department: 'Geology', registered: 88, submitted: 79, fullyCleared: 54, pending: 25, completion: '68%' },
  { department: 'Physics', registered: 104, submitted: 91, fullyCleared: 63, pending: 28, completion: '69%' },
  { department: 'Chemistry', registered: 119, submitted: 105, fullyCleared: 76, pending: 29, completion: '72%' },
  { department: 'Mathematics', registered: 97, submitted: 84, fullyCleared: 61, pending: 23, completion: '73%' }
];

export const INITIAL_SYSTEM_SETTINGS = {
  enableRegistration: true,
  enableEmailNotifications: true,
  allowCertificatePrinting: true,
  maintenanceMode: false,
  institution: 'Ekiti State University, Ado-Ekiti',
  academicSession: '2025/2026',
  storageMode: 'Browser Local Storage (Academic Prototype)',
  sessionTimeout: '30 minutes'
};
