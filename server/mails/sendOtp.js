exports.sendUserOTPMail = (otp) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your OTP Code</title>
            <style>
                body {
                    background-color: #f4f4f4;
                    font-family: 'Arial', sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 30px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .logo {
                    max-width: 120px;
                    margin: 0 auto 20px auto;
                    display: block;
                }
                .heading {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007BFF;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .message {
                    font-size: 16px;
                    margin-bottom: 20px;
                    text-align: left;
                }
                .otp-code {
                    font-size: 28px;
                    font-weight: bold;
                    color: #28a745;
                    text-align: center;
                    margin: 20px 0;
                }
                .footer {
                    font-size: 14px;
                    color: #777;
                    text-align: center;
                    margin-top: 30px;
                }
                a {
                    color: #007BFF;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                @media (max-width: 600px) {
                    .container {
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://chat.neerajprajapati.in/public/assets/logo.png" alt="Chat App Logo" class="logo" />

                <h2 class="heading">Welcome to Study Notion!</h2>

                <div class="message">
                    <p>Dear User,</p>
                    <p>Here is your One-Time Password (OTP) to complete your action:</p>
                </div>

                <div class="otp-code">${otp}</div>

                <div class="message">
                    <p>Please use this OTP within the next 10 minutes. For your security, do not share this code with anyone.</p>
                </div>

                <div class="footer">
                    <p>If you have any questions or need support, feel free to contact us at <a href="mailto:support@studynotion.com">support@studynotion.com</a>.</p>
                    <p>Best regards,</p>
                    <p><strong>Study Notion || Neeraj Prajapati</strong></p>
                    <p>© 2025 Study Notion. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;
};