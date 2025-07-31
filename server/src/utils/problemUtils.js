const axios = require('axios');
require('dotenv').config();
const getLanguageId = (lang)=>{
   const language = {
  "c++": 105,          
  "java": 91,          
  "javascript": 102,   
  "python": 109,       
  "typescript": 101,   
  "go": 107            
};

    
    return language [lang.toLowerCase()] || null;
}






const submitBatch = async (submissions) => {
  console.log("yha pe console ho rahi ",process.env.X_RAPIDAPI_KEY)
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false',
      wait: true 
    },
    headers: {
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
      'Content-Type': 'application/json'
    },
    data: {
      submissions
    }
  };

  try {
    const response = await axios.request(options);
    // console.log("is there are " , response)
    return response.data;
  } catch (error) {
    console.error('Error in batch submission:', error.message);
    return null;
  }
};



// const fetchBatchResults = async (finalTokens) => {
//   try {
//     const response = await axios.get(
//       `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${finalTokens}`,
//       {
//         headers: {
//           "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
//           "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
//         }
//       }
//     );

//     console.log("Batch results:", response.data.submissions);
//     return  response.data.submissions
//   } catch (error) {
//     console.error("Error fetching batch results:", error.message);
//   }
// };


const fetchBatchResults = async (finalTokens, maxRetries = 5, delay = 1000) => {
  try {
    let retries = 0;
    
    while (retries < maxRetries) {
      const response = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${finalTokens}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );

      const allCompleted = response.data.submissions.every(
        sub => sub.status.id !== 1 && sub.status.id !== 2 // Not In Queue or Processing
      );

      if (allCompleted) {
        console.log("Final batch results:", response.data.submissions);
        return response.data.submissions;
      }

      retries++;
      if (retries < maxRetries) {
        console.log(`Not all completed, retrying (${retries}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error("Max retries reached while waiting for submissions to complete");
  } catch (error) {
    console.error("Error fetching batch results:", error.message);
    throw error;
  }
};







module.exports={getLanguageId , submitBatch,fetchBatchResults};