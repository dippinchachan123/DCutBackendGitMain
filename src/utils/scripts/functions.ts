import fs from "fs";
import path from 'path';
import crypto from 'crypto';
import * as fileType from 'file-type';
import nodeMailer from "nodemailer";
//import { getTemplate } from "../mailtemplates/supportTemplate";
import { getTemplate } from "../mailtemplates/authTemplate";
import moment from "moment";



const transport = nodeMailer.createTransport({
  host: 'smtpcp.evervent.in',
  port: 587,
  secure: false, // true for 465, false for other ports
  // TLS : 'True',
  auth: {
    user: 'noreply@evervent.in',
    pass: 'hpn4fiW_3k',
  },
});

export const ValidateJoiObjectId = (message = 'valid id') => {
  const joi = require("joi");
  return joi.string().regex(/^[0-9a-fA-F]{24}$/, message)
}

export const ValidateJoiObjectIdRequired = (message = 'valid id') => {
  const joi = require("joi");
  return joi.string().required().regex(/^[0-9a-fA-F]{24}$/, message)
}

export const genrateLink = (host, filename) => {
  if (host === "127.0.0.1:3082") {
    return `http://127.0.0.1:3082/api/global/getImage?image=${filename}`
  } else if (host === "ebdevnodebackend.evervent.in") {
    return `https://ebdevnodebackend.evervent.in/api/global/getImage?image=${filename}`
  }
}

// Validator function
export const isValidObjectId = (id) => {
  const ObjectId = require('mongoose').Types.ObjectId;
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id)
      return true;
    return false;
  }
  return false;
}

export const base64toBuffer = (base64Data, host) => {
  return new Promise(async (resolve, reject) => {
    let data = await decodeBase64String(base64Data);

    //const fileName = `${crypto.randomBytes(10).toString('hex')}.${data.ext}`;
    let b64string = base64Data;
    let buf = Buffer.from(b64string, 'base64');

    const fileInfo = await fileType.fromBuffer(buf);
    console.log(fileInfo)
    if (fileInfo === undefined || data === null) return resolve(false);
    const fileName = `${crypto.randomBytes(10).toString('hex')}.${fileInfo.ext}`;
    const filePath = path.join(__dirname, `../../views/uploads/${fileName}`);

    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFile(filePath, buf, (err) => {
      if (err) {
        console.log('Error While Uploading file: ', err);
        return reject(err);
      } else {
        const link = genrateLink(host, fileName);
        console.log('File Uploaded successfully!')
        return resolve(link);
      }
    });
  });
}

export const generateUniqueId = (preFix: string) => {
  const prefix = preFix;
  const uniqueNumber = Math.random().toString().substr(2, 8);
  return prefix + uniqueNumber;
}

export const getThirdPartyData = async (url: string) => {
  let data = await fetch(url);
  let jsonResponse = await data.json();
  return jsonResponse;
}

async function decodeBase64String(dataString: string) {

  try {
    let matches = dataString.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/);
    let getExtension = dataString.match(/[^:/]\w+(?=;|,)/);
    let response: any = {};
    if (matches?.length !== 3) {
      return false;
    }
    response.ext = getExtension;
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    return response;

  } catch (e) {
    return false;
  }

}


export const raiseTicket = async (data: any) => {
  try {
    
    
    const template = await getTemplate('support', data);
    let attachments = [];
    if (data.upload.toString().length !== 0) {
      attachments.push({
        filename: 'my-image.png',
        path: `${data.upload}`,
        cid: 'my-image' // same cid value as in the html img src
      });
    }
    // console.log("da",data);
    const mailOptions = {
      from: 'Evervent <noreply@evervent.in>',
      to: data.username,
      subject: `${data.reasons}- Support Ticket - ${data.ticketId}`,
      html: template,
      attachments,

    };
// console.log("op",template);

    await transport.sendMail(mailOptions, (err: any, result: any) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    });
  } catch (error) {
    console.log(error);
    return
  }
};

