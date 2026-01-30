import bcrypt from 'bcryptjs';
import { v4: uuidv4 } from 'uuid';

/**
 * Mock data store (in-memory)
 * In production, this would be replaced with database
 */

// Mock Users
const mockUsers = [
  {
    id: 'ADM001',
    name: 'Dr. Suresh Patel',
    email: 'admin@smarthostel.com',
    password: bcrypt.hashSync('admin123', 10), // hashed password
    role: 'admin',
    designation: 'Hostel Warden',
    department: 'Administration',
    phone: '+91 98765 00001',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'STU001',
    name: 'Rahul Kumar',
    email: 'rahul@university.edu',
    password: bcrypt.hashSync('student123', 10),
    role: 'student',
    hostel: 'Hostel A - Boys',
    block: 'Block B',
    room: '204',
    phone: '+91 98765 43210',
    year: '3rd Year',
    department: 'Computer Science',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'STU002',
    name: 'Priya Sharma',
    email: 'priya@university.edu',
    password: bcrypt.hashSync('student123', 10),
    role: 'student',
    hostel: 'Hostel C - Girls',
    block: 'Block A',
    room: '105',
    phone: '+91 98765 43211',
    year: '2nd Year',
    department: 'Electronics',
    createdAt: new Date('2024-01-20'),
  },
];

// Mock Issues
let mockIssues = [
  {
    id: 'ISS001',
    title: 'Leaking tap in bathroom',
    description: 'The tap in the common bathroom on 2nd floor is continuously leaking, causing water wastage.',
    category: 'plumbing',
    priority: 'high',
    status: 'in progress',
    hostel: 'Hostel A - Boys',
    block: 'Block B',
    room: '204',
    reporterId: 'STU001',
    reporter: 'Rahul Kumar',
    assignedTo: 'Rajesh (Plumber)',
    assignedToId: null,
    reportedDate: new Date('2026-01-26T10:30:00'),
    updatedAt: new Date('2026-01-27T14:20:00'),
    visibility: 'public',
    images: [],
    comments: [
      {
        id: 'CMT001',
        userId: 'ADM001',
        userName: 'Dr. Suresh Patel',
        comment: 'Assigned to maintenance team. Will be fixed by tomorrow.',
        createdAt: new Date('2026-01-26T15:00:00'),
      },
    ],
  },
  {
    id: 'ISS002',
    title: 'No internet connectivity in room',
    description: 'WiFi is not working in my room since yesterday evening. Other rooms seem to be working fine.',
    category: 'internet',
    priority: 'medium',
    status: 'assigned',
    hostel: 'Hostel C - Girls',
    block: 'Block A',
    room: '105',
    reporterId: 'STU002',
    reporter: 'Priya Sharma',
    assignedTo: 'IT Team',
    assignedToId: null,
    reportedDate: new Date('2026-01-27T14:20:00'),
    updatedAt: new Date('2026-01-27T15:00:00'),
    visibility: 'public',
    images: [],
    comments: [],
  },
  {
    id: 'ISS003',
    title: 'Broken chair needs replacement',
    description: 'Study chair leg is broken and needs immediate replacement.',
    category: 'furniture',
    priority: 'low',
    status: 'reported',
    hostel: 'Hostel B - Boys',
    block: 'Block C',
    room: '312',
    reporterId: 'STU001',
    reporter: 'Amit Singh',
    assignedTo: null,
    assignedToId: null,
    reportedDate: new Date('2026-01-27T16:45:00'),
    updatedAt: new Date('2026-01-27T16:45:00'),
    visibility: 'public',
    images: [],
    comments: [],
  },
];

// Mock Announcements
let mockAnnouncements = [
  {
    id: 'ANN001',
    title: 'Water Supply Maintenance',
    content: 'Water supply will be interrupted tomorrow (Jan 29) from 10 AM to 2 PM for routine maintenance. Please store water accordingly.',
    priority: 'high',
    hostel: 'All Hostels',
    authorId: 'ADM001',
    author: 'Hostel Administration',
    type: 'maintenance',
    date: new Date('2026-01-28T08:00:00'),
    createdAt: new Date('2026-01-28T08:00:00'),
  },
  {
    id: 'ANN002',
    title: 'Pest Control Drive',
    content: 'Annual pest control will be conducted in Hostel A and B on January 30th. Please keep rooms accessible and store food items properly.',
    priority: 'medium',
    hostel: 'Hostel A - Boys, Hostel B - Boys',
    authorId: 'ADM001',
    author: 'Maintenance Team',
    type: 'pest_control',
    date: new Date('2026-01-27T15:30:00'),
    createdAt: new Date('2026-01-27T15:30:00'),
  },
];

