<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><%= title || "Vaayu Dashboard" %></title>
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    body {
      background: linear-gradient(135deg, rgba(15,20,40,0.95), rgba(20,30,60,0.98));
      color: #f1f5f9;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      padding-top: 90px; /* Space for navbar */
    }
    .glass {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .nav-scrolled {
      background: rgba(15, 23, 42, 0.85);
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      transition: all 0.3s ease-in-out;
    }
  </style>
</head>

<body class="bg-slate-950">

  <!-- 🌟 Floating Sticky Navbar -->
  <header class="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] z-50 transition-all duration-300">
    <nav id="mainNav" class="glass flex items-center justify-between px-6 py-3 rounded-2xl shadow-lg">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <img src="https://aqi.in/assets/images/aqi-logo.svg" alt="Logo" class="h-8">
        <h1 class="text-xl font-bold text-white">Vaayu</h1>
      </div>

      <!-- Nav Links -->
      <ul class="hidden md:flex items-center gap-6 text-slate-200 font-medium">
        <li><a href="/" class="hover:text-cyan-400 transition">Dashboard</a></li>
        <li><a href="/zones" class="hover:text-cyan-400 transition">Zones</a></li>
        <li><a href="/policies" class="hover:text-cyan-400 transition">Policies</a></li>
        <li><a href="/weather" class="hover:text-cyan-400 transition">Weather</a></li>
        <li><a href="/map" class="hover:text-cyan-400 transition">AQI Map</a></li>
      </ul>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <!-- Language -->
        <select class="bg-white/10 border border-white/30 text-slate-200 text-sm rounded-lg px-3 py-1 backdrop-blur-md">
          <option>English-IN</option>
          <option>Hindi</option>
        </select>

        <!-- Dark/Light Toggle -->
        <button id="toggleMode" class="p-2 rounded-lg hover:bg-white/10 transition text-lg">🌙</button>

        <!-- Login -->
        <a href="/login" class="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-lg font-semibold shadow">
          Login
        </a>
      </div>
    </nav>
  </header>

  <!-- 🌍 Main Content -->
  <main class="max-w-7xl mx-auto px-4 pt-4 pb-12">
    <%- body %>
  </main>

  <!-- 💡 Scripts -->
  <script>
    const nav = document.getElementById("mainNav");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        nav.classList.add("nav-scrolled");
      } else {
        nav.classList.remove("nav-scrolled");
      }
    });

    const toggle = document.getElementById("toggleMode");
    let dark = true;
    toggle.addEventListener("click", () => {
      dark = !dark;
      document.body.classList.toggle("bg-slate-950", dark);
      document.body.classList.toggle("bg-slate-100", !dark);
      document.body.classList.toggle("text-slate-900", !dark);
      toggle.textContent = dark ? "🌙" : "☀️";
    });
  </script>

</body>
</html>
