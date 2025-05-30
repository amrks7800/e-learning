export default function otpTemplate(otp: string, fullName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Learning Verification Code</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 20px !important; }
            .otp-code { font-size: 28px !important; }
            .header-text { font-size: 24px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f7fa; min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table class="container" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; height: 120px; position: relative;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 30px 40px;">
                                        <!-- Logo/Icon -->
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 15px; margin-bottom: 10px;">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/3002/3002543.png" alt="EduLearn Logo" style="display: block; width: 40px; height: 40px; border: none;">
                                                </td>
                                            </tr>
                                        </table>
                                        <h1 class="header-text" style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 15px 0 0 0; text-align: center; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                            EduLearn Platform
                                        </h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td class="content" style="padding: 40px;">
                            <!-- Welcome Message -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding-bottom: 30px;">
                                        <h2 style="color: #2d3748; font-size: 24px; font-weight: 600; margin: 0 0 15px 0;">
                                            Verify Your Account
                                        </h2>
                                        <p style="color: #718096; font-size: 16px; line-height: 1.6; margin: 0;">
                                            Hello <span style="color: #3182ce">${fullName}</span> We received a request to access your EduLearn account. Use the verification code below to continue your learning journey.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- OTP Code Section -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <!-- OTP Container -->
                                        <table cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px dashed #cbd5e0; border-radius: 12px; padding: 25px 40px;">
                                            <tr>
                                                <td align="center">
                                                    <p style="color: #4a5568; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                                                        Your Verification Code
                                                    </p>
                                                    <div class="otp-code" style="color: #2b6cb0; font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 8px; margin: 10px 0; text-align: center;">
                                                        ${otp}
                                                    </div>
                                                    <p style="color: #718096; font-size: 12px; margin: 10px 0 0 0;">
                                                        This code expires in 10 minutes
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Instructions -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="background-color: #ebf8ff; border-left: 4px solid #3182ce; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding-right: 15px; vertical-align: top; width: 30px;">
                                                    <div style="background-color: #3182ce; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px;">
                                                        <span style="color: #ffffff; font-size: 14px; font-weight: bold;">!</span>
                                                    </div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <h3 style="color: #2c5282; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                        How to use this code:
                                                    </h3>
                                                    <ol style="color: #2c5282; font-size: 14px; line-height: 1.5; margin: 0; padding-left: 20px;">
                                                        <li style="margin-bottom: 5px;">Return to the EduLearn login page</li>
                                                        <li style="margin-bottom: 5px;">Enter this 6-digit code when prompted</li>
                                                        <li>Continue with your learning experience</li>
                                                    </ol>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0; margin-top: 30px;">
                                        <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                                            <strong style="color: #4a5568;">Security tip:</strong> Never share this code with anyone. EduLearn will never ask for your verification code via email or phone.
                                        </p>
                                        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                                            If you didn't request this code, please ignore this email or contact our support team.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Social Links -->
                                        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                            <tr>
                                                <td style="padding: 0 10px;">
                                                    <a href="#" style="text-decoration: none;">
                                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px; border: none;">
                                                    </a>
                                                </td>
                                                <td style="padding: 0 10px;">
                                                    <a href="#" style="text-decoration: none;">
                                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px; border: none;">
                                                    </a>
                                                </td>
                                                <td style="padding: 0 10px;">
                                                    <a href="#" style="text-decoration: none;">
                                                        <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" style="width: 24px; height: 24px; border: none;">
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                                            <strong style="color: #4a5568;">EduLearn Platform</strong><br>
                                            Empowering minds, one lesson at a time
                                        </p>
                                        
                                        <p style="color: #a0aec0; font-size: 12px; line-height: 1.5; margin: 0;">
                                            123 Education Street, Learning City, LC 12345<br>
                                            <a href="mailto:support@edulearn.com" style="color: #3182ce; text-decoration: none;">support@edulearn.com</a> | 
                                            <a href="tel:+1234567890" style="color: #3182ce; text-decoration: none;">+1 (234) 567-890</a>
                                        </p>
                                        
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
                                            <tr>
                                                <td style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
                                                    <p style="color: #a0aec0; font-size: 11px; margin: 0;">
                                                        © 2024 EduLearn Platform. All rights reserved.<br>
                                                        <a href="#" style="color: #3182ce; text-decoration: none;">Privacy Policy</a> | 
                                                        <a href="#" style="color: #3182ce; text-decoration: none;">Terms of Service</a> | 
                                                        <a href="#" style="color: #3182ce; text-decoration: none;">Unsubscribe</a>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
