require('dotenv').config();
const connectDatabase = require('../config/db');
const User = require('../models/User');
const Department = require('../models/Department');
const Clearance = require('../models/Clearance');

const users = [
  { matricNo: 'EKSU/ADM/01', fullName: 'Development Administrator', email: 'admin@eksu.edu.ng', password: 'password123', role: 'ADMIN', initials: 'DA', departmentName: 'ICT Directorate' },
  { matricNo: 'DEP/01', fullName: 'Dr. T. Ogunleye', email: 'department@eksu.edu.ng', password: 'password123', role: 'OFFICER', initials: 'TO', departmentCode: 'DEPARTMENT', departmentName: 'Department' },
  { matricNo: 'FAC/01', fullName: 'Mrs. R. Akande', email: 'faculty@eksu.edu.ng', password: 'password123', role: 'OFFICER', initials: 'RA', departmentCode: 'FACULTY', departmentName: 'Faculty' },
  { matricNo: 'LIB/01', fullName: 'Mrs. Funmi Adeyemi', email: 'library@eksu.edu.ng', password: 'password123', role: 'OFFICER', initials: 'FA', departmentCode: 'LIBRARY', departmentName: 'Library' },
  { matricNo: 'BUR/01', fullName: 'Development Bursary Officer', email: 'bursary@eksu.edu.ng', password: 'password123', role: 'OFFICER', initials: 'DBO', departmentCode: 'BURSARY', departmentName: 'Bursary' },
  { matricNo: 'SAF/01', fullName: 'Mrs. A. Faleye', email: 'affairs@eksu.edu.ng', password: 'password123', role: 'OFFICER', initials: 'AF', departmentCode: 'STUDENT_AFFAIRS', departmentName: 'Student Affairs' },
  { matricNo: 'REG/01', fullName: 'Mr. P. Adebayo', email: 'registry@eksu.edu.ng', password: 'password123', role: 'OFFICER', initials: 'PA', departmentCode: 'REGISTRY', departmentName: 'Registry' },
  { matricNo: '220903045', fullName: 'Moses Ochopefu', email: 'moses@eksu.edu.ng', password: 'password123', role: 'STUDENT', initials: 'MO', departmentName: 'Computer Science', faculty: 'Science', graduationYear: '2025/2026', degree: 'B.Sc. (Hons) Computer Science' },
  { matricNo: '220903046', fullName: 'Ada Okafor', email: 'ada.okafor@eksu.edu.ng', password: 'password123', role: 'STUDENT', initials: 'AO', departmentName: 'Accounting', faculty: 'Management Sciences', graduationYear: '2025/2026', degree: 'B.Sc. Accounting' },
  { matricNo: '220903047', fullName: 'Tobi Adebayo', email: 'tobi.adebayo@eksu.edu.ng', password: 'password123', role: 'STUDENT', initials: 'TA', departmentName: 'Civil Engineering', faculty: 'Engineering', graduationYear: '2025/2026', degree: 'B.Eng. Civil Engineering' },
  { matricNo: '220903048', fullName: 'Chinwe Eze', email: 'chinwe.eze@eksu.edu.ng', password: 'password123', role: 'STUDENT', initials: 'CE', departmentName: 'Law', faculty: 'Law', graduationYear: '2025/2026', degree: 'LL.B' },
  { matricNo: '220903049', fullName: 'Samuel Bello', email: 'samuel.bello@eksu.edu.ng', password: 'password123', role: 'STUDENT', initials: 'SB', departmentName: 'Agricultural Economics', faculty: 'Agriculture', graduationYear: '2025/2026', degree: 'B.Agric. Economics' },
  { matricNo: '220903050', fullName: 'Grace Daramola', email: 'grace.daramola@eksu.edu.ng', password: 'password123', role: 'STUDENT', initials: 'GD', departmentName: 'Medicine and Surgery', faculty: 'Clinical Sciences', graduationYear: '2025/2026', degree: 'MBBS' }
];
const departments = [
  ['DEPARTMENT', 'Department', 'Dr. T. Ogunleye', 'department@eksu.edu.ng'],
  ['FACULTY', 'Faculty', 'Mrs. R. Akande', 'faculty@eksu.edu.ng'],
  ['LIBRARY', 'Library', 'Mrs. Funmi Adeyemi', 'library@eksu.edu.ng'],
  ['BURSARY', 'Bursary', 'Development Bursary Officer', 'bursary@eksu.edu.ng'],
  ['STUDENT_AFFAIRS', 'Student Affairs', 'Mrs. A. Faleye', 'affairs@eksu.edu.ng'],
  ['REGISTRY', 'Registry', 'Mr. P. Adebayo', 'registry@eksu.edu.ng']
];

(async () => {
  await connectDatabase();

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      const created = await User.create(user);
      if (user.role === 'STUDENT') await Clearance.updateOne({ student: created._id }, { $set: { matricNo: user.matricNo, studentName: user.fullName } });
      continue;
    }

    existing.password = user.password;
    existing.fullName = user.fullName;
    if (user.role === 'STUDENT') existing.matricNo = user.matricNo;
    existing.markModified('password');
    await existing.save();
    if (user.role === 'STUDENT') await Clearance.updateOne({ student: existing._id }, { $set: { matricNo: user.matricNo, studentName: user.fullName } });
  }

  for (const [code, name, officerName, email] of departments) {
    await Department.updateOne({ code }, { $setOnInsert: { code, name, officerName, email, status: 'Active' } }, { upsert: true });
  }

  console.log('Development seed complete. Existing records were preserved.');
  process.exit(0);
})().catch((error) => { console.error(error.message); process.exit(1); });
