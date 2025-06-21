const { main } = require("../utils/gemini");

module.exports.aiChat = async (req, res) => {
  try {
    // console.log("This is my first component");

    const userMessage = req.body.message; 
    // console.log("Received message:", userMessage);

    if (!userMessage) {
      return res.status(400).send({ status: "error", message: "Message is required" });
    }

    // console.log("ye message aa rha hai ",userMessage)
    const message = await main(userMessage);  
    // console.log("ye messag aa rha hai contrlllwe aw r", message)

    res.send({
      message: message,
      status: "success",
      code: 200
    });

  } catch (err) {
    console.error("AI Chat error:", err);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
};
