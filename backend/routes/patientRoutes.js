
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Otp = require('../models/Otp');
const Patient = require("../models/patient");
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require('../middleware/roleMiddleware');
const { generateOtp, verifyOtp } = require('../middleware/otpController.js');
const { exec } = require("child_process");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Function to get stored OTP


// Add a new patient with health records
const summarizeFiles = (files) => {
  return new Promise((resolve, reject) => {
    const summarizerScriptPath = path.join(__dirname, '../summarizer.py');
    const summarizer = exec(`python ${summarizerScriptPath}`);

    // Prepare input JSON for the Python script
    const inputJson = JSON.stringify({ healthRecords: files.map(file => ({
      filename: file.filename,
      mimetype: file.mimetype,
    })) });

    summarizer.stdin.write(inputJson);
    summarizer.stdin.end();

    let rawOutput = '';

    summarizer.stdout.on('data', (data) => {
      rawOutput += data.toString();
    });

    summarizer.stderr.on('data', (data) => {
      reject(`Error executing summarizer script: ${data}`);
    });

    summarizer.on('close', (code) => {
      if (code === 0) {
        try {
          const parsedOutput = JSON.parse(rawOutput.trim());
          if (parsedOutput.error) {
            reject(parsedOutput.error);
          } else {
            resolve(parsedOutput.summary);
          }
        } catch (e) {
          reject(`Error parsing summarizer output: ${rawOutput}`);
        }
      } else {
        reject(`Summarizer script exited with code ${code}`);
      }
    });
  });
};

router.post("/", verifyToken, upload.array('healthRecords'), async (req, res) => {
  try {
    const { name, age, gender, address, contactNumber } = req.body;
    const userId = req.user.id; // Extract user ID from token

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Prepare health records data
    const healthRecordsData = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    }));

    // Summarize health records
    const summary = await summarizeFiles(req.files);

    // Create and save the new patient record with the summary
    const newPatient = new Patient({
      name,
      age,
      gender,
      address,
      contactNumber,
      user_id: userId,
      healthRecords: healthRecordsData,
      summary, // Save the generated summary
    });

    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
// router.post("/", verifyToken, upload.array('healthRecords'), async (req, res) => {
//   try {
//     const { name, age, gender, address, contactNumber } = req.body;
//     const userId = req.user.id; // Extract user ID from token

//     // Check if files are uploaded
//     if (!req.files) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     // Prepare the health records data for summarization
//     const healthRecordsData = req.files.map((file) => ({
//       filename: file.filename,
//       path: file.path,
//       mimetype: file.mimetype,
//     }));

//     // Call the Python summarizer script
//     const summarizerScriptPath = path.join(__dirname, "../summarizer.py");
//     const summarizer = exec(`python ${summarizerScriptPath}`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error executing summarizer script: ${error}`);
//         return res.status(500).json({ error: 'Error generating summary' });
//       }

//       const summary = stdout.trim(); // Get the summary from script output

//       // Create and save the new patient record with the summary
//       const newPatient = new Patient({
//         name,
//         age,
//         gender,
//         address,
//         contactNumber,
//         user_id: userId,
//         healthRecords: healthRecordsData,
//         summary, // Save the generated summary
//       });

//       newPatient.save()
//         .then(savedPatient => res.status(201).json(savedPatient))
//         .catch(err => {
//           console.error(`Error saving patient record: ${err}`);
//           res.status(500).json({ error: err.message });
//         });
//     });

//     // Send input JSON to Python script
//     summarizer.stdin.write(JSON.stringify({ healthRecords: healthRecordsData }));
//     summarizer.stdin.end();

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });
// router.post("/", verifyToken, upload.array('healthRecords'), async (req, res) => {
//   try {
//     const { name, age, gender, address, contactNumber } = req.body;
//     const userId = req.user.id; // Extract user ID from token

//     // Check if files are uploaded
//     if (!req.files) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     const newPatient = new Patient({
//       name,
//       age,
//       gender,
//       address,
//       contactNumber,
//       user_id: userId, // Save user ID with the patient record
//       healthRecords: req.files.map((file) => ({
//         filename: file.filename,
//         path: file.path, // Save the path correctly
//         mimetype: file.mimetype,
//       })),
//     });

//     const savedPatient = await newPatient.save();
//     res.status(201).json(savedPatient);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });


