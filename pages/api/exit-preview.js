export default (req, res) => {
    // Clear Preview Mode cookies
    res.clearPreviewData();
  
    // Redirect to the desired page
    res.writeHead(307, { Location: '/' });
    res.end();
  };