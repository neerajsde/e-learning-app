const {instance} = require("../config/razorpay");
const { getPool } = require('../config/database');
const mailSender = require("../utlis/mailSender");
const {courseEnrollmentEmail} = require("../mails/templates/courseEnrollmentEmail");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    try{
        //get courseId and UserID
        const {course_id} = req.body;
        const userId = req.user.id;
        //validation
        //valid courseID
        if(!course_id) {
            return res.json({
                success:false,
                message:'Please provide valid course ID',
            })
        };

        const Pool = getPool();
        //valid courseDetail
        const [courseDetails] = await Pool.query('SELECT id, courseName, price FROM Courses WHERE id = ?',[course_id]);
        if(courseDetails.length > 0) {
            return res.json({
                success:false,
                message:'Could not find the course',
            });
        }

        const [enrolledCourse] = await Pool.query('SELECT id FROM CourseEnroll WHERE userId = ? AND courseId = ?',[userId, course_id]);
        if(enrolledCourse.length > 0) {
            return res.json({
                success:false,
                message:'already enrolled this course',
            });
        }
        
        // create 
        const course = courseDetails[0];
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                courseId: course.id,
                userId,
            }
        };

        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse); // remove
        //return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });
    } catch(error) {
        console.log("Error while initiate new payment: ", error.message);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
};

//verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum =  crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
            //fulfil the action
            const Pool = getPool();

            const [courseDetails] = await Pool.query('SELECT id, courseName FROM Courses WHERE id = ?',[courseId]);
            if(courseDetails.length > 0) {
                return res.json({
                    success:false,
                    message:'Could not find the course',
                });
            }

            const [userDetails] = await Pool.query('SELECT id, name FROM users WHERE id = ?',[userId]);
            if(courseDetails.length > 0) {
                return res.json({
                    success:false,
                    message:'Could not find the course',
                });
            }
            //find the student andadd the course to their list enrolled courses me 
            const [enrolledStudent] = await Pool.query('INSERT INTO CourseEnroll (userId, courseId) VALUES (?,?)', [userId, courseId]);
            if(enrolledStudent.affectedrow === 0){
                return res.status(300).json({
                    success: false,
                    message: 'Unexpexted error occured'
                })
            }

            //mail send krdo confirmation wala 
            const emailResponse = await mailSender(
                                    enrolledStudent.email,
                                    "Congratulations from CodeHelp",
                                    courseEnrollmentEmail(courseDetails[0].courseName, userDetails.name)
            );

            return res.status(200).json({
                success:true,
                message:"Signature Verified and COurse Added",
            });
        }       
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
};