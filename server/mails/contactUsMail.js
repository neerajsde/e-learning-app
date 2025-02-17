exports.contactUsClientEmail = (name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Contact Form Submission Received</title>
      <style>
        body {
          background-color: #ffffff;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        .logo {
          max-width: 200px;
          margin-bottom: 20px;
        }
        .message {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .body {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .support {
          font-size: 14px;
          color: #999999;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Company Logo">
        <div class="message">Thank You for Reaching Out!</div>
        <div class="body">
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you shortly. Thank you for contacting us!</p>
          <p>In the meantime, feel free to browse our website or reach out to us directly at <a href="mailto:info@yourcompany.com">info@yourcompany.com</a>.</p>
        </div>
        <div class="support">If you have urgent inquiries, please call us at +1 (123) 456-7890.</div>
      </div>
    </body>
    </html>`;
  };  