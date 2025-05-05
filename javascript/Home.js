// Define the API URL (use your key if necessary)
const api_url = "https://zenquotes.io/api/quotes/";

// Fetch the quote when the page loads
async function fetchQuote() {
  try {
    const response = await fetch(api_url); // Fetch data from ZenQuotes API
    const data = await response.json();  // Parse the JSON response

    // Get the first quote from the response (or you can handle more quotes here)
    const quote = data[0].q;
    const author = data[0].a;

    // Display the quote and author on the page
    document.getElementById("quote-display").innerHTML = `"${quote}" - ${author}`;
  } catch (error) {
    console.error("Error fetching quote:", error);
    document.getElementById("quote-display").innerHTML = "Sorry, we couldn't load a quote right now.";
  }
}

// Call the function when the page loads
window.onload = fetchQuote;