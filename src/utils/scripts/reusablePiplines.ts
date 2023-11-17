import mongoose from "mongoose";
import express from "express";
import FamilyDetails from "../../model/FamilyDetails";
import OrganisationStructure from "../../model/settingsModals/OrganistaionStructure";
import { findDepartmentsByKeys } from "./functions";
import Stages from "../../model/modules/Stages";
import { checkPolicyData } from "../../services/bulkUpload/bulkUploadService";
import Policy from "../../model/Policy";
import Employee from "../../model/Employee";

interface MyUserRequest extends express.Request {
    user?: {
        _id: string,
        id?: string,
        username: string,
        password: string,
        parentsId: string,
        companyCode: string,
        createdBy?: string,
    }
}



/**
 * Retrieves the value of a specific key in a document.
 * 
 * @param id - The id of the document to search for.
 * @param key - The key to retrieve the value for.
 * @param modal - The name of the model to perform the aggregation on.
 * @returns A promise that resolves to the retrieved data.
 */
export const getKeysValue = async (id: string, key: string, modal: string):Promise<{ value: string; key: string; _id:string; }[]> => {
    // Define criteria for aggregation
    let criteria = [
        // Match the given id
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        // Project only the layout field
        {
            $project: {
                layout: 1
            }
        },
        // Unwind the layout field and its nested children fields
        {
            $unwind: {
                path: "$layout",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$layout.children",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$layout.children.children",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$layout.children.children.children",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$layout.children.children.children.children",
                preserveNullAndEmptyArrays: true
            }
        },
        // Match the given key
        {
            $match: {
                "layout.children.children.children.children.field_lable": key
            }
        },
        // Project only the key and value fields
        {
            $project: {
                key: "$layout.children.children.children.children.field_lable",
                value: "$layout.children.children.children.children.value"
            }
        }
    ];
    // Get the model and perform the aggregation
    const Model = mongoose.model(modal);
    let data:{ value: string; key: string; _id:string; }[]= await Model.aggregate(criteria);
    console.log(data)
    return data;
};