router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from the token payload
    const patients = await Patient.find({ user_id: userId }); // Filter patients by user_id
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to get patients for a specific user_id (for doctors to fetch verified staff data)
router.get('/patients', verifyToken, async (req, res) => {
  const { user_id } = req.query;

  try {
    // Fetch patients associated with the given user_id
    const patients = await Patient.find({ user_id: user_id });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Remove staff from verified list
router.delete('/remove-staff/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    // Ensure the user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Find the doctor record and remove the staff ID
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (doctor) {
      doctor.verifiedStaffIds = doctor.verifiedStaffIds.filter(id => id.toString() !== userId);
      await doctor.save();
    }

    res.json({ msg: 'Staff removed successfully' });
  } catch (error) {
    console.error('Error removing staff:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});
// Serve file by filename
router.get('/files/:filename', (req, res) => {
  const { patientId, filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ msg: 'File not found' });
    }
    res.sendFile(filePath);
  });
});
// Route to update patient details
router.put('/:id', verifyToken, roleMiddleware(['staff']), async (req, res) => {
  const { name, age, gender, address, contactNumber } = req.body;

  try {
    // Find and update the patient by ID
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, address, contactNumber },
      { new: true } // Return the updated document
    );

    if (!updatedPatient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to add a file to a patient's record
// router.post('/:id/files', verifyToken, roleMiddleware(['staff']), upload.single('file'), async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.params.id);
//     if (!patient) {
//       return res.status(404).json({ msg: 'Patient not found' });
//     }

//     // Add new file details to patient's healthRecords array
//     patient.healthRecords.push({
//       filename: req.file.filename,
//       path: req.file.path,
//       mimetype: req.file.mimetype
//     });

//     await patient.save();

//     res.status(201).json(patient);
//   } catch (error) {
//     console.error('Error adding file:', error.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });
router.post('/:id/files', verifyToken, roleMiddleware(['staff']), upload.single('file'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    // Add new file details to patient's healthRecords array
    patient.healthRecords.push({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype
    });

    // Save patient record with new file
    await patient.save();

    // Summarize all health records
    const summary = await summarizeFiles(patient.healthRecords);

    // Update patient record with new summary
    patient.summary = summary; // Update summary field
    await patient.save();

    res.status(201).json(patient);
  } catch (error) {
    console.error('Error adding file:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});
// Route to delete a patient's record
router.delete('/:id', verifyToken, roleMiddleware(['staff']), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    // Delete all associated files from the server
    patient.healthRecords.forEach(file => {
      fs.unlink(path.join(__dirname, '..', 'uploads', file.filename), err => {
        if (err) {
          console.error('Error deleting file:', err.message);
        }
      });
    });

    // Delete the patient record
    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: 'Patient record deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to delete a file from a patient's record
router.delete('/:id/files/:filename', verifyToken, roleMiddleware(['staff']), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    // Find the file in the healthRecords array
    const fileIndex = patient.healthRecords.findIndex(file => file.filename === req.params.filename);
    if (fileIndex === -1) {
      return res.status(404).json({ msg: 'File not found' });
    }

    // Remove the file from the healthRecords array
    patient.healthRecords.splice(fileIndex, 1);
    await patient.save();

    // Delete the file from the server
    fs.unlink(path.join(__dirname, '..', 'uploads', req.params.filename), (err) => {
      if (err) {
        console.error('Error deleting file:', err.message);
        return res.status(500).json({ msg: 'Failed to delete file from server' });
      }

      res.status(200).json({ msg: 'File deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting file:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Route to generate OTP
router.post('/generate-otp', async (req, res) => {
  const { userId } = req.body;
  try {
    const otp = await generateOtp(userId);
    res.json({ otp });
  } catch (error) {
    res.status(500).json({ message: 'Error generating OTP' });
  }
});

// Route to verify OTP
router.post('/verify-otp', verifyToken, async (req, res) => {
  const { otp, userId } = req.body;
  try {
    // Ensure the user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Verify OTP (this is a placeholder; implement your actual OTP verification logic here)
    const isOtpValid =await verifyOtp(userId, otp); // Replace with actual OTP validation

    if (isOtpValid) {
      // Find or create doctor record
      let doctor = await Doctor.findOne({ userId: req.user.id });
      if (!doctor) {
        doctor = new Doctor({ userId: req.user.id, verifiedStaffIds: [] });
      }

      // Add staff ID to the verified list if not already present
      if (!doctor.verifiedStaffIds.includes(userId)) {
        doctor.verifiedStaffIds.push(userId);
        await doctor.save();
      }

      res.json({ msg: 'OTP verification successful' });
    } else {
      res.status(400).json({ msg: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});
// Get verified staff for doctor
router.get('/verified-staff', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Find doctor record and populate verified staff information
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate('verifiedStaffIds');
    
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    const verifiedStaff = doctor.verifiedStaffIds;
    res.json(verifiedStaff);
  } catch (error) {
    console.error('Error fetching verified staff:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});
// Get list of doctors who have verified the staff member

router.get('/verified', verifyToken, async (req, res) => {
  try {
    // Ensure the user is a staff member
    if (req.user.role !== 'staff') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const userId = req.user.id
    // Step 1: Find doctors whose `verifiedStaffIds` contains the current user's ID
    const doctors = await Doctor.find({ 
      verifiedStaffIds: userId 
    }).select('userId'); // Fetch only userId field to use in the next step

    console.log('Doctors retrieved:', doctors); // Log the retrieved doctors
    
    // Extract user IDs from doctors
    const doctorUserIds = doctors.map(doctor => doctor.userId);

    console.log('Doctor user IDs:', doctorUserIds); // Log the extracted user IDs

    // Step 2: Fetch user details for the IDs retrieved
    const users = await User.find({
      _id: { $in: doctorUserIds }
    }).select('username'); // Fetch only username field

    console.log('Users retrieved:', users); // Log the retrieved users

    // Format the response to include user IDs and usernames
    const doctorDetails = doctors.map(doctor => {
      const user = users.find(user => user._id.toString() === doctor.userId.toString());
      return {
        userId: doctor.userId,
        username: user ? user.username : 'Unknown'
      };
    });

    console.log('Formatted doctor details:', doctorDetails); // Log the formatted doctor details

    // Send the doctors list with usernames as a JSON response
    res.json(doctorDetails);
  } catch (error) {
    console.error('Error fetching doctors:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});



// Remove staff ID from doctor's verified list
router.post('/remove-staff', verifyToken, async (req, res) => {
  const { staffId, doctorId } = req.body; // Expecting staffId and doctorId in the request body

  try {
    // Ensure the user is a staff member
    if (req.user.role !== 'staff') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Step 1: Retrieve the user by staffId
    const user = await User.findById(staffId);
    
    
    const userId = user._id;
    console.log('User ID retrieved:', userId); // Log the retrieved user ID

    // Step 2: Find the doctor and check if userId is in the verifiedStaffIds
    const doctor = await Doctor.findOne({ _id: doctorId });
    
   

    console.log('Doctor details:', doctor); // Log the doctor document
    console.log('Doctor verifiedStaffIds:', doctor.verifiedStaffIds); // Log the verifiedStaffIds


    // Step 3: Remove the staffId from the specified doctor
    const result = await Doctor.updateOne(
      { _id: doctorId, verifiedStaffIds: userId }, // Find the specific doctor
      { $pull: { verifiedStaffIds: userId } } // Remove the staffId
    );

    console.log('Update result:', result); // Log the result of the update operation

    // Check if any documents were modified
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: 'No modification made' });
    }

    res.json({ msg: 'Staff ID removed from doctor' });
  } catch (error) {
    console.error('Error removing staff ID:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const Otp = require('../models/Otp');
// const Patient = require("../models/patient");
// const User = require('../models/User');
// const verifyToken = require("../middleware/verifyToken");
// const roleMiddleware = require('../middleware/roleMiddleware');
// const otpGenerator = require('otp-generator'); // Import otp-generator

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(__dirname, "../uploads");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/png",
//     "application/pdf",
//     "text/plain",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   ];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("File type not supported"), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// // Function to get stored OTP
// const getStoredOtp = async (userId) => {
//   try {
//     console.log('Fetching OTP for userId:', userId); // Debug log
//     const otpRecord = await Otp.findOne({ userId });
//     console.log('OTP record found:', otpRecord); // Debug log
//     if (!otpRecord) {
//       throw new Error('OTP not found');
//     }

//     if (otpRecord.expiresAt < new Date()) {
//       throw new Error('OTP has expired');
//     }

//     return otpRecord.otp;
//   } catch (error) {
//     console.error('Error retrieving stored OTP:', error.message);
//     throw error;
//   }
// };

// // Add a new patient with health records
// router.post("/", verifyToken, upload.array('healthRecords'), async (req, res) => {
//   try {
//     const { name, age, gender, address, contactNumber } = req.body;
//     const userId = req.user.id; // Extract user ID from token

//     // Check if files are uploaded
//     if (!req.files) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     const newPatient = new Patient({
//       name,
//       age,
//       gender,
//       address,
//       contactNumber,
//       user_id: userId, // Save user ID with the patient record
//       healthRecords: req.files.map((file) => ({
//         filename: file.filename,
//         path: file.path, // Save the path correctly
//         mimetype: file.mimetype,
//       })),
//     });

//     const savedPatient = await newPatient.save();
//     res.status(201).json(savedPatient);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Route to get patients for a specific user
// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id; // Extract userId from the token payload
//     const patients = await Patient.find({ user_id: userId }); // Filter patients by user_id
//     res.json(patients);
//   } catch (error) {
//     console.error('Error fetching patients:', error.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Serve file by filename
// router.get('/files/:filename', (req, res) => {
//   const { patientId, filename } = req.params;
//   const filePath = path.join(__dirname, '../uploads', filename);

//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(404).json({ msg: 'File not found' });
//     }
//     res.sendFile(filePath);
//   });
// });
// // Route to update patient details
// router.put('/:id', verifyToken, roleMiddleware(['staff']), async (req, res) => {
//   const { name, age, gender, address, contactNumber } = req.body;

//   try {
//     // Find and update the patient by ID
//     const updatedPatient = await Patient.findByIdAndUpdate(
//       req.params.id,
//       { name, age, gender, address, contactNumber },
//       { new: true } // Return the updated document
//     );

//     if (!updatedPatient) {
//       return res.status(404).json({ msg: 'Patient not found' });
//     }

//     res.json(updatedPatient);
//   } catch (error) {
//     console.error('Error updating patient:', error.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Route to add a file to a patient's record
// router.post('/:id/files', verifyToken, roleMiddleware(['staff']), upload.single('file'), async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.params.id);
//     if (!patient) {
//       return res.status(404).json({ msg: 'Patient not found' });
//     }

//     // Add new file details to patient's healthRecords array
//     patient.healthRecords.push({
//       filename: req.file.filename,
//       path: req.file.path,
//       mimetype: req.file.mimetype
//     });

//     await patient.save();

//     res.status(201).json(patient);
//   } catch (error) {
//     console.error('Error adding file:', error.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Route to delete a patient's record
// router.delete('/:id', verifyToken, roleMiddleware(['staff']), async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.params.id);
//     if (!patient) {
//       return res.status(404).json({ msg: 'Patient not found' });
//     }

//     // Delete all associated files from the server
//     patient.healthRecords.forEach(file => {
//       fs.unlink(path.join(__dirname, '..', 'uploads', file.filename), err => {
//         if (err) {
//           console.error('Error deleting file:', err.message);
//         }
//       });
//     });

//     // Delete the patient record
//     await Patient.findByIdAndDelete(req.params.id);

//     res.status(200).json({ msg: 'Patient record deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting patient:', error.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Route to delete a file from a patient's record
// router.delete('/:id/files/:filename', verifyToken, roleMiddleware(['staff']), async (req, res) => {
//   try {
//     const patient = await Patient.findById(req.params.id);
//     if (!patient) {
//       return res.status(404).json({ msg: 'Patient not found' });
//     }

//     // Find the file in the healthRecords array
//     const fileIndex = patient.healthRecords.findIndex(file => file.filename === req.params.filename);
//     if (fileIndex === -1) {
//       return res.status(404).json({ msg: 'File not found' });
//     }

//     // Remove the file from the healthRecords array
//     patient.healthRecords.splice(fileIndex, 1);
//     await patient.save();

//     // Delete the file from the server
//     fs.unlink(path.join(__dirname, '..', 'uploads', req.params.filename), (err) => {
//       if (err) {
//         console.error('Error deleting file:', err.message);
//         return res.status(500).json({ msg: 'Failed to delete file from server' });
//       }

//       res.status(200).json({ msg: 'File deleted successfully' });
//     });
//   } catch (error) {
//     console.error('Error deleting file:', error.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Route to generate OTP
// router.post('/generate-otp', verifyToken, async (req, res) => {
//   // Ensure only staff can generate OTP
//   if (req.user.role !== 'staff') {
//     return res.status(403).json({ msg: 'Permission denied' });
//   }

//   try {
//     const userId = req.user.id; // Get user ID from authentication middleware

//     // Generate a 6-digit OTP
//     const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });

//     // Save the OTP and user ID in the database
//     await Otp.create({ userId, otp, expiresAt: new Date(Date.now() + 10 * 60000) }); // OTP expires in 10 minutes

//     res.json({ otp });
//   } catch (error) {
//     console.error('Generate OTP Error:', error.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// // Route to verify OTP
// router.post('/verify-otp', async (req, res) => {
//   const { otp, userId } = req.body;

//   console.log('Received OTP:', otp, 'for userId:', userId);

//   try {
//     if (!otp || !userId) {
//       return res.status(400).json({ msg: 'OTP and userId are required' });
//     }

//     const storedOtp = await getStoredOtp(userId);

//     if (otp !== storedOtp) {
//       return res.status(400).json({ msg: 'Invalid OTP' });
//     }

//     // OTP is valid
//     res.json({ msg: 'OTP verified successfully' });
//   } catch (error) {
//     console.error('Verify OTP Error:', error.message);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// });

// module.exports = router;
