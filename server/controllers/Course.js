const { getPool } = require('../config/database');
const sendResponse = require('../utlis/responseSender');
const imageUploader = require('../utlis/imageUploader');
const deleteImage = require('../utlis/deleteImageHandler');

exports.createCourse = async (req, res) => {
  try {
      // Fetch data
      const { courseName, courseDescription, whatYoutWillLearn, price, category, tags } = req.body;

      // Validation
      if (!courseName || !courseDescription || !whatYoutWillLearn || !price || !category || !tags) {
        return sendResponse(res, 400, false,'All fields are required');
      }

      const pool = await getPool(); // Create a connection pool

      // Helper function for executing queries
      const executeQuery = async (query, params = []) => {
          const [results] = await pool.query(query, params);
          return results;
      };

      // Create a new course
      const safeName = courseName ? courseName.trim() : "";
      const safeSlug = safeName.toLowerCase().replace(/\//g, "and").replaceAll("-"," and ").replace(/\s+/g, "-");
      const insertCourseQuery = `
          INSERT INTO Courses 
          (courseName, courseDescription, instructorId, whatYouWillLearn, price, category, slugUrl) 
          VALUES (?,?,?,?,?,?, ?)`;
      const insertCourseParams = [courseName, courseDescription, req.user.id, whatYoutWillLearn, price, category, safeSlug];
      const insertResult = await executeQuery(insertCourseQuery, insertCourseParams);

      if (insertResult.affectedRows === 0) {
        return sendResponse(res, 500, false,'Error creating the course' );
      }

      const courseId = insertResult.insertId;

      // Link course with the instructor
      const enrollQuery = `INSERT INTO CourseEnroll (userId, courseId) VALUES (?,?)`;
      await executeQuery(enrollQuery, [req.user.id, courseId]);

      // Process tags
      const tagList = tags.split(' ').map(tag => tag.trim()).filter(tag => tag.length > 0);

      for (const tag of tagList) {
          // Check if tag already exists
          const checkTagQuery = `SELECT id FROM Tags WHERE name = ?`;
          const existingTag = await executeQuery(checkTagQuery, [tag]);

          let tagId;
          if (existingTag.length > 0) {
              tagId = existingTag[0].id;
          } else {
              // Create a new tag
              const instructorNameQuery = `SELECT name FROM Users WHERE id = ?`;
              const [instructorDetails] = await executeQuery(instructorNameQuery, [req.user.id]);

              const createTagQuery = `INSERT INTO Tags (name, description) VALUES (?, ?)`;
              const tagDescription = `This tag ${tag} was created by ${instructorDetails.name}`;
              const newTagResult = await executeQuery(createTagQuery, [tag, tagDescription]);

              if (newTagResult.affectedRows === 0) {
                return sendResponse(res, 500, false,'Error creating the tag');
              }

              tagId = newTagResult.insertId;
          }

          // Link tag to the course
          const tagCourseLinkQuery = `INSERT INTO TaggedCourse (tagId, courseId) VALUES (?,?)`;
          await executeQuery(tagCourseLinkQuery, [tagId, courseId]);
      }

      // Return success response
      return sendResponse(res, 200, true, 'Course Created Successfully', {courseId});
  } catch (error) {
      console.error('Error occurred while creating a new course:', error.message);
      return sendResponse(res, 500, false, 'Failed to create course', {err: error.message} );
  }
};

exports.publishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;

        if (!courseId || courseId == 0  || !instructorId) {
            return sendResponse(res, 400, false, 'Invalid request. Course ID and Instructor ID are required.');
        }

        const pool = getPool();
        const [[course]] = await pool.query(
            'SELECT * FROM Courses WHERE id = ?', 
            [courseId]
        );

        if (!course) {
            return sendResponse(res, 404, false, 'Course not found.');
        }

        if (course.instructorId !== instructorId) {
            return sendResponse(res, 403, false, "You don't have permission to publish this course.");
        }

        // vaildate course details data
        if(!course.courseName || !course.courseDescription || !course.thumbnail || !course.category || !course.whatYouWillLearn || !course.price){
            return sendResponse(res, 401, false, 'Please Fill course details');
        }
        // vaildate sections data
        const [courseSections] = await pool.query(
            'SELECT * FROM Section WHERE courseId = ?', 
            [courseId]
        );
        if (courseSections.length < 5) {
            return sendResponse(res, 404, false, 'Please create min 5 sections');
        }

        const [updateResult] = await pool.query(
            'UPDATE Courses SET isPublish = TRUE WHERE id = ? AND instructorId = ?', 
            [courseId, instructorId]
        );

        if (updateResult.affectedRows === 0) {
            return sendResponse(res, 500, false, 'Failed to publish the course. Please try again.');
        }

        return sendResponse(res, 200, true, 'Congratulations! Your course is now live.');
    } catch (error) {
        console.error('Error publishing course:', error);
        return sendResponse(res, 500, false, 'Internal Server Error.', { error: error.message });
    }
};

