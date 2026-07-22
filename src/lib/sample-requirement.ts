export const SAMPLE_REQUIREMENT = `Feature: Password Reset

As a registered user, I want to reset my password via email so that I can
regain access to my account if I forget my password.

Acceptance Criteria:
- User can request a password reset from the login page by entering their email.
- If the email exists, the system sends a reset link valid for 30 minutes.
- If the email does not exist, the UI shows a generic confirmation message (no
  account enumeration).
- The reset link opens a page where the user can set a new password.
- The new password must be at least 8 characters and include a number.
- After a successful reset, all existing sessions for that user are invalidated.
- Users receive an email confirmation after their password has been changed.`;
