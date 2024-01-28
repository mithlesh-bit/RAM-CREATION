const express = require("express");
const path = require("path");
const staticPath = path.join(__dirname, "../../public");
const contactSchema = require("../models/contactSchema");
const listSchema = require("../models/listSchema");
const adminSchema = require("../models/adminSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../cloudinary");
const image = require("../models/imageSchema");
const imageSchema = require("../models/imageSchema");

//images and pricing part

exports.index = async (req, res) => {
  try {
    let user = null;
    const token = req.cookies.jwt;

    if (token) {
      const verify = jwt.verify(token, process.env.secretkey);
      user = await adminSchema.findOne({ _id: verify._id });
    }

    const data = await imageSchema.find({});

    return res.render("index", {
      data: data,
      userName: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


//contact form home

exports.contactPost = async (req, resp) => {
  const currentDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const indianDate = currentDate.split(" ").slice(0, 4).join(" ");

  try {
    const contactData = new contactSchema({
      ...req.body,
      date: indianDate,
    });

    const contact = await contactData.save();
    resp.status(200).json({ success: true, message: "We will contact you soon", contact });
  } catch (error) {
    console.error(error);
    resp.status(500).send("Some Error occurred");
  }
};


//add home data

// exports.addData = async (req, res) => {
//   try {
//     res.render("addData");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };


// exports.addSection = async (req, res) => {
//   const options = await imageSchema.find({});
//   res.render("addsection", { options });
// };

exports.admin = async (req, res) => {
  try {

    const data = await imageSchema.find({});
    res.render("admin", {
      data: data,
      admin: req.user,

    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


exports.message = async (req, res) => {
  try {
    const messages = await contactSchema.find({}).sort({ createdAt: -1 });

    res.render("message", {
      messages: messages,

    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
// addData post
exports.addDataPost = async (req, res) => {
  try {
    // Function to handle image upload and database entry
    const handleImageUpload = async (file) => {
      const uploadResult = await cloudinary.uploader.upload(file.path);

      const newImage = new imageSchema({
        title: req.body.title,
        amount: req.body.amount,
        description: req.body.description,
        images: uploadResult.secure_url,
        lastUpdate: indianDate,
        youtubelink: req.body.youtubelink || "",
      });

      await newImage.save();
    };

    // Generate current Indian date once
    let currentDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    let indianDate = currentDate.split(" ").slice(0, 4).join(" ");

    if (req.file) {
      if (Array.isArray(req.file)) {
        // Handle multiple files
        await Promise.all(req.file.map(file => handleImageUpload(file)));
      } else {
        // Handle single file
        await handleImageUpload(req.file);
      }
      return res.redirect(req.file.length > 1 ? "/addSection" : "/admin");
    } else {
      return res.status(400).send("No image file provided");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Something went wrong during image upload");
  }
};



// login get

exports.login = async (req, res) => {
  res.render("login");
};

exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await adminSchema.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Email or Password" });
    }

    const token = await user.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 5259600000), // 2 months
      httpOnly: true,
      sameSite: "Strict",
    });

    res.status(200).json({ success: true, message: "Successfully Logged In" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



exports.photos = async (req, res) => {
  try {
    const link = await imageSchema.find({ _id: req.params.id });
    const data = await listSchema.find({ thumbnail_id: req.params.id });

    res.render("photos", { data, link });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.update = async (req, res) => {
  try {
    const data = await imageSchema.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }
    const updatedData = await imageSchema.updateOne({ _id: id }, { $set: {} });
    res.render("photos", { data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await adminSchema.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // Assuming bcrypt is used for hashing

    await user.save();
    res.json({ success: true, message: "User details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update user details" });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deletedPost = await imageSchema.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.json({
      success: true,
      message: `Post with ID ${postId} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete post" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, amount, description, youtubelink } = req.body;
    const post = await imageSchema.findById(req.params.id);
    const currentDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const indianDate = currentDate.split(" ").slice(0, 4).join(" ");

    if (post) {
      post.title = title || post.title;
      post.amount = amount || post.amount;
      post.description = description || post.description;
      post.lastUpdate = indianDate;
      post.youtubelink = youtubelink || post.youtubelink;
      await post.save();

      res.json({ success: true, message: "Post updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Post not found" });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
};


exports.logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ success: false, message: "Failed to log out" });
  }
};


exports.metadata = async (req, res) => {
  try {


  } catch (error) {
    console.error("Error:", error);
    return res.status(300).send("Something went wrong");
  }
};

exports.more = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await imageSchema.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }
    res.json({ success: true, result });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch data" });
  }
};


exports.morePage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await listSchema.find({ thumbnail_id: id });
    if (data.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found' });
    }
    res.render('more', { data });
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).json({ success: false, message: 'Failed to render page' });
  }
};


exports.morePagePost = async (req, res) => {
  try {
    const { dynamicData } = req.body;
    // Handle both single and multiple file uploads
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path);
      const newCreation = new listSchema({
        thumbnail_id: dynamicData,
        links: result.secure_url,
      });
      await newCreation.save();
    }

    return res.status(200).json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    return res.status(500).json({ success: false, message: 'Failed to save data' });
  }
};



exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await listSchema.findById(id);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await listSchema.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};




