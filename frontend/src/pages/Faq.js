import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqsList = [
    {
      q: "Who should use this platform?",
      a: "This platform is designed for both staff and doctors at Saanjh Sahayak. Staff members can upload, edit, and manage patient health records, while doctors can review these records and provide necessary feedback or medical reviews.",
    },
    {
      q: "How do I log in to the platform?",
      a: "You can log in to the platform by clicking the 'Sign In' button on the top right corner of the homepage. Staff and doctors will have separate login credentials. If you do not have an account, please contact the administrator.",
    },
    {
      q: "How can I upload a new patient's health record?",
      a: "To upload a new patient’s health record, log in to your staff account, navigate to the 'Upload Record' section, fill in the required patient information, and upload any relevant documents or images. Click 'Submit' to save the record.",
    },
    {
      q: "Can I edit a patient's health record after uploading it?",
      a: "Yes, as a staff member, you can edit a patient’s health record. Navigate to the 'Patient Records' section, select the patient you wish to edit, make the necessary changes, and save the updates.",
    },
    {
      q: "How do I check the health records of a patient?",
      a: "To check the health records of a patient, log in to your staff account and go to the 'Patient Records' section. You can search for the patient by name or ID and view their detailed health history and records.",
    },
    {
      q: "How do I contact support if I encounter an issue?",
      a: "If you encounter any issues while using the platform, please contact our support team through the 'Contact Us' section on the website. Provide a detailed description of the issue, and our team will assist you as soon as possible.",
    },
  ];

  const handleToggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="leading-relaxed mt-12 mx-4 md:mx-8">
      <div className="text-center space-y-3">
        <h1 className="text-gray-800 text-3xl font-semibold">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Answered all frequently asked questions. Can’t find the answer you’re
          looking for? Feel free to contact us.
        </p>
      </div>
      <div className="relative bg-white rounded-md mt-10 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl sm:mx-auto shadow-md">
        <div className="space-y-4 py-8">
          {faqsList.map((item, idx) => (
            <div key={idx} className="border-b border-gray-200">
              <div
                onClick={() => handleToggle(idx)}
                className="flex items-center justify-between cursor-pointer px-6 py-4 hover:bg-gray-100 transition-all duration-300"
              >
                <h4 className="text-gray-800 text-xl font-semibold">
                  {item.q}
                </h4>
                <span
                  className={`transition-transform duration-300 ${
                    activeIndex === idx ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </div>
              <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden px-6 ${
                  activeIndex === idx ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="text-gray-500">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
