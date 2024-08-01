const staffAccess = []; // Simulate staff access list

// Fetch the list of staff with access
const getStaffAccessList = async () => {
  return staffAccess;
};

// Remove staff access
const removeStaffAccess = async (staffId) => {
  const index = staffAccess.findIndex(staff => staff._id === staffId);
  if (index > -1) {
    staffAccess.splice(index, 1);
  } else {
    throw new Error('Staff not found');
  }
};

module.exports = { getStaffAccessList, removeStaffAccess };
