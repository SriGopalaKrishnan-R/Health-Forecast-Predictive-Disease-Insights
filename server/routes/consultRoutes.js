const express = require('express');
const router = express.Router();
const { getSpecialist, getMedicine, getDoctors } = require('../controllers/consultController');

router.get('/specialist', getSpecialist);
router.get('/medicine', getMedicine);
router.get('/doctors', getDoctors);

module.exports = router;
