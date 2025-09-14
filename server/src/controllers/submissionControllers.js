




const Problem = require("../models/problemsModel");
const Submission = require("../models/submissionModel");
const { getLanguageId, submitBatch, fetchBatchResults } = require("../utils/problemUtils");

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
    if (!problemById) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const allTestCases = [
      ...(problemById.visibleTestCases || []),
      ...(problemById.hiddenTestCases || []),
    ];

    if (!allTestCases.length) {
      return res.status(400).json({ message: "No test cases found" });
    }

    const languageId = await getLanguageId(language);
    if (!languageId) {
      return res.status(400).json({ message: "Unsupported programming language" });
    }

    
    const submissions = allTestCases.map(test => ({
      source_code: code,
      language_id: languageId,
      stdin: test.input || "",
      expected_output: test.output || "",
    }));

    const tokens = await submitBatch(submissions);
    const resultTokens = tokens.map(t => t.token);
    const finalResponse = await fetchBatchResults(resultTokens);

    const total = finalResponse.length;
    const passed = finalResponse.filter(r => r.status?.id === 3).length;

    let finalStatus = "failed";
    if (passed === total) {
      finalStatus = "accepted";
    } else {
      const firstError = finalResponse.find(r => r.status?.id !== 3);
      if (firstError?.status?.id === 6) finalStatus = "compilation_error";
      if (firstError?.status?.id === 5) finalStatus = "time_limit_exceeded";
      if (firstError?.status?.id === 4) finalStatus = "runtime_error";
    }




    const runtime = finalResponse.reduce((acc, r) => acc + Number(r.time || 0), 0) / total;
const memory = finalResponse.reduce((acc, r) => acc + Number(r.memory || 0), 0) / total;

   const submittedQuestion = await Submission.create({
  userId,
  problemId,
  code,
  language,
  status: finalStatus,
  testCasesPassed: passed,
  testCasesTotal: total,
  runtime,
  memory,
});

    res.status(200).json({
      message: "Submission evaluated",
      submission: submittedQuestion,
      results: finalResponse, // UI me tum sirf visible test cases dikhana
    });

  } catch (error) {
    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
};
