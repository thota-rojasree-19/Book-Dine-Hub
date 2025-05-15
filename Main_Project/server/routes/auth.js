// const jwt = require('jsonwebtoken');

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find user
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: "User not found" });

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//         // Generate token
//         const token = jwt.sign({ id: user._id }, "yourSecretKey", { expiresIn: "1h" });
//         res.json({ token });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// });




const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model
const router = express.Router(); // Add this line

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare passwords
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, "yourSecretKey", { expiresIn: "1h" });
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export the router
module.exports = router;
