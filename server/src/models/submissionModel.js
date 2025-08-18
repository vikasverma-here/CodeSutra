const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'cpp', 'java', 'python', 'c'] // ✅ Python, C add kiya future ke liye
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'error'],
    default: 'pending'
  },
  runtime: {
    type: Number,  // milliseconds
    default: 0
  },
  memory: {
    type: Number,  // kB
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {  
    type: Number,
    default: 0
  },

  // ================= Advanced Fields ==================

  judge0Id: {
    type: String, 
    default: null 
    // ✅ Judge0 ka submission token store karne ke liye (taaki baad me result fetch kar sako)
  },

  stdout: {
    type: String,
    default: ''
    // ✅ Program ka actual output store karne ke liye (debugging & output compare ke liye)
  },

  stderr: {
    type: String,
    default: ''
    // ✅ Runtime error ka output store karne ke liye (jaise segmentation fault, etc.)
  },

  compile_output: {
    type: String,
    default: ''
    // ✅ Compiler error logs (Compilation Error dikhane ke liye)
  },

  input: {
    type: String,
    default: ''
    // ✅ Jo test case input run hua tha uska record rakhne ke liye (useful for showing user "This was the input")
  },

  languageVersion: {
    type: String,
    default: ''
    // ✅ Judge0 se milega, jaise C++17, Python 3.8 (useful to show exact runtime environment)
  },

  executionTime: {
    type: Date,
    default: Date.now
    // ✅ Kab submission execute hua tha uska exact time (analytics ke liye)
  }

}, { 
  timestamps: true // ✅ createdAt, updatedAt store hoga (submission history ke liye)
});

module.exports = mongoose.model('Submission', submissionSchema);
