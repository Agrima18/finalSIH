// ===================== ENV & MODULES =====================
require('dotenv').config();
const express = require("express");
const path = require("path");
const expressLayouts = require('express-ejs-layouts');
const fetch = require("node-fetch");

// ✅ Import green zones data
const { greenZones } = require("./init/data");

const app = express();
const PORT = process.env.PORT || 3000;

// ===================== MIDDLEWARE =====================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set('layout', 'layout/boilerplate');

// ===================== DUMMY DATA =====================
const sampleAQI = {
  city: "Delhi",
  aqi: 180,
  dominantPollutant: "PM2.5",
  temp: 32,
  humidity: 50
};

// ===================== ROUTES =====================

app.get("/greenzones", async (req, res) => {
  try {
    const { source, destination, mode, minAQI, maxAQI, page = 1 } = req.query;
    const limit = 6;
    const currentPage = parseInt(page);

    // ✅ Sample Data
    let zones = [
  {
    name: "Aravali Biodiversity Park",
    location: "Vasant Vihar, South Delhi",
    lat: 28.558466520721,
    lon: 77.150698935914,
    url: "https://unsplash.com/photos/an-aerial-view-of-a-park-with-a-river-and-trees-FhNhYOqbkNI",
    description: "A restored biodiversity park with native Aravalli vegetation and walking trails.",
    pm10: null,
    traffic: null
  },
  {
    name: "Yamuna Biodiversity Park",
    location: "Wazirabad, North Delhi",
    lat: 28.708,
    lon: 77.263,
    url: "https://www.istockphoto.com/photo/beautiful-shot-of-the-avenue-of-trees-in-the-park-gm1438905201-479295844",
    description: "Located near the Yamuna floodplains, this park conserves wetland ecosystems and bird habitats.",
    pm10: null,
    traffic: null
  },
  {
    name: "Neela Hauz Biodiversity Park",
    location: "South-Central Ridge, Delhi",
    lat: 28.552,
    lon: 77.180,
    url: "https://unsplash.com/photos/green-tree-on-green-grass-field-during-daytime-X7jtnqyn54M",
    description: "A lake-based biodiversity park, part of the Aravalli landscape restoration project.",
    pm10: null,
    traffic: null
  },
  {
    name: "Tilpath Valley Biodiversity Park",
    location: "South Delhi Ridge, near Asola",
    lat: 28.511,
    lon: 77.233,
    url: "https://www.delhibiodiversityparks.org/tilpath_valley_biodiversity_park.html",
    description: "An ecologically restored area with dry forest habitat and native flora.",
    pm10: null,
    traffic: null
  },
  {
    name: "Northern Ridge Biodiversity Park",
    location: "Delhi University North Campus",
    lat: 28.703,
    lon: 77.153,
    url: "https://unsplash.com/photos/a-pond-surrounded-by-tall-grass-and-trees-Gk7ZOxI2U2U",
    description: "Part of Delhi Ridge, housing dense vegetation and historical heritage sites.",
    pm10: null,
    traffic: null
  },
  {
    name: "Jahanpanah City Forest",
    location: "Greater Kailash / Chirag Delhi area, South Delhi",
    lat: 28.532,
    lon: 77.260,
    url: "https://unsplash.com/photos/a-path-through-a-park-lined-with-trees-tY8qTCCSz1Y",
    description: "A large city forest ideal for walking, jogging, and connecting with nature.",
    pm10: null,
    traffic: null
  },
  {
    name: "Green Park",
    location: "South Delhi",
    lat: 28.558899,
    lon: 77.202805,
    url: "https://www.latlong.net/place/green-park-delhi-india-27994.html",
    description: "A leafy neighborhood known for its tree-lined avenues and local parks.",
    pm10: null,
    traffic: null
  },
  {
    name: "Sunder Nursery",
    location: "Near Humayun’s Tomb, Central Delhi",
    lat: 28.593,
    lon: 77.252,
    url: "https://unsplash.com/photos/a-field-with-trees-and-bushes-in-the-foreground-5CS-mFRQj0c",
    description: "A heritage park blending Mughal gardens, biodiversity, and art installations.",
    pm10: null,
    traffic: null
  }
];

    // ✅ Filter by AQI if needed
    if (minAQI && maxAQI) {
      zones = zones.filter(z => z.pm10 >= minAQI && z.pm10 <= maxAQI);
    }

    // ✅ Pagination
    const totalPages = Math.ceil(zones.length / limit);
    const paginatedZones = zones.slice((currentPage - 1) * limit, currentPage * limit);

    // ✅ Build query string
    const queryStringWithoutPage = Object.keys(req.query)
      .filter(k => k !== "page")
      .map(k => `${k}=${req.query[k]}`)
      .join("&");

    // ✅ Send to EJS
    res.render("greenzones", {
      zones: paginatedZones,
      currentPage,
      totalPages,
      queryStringWithoutPage,
    });
  } catch (err) {
    console.error("❌ Error rendering green zones:", err);
    res.render("green", {
      zones: [],
      currentPage: 1,
      totalPages: 1,
      queryStringWithoutPage: "",
    });
  }
});


// Root redirect
app.get("/dashboard", (req, res) => {res.render("dashboard", { layout: "layout/boilerplate" })});

