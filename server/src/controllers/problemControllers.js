const Problem =require("../models/problemsModel");
const { getLanguageId, submitBatch, fetchBatchResults } = require("../utils/problemUtils");




module.exports.createProblem = async (req, res) => {
  
  try {

    const creator = req.user;

    const { title, description, difficulty, tags, constraints, timeLimit, 
            memoryLimit, visibleTestCases, hiddenTestCases, startCode, 
            solutionCode, isPublished, problemCreator } = req.body;

    // Validate solution code
    for (const { language, code } of solutionCode) {
      if (!language || !code) {
        return res.status(400).json({
          success: false,
          message: "Language and code are required in solutionCode"
        });
      }

      const languageId = getLanguageId(language);
      const submissions = visibleTestCases.map(test => ({
        source_code: code,
        language_id: languageId,
        stdin: test.input || "",
        expected_output: test.output || "",
      }));

      // Submit to Judge0
      const submission = await submitBatch(submissions);
      const resultTokens = submission.map(value => value.token).join(",");
      const finalResponse = await fetchBatchResults(resultTokens);

      // Check if any test cases failed
      const failedCases = finalResponse.filter(
        result => result.status.id !== 3 // 3 = Accepted
      );

      if (failedCases.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Solution code failed test cases",
          failures: failedCases.map(f => ({
            status: f.status.description,
            error: f.stderr || f.compile_output || f.message
          }))
        });
      }
    }

    // All test cases passed - save to database
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      constraints,
      timeLimit,
      memoryLimit,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      solutionCode,
      isPublished: isPublished || false,
      problemCreator:creator._id,
    });

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      data: problem
    });

  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while creating problem"
    });
  }
};





