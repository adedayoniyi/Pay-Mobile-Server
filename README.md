# Pay Mobile Server

<img src="assets/pay_mobile_server_advert.png" alt="Username Transfer Showcase" title="Pay Mobile Server Advert">

## This is the official Nodejs server code for the <a href="https://github.com/adedayoniyi/Pay-Mobile-P2P-Money-Transfer-App">Pay Mobile P2P Money Transfer App</a> and the <a href="https://github.com/adedayoniyi/Pay-Mobile-Web-Admin">Pay Mobile Web Admin</a>

### QUICK START ⚡

#### Visit: <a href="https://github.com/adedayoniyi/Pay-Mobile-Full-Stack"> Pay Mobile Full Stack </a> to access the full stack code of the software (i.e the Web Admin Front End and the Mobile Front End)

### You have to create a `.env` for the required environment variables as the one here has been removed

#### Here are the necessary data

```env
DATABASE_URL = Database URL(e.g MongoDB)
PORT = PORT(e.g 4000)
TOKEN_STRING=Random Token String for signing user tokens
databaseURL=Firebase Database URL
OAUTH_REFRESH_TOKEN=Oauth Refresh Token. Get it from the https://developers.google.com/oauthplayground/
OAUTH_CLIENT_SECRET=Oauth Client Secret from Google Cloud
OAUTH_CLIENT_ID=Oauth Client ID from Google Cloud
GMAIL_PASSWORD=Your Email Password to be used for NodeMailer
EMAIL_ADDRESS=Your Email address to be used for NodeMailer
PAY_MOBILE_DATABASE=Your server URL
```

#### After cloning and updating the necessary `env` data, just run this and you server will be live:

```bash
npm run dev
```

### These are some of the major API endpoints

#### 1. Methods: `POST` `/api/createUser` This is for user sign up<br/>

Request

```json
{
  "fullname": "full name here",
  "username": "username here",
  "email": "email here",
  "password": "password here"
}
```

Response

```json
201 Created
{
  "message": {
    "fullname": "Evan Musk",
    "username": "musk",
    "email": "evanmusktest@mail.com",
    "password": "$2a$08$AVbHVbw5wyr7i6.Sc2GYf.LbreBMPHluf8dI6xxU30IemEwdosII6",
    "balance": 0,
    "type": "user",
    "deviceToken": "",
    "isVerified": false,
    "_id": "64bee0766503c8619c6f4559",
    "createdAt": "2023-07-24T20:35:02.397Z",
    "updatedAt": "2023-07-24T20:35:02.397Z",
    "__v": 0
  }
}
```

<br/>

#### 2. Methods: `POST` `/api/login` This is for user login where a token is generated<br/>

Request

```json
{
  "username": "username here",
  "password": "password here"
}
```

Response

```json
200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YmVlMDc2NjUwM2M4NjE5YzZmNDU1OSIsImlhdCI6MTY5MDIzMTAyN30.aq3dfWUhQzBlXQHBXizNymQJBzp-c82sRvnVMrI0dOA",
  "_id": "64bee0766503c8619c6f4559",
  "fullname": "Evan Musk",
  "username": "musk",
  "email": "evanmusktest@mail.com",
  "password": "$2a$08$AVbHVbw5wyr7i6.Sc2GYf.LbreBMPHluf8dI6xxU30IemEwdosII6",
  "balance": 0,
  "type": "user",
  "deviceToken": "",
  "isVerified": false,
  "createdAt": "2023-07-24T20:35:02.397Z",
  "updatedAt": "2023-07-24T20:35:02.397Z",
  "__v": 0
}
```

<br/>

#### 3. Methods: `POST` `/api/chat` This is used to create a new chat or return an existing chat<br/>

Request

```json
{
  "sender": "musk",
  "chatName": "Pay Mobile Support"
}
```

Response

```json
201 Created
{
  "chatName": "Pay Mobile Support",
  "sender": "musk",
  "receiver": "welch",
  "latestMessage": "Welcome to Pay Mobile customer support center, send us a message and we will reply as soon as possible",
  "_id": "64bee3911097c546ad9d71e2",
  "createdAt": "2023-07-24T20:48:17.411Z",
  "updatedAt": "2023-07-24T20:48:17.411Z",
  "__v": 0
}
```

 <br/>

<br/>

#### 4. Methods: `POST` `/api/transactions/transfer` This is for sending wallet balance from one user to another<br/>

Request

```json
{
  "recipientsUsername": "alice",
  "sendersUsername": "dayo",
  "amount": 35000,
  "description": "Welcome Bonus"
}
```

Response

