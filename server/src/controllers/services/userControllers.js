const Problem = require("../services/userControllers")
const Submission = require("../services/userControllers");


module.exports.getUserSubmissions = async (req, res) => {
  try {
    console.log(req.user)
    const userId = req.user.userId; // URL se user ID
    console.log(userId)
    console.log(req.user._id)
    if (userId != req.user._id) { // Sirf apna data dekh
      return res.status(403).json({ message: 'only ' });
    }

    
    const subs = await Submission.find({ 
      userId: userId, 
      status: ['accepted'] 
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
          problemTitle: sub.problemId.title || 'Unknown', // Problem ka title
          difficulty: sub.problemId.difficulty || 'N/A', // Problem difficulty
          language: sub.language, // JS, C++, etc.
          status: sub.status, // Accepted ya success
          testCasesPassed: sub.testCasesPassed, // Kitne test pass hue
          testCasesTotal: sub.testCasesTotal, // Total test cases
          runtime: sub.runtime, // milliseconds
          memory: sub.memory, // KB
          submittedAt: sub.createdAt // Kab submit kiya
        });
      }
    }

    res.json({
      success: true,
      solvedCount: solvedList.length, // Total solved problems
      submissions: solvedList // Puri details
    });
  } catch (error) {
    res.status(500).json({ message: 'Kuch toh gadbad hai' });
  }
};

