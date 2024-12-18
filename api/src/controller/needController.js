const Need = require('../models/need');

// Report a new need
const reportNeed = async (req, res) => {
  try {
    const { userId, typeOfHelp, description, urgency, location } = req.body;

    // Validate input
    if (!userId || !typeOfHelp || !description || !urgency || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new need entry
    const newNeed = new Need({
      userId,
      typeOfHelp,
      description,
      urgency,
      location,
      status: 'Reported', // Initial status
    });

    // Save the new need
    await newNeed.save();

    // Notify organizations and admins (simplified for now)
    console.log('New Need Reported:', newNeed);

    // Return success response
    res.status(201).json({ message: 'Need reported successfully', need: newNeed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all needs reported by a user
const getUserNeeds = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all needs reported by the user
    const userNeeds = await Need.find({ userId });

    if (!userNeeds) {
      return res.status(404).json({ message: 'No needs found for this user' });
    }

    res.status(200).json({ needs: userNeeds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching needs', error });
  }
};

// Update the status of a need
const updateNeedStatus = async (req, res) => {
  try {
    const { needId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Update the status of the need
    const updatedNeed = await Need.findByIdAndUpdate(
      needId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedNeed) {
      return res.status(404).json({ message: 'Need not found' });
    }

    // Notify user about the status change (simplified)
    console.log(`Need Status Updated: ${updatedNeed.status}`);

    res.status(200).json({ message: 'Need status updated', need: updatedNeed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating need status', error });
  }
};

module.exports = { reportNeed, getUserNeeds, updateNeedStatus };
