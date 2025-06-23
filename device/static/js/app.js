// Configuration
const API_BASE_URL = "http://localhost:8000";
const UPDATE_INTERVAL = 5000; // 5 seconds

// DOM Elements
const elements = {
  // Sensor Cards
  airTempCard: document.getElementById("airTempCard"),
  airHumidityCard: document.getElementById("airHumidityCard"),
  soilTempCard: document.getElementById("soilTempCard"),
  soilMoistureCard: document.getElementById("soilMoistureCard"),
  lightLevelCard: document.getElementById("lightLevelCard"),
  systemHealthCard: document.getElementById("systemHealthCard"),

  // Controls
  toggleLights: document.getElementById("toggleLights"),
  toggleFans: document.getElementById("toggleFans"),
  waterPlants: document.getElementById("waterPlants"),

  // Status
  systemStatus: document.getElementById("systemStatus"),
  activityLog: document.getElementById("activityLog"),
};

// State
let systemState = {
  lights: false,
  fans: false,
  lastWatering: null,
  lastSensorData: null,
  activityLog: [],
};

// Utility Functions
function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function addActivity(message, type = "info") {
  const timestamp = new Date();
  const activity = { message, type, timestamp };
  systemState.activityLog.unshift(activity);

  // Keep only the last 50 activities
  if (systemState.activityLog.length > 50) {
    systemState.activityLog.pop();
  }

  updateActivityLog();
  return activity;
}

function updateActivityLog() {
  if (!elements.activityLog) return;

  elements.activityLog.innerHTML = systemState.activityLog
    .map(
      (activity) => `
            <div class="activity-item">
                <span class="activity-icon">${getActivityIcon(activity.type)}
                <div class="activity-message">${activity.message}</div>
                <div class="activity-time">${formatTimestamp(activity.timestamp)}</div>
            </div>
        `,
    )
    .join("");
}

function getActivityIcon(type) {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };
  return icons[type] || "⚪";
}

function getTrendIndicator(current, previous) {
  if (previous === undefined || current === undefined) return "neutral";
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "neutral";
}

