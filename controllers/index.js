const express = require("express");
const  {loginService, signUpService} =require('../services');
const jwt = require('jsonwebtoken');

const folderName = "/home/sakshi/MainProjectIW/frontend/public/pdf";
const fs = require('fs');
const pdfPath = "/home/sakshi/MainProjectIW/frontend/public/pdf /dummy.pdf";

const emailRegex = /^[^\d][a-zA-Z\d.-][a-zA-Z][a-zA-Z\d.-]@([a-zA-Z\d.-]+\.[a-zA-Z]{2,})$/;
const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@])[a-zA-Z\d@]+$/;



const verifyToken = (req, res, next) => {
    secretkey='389377947473';
    const myToken = req.cookies.myToken;

    console.log("myToken",myToken);
    if (!myToken) {
        return res.status(401).send("User not authenticated");
    }

    jwt.verify(myToken, secretkey, (err, payload) => {                                                  
        if (err) {
            // Token verification failed
            console.error("JWT verification error:", err);
            return res.status(403).send("Token verification failed");
        }

        if (!payload) {
            // Invalid token
            return res.status(401).send("User not authenticated");
        }

        console.log("Payload:", payload);
        req.email= payload.email; 
        req.password=payload.password;
        
    });
};

    
    const signUpController=async(req,res)=>{
    const {name, email ,  password} =req.body;
    try {
        
        
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.send({
                status: 0,
                sucess: false,
                message: "empty input",
                result: {}
            })
        }


        else if (!emailRegex.test(email)) {
            return res.send({
                status: 0,
                sucess: false,
                message: "enter a valid email.",
                result: {}
            })
        }

        else if (password.length <=6) {
            return res.send({
                status: 0,
                sucess: false,
                message: "Password length should be greater than 6.",
                result: {}
            })
        }

        else if (!passwordRegex.test(password)) {
            return res.send({
                status: 0,
                sucess: false,
                message: "password should follow the pattern ",
                result: {}
            })
        }

        else {
            const signupData = { name, email, password };
            const result = await signUpService(signupData);

        }
    }
    catch(error){
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        console.log(res);
  
        }
}

const loginController=async(req,res)=>{  
    debugger
    try{
    const { email, password } = req.body;
        
    if (!email || !password) {
        return res.send({
            status: 0,
            success: false,
            message: "Please enter email or password",
            result: {},
        });
    }

    else if (!emailRegex.test(email)) {
        return res.send({
            status: 0,
            sucess: false,
            message: "Email must contain atleast one letter, @ special character and it doesn't start with number.",
            result: {}
        })
    }

    else {
        const loginData = {email, password};
        const result = await loginService(loginData); // Calling login services

        if (result && result.length == 0) {
            throw new Error("Wrong Email")
        }

        // For successfull login
        else {

            const secretKey = '389377947473';
            const token = jwt.sign(loginData, secretKey, { expiresIn: '30s' }); 
            console.log('JWT token:', token);
            res.cookie('myToken', token, {httpOnly: true });
            


            res.send({
                status: 1,
                success: true,
                message: "Successfully Login",
                result,
            }); 
        }
    }

}
 catch (error) { // error handling
    console.log(error);
    if (error.message == "Wrong Email")
    {
        return res.send({
            status: 0,
            success: false,
            message: "User doesn't exist!! Please Register",
            result: {},
        });
    }
    else if(error.message == "Please enter the correct password")
    {
        return res.send({
            status: 0,
            success: false,
            message: "Wrong Password",
            result: {},
        });
    }
    else{
        return res.send({
            status: 0,
            success: false,
            message: "Error in Login controller",
            result: {},
        });
    }
}
    };

const policyController = async (req, res) => {
    try {
        const policies = await fs.promises.readdir(folderName);
        
        const policyData = policies.map((policy, index) => ({
            id: index + 1,
            name: policy
        }));

        return res.send({
            success: true,
            status: 1,
            message: "Successfully get PolicyDocs Data",
            policyData
        });
    } catch (error) {
        console.log(error);
        return res.send({
            success: false,
            status: 0,
            message: "Error in Policy Docs Controller"
        });
    }
};


const getPolicy  = async(req,res) =>{
    try{
        return res.send({
            success: true,
            status: 1,
            message: "Pdf path",
            result : pdfPath
        });
    }
    catch (error) {
        console.log(error);
        return res.send({
            success: false,
            status: 0,
            message: "Error in Get Policy Controller"
        });
    }
    
}

module.exports={
    signUpController,
    loginController,
    verifyToken,
    policyController,
    getPolicy
}




