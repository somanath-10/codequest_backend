import User from '../models/auth.js'


export const sendFriendRequest = async (req, res) => {
  const { toUserId,fromUserId } = req.body;
//from is me
//to is diff
  if (fromUserId === toUserId) return res.status(400).json({ message: "Cannot send request to yourself" });

  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) return res.status(404).json({ message: "User not found" });

    if (fromUser.friends.includes(toUserId)) return res.status(400).json({ message: "Already friends" });

    if (fromUser.sentRequests.includes(toUserId)) return res.status(400).json({ message: "Request already sent" });

    fromUser.sentRequests.push(toUserId);
    toUser.receivedRequests.push(fromUserId);

    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const { fromUserId,toUserId } = req.body;
    //to is me
    //from is other
  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) return res.status(404).json({ message: "User not found" });

    // Remove from requests
    fromUser.sentRequests = fromUser.sentRequests.filter(id => id.toString() !== toUserId);
    toUser.receivedRequests = toUser.receivedRequests.filter(id => id.toString() !== fromUserId);

    // Add as friends
    fromUser.friends.push(toUserId);
    toUser.friends.push(fromUserId);

    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const rejectFriendRequest = async (req, res) => {
  const { fromUserId,toUserId } = req.body;


  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) return res.status(404).json({ message: "User not found" });

    // Remove from requests
    fromUser.sentRequests = fromUser.sentRequests.filter(id => id.toString() !== toUserId);
    toUser.receivedRequests = toUser.receivedRequests.filter(id => id.toString() !== fromUserId);

    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getfriendrequests = async(req,res)=>{
  try{
      const {userId} = req.body;
      const user = await  User.findById(userId).populate("sentRequests").populate("receivedRequests");
      return res.status(200).json({
        success:true,
        user,
        message:"sent the credentials"
      })

  }
  catch(err){
    return res.status(403).json({
      success:false,
      message:err.message
    })
  }
}