// 🧠 Health Page
app.get("/health", (req, res) => res.render("health"));

// 🧠 AI Health Advice
app.post("/api/health-advice", (req, res) => {
  const { aqi, temp, age } = req.body;
  let advice = "✅ Stay hydrated.\n⚠️ Avoid outdoor exercise.\n😷 Wear mask if AQI >150.";
  if (aqi > 200)
    advice = "☠️ AQI high! Stay indoors.\n⚠️ Use air purifier.\n🚫 Avoid traffic zones.";
  res.json({ advice });
});

// 🌫 AQI API (dummy)
app.get("/api/aqi", (req, res) => {
  res.json({ aqi: sampleAQI.aqi, city: "Delhi" });
});

// 🌦 Weather API (dummy)
app.get("/api/weather", (req, res) => {
  res.json({ temp: sampleAQI.temp, humidity: sampleAQI.humidity, condition: "Hazy" });
});

// 🔮 Forecast (dummy)
app.get("/api/forecast", (req, res) => {
  res.json({ forecast: [180, 210, 190] });
});

// 📊 AI Policy Recommendations
app.post('/api/policy-recommendations', (req, res) => {
  res.json({
    advice: `
      ⚙️ Implement Odd-Even rule next week.
      🚧 Restrict construction 6 AM–6 PM.
      🌳 Encourage carpool and public transport.`
  });
});

// 🧠 AI Policy Generator
app.post('/api/generate-policy', (req, res) => {
  res.json({
    policy: `
      🎯 Goal: Reduce AQI < 150.
      ✅ Launch 'Clean Delhi Week'.
      🚘 Odd-Even for 7 days.
      🌿 Enforce green cover zones.
      🏗️ Halt dust-heavy construction.`
  });
});

// 💬 Citizen Feedback Summary
app.get('/api/feedback-summary', (req, res) => {
  res.json({
    summary: `
      🗣️ 65% citizens support vehicle ban.
      🏗️ 30% report dust from sites.
      🎆 80% saw improvement after Diwali ban.`
  });
});

// 👥 Citizen Dashboard
app.get("/citizen", (req, res) => {
  const citizenReports = [
    { issue: "Garbage overflow in Sector 12", status: "Pending", date: "2025-10-04" },
    { issue: "Construction dust near Ring Road", status: "Resolved", date: "2025-10-02" },
    { issue: "Burning of waste in local park", status: "In Progress", date: "2025-10-03" },
  ];

  const citizenStats = {
    totalReports: citizenReports.length,
    resolved: citizenReports.filter(r => r.status === "Resolved").length,
    pending: citizenReports.filter(r => r.status === "Pending").length,
  };

  res.render("citizen", { layout: false, citizenReports, citizenStats });
});

// 🌍 Clean Routing Page
app.get("/clean", (req, res) => res.render("Clean"));

// 🧠 Policy Dashboard Page
app.get('/policy', (req, res) => {
  const statsSummary = { totalUsers: 50, totalCompanies: 12, activePolicies: 10 };
  const policies = [
    { name: "Odd-Even Traffic Rule", implemented: true },
    { name: "Construction Ban", implemented: false },
    { name: "Stubble Burning Ban", implemented: false },
    { name: "EV Incentive Policy", implemented: true },
    { name: "Diesel Vehicle Restriction", implemented: true },
    { name: "Firecracker Ban", implemented: false }
  ];
  res.render('policy', { statsSummary, policies });
});

// 🧭 AQI Recommendation Page
app.get("/airecommendation", (req, res) => {
  const sensors = [
    { name: "Delhi Central", lat: 28.6139, lon: 77.2090, aqi: 180, pollutant: "PM2.5", alert: "⚠️ Unhealthy - Limit outdoor activity" },
    { name: "Noida", lat: 28.5355, lon: 77.3910, aqi: 150, pollutant: "PM10", alert: "😷 Wear mask outdoors" },
  ];
  res.render("airecommendation", { sensors });
});

// 🧑‍🏫 AI Coach Page
app.get("/coach", (req, res) => {
  const tips = [
    { title: "Stay Hydrated", icon: "fas fa-water", desc: "Drink at least 8 glasses of water a day." },
    { title: "Mask Up", icon: "fas fa-head-side-mask", desc: "Wear a mask outdoors when AQI > 150." },
    { title: "Morning Walk", icon: "fas fa-walking", desc: "Avoid jogging near traffic-heavy zones." },
  ];
  res.render("coach", { tips });
});

// 🧠 Advisory Page
app.get("/advisory", (req, res) => {
  const advisories = [
    { sector: "Transport", action: "Implement Odd-Even scheme next week." },
    { sector: "Construction", action: "Restrict dust-heavy activities from 6 AM–6 PM." },
    { sector: "Public Awareness", action: "Launch 'Clean Delhi Week' Campaign." }
  ];
  res.render("advisory", { advisories });
});

// 🚦 Traffic Page
app.get("/traffic", (req, res) => {
  try {
    res.render("Traffic");
  } catch (err) {
    console.log("Error rendering Traffic:", err);
    res.status(500).send("Error loading Traffic page");
  }
});

// ===================== SERVER =====================
app.listen(PORT, () => {
  console.log(`🚀 Delhi Policy AI Dashboard running at http://localhost:${PORT}`);
});
