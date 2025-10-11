// ===================== ENV & MODULES =====================
require('dotenv').config();
const express = require("express");
const path = require("path");
const expressLayouts = require('express-ejs-layouts');
const fetch = require("node-fetch");

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

// 🌍 Redirect Root
app.get("/", (req, res) => res.redirect("/dashboard"));

// 🌍 Dashboard Page
app.get("/dashboard", (req, res) => {
  res.render("dashboard", { layout: "layout/boilerplate" });
});

// 🌿 Green Zones Page
app.get("/greenzones", async (req, res) => {
  try {
    const { minAQI, maxAQI, page = 1 } = req.query;
    const limit = 6;
    const currentPage = parseInt(page);

    let zones = [
      { name: "Aravali Biodiversity Park", location: "Vasant Vihar, South Delhi", lat: 28.558, lon: 77.150, description: "Restored park with native Aravalli vegetation.", url: "https://unsplash.com/photos/FhNhYOqbkNI" },
      { name: "Yamuna Biodiversity Park", location: "Wazirabad, North Delhi", lat: 28.708, lon: 77.263, description: "Wetland ecosystems and bird habitats.", url: "https://www.istockphoto.com/photo/beautiful-shot-of-the-avenue-of-trees-in-the-park-gm1438905201-479295844" },
      { name: "Neela Hauz", location: "South-Central Ridge", lat: 28.552, lon: 77.180, description: "Lake-based biodiversity restoration project.", url: "https://unsplash.com/photos/X7jtnqyn54M" },
      { name: "Tilpath Valley", location: "South Delhi Ridge", lat: 28.511, lon: 77.233, description: "Dry forest habitat with native flora.", url: "https://www.delhibiodiversityparks.org/tilpath_valley_biodiversity_park.html" },
      { name: "Northern Ridge", location: "North Campus", lat: 28.703, lon: 77.153, description: "Dense vegetation and heritage sites.", url: "https://unsplash.com/photos/Gk7ZOxI2U2U" },
      { name: "Jahanpanah Forest", location: "Greater Kailash", lat: 28.532, lon: 77.260, description: "City forest for jogging and walking.", url: "https://unsplash.com/photos/tY8qTCCSz1Y" },
      { name: "Green Park", location: "South Delhi", lat: 28.5588, lon: 77.2028, description: "Leafy neighborhood with local parks.", url: "https://www.latlong.net/place/green-park-delhi-india-27994.html" },
      { name: "Sunder Nursery", location: "Near Humayun’s Tomb", lat: 28.593, lon: 77.252, description: "Heritage park with biodiversity & art.", url: "https://unsplash.com/photos/5CS-mFRQj0c" },
    ];

    // Add random PM10 values
    zones = zones.map(z => ({ ...z, pm10: Math.floor(Math.random() * 150) + 50 }));

    // Filter by AQI
    if (minAQI && maxAQI) zones = zones.filter(z => z.pm10 >= minAQI && z.pm10 <= maxAQI);

    // Pagination
    const totalPages = Math.ceil(zones.length / limit);
    const paginatedZones = zones.slice((currentPage - 1) * limit, currentPage * limit);

    const queryStringWithoutPage = Object.keys(req.query)
      .filter(k => k !== "page")
      .map(k => `${k}=${req.query[k]}`)
      .join("&");

    res.render("greenzones", {
      layout: "layout/boilerplate",
      zones: paginatedZones,
      currentPage,
      totalPages,
      queryStringWithoutPage,
    });
  } catch (err) {
    console.error("❌ Error rendering green zones:", err);
    res.render("greenzones", {
      layout: "layout/boilerplate",
      zones: [],
      currentPage: 1,
      totalPages: 1,
      queryStringWithoutPage: "",
    });
  }
});

// 🌫 Dummy APIs
app.get("/api/aqi", (req, res) => res.json({ aqi: sampleAQI.aqi, city: "Delhi" }));
app.get("/api/weather", (req, res) => res.json({ temp: sampleAQI.temp, humidity: sampleAQI.humidity, condition: "Hazy" }));
app.get("/api/forecast", (req, res) => res.json({ forecast: [180, 210, 190] }));

// 🧠 Health Advice
app.get("/health", (req, res) => res.render("health", { layout: "layout/boilerplate" }));
app.post("/api/health-advice", (req, res) => {
  const { aqi } = req.body;
  let advice = "✅ Stay hydrated.\n⚠️ Avoid outdoor exercise.\n😷 Mask if AQI >150.";
  if (aqi > 200) advice = "☠️ AQI high! Stay indoors.\n🚫 Avoid traffic zones.";
  res.json({ advice });
});

