exports.sendPasswordChangeMail = (username, role) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Changed Successfully</title>
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
                .username {
                    font-weight: bold;
                    color: #007BFF;
                }
                .role {
                    font-weight: bold;
                    color: #28a745;
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
                <img src=${process.env.LOGO_URL} alt="Chat App Logo" class="logo" />

                <h2 class="heading">Password Changed Successfully!</h2>

                <div class="message">
                    <p>Dear <span class="username">${username}</span>,</p>
                    <p>We wanted to let you know that your password has been successfully changed. Your role in our system is <span class="role">${role}</span>.</p>
                </div>

                <div class="message">
                    <p>If you did not initiate this change, please contact us immediately at <a href="mailto:support@studynotion.com">support@studynotion.com</a>.</p>
                </div>

                <div class="footer">
                    <p>Thank you for being a valued member of Study Notion.</p>
                    <p>Best regards,</p>
                    <p><strong>Study Notion || Neeraj Prajapati</strong></p>
                    <p>© 2025 Study Notion. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;
};