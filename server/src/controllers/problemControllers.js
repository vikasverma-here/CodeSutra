const problem =require("../models/problemsModel");
const { getLanguageId } = require("../utils/problemUtils");

module.exports.createProblem = async (req,res) => {
  try {
  
    const {title,description, difficulty,tags,constraints,timeLimit,memoryLimit,visibleTestCases, hiddenTestCases,startCode,solutionCode,isPublished }  = req.body;  

  
    try{

      for( const {language,code} of solutionCode){

        if(!language || !code){
          return res.status(400).json({
            success: false,
            message: "Language and code are required in solutionCode"
          });
        }

        const  languageId = getLanguageId(language);

      const submissions = visibleTestCases.map(test => ({
  source_code: code,
  language_id: languageId,
  stdin: test.input,
  expected_output: test.output
}));


     
const submission = await submitBatch(submissions);

      }


    }catch(error){
      console.error("Error in problem creation:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while creating problem"
      });
    }
    


  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating problem"
    });
  }
}