exports.unPublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;

        if (!courseId || courseId == 0  || !instructorId) {
            return sendResponse(res, 400, false, 'Invalid request. Course ID and Instructor ID are required.');
        }

        const pool = getPool();
        const [[course]] = await pool.query(
            'SELECT * FROM Courses WHERE id = ?', 
            [courseId]
        );

        if (!course) {
            return sendResponse(res, 404, false, 'Course not found.');
        }

        if (course.instructorId !== instructorId) {
            return sendResponse(res, 403, false, "You don't have permission to publish this course.");
        }

        // vaildate course details data
        if(!course.courseName || !course.courseDescription || !course.thumbnail || !course.category || !course.whatYouWillLearn || !course.price){
            return sendResponse(res, 401, false, 'Please Fill course details');
        }
        // vaildate sections data
        const [courseSections] = await pool.query(
            'SELECT * FROM Section WHERE courseId = ?', 
            [courseId]
        );
        if (courseSections.length < 5) {
            return sendResponse(res, 404, false, 'Please create min 5 sections');
        }

        const [updateResult] = await pool.query(
            'UPDATE Courses SET isPublish = FALSE WHERE id = ? AND instructorId = ?', 
            [courseId, instructorId]
        );

        if (updateResult.affectedRows === 0) {
            return sendResponse(res, 500, false, 'Failed to publish the course. Please try again.');
        }

        return sendResponse(res, 200, true, 'Congratulations! Your course is public.');
    } catch (error) {
        console.error('Error un-publishing course:', error);
        return sendResponse(res, 500, false, 'Internal Server Error.', { error: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;

        if (!courseId) {
            return sendResponse(res, 400, false, 'Invalid request. Course ID is required.');
        }

        const pool = getPool();
        const [[course]] = await pool.query(
            'SELECT * FROM Courses WHERE id = ?', 
            [courseId]
        );
        if (!course) {
            return sendResponse(res, 404, false, 'Course not found.');
        }
        if(course.instructorId !== instructorId){
            return sendResponse(res, 403, false, "You can't access another course details");
        }

        const [tagsArr] = await pool.query(
            `SELECT t.name FROM Tags t
             JOIN TaggedCourse tc ON t.id = tc.tagId
             WHERE tc.courseId = ?`, 
            [courseId]
        );
        const tags = tagsArr.map(tag => tag.name).join(' ');

        return sendResponse(res, 200, true, 'Found course data', { course, tags});
    } catch (error) {
        console.error('Error while getting course:', error);
        return sendResponse(res, 500, false, 'Internal Server Error.', { error: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        // Extract request data
        const userId = req.user.id;
        const courseId = req.query.id;
        const { courseName, courseDescription, whatYoutWillLearn, price, category, tags } = req.body;

        if (!courseId) {
            return sendResponse(res, 400, false, 'Course ID is required');
        }
        // Validate required fields
        if (!courseName || !courseDescription || !whatYoutWillLearn || !price || !category || !tags) {
            return sendResponse(res, 400, false, 'All fields are required');
        }

        const pool = getPool(); // Get DB connection pool

        const executeQuery = async (query, params = []) => {
            const [results] = await pool.query(query, params);
            return results;
        };

        const [course] = await pool.query(
            'SELECT id, instructorId, thumbnail FROM Courses WHERE id = ?', 
            [courseId]
        );

        if (!Array.isArray(course) || course.length === 0) {
            return sendResponse(res, 404, false, 'Course not found');
        }

        // verify instructor
        if(course[0].instructorId !== userId){
            return sendResponse(res, 403, false, "You can't change another course details");
        }
        // Update course details
        const updateQuery = `UPDATE Courses SET courseName = ?, courseDescription = ?, whatYouWillLearn = ?, price = ?, category = ? WHERE id = ?`;
        await executeQuery(updateQuery, [courseName, courseDescription, whatYoutWillLearn, price, category, courseId]);

        // Process tags
        const tagList = tags.split(' ').map(tag => tag.trim()).filter(tag => tag.length > 0);

        if (tagList.length > 0) {
            // Get instructor name
            const instructorQuery = `SELECT name FROM Users WHERE id = ?`;
            const [instructor] = await executeQuery(instructorQuery, [req.user.id]);
            const instructorName = instructor?.name || 'Unknown Instructor';

            // Process tags concurrently
            await Promise.all(tagList.map(async (tag) => {
                // Check if tag exists
                const existingTagQuery = `SELECT id FROM Tags WHERE name = ?`;
                const existingTag = await executeQuery(existingTagQuery, [tag]);

                let tagId;
                if (existingTag.length > 0) {
                    tagId = existingTag[0].id;
                } else {
                    // Create new tag
                    const createTagQuery = `INSERT INTO Tags (name, description) VALUES (?, ?)`;
                    const tagDescription = `This tag ${tag} was created by ${instructorName}`;
                    const newTagResult = await executeQuery(createTagQuery, [tag, tagDescription]);
                    tagId = newTagResult.insertId;
                }

                // Check if tag-course relationship exists
                const checkTagCourseQuery = `SELECT 1 FROM TaggedCourse WHERE tagId = ? AND courseId = ?`;
                const tagCourseExists = await executeQuery(checkTagCourseQuery, [tagId, courseId]);

                if (tagCourseExists.length === 0) {
                    // Link tag to course
                    const tagCourseLinkQuery = `INSERT INTO TaggedCourse (tagId, courseId) VALUES (?, ?)`;
                    await executeQuery(tagCourseLinkQuery, [tagId, courseId]);
                }
            }));
        }

        // Return success response
        return sendResponse(res, 200, true, 'Course Updated Successfully', { courseId });

    } catch (error) {
        console.error('Error occurred while updating course:', error.message);
        return sendResponse(res, 500, false, 'Failed to update course', { error: error.message });
    }
};

exports.updateCourseThumbnail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.query;
        const thumbnail = req.files?.img;

        if (!id) {
            return sendResponse(res, 400, false, 'Course ID is required');
        }

        if (!req.files || !thumbnail) {
            return sendResponse(res, 400, false, 'Please select an image');
        }

        const pool = await getPool();
        const [course] = await pool.query(
            'SELECT id, instructorId, thumbnail FROM Courses WHERE id = ?', 
            [id]
        );

        if (!Array.isArray(course) || course.length === 0) {
            return sendResponse(res, 404, false, 'Course not found');
        }

        // verify instructor
        if(course[0].instructorId !== userId){
            return sendResponse(res, 403, false, "You can't change another course details");
        }

        if (course[0].thumbnail) {
            const deleteResult = await deleteImage(course[0].thumbnail);
            if (!deleteResult) {
                console.warn('Failed to delete old image:', course[0].thumbnail);
            }
        }

        // Upload image
        const thumbnailImage = await imageUploader('CourseThumbnails', thumbnail);
        if (!thumbnailImage?.flag || !thumbnailImage?.url) {
            return sendResponse(res, 400, false, thumbnailImage.message || 'Image upload failed');
        }

        const [update] = await pool.query(
            'UPDATE Courses SET thumbnail = ? WHERE id = ?', 
            [thumbnailImage.url, id]
        );

        if (update.affectedRows === 0) {
            return sendResponse(res, 404, false, 'Course not found or no update made');
        }

        return sendResponse(res, 200, true, 'Thumbnail updated successfully', { imgUrl: thumbnailImage.url });

    } catch (error) {
        console.error('Error occurred while updating course thumbnail:', error);
        return sendResponse(res, 500, false, 'Failed to update course thumbnail', { err: error.message });
    }
};

function calculateTotalTime(timeArray) {
    let totalSeconds = 0;

    timeArray.forEach(item => {
        let timeParts = item.time.split(":").map(Number);
        
        let hours = 0, minutes = 0, seconds = 0;

        if (timeParts.length === 3) {
            [hours, minutes, seconds] = timeParts;
        } else if (timeParts.length === 2) {
            [minutes, seconds] = timeParts;
        }

        totalSeconds += hours * 3600 + minutes * 60 + seconds;
    });

    let totalMinutes = Math.floor(totalSeconds / 60);
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
}

exports.getCourseDetails = async (req, res) => {
    try {
        const { courseUrl } = req.params;
        const Pool = getPool();

        // Fetch course details with instructor info in one query
        const [courseDetails] = await Pool.query(
            `SELECT c.*, u.name AS instructorName, u.user_img AS instructorImage, p.about AS instructorDesc
             FROM Courses c 
             JOIN Users u ON c.instructorId = u.id 
             JOIN Profile p ON c.instructorId = p.userId
             WHERE c.slugUrl = ?`, 
            [courseUrl]
        );

        if (courseDetails.length === 0) {
            return sendResponse(res, 404, false,"Course Not Found");
        }

        const course = courseDetails[0];

        // Fetch all sections and their subsections in one go
        const [sectionsAndSubsections] = await Pool.query(
            `SELECT 
                s.id AS sectionId, s.sectionName, s.courseId,
                ss.id AS subSectionId, ss.title, ss.timeDuration, ss.description, ss.videoURL, ss.additionalURL 
             FROM Section s
             LEFT JOIN SubSection ss ON s.id = ss.sectionId
             WHERE s.courseId = ?
             ORDER BY ss.created_at ASC`,
            [course.id]
        );

        // Transform sections and group their subsections
        const sectionMap = {};
        sectionsAndSubsections.forEach(row => {
            if (!sectionMap[row.sectionId]) {
                sectionMap[row.sectionId] = {
                    sectionName: row.sectionName,
                    subSections: []
                };
            }
            if (row.subSectionId) {
                sectionMap[row.sectionId].subSections.push({
                    id: row.subSectionId,
                    title: row.title,
                    timeDuration: row.timeDuration,
                    description: row.description,
                    videoURL: row.videoURL,
                    additionalURL: row.additionalURL
                });
            }
        });

        // get course duration
        const [duration] = await Pool.query(
            `SELECT sb.timeDuration AS time 
                FROM Section s
                JOIN SubSection sb
                ON s.id = sb.sectionId AND s.courseId = ?`,
            [course.id]
        )

        let courseDuration = '';
        if(duration.length !== 0) {
            courseDuration = calculateTotalTime(duration);
        }

        const allSections = Object.values(sectionMap);
        const payload = {
            course,
            allSections,
            courseDuration: courseDuration || '8h 30m'
        };

        return sendResponse(res, 200, true,'Course data found', {data: payload} );
    } catch (err) {
        console.error("Error occurred while fetching course details: ", err.message);
        return sendResponse(res, 500, false, 'Internal Server Error', {error: err.message});
    }
};

//getAllCourses handler function
exports.getAllCourses = async (req, res) => {
    try {
        const pool = await getPool();

        const [allCourses] = await pool.query(`SELECT 
                                            c.id AS id,
                                            c.courseName AS courseName,
                                            c.coursedescription AS description,
                                            c.whatyouwilllearn AS whatyouwilllearn,
                                            c.price AS price,
                                            c.thumbnail AS thumbnail,
                                            c.updated_at AS updatedAt,
                                            u.name AS instructorName,
                                            u.user_img AS instructorImg
                                        FROM Courses c
                                        INNER JOIN Users u
                                        ON c.instructorId = u.id`);

        return sendResponse(res, 200, true, 'Data for all courses fetched successfully', {data:allCourses});
    }
    catch(error) {
        console.log("Error while getting courses data: ", error);
        return sendResponse(res, 500, false, 'Cannot Fetch course data', {error:error.message});
    }
}