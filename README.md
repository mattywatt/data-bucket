# data-bucket
Store data and make charts.

# Requirements

```
pip install flask
pip install pymongo
pip install jsonschema
pip install passlib
```

# API Usage

Firstly a token is required to use the API, a username and password can be used to get a token from `/api/login`:

```
curl  -X POST
      -H "Content-Type: application/json"
      -d '{"username":"matt","password":"password"}'
      http://localhost:5000/api/login
```

The response will include the **token** which must be provided with the Authorization header for all endpoints.

```
{ "user_image": "s3.boto",
  "token": "thisisatoken",
  "user_id": "5510c27a8cec086170ece1d3" }
```

A request to `/api/data/<data_id>`

```
curl  -H "Content-Type: application/json"
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsImV4cCI6MTQyNzUyNzIyMCwiaWF0IjoxNDI3MzU0NDIwfQ.eyJpZCI6IjU1MTBjMjdhOGNlYzA4NjE3MGVjZTFkMyJ9.Yabo6Q9M3Yi26zQ_TcTiAoDCsONRKWyBZFfLXpq3K28"
      http://localhost:5000/api/data/5511fee68cec086643f269a6
```

And a request to `/api/data/history/<data_id>`
