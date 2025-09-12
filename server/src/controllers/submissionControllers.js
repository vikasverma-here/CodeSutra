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
    console.log("language ",language)

    const languageId = await getLanguageId(language)

    if (!languageId) {
        return res.status(400).json({ message: "Unsupported programming language" });
    }

    if (!problemById?.hiddenTestCases?.length) {
  return res.status(400).json({ message: "No hidden test cases found" });
}

      const submissions = problemById.hiddenTestCases?.map(test => ({
        source_code: code,
        language_id: languageId,
        stdin: test.input || "",
        expected_output: test.output || "",
      }));


      console.log("kya batch ban rha hai sahi se " ,submissions)

      const tokens = await submitBatch(submissions) 
     console.log(tokens)
      const resultTokens = tokens.map(value => value.token);
      const finalResponse = await fetchBatchResults(resultTokens);
      
      console.log("idjv,m vlic,mvckivcvjo",finalResponse)
      

      const total = finalResponse.length;
    const passed = finalResponse.filter(r => r.status?.id === 3).length; // 3 = Accepted

    // Decide final status
    let finalStatus = "failed";
    if (passed === total) {
      finalStatus = "accepted";
    } else {
      const firstError = finalResponse.find(r => r.status?.id !== 3);
      if (firstError?.status?.id === 6) finalStatus = "compilation_error";
      if (firstError?.status?.id === 5) finalStatus = "time_limit_exceeded";
      if (firstError?.status?.id === 4) finalStatus = "runtime_error";
    }

    // Step 3: Update submission with results
    submittedQuestion.status = finalStatus;
    submittedQuestion.passedCount = passed;
    submittedQuestion.totalCount = total;
    await submittedQuestion.save();

    res.status(200).json({
      message: "Submission evaluated",
      submission: submittedQuestion,
      results: finalResponse,
    });


   
  } catch (error) {
    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
};


