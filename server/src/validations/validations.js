

// validators/problemValidator.js
const { body } = require('express-validator');

exports.problemValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('tags').isArray().withMessage('Tags must be an array'),
  body('constraints').isString().withMessage('Constraints must be a string'),
  body('timeLimit').isNumeric().withMessage('Time limit must be a number'),
  body('memoryLimit').isNumeric().withMessage('Memory limit must be a number'),
  body('visibleTestCases').isArray({ min: 1 }).withMessage('At least one visible test case is required'),
  body('hiddenTestCases').isArray({ min: 1 }).withMessage('At least one hidden test case is required'),
  body('startCode').isArray().withMessage('Start code must be an array of objects'),
  body('solutionCode').isArray().withMessage('Solution code must be an array of objects'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
];

