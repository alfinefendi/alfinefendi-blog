const getHeader = async () => {
    const url = '../includes/header.html'; // Path to your footer HTML file
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const headerContent = await response.text(); // Get the HTML content as text
      document.getElementById('site-header').innerHTML = headerContent; // Insert into the page
    } catch (error) {
      console.error('Failed to fetch header:', error);
    }
  };
  
  getHeader();

const getFooter = async () => {
    const url = '../includes/footer.html'; // Path to your footer HTML file
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const footerContent = await response.text(); // Get the HTML content as text
      document.getElementById('site-footer').innerHTML = footerContent; // Insert into the page
    } catch (error) {
      console.error('Failed to fetch footer:', error);
    }
  };
  
  getFooter();