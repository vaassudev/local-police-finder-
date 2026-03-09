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
});

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
