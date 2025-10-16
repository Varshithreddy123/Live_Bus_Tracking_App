# TODO List for Fixing app.ts, server.ts, user.route.ts

- [x] Rename server/controlers directory to server/controllers
- [x] Add export { app }; at the end of server/app.ts
- [x] Update import path in server/routes/user.route.ts from "../controlers/user.controller" to "../controllers/user.controller"
- [x] Test the server by running it to ensure no errors

# TODO List for Fixing OTP Network Error

- [ ] Fix phone number state variable in user/screens/verification/otp-verification.screen.tsx (rename to avoid conflict with component)
- [ ] Pass phone number from login screen to OTP verification screen via navigation params
- [ ] Implement verify-otp endpoint in server/controllers/user.controller.tsx using Twilio
- [ ] Implement resend-otp endpoint in server/controllers/user.controller.tsx using Twilio
- [ ] Ensure server is running and EXPO_PUBLIC_SERVER_URI is set correctly in user app
- [ ] Test OTP sending and verification flow
