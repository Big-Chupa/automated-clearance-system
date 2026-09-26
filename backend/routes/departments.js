const express = require('express');
const Department = require('../models/Department');
const { requireAuth, requireRoles } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireRoles('ADMIN'));
router.get('/', async (req, res, next) => {
  try { return res.json({ departments: await Department.find().lean() }); } catch (error) { return next(error); }
});
router.post('/', async (req, res, next) => {
  try { return res.status(201).json({ department: await Department.create(req.body) }); } catch (error) { return next(error); }
});
router.put('/:id', async (req, res, next) => {
  try { const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); return department ? res.json({ department }) : res.status(404).json({ message: 'Department not found.' }); } catch (error) { return next(error); }
});
module.exports = router;
