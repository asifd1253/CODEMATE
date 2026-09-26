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

# Notes for feed api

/feed?page=1&limit=10 -> 1 to 10 ==> .skip(0) & .limit(10)
/feed?page=2&limit=10 -> 11 to 20 ==> .skip(10) & .limit(10)
/feed?page=3&limit=10 -> 21 to 30 ==> .skip(20) & .limit(10)

.skip() -> skip from 1st
.limit() -> start from nth
