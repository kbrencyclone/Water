document.addEventListener('DOMContentLoaded', () => {
    // Your Google Sheets ID and API key
    const SHEET_ID = '1Wa2Emlh2oPF50vp9rp0s0xM5BZ7aeqYkc0YWThWDmj0';
    const API_KEY = 'AIzaSyAVMzmhf02I47WpjNJkDyVTUUqb1pRLQ5s';
    
    // Fetch data from Google Sheets
    const fetchDataFromGoogleSheets = async (range) => {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`);
      const data = await response.json();
      return data.values;
    };
  
    const fetchMetricsData = async () => {
      const data = await fetchDataFromGoogleSheets('metrics');
      return data;
    };
  
    const fetchResultsData = async () => {
      const data = await fetchDataFromGoogleSheets('results');
      return data;
    };
  
    Promise.all([fetchMetricsData(), fetchResultsData()]).then(([metricsData, resultsData]) => {
      const metricsInfoContainer = document.getElementById('metrics-info-container');
      const colorScalesContainer = document.getElementById('color-scales-container');
      const propertyContainer = document.getElementById('property-container');
      
      // Process metrics data
      const headers = metricsData[0];
      const rows = metricsData.slice(1);
  
      rows.forEach(row => {
        // Destructure row data based on column positions
        const [title, redThreshold, yellowThreshold, greenThreshold, markedValue, boldDescription, unboldedDescription] = row;
  
        // Create and append color scale elements
        const colorScaleContainer = document.createElement('div');
        colorScaleContainer.className = 'color-scale-container';
  
        const colorScaleTitle = document.createElement('div');
        colorScaleTitle.className = 'color-scale-title';
        colorScaleTitle.textContent = title;
  
        const colorScale = document.createElement('div');
        colorScale.className = 'color-scale';
  
        // Determine marker position based on the ratio of column 4 (markedValue) to column 1 (redThreshold)
      const scaleWidth = 300; // Width of the color scale in pixels
      const markerPosition = (markedValue / redThreshold) * scaleWidth;

        const marker = document.createElement('div');
        marker.className = 'marker';
        marker.style.right = `${markerPosition}px`; // Set marker position based on the calculated value
        
        const markerLabel = document.createElement('div');
        markerLabel.className = 'marker-label';
        markerLabel.textContent = markedValue;
        markerLabel.style.right = `${markerPosition}px`;
  
        colorScale.appendChild(marker);
        colorScale.appendChild(markerLabel);

        // Create and append tick marks
        const redTick = document.createElement('div');
        redTick.className = 'tick-mark';
        redTick.style.left = '0px';

        const greenTick = document.createElement('div');
        greenTick.className = 'tick-mark';
        greenTick.style.left = `${scaleWidth}px`;

        const redLabel = document.createElement('div');
        redLabel.className = 'red-label'; 
        redLabel.textContent = redThreshold; 
        redLabel.style.left = redTick.style.left;

        const greenLabel = document.createElement('div');
        greenLabel.className = 'green-label';
        greenLabel.textContent = greenThreshold; 
        greenLabel.style.left = greenTick.style.left;

        colorScale.appendChild(redTick);
        colorScale.appendChild(greenTick);
        colorScale.appendChild(redLabel);
        colorScale.appendChild(greenLabel); 
  
        colorScaleContainer.appendChild(colorScaleTitle);
        colorScaleContainer.appendChild(colorScale);
        colorScalesContainer.appendChild(colorScaleContainer);
  
        // Create and append metric description elements
        const metricDescriptionContainer = document.createElement('div');
        metricDescriptionContainer.className = 'metric-description-container';
  
        const metricDescription = document.createElement('div');
        metricDescription.className = 'metric-description';
        metricDescription.innerHTML = `<strong>${boldDescription}</strong>${unboldedDescription}`;
  
        metricDescriptionContainer.appendChild(metricDescription);
        metricsInfoContainer.appendChild(metricDescriptionContainer);
      });
  
      // Process results data for property info
      if (resultsData.length > 0) {
        const resultsRow = resultsData[1]; // Assuming the property data is in the second row (adjust as needed)
        propertyContainer.innerHTML = `
          <p><strong>Property:</strong> ${resultsRow[1]}</p>
          <p><strong>Last Testing Date:</strong> ${resultsRow[2]}</p>
          <p><strong>Next Testing Date:</strong> ${resultsRow[3]}</p>
          <p><strong>Testing Frequency:</strong> ${resultsRow[4]}</p>
        `;
      }
    }).catch(error => {
      console.error('Error fetching data from Google Sheets:', error);
    });
  });
  
  