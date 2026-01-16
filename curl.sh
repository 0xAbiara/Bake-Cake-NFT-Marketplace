curl --request POST \
  --url https://api.circle.com/v1/w3s/compliance/screening/addresses \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer TEST_API_KEY:8d726257af66159dd9248362afdef116:799e818cec5d5c994ac43f120e54129f' \
  --data '
  {
    "idempotencyKey": "a5b6df87-b6c5-4af7-a3c9-9b5fcd0b491b",
    "address": "0x1bf9a08cc2aa298c09a29955a806ee83278821Ec",
    "chain": "ETH-SEPOLIA"
  }'