// API Functions
async function fetchSensorData() {
  try {
    // Simulate API call - replace with actual fetch
    // const response = await fetch(`${API_BASE_URL}/api/sensors`);
    // if (!response.ok) throw new Error('Network response was not ok');
    // const data = await response.json();

    // Mock data for demonstration
    const mockData = {
      air_temperature: 22.5 + (Math.random() * 2 - 1),
      air_humidity: 45 + (Math.random() * 10 - 5),
      soil_temperature: 20.5 + (Math.random() * 2 - 1),
      soil_moisture: 65 + (Math.random() * 10 - 5),
      light_level: 1200 + (Math.random() * 1000 - 500),
      system_health: 95 + Math.random() * 5,
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockData;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    addActivity(`Error: ${error.message}`, "error");
    return null;
  }
}

async function sendControlCommand(device, action) {
  const button = elements[`toggle${device.charAt(0).toUpperCase() + device.slice(1)}`];
  const originalText = button?.textContent;

  try {
    // Show loading state
    if (button) {
      button.setAttribute("loading", "true");
    }

    // Simulate API call - replace with actual fetch
    // const response = await fetch(`${API_BASE_URL}/api/control`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ device, action })
    // });
    // if (!response.ok) throw new Error('Failed to execute command');
    // const result = await response.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update state based on action
    if (device === "lights") systemState.lights = action === "on";
    if (device === "fans") systemState.fans = action === "on";

    // Update button text
    if (button) {
      button.textContent =
        `${device.charAt(0).toUpperCase() + device.slice(1)} ${action === "on" ? "On" : "Off"}`.trim();
      button.setAttribute("aria-pressed", action === "on" ? "true" : "false");
    }

    // Log activity
    const activity = addActivity(`Turned ${action} ${device}`, "success");

    return { success: true };
  } catch (error) {
    console.error(`Error controlling ${device}:`, error);
    addActivity(`Failed to control ${device}: ${error.message}`, "error");
    return { success: false, error: error.message };
  } finally {
    // Reset loading state
    if (button) {
      button.removeAttribute("loading");
    }
  }
}

// UI Update Functions
function updateSensorData(data) {
  if (!data) return;

  // Store previous data for trend calculation
  const previousData = systemState.lastSensorData || {};

  // Update sensor cards
  updateSensorCard(
    elements.airTempCard,
    data.air_temperature,
    "°C",
    getTrendIndicator(data.air_temperature, previousData.air_temperature),
  );
  updateSensorCard(
    elements.airHumidityCard,
    data.air_humidity,
    "%",
    getTrendIndicator(data.air_humidity, previousData.air_humidity),
  );
  updateSensorCard(
    elements.soilTempCard,
    data.soil_temperature,
    "°C",
    getTrendIndicator(data.soil_temperature, previousData.soil_temperature),
  );
  updateSensorCard(
    elements.soilMoistureCard,
    data.soil_moisture,
    "%",
    getTrendIndicator(data.soil_moisture, previousData.soil_moisture),
  );
  updateSensorCard(
    elements.lightLevelCard,
    Math.round(data.light_level),
    "lx",
    getTrendIndicator(data.light_level, previousData.light_level),
  );
  updateSensorCard(elements.systemHealthCard, Math.round(data.system_health), "%", "neutral");

  // Store current data for next comparison
  systemState.lastSensorData = data;

  // Log data update
  if (!previousData.air_temperature) {
    addActivity("Connected to sensor data feed", "success");
  }
}

function updateSensorCard(card, value, unit, trend = "neutral") {
  if (!card) return;

  if (value !== undefined && value !== null) {
    const displayValue = unit === "lx" ? Math.round(value) : value.toFixed(1);
    card.setAttribute("value", displayValue);
    card.setAttribute("trend", trend);
  }
}

function updateSystemStatus(message, type = "info") {
  const statusElement = elements.systemStatus;
  if (!statusElement) return;

  statusElement.setAttribute("status", type);
  statusElement.setAttribute("message", message);

  // Add to activity log for important status changes
  if (type === "error" || type === "warning") {
    addActivity(message, type);
  }
}

// Event Handlers
function setupEventListeners() {
  // Toggle Lights
  if (elements.toggleLights) {
    elements.toggleLights.addEventListener("control-click", async () => {
      const newState = !systemState.lights;
      await sendControlCommand("lights", newState ? "on" : "off");
    });
  }

  // Toggle Fans
  if (elements.toggleFans) {
    elements.toggleFans.addEventListener("control-click", async () => {
      const newState = !systemState.fans;
      await sendControlCommand("fans", newState ? "on" : "off");
    });
  }

  // Water Plants
  if (elements.waterPlants) {
    elements.waterPlants.addEventListener("control-click", async () => {
      const now = new Date();
      const cooldown = 5 * 60 * 1000; // 5 minutes

      if (systemState.lastWatering && now - systemState.lastWatering < cooldown) {
        const remaining = Math.ceil((cooldown - (now - systemState.lastWatering)) / 1000 / 60);
        updateSystemStatus(`Please wait ${remaining} more minutes before watering again`, "warning");
        return;
      }

      const result = await sendControlCommand("water", "on");
      if (result?.success) {
        systemState.lastWatering = now;
        addActivity("Started watering plants", "success");

        // Simulate watering duration
        setTimeout(() => {
          addActivity("Finished watering plants", "success");
        }, 5000);
      }
    });
  }
}

// Initialize the dashboard
async function init() {
  // Add initial activity
  addActivity("Initializing dashboard...", "info");

  // Set up event listeners
  setupEventListeners();

  // Initial data load
  updateSensorData(await fetchSensorData());
  updateSystemStatus("System connected", "success");

  // Set up periodic updates
  setInterval(async () => {
    const data = await fetchSensorData();
    updateSensorData(data);
  }, UPDATE_INTERVAL);

  // Add welcome message
  setTimeout(() => {
    addActivity("Welcome to your Garden Dashboard!", "info");
  }, 1000);
}

// Start the application when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
