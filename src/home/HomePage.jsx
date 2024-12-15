import React from 'react';
import { FaRegChartBar, FaAccessibleIcon, FaBrain } from 'react-icons/fa';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { GiTeacher } from 'react-icons/gi';

const HomePage = () => {
  return (
    <section className="flex-shrink-0 w-full box-border h-screen flex items-center justify-center px-6 lg:px-10">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
        {/* Left Side: Introduction */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Revolutionize Your Skill Assessment
          </h1>
          <p className="text-lg mb-8">
            Our AI-powered assessment tool evaluates candidates across various skill levels, including students, Persons with Disabilities (PWD), and vocational learners. Experience the future of skill evaluation.
          </p>
          <button className="bg-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-200 transition duration-300">
            Get Started
          </button>
        </div>

        {/* Right Side: Diagrams & Features */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 rounded-lg shadow-lg">
              <FaRegChartBar className="text-4xl mb-4" />
              <h2 className="text-xl font-semibold mb-2">Comprehensive Evaluation</h2>
              <p className="text-base">
                Assess a wide spectrum of skills and competencies with our holistic approach.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center bg-blue-500 p-6 rounded-lg shadow-lg">
              <AiOutlineUsergroupAdd className="text-4xl mb-4" />
              <h2 className="text-xl font-semibold mb-2">Inclusive for All</h2>
              <p className="text-base">
                Designed with accessibility features for Persons with Disabilities (PWD).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center bg-blue-500 p-6 rounded-lg shadow-lg">
              <FaBrain className="text-4xl mb-4" />
              <h2 className="text-xl font-semibold mb-2">AI-Powered Personalization</h2>
              <p className="text-base">
                Adaptive assessments tailored to individual skill levels and learning needs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center bg-blue-500 p-6 rounded-lg shadow-lg">
              <GiTeacher className="text-4xl mb-4" />
              <h2 className="text-xl font-semibold mb-2">Real-Time Analytics</h2>
              <p className="text-base">
                Detailed feedback and analytics to enhance learning outcomes and effectiveness.
              </p>
            </div>
          </div>

          {/* Diagrams or Additional Visual Content */}
          <div className="relative flex items-center justify-center">
            <img src="https://d3lkc3n5th01x7.cloudfront.net/wp-content/uploads/2023/04/24222707/ai-in-education-2-1.png" 
            alt="Assessment Flow" 
            className="w-full max-w-md rounded-lg shadow-xl mb-3 p-7" />
            {/* You can also use SVG diagrams or other visual aids here */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
