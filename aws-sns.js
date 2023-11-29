const logger = require('./logger/log');
const AWS = require('aws-sdk');
require('dotenv').config();
//const awsProfile = 'demo-account';
// AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: awsProfile });
const snsTopicArn = process.env.ARNSNSTOPIC;
const snsregion = process.env.AWS_SNS_REGION;

AWS.config.update({ region: snsregion });
const sns = new AWS.SNS();

const publishMessageToSNS = async (request, response) => {
  const message = `Assignment posted by User - ${request.user_email} for Assignment ID - ${request.assignmentID}`;

  const attributes = {
    submissionUrl: {
      DataType: "String",
      StringValue: request.submissionUrl
    },
    user_email: {
      DataType: "String",
      StringValue: request.user_email
    },
    assignmentId: {
      DataType: "String",
      StringValue: request.assignmentId,
    },
    assignment_Name: {
      DataType: "String",
      StringValue: request.assignment_Name,
    },
    submissionID: {
      DataType: "String",
      StringValue: request.submissionID,
    }
  };

  const params = {
    TopicArn: snsTopicArn,
    Message: message,
    MessageAttributes: attributes
  };

  console.log(params);

  try {
    const data = await new Promise((resolve, reject) => {
      sns.publish(params, (error, result) => {
        if (error) {
          logger.error(`Error in publishing the message to SNS: ${error.message}`);
          reject(error);
        } else {
          logger.info(`Successfully Published Message to SNS with Message ID - ${result.MessageId}`);
          resolve(result);
        }
      });
    });

    return data;
  } catch (error) {
    return error;
  }
};

module.exports = publishMessageToSNS;
