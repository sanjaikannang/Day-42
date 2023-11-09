import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sanjaikannang@gmail.com',
    pass: 'fyzy dgga htqq joqp',
  },
});

export default transporter;