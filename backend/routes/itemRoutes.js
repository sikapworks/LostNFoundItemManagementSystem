const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const auth = require("../middleware/authMiddleware");

//add item
router.post("/items", auth, async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      user: req.user
    });

    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get all items
router.get("/items", async (req, res) => {
  const items = await Item.find().populate("user", "name email");
  res.json(items);
});

//get item by id
router.get("/items/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.json(item);
});

//update item
router.put("/items/:id", auth, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item.user.toString() !== req.user) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

//delete item
router.delete("/items/:id", auth, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item.user.toString() !== req.user) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  await item.deleteOne();
  res.json({ msg: "Item deleted" });
});

//search item
router.get("/items/search", async (req, res) => {
  const { name } = req.query;

  const items = await Item.find({
    itemName: { $regex: name, $options: "i" }
  });

  res.json(items);
});

module.exports = router;