const Problem = require("../services/userControllers")
const Submission = require("../../models/submissionModel");


module.exports.getUserSubmissions = async (req, res) => {
  try {
    console.log(req.user)
    const { userID } = req.params; 
    console.log( 'lets check the userId',userID)
    console.log("_id",req.user._id)
   if (userID !== req.user._id.toString()) {
  return res.status(403).json({ message: 'you only can access your solved problem' });
}

console.log(userID)
    
    const subs = await Submission.find({ 
      userId: userID, 
      
    }).populate('problemId', 'title difficulty'); 

  
    let solvedList = [];
    for (let i = 0; i < subs.length; i++) {
      let sub = subs[i];
      let probId = sub.problemId._id.toString();
      
      // Duplicate problem na add ho
      let alreadyAdded = solvedList.some(item => item.problemId == probId);
      if (!alreadyAdded) {
        solvedList.push({
          problemId: probId,
          problemTitle: sub.problemId.title || 'Unknown', 
          difficulty: sub.problemId.difficulty || 'N/A',
          language: sub.language,
          status: sub.status, 
          testCasesPassed: sub.testCasesPassed, 
          testCasesTotal: sub.testCasesTotal, 
          runtime: sub.runtime, 
          memory: sub.memory, 
          submittedAt: sub.createdAt 
        });
      }
    }

    res.json({
      success: true,
      solvedCount: solvedList.length, 
      submissions: solvedList 
    });
  } catch (error) {
    res.status(500).json({ message: 'Kuch toh gadbad hai' });
  }
};




module.exports.getProblemAttempts = async (req, res) => {
  try {
    const { problemId } = req.params;   // param se problemId lo
    const userId = req.user._id;        // logged in user ka id

    console.log("User ID:", userId);
    console.log("Problem ID:", problemId);

    // Submissions nikaalo user aur problem ke basis pe
    const attempts = await Submission.find({ 
      problemId: problemId, 
      userId: userId 
    }).sort({ createdAt: -1 });  // latest first

    // Agar submissions nahi mile
    if (!attempts || attempts.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No attempts found for this problem" 
      });
    }

    res.json({ 
      success: true, 
      totalAttempts: attempts.length, 
      attempts 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Kuch toh gadbad hai" 
    });
  }
};
