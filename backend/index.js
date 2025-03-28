import express from 'express';

const app = express();

app.use("/api/auth", authRoutes)
app.listen(5001, ()=>{
    console.log("Server is running at port 5001");
    
})