// 📊 Policy Recommendations (Dummy)
app.post('/api/policy-recommendations', (req, res) => {
  res.json({
    advice: `⚙️ Implement Odd-Even rule.\n🚧 Restrict construction 6 AM–6 PM.\n🌳 Encourage carpool.`
  });
});

// 🧠 Policy Generator
app.post('/api/generate-policy', (req, res) => {
  res.json({
    policy: `🎯 Goal: Reduce AQI < 150.\n✅ 'Clean Delhi Week'.\n🚘 Odd-Even.\n🌿 Enforce green cover.`
  });
});
app.get("/healthlight", (req, res) => {
  res.render("healthlight"); // no layout, standalone page
});

// 📋 Policy Dashboard
app.get('/policy', (req, res) => {
  const statsSummary = { totalUsers: 50, totalCompanies: 12, activePolicies: 10 };
  const policies = [
    { name: "Odd-Even Rule", implemented: true },
    { name: "Construction Ban", implemented: false },
    { name: "Stubble Burning Ban", implemented: false },
    { name: "EV Incentive", implemented: true },
    { name: "Diesel Restriction", implemented: true },
    { name: "Firecracker Ban", implemented: false },
  ];
  res.render('policy', { layout: "layout/boilerplate", statsSummary, policies });
});

// 📍 Policy Map Page (with optional zone
// ===================== POLICY MAP ROUTE =====================
// Without zone
app.get("/policyMap", (req, res) => {
  res.render("policyMap", { zoneName: "All Zones" });
});

// With zone
app.get("/policyMap/:zoneName", (req, res) => {
  const zoneName = decodeURIComponent(req.params.zoneName);
  res.render("policyMap", { zoneName });
});


// 📊 Zone Dashboard
app.get("/zone/:id", (req, res) => {
  const { id } = req.params;
  const subdivisions = [
    { id:"south-saket", name:"Saket" }, { id:"north-narela", name:"Narela" },
    { id:"central-civil-lines", name:"Civil Lines" }, { id:"southwest-dwarka", name:"Dwarka" },
    { id:"east-preet-vihar", name:"Preet Vihar" }, { id:"south-hauz-khas", name:"Hauz Khas" }
  ];
  const zone = subdivisions.find(z => z.id === id);
  if (!zone) return res.status(404).send("Zone not found");
  res.render("zone", { layout: "layout/boilerplate", zoneName: zone.name });
});

// 👥 Citizen Dashboard
app.get("/citizen", (req, res) => {
  const citizenReports = [
    { issue: "Garbage overflow in Sector 12", status: "Pending", date: "2025-10-04" },
    { issue: "Construction dust near Ring Road", status: "Resolved", date: "2025-10-02" },
    { issue: "Burning of waste in park", status: "In Progress", date: "2025-10-03" },
  ];
  const citizenStats = {
    totalReports: citizenReports.length,
    resolved: citizenReports.filter(r => r.status === "Resolved").length,
    pending: citizenReports.filter(r => r.status === "Pending").length,
  };
  res.render("citizen", { layout: "layout/boilerplate", citizenReports, citizenStats });
});

// 🧑‍🏫 AI Coach
app.get("/coach", (req, res) => {
  const tips = [
    { title: "Stay Hydrated", icon: "fas fa-water", desc: "Drink 8 glasses of water." },
    { title: "Mask Up", icon: "fas fa-head-side-mask", desc: "Wear mask when AQI > 150." },
    { title: "Avoid Traffic", icon: "fas fa-car-side", desc: "Plan commute off-peak hours." },
  ];
  res.render("coach", { layout: "layout/boilerplate", tips });
});

// 🧠 Advisory Page
app.get("/advisory", (req, res) => {
  const advisories = [
    { sector: "Transport", action: "Odd-Even next week" },
    { sector: "Construction", action: "Restrict dust-heavy activities" },
    { sector: "Awareness", action: "Launch Clean Delhi Week" }
  ];
  res.render("advisory", { layout: "layout/boilerplate", advisories });
});

// 🚦 Traffic Page
app.get("/traffic", (req, res) => {
  res.render("Traffic", { layout: "layout/boilerplate" });
});

// 🧾 404 Fallback
app.use((req, res) => {
  res.status(404).render("404", { layout: "layout/boilerplate", message: "Page Not Found" });
});

// ===================== SERVER =====================
app.listen(PORT, () => {
  console.log(`🚀 Vaayu Dashboard running at http://localhost:${PORT}`);
});
