import { prisma } from "../db/prisma.js";


// PUT /user/location
const updateUserLocation = async (req, res) => {
  try {
    const userId = req.user?.id; 
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { address, city, state, country, latitude, longitude } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId }, 
      data: {
        address,
        city,
        state,
        country,
        latitude,
        longitude,
      },
    });

    res.json({
      success: true,
      message: "Location updated successfully",
      data: {
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        country: updatedUser.country,
      },
    });
  } catch (err) {
    console.error("Error updating location:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
export { updateUserLocation };


//user profile
const getUserProfile = async (req, res) => {
  try {
   const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        profileImage: true,
        address: true,
        city: true,
        state: true,
        country: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || null,
        profileImage: user.profileImage,
        location: {
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          country: user.country || "",
        },
        preferences: {
          currency: "USD",   // static for now
          language: "en",    // static for now
          notifications: {
            orderUpdates: true,
            promotions: true,
            newsletters: false,
          },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export { getUserProfile };


