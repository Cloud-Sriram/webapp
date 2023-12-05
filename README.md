# Assignments - webapp

# 
 
## Prerequisites
 
- [List any prerequisites here]
 
## Setup Instructions
 
1. Clone the repository.
2. [Add any specific setup instructions]
3. Deploy serverless functions using the specified framework.
 
## Secure Application Endpoints
 
- Secure web application endpoints with valid SSL certificates.
- Use AWS Certificate Manager or import certificates from external vendors.
 
## CI/CD for Web Application
 
- GitHub Actions workflow is triggered on pull request merge.
- Workflow runs unit tests, validates Packer template, builds application artifacts, and creates AMI.
- Launch Template is updated with the latest AMI for the autoscaling group.

This is the installation command
aws acm import-certificate --certificate file://certificate_base64.txt --certificate-chain file://ca_bundle_base64.txt --private-key file://private_base64.txt --profile demo-account --region us-east-1
