const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/Chatapp",{
});
const chatSchema = new mongoose.Schema({
    roomname : {
      type : String
    },
    chats : {
       type: [Object],
       default: []
    }
  });
  
const Chat = mongoose.model('Chat', chatSchema);

app.post('/store_chat', async (req,res) => {
    const {room_name , chats} = req.body;
    try{
        let has = Chat.findOne({room_name});
        if(!has)
        {
            has = new Chat({room_name});
        }
        has.Chat.push({chats});
        res.send("Succesfully added");
    }
    catch (err){
        console.log(err);
    }
})


app.listen(9000 , () => {
    console.log("Server running...");
})