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
    const token = req.cookies.jwt;
    if (token) {
      const verify = jwt.verify(token, process.env.secretKey);
      const user = await adminSchema.findOne({ _id: verify._id });

      const data = await imageSchema.find({});
      return res.render("index", {
        data: data,
        userName: user,
      });
    }
    const data = await imageSchema.find({});
    let user;
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
  const name = req.body.name;
  const number = req.body.number;
  const subject = req.body.subject;
  const message = req.body.message;
  const currentDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  const parts = currentDate.split(" ");
  const indianDate = parts.slice(0, 4).join(" ");
  try {
    const contactData = new contactSchema({
      name: name,
      number: number,
      subject: subject,
      message: message,
      date: indianDate,
    });
    const contact = await contactData.save();
    resp
      .status(200)
      .json({ success: true, message: "We will contact you soon", contact });
  } catch (error) {
    console.error(error);
    resp.status(401).send("Some Error occured");
  }
};

//add home data

exports.addData = async (req, res) => {
  res.render("addData");
};

exports.addSection = async (req, res) => {
  const options = await imageSchema.find({});
  res.render("addsection", { options });
};

exports.admin = async (req, res) => {
  try {
    const messages = await contactSchema.find({});
    console.log(messages);
    const data = await imageSchema.find({});
    res.render("admin", {
      data: data,
      admin: req.user,
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
    let currentDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    let parts = currentDate.split(" ");
    const indianDate = parts.slice(0, 4).join(" ");
    if (req.file) {
      if (Array.isArray(req.file)) {
        const imageUploadPromises = req.file.map((file) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.path, (err, result) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                let currentDate = new Date().toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                });
                let parts = currentDate.split(" ");
                let date = parts.slice(0, 4).join(" ");
                const newImage = new Image({
                  title: req.body.title,
                  amount: req.body.amount,
                  description: req.body.description,
                  images: result.secure_url,
                  lastUpdate: date,
                  youtubelink: req.body.youtubelink || "",
                });

                newImage
                  .save()
                  .then(() => {
                    resolve();
                  })
                  .catch((saveErr) => {
                    reject(saveErr);
                  });
              }
            });
          });
        });

        await Promise.all(imageUploadPromises);
        return res.redirect("/addSection");
      } else {
        cloudinary.uploader.upload(req.file.path, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error uploading image");
          } else {
            let currentDate = new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            });
            let parts = currentDate.split(" ");
            let date = parts.slice(0, 4).join(" ");
            const newImage = new imageSchema({
              title: req.body.title,
              amount: req.body.amount,
              description: req.body.description,
              images: result.secure_url,
              lastUpdate: date,
            });

            newImage
              .save()
              .then(() => {
                console.log("Image saved successfully");
                return res.redirect("/admin");
              })
              .catch((saveErr) => {
                console.error(saveErr);
                return res.status(500).send("Error saving image data");
              });
          }
        });
      }
    } else {
      return res.status(500).send("Error saving image data");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Something went wrong");
  }
};



// login get

exports.login = async (req, res) => {
  res.render("login");
};

exports.loginPost = async (req, res) => {
  // console.log(req.body);
  // for admin creation
  // const admindata = new adminSchema({
  //   email: req.body.email,
  //   password: req.body.password,
  // });
  // const token = await admindata.generateAuthToken();
  // res.cookie("jwt", token, {
  //   expires: new Date(Date.now() + 5259600000),
  //   httpOnly: true,
  //   sameSite: "Strict",
  // });
  // const user = await admindata.save();
  // res.status(200).json({ success: true, message: "register successful", user });

  const email = req.body.email;
  const password = req.body.password;
  try {
    const useremail = await adminSchema.findOne({ email: email });
    // console.log(password, useremail.password);
    const ismatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();
    // console.log(token);
    if (ismatch) {
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 5259600000),
        httpOnly: true,
        sameSite: "Strict",
      });
      res.status(200).json({
        success: true,
        message: "Successfuly",
      });
      // res.redirect("admin");
    } else {
      res.status(402).json({
        success: false,
        message: "Your Email or Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ success: false, message: "Your Email or Password is incorrect" });
  }
};

//list of cards in home
// exports.addData = async (req, resp) => {
//   console.log(11111111);
//   const heading = req.body.heading;
//   const amount = req.body.amount;
//   const link = req.body.link;

//   try {
//     const ListData = new listSchema({
//       heading: heading,
//       amount: amount,
//       link: link,
//     });
//     const lists = await ListData.save();
//     resp
//       .status(200)
//       .json({ success: true, message: "Thumbnail Data Added", lists });
//   } catch (error) {
//     console.error(error);
//     resp.status(401).send("Some Error occured");
//   }
// };

exports.photos = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await listSchema.find({ thumbnail_id: id });
    if (!data) {
      return res.status(404).send("Data not found");
    }
    res.render("photos", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await imageSchema.findById({ _id: id });
    if (!data) {
      return res.status(404).send("Data not found");
    }
    const updatedData = await imageSchema.updateOne({ _id: id }, { $set: {} });
    res.render("photos", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Retrieve the user by ID (assuming you have the ID in req.user.id)
    const user = await adminSchema.findById(req.user.id);

    // Update the user's properties if the fields are provided in the request
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    // Save the updated user
    await user.save();

    res.json({ success: true, message: "User details updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user details" });
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
    const postId = req.params.id;
    console.log(postId);
    const { title, amount, description } = req.body;
    console.log(title, amount, description);
    const post = await imageSchema.findById(postId);

    const currentDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const parts = currentDate.split(" ");
    const indianDate = parts.slice(0, 4).join(" ");
    if (post) {
      post.title = title || post.title;
      post.amount = amount || post.amount;
      post.description = description || post.description;
      post.lastUpdate = indianDate || post.lastUpdate;
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
    res.json({ success: true, message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
};

exports.metadata = async (req, res) => {
  try {
    console.log(111);


  } catch (error) {
    console.error("Error:", error);
    return res.status(300).send("Something went wrong");
  }
};

exports.more = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await imageSchema.findOne({ _id: id });
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};

exports.morePage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await listSchema.find({ thumbnail_id: id });
    console.log(111, data);
    res.render('more', { data });
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).json({ success: false, message: 'Failed to render page' });
  }
};

exports.morePagePost = async (req, res) => {
  try {
    // Extract data from request body
    const { theme, amount, dynamicData } = req.body;
    console.log(req.body.dynamicData);

    // Upload image to Cloudinary and get the URL
    let imageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    // Create a new creation instance
    const newCreation = new listSchema({
      thumbnail_id: dynamicData,
      theme: theme,
      amount: amount,
      link: imageUrl,
    });

    // Save the new creation instance to the database
    await newCreation.save();

    res.status(200).json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ success: false, message: 'Failed to save data' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await listSchema.findById({ _id: id });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await listSchema.findByIdAndDelete({ _id: id });

    return res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};



