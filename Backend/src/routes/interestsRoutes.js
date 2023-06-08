const express = require("express");
const { availableRooms } = require("../utils/user");
const router = express.Router();

router.get("/interests", (req, res) => {
  try {
    const interests = availableRooms();
    res.status(200).send(interests);
  } catch (err) {
    res.status(404).send("somthing went wrong");
  }
});
router.post("/createInterest", (req, res) => {
  try {
    const interests = availableRooms();
    const existingInterest = interests.findIndex(
      (value) => value === req.body.roomName
    );
    // console.log(interests, req.body, existingInterest);
    if (existingInterest !== -1) {
      throw { message: "This Room Is Already In Use.", status: 502 };
    }
    res.status(200).send(interests);
  } catch (err) {
    console.log(err);
    res.status(err.status || 404).send(err);
  }
});
module.exports = router;