```json
201 Created
{
  "message": "Transfer successful",
  "transferResult": [
    {
      "statusCode": 201,
      "message": "Debit Successful",
      "data": {
        "updatedWallet": {
          "_id": "64bdb61473bd766e137fae20",
          "fullname": "Adedayo Oriolowo",
          "username": "dayo",
          "email": "adedayoniyio@gmail.com",
          "password": "$2a$08$fyjxrqmXieBNWPQMoWPC1ev3uu99m9S3fapqGN5BbCGi9Rw6ne3rG",
          "balance": 867000,
          "type": "admin",
          "deviceToken": "e4T3NrGQTien_ctRy9HuSk:APA91bGl446xH9fn-e26Kh4cH8mfhkdxLZo-n1DXIx3AkPkLw_Kkaad4DobsZJJL_rq85UNohuzu4CuJQiStIdfY010nV033RAt9OJu18nLeScJsAJSeZNgh6kjHg2AqoCFOSoHNg0DX",
          "isVerified": true,
          "createdAt": "2023-07-23T23:21:56.876Z",
          "updatedAt": "2023-07-24T13:55:42.956Z",
          "__v": 0,
          "pin": "$2a$08$5oKMEdmNqWQQ3N5EAvhJ0.xP8KcXen0wQ9v2PhG/8u311cEvtDP7a"
        },
        "transaction": [
          {
            "trnxType": "Debit",
            "purpose": "Transfer",
            "amount": 35000,
            "username": "dayo",
            "reference": "c36213f1-b361-4022-878d-fb4e51bf09dc",
            "balanceBefore": 867000,
            "balanceAfter": 832000,
            "fullNameTransactionEntity": "Alice James",
            "description": "Welcome Bonus",
            "_id": "64bee4ca1097c546ad9d7202",
            "createdAt": "2023-07-24T20:53:30.968Z",
            "updatedAt": "2023-07-24T20:53:30.968Z",
            "__v": 0
          }
        ]
      }
    },
    {
      "statusCode": 201,
      "message": "Credit Successful",
      "data": {
        "updatedWallet": {
          "_id": "647369cd3836b967499f2010",
          "fullname": "Alice James",
          "username": "alice",
          "email": "alicetest@mail.com",
          "password": "$2a$08$c9LW1TM3iztI1FPNX2B24ODh9mJyeMsPEZ2EHbeWe/0OqswnXJvCa",
          "balance": 10400,
          "type": "user",
          "createdAt": "2023-05-28T14:48:45.502Z",
          "updatedAt": "2023-07-24T13:35:29.547Z",
          "__v": 0,
          "pin": "$2a$08$BSBApBOBUFLy3ZssBvyB8OW8f45SWMvILcf8hFlQHOcjbq9kIcmma",
          "deviceToken": "e4T3NrGQTien_ctRy9HuSk:APA91bGl446xH9fn-e26Kh4cH8mfhkdxLZo-n1DXIx3AkPkLw_Kkaad4DobsZJJL_rq85UNohuzu4CuJQiStIdfY010nV033RAt9OJu18nLeScJsAJSeZNgh6kjHg2AqoCFOSoHNg0DX",
          "isVerified": true
        },
        "transaction": [
          {
            "trnxType": "Credit",
            "purpose": "Transfer",
            "amount": 35000,
            "username": "alice",
            "reference": "c36213f1-b361-4022-878d-fb4e51bf09dc",
            "balanceBefore": 10400,
            "balanceAfter": 45400,
            "fullNameTransactionEntity": "Adedayo Oriolowo",
            "description": "Welcome Bonus",
            "_id": "64bee4ca1097c546ad9d7200",
            "createdAt": "2023-07-24T20:53:30.964Z",
            "updatedAt": "2023-07-24T20:53:30.964Z",
            "__v": 0
          }
        ]
      }
    }
  ]
}
```

<br/>

<br/>

#### 5. Methods: `POST` `/admin/sendPushNotifications` This is used for sending push notifications to registered users. Only Admins can use this route <br/>

Request

```json
{
  "title": "Transfers",
  "body": "Transfers will be briefly paused due to server maintenance"
}
```

Response

```json
200 OK
{
  "message": "Notifications sent successfully"
}
```

## Check ../routes for more routes

### DEPENDENCIES 📦

1. <a href="https://www.npmjs.com/package/bcryptjs">bcryptjs</a>
2. <a href="https://www.npmjs.com/package/cors">cors</a>

3. <a href="https://www.npmjs.com/package/dotenv">dotenv</a>

4. <a href="https://www.npmjs.com/package/express">express</a>

5. <a href="https://www.npmjs.com/package/firebase-admin">firebase-admin</a>

6. <a href="https://www.npmjs.com/package/jsonwebtoken">jsonwebtoken</a>

7. <a href="https://www.npmjs.com/package/mongoose">mongoose</a>

8. <a href="https://www.npmjs.com/package/nodemailer">nodemailer</a>

9. <a href="https://www.npmjs.com/package/otp-generator">otp-generator</a>

10. <a href="https://www.npmjs.com/package/socket.io">socket.io</a>

11. <a href="https://www.npmjs.com/package/bcryptjs">bcryptjs</a>

12. <a href="https://www.npmjs.com/package/uuid">uuid</a>

## Contributing

Pull requests are welcome. If you encounter any problem with the app or server, you can open an issue.

##### If you liked this project, don't forget to leave a star 🌟.

##### Note: As of now, no tests are available

## License

This project is licensed under the MIT License - see the <a href="https://github.com/adedayoniyi/Pay-Mobile-P2P-Money-Transfer-App/blob/main/LICENSE.md">LICENSE</a> file for details.
