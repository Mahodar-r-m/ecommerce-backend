const sendEmail = async (to, subject, message) => {
    console.log('--- Dummy Email Service ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('Email sent successfully (dummy log).');
  };
  
  module.exports = sendEmail;