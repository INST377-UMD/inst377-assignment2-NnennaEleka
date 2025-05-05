


document.addEventListener('DOMContentLoaded', () => {
    // Event listener for button click to load the chart
    document.getElementById('loadChart').addEventListener('click', async () => {
        const ticker = document.getElementById('stockTicker').value.toUpperCase();
        const days = parseInt(document.getElementById('days').value, 10);

        if (!ticker) {
            alert('Please enter a stock ticker.');
            return;
        }

        const stockData = await fetchStockData(ticker, days);

        if (stockData.length === 0) {
            alert('No data found for this stock.');
            return;
        }

        displayChart(stockData);
    });

    // Load the top stocks table when the page loads
    window.onload = displayTopStocks;
});

// fetch stock data from Polygon.io API
async function fetchStockData(ticker, days) {
    const apiKey = '0QjDZ4Sc7VhckanRR9LgXP90n1o6kAWv';

    if (isNaN(days) || days <= 0) {
        alert('Please select a valid number of days.');
        return [];
    }

    const endDate = new Date().toISOString().split('T')[0]; // Today's date
    const startDate = new Date(new Date().setDate(new Date().getDate() - days)); // Date range

    const formattedStartDate = startDate.toISOString().split('T')[0]; 
    console.log('Start Date:', formattedStartDate);
    console.log('End Date:', endDate);

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedStartDate}/${endDate}?adjusted=true&sort=asc&apiKey=${apiKey}`;

    
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Fetched data:', data);  // Log the raw data

        if (!data.results || data.results.length === 0) {
            console.warn('No results found for this stock.');
            alert('No data found for this stock.');
            return [];
        }

        const labels = data.results.map(d => new Date(d.t).toLocaleDateString());
        const prices = data.results.map(d => d.c);

        console.log('Labels:', labels);  // Log labels (dates)
        console.log('Prices:', prices);  // Log prices

        return { labels, prices };
    } catch (error) {
        console.error('Error fetching stock data:', error);
        alert('Failed to fetch stock data.');
        return [];
    }
}
// Function to create the chart using Chart.js
function displayChart(stockData) {
    const ctx = document.getElementById('stockChart').getContext('2d');

    if (window.stockChartInstance) {
        window.stockChartInstance.destroy(); // Destroys old chart if its still there
    }

    window.stockChartInstance = new Chart(ctx, {
        type: 'line', // Line chart
        data: {
            labels: stockData.labels,
            datasets: [{
                label: `${document.getElementById('stockTicker').value.toUpperCase()} Stock Price`,
                data: stockData.prices,
                borderColor: 'blue',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    labels: stockData.labels,
                },
                y: {
                    beginAtZero: false,
                }
            }
        }
    });
}

// fetch and display top 5 stocks
async function displayTopStocks() {
    const container = document.getElementById('topStocksContainer');
    container.innerHTML = '';

    let topStocks = [];

    try {
        const response = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
        const data = await response.json();

        topStocks = data.slice(0, 5);

        if (topStocks.length < 5) {
            console.warn(`Only ${topStocks.length} stocks received. Using mock data to fill in.`);
            const mockStocks = [
                { ticker: 'AAPL', no_of_comments: 120, sentiment: 'Bullish' },
                { ticker: 'TSLA', no_of_comments: 98, sentiment: 'Bearish' },
                { ticker: 'AMZN', no_of_comments: 65, sentiment: 'Neutral' },
                { ticker: 'MSFT', no_of_comments: 44, sentiment: 'Bullish' },
                { ticker: 'NVDA', no_of_comments: 33, sentiment: 'Bullish' }
            ];

            // Fill in missing rows from mock data
            topStocks = topStocks.concat(mockStocks.slice(topStocks.length));
        }
    } catch (error) {
        console.error('Failed to fetch top stocks:', error);
        // Use full mock data if the API call fails completely
        topStocks = [
            { ticker: 'AAPL', no_of_comments: 120, sentiment: 'Bullish' },
            { ticker: 'TSLA', no_of_comments: 98, sentiment: 'Bearish' },
            { ticker: 'AMZN', no_of_comments: 65, sentiment: 'Neutral' },
            { ticker: 'MSFT', no_of_comments: 44, sentiment: 'Bullish' },
            { ticker: 'NVDA', no_of_comments: 33, sentiment: 'Bullish' }
        ];
    }

    // Define the image URLs (replace these with actual URLs)
    const bullishIconUrl = 'https://static.thenounproject.com/png/3328202-200.png'; // Replace with your actual image URL for Bullish
    const bearishIconUrl = 'https://static.thenounproject.com/png/3328203-200.png'; // Replace with your actual image URL for Bearish


    // Create table
    const table = document.createElement('table');
    table.border = '1';
    table.className = 'stock-table';

    // Header row
    const headerRow = document.createElement('tr');
    ['Ticker', 'Comment Count', 'Sentiment'].forEach(text => {
        const th = document.createElement('td');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Data rows
    topStocks.forEach(stock => {
        const row = document.createElement('tr');

        const ticker = document.createElement('td');
        const tickerLink = document.createElement('a');
        tickerLink.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        tickerLink.textContent = stock.ticker;
        tickerLink.target = '_blank'; 
        ticker.appendChild(tickerLink);

        const commentCount = document.createElement('td');
        commentCount.textContent = stock.no_of_comments;

        const sentiment = document.createElement('td');
        const sentimentImage = document.createElement('img');
        
        // Assign icon based on sentiment
        if (stock.sentiment === 'Bullish') {
            sentimentImage.src = bullishIconUrl; // Set Bullish icon
            sentimentImage.alt = 'Bullish';
        } else if (stock.sentiment === 'Bearish') {
            sentimentImage.src = bearishIconUrl; // Set Bearish icon
            sentimentImage.alt = 'Bearish';
        } else {
            sentimentImage.alt = 'Neutral'; // You can handle Neutral sentiment with a default icon if you wish
        }
        
        sentiment.appendChild(sentimentImage);

        row.appendChild(ticker);
        row.appendChild(commentCount);
        row.appendChild(sentiment);
        table.appendChild(row);
    });

    container.appendChild(table);
}



// Load the top stocks table when the page loads
window.onload = displayTopStocks;

