const Problem = require("../models/problemsModel");
const Submission = require("../models/submissionModel");
const { getLanguageId , submitBatch, fetchBatchResults } = require("../utils/problemUtils");
module.exports.submitQuesion = async (req, res) => {
  try {
    const userId = req?.user?._id; 
    const problemId = req.params.id; 
    const { code, language } = req.body; 

  
    if (!userId || !problemId || !code || !language) {
      return res.status(400).json({
        message: "userId, problemId, code, and language are required", 
      });
    }

    const problemById = await Problem.findById(problemId); 
    console.log("kya kuch aa rha ha yanahi bus ",problemById?.hiddenTestCases)

    if (!problemById) {
      return res.status(404).json({ message: "Problem not found" }); 
    }



    const submittedQuestion  = await Submission.create({
        userId : userId,
        problemId:problemId,
        code:code,
        language:language,
        status:"pending",
        problemById:problemById?.hiddenTestCases?.length,

    })

    const languageId = await getLanguageId(language)


      const submissions = problemById?.hiddenTestCases?.map(test => ({
        source_code: code,
        language_id: languageId,
        stdin: test.input || "",
        expected_output: test.output || "",
      }));

      const tokens = await submitBatch(submissions) 
     console.log(tokens)
      const resultTokens = tokens.map(value => value.token);
      const finalResponse = await fetchBatchResults(resultTokens);
      
      console.log("idjv,m vlic,mvckivcvjo",finalResponse)
      



    res.send("done");
  } catch (error) {
    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
};
