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

      console.log(submissions)

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
      
    });

  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while creating problem"
    });
  }
};



module.exports.updateProblem = async (req, res) => {
  const { id } = req.params;

  // Find the existing problem
  let problem = await Problem.findById(id);
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: "Problem not found",
    });
  }

  try {
    const creator = req.user; // Assuming req.user contains the authenticated admin's details

    const {
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
      isPublished,
      problemCreator,
    } = req.body;

    // Validate solution code if provided
    if (solutionCode) {
      for (const { language, code } of solutionCode) {
        if (!language || !code) {
          return res.status(400).json({
            success: false,
            message: "Language and code are required in solutionCode",
          });
        }

        const languageId = getLanguageId(language); // Assuming this function exists
        const submissions = visibleTestCases.map((test) => ({
          source_code: code,
          language_id: languageId,
          stdin: test.input || "",
          expected_output: test.output || "",
        }));

        // Submit to Judge0
        const submission = await submitBatch(submissions); // Assuming submitBatch exists
        const resultTokens = submission.map((value) => value.token).join(",");
        const finalResponse = await fetchBatchResults(resultTokens); // Assuming fetchBatchResults exists

        // Check if any test cases failed
        const failedCases = finalResponse.filter(
          (result) => result.status.id !== 3 // 3 = Accepted
        );

        if (failedCases.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Solution code failed test cases",
            failures: failedCases.map((f) => ({
              status: f.status.description,
              error: f.stderr || f.compile_output || f.message,
            })),
          });
        }
      }
    }

    // Update the problem with new values (only update provided fields)
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title: title || problem.title,
        description: description || problem.description,
        difficulty: difficulty || problem.difficulty,
        tags: tags || problem.tags,
        constraints: constraints || problem.constraints,
        timeLimit: timeLimit || problem.timeLimit,
        memoryLimit: memoryLimit || problem.memoryLimit,
        visibleTestCases: visibleTestCases || problem.visibleTestCases,
        hiddenTestCases: hiddenTestCases || problem.hiddenTestCases,
        startCode: startCode || problem.startCode,
        solutionCode: solutionCode || problem.solutionCode,
        isPublished: isPublished !== undefined ? isPublished : problem.isPublished,
        problemCreator: problemCreator || problem.problemCreator || creator._id,
      },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      // data: updatedProblem,
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while updating problem",
    });
  }
};

module.exports.deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the problem by ID
    const problem = await Problem.findByIdAndDelete(id);

    // Check if the problem exists
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while deleting problem",
    });
  }
};

module.exports.getSinglePrblemById = async (req, res) => {
  try {
    const { id } = req.params;

    // DB se problem fetch karo
    const problem = await Problem.findById(id)
      .populate("problemCreator", " email username");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: problem,
    });

  } catch (error) {
    console.error("Error fetching problem:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching problem",
    });
  }
};
module.exports.getAllPrblems = async (req, res) => {
  try {
    

    // DB se problem fetch karo
    const problem = await Problem.find({})
      .populate("problemCreator", " email username");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: problem,
    });

  } catch (error) {
    console.error("Error fetching problem:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching problem",
    });
  }
};
