const express = require("express");
const mongoose = require("mongoose");
const courseModel = require("../models/courses.model");
const { auth } = require("../middlewares/users.middleware");
const { UserModel } = require("../models/users.models.js");

const courseRoute = express.Router();
const fs = require("fs");
const path = require("path");

const getLocalCourses = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "../db.json"), "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading local db.json:", err);
    return [];
  }
};




courseRoute.get("/all", async (req, res) => {
  try {
    let { q, sortBy, sortOrder, page, limit } = req.query;
    let filter = {};
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;

    let courses = [];
    try {
      // Fast path: bypass DB query immediately if not connected
      if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB not connected. Using local JSON instantly.");
      }

      courses = await courseModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      // If no courses in DB, check JSON
      if (courses.length === 0) {
        throw new Error("No courses in DB");
      }
    } catch (dbErr) {
      // Suppress spammy console log if it's the expected "not connected" fallback
      if (dbErr.message !== "MongoDB not connected. Using local JSON instantly.") {
        console.log("DB Fetch failed, using JSON fallback:", dbErr.message);
      }
      courses = getLocalCourses();

      // Manual filter for JSON data
      if (q) {
        courses = courses.filter(c => c.title.toLowerCase().includes(q.toLowerCase()));
      }

      // Manual pagination
      courses = courses.slice((page - 1) * limit, page * limit);
    }

    res.status(200).json({ course: courses });
  } catch (err) {
    res.status(400).json({ message: "Something Went Wrong", error: err.message });
  }
});





courseRoute.use(auth);
// Protected Routes


// get request for all courses
// EndPoint: /courses/
//FRONTEND: we can get the list of all course

courseRoute.get("/", async (req, res) => {
  try {
    let { q, sortBy, sortOrder, page, limit } = req.query;
    let filter = {};
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;

    let courses = [];
    try {
      // Fast path: bypass DB query immediately if not connected
      if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB not connected. Using local JSON instantly.");
      }

      courses = await courseModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      if (courses.length === 0) {
        throw new Error("No courses in DB");
      }
    } catch (dbErr) {
      if (dbErr.message !== "MongoDB not connected. Using local JSON instantly.") {
        console.log("DB Fetch failed, using JSON fallback:", dbErr.message);
      }
      courses = getLocalCourses();
      if (q) {
        courses = courses.filter(c => c.title.toLowerCase().includes(q.toLowerCase()));
      }
      courses = courses.slice((page - 1) * limit, page * limit);
    }

    res.status(200).json({ course: courses });
  } catch (err) {
    res.status(400).json({ message: "Something Went Wrong", error: err.message });
  }
});

courseRoute.get("/TeacherCourses", async (req, res) => {
  try {
    let { userId } = req.query;
    let filter = {};
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    // Add filter for userId
    if (userId) {
      filter.teacherId = userId;
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const data = req.body;
    const course = await courseModel
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ course });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});

// get request indivual course
// EndPoint: /courses/:courseID
// FRONTEND: when user or admin want to access a specific course
courseRoute.get("/:courseID", async (req, res) => {
  try {
    const courseID = req.params.courseID;
    console.log(courseID);

    let course;
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB not connected. Using local JSON instantly.");
      }
      course = await courseModel.findOne({ _id: courseID });
      if (!course) throw new Error("Course not found in DB");
    } catch (dbErr) {
      if (dbErr.message !== "MongoDB not connected. Using local JSON instantly.") {
        console.log("Individual course fetch failed, checking JSON fallback:", dbErr.message);
      }
      const courses = getLocalCourses();
      course = courses.find(c => c._id === courseID || c.title === courseID);
    }

    if (!course) {
      res.status(404).json({ message: "Course not found" });
    } else {
      res.status(200).json({ course });
    }
  } catch (err) {
    res.status(400).json({ message: "Something Went Wrong", error: err.message });
  }
});

// adding new course
// Access: Admin & teacher
// EndPoint: /courses/add;
// FRONTEND: when teacher want to add his/ her new course
courseRoute.post("/add", async (req, res) => {
  try {
    if (req.body.role == "admin" || req.body.role == "teacher") {
      let newCourseData = {
        ...req.body,
        _id: req.body._id || new mongoose.Types.ObjectId().toString(),
        teacher: req.body.username,
        teacherId: req.body.userId,
        createdAt: new Date().toISOString()
      };

      // Update JSON for local availability
      try {
        const localCourses = getLocalCourses();
        localCourses.push(newCourseData);
        fs.writeFileSync(path.join(__dirname, "../db.json"), JSON.stringify(localCourses, null, 4));
      } catch (jsonErr) {
        console.error("Failed to sync with JSON:", jsonErr.message);
      }

      try {
        const newCourse = new courseModel(newCourseData);
        await newCourse.save();
        res.status(201).json({ message: "Course Added (DB & JSON)", data: newCourse });
      } catch (dbErr) {
        console.log("DB save failed, saved to JSON only:", dbErr.message);
        res.status(201).json({ message: "Course Added (Local Mode)", data: newCourseData });
      }
    } else {
      res.status(401).json({ error: "you don't have access to add course" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something Went Wrong", error: err.message });
  }
});

// updating course details;
// Access: Admin & teacher;
// EndPoint: /courses/update/:courseID;
// FRONTEND: when teacher want to update his existing course
courseRoute.patch("/update/:courseID", async (req, res) => {
  try {
    if (req.body.role == "admin" || req.body.role == "teacher") {
      const courseID = req.params.courseID;
      const course = await courseModel.findByIdAndUpdate(
        { _id: courseID },
        req.body
      );
      //  console.log(course)
      if (!course) {
        res.status(404).json({ message: "course not found" });
      } else {
        res.status(202).json({ message: "course updated", course });
      }
    } else {
      res.status(401).json({ error: "you don't have access to update course" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});

// course delete request;
// Access: Admin & teacher;
// EndPoint: /courses/delete/:courseID;
// FRONTEND: when admin/teacher want to delete his existing courses
courseRoute.delete("/delete/:courseID", async (req, res) => {
  try {
    if (req.body.role == "admin" || req.body.role == "teacher") {
      const courseID = req.params.courseID;
      const course = await courseModel.findByIdAndDelete({ _id: courseID });
      // console.log(course);
      if (!course) {
        res.status(404).json({ message: "course not found" });
      } else {
        res.status(200).json({ message: "course deleted", course });
      }
    } else {
      res
        .status(401)
        .json({ error: "you don't have access to delete the course" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something Went Wrong", error: err.message });
  }
});

// VULNERABLE FOR CSRF DEMO: A route that allows enrollment via a simple GET request
// This is vulnerable because a hacker can trick a user into clicking a link that enrolls them automatically.
courseRoute.get("/enroll-demo", async (req, res) => {
  try {
    const { courseId, userId } = req.query;
    console.log(`🛡️ CSRF DEMO: Attempting to enroll user ${userId} in course ${courseId}`);
    
    // In a real attack, the user would be enrolled without their knowledge.
    // For the demo, we just return a success message if not blocked by AI.
    res.status(200).json({ 
      message: "📚 [HACK SUCCESS] You have been automatically enrolled in the course without your consent!",
      details: { courseId, userId }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = { courseRoute };
