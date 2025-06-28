       // Dummy data simulating your MongoDB documents
      const data = [
        {
          title: "Earthquake shakes California",
          disaster_event: "Earthquake",
          timestamp: "2025-06-18T10:00:00Z",
          source: "News Agency",
          url: "https://example.com/earthquake-ca",
          Location: "California",
          Latitude: 36.7783,
          Longitude: -119.4179,
        },
        {
          title: "Flood warnings in Nepal",
          disaster_event: "Flood",
          timestamp: "2025-06-15T08:30:00Z",
          source: "Local News",
          url: "https://example.com/flood-nepal",
          Location: "Nepal",
          Latitude: 28.3949,
          Longitude: 84.124,
        },
        {
          title: "Cyclone approaching Bangladesh coast",
          disaster_event: "Cyclone",
          timestamp: "2025-06-19T12:00:00Z",
          source: "Weather Channel",
          url: "https://example.com/cyclone-bd",
          Location: "Bangladesh",
          Latitude: 23.685,
          Longitude: 90.3563,
        },
        {
          title: "Volcano eruption in Iceland",
          disaster_event: "Volcano",
          timestamp: "2025-06-10T09:00:00Z",
          source: "Science Daily",
          url: "https://example.com/volcano-iceland",
          Location: "Iceland",
          Latitude: 64.9631,
          Longitude: -19.0208,
        },
      ];

      // Marquee data
      const marqueeData = [
        {
          title: "Earthquake shakes California",
          url: "https://example.com/earthquake-ca",
          event: "Earthquake",
        },
        {
          title: "Flood warnings in Nepal",
          url: "https://example.com/flood-nepal",
          event: "Flood",
        },
        {
          title: "Cyclone approaching Bangladesh coast",
          url: "https://example.com/cyclone-bd",
          event: "Cyclone",
        },
        {
          title: "Volcano eruption in Iceland",
          url: "https://example.com/volcano-iceland",
          event: "Volcano",
        },
      ];

      // Global variables
      let map;
      let markerCluster;
      let currentData = [];

      // Initialize the application
      document.addEventListener("DOMContentLoaded", function () {
        initMap();
        setupUI();
        loadData();
        populateMarquee();
      });

      // Initialize the map
      function initMap() {
        map = L.map("map").setView([20, 0], 2);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        markerCluster = L.markerClusterGroup();
        map.addLayer(markerCluster);
      }

      // Setup UI elements
      function setupUI() {
        // Set default dates
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        document.getElementById("start-date").valueAsDate = sevenDaysAgo;
        document.getElementById("end-date").valueAsDate = today;

        // Setup event listeners
        document
          .getElementById("apply-filters")
          .addEventListener("click", applyFilters);
      }

      // Load data
      function loadData() {
        currentData = data;

        // Populate disaster type dropdown
        const disasterTypes = [
          ...new Set(data.map((item) => item.disaster_event)),
        ];
        const select = document.getElementById("disaster-select");

        disasterTypes.forEach((type) => {
          const option = document.createElement("option");
          option.value = type;
          option.textContent = type;
          select.appendChild(option);
        });

        // Initial display
        applyFilters();
      }

      // Populate marquee with recent events
      function populateMarquee() {
        const marquee = document.getElementById("marquee-content");
        marquee.innerHTML = marqueeData
          .map(
            (event) =>
              `<a href="${event.url}" target="_blank">${event.title}</a><br><br>`
          )
          .join("");
      }

      // Apply filters to the data
      function applyFilters() {
        const startDate = new Date(document.getElementById("start-date").value);
        const endDate = new Date(document.getElementById("end-date").value);
        const selectedDisasters = Array.from(
          document.getElementById("disaster-select").selectedOptions
        ).map((option) => option.value);

        // Filter data
        let filteredData = currentData.filter((item) => {
          const itemDate = new Date(item.timestamp);
          const dateMatch = itemDate >= startDate && itemDate <= endDate;

          let disasterMatch = false;
          if (
            selectedDisasters.includes("All") ||
            selectedDisasters.length === 0
          ) {
            disasterMatch = true;
          } else {
            disasterMatch = selectedDisasters.includes(item.disaster_event);
          }

          return dateMatch && disasterMatch;
        });

        // Update map and table
        updateMap(filteredData);
        updateDataTable(filteredData);
      }

      // Update map with filtered data
      function updateMap(data) {
        markerCluster.clearLayers();

        if (data.length === 0) {
          document.getElementById("data-table").style.display = "none";
          return;
        }

        // Custom icons - replace with your actual icon paths
        const iconPaths = {
          Earthquake: "https://cdn-icons-png.flaticon.com/128/2731/2731816.png",
          Flood: "https://cdn-icons-png.flaticon.com/128/2731/2731822.png",
          Landslide: "https://cdn-icons-png.flaticon.com/128/2731/2731832.png",
          Fire: "https://cdn-icons-png.flaticon.com/128/616/616408.png",
        };

        // Add markers
        data.forEach((item) => {
          const iconUrl =
            iconPaths[item.disaster_event] ||
            "https://cdn-icons-png.flaticon.com/128/2731/2731816.png";
          const icon = L.icon({
            iconUrl: iconUrl,
            iconSize: [35, 35],
            iconAnchor: [15, 30],
            popupAnchor: [0, -25],
          });

          const popupContent = `<a href="${item.url}" target="_blank">${
            item.title
          }</a><br>
                                     <b>Type:</b> ${item.disaster_event}<br>
                                     <b>Location:</b> ${item.Location}<br>
                                     <b>Date:</b> ${new Date(
                                       item.timestamp
                                     ).toLocaleDateString()}`;

          const marker = L.marker([item.Latitude, item.Longitude], {
            icon: icon,
          })
            .bindPopup(popupContent)
            .bindTooltip(`${item.disaster_event}, ${item.Location}`);

          markerCluster.addLayer(marker);
        });

        // Fit bounds if we have markers
        if (data.length > 0) {
          const bounds = L.latLngBounds(
            data.map((item) => [item.Latitude, item.Longitude])
          );
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        // Show/hide data table
        document.getElementById("data-table").style.display =
          data.length > 0 ? "block" : "none";
      }

      // Update data table
      function updateDataTable(data) {
        const tableBody = document.querySelector("#data-table-content tbody");
        tableBody.innerHTML = "";

        data.forEach((item) => {
          const row = document.createElement("tr");

          const titleCell = document.createElement("td");
          const titleLink = document.createElement("a");
          titleLink.href = item.url;
          titleLink.textContent = item.title;
          titleLink.target = "_blank";
          titleCell.appendChild(titleLink);

          const typeCell = document.createElement("td");
          typeCell.textContent = item.disaster_event;

          const dateCell = document.createElement("td");
          dateCell.textContent = new Date(item.timestamp).toLocaleDateString();

          const sourceCell = document.createElement("td");
          sourceCell.textContent = item.source;

          const locationCell = document.createElement("td");
          locationCell.textContent = item.Location;

          row.appendChild(titleCell);
          row.appendChild(typeCell);
          row.appendChild(dateCell);    
          row.appendChild(sourceCell);
          row.appendChild(locationCell);

          tableBody.appendChild(row);
        });
      }