export const sendActivateClientMail = async (isEnabled: boolean, data: { organisationEmail: string, genratePassword: string }) => {
  try {
    const template = await getTemplate('ACTIVATE_CLIENT', data);
    if (isEnabled) {
      const mailOptions = {
        from: 'Evervent <noreply@evervent.in>',
        to: data.organisationEmail,
        subject: `Welcome Aboard`,
        html: template,
      };
      await transport.sendMail(mailOptions, (err: any, result: any) => {
        if (err) {
          return err;
        } else {
          return result;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}


export const sendDeActivateClientMail = async (email: string) => {
  try {
    const template = await getTemplate('DEACTIVATE_CLIENT', {});
    const mailOptions = {
      from: 'Evervent <noreply@evervent.in>',
      to: email,
      subject: `Account Deactivated`,
      html: template,
    };
    await transport.sendMail(mailOptions, (err: any, result: any) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    });
  }
  catch (error) {
    console.log(error);
  }
}


export const formatDate = (obj, format) => {
  if (!format) {
    return { ...obj };
  } else {
    const date = new Date(obj["Date Of Birth"]);
    const options: any = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
      //   hour12: false
    };
    const formattedDate = date.toLocaleString('en-US', options);
    if (format === 'MM/DD/YYYY') {
      const [datePart, timePart] = formattedDate.split(',');
      const [date, time] = datePart.split(' ');
      const [month, day, year] = date.split('/');
      const formattedDob = `${month}/${day}/${year}`;
      const formattedDateStr = formattedDob; // No need to convert to string
      // delete obj['Date Of Birth'];
      return { ...obj, "Date Of Birth": formattedDateStr };
    } else if (format === 'YYYY/MM/DD') {
      const [datePart, timePart] = formattedDate.split(',');
      const [date, time] = datePart.split(' ');
      const [month, day, year] = date.split('/');
      const formattedDob = `${year}/${month}/${day}`;
      const formattedDateStr = formattedDob; // No need to convert to string
      return { ...obj, "Date Of Birth": formattedDateStr };
    } else if (format === 'MM-DD-YYYY') {
      const [datePart, timePart] = formattedDate.split(',');
      const [date, time] = datePart.split(' ');
      const [month, day, year] = date.split('/');
      const formattedDob = `${month}-${day}-${year}`;
      const formattedDateStr = formattedDob; // No need to convert to string
      // delete obj['Date Of Birth'];
      return { ...obj, "Date Of Birth": formattedDateStr };
    } else if (format === 'DD-MM-YYYY') {
      const [datePart, timePart] = formattedDate.split(',');
      const [date, time] = datePart.split(' ');
      const [day, month, year] = date.split('/');
      const formattedDob = `${day}-${month}-${year}`;

      const formattedDateStr = formattedDob; // No need to convert to string

      // delete obj['Date Of Birth'];
      const updatedObj = { ...obj, "Date Of Birth": formattedDateStr };
      return updatedObj;
    }
    else if (format === 'YYYY-MM-DD') {
      const [datePart, timePart] = formattedDate.split(',');
      const [date, time] = datePart.split(' ');
      const [month, day, year] = date.split('/');
      const formattedDob = `${year}-${month}-${day}`;
      const formattedDateStr = formattedDob; // No need to convert to string
      return { ...obj, "Date Of Birth": formattedDateStr };
    } else {
      const formattedDateStr = formattedDate // Convert to string
      return { ...obj, "Date Of Birth": formattedDateStr };
    }
  }
}


// This function validates an email address using regular expression
function validateEmail(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}
// Function to validate phone number
function validatePhone(phone) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
}
// Function to validate date
function validateDate(date) {
  return moment(date, ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD', 'DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD', 'dd/mm/yyyy', 'mm/dd/yyyy', 'yyyy/mm/dd', 'dd-mm-yyyy', 'mm-dd-yyyy', 'yyyy-mm-dd'], true).isValid();
}


export const validateData = (data, requiredKeys) => {

  const invalidKeys = [];
  for (const key of requiredKeys) {
    // Validate phone numbers
    if (
      (key === 'Office Phone Number' || key === 'Mobile' || key === 'Alternate Number') &&
      !validatePhone(data[key])
    ) {
      invalidKeys.push(key);
    }
    // Validate contact number
    if (key === 'Contact Number' && !validatePhone(data[key])) {
      invalidKeys.push(key);
    }
    // Validate email addresses
    if ((key === 'Email' || key === 'Office Email') && !validateEmail(data[key])) {
      invalidKeys.push(key);
    }
    // Validate organization email
    if (key === 'Organization Email' && !validateEmail(data[key])) {
      invalidKeys.push(key);
    }
    // Validate organization phone number
    if (key === 'Organization Phone Number' && !validatePhone(data[key])) {
      invalidKeys.push(key);
    }
    // Validate email (lowercase key)
    if (key === 'email' && !validateEmail(data[key])) {
      invalidKeys.push(key);
    }
    // Validate contact number (lowercase key)
    if (key === 'contactNumber' && !validatePhone(data[key])) {
      invalidKeys.push(key);
    }
    // Validate date of birth
    if (key === 'Date Of Birth' && !validateDate(data[key])) {
      invalidKeys.push(key);
    }
  }
  if (invalidKeys.length > 0) {
    return invalidKeys;
  }
  return true;
}


/**
 * Removes duplicates from an array of objects based on specified unique fields.
 * @param {Array} arr - The array of objects to remove duplicates from.
 * @param {Array} uniqueFields - The array of fields that should be unique.
 * @returns {Object} - An object containing the filtered data (without duplicates) and the removed duplicate data.
 */
export const removeDuplicatesByFields = (arr, uniqueFields) => {
  const uniqueValues = new Set(); // Set to store unique values
  const result = []; // Array to store filtered data without duplicates
  const duplicateObjects = []; // Array to store duplicate data
  for (const obj of arr) {
    let hasDuplicate = false; // Flag to check if object has duplicates
    const duplicateKeys = []; // Array to store duplicate keys
    for (const field of uniqueFields) {
      if (field === "Alternate Number") {
        continue; // Skip checking the "Alternate Number" field
      }
      const value = obj[field];
      if (uniqueValues.has(value)) {
        hasDuplicate = true;
        duplicateKeys.push(field);
      }
      uniqueValues.add(value);
    }
    if (!hasDuplicate) {
      result.push(obj); // Add object to filtered data if it doesn't have duplicates
    } else {
      const errorMessage = `Duplicate data found for the following key(s): ${duplicateKeys.join(', ')}. Please provide unique values.`;
      duplicateObjects.push({
        message: errorMessage,
        ...obj
      }); // Add object to duplicate data with error message
    }
  }
  return {
    filteredData: result,
    removedData: duplicateObjects
  };
}



//---------------------------------------This Function Change Colume to database keys Bulk upload


// This function takes in an array of data and a title object, and returns a new array of formatted data.
function matchAndFormatData(dataArray, title) {
  const formattedData = [];
  // Loop through each data item in the dataArray
  for (const data of dataArray) {
    const formattedItem = {};
    // Loop through each key in the title object
    for (const key in title) {
      const value = title[key];
      // Check if the data item has the corresponding property
      if (data.hasOwnProperty(value)) {
        formattedItem[key] = data[value];
      } else {
        formattedItem[key] = "";
      }
    }
    // Add the formatted item to the formattedData array
    formattedData.push(formattedItem);
  }
  // Return the formattedData array
  return formattedData;
}


// This function checks if an object has any non-empty values
function hasMatchingValues(obj) {
  // Loop through each key in the object
  for (const key in obj) {
    // Check if the value is not empty
    if (obj[key] !== "") {
      return true;
    }
  }
  // Return false if no non-empty values are found
  return false;
}



/**
 * This function takes in an array of data and a title, and returns a new array with formatted data.
 * If a data item has matching values, it is returned as is. Otherwise, a new object is created with the original data item and a "No Match" property with the value "No Value".
 * @param {Array} dataArray - The array of data.
 * @param {String} title - The title to match against.
 * @returns {Array} - The new array with formatted data.
 */
export const getDataWithMatchOrKeys = (dataArray, title) => {
  // Format the data
  const formattedData = matchAndFormatData(dataArray, title);
  // Map over the formatted data
  const result = formattedData.map(dataItem => {
    if (hasMatchingValues(dataItem)) {
      // If the data item has matching values, return it as is
      return dataItem;
    } else {
      // If the data item does not have matching values, create a new object with the original data item and a "No Match" property
      return Object.assign({}, dataItem, { "No Match": "No Value" });
    }
  });
  return result;
}

export const DEPARTMENTS = "DEPARTMENTS";
export const DESIGNATIONS = "DESIGNATIONS";
export const SALARY_BRACKETS = "SALARY_BRACKETS";
// Function to find departments by keys
export const findDepartmentsByKeys = (data, createdBy) => {
  const Department = [];
  const Designation = [];
  const Salary = [];
  const keys = ["Department", "Designation", "Salary Brackets"];
  // Iterate through each object in the data array
  for (let i = 0; i < data.length; i++) {
    const obj = data[i];
    // Iterate through each key in the keys array
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      // Check if the object has the current key
      if (obj.hasOwnProperty(key)) {
        let type;
        // Determine the type based on the key
        if (key === "Department") {
          type = DEPARTMENTS;
        } else if (key === "Designation") {
          type = DESIGNATIONS;
        } else if (key === "Salary Brackets") {
          type = SALARY_BRACKETS;
        }
        // Push the corresponding value to the appropriate array
        if (key === "Department") {
          Department.push({
            type: type,
            value: obj[key].split(","),
            createdBy: createdBy.createdBy
          });
        } else if (key === "Designation") {
          Designation.push({
            type: type,
            value: obj[key].split(","),
            createdBy: createdBy.createdBy
          });
        } else if (key === "Salary Brackets") {
          Salary.push({
            type: type,
            value: obj[key],
            createdBy: createdBy.createdBy
          });
        }
      }
    }
  }
  // Return the resulting arrays
  return { Department, Designation, Salary };
}


/**
 * createDropDownOptions - Function to create dropdown options based on data
 * @param {Object} data - The data object containing fieldType, dropDownOptions, valueType, unit, and customUnitType
 * @returns {Object} - The modified data object with updated dropDownOptions and other properties
 */
export const createDropDownOptions = (data) => {
  if (data.fieldType === "Dropdown List") {
    const names = data.dropDownOptions.split(",");
    const dropDownOptions = names.map(name => {
      return {
        label: name
      };
    });
    data.valueType = "";
    data.unit = "";
    data.customUnitType = "";
    data.dropDownOptions = dropDownOptions;
    return data;
  } else if (data.valueType === "Text Only" || data.valueType === "Alphanumeric") {
    data.unit = "";
    data.customUnitType = "";
    data.dropDownOptions = [];
    return data;
  } else if (data.unit === "Free Text") {
    data.dropDownOptions = [];
    return data;
  } else {
    data.customUnitType = "";
    data.dropDownOptions = [];
    return data;
  }
}


/**
* Sends an activation email to an employee.
* @param isEnabled - A boolean indicating whether the employee is enabled or not.
* @param data - An object containing the employee's organization email and generated password.
* @returns The result of sending the email.
*/
export const sendActivateEmployeeMail = async (isEnabled: boolean, data: { organisationEmail: string, genratePassword: string }) => {
  try {
    // Get the email template
    const template = await getTemplate('ACTIVATE_EMPLOYEES', data);
    // Check if the employee is enabled
    if (isEnabled === true) {
      // Set the mail options
      const mailOptions = {
        from: 'Evervent <noreply@evervent.in>',
        to: data.organisationEmail,
        subject: 'Welcome Aboard',
        html: template,
      };
      // Send the email
      await transport.sendMail(mailOptions, (err: any, result: any) => {
        if (err) {
          return err;
        } else {
          return result;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const sendEnrolmentMail = async (isEnabled: boolean, data: { organisationEmail: string, token: string }) => {
  try {
    // Get the email template
    const template = await getTemplate('START_ENROLMENT', data.token);
    // Check if the employee is enabled
    if (isEnabled === true) {
      // Set the mail options
      const mailOptions = {
        from: 'Evervent <noreply@evervent.in>',
        to: data.organisationEmail,
        subject: 'Welcome Aboard',
        html: template,
      };
      // Send the email
      await transport.sendMail(mailOptions, (err: any, result: any) => {
        if (err) {
          return err;
        } else {
          return result;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export function checkIfTodayFallsBetween(startDate, endDate) {
  const today = moment().startOf('day');
  const start = moment(startDate).startOf('day');
  const end = moment(endDate).startOf('day');
  return today.isBetween(start, end, null, '[]');
}