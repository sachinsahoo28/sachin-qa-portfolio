// Mode 2: API Detective. All requests, responses and data are fictional and never sent anywhere.
// The correct answer always depends on the contract excerpt shown with the scenario.
// Keep answer options similar in length so the longest one is not a giveaway (checked by `npm test`).

export const apiScenarios = [
  {
    "id": "ad-404",
    "difficulty": "beginner",
    "topic": "HTTP status codes",
    "title": "Order not found",
    "contract": "GET /api/orders/{id} returns 200 with the order, or 404 with an error body when the order does not exist.",
    "request": {
      "method": "GET",
      "path": "/api/orders/123"
    },
    "response": {
      "status": "200 OK",
      "body": {
        "success": false,
        "message": "Order not found"
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Whether the status code matches the contract for a missing order (404), not just the message.",
        "correct": true,
        "why": "The body says the order was not found, but the status says everything is fine. Clients often rely on the status code."
      },
      {
        "text": "Whether the message should be translated into more languages for customers in other regions or countries.",
        "why": "Localisation may matter later, but it is not the first question here."
      },
      {
        "text": "Whether order ID 123 has the right number of digits for an ID in this system.",
        "why": "The contract does not limit the digits. The issue is the response to a missing order."
      },
      {
        "text": "Whether the response is fast enough when the server handles many requests at the same time.",
        "why": "Performance is a separate concern and nothing here suggests slowness."
      }
    ],
    "explanation": "The expected code comes from the contract, not from habit. Another API might document a different convention for missing records, so always compare with the documentation first."
  },
  {
    "id": "ad-missing-field",
    "difficulty": "beginner",
    "topic": "Missing required fields",
    "title": "Customer created without an email",
    "contract": "POST /api/customers: name and email are required. Missing required fields return 400 with a list of field errors.",
    "request": {
      "method": "POST",
      "path": "/api/customers",
      "body": {
        "name": "Ravi Kumar"
      }
    },
    "response": {
      "status": "201 Created",
      "body": {
        "id": 55,
        "name": "Ravi Kumar",
        "email": null
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Why a request missing the required email was accepted instead of rejected with field errors.",
        "correct": true,
        "why": "The contract says missing required fields return 400. A created record with a null email breaks that rule and may corrupt data."
      },
      {
        "text": "Whether 201 is the right status code for any POST request that creates a record in the system.",
        "why": "201 is correct for a successful creation. The problem is that this request should not have succeeded."
      },
      {
        "text": "Whether the new ID should be larger, because 55 seems low for a customer created today.",
        "why": "The ID value is not part of the problem."
      },
      {
        "text": "Whether the name field should accept emoji and other special characters from customers.",
        "why": "An interesting later test, but unrelated to the missing email."
      }
    ],
    "explanation": "Test each required field separately, then test empty strings, null values and whitespace. Check that nothing is saved when the request is rejected."
  },
  {
    "id": "ad-datatype",
    "difficulty": "beginner",
    "topic": "Data types and server errors",
    "title": "Quantity sent as text",
    "contract": "POST /api/orders: quantity must be an integer of 1 or more. Invalid values return 400.",
    "request": {
      "method": "POST",
      "path": "/api/orders",
      "body": {
        "productId": "P-17",
        "quantity": "three"
      }
    },
    "response": {
      "status": "500 Internal Server Error",
      "body": {
        "message": "NumberFormatException: For input string \"three\""
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Why invalid input causes a server error instead of a 400, and why an internal exception is exposed.",
        "correct": true,
        "why": "A bad value from the client is a client error. A 500 suggests unhandled input, and the message reveals implementation details."
      },
      {
        "text": "Whether the word three should be accepted as the number 3 to be friendly to the user.",
        "why": "The contract says quantity must be an integer, so text should be rejected."
      },
      {
        "text": "Whether the server needs more memory, because the 500 error might be caused by load.",
        "why": "Nothing here points to a resource problem. The input was invalid."
      },
      {
        "text": "Whether the product ID format P-17 is correct, because the exception may be caused by that field instead.",
        "why": "The error message is about the quantity value."
      }
    ],
    "explanation": "Test wrong data types on every field: text for numbers, numbers for text, null, arrays. Invalid client input should give a clear 4xx response, not a server error."
  },
  {
    "id": "ad-consistency",
    "difficulty": "beginner",
    "topic": "Response body consistency",
    "title": "Different field names",
    "contract": "User objects use the fields id and name in every endpoint.",
    "request": {
      "method": "GET",
      "path": "/api/users/5"
    },
    "response": {
      "status": "200 OK",
      "body": {
        "user_id": 5,
        "fullName": "Meera Nair"
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Whether the field names and structure match the documented schema and other endpoints.",
        "correct": true,
        "why": "The contract names id and name, but the response uses user_id and fullName. Clients built to the contract would break."
      },
      {
        "text": "Whether Meera Nair should be written in capital letters, as in the other user screens.",
        "why": "Letter case of the data is not the issue."
      },
      {
        "text": "Whether the status should be 201, since a user object is being returned to the client.",
        "why": "201 is for creating something. A successful read correctly returns 200."
      },
      {
        "text": "Whether user 5 should exist at all, because the account may have been removed from the system already.",
        "why": "The user was returned, so the existence of the record is not in doubt."
      }
    ],
    "explanation": "Compare every response with the schema: field names, types, nesting and which fields can be null. Inconsistencies like this often appear when different developers wrote different endpoints."
  },
  {
    "id": "ad-401-403",
    "difficulty": "intermediate",
    "topic": "Authentication vs authorization",
    "title": "No credentials, but a 403",
    "contract": "401 Unauthorized: credentials missing or invalid. 403 Forbidden: valid credentials, but the user is not permitted.",
    "request": {
      "method": "GET",
      "path": "/api/admin/reports"
    },
    "response": {
      "status": "403 Forbidden",
      "body": {
        "error": "Access denied"
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Whether the API separates 401 from 403 as documented, since no credentials were sent.",
        "correct": true,
        "why": "No Authorization header was sent, so the contract expects 401. A 403 means the server treats the caller as known but not permitted."
      },
      {
        "text": "Whether the 403 should become a 500, because the server could not process the request.",
        "why": "A server error is not appropriate for an access decision."
      },
      {
        "text": "Whether the endpoint should be public, so that anyone can read the administrator reports.",
        "why": "The access policy is not in question. The code returned for a missing credential is."
      },
      {
        "text": "Whether the error message should be longer and explain exactly which permission the caller is missing.",
        "why": "Message length is not the main issue."
      }
    ],
    "explanation": "Authentication asks who you are. Authorization asks what you may do. Test both cases separately: no credentials, bad credentials, and valid credentials without permission."
  },
  {
    "id": "ad-duplicate",
    "difficulty": "intermediate",
    "topic": "Duplicate operations",
    "title": "The same lead created twice",
    "contract": "POST /api/leads: email must be unique. A duplicate email returns 409 Conflict.",
    "context": "The identical request was sent twice. The first call returned 201 with id 201.",
    "request": {
      "method": "POST",
      "path": "/api/leads",
      "body": {
        "name": "Sana Iqbal",
        "email": "lead@example.test"
      }
    },
    "response": {
      "status": "201 Created",
      "body": {
        "id": 202,
        "email": "lead@example.test"
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Whether the uniqueness rule is enforced: the duplicate should return 409, not create a second lead.",
        "correct": true,
        "why": "The contract defines the duplicate behaviour, and the second call did not follow it."
      },
      {
        "text": "Whether email addresses should be compared without regard to letter case, so that Lead@ and lead@ match.",
        "why": "Worth testing afterwards, but first confirm that basic duplicate detection works."
      },
      {
        "text": "Whether both calls should return the same ID so that the client sees a consistent record.",
        "why": "The contract asks for a conflict, not for the same record."
      },
      {
        "text": "Whether 201 is too slow for the creation of a record in the system.",
        "why": "Status codes do not describe speed."
      }
    ],
    "explanation": "After the basic duplicate check, explore variations: different letter case, extra spaces, and two requests sent at the same moment."
  },
  {
    "id": "ad-flaky-500",
    "difficulty": "intermediate",
    "topic": "Unexpected server errors",
    "title": "A valid request returns 500",
    "contract": "GET /api/invoices/{id} returns the invoice for a valid, existing ID.",
    "context": "Invoice 88 exists. The same request returned 200 five minutes ago.",
    "request": {
      "method": "GET",
      "path": "/api/invoices/88"
    },
    "response": {
      "status": "500 Internal Server Error",
      "body": {
        "error": "Unexpected error",
        "requestId": "req-7f3a"
      }
    },
    "question": "What should the QA Engineer do first?",
    "options": [
      {
        "text": "Reproduce it and narrow down the conditions, then share the request ID with developers for the logs.",
        "correct": true,
        "why": "A valid request must not fail. Intermittent errors are harder to fix without exact conditions and a request ID."
      },
      {
        "text": "Dismiss it as a one-off because the same request worked five minutes ago, and carry on with the next test case.",
        "why": "An intermittent failure is still a defect and may get worse under load."
      },
      {
        "text": "Change the expectation so that 500 is allowed for invoices, since the server seems unstable.",
        "why": "The contract does not allow it, and changing the expectation hides the problem."
      },
      {
        "text": "Retry the request until it passes and mark the test as green so the report looks clean.",
        "why": "Retrying until success makes the failure invisible."
      }
    ],
    "explanation": "Record the request, time, user, data and environment. Try repeating it a few times, and compare with other invoice IDs, to see what makes it fail."
  },
  {
    "id": "ad-delete-state",
    "difficulty": "intermediate",
    "topic": "State consistency",
    "title": "Deleted, but still readable",
    "contract": "DELETE /api/leads/{id} returns 200. Afterwards, GET /api/leads/{id} returns 404.",
    "context": "DELETE /api/leads/42 was sent earlier and returned 200 with {\"deleted\": true}. This is the follow-up read.",
    "request": {
      "method": "GET",
      "path": "/api/leads/42"
    },
    "response": {
      "status": "200 OK",
      "body": {
        "id": 42,
        "email": "lead@example.test",
        "deletedAt": null
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Whether the delete actually removed or hid the record, since a read should now return 404.",
        "correct": true,
        "why": "The delete said it worked, but the record is still readable with no deletion mark. The two responses contradict each other."
      },
      {
        "text": "Whether DELETE should return 204 instead of 200, since there is no content to return afterwards.",
        "why": "The contract documents 200, so that is not the first concern."
      },
      {
        "text": "Whether lead 42 has a valid email address, because the record may have been corrupted earlier.",
        "why": "The email is not the issue."
      },
      {
        "text": "Whether deletedAt should be a string, because a null value may break clients that parse dates.",
        "why": "Its type is secondary. The record should not be readable at all."
      }
    ],
    "explanation": "Always verify state after a change: read the record, list the collection and search for it. If a design uses soft delete, check that the documentation says what reads should return."
  },
  {
    "id": "ad-expired-token",
    "difficulty": "advanced",
    "topic": "Authentication",
    "title": "An expired token still works",
    "contract": "Expired or invalid tokens return 401 Unauthorized.",
    "request": {
      "method": "GET",
      "path": "/api/profile",
      "headers": {
        "Authorization": "Bearer <token that expired two hours ago>"
      }
    },
    "response": {
      "status": "200 OK",
      "body": {
        "id": 7,
        "name": "Asha Rao"
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Whether the server checks token expiry, then try other bad tokens such as tampered or missing ones.",
        "correct": true,
        "why": "The contract requires 401 for an expired token. Accepting it suggests token validation is incomplete, so related cases need checking."
      },
      {
        "text": "Whether the client should refresh the token automatically before it expires, to avoid this situation.",
        "why": "Client refresh behaviour is useful, but the server must still reject an expired token."
      },
      {
        "text": "Whether the profile fields are complete and match what the user entered when registering.",
        "why": "The profile content is not the concern here."
      },
      {
        "text": "Whether the token should be longer so that it is harder to guess, since this one was accepted.",
        "why": "Token length does not explain why an expired token was accepted."
      }
    ],
    "explanation": "Authentication checks need several negative cases, not just one. Keep the tests safe and run them only against systems you are allowed to test."
  },
  {
    "id": "ad-mass-assignment",
    "difficulty": "advanced",
    "topic": "Payload validation and authorization",
    "title": "A member changes their own role",
    "contract": "PATCH /api/users/{id}: members may update name and phone only. Only Admins may change role.",
    "context": "The caller is user 7, who has the role member.",
    "request": {
      "method": "PATCH",
      "path": "/api/users/7",
      "body": {
        "name": "Asha Rao",
        "role": "admin"
      }
    },
    "response": {
      "status": "200 OK",
      "body": {
        "id": 7,
        "name": "Asha Rao",
        "role": "admin"
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Whether fields the caller may not change (such as role) are accepted, which is privilege escalation.",
        "correct": true,
        "why": "The contract limits what a member may update. The response shows the role changed to admin."
      },
      {
        "text": "Whether the name can be updated by a member, because names are normally managed by an administrator.",
        "why": "Members are allowed to update their name, so that part is correct."
      },
      {
        "text": "Whether the response should leave out the id, since the caller already knows their own id.",
        "why": "Including the ID is normal and not related to the risk."
      },
      {
        "text": "Whether PATCH should be replaced by PUT, because PUT is clearer for updating a whole user record.",
        "why": "The method is not the cause of the problem."
      }
    ],
    "explanation": "Check which fields each role may change, and try sending extra fields that the form never shows. Then confirm that the change was really stored by reading the record again."
  },
  {
    "id": "ad-idempotency",
    "difficulty": "advanced",
    "topic": "Duplicate operations",
    "title": "A retried payment charged twice",
    "contract": "POST /api/payments with the same Idempotency-Key returns the original result and never creates a second charge.",
    "context": "The client timed out and sent the identical request again. The first attempt returned PAY-9001.",
    "request": {
      "method": "POST",
      "path": "/api/payments",
      "headers": {
        "Idempotency-Key": "order-5521-attempt-1"
      },
      "body": {
        "orderId": 5521,
        "amount": "₹1,200.00"
      }
    },
    "response": {
      "status": "201 Created",
      "body": {
        "paymentId": "PAY-9002",
        "status": "captured"
      }
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Whether the Idempotency-Key is honoured: the retry created a second payment, not PAY-9001 again.",
        "correct": true,
        "why": "The contract exists so that retries are safe. A second payment ID means the key is not being used."
      },
      {
        "text": "Whether clients should ever retry a payment request, since a retry can create a second charge.",
        "why": "Retries are normal after timeouts. The idempotency key is meant to make them safe."
      },
      {
        "text": "Whether payment IDs should be sequential, so that a duplicate can be found in the payment list.",
        "why": "The ID format is not the problem."
      },
      {
        "text": "Whether the amount should include a currency code, because the ₹ symbol alone is ambiguous for systems in other countries.",
        "why": "A possible improvement, but unrelated to the duplicate charge."
      }
    ],
    "explanation": "Also test the same key with a different body (the contract should define the result), and two identical requests sent at nearly the same time."
  },
  {
    "id": "ad-content-type",
    "difficulty": "advanced",
    "topic": "Response consistency",
    "title": "HTML from a JSON API",
    "contract": "GET /api/stock always returns application/json. Errors also use a JSON body.",
    "request": {
      "method": "GET",
      "path": "/api/stock?sku=A-100"
    },
    "response": {
      "status": "200 OK",
      "headers": {
        "Content-Type": "text/html"
      },
      "body": "<html><body><h1>502 Bad Gateway</h1></body></html>"
    },
    "question": "What should the QA Engineer investigate first?",
    "options": [
      {
        "text": "Where the response comes from: it looks like a gateway error page sent with 200 and the wrong type.",
        "correct": true,
        "why": "The status, content type and body all disagree with the contract, which points to a problem in the path between client and API."
      },
      {
        "text": "Whether SKU A-100 exists, since a missing item might explain why a strange page was returned.",
        "why": "A missing SKU would produce a JSON error, not a gateway page."
      },
      {
        "text": "Whether the API should switch to returning HTML, because the front end already shows HTML pages to users.",
        "why": "The contract specifies JSON."
      },
      {
        "text": "Whether the browser caches the page, because a cached copy might explain the old gateway error.",
        "why": "Caching is a later question. First understand why the response is wrong."
      }
    ],
    "explanation": "Check headers and body, not just the status line. A mismatch can mean a proxy, gateway or load balancer is hiding an upstream failure."
  }
];
