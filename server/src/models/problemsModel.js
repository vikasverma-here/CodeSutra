const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    tags: [
      {
        type: String,
        enum: ['array', 'linkedList', 'graph', 'dp', 'math', 'string', 'tree', 'recursion', 'binarySearch'],
        required: true,
      }
    ],
    constraints: {
      type: String,
    },
    timeLimit: {
      type: Number,
      default: 1000,
    },
    memoryLimit: {
      type: Number, 
      default: 256,
    },
    visibleTestCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, required: true },
      }
    ],
    hiddenTestCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      }
    ],
    startCode: [
      {
        language: {
          type: String,
          enum: ['cpp', 'java', 'python', 'javascript'],
          required: true,
        },
        initialCode: {
          type: String,
          required: true,
        }
      }
    ],
    solutionCode: [
      {
        language: {
          type: String,
          enum: ['cpp', 'java', 'python', 'javascript'],
          required: true,
        },
        code: {
          type: String,
          required: true,
        }
      }
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    submissionsCount: {
      type: Number,
      default: 0,
    },
    acceptedCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const problem = mongoose.model('Problem', problemSchema);
  
module.exports=problem