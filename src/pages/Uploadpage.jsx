import axios from 'axios';
import React, { useState } from 'react';

const UploadPdf = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);
        
        try {
            const response = await axios.post('http://localhost:3000/edu/upload',formData,{
                withCredentials: true,
            })
            
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
};

export default UploadPdf;
