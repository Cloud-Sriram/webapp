require('dotenv').config();
 
const logger = require('./logger/developmentLogs.js');
 
const AWS = require('aws-sdk');
 
const awsProfile = 'sriram-dev'
 
AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: awsProfile });
 
const awsRegion = process.env.AWSREGION;
 
const roleArn = 'arn:aws:iam::175506346862:role/snsfullaccessforlocal';
 
AWS.config.update({ region: awsRegion });
 
const sts = new AWS.STS();
 
const sns = new AWS.SNS();
 
const topicArn = process.env.SNSTOPICARN;
 
const publishSnsMessage = async(req,res) => {
  try
  {

 
    const message = `Assignment posted by User - ${req.user_email} for Assignment ID - ${req.assignmentId}`;
    const attributes = {
      submission_url : {
        DataType: "String",
        StringValue: req.submission_url
      },
      user_email : {
        DataType: "String",
        StringValue: req.user_email
      },
      assignmentID : {
        DataType: "String",
        StringValue: req.assignmentID,
      },
      submissionID : {
        DataType: "String",
        StringValue: req.submissionID,
      },
      assignmentName : {
        DataType: "String",
        StringValue: req.assignmentName,
      }
    }
 
 
 
    console.log(attributes);
 
    const params = {
      TopicArn: topicArn,
      Message: message,
      MessageAttributes : attributes
    };
 
    console.log(params);
 
    sns.publish(params, (err, data) => {
      if (err)
      {
        logger.info(`Error in publishing the message to SNS`)
        console.log(err);
        return
      }
      else
      {
        logger.info( ` Successfully Published Message to SNS with Message ID -  ${data.MessageId}`);
        return
      }
    });
  }
  catch(error)
  {
    logger.error(`Error in publishing the message to SNS: ${error.message}`);
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
 
}
 
module.exports = publishSnsMessage;
