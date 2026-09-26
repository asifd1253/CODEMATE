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
  ----- POST /request/send/:status/:toUserId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
  ----- POST /request/review/:status/:requestId

# userRouter

- GET /user/requests/received
- GET /user/network
- GET /user/feed/ - Gets you the profiles of other users in the platform
