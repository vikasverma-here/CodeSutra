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
  body('visibleTestCases').isArray().withMessage('Visible test cases must be an array'),
  body('hiddenTestCases').isArray().withMessage('Hidden test cases must be an array'),
  body('startCode').isString().withMessage('Start code must be a string'),
  body('solutionCode').isString().withMessage('Solution code must be a string'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
];