// Mock Lost & Found Items
let mockLostFound = [
  {
    id: 'LF001',
    title: 'Black Backpack',
    description: 'Black Nike backpack with laptop inside',
    type: 'lost',
    category: 'Bag',
    location: 'Hostel A - Common Room',
    hostel: 'Hostel A - Boys',
    reporterId: 'STU001',
    reporter: 'Rahul Kumar',
    contact: 'rahul@university.edu',
    phone: '+91 98765 43210',
    status: 'active',
    date: new Date('2026-01-27T10:00:00'),
    createdAt: new Date('2026-01-27T10:00:00'),
  },
  {
    id: 'LF002',
    title: 'Mobile Phone - iPhone 13',
    description: 'Blue iPhone 13 found near dining area',
    type: 'found',
    category: 'Electronics',
    location: 'Hostel C - Mess',
    hostel: 'Hostel C - Girls',
    reporterId: 'STU002',
    reporter: 'Priya Sharma',
    contact: 'priya@university.edu',
    phone: '+91 98765 43211',
    status: 'active',
    date: new Date('2026-01-26T18:30:00'),
    createdAt: new Date('2026-01-26T18:30:00'),
  },
];

// Helper functions for data manipulation
const dataHelpers = {
  // Issues
  getAllIssues: () => [...mockIssues],
  getIssueById: (id) => mockIssues.find(issue => issue.id === id),
  createIssue: (issueData) => {
    const newIssue = {
      id: `ISS${String(mockIssues.length + 1).padStart(3, '0')}`,
      ...issueData,
      status: 'reported',
      reportedDate: new Date(),
      updatedAt: new Date(),
      comments: [],
      images: [],
    };
    mockIssues.push(newIssue);
    return newIssue;
  },
  updateIssue: (id, updates) => {
    const index = mockIssues.findIndex(issue => issue.id === id);
    if (index !== -1) {
      mockIssues[index] = { 
        ...mockIssues[index], 
        ...updates, 
        updatedAt: new Date() 
      };
      return mockIssues[index];
    }
    return null;
  },
  deleteIssue: (id) => {
    const index = mockIssues.findIndex(issue => issue.id === id);
    if (index !== -1) {
      mockIssues.splice(index, 1);
      return true;
    }
    return false;
  },

  // Announcements
  getAllAnnouncements: () => [...mockAnnouncements],
  getAnnouncementById: (id) => mockAnnouncements.find(ann => ann.id === id),
  createAnnouncement: (annData) => {
    const newAnnouncement = {
      id: `ANN${String(mockAnnouncements.length + 1).padStart(3, '0')}`,
      ...annData,
      date: new Date(),
      createdAt: new Date(),
    };
    mockAnnouncements.push(newAnnouncement);
    return newAnnouncement;
  },
  updateAnnouncement: (id, updates) => {
    const index = mockAnnouncements.findIndex(ann => ann.id === id);
    if (index !== -1) {
      mockAnnouncements[index] = { ...mockAnnouncements[index], ...updates };
      return mockAnnouncements[index];
    }
    return null;
  },
  deleteAnnouncement: (id) => {
    const index = mockAnnouncements.findIndex(ann => ann.id === id);
    if (index !== -1) {
      mockAnnouncements.splice(index, 1);
      return true;
    }
    return false;
  },

  // Lost & Found
  getAllLostFound: () => [...mockLostFound],
  getLostFoundById: (id) => mockLostFound.find(item => item.id === id),
  createLostFound: (itemData) => {
    const newItem = {
      id: `LF${String(mockLostFound.length + 1).padStart(3, '0')}`,
      ...itemData,
      status: 'active',
      date: new Date(),
      createdAt: new Date(),
    };
    mockLostFound.push(newItem);
    return newItem;
  },
  updateLostFound: (id, updates) => {
    const index = mockLostFound.findIndex(item => item.id === id);
    if (index !== -1) {
      mockLostFound[index] = { ...mockLostFound[index], ...updates };
      return mockLostFound[index];
    }
    return null;
  },
  deleteLostFound: (id) => {
    const index = mockLostFound.findIndex(item => item.id === id);
    if (index !== -1) {
      mockLostFound.splice(index, 1);
      return true;
    }
    return false;
  },

  // Users
  getUserByEmail: (email) => mockUsers.find(user => user.email === email),
  getUserById: (id) => mockUsers.find(user => user.id === id),
};

export {
  mockUsers,
  mockIssues,
  mockAnnouncements,
  mockLostFound,
  dataHelpers,
};
