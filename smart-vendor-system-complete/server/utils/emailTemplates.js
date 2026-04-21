const getOTPEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f6f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 3px;
        }
        .content {
          background-color: #ffffff;
          border-radius: 14px;
          padding: 40px 30px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        .otp-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #ffffff;
          font-family: 'Courier New', monospace;
        }
        .info-text {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          margin: 20px 0;
          text-align: center;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          color: #856404;
          padding: 15px;
          border-radius: 8px;
          font-size: 14px;
          margin-top: 30px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #999;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <div class="header">
            <div class="logo">Smart Vendor Ledger</div>
            <p style="color: #666;">Password Reset Request</p>
          </div>
          
          <div class="info-text">
            Hello,<br><br>
            We received a request to reset your password. Use the following OTP to proceed:
          </div>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
          </div>
          
          <div class="info-text">
            This OTP is valid for <strong>5 minutes</strong>.<br>
            If you didn't request this, please ignore this email.
          </div>
          
          <div class="warning">
            ⚠️ Never share this OTP with anyone. Our team will never ask for your OTP.
          </div>
          
          <div class="footer">
            <p>Smart Vendor Ledger - Your Business Growth Partner</p>
            <p>&copy; ${new Date().getFullYear()} Smart Vendor Ledger. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { getOTPEmailTemplate };