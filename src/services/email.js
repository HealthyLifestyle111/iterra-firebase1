/**
 * Email Service - Replaces Base44's SendEmail integration
 * Uses Firebase Functions to send emails via SendGrid or SMTP
 */

import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

/**
 * Send an email
 * Replaces Base44's SendEmail integration
 * 
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.text - Plain text content
 * @param {string} params.html - HTML content (optional)
 * @param {string} params.from - Sender email (optional, uses default if not provided)
 * @param {Array} params.attachments - Email attachments (optional)
 * @returns {Promise<{success: boolean, messageId: string}>}
 */
export async function sendEmail({ to, subject, text, html, from, attachments }) {
  const sendEmailFunction = httpsCallable(functions, 'sendEmail');
  
  try {
    const result = await sendEmailFunction({
      to,
      subject,
      text,
      html,
      from,
      attachments
    });
    
    return result.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
}

/**
 * Send wellness intake results email
 * @param {string} userEmail - User's email address
 * @param {Object} results - Wellness intake results
 */
export async function sendWellnessIntakeResults(userEmail, results) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4a5568;">Your Wellness Intake Results</h1>
      <p>Thank you for completing your wellness intake assessment.</p>
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #2d3748;">Summary</h2>
        ${results.summary || 'Your personalized wellness plan is being prepared.'}
      </div>
      <p style="color: #718096;">Our team will review your responses and reach out with personalized recommendations.</p>
      <hr style="border: 1px solid #e2e8f0; margin: 30px 0;">
      <p style="font-size: 12px; color: #a0aec0;">iTerra Concierge Wellness Platform</p>
    </div>
  `;
  
  return sendEmail({
    to: userEmail,
    subject: 'Your Wellness Intake Results - iTerra',
    text: 'Your wellness intake results are ready. Visit our platform for full details.',
    html
  });
}

/**
 * Send consultation confirmation email
 * @param {string} userEmail - User's email address
 * @param {Object} consultation - Consultation details
 */
export async function sendConsultationConfirmation(userEmail, consultation) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4a5568;">Consultation Confirmed</h1>
      <p>Your consultation has been scheduled!</p>
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Date:</strong> ${consultation.date}</p>
        <p><strong>Time:</strong> ${consultation.time}</p>
        <p><strong>Service:</strong> ${consultation.service}</p>
      </div>
      <p>We look forward to meeting with you!</p>
      <hr style="border: 1px solid #e2e8f0; margin: 30px 0;">
      <p style="font-size: 12px; color: #a0aec0;">iTerra Concierge Wellness Platform</p>
    </div>
  `;
  
  return sendEmail({
    to: userEmail,
    subject: 'Consultation Confirmed - iTerra',
    text: `Your consultation on ${consultation.date} at ${consultation.time} has been confirmed.`,
    html
  });
}

/**
 * Send welcome email to new associates
 * @param {string} userEmail - Associate's email address
 * @param {Object} associateInfo - Associate information
 */
export async function sendAssociateWelcome(userEmail, associateInfo) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4a5568;">Welcome to iTerra!</h1>
      <p>Hi ${associateInfo.name},</p>
      <p>Welcome to the iTerra Concierge Wellness Platform!</p>
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #2d3748;">Your Details</h2>
        <p><strong>Referral Link:</strong> ${associateInfo.referralLink}</p>
        <p><strong>Referral Code:</strong> ${associateInfo.referralCode}</p>
      </div>
      <p>Start sharing your unique referral link to track your referrals!</p>
      <hr style="border: 1px solid #e2e8f0; margin: 30px 0;">
      <p style="font-size: 12px; color: #a0aec0;">iTerra Concierge Wellness Platform</p>
    </div>
  `;
  
  return sendEmail({
    to: userEmail,
    subject: 'Welcome to iTerra!',
    text: `Welcome to iTerra! Your referral link: ${associateInfo.referralLink}`,
    html
  });
}

export default {
  sendEmail,
  sendWellnessIntakeResults,
  sendConsultationConfirmation,
  sendAssociateWelcome
};
