const express = require('express');
const cors = require("cors")
const app = express();
require('dotenv').config()
const {Web3} = require("web3");
const ABI = require("./ABI.json")

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000;
const contractAddress = "0xa16aa576F21B67F7e882EB391D432e1FA75cDf7A";

let contract;

const getContract = () => {
   if (contract) return contract;

   const apiKey = process.env.API_KEY;
   if (!apiKey) {
      throw new Error("Missing API_KEY. Add a rotated Alchemy key to the service environment.");
   }

   const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`);
   contract = new web3.eth.Contract(ABI, contractAddress);
   return contract;
};

const genderVerification = (gender)=>{
   if (typeof gender !== "string") return false;
   const genderData = gender.toLowerCase();
   if(genderData==="male" || genderData==="female" || genderData==="others"){
     return true;
   }else{
     return false;
   }
}

const partyClashStatus=async(party)=>{
   const contract = getContract();
   const candidateInfo = await contract.methods.candidateList().call();
   const exists = candidateInfo.some((candidate)=>candidate.party===party);
   return exists;
}

const isValidVotingWindow = (startTimeSeconds, endTimeSeconds) => {
   if (!Number.isFinite(startTimeSeconds) || !Number.isFinite(endTimeSeconds)) return false;
   const duration = endTimeSeconds - startTimeSeconds;
   return duration > 0 && duration < 86400;
};

app.get("/health", (_req, res) => {
   res.status(200).json({ status: "ok" });
});

app.post("/api/voter-verification",(req,res)=>{
    const {gender} = req.body;
    const status = genderVerification(gender)
    if(status){
       res.status(200).json({message:"Gender Valid"})
    }else{
        res.status(403).json({message:"Gender Invalid"})
    } 
})

app.post("/api/time-bound",(req,res)=>{
    const {startTimeSeconds,endTimeSeconds}=req.body;
    if(isValidVotingWindow(startTimeSeconds, endTimeSeconds)){
        res.status(200).json({message:"Voting Timer Started"})
    }else{
        res.status(403).json({message:"Voting Time Must Be Less Than 24 hours"})
    }
})

app.post("/api/candidate-verification",async(req,res)=>{
    const {gender,party}=req.body;
    try {
        const partyStatus = await partyClashStatus(party);
        const genderStatus = genderVerification(gender);

        if(genderStatus===true && partyStatus!==true){
            res.status(200).json({message:"Gender and Party Are Valid"})
        }else{
            res.status(403).json({message:"Either Party Name or Gender is not valid"})
        }
    } catch (error) {
        console.error("Candidate validation failed:", error.message);
        res.status(502).json({message:"Blockchain provider is unavailable"});
    }
})

if (require.main === module) {
    try {
        getContract();
        app.listen(PORT, "0.0.0.0", ()=>{
            console.log(`Server is running at ${PORT}`)
        })
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { app, genderVerification, isValidVotingWindow };
