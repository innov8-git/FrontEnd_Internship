// Mock trainer data for Admin Trainer Management
// Each trainer has an optional resume link (served from public/resumes/)
export const TRAINERS = [
  {
    id: 't1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    avatarUrl: '/avatars/avatar1.png',
    resumeUrl: '/resumes/resume_1.pdf',
    isTrainer: true,
    assignedStudentIds: [],
    assignedGroupIds: []
  },
  {
    id: 't2',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    avatarUrl: '/avatars/avatar2.png',
    resumeUrl: '/resumes/resume_2.pdf',
    isTrainer: false,
    assignedStudentIds: [],
    assignedGroupIds: []
  },
  {
    id: 't3',
    firstName: 'Carol',
    lastName: 'Lee',
    email: 'carol.lee@example.com',
    avatarUrl: '/avatars/avatar3.png',
    resumeUrl: '/resumes/resume_3.pdf',
    isTrainer: true,
    assignedStudentIds: [],
    assignedGroupIds: []
  }
];