export const getDetailValueById = async (id: string, modal: string) => {
    // Define criteria for aggregation
    let cretiria = [
        {
          $match: {
            _id: mongoose.Types.ObjectId(id),
          },
        },
        {
          $unwind: {
            path: "$layout",
          },
        },
        {
          $unwind: {
            path: "$layout.children",
          },
        },
        {
          $unwind: {
            path: "$layout.children.children",
          },
        },
        {
          $unwind: {
            path: "$layout.children.children.children",
          },
        },
        {
          $unwind: {
            path: "$layout.children.children.children.children",
          },
        },
        {
          $group: {
            _id: "$_id",
            id: {
              $first: "$_id",
            },
            employeeId: {
              $first: {
                $concat: [
                  "$preFix",
                  {
                    $toString: "$employeeId",
                  },
                ],
              },
            },
            createdAt: {
              $first: "$createdAt",
            },
            updatedAt: {
              $first: "$updatedAt",
            },
            data: {
              $push: {
                k: "$layout.children.children.children.children.field_lable",
                v: "$layout.children.children.children.children.value",
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $arrayToObject: {
                $concatArrays: [
                  [
                    {
                      k: "id",
                      v: "$id",
                    },
                    {
                      k: "createdAt",
                      v: "$createdAt",
                    },
                    {
                      k: "employeeId",
                      v: "$employeeId",
                    },
                  ],
                  "$data",
                ],
              },
            },
          },
        },
        {
          $unset: "EmployeeId",
        },
        {
          $addFields: {
            Id: "$employeeId",
          },
        },
        {
          $set: {
            "Primary Employee": {
              $convert: {
                input: "$Primary Employee",
                to: "objectId",
              },
            },
          },
        },
        {
          $lookup: {
            from: "employees",
            localField: "Primary Employee",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $set: {
            "Primary Employee": {
              $concat: [
                {
                  $first: "$result.preFix",
                },
                {
                  $toString: {
                    $first: "$result.employeeId",
                  },
                },
              ],
            },
          },
        },
        {
          $unset: "result",
        },
    ]
    // Get the model and perform the aggregation
    const Model = mongoose.model(modal);
    let data = await Model.aggregate(cretiria);
    //console.log(data)
    return data;
};

/**
 * Saves a query.
 * 
 * @param req - The request object containing user information.
 * @param layouts - An array containing layout information.
 * @param data - The data to be saved.
 * @param contactId - The ID of the contact.
 * @param modal - The modal type.
 * @param address - Optional parameter for address details.
 * @param familyDetails - Optional parameter for family details.
 * @returns void
 */
export const saveQuery = async (
    req: MyUserRequest,
    layouts: any[],
    data: any,
    contactId: number,
    modal: string,
    address?: any,
    familyDetails?: any
) => {
    const userId = req.user?._id ? req.user._id : req.user.id;
    const options = {
        sort: { contactId: -1 },
    };
    let dataArray = [data];
    const contactPromises = layouts.map(async (layout, index) => {
        const objectToSave = JSON.parse(JSON.stringify(layout));
        const data = dataArray[index];
        const newData = objectToSave.layout.map((section) => {
            const newSection = { ...section };
            newSection.children = section.children.map((subSection) => {
                const newSubSection = { ...subSection };
                newSubSection.children = subSection.children.map((row) => {
                    const newRow = { ...row };
                    newRow.children = row.children.map((column) => {
                        const newColumn = { ...column };
                        newColumn.children = column.children.map((field) => {
                            const field_lable = field.field_lable;
                            if (field_lable === "Primary Employee" && !data[field_lable]) {
                                // If "Primary Employee" field is blank, skip it
                                return null;
                            }
                            if (field_lable === "Member Type" && address[0].type!== "DEPENDENT"){
                                return { ...field, value: "Employee" };
                            }
                            if (data.hasOwnProperty(field_lable)) {
                                return { ...field, value: data[field_lable] };
                            } else {
                                return field;
                            }
                        }).filter(Boolean); // Filter out null values (removed "Primary Employee" field)
                        return newColumn;
                    });
                    return newRow;
                });
                return newSubSection;
            });
            return newSection;
        });
        // Remove empty fields in newData
        const cleanedData = newData.filter((section) => {
            return section.children.some((subSection) => {
                return subSection.children.some((row) => {
                    return row.children.some((column) => {
                        return column.children.length > 0;
                    });
                });
            });
        });
        objectToSave.layout = newData;
        let createdBy;
        if (req.user._id) {
            createdBy = req.user.parentsId === null ? { createdBy: req.user.companyCode } : { createdBy: req.user.parentsId };            
        } else {
            createdBy = req.user.createdBy
        }
        const contactDetails = await new Promise(async (resolve, reject) => {
            const organisationId = {
                label: req.body.label,
                id: req.body.id
            }
            let contactData;
            let data;
            let departments;
            let designations;
            let salaryBrackets;
            if (modal === "Contacts") {
                contactData = { ...objectToSave, userId, organisationId, contactId, ...createdBy };
            } else if (modal === "Clients") {
                data = findDepartmentsByKeys(dataArray, createdBy);
                departments = data.Department[0];
                designations = data.Designation[0]
                salaryBrackets = data.Salary[0]
                contactData = { ...objectToSave, userId, location: address[0], clientId: contactId, ...createdBy };
            }
            else {
                let type = address[0].type;
                if (type === "DEPENDENT") {
                    const Modal = mongoose.model(modal);
                    let data = await Modal.findOne({ createdBy: createdBy.createdBy, employeeId: parseInt(familyDetails.employeeId) });
                    let dataArray = [familyDetails.member]

                    //console.log("memberID...............................", familyDetails, data)
                    const memberData = await checkPolicyData(req, parseInt(familyDetails.policyId), data._id, dataArray)
                    contactData = { ...objectToSave, attachedClient: req.body.ClientId, type: address[0].type, preFix: "DEP00", userId, personalAddress: address[0], employeeId: contactId, memberId: memberData._id, ...createdBy };
                } else {
                    contactData = { ...objectToSave, attachedClient: req.body.ClientId, type: "EMPLOYEE", userId, personalAddress: address[0], employeeId: contactId, ...createdBy };
                }
            }
            // const contactData = { ...objectToSave, userId, organisationId, contactId, ...createdBy };
            delete contactData._id; // Remove the _id property
            const Modal = mongoose.model(modal);
            const modalInstance = new Modal(contactData);
            modalInstance.save(async (err, createdData: any) => {
                if (err) return reject(err);
                if (modal === "Employee") {
                    if (createdData.type === "EMPLOYEE") {
                        await (await FamilyDetails.create({
                            employeeId: createdData._id,
                            members: [],
                            kyc: []
                        })).save();
                    }
                }
                if (modal === "Clients") {
                    await (await OrganisationStructure.create({ ...departments, clientId: createdData._id })).save();
                    await (await OrganisationStructure.create({ ...salaryBrackets, clientId: createdData._id })).save();
                    await (await OrganisationStructure.create({ ...designations, clientId: createdData._id })).save();
                }
                resolve(createdData);
            });
        });
        return contactDetails;
    });
    try {
        const savedContacts = await Promise.all(contactPromises);
        return savedContacts;
    } catch (error) {
        console.error(error);
        return [];
    }
};


/**
 * Function to get the skip value
 * @param req - The user request object
 * @param modal - The database model to be used
 * @param field - The field in the database model
 * @param values - The values to be matched in the database
 * @returns The aggregated data
 */
export const getSkipValue = async (
    req: MyUserRequest,
    modal: string,
    field: any,
    values: any
) => {
    try {
        let valuesData;
        // Check the modal type and field type to determine how to handle values
        if (modal === "Contacts" && (field.field === "Mobile" || field.field === "Office Phone Number")) {
            valuesData = values.values.toString();
        } else if (modal === "Clients" && field.field === "Organization Phone Number") {
            valuesData = values.values.toString();
        } else if (field.field === "Contact Number" || field.field === "Office Contact Number") {
            valuesData = values.values.toString();
        } else {
            valuesData = values.values;
        }
        // Determine the createdBy based on user's parentsId
        const createdBy = req.user.parentsId === null ? { createdBy: req.user.companyCode } : { createdBy: req.user.parentsId };
        // Define the criteria for aggregation
        let criteria = [
            {
                $match: {
                    createdBy: createdBy.createdBy,
                },
            },
            {
                $unwind: {
                    path: "$layout"
                }
            },
            {
                $unwind: {
                    path: "$layout.children"
                }
            },
            {
                $unwind: {
                    path: "$layout.children.children"
                }
            },
            {
                $unwind: {
                    path: "$layout.children.children.children",
                }
            },
            {
                $unwind: {
                    path: "$layout.children.children.children.children",
                }
            },
            {
                $project: {
                    field: "$layout.children.children.children.children.field_lable",
                    value: "$layout.children.children.children.children.value",
                    unique: "$layout.children.children.children.children.unique",
                }
            },
            {
                $match: {
                    field: field.field,
                    value: valuesData
                }
            },
            {
                $project: {
                    field: 1,
                    value: 1,
                    unique: 1
                }
            }
        ];
        // Execute the aggregation
        const Modal = mongoose.model(modal);
        let data = await Modal.aggregate(criteria);
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
};


/**
 * Function to overwrite value
 * 
 * @param req - The request object containing user details
 * @param modal - The name of the database model to be updated
 * @param layouts - An array of layouts
 * @param id - The identifier of the record to be updated
 * @param data - The new data to be updated in the record
 * @param address - Optional parameter representing the address details
 * @returns A promise that resolves to the updated record or an empty array if an error occurs
 */
export const patchOverwriteValue = async (
    req: MyUserRequest,
    modal: string,
    layouts: any[],
    id: any,
    data: any,
    address?: any
) => {
    const criteria = { _id: id };
    const options = {};
    let dataArray = [data];
    // Map through layouts and handle each layout
    const contactPromises = layouts.map(async (layout) => {
        const objectToSave = JSON.parse(JSON.stringify(layout));
        const layoutData = dataArray[0];
        // Map through layout and handle each section
        const newData = objectToSave.layout.map((section) => {
            const newSection = { ...section };
            // Map through each sub-section
            newSection.children = section.children.map((subSection) => {
                const newSubSection = { ...subSection };
                // Map through each row
                newSubSection.children = subSection.children.map((row) => {
                    const newRow = { ...row };
                    // Map through each column
                    newRow.children = row.children.map((column) => {
                        const newColumn = { ...column };
                        // Map through each field and update value if it exists in data
                        newColumn.children = column.children.map((field) => {
                            const field_label = field.field_label ? field.field_label : field.field_lable;
                            return data.hasOwnProperty(field_label) ? { ...field, value: data[field_label] } : field;
                        });
                        return newColumn;
                    });
                    return newRow;
                });
                return newSubSection;
            });
            return newSection;
        });
        // Update the layout with new data
        objectToSave.layout = newData;
        // Determine createdBy based on user's parentsId
        const createdBy = req.user.parentsId === null ? { createdBy: req.user.companyCode } : { createdBy: req.user.parentsId };
        // Handle contact details based on modal type
        const contactDetails = await new Promise((resolve, reject) => {
            let contactData;
            if (modal === "Contacts") {
                contactData = { ...objectToSave };
            } else if (modal === "Clients") {
                contactData = typeof address === 'undefined' ? { ...objectToSave } : Array.isArray(address) && address.length > 0 ? { ...objectToSave, location: address[0] } : { ...objectToSave };
            } else {
                let type = address && address.length > 0 ? address[0].type : null;
                if (type === "EMPLOYEE") {
                    contactData = typeof address === 'undefined' ? { ...objectToSave } : Array.isArray(address) && address.length > 0 ? { ...objectToSave, personalAddress: address[0] } : { ...objectToSave };
                }
            }
            // Remove the _id property if contactData exists
            if (contactData) {
                delete contactData._id;
            }
            // Update the record in the database
            const Modal = mongoose.model(modal);
            Modal.findOneAndUpdate(criteria, contactData, options, (err, createdData) => {
                if (err) reject(err);
                resolve(createdData);
            });
        });
        return contactDetails;
    });
    try {
        const savedContacts = await Promise.all(contactPromises);
        return savedContacts;
    } catch (error) {
        console.error(error);
        return [];
    }
}


/**
* This function retrieves the ID of a contact based on the provided request and modal type.
* @param {Object} req - The request object containing user information.
* @param {String} modal - The type of record to be retrieved (e.g., "Contacts", "Clients", or "Employees").
* @returns {Promise<Array>} - A promise that resolves to an array of data representing the last created record for the specified modal type.
*/
export const getContactId = async (req: MyUserRequest, modal: string) => {
    // Determine createdBy based on user's parentsId
    const createdBy = req.user.parentsId === null ? { createdBy: req.user.companyCode } : { createdBy: req.user.parentsId };
    // Find the last created record based on the modal type
    const Modal = mongoose.model(modal);
    let data;
    if (modal === "Contacts") {
        data = await Modal.find({ createdBy: createdBy.createdBy }).sort({ contactId: -1 }).limit(1);
    } else if (modal === "Clients") {
        data = await Modal.find({ createdBy: createdBy.createdBy }).sort({ clientId: -1 }).limit(1);
    } else {
        data = await Modal.find({ createdBy: createdBy.createdBy }).sort({ employeeId: -1 }).limit(1);
    }
    return data;
}


/**
 * This function updates the policy for a member in the database.
 * 
 * @param {string} employeeId - The ID of the employee.
 * @param {object} data - The data containing the policy ID.
 * @param {object} member - The member object to be added to the policy.
 * @param {string} modal - The name of the modal.
 * @returns {Promise} - A promise that resolves to the result of the policy update.
 * @throws {Error} - If an error occurs during the update process.
 */
export const memberSaveQuery = async (employeeId, data, member, modal) => {
    try {
        const Modal = mongoose.model(modal);

        console.log("---inside memberSaveQuery----", data, member, employeeId)

        // Define the query and update for policy
        const policyQuery = {
            _id: mongoose.Types.ObjectId(employeeId),
            "policy.policyId": data.policyId,
        };

        // "memberId": member._id
        const policyUpdate = {
            $push: {
                "policy.$.memberId": member._id
            }
        };
        const policyOptions = {
            arrayFilters: [{ "policy.policyId": { $exists: false } }]
        };

        // Update the policy
        const result = await Modal.updateOne(policyQuery, policyUpdate, policyOptions);

        //let employeeData = await Employee.findOne({_id: employeeId});

        //console.log("Modal, employeeData..............................++++++++++++++++++++", modal, employeeData)

        //console.log("result---", result)

        // If no policy was modified and no policy was found, create a new policy
        if (result.nModified === 0 && result.n === 0) {
            const newPolicy = {
                policyId: data.policyId,
                memberId: [member._id]
            };
            const newPolicyQuery = { _id: mongoose.Types.ObjectId(employeeId) };
            const newPolicyUpdate = { $push: { policy: newPolicy } };

            return await Modal.updateOne(newPolicyQuery, newPolicyUpdate);
        }

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
};

//----------------------  Mass Update Querys--------------------------



/**
 * Retrieves a specific field from a MongoDB collection based on certain conditions.
 * @param req - The request object that contains information about the user making the request.
 * @param modal - The name of the MongoDB collection from which the field needs to be retrieved.
 * @param field - The field that needs to be retrieved from the collection.
 * @returns A Promise that resolves to the retrieved field value.
 */
export const getMatchField = async (
    req: MyUserRequest,
    modal: string,
    field: any
) => {
    // Determine the value of createdBy based on the user's parentsId
    const createdBy = req.user.parentsId === null
        ? { createdBy: req.user.companyCode }
        : { createdBy: req.user.parentsId };
    // Set up the pipeline for the aggregation query
    const pipeline = [
        {
            $match: {
                createdBy: createdBy.createdBy,
            },
        },
        {
            $unwind: {
                path: "$layout",
            },
        },
        {
            $unwind: {
                path: "$layout.children",
            },
        },
        {
            $unwind: {
                path: "$layout.children.children",
            },
        },
        {
            $unwind: {
                path: "$layout.children.children.children",
            },
        },
        {
            $unwind: {
                path: "$layout.children.children.children.children",
            },
        },
        {
            $project: {
                field: "$layout.children.children.children.children.field_lable",
                value: "$layout.children.children.children.children.value",
            },
        },
        {
            $match: {
                field: field,
            },
        },
        {
            $project: {
                field: 1,
                value: 1,
            },
        }
    ];
    const Modal = mongoose.model(modal);
    let data = await Modal.aggregate(pipeline);
    return data[0];
};



/**
 * This function retrieves the first data that matches the provided field and id from the specified model.
 * @param {MyUserRequest} req - The request object.
 * @param {string} modal - The name of the model.
 * @param {any} field - The field to match.
 * @param {any} id - The id to match.
 * @returns {Promise<any>} - A promise that resolves to the matched data.
 */
export const getMatchNewField = async (
    req: MyUserRequest,
    modal: string,
    field: any,
    id: any
) => {
    // Determine createdBy based on whether parentsId is null
    const createdBy = req.user.parentsId === null ? { createdBy: req.user.companyCode } : { createdBy: req.user.parentsId };
    // Define the criteria for the aggregation
    let criteria = [
        {
            $match: {
                _id: mongoose.Types.ObjectId(id),
                createdBy: createdBy.createdBy,
            },
        },
        {
            $unwind: {
                path: "$layout"
            }
        },
        {
            $unwind: {
                path: "$layout.children"
            }
        },
        {
            $unwind: {
                path: "$layout.children.children"
            }
        },
        {
            $unwind: {
                path: "$layout.children.children.children",
            }
        },
        {
            $unwind: {
                path: "$layout.children.children.children.children",
            }
        },
        {
            $project: {
                field: "$layout.children.children.children.children.field_lable",
                value: "$layout.children.children.children.children.value",
            }
        },
        {
            $match: {
                field: field
            }
        },
        {
            $project: {
                field: 1,
                value: 1
            }
        }
    ]
    // Retrieve model from mongoose
    const Modal = mongoose.model(modal);
    // Perform aggregation
    let data = await Modal.aggregate(criteria);
    // Return first result
    return data[0];
};



/**
 * Retrieves a key-value pair object of field-value from the specified model.
 * @param req - The user request object.
 * @param modal - The name of the model.
 * @param id - The ID of the model.
 * @returns A promise that resolves to the key-value pair object.
 */
export const getMatchNewFieldValue = async (
    req: MyUserRequest,
    modal: string,
    id: any
) => {
    // Determine createdBy based on whether parentsId is null
    const createdBy = req.user.parentsId === null ? { createdBy: req.user.companyCode } : { createdBy: req.user.parentsId };
    // Define the criteria for the aggregation
    let criteria = [
        {
            $match: {
                _id: mongoose.Types.ObjectId(id),
                createdBy: createdBy.createdBy,
            },
        },
        {
            $unwind: {
                path: "$layout"
            }
        },
        {
            $unwind: {
                path: "$layout.children"
            }
        },
        {
            $unwind: {
                path: "$layout.children.children"
            }
        },
        {
            $unwind: {
                path: "$layout.children.children.children",
            }
        },
        {
            $unwind: {
                path: "$layout.children.children.children.children",
            }
        },
        {
            $project: {
                field: "$layout.children.children.children.children.field_lable",
                value: "$layout.children.children.children.children.value",
            }
        },
        {
            $project: {
                field: 1,
                value: 1
            }
        }
    ]
    // Retrieve model from mongoose
    const Modal = mongoose.model(modal);
    // Perform aggregation
    let data = await Modal.aggregate(criteria);
    // If data exists, convert array to object with field-value pairs
    if (data.length > 0) {
        const result = {};
        data.forEach((item) => {
            result[item.field] = item.value;
        });
        return result;
    } else {
        return null;
    }
};


/**
 * This function executes an aggregate query with the provided criteria, projection, and options on the specified model.
 * @param {Object} criteria - The criteria to match documents.
 * @param {Object} projection - The fields to project in the results.
 * @param {Object} options - The options for the query.
 * @param {string} modal - The name of the model to query.
 * @param {Function} callback - The callback function to handle the query results.
 */
export const getAllGroupCriticalIllnessAgg = function (criteria, projection, options, modal, callback) {
    const pipeline = [
        { $match: criteria },
        { $project: projection }
    ];
    // Retrieve model from mongoose
    const Modal = mongoose.model(modal);
    // Create aggregate query
    const aggregateQuery = Modal.aggregate(pipeline);
    // If sort option is provided, sort the results
    if (options.sort) {
        aggregateQuery.sort(options.sort);
    }
    // Execute the query
    aggregateQuery.exec((err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};


/**
 * This function creates a new document in the specified model with the provided configData.
 * @param {MyUserRequest} req - The request object containing user information.
 * @param {string} modal - The name of the model in which the document needs to be created.
 * @param {object} configData - An object containing the configuration data for the new document.
 * @returns {Promise<object>} - A promise that resolves to the created document or rejects with an error.
 */
export const createProductConfigData = async (
    req: MyUserRequest,
    modal: string,
    configData: object
) => {
    try {
        const userId = req.user._id;
        const data = configData;
        // Retrieve model from mongoose
        const Modal = mongoose.model(modal);
        // Create new document
        let product = await Modal.create({ ...data, userId });
        return product;
    } catch (error) {
        console.log(error);
        return error;
    }
};


/** 
 * This function retrieves a document from the specified model by its id. 
 *  
 * @param {MyUserRequest} req - The user request object. 
 * @param {string} modal - The model name. 
 * @param {string} id - The id of the document to retrieve. 
 * @returns {Promise} - A promise that resolves to the retrieved document. 
 */
export const getProductConfigData = async (
    req: MyUserRequest,
    modal: string,
    id: string,
) => {
    try {
        const userId = req.user._id;
        // Retrieve model from mongoose
        const Modal = mongoose.model(modal);
        // Define query and options
        const query = { _id: id, userId };
        const options = { featureDetails: 1 };
        // Retrieve document
        let product = await Modal.findOne(query, options);
        return product;
    } catch (error) {
        console.log(error);
        return error;
    }
};


/**
 * This function updates a document in the specified model with the provided configData.
 * @param {MyUserRequest} req - The user request object.
 * @param {string} modal - The name of the model.
 * @param {string} id - The id of the document to be updated.
 * @param {object} configData - The updated configuration data.
 * @returns {Promise<object>} - The updated document.
 */
export const updateProductConfigData = async (
    req: MyUserRequest,
    modal: string,
    id: string,
    configData: object
) => {
    try {
        const userId = req.user._id;
        const data = configData;
        // Retrieve model from mongoose
        const Modal = mongoose.model(modal);
        // Define query, update and options
        const query = { _id: id, userId };
        const update = { $set: { featureDetails: data } };
        const options = { new: true };
        // Update document
        let product = await Modal.updateOne(query, update, options);
        return product;
    } catch (error) {
        console.log(error);
        return error;
    }
};


/**
 * This function updates the status of a document in the specified model.
 * @param {MyUserRequest} req - The user request object.
 * @param {string} modal - The name of the model.
 * @param {any} configData - The data to be updated.
 * @param {string} id - The ID of the document.
 * @returns {Promise<void>} - A promise that resolves when the status update is complete.
 */
export const updateStatusData = async (
    req: MyUserRequest,
    modal: string,
    configData: any,
    id: string
) => {
    try {
        const userId = req.user._id;
        let data;
        // Determine data based on whether modal is "Employee"
        if (modal === "Employee") {
            data = configData?.name;
        } else {
            data = configData;
        }
        // Determine createdBy based on whether parentsId is null
        const createdBy = req.user.parentsId === null ? { createdBy: req.user.companyCode } : { createdBy: req.user.parentsId };
        // Retrieve model from mongoose
        const Modal = mongoose.model(modal);
        // Update document
        const product = await Modal.updateOne(
            { _id: mongoose.Types.ObjectId(id), createdBy: createdBy.createdBy },
            {
                $set: {
                    status: data
                }
            }
        ).exec();
        return product;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


/** 
 * Retrieves stage data from the database based on the provided id. 
 * @param {string} id - The id of the stage. 
 * @returns {Promise<Array>} - A promise that resolves to an array of stage data. 
 */ 
export const stageData = async (
    id: string
) => {
    try {
        const result = await Stages.aggregate([
            {
                $match: {
                    layoutId: mongoose.Types.ObjectId(id)
                }
            },
            {
                $project: {
                    status: 1
                }
            },
            {
                $unwind: {
                    path: "$status"
                }
            },
            {
                $project: {
                    _id: 0,
                    value: { $toUpper: "$status.name" },
                    name: {
                        value: { $toUpper: "$status.name" },
                        color: "$status.colour",
                    }
                }
            }
        ]);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};


/**
 * This function retrieves documents from the specified model that match the provided field and values.
 * 
 * @param {MyUserRequest} req - The user request object.
 * @param {string} modal - The name of the model.
 * @param {any} field - The field to match against.
 * @param {any} values - The values to match.
 * @returns {Promise<any>} - A promise that resolves to the matching documents.
 */
export const getSkipValueProductConfig = async (
    req: MyUserRequest,
    modal: string,
    field: any,
    values: any,
) => {
    try {
        const userId = req.user._id;
        let valuesData;
        // Determine valuesData based on whether modal is "Insurance"
        if (modal === "Insurance") {
            if (field.field === "contactNumber") {
                valuesData = values.values.toString();
            } else {
                valuesData = values.values;
            }
        } else {
            valuesData = values.values;
        }
        // Define query based on whether modal is "Insurance"
        let query;
        if (modal === "Insurance") {
            query = { userId: userId, type: "LIFE", "insurerBasicInfo.email": valuesData };
        } else {
            query = { userId, "featureDetails.name": valuesData };
        }
        // Retrieve model from mongoose
        const Modal = mongoose.model(modal);
        // Retrieve document
        let data = await Modal.findOne(query);
        // If data exists, return array with data, otherwise return empty array
        if (data) {
            return [data];
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const getCriticalCdBalances = async (createdBy: any,) => {
    try {
            
        const data = await Policy.aggregate([
            {
              $match: {
                createdBy: createdBy,
              },
            },
            {
              $project: {
                criticalCdBalance: "$policy.criticalCd",
                currentCdBalance:
                  "$policyDetails.cdBalance",
                client: "$organisationDetails.id",
                policyNumber: "$policyCase.policyNumber",
                policy: {
                  $concat: [
                    "$preFix",
                    {
                      $toString: "$policyId",
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "clients",
                localField: "client",
                foreignField: "_id",
                as: "result",
              },
            },
            {
              $unwind: {
                path: "$result",
              },
            },
            {
              $unwind: {
                path: "$result.layout",
              },
            },
            {
              $facet: {
                all_orgs: [
                  {
                    $unwind: {
                      path: "$result.layout.children",
                    },
                  },
                  {
                    $unwind: {
                      path: "$result.layout.children.children",
                    },
                  },
                  {
                    $unwind: {
                      path: "$result.layout.children.children.children",
                    },
                  },
                  {
                    $unwind: {
                      path: "$result.layout.children.children.children.children",
                    },
                  },
                  {
                    $unwind: {
                      path: "$result.layout.children.children.children.children.value",
                    },
                  },
                  {
                    $match: {
                      "result.layout.children.children.children.children.field_lable":
                        "Organisation",
                    },
                  },
                  {
                    $group: {
                      _id: "$_id",
                      data: {
                        $push: {
                          client: "$client",
                          criticalCdBalance:
                            "$criticalCdBalance",
                          currentCdBalance:
                            "$currentCdBalance",
                          policyId: "$policy",
                          policyNumber: "$policyNumber",
                          Organistaion:
                            "$result.layout.children.children.children.children.value",
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$all_orgs",
              },
            },
            {
              $unwind: {
                path: "$all_orgs.data",
              },
            },
            {
              $replaceRoot: {
                newRoot: "$all_orgs.data",
              },
            },
          ])


          return data

    } catch(err) {
        return err
    }
}