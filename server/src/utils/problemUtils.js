const axios = require('axios');

const getLanguageId = (lang)=>{
   const language = {
  "c++": 105,          
  "java": 91,          
  "javascript": 102,   
  "python": 109,       
  "typescript": 101,   
  "go": 107            
};

    
    return language [lang.toLowecase()] || null;
}




const submitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'true'
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
    return response.data;
  } catch (error) {
    console.error('Error in batch submission:', error.message);
    return null;
  }
};







module.exports={getLanguageId , submitBatch};