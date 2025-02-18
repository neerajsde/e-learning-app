exports.contactUsAdminEmail = (name, email, phone, message) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Contact Form Submission</title>
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
          text-align: left;
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
        .highlight {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src=${process.env.LOGO_URL} alt="Company Logo">
        <div class="message">New Contact Form Submission</div>
        <div class="body">
          <p><span class="highlight">Name:</span> ${name}</p>
          <p><span class="highlight">Email:</span> ${email}</p>
          <p><span class="highlight">Phone:</span> ${phone}</p>
          <p><span class="highlight">Message:</span></p>
          <p>${message}</p>
        </div>
      </div>
    </body>
    </html>`;
  };  