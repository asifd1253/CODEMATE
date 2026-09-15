- git init
- git add .
- git commit -m "first message"
- git remote add origin https://github.com/asifd1253/CODEMATE_BACKEND.git
- git branch -M "main"
- git push -u origin "main"

# It is a middleware to run all the time to convert json into JS object

app.use(express.json());

# It is middleware to parse the cookies from client req and auth

app.use(cookieParser());
