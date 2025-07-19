import User from '../models/auth.js';

export const getLoginHistory = async (req, res) => {
  try {
        const user1 = req.body;
        const userId = user1.token;
        console.log(userId)
        // const userId = "6832e657706593fbbe285396";
        
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    res.json({ success: true, loginHistory: user.loginHistory || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch login history' });
  }
};
