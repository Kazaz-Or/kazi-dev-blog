export default (req, res) => {
  try {
      // Enable Preview Mode by setting the cookies
      res.setPreviewData({});
      
      // Redirect to the desired page
      const redirectPath = req.query.redirect || '/';
      res.writeHead(307, { Location: redirectPath });
      res.end();
  } catch (error) {
      console.error("Error setting preview mode:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
