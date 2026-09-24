# CODEMATE API'S

# authRouter

- POST /signup
- POST /login
- POST /logout

# profileRouter

- GET /profile/view
- PATCH /profile/update
- PATCH /profile/password

# connectionRequestRouter

- POST /request/send/interested/:id
- POST /request/send/ignored/:id
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed/ - Gets you the profiles of other users in the platform
