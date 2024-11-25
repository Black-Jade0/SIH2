import axios from 'axios';
import React, { useState } from 'react';
import {BACKENDBASEURL} from "../config"
const UploadPageUser = () => {
    const [file, setFile] = useState(null);
    const [infoFile, setInfoFile] = useState({
        subject:"",
        level:""
    });

    const handleInfoChange = (e,key) => {
        setInfoFile({...infoFile,
            [key]: e.target.value
        })
    }

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
        formData.append('infoFile', JSON.stringify(infoFile)); // Add the state variable
        
        try {
            const response = await axios.post(BACKENDBASEURL+'/user/uploadforevalv1',formData,{
                withCredentials: true,
            })
            
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            console.log("infofile: ",JSON.stringify(infoFile))
        }
    };
    return <div>
    <form onSubmit={handleSubmit}>
            <div style={{margin:"4"}}>
                <h2>Upload Answers</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} style={{margin:"1"}} />
            <input type="text" placeholder='subject' onChange={(e)=>{handleInfoChange(e,"subject")}} style={{margin:"1"}} />
            <input type="text" placeholder='level' onChange={(e)=>{handleInfoChange(e,"level")}} style={{margin:"1"}}/>
            <button type="submit" style={{margin:"2"}}>Upload</button>
            </div>
        </form>
    </div>
};

export default UploadPageUser;