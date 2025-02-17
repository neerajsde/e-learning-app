const { getPool } = require("../config/database");
const sendResponse = require("../utlis/responseSender");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return sendResponse(res, 400, false, "category name is required");
    }
    if (!description) {
      return sendResponse(res, 400, false, "category description is required");
    }

    const trimName = name.trim();
    const trimDesc = description.trim();

    const Pool = getPool();

    // Check if the tag already exists
    const [result] = await Pool.query(
      `SELECT * FROM Category WHERE name LIKE '${trimName}'`
    );
    if (result.length > 0) {
      return sendResponse(res, 400, false, "Category already exists");
    }

    // Ensure trimName and trimDesc are valid
    const safeName = trimName ? trimName.trim() : "";
    const safeDesc = trimDesc ? trimDesc.trim() : "";
    const safeSlug = safeName.toLowerCase().replace(/\//g, "and").replaceAll("-"," and ").replace(/\s+/g, "-");

    const [newCategory] = await Pool.query(
      "INSERT INTO Category (name, description, slugUrl) VALUES (?, ?, ?)",
      [safeName, safeDesc, safeSlug]
    );
    console.log(newCategory);
    if (newCategory.affectedRows === 0) {
      return sendResponse(
        res,
        500,
        false,
        "Error while creating the course category"
      );
    }

    return sendResponse(res, 200, true, "Category created successfully");
  } catch (err) {
    console.error("Error while creating new category: ", err.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const Pool = getPool();
    const [result] = await Pool.query("SELECT id, name, description, slugUrl FROM Category");

    if (result.length === 0) {
      return sendResponse(res, 404, false, "Category Not Found");
    }

    return sendResponse(res, 200, true, "Get courses by category", { result });
  } catch (err) {
    console.error("Error while fetching Catgories: ", err.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    let { category } = req.params;

    const Pool = getPool();

    // Fetch category details first
    const [[categoryDetails]] = await Pool.query(`SELECT * FROM Category WHERE slugUrl = ?`, [category]);

    // Validate if category exists
    if (!categoryDetails) {
      return sendResponse(res, 404, false, "Category Not Found");
    }

    // Fetch related data after confirming categoryDetails exist
    const [[selectedCategory], [differentCategories], [newCourses], [topSellingProducts]] = await Promise.all([
      Pool.query(
        `WITH SelectedCategory AS (
              SELECT 
                  c.*,
                  u.name AS instructor_name,
                  u.user_img AS instructor_image
              FROM 
                  Courses c
              JOIN 
                  Users u ON c.instructorId = u.id
              WHERE 
                  c.category = ?
          ),
          CourseRatings AS (
              SELECT 
                  sc.id AS courseId,
                  ROUND(AVG(rr.rating), 1) AS avg_ratings,
                  COUNT(rr.id) AS review_count
              FROM 
                  SelectedCategory sc
              LEFT JOIN 
                  RatingAndReviews rr ON sc.id = rr.courseId
              GROUP BY 
                  sc.id
          )
          SELECT 
              sc.id AS id,
              sc.courseName AS courseName,
              sc.courseDescription AS courseDesc,
              sc.price AS price,
              sc.thumbnail AS thumbnail,
              sc.category AS category,
              sc.instructor_name,
              sc.instructor_image,
              sc.slugUrl,
              COALESCE(cr.avg_ratings, 0) AS avg_ratings,
              COALESCE(cr.review_count, 0) AS review_count
          FROM 
              SelectedCategory sc
          LEFT JOIN 
              CourseRatings cr ON sc.id = cr.courseId
          ORDER BY 
              cr.avg_ratings DESC, 
              cr.review_count DESC`, [categoryDetails.name]),
      Pool.query(
        `WITH DifferentCategories AS (
              SELECT 
                  c.*,
                  u.name AS instructor_name,
                  u.user_img AS instructor_image
              FROM 
                  Courses c
              JOIN 
                  Users u ON c.instructorId = u.id
              WHERE 
                  c.category != ?
          ),
          CourseRatings AS (
              SELECT 
                  dc.id AS courseId,
                  ROUND(AVG(rr.rating), 1) AS avg_ratings,
                  COUNT(rr.id) AS review_count
              FROM 
                  DifferentCategories dc
              LEFT JOIN 
                  RatingAndReviews rr ON dc.id = rr.courseId
              GROUP BY 
                  dc.id
          )
          SELECT 
              dc.id AS id,
              dc.courseName AS courseName,
              dc.courseDescription AS courseDesc,
              dc.price AS price,
              dc.thumbnail AS thumbnail,
              dc.category AS category,
              dc.instructor_name,
              dc.instructor_image,
              dc.slugUrl,
              COALESCE(cr.avg_ratings, 0) AS avg_ratings,
              COALESCE(cr.review_count, 0) AS review_count
          FROM 
              DifferentCategories dc
          LEFT JOIN 
              CourseRatings cr ON dc.id = cr.courseId
          ORDER BY 
              dc.category, 
              cr.avg_ratings DESC`, [categoryDetails.name]),
      Pool.query(
        `WITH NewCourses AS (
          SELECT 
              c.*,
              u.name AS instructor_name,
              u.user_img AS instructor_image
          FROM 
              Courses c
          JOIN 
              Users u ON c.instructorId = u.id
          WHERE 
              c.category = ?
          ORDER BY 
              c.created_at DESC
          LIMIT 5
      ),
      CourseRatings AS (
          SELECT 
              nc.id AS courseId,
              ROUND(AVG(rr.rating), 1) AS avg_ratings,
              COUNT(rr.id) AS review_count
          FROM 
              NewCourses nc
          LEFT JOIN 
              RatingAndReviews rr ON nc.id = rr.courseId
          GROUP BY 
              nc.id
      )
      SELECT 
          nc.id AS id,
          nc.courseName AS courseName,
          nc.courseDescription AS courseDesc,
          nc.price AS price,
          nc.thumbnail AS thumbnail,
          nc.category AS category,
          nc.instructor_name,
          nc.instructor_image,
          nc.slugUrl,
          COALESCE(cr.avg_ratings, 0) AS avg_ratings,
          COALESCE(cr.review_count, 0) AS review_count
      FROM 
          NewCourses nc
      LEFT JOIN 
          CourseRatings cr ON nc.id = cr.courseId
      ORDER BY 
          nc.created_at DESC`, [categoryDetails.name]),
      Pool.query(
        `WITH TopEnrolledCourses AS (
              SELECT 
                  c.id AS courseId, 
                  c.category AS category,
                  COUNT(ce.userId) AS enrollmentCount
              FROM 
                  CourseEnroll ce
              JOIN 
                  Courses c ON ce.courseId = c.id
              GROUP BY 
                  c.id
              HAVING c.category = ?
              ORDER BY 
                  enrollmentCount DESC
              LIMIT 10
          ),
          CourseDetails AS (
              SELECT 
                  c.*,
                  u.name AS instructor_name,
                  u.user_img AS instructor_image
              FROM 
                  Courses c
              JOIN 
                  TopEnrolledCourses tec ON c.id = tec.courseId
              JOIN 
                  Users u ON c.instructorId = u.id
          )
          SELECT 
              cd.id AS id,
              cd.courseName AS courseName,
              cd.courseDescription AS courseDesc,
              cd.price AS price, 
              cd.thumbnail AS thumbnail,
              cd.category AS category,
              cd.instructor_name,
              cd.instructor_image,
              cd.slugUrl,
              ROUND(AVG(rr.rating), 1) AS avg_ratings, 
              COUNT(rr.id) AS review_count
          FROM 
              CourseDetails cd
          JOIN 
              RatingAndReviews rr ON cd.id = rr.courseId
          GROUP BY 
              cd.id`
      ,[categoryDetails.name])
    ]);

    // Send response with optimized data
    return sendResponse(res, 200, true, "Get Category Page Data", {
      categoryDetails,
      related: selectedCategory,
      new: newCourses,
      popular: topSellingProducts,
      other: differentCategories,
    });

  } catch (error) {
    console.error("Error While Fetching Category Data:", error.message);
    return sendResponse(res, 500, false, "Internal Server Error", { error: error.message });
  }
};


