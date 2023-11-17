export const getTemplate = (name, token) => {
  switch (name) {
    case "forgetPassword":
      return (`<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
                <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="format-detection" content="date=no" />
                <meta name="format-detection" content="address=no" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="x-apple-disable-message-reformatting" />
            
                <title>Forgot Password</title>
            
                <style type="text/css" media="screen">
                    body {
                        padding: 0 !important;
                        margin: 0 !important;
                        display: block !important;
                        min-width: 100% !important;
                        width: 100% !important;
                        background: #ffffff;
                        -webkit-text-size-adjust: none
                    }
            
                    a {
                        color: #4e54cb;
                        text-decoration: none
                    }
            
                    p {
                        padding: 0 !important;
                        margin: 0 !important
                    }
            
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
                    .table-border{
                        border: 0.3px solid #D89641;
                        border-radius: 10px;
                        background-color: #F7EAD9;
                    }
            
                    /* Mobile styles */
                    @media only screen and (max-device-width: 640px),
                    only screen and (max-width: 640px) {
                        .mobile-shell {
                            width: 100% !important;
                            min-width: 100% !important;
                        }
                    }
            
                    @media only screen and (max-device-width: 480px),
                    only screen and (max-width: 480px) {
                        .mobile-shell {
                            width: 100% !important;
                            min-width: 100% !important;
                        }
            
                        .m-center {
                            text-align: center !important;
                        }
            
                        .m-left {
                            margin-right: auto !important;
                        }
            
                        .center {
                            margin: 0 auto !important;
                        }
            
                        .td {
                            width: 100% !important;
                            min-width: 100% !important;
                        }
                        img{
                            max-width: 100%;
                            height: auto;
                        }
                        .border-hide{
                            border: none !important;
                        }
            
                        .column,
                        .column-dir,
                        .column-top,
                        .column-empty,
                        .column-empty2,
                        .column-bottom,
                        .column-dir-top,
                        .column-dir-bottom {
                            float: left !important;
                            width: 100% !important;
                            display: block !important;
                        }
            
                        .column-empty {
                            padding-bottom: 20px !important;
                        }
            
                        .column-empty2 {
                            padding-bottom: 10px !important;
                        }
            
                        .content-spacing {
                            width: 15px !important;
                        }
                    }
                </style>
            </head>
            
            <body>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                    <tr>
                        <td align="center" valign="top">
                            <table width="600" border="0" cellpadding="0" cellspacing="0" bgcolor="#EEEEEE" class="mobile-shell" >
                                <tr>
                                    <td style="padding: 16px 40px 10px">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        
                                            <tr>
                                                <td>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td style="text-align: left;"><img src="http://intdes.evervent.in/designs/PHPMailer/images/logo-evervent.png" alt="" style="width: 152px;"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style="height: 21px;"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
            
                                            <tr>
                                                <td>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" >
                                                        <tr>
                                                            <td style="padding: 36px 24px 19px">
                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">                                                   
                                                                    <tr>
                                                                        <td style="text-align: center;"><img src="http://intdes.evervent.in/designs/PHPMailer/images/forgot_password_image.png" alt="" style="width: 301px;"></td>
                                                                                                        
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="height: 22px;"></td>   
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="column-top" style="font-family: 'Arial';font-style: normal;font-weight: 700;font-size: 24px; line-height: 28px; color: #000000;text-align: center;">
                                                                            Forgot Your password?
                                                                        </td> 
                                                                    </tr>
                                                                     <tr>
                                                                        <td style="height: 22px;"></td>   
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="column-top" style="font-family: Arial;font-style: normal; font-weight: 400;font-size: 14px;line-height: 22px;color: #000000; text-align: center;">
                                                                           We have sent you this email in response to your request to reset your password on EB Portal. If this is true, use the secret code to reset your password.
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="height: 20px;"></td>
                                                                    </tr>
                                                                    <tr style="text-align: center;">
                                                                         <td style="text-align: center;">
                                                                            <div>
                                                                               
                                                                            <a href="https://ebdev.evervent.in/resetpassword?token=${token}" style="background-color:#757DFF;;border-radius:5px;color:#ffffff;display:inline-block;font-size: 15px; font-family: Arial, sans-serif;font-weight:bold;line-height:20px;text-align:center;text-decoration:none;width:160px;-webkit-text-size-adjust:none;cursor: default;"> click here To reset password  </a>
                                                                       
                                                                            </div>
                                                                        </td>
                                                                        
                                                                    </tr>
                                                                     <tr>
                                                                        <td style="height: 20px;"></td>
                                                                    </tr>
                                                                     <tr>
                                                                        <td class="column-top" style="font-family: Arial;font-style: normal; font-weight: 400;font-size: 14px;line-height: 22px;color: #000000; text-align: center;">
                                                                          If you did not forgot your password you can safely ignore this email.
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td style="height: 23px;"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-family: 'Arial';font-style: normal;font-weight: 400;font-size: 11px;line-height: 16px;text-align: center;color: #000000;">We recommend that you keep your password secure and not share it with anyone. If you feel your password has been compromised, you can change it by going to setting and clicking on the "Personal Setting" link.</td>
                                                        </tr>
                                                         <tr>
                                                            <td style="height: 16px;"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-family: 'Arial';font-style: normal;font-weight: 400;font-size: 11px;line-height: 16px;text-align: center;color: #000000;">If you need help, or you have any other questions, feel free to use support section.</td>
                                                        </tr>                                          
                                                         <tr>
                                                            <td style="height: 20px;"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
            
                                            <tr>
                                                <td>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td style="border: 1px solid #000000;opacity: 0.1;"></td>
                                                        </tr>
                                                         <tr>
                                                            <td style="height: 20px;"></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="column-top"style="font-family: 'Arial';font-style: normal;font-weight: 700;font-size: 11px;line-height: 16px;text-align: center;color:#000000;">
                                                              Company Name Pvt. Ltd. <span style="display: block; font-weight: 400;">4th Floor, plot no. 341, Industrial Area, Phase 9, Mohali, Punjab, India - 160062</span>
                                                            </td>
                                                        </tr>
                                                         <tr>
                                                            <td style="height: 10px;"></td>
                                                        </tr>
                                                         <tr>
                                                              <td style="background: #E1E1E1;font-family: 'Arial';font-style: normal;font-weight: 400;font-size: 11px;line-height: 16px;text-align: center;color: #000000;padding: 10px;">Powered by <a href="#" style="font-weight: 700;color: #000000;"> Evervent Pvt. Ltd.</a></td>
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
            </body>`)
      break;

    case "RESET_PASSWORD":
      return (`<!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="format-detection" content="date=no" />
            <meta name="format-detection" content="address=no" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="x-apple-disable-message-reformatting" />
        
            <title>Confirmation Mail</title>
        
            <style type="text/css" media="screen">
                body {
                    padding: 0 !important;
                    margin: 0 !important;
                    display: block !important;
                    min-width: 100% !important;
                    width: 100% !important;
                    background: #ffffff;
                    -webkit-text-size-adjust: none
                }
        
                a {
                    color: #4e54cb;
                    text-decoration: none
                }
        
                p {
                    padding: 0 !important;
                    margin: 0 !important
                }
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
                .table-border{
                    border: 0.3px solid #D89641;
                    border-radius: 10px;
                    background-color: #F7EAD9;
                }
        
                @media only screen and (max-device-width: 640px),
                only screen and (max-width: 640px) {
                    .mobile-shell {
                        width: 100% !important;
                        min-width: 100% !important;
                    }
                }
        
                @media only screen and (max-device-width: 480px),
                only screen and (max-width: 480px) {
                    .mobile-shell {
                        width: 100% !important;
                        min-width: 100% !important;
                    }
        
                    .m-center {
                        text-align: center !important;
                    }
        
                    .m-left {
                        margin-right: auto !important;
                    }
        
                    .center {
                        margin: 0 auto !important;
                    }
        
                    .td {
                        width: 100% !important;
                        min-width: 100% !important;
                    }
                    img{
                        max-width: 100%;
                        height: auto;
                    }
                    .border-hide{
                        border: none !important;
                    }
        
                    .column,
                    .column-dir,
                    .column-top,
                    .column-empty,
                    .column-empty2,
                    .column-bottom,
                    .column-dir-top,
                    .column-dir-bottom {
                        float: left !important;
                        width: 100% !important;
                        display: block !important;
                    }
        
                    .column-empty {
                        padding-bottom: 20px !important;
                    }
        
                    .column-empty2 {
                        padding-bottom: 10px !important;
                    }
        
                    .content-spacing {
                        width: 15px !important;
                    }
                }
            </style>
        </head>
        
        <body>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                <tr>
                    <td align="center" valign="top">
                        <table width="600" border="0" cellpadding="0" cellspacing="0" bgcolor="#EEEEEE" class="mobile-shell" >
                            <tr>
                                <td style="padding: 16px 40px 10px">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td style="text-align: left;"><img src="http://intdes.evervent.in/designs/PHPMailer/images/logo-evervent.png" alt="" style="width: 152px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="height: 21px;"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" >
                                                    <tr>
                                                        <td style="padding: 30px 24px">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">                                                   
                                                                <tr>
                                                                    <td style="text-align: center;"><img src="http://intdes.evervent.in/designs/PHPMailer/images/confirmation_image.png" alt="" style="width: 120px;"></td>
                                                                                                    
                                                                </tr>
                                                                <tr>
                                                                    <td style="height: 51px;"></td>   
                                                                </tr>
                                                                <tr>
                                                                    <td class="column-top" style="font-family: 'Arial';font-style: normal;font-weight: 700;font-size: 24px; line-height: 28px; color: #000000;text-align: center;">
                                                                        Reset Password Confirmation
                                                                    </td> 
                                                                </tr>
                                                                 <tr>
                                                                    <td style="height: 22px;"></td>   
                                                                </tr>
                                                                <tr>
                                                                    <td class="column-top" style="font-family: Arial;font-style: normal; font-weight: 400;font-size: 14px;line-height: 22px;color: #000000; text-align: center;">
                                                                      Your password has been reset. Please click the button to go back. 
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="height: 20px;"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="text-align: center;">
                                                                        <div>
                                                                            <a href="https://ebdev.evervent.in/" style="background-color:#757DFF;;border-radius:5px;color:#ffffff;display:inline-block;font-size: 20px; font-family: Arial, sans-serif;font-weight:bold;line-height:43px;text-align:center;text-decoration:none;width:107px;-webkit-text-size-adjust:none;">Log In</a>
                                                                        </div>
                                                                    </td>
                                                                </tr>                                                                                                               
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td style="height: 30px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-family: 'Arial';font-style: normal;font-weight: 400;font-size: 11px;line-height: 16px;text-align: center;color: #000000;">We recommend that you keep your password secure and not share it with anyone. If you feel your password has been compromised, you can change it by going to setting and clicking on the "Personal Setting" link.</td>
                                                    </tr>
                                                     <tr>
                                                        <td style="height: 16px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-family: 'Arial';font-style: normal;font-weight: 400;font-size: 11px;line-height: 16px;text-align: center;color: #000000;">If you need help, or you have any other questions, feel free to use support section.</td>
                                                    </tr>                                          
                                                     <tr>
                                                        <td style="height: 20px;"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td style="border: 1px solid #000000;opacity: 0.1;"></td>
                                                    </tr>
                                                     <tr>
                                                        <td style="height: 20px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="column-top"style="font-family: 'Arial';font-style: normal;font-weight: 700;font-size: 11px;line-height: 16px;text-align: center;color:#000000;">
                                                          Company Name Pvt. Ltd. <span style="display: block; font-weight: 400;">4th Floor, plot no. 341, Industrial Area, Phase 9, Mohali, Punjab, India - 160062</span>
                                                        </td>
                                                    </tr>
                                                     <tr>
                                                        <td style="height: 10px;"></td>
                                                    </tr>
                                                     <tr>
                                                        <td style="background: #E1E1E1;font-family: 'Arial';font-style: normal;font-weight: 400;font-size: 11px;line-height: 16px;text-align: center;color: #000000;padding: 10px;">Powered by <a href="#" style="font-weight: 700;color: #000000;"> Evervent Pvt. Ltd.</a></td>
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
                    </body>`)
      break;

    case "ACTIVATE_CLIENT":
      return (`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
            "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><meta content="width=device-width, initial-scale=1" name="viewport"><title>PropTec  Email</title><!-- Designed by https://github.com/kaytcat --><!-- Robot header image designed by Freepik.com --><style type="text/css">
              @import url(https://fonts.googleapis.com/css?family=Nunito);
            
              /* Take care of image borders and formatting */
            
              img {
                max-width: 600px;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
              }
              html{
                margin: 0;
                padding:0;
              }
            
              a {
                text-decoration: none;
                border: 0;
                outline: none;
                color: #bbbbbb;
              }
            
              a img {
                border: none;
              }
            
              /* General styling */
            
              td, h1, h2, h3  {
                font-family: Helvetica, Arial, sans-serif;
                font-weight: 400;
              }
            
              td {
                text-align: center;
              }
            
              body {
                -webkit-font-smoothing:antialiased;
                -webkit-text-size-adjust:none;
                width: 100%;
                height: 100%;
                color: #666;
                background: #fff;
                font-size: 16px;
                height: 100vh;
                width: 100%;
                padding: 0px;
                margin: 0px;
              }
            
               table {
                border-collapse: collapse !important;
              }
            
              .headline {
                color: #444;
                font-size: 36px;
              }
            
             .force-full-width {
              width: 100% !important;
             }
            
            
              </style><style media="screen" type="text/css">
                  @media screen {
                    td, h1, h2, h3 {
                      font-family: 'Nunito', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                    }
                  }
              </style><style media="only screen and (max-width: 480px)" type="text/css">
                /* Mobile styles */
                @media only screen and (max-width: 480px) {
            
                  table[class="w320"] {
                    width: 320px !important;
                  }
                }
              </style>
              <style type="text/css"></style>
              
              </head>
              <body bgcolor="#fff" class="body" style="padding:20px; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none">
            <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
            <tbody><tr>
            <td align="center" bgcolor="#fff" class="" valign="top" width="100%">
            <center class=""><table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
            <tbody><tr>
            <td align="center" class="" valign="top"><table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
            </table>
            <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="" style="margin: 0 auto; width: 100%; margin-top: 100px;">
            <tbody style="margin-top: 15px;">
              <tr class="">
            <td class="">
            <img alt="robot picture" class="" height="115" src="https://ebdev.evervent.in/images/eb_logo.svg" width="115">
            </td>
            </tr>
            <tr class=""><td class="headline">Welcome to EB </td></tr>
            <tr>
            <td>
            <center class=""><table cellpadding="0" cellspacing="0" class="" style="margin: 0 auto;" width="75%"><tbody class=""><tr class="">
            <td class="" style="color:#444; font-weight: 400;"><br><br>
             A policy management system that helps you manage your claims, endorsments with ease and efficiency. <br><br>
              You have successfully been registered to use Employee Benefit as a <em>Employer</em><br>
             <br>
              Your login credentials are provided below:
            <br>
            <span style="font-weight:bold;">Email: &nbsp;</span><span style="font-weight:lighter;" class="">${token.organisationEmail}</span> 
             <br>
              <span style="font-weight:bold;">Password: &nbsp;</span><span style="font-weight:lighter;" class="">${token.genratePassword}</span>
            <br><br>  
            <br></td>
            </tr>
            </tbody></table></center>
            </td>
            </tr>
            <tr>
            <td class="">
            <div class="">
            <a style="background-color:#0a5dc2;border-radius:4px;color:#fff;display:inline-block;font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:normal;line-height:50px;text-align:center;text-decoration:none;width:350px;-webkit-text-size-adjust:none;" href="https://ebdev.evervent.in/">Visit Account and Start Managing</a>
            </div>
             <br>
            </td>
            </tr>
            </tbody>
              
              </table>
            
            <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="force-full-width" style="margin: 0 auto; margin-bottom: 5px:">
            <tbody>
            <tr>
            <td class="" style="color:#444;
                                ">
            <p>The password was auto-generated, however feel free to change it 
              
                <a href="https://ebdev.evervent.in/" style="text-decoration: underline;">
                  here</a>
              
              </p>
              </td>
            </tr>
            </tbody></table></td>
            </tr>
            </tbody></table></center>
            </td>
            </tr>
            </tbody></table>
            </body></html>`)

    case "DEACTIVATE_CLIENT":
      return (`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
            "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><meta content="width=device-width, initial-scale=1" name="viewport"><title>PropTec  Email</title><!-- Designed by https://github.com/kaytcat --><!-- Robot header image designed by Freepik.com --><style type="text/css">
              @import url(https://fonts.googleapis.com/css?family=Nunito);
            
              /* Take care of image borders and formatting */
            
              img {
                max-width: 600px;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
              }
              html{
                margin: 0;
                padding:0;
              }
            
              a {
                text-decoration: none;
                border: 0;
                outline: none;
                color: #bbbbbb;
              }
            
              a img {
                border: none;
              }
            
              /* General styling */
            
              td, h1, h2, h3  {
                font-family: Helvetica, Arial, sans-serif;
                font-weight: 400;
              }
            
              td {
                text-align: center;
              }
            
              body {
                -webkit-font-smoothing:antialiased;
                -webkit-text-size-adjust:none;
                width: 100%;
                height: 100%;
                color: #666;
                background: #fff;
                font-size: 16px;
                height: 100vh;
                width: 100%;
                padding: 0px;
                margin: 0px;
              }
            
               table {
                border-collapse: collapse !important;
              }
            
              .headline {
                color: #444;
                font-size: 36px;
              }
            
             .force-full-width {
              width: 100% !important;
             }
            
            
              </style><style media="screen" type="text/css">
                  @media screen {
                    td, h1, h2, h3 {
                      font-family: 'Nunito', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                    }
                  }
              </style><style media="only screen and (max-width: 480px)" type="text/css">
                /* Mobile styles */
                @media only screen and (max-width: 480px) {
            
                  table[class="w320"] {
                    width: 320px !important;
                  }
                }
              </style>
              <style type="text/css"></style>
              
              </head>
              <body bgcolor="#fff" class="body" style="padding:20px; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none">
            <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
            <tbody><tr>
            <td align="center" bgcolor="#fff" class="" valign="top" width="100%">
            <center class=""><table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
            <tbody><tr>
            <td align="center" class="" valign="top"><table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
            </table>
            <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="" style="margin: 0 auto; width: 100%; margin-top: 100px;">
            <tbody style="margin-top: 15px;">
              <tr class="">
            <td class="">
            <img alt="robot picture" class="" height="115" src="https://ebdev.evervent.in/images/eb_logo.svg" width="115">
            </td>
            </tr>
            <tr class=""><td class="headline">We're sad to see you go </td></tr>
            <tr>
            <td><br>
            <center class=""><table cellpadding="0" cellspacing="0" class="" style="margin: 0 auto;" width="75%"><tbody class=""><tr class="">
            <td class="" style="color:#444; font-weight: 400;">
              Your <em>Employer</em> account have been deactivated of Employee Benefit<br>
            <br><br>  
            <br></td>
            </tr>
            </tbody></table></center>
            </td>
            </tr>
            <tr>
            <td class="">
            <div class="">
            </div>
             <br>
            </td>
            </tr>
            </tbody>
              
              </table>
            
            <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="force-full-width" style="margin: 0 auto; margin-bottom: 5px:">
            <tbody>
            <tr>
            <td class="" style="color:#444;
                                ">
              </td>
            </tr>
            </tbody></table></td>
            </tr>
            </tbody></table></center>
            </td>
            </tr>
            </tbody></table>
            </body></html>`)

    case "ACTIVATE_EMPLOYEE":
      return (`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
                "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><meta content="width=device-width, initial-scale=1" name="viewport"><title>PropTec  Email</title><!-- Designed by https://github.com/kaytcat --><!-- Robot header image designed by Freepik.com --><style type="text/css">
                  @import url(https://fonts.googleapis.com/css?family=Nunito);
                
                  /* Take care of image borders and formatting */
                
                  img {
                    max-width: 600px;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                  }
                  html{
                    margin: 0;
                    padding:0;
                  }
                
                  a {
                    text-decoration: none;
                    border: 0;
                    outline: none;
                    color: #bbbbbb;
                  }
                
                  a img {
                    border: none;
                  }
                
                  /* General styling */
                
                  td, h1, h2, h3  {
                    font-family: Helvetica, Arial, sans-serif;
                    font-weight: 400;
                  }
                
                  td {
                    text-align: center;
                  }
                
                  body {
                    -webkit-font-smoothing:antialiased;
                    -webkit-text-size-adjust:none;
                    width: 100%;
                    height: 100%;
                    color: #666;
                    background: #fff;
                    font-size: 16px;
                    height: 100vh;
                    width: 100%;
                    padding: 0px;
                    margin: 0px;
                  }
                
                   table {
                    border-collapse: collapse !important;
                  }
                
                  .headline {
                    color: #444;
                    font-size: 36px;
                  }
                
                 .force-full-width {
                  width: 100% !important;
                 }
                
                
                  </style><style media="screen" type="text/css">
                      @media screen {
                        td, h1, h2, h3 {
                          font-family: 'Nunito', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                        }
                      }
                  </style><style media="only screen and (max-width: 480px)" type="text/css">
                    /* Mobile styles */
                    @media only screen and (max-width: 480px) {
                
                      table[class="w320"] {
                        width: 320px !important;
                      }
                    }
                  </style>
                  <style type="text/css"></style>
                  
                  </head>
                  <body bgcolor="#fff" class="body" style="padding:20px; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none">
                <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
                <tbody><tr>
                <td align="center" bgcolor="#fff" class="" valign="top" width="100%">
                <center class=""><table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
                <tbody><tr>
                <td align="center" class="" valign="top"><table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
                </table>
                <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="" style="margin: 0 auto; width: 100%; margin-top: 100px;">
                <tbody style="margin-top: 15px;">
                  <tr class="">
                <td class="">
                <img alt="robot picture" class="" height="115" src="https://ebdev.evervent.in/images/eb_logo.svg" width="115">
                </td>
                </tr>
                <tr class=""><td class="headline">Welcome to EB </td></tr>
                <tr>
                <td>
                <center class=""><table cellpadding="0" cellspacing="0" class="" style="margin: 0 auto;" width="75%"><tbody class=""><tr class="">
                <td class="" style="color:#444; font-weight: 400;"><br><br>
                 A policy management system that helps you manage your claims, endorsments with ease and efficiency. <br><br>
                  You have successfully been registered to use Employee Benefit as a <em>Employee</em><br>
                 <br>
                  Your login credentials are provided below:
                <br>
                <span style="font-weight:bold;">Email: &nbsp;</span><span style="font-weight:lighter;" class="">${token.organisationEmail}</span> 
                 <br>
                  <span style="font-weight:bold;">Password: &nbsp;</span><span style="font-weight:lighter;" class="">${token.genratePassword}</span>
                <br><br>  
                <br></td>
                </tr>
                </tbody></table></center>
                </td>
                </tr>
                <tr>
                <td class="">
                <div class="">
                <a style="background-color:#0a5dc2;border-radius:4px;color:#fff;display:inline-block;font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:normal;line-height:50px;text-align:center;text-decoration:none;width:350px;-webkit-text-size-adjust:none;" href="https://ebdev.evervent.in/">Visit Account and Start Managing</a>
                </div>
                 <br>
                </td>
                </tr>
                </tbody>
                  
                  </table>
                
                <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="force-full-width" style="margin: 0 auto; margin-bottom: 5px:">
                <tbody>
                <tr>
                <td class="" style="color:#444;
                                    ">
                <p>The password was auto-generated, however feel free to change it 
                  
                    <a href="https://ebdev.evervent.in/" style="text-decoration: underline;">
                      here</a>
                  
                  </p>
                  </td>
                </tr>
                </tbody></table></td>
                </tr>
                </tbody></table></center>
                </td>
                </tr>
                </tbody></table>
                </body></html>`)

    case "DEACTIVATE_EMPLOYEE":
      return (`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
                "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><meta content="width=device-width, initial-scale=1" name="viewport"><title>PropTec  Email</title><!-- Designed by https://github.com/kaytcat --><!-- Robot header image designed by Freepik.com --><style type="text/css">
                  @import url(https://fonts.googleapis.com/css?family=Nunito);
                
                  /* Take care of image borders and formatting */
                
                  img {
                    max-width: 600px;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                  }
                  html{
                    margin: 0;
                    padding:0;
                  }
                
                  a {
                    text-decoration: none;
                    border: 0;
                    outline: none;
                    color: #bbbbbb;
                  }
                
                  a img {
                    border: none;
                  }
                
                  /* General styling */
                
                  td, h1, h2, h3  {
                    font-family: Helvetica, Arial, sans-serif;
                    font-weight: 400;
                  }
                
                  td {
                    text-align: center;
                  }
                
                  body {
                    -webkit-font-smoothing:antialiased;
                    -webkit-text-size-adjust:none;
                    width: 100%;
                    height: 100%;
                    color: #666;
                    background: #fff;
                    font-size: 16px;
                    height: 100vh;
                    width: 100%;
                    padding: 0px;
                    margin: 0px;
                  }
                
                   table {
                    border-collapse: collapse !important;
                  }
                
                  .headline {
                    color: #444;
                    font-size: 36px;
                  }
                
                 .force-full-width {
                  width: 100% !important;
                 }
                
                
                  </style><style media="screen" type="text/css">
                      @media screen {
                        td, h1, h2, h3 {
                          font-family: 'Nunito', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                        }
                      }
                  </style><style media="only screen and (max-width: 480px)" type="text/css">
                    /* Mobile styles */
                    @media only screen and (max-width: 480px) {
                
                      table[class="w320"] {
                        width: 320px !important;
                      }
                    }
                  </style>
                  <style type="text/css"></style>
                  
                  </head>
                  <body bgcolor="#fff" class="body" style="padding:20px; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none">
                <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
                <tbody><tr>
                <td align="center" bgcolor="#fff" class="" valign="top" width="100%">
                <center class=""><table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
                <tbody><tr>
                <td align="center" class="" valign="top"><table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
                </table>
                <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="" style="margin: 0 auto; width: 100%; margin-top: 100px;">
                <tbody style="margin-top: 15px;">
                  <tr class="">
                <td class="">
                <img alt="robot picture" class="" height="115" src="https://ebdev.evervent.in/images/eb_logo.svg" width="115">
                </td>
                </tr>
                <tr class=""><td class="headline">We're sad to see you go </td></tr>
                <tr>
                <td><br>
                <center class=""><table cellpadding="0" cellspacing="0" class="" style="margin: 0 auto;" width="75%"><tbody class=""><tr class="">
                <td class="" style="color:#444; font-weight: 400;">
                  Your <em>Employee</em> account have been deactivated of Employee Benefit<br>
                <br><br>  
                <br></td>
                </tr>
                </tbody></table></center>
                </td>
                </tr>
                <tr>
                <td class="">
                <div class="">
                </div>
                 <br>
                </td>
                </tr>
                </tbody>
                  
                  </table>
                
                <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="force-full-width" style="margin: 0 auto; margin-bottom: 5px:">
                <tbody>
                <tr>
                <td class="" style="color:#444;
                                    ">
                  </td>
                </tr>
                </tbody></table></td>
                </tr>
                </tbody></table></center>
                </td>
                </tr>
                </tbody></table>
                </body></html>`)

    case "ACTIVATE_EMPLOYEESS":
      return (`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
                      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                      <html xmlns="http://www.w3.org/1999/xhtml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><meta content="width=device-width, initial-scale=1" name="viewport"><title>PropTec  Email</title><!-- Designed by https://github.com/kaytcat --><!-- Robot header image designed by Freepik.com --><style type="text/css">
                        @import url(https://fonts.googleapis.com/css?family=Nunito);
                      
                        /* Take care of image borders and formatting */
                      
                        img {
                          max-width: 600px;
                          outline: none;
                          text-decoration: none;
                          -ms-interpolation-mode: bicubic;
                        }
                        html{
                          margin: 0;
                          padding:0;
                        }
                      
                        a {
                          text-decoration: none;
                          border: 0;
                          outline: none;
                          color: #bbbbbb;
                        }
                      
                        a img {
                          border: none;
                        }
                      
                        /* General styling */
                      
                        td, h1, h2, h3  {
                          font-family: Helvetica, Arial, sans-serif;
                          font-weight: 400;
                        }
                      
                        td {
                          text-align: center;
                        }
                      
                        body {
                          -webkit-font-smoothing:antialiased;
                          -webkit-text-size-adjust:none;
                          width: 100%;
                          height: 100%;
                          color: #666;
                          background: #fff;
                          font-size: 16px;
                          height: 100vh;
                          width: 100%;
                          padding: 0px;
                          margin: 0px;
                        }
                      
                         table {
                          border-collapse: collapse !important;
                        }
                      
                        .headline {
                          color: #444;
                          font-size: 36px;
                        }
                      
                       .force-full-width {
                        width: 100% !important;
                       }
                      
                      
                        </style><style media="screen" type="text/css">
                            @media screen {
                              td, h1, h2, h3 {
                                font-family: 'Nunito', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                              }
                            }
                        </style><style media="only screen and (max-width: 480px)" type="text/css">
                          /* Mobile styles */
                          @media only screen and (max-width: 480px) {
                      
                            table[class="w320"] {
                              width: 320px !important;
                            }
                          }
                        </style>
                        <style type="text/css"></style>
                        
                        </head>
                        <body bgcolor="#fff" class="body" style="padding:20px; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none">
                      <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
                      <tbody><tr>
                      <td align="center" bgcolor="#fff" class="" valign="top" width="100%">
                      <center class=""><table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
                      <tbody><tr>
                      <td align="center" class="" valign="top"><table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
                      </table>
                      <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="" style="margin: 0 auto; width: 100%; margin-top: 100px;">
                      <tbody style="margin-top: 15px;">
                        <tr class="">
                      <td class="">
                      <img alt="robot picture" class="" height="115" src="https://ebdev.evervent.in/images/eb_logo.svg" width="115">
                      </td>
                      </tr>
                      <tr class=""><td class="headline">Welcome to EB </td></tr>
                      <tr>
                      <td>
                      <center class=""><table cellpadding="0" cellspacing="0" class="" style="margin: 0 auto;" width="75%"><tbody class=""><tr class="">
                      <td class="" style="color:#444; font-weight: 400;"><br><br>
                       A policy management system that helps you manage your claims, endorsments with ease and efficiency. <br><br>
                        Employee Portal for your Employee's has been activated.
                      <br><br>  
                      <br></td>
                      </tr>
                      </tbody></table></center>
                      </td>
                      </tr>
                      <tr>
                      <td class="">
                       <br>
                      </td>
                      </tr>
                      </tbody>
                        
                        </table>
                      
                      <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="force-full-width" style="margin: 0 auto; margin-bottom: 5px:">
                      <tbody>
                      <tr>
                      <td class="" style="color:#444;
                                          ">
      
                        </td>
                      </tr>
                      </tbody></table></td>
                      </tr>
                      </tbody></table></center>
                      </td>
                      </tr>
                      </tbody></table>
                      </body></html>`)

    case "START_ENROLMENT": 
            return (`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
            "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><meta content="width=device-width, initial-scale=1" name="viewport"><title>PropTec  Email</title><!-- Designed by https://github.com/kaytcat --><!-- Robot header image designed by Freepik.com --><style type="text/css">
              @import url(https://fonts.googleapis.com/css?family=Nunito);
            
              /* Take care of image borders and formatting */
            
              img {
                max-width: 600px;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
              }
              html{
                margin: 0;
                padding:0;
              }
            
              a {
                text-decoration: none;
                border: 0;
                outline: none;
                color: #bbbbbb;
              }
            
              a img {
                border: none;
              }
            
              /* General styling */
            
              td, h1, h2, h3  {
                font-family: Helvetica, Arial, sans-serif;
                font-weight: 400;
              }
            
              td {
                text-align: center;
              }
            
              body {
                -webkit-font-smoothing:antialiased;
                -webkit-text-size-adjust:none;
                width: 100%;
                height: 100%;
                color: #666;
                background: #fff;
                font-size: 16px;
                height: 100vh;
                width: 100%;
                padding: 0px;
                margin: 0px;
              }
            
               table {
                border-collapse: collapse !important;
              }
            
              .headline {
                color: #444;
                font-size: 36px;
              }
            
             .force-full-width {
              width: 100% !important;
             }
            
            
              </style><style media="screen" type="text/css">
                  @media screen {
                    td, h1, h2, h3 {
                      font-family: 'Nunito', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                    }
                  }
              </style><style media="only screen and (max-width: 480px)" type="text/css">
                /* Mobile styles */
                @media only screen and (max-width: 480px) {
            
                  table[class="w320"] {
                    width: 320px !important;
                  }
                }
              </style>
              <style type="text/css"></style>
              
              </head>
              <body bgcolor="#fff" class="body" style="padding:20px; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none">
            <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
            <tbody><tr>
            <td align="center" bgcolor="#fff" class="" valign="top" width="100%">
            <center class=""><table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
            <tbody><tr>
            <td align="center" class="" valign="top"><table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
            </table>
            <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="" style="margin: 0 auto; width: 100%; margin-top: 100px;">
            <tbody style="margin-top: 15px;">
              <tr class="">
            <td class="">
            <img alt="robot picture" class="" height="115" src="https://ebdev.evervent.in/images/eb_logo.svg" width="115">
            </td>
            </tr>
            <tr class=""><td class="headline">Welcome to EB </td></tr>
            <tr>
            <td>
            <center class=""><table cellpadding="0" cellspacing="0" class="" style="margin: 0 auto;" width="75%"><tbody class=""><tr class="">
            <td class="" style="color:#444; font-weight: 400;"><br><br>
             A policy management system that helps you manage your claims, endorsments with ease and efficiency. <br><br>
              You have successfully been registered to use Employee Benefit as an <em>Employee</em><br>
            
            <br><br>  
            <br></td>
            </tr>
            </tbody></table></center>
            </td>
            </tr>
            <tr>
            <td class="">
            <div class="">
            <a style="background-color:#0a5dc2;border-radius:4px;color:#fff;display:inline-block;font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:normal;line-height:50px;text-align:center;text-decoration:none;width:350px;-webkit-text-size-adjust:none;" href="https://ebdev.evervent.in/enrollment?token=${token}">Start Enrolment Journey</a>
            </div>
             <br>
            </td>
            </tr>
            </tbody>
              
              </table>
            
            <table bgcolor="#fff" cellpadding="0" cellspacing="0" class="force-full-width" style="margin: 0 auto; margin-bottom: 5px:">
            <tbody>
            <tr>
            <td class="" style="color:#444;
                                ">
            
              </td>
            </tr>
            </tbody></table></td>
            </tr>
            </tbody></table></center>
            </td>
            </tr>
            </tbody></table>
            </body></html>`)
    default:
      return
      break;
  }

}