// Base API URL
const API_URL = 'http://localhost:5000/api';

// Utility: Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Utility: Get user info from localStorage
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Navbar Logic: Render auth buttons and admin link based on login state
document.addEventListener('DOMContentLoaded', () => {
  const authButtons = document.getElementById('auth-buttons');
  const navMenu = document.getElementById('nav-menu');

  if (authButtons) {
    if (isLoggedIn()) {
      const user = getUser();
      let adminLink = '';
      if (user && user.role === 'admin') {
        adminLink = `<li><a href="admin.html" class="hover:text-secondary transition">Dashboard</a></li>`;
      }

      if (navMenu) {
        navMenu.insertAdjacentHTML('beforeend', adminLink);
      }

      authButtons.innerHTML = `
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-white hidden md:inline">Hello, ${user.name}</span>
          <button class="bg-secondary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition transform active:scale-95" onclick="logout()">Sign Out</button>
        </div>
      `;
    } else {
      authButtons.innerHTML = `
        <button class="bg-accent hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow transition transform active:scale-95" onclick="location.href='login.html'">Login</button>
      `;
    }
  }

  // Fetch and display achievements on the home page if the section exists
  const achievementsSection = document.getElementById('achievements-section');
  if (achievementsSection) {
    loadPublicAchievements();
  }
});

async function loadPublicAchievements() {
  try {
    const list = document.getElementById('public-achievements-list');
    const section = document.getElementById('achievements-section');
    const achievements = await fetch(`${API_URL}/achievements`).then(res => res.json());

    if (achievements && achievements.length > 0) {
      section.classList.remove('hidden');
      list.innerHTML = achievements.map(ach => `
        <div class="bg-white rounded-3xl premium-shadow overflow-hidden group hover:-translate-y-2 transition duration-500 border border-slate-100 flex flex-col h-full snap-start flex-shrink-0 w-[300px] md:w-[380px]">
          <div class="h-56 overflow-hidden relative">
            <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10"></div>
            <img src="http://localhost:5000${ach.imageUrl}" alt="${ach.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
            <div class="absolute bottom-4 left-4 z-20">
              <span class="bg-accent text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Highlight</span>
            </div>
          </div>
          <div class="p-8 flex flex-col flex-grow">
            <h4 class="text-xl font-black text-primary mb-3 leading-tight group-hover:text-indigo-700 transition">${ach.title}</h4>
            <p class="text-slate-500 text-sm leading-relaxed mb-6 flex-grow display:-webkit-box -webkit-line-clamp:3 -webkit-box-orient:vertical overflow-hidden">${ach.description}</p>
            <div class="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Published</span>
              <span class="text-primary">${new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Failed to load public achievements:', error);
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Global fetch wrapper with auth token logic
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}
