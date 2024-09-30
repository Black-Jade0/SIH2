// import React, { useState } from 'react';
// import { FaRegQuestionCircle, FaEdit, FaClock, FaUpload } from 'react-icons/fa';
// import { MdAccessibility, MdModeEdit } from 'react-icons/md';

// const AssessmentCreation = () => {
//   const [formData, setFormData] = useState({
//     assessmentType: '',
//     mode: '',
//     difficulty: '',
//     inclusivity: '',
//     content: '',
//     duration: '',
//     settings: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic
//     console.log(formData);
//   };

//   return (
//     <section className="w-screen h-screen flex flex-col items-center justify-start bg-gray-100 p-6 lg:p-10">
//       <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 mb-6">
//         <h1 className="text-3xl font-extrabold mb-6 text-center">Create New Assessment</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Assessment Type */}
//           <div className="flex flex-col md:flex-row items-start gap-6">
//             <div className="flex flex-col w-full">
//               <label className="text-lg font-medium mb-2">Choose Assessment Type</label>
//               <select
//                 name="assessmentType"
//                 value={formData.assessmentType}
//                 onChange={handleChange}
//                 className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Type</option>
//                 <option value="MCQ">MCQ</option>
//                 <option value="Descriptive">Descriptive</option>
//                 <option value="Practical">Practical</option>
//                 <option value="Viva Voce">Viva Voce</option>
//               </select>
//             </div>
            
//             {/* Assessment Mode */}
//             <div className="flex flex-col w-full">
//               <label className="text-lg font-medium mb-2">Assessment Mode</label>
//               <select
//                 name="mode"
//                 value={formData.mode}
//                 onChange={handleChange}
//                 className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Mode</option>
//                 <option value="Online">Online</option>
//                 <option value="Offline">Offline</option>
//                 <option value="Blended">Blended</option>
//               </select>
//             </div>
//           </div>

//           {/* Difficulty Level */}
//           <div className="flex flex-col">
//             <label className="text-lg font-medium mb-2">Difficulty Level</label>
//             <select
//               name="difficulty"
//               value={formData.difficulty}
//               onChange={handleChange}
//               className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Difficulty</option>
//               <option value="Easy">Easy</option>
//               <option value="Medium">Medium</option>
//               <option value="Hard">Hard</option>
//             </select>
//           </div>

//           {/* Inclusivity Options */}
//           <div className="flex flex-col">
//             <label className="text-lg font-medium mb-2">Inclusivity Options</label>
//             <select
//               name="inclusivity"
//               value={formData.inclusivity}
//               onChange={handleChange}
//               className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Inclusivity Options</option>
//               <option value="Voice-to-Text">Voice-to-Text</option>
//               <option value="Text-to-Speech">Text-to-Speech</option>
//               <option value="Alternative Input Methods">Alternative Input Methods</option>
//               <option value="Customizable Formats">Customizable Formats</option>
//             </select>
//           </div>

//           {/* Assessment Content */}
//           <div className="flex flex-col">
//             <label className="text-lg font-medium mb-2">Assessment Content</label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               placeholder="Upload questions, instructions, guidelines"
//               className="bg-gray-100 border border-gray-300 rounded-lg p-3 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Exam Duration & Settings */}
//           <div className="flex flex-col md:flex-row items-start gap-6">
//             <div className="flex flex-col w-full">
//               <label className="text-lg font-medium mb-2">Exam Duration</label>
//               <input
//                 type="text"
//                 name="duration"
//                 value={formData.duration}
//                 onChange={handleChange}
//                 placeholder="e.g., 90 minutes"
//                 className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
            
//             <div className="flex flex-col w-full">
//               <label className="text-lg font-medium mb-2">Settings</label>
//               <input
//                 type="text"
//                 name="settings"
//                 value={formData.settings}
//                 onChange={handleChange}
//                 placeholder="e.g., Time limits, randomization"
//                 className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 w-full ">
//             Create Assessment
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default AssessmentCreation;


import React from 'react';

const AssessmentCreation = () => {
  return (
    <section className="w-full box-border h-auto bg-gray-100 p-4 lg:p-6 overflow-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Assessment</h1>
        
        <form>
          {/* Form Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
            <select className="block w-full p-2 border border-gray-300 rounded-lg">
              <option>MCQ</option>
              <option>Descriptive</option>
              <option>Practical</option>
              <option>Viva Voce</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Mode</label>
            <select className="block w-full p-2 border border-gray-300 rounded-lg">
              <option>Online</option>
              <option>Offline</option>
              <option>Blended</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <input type="range" min="1" max="5" className="w-full" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Inclusivity Options</label>
            <input type="text" className="block w-full p-2 border border-gray-300 rounded-lg" placeholder="Accessibility features" />
          </div>
          {/* <div
           {/* <select
              name="inclusivity"
              value={formData.inclusivity}
              onChange={handleChange} */}
            
              {/* <option value="">Select Inclusivity Options</option>
              <option value="Voice-to-Text">Voice-to-Text</option>
              <option value="Text-to-Speech">Text-to-Speech</option>
              <option value="Alternative Input Methods">Alternative Input Methods</option>
              <option value="Customizable Formats">Customizable Formats</option> */}
            {/* </select> */}
        {/* </form> </div> */} */
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Content</label>
            <textarea className="block w-full p-2 border border-gray-300 rounded-lg" rows="4" placeholder="Upload questions, instructions, guidelines"></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Duration & Settings</label>
            <input type="text" className="block w-full p-2 border border-gray-300 rounded-lg" placeholder="Set duration and other settings" />
          </div>
          
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
            Create Assessment
          </button>
        </form>
      </div>
    </section>
  );
};

export default AssessmentCreation;
