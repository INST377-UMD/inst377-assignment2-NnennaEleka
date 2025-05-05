console.log("Audio.js loaded");

if (annyang) {
    const commands = {
      // "Hello" command to trigger an alert
      'hello': () => {
        alert('Hello World');
        console.log("Hello");
      },
  
      // "Change the color to <color>" command
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
        console.log("color changed");
      },
  
      // "Navigate to <page>" command (make sure the page names match)
      'navigate to *page': (page) => {
        // Convert spoken page name to lowercase and match it to your file names
        page = page.toLowerCase();
  
        // Check if the page exists in the list
        if (['Home', 'Stocks', 'Dogs'].includes(page)) {
          window.location.href = `${page}.html`; // navigate to the correct page
        } else {
          alert('Page not found: ' + page); // alert if page is not found
        }
      }
    };
  
    // Add the commands to annyang
    annyang.addCommands(commands);
    console.log("Annyang commands loaded");
  }
  
  // Attach functions to global window object so buttons work
  window.turnOnAudio = function() {
    if (annyang) {
      annyang.start({ autoRestart: true, continuous: true });
      console.log("Audio listening turned ON");
    }
  };
  
  window.turnOffAudio = function() {
    if (annyang) {
      annyang.abort();
      console.log("Audio listening turned OFF");
    }
  };