// Mode 1: Find the Bug. All scenarios are fictional and simulated locally.
// Each option needs `text` and `why`; exactly one option has `correct: true`.
// `ui` renders a simulated application window; `api` renders a request/response viewer.
// Keep answer options similar in length so the longest one is not a giveaway (checked by `npm test`).

export const findBugScenarios = [
  {
    "id": "fb-phone",
    "difficulty": "beginner",
    "topic": "Input validation",
    "title": "Phone number validation",
    "context": "Requirement: the phone number field accepts exactly 10 digits and rejects anything else.",
    "ui": {
      "url": "https://crm.example.test/customers/new",
      "title": "Add customer",
      "fields": [
        {
          "label": "Full name",
          "value": "Rohan Mehta"
        },
        {
          "label": "Phone number",
          "value": "98ab7x4210"
        }
      ],
      "banner": {
        "tone": "pass",
        "text": "Customer saved successfully"
      },
      "action": "Save customer"
    },
    "note": {
      "id": "TN-101",
      "steps": [
        "Open the Add customer form",
        "Type 98ab7x4210 into Phone number",
        "Click Save customer"
      ],
      "observed": "The record was saved and no validation message appeared."
    },
    "question": "Which defect does this show?",
    "options": [
      {
        "text": "The phone field accepts letters, so input validation is missing or too weak.",
        "correct": true,
        "why": "The requirement allows only 10 digits, yet letters were saved. The form should reject the value and explain why."
      },
      {
        "text": "The Save button should be disabled after one click, so the form cannot be submitted twice.",
        "why": "Not related to what was observed. The problem is the data that was accepted."
      },
      {
        "text": "The success banner appears at the top of the form instead of next to the Save button.",
        "why": "Banner position is cosmetic. Accepting invalid data is a more serious problem."
      },
      {
        "text": "Nothing is wrong, because some real-world phone numbers are written with letters.",
        "why": "Some real numbers use letters, but this requirement says digits only. Test against the stated rules, not assumptions."
      }
    ],
    "explanation": "Validation should enforce the requirement on the server as well as in the form. A good next step is to try other invalid values: symbols, spaces, and too few or too many digits."
  },
  {
    "id": "fb-required",
    "difficulty": "beginner",
    "topic": "Form validation",
    "title": "Required field left empty",
    "context": "Requirement: Email is a required field when creating an account.",
    "ui": {
      "url": "https://app.example.test/signup",
      "title": "Create account",
      "fields": [
        {
          "label": "Name",
          "value": "Meera Nair"
        },
        {
          "label": "Email",
          "value": "(left empty)",
          "empty": true
        },
        {
          "label": "Password",
          "value": "••••••••"
        }
      ],
      "banner": {
        "tone": "pass",
        "text": "Account created"
      },
      "action": "Create account"
    },
    "note": {
      "id": "TN-102",
      "steps": [
        "Fill in Name and Password",
        "Leave Email empty",
        "Click Create account"
      ],
      "observed": "An account was created with no email address and no error message."
    },
    "question": "Which defect does this show?",
    "options": [
      {
        "text": "A required field can be submitted empty, and no helpful error is shown.",
        "correct": true,
        "why": "The requirement says Email is required. The form should block the submission and say which field needs attention."
      },
      {
        "text": "The password is displayed as dots, so the tester cannot see what was typed.",
        "why": "Masking a password is normal and expected behaviour."
      },
      {
        "text": "The Name field should accept digits, because some users enter a company ID there.",
        "why": "Nothing in the scenario suggests names must allow numbers."
      },
      {
        "text": "The page needs a longer title so users know which form they are filling in.",
        "why": "Title length has nothing to do with the missing validation."
      }
    ],
    "explanation": "Test required fields one at a time, and also test whitespace-only values. Check the server response too, because a form can look correct while the API still accepts empty data."
  },
  {
    "id": "fb-total",
    "difficulty": "beginner",
    "topic": "Calculations",
    "title": "Cart total does not add up",
    "context": "Requirement: tax is 18% of the subtotal, and total = subtotal + tax.",
    "ui": {
      "url": "https://shop.example.test/cart",
      "title": "Your cart",
      "table": {
        "head": [
          "Item",
          "Qty",
          "Price",
          "Line total"
        ],
        "rows": [
          [
            "Notebook",
            "2",
            "₹120.00",
            "₹240.00"
          ],
          [
            "Pen",
            "3",
            "₹30.00",
            "₹90.00"
          ]
        ]
      },
      "rows": [
        {
          "label": "Subtotal",
          "value": "₹330.00"
        },
        {
          "label": "Tax (18%)",
          "value": "₹59.40"
        },
        {
          "label": "Total",
          "value": "₹359.40",
          "strong": true
        }
      ],
      "action": "Checkout"
    },
    "note": {
      "id": "TN-103",
      "steps": [
        "Add 2 notebooks and 3 pens",
        "Open the cart"
      ],
      "observed": "The subtotal and tax look right, but the total looks too low."
    },
    "question": "Which defect does this show?",
    "options": [
      {
        "text": "The total does not equal subtotal plus tax. It should be ₹389.40.",
        "correct": true,
        "why": "₹330.00 + ₹59.40 = ₹389.40, so the displayed ₹359.40 is wrong."
      },
      {
        "text": "The tax label should show 18.00% instead of 18%, to match the amounts shown.",
        "why": "A formatting preference. It would not explain the wrong total."
      },
      {
        "text": "The quantity column should be editable so users can change items in the cart.",
        "why": "A possible feature request, but not a defect in what was observed."
      },
      {
        "text": "The cart should show product photos next to each item name and price.",
        "why": "Not part of the requirement, and unrelated to the calculation."
      }
    ],
    "explanation": "Always recompute calculated values by hand from the requirement. Then vary the inputs (quantity 0, large quantities, different prices) to see whether the error is constant or depends on the data."
  },
  {
    "id": "fb-stale",
    "difficulty": "beginner",
    "topic": "UI state",
    "title": "Old name still showing",
    "context": "Requirement: after a successful profile update, every part of the page shows the new details.",
    "ui": {
      "url": "https://app.example.test/profile",
      "title": "My profile",
      "rows": [
        {
          "label": "Greeting in page header",
          "value": "Hello, Asha"
        },
        {
          "label": "Display name field",
          "value": "Asha R."
        }
      ],
      "banner": {
        "tone": "pass",
        "text": "Profile updated"
      }
    },
    "note": {
      "id": "TN-104",
      "steps": [
        "Change Display name from Asha to Asha R.",
        "Click Save",
        "Read the greeting at the top of the page"
      ],
      "observed": "The greeting still says Hello, Asha. After a full page reload it says Hello, Asha R."
    },
    "question": "Which defect does this show?",
    "options": [
      {
        "text": "The interface keeps showing old data after a successful update (stale UI state).",
        "correct": true,
        "why": "The data was saved, but the page did not refresh the part of the screen that displays it."
      },
      {
        "text": "The update failed to save on the server, so only the form kept the new value.",
        "why": "After a reload the new name appears, so the save worked."
      },
      {
        "text": "Display names must be unique, so the greeting kept the previous name.",
        "why": "Nothing in the scenario points to a uniqueness rule."
      },
      {
        "text": "The greeting font is too small, so the new name is hard to notice.",
        "why": "Styling is not the issue. The text itself is out of date."
      }
    ],
    "explanation": "A reload that fixes the display is a strong clue that the stored data is right and the screen state is stale. Check other places that show the same value, such as menus, lists and other tabs."
  },
  {
    "id": "fb-unauth",
    "difficulty": "intermediate",
    "topic": "Authorization",
    "title": "Page opened by typing the URL",
    "context": "Requirement: only users with the Admin role can open the user management page.",
    "ui": {
      "url": "https://app.example.test/admin/users",
      "title": "User management",
      "rows": [
        {
          "label": "Signed in as",
          "value": "priya (role: Viewer)"
        }
      ],
      "table": {
        "head": [
          "Name",
          "Role",
          "Status"
        ],
        "rows": [
          [
            "Aman Verma",
            "Admin",
            "Active"
          ],
          [
            "Kiran Shah",
            "Manager",
            "Active"
          ],
          [
            "Priya Das",
            "Viewer",
            "Active"
          ]
        ]
      }
    },
    "note": {
      "id": "TN-105",
      "steps": [
        "Sign in as a user with the Viewer role",
        "Notice there is no User management link in the menu",
        "Type /admin/users into the address bar"
      ],
      "observed": "The full user list is displayed."
    },
    "question": "Which defect does this show?",
    "options": [
      {
        "text": "Authorization is missing on the page itself. Hiding the menu link is not enough.",
        "correct": true,
        "why": "A protected resource must check the user’s permission every time it is requested, whatever the menu shows."
      },
      {
        "text": "Nothing is wrong, because the link was not visible in the menu for a Viewer.",
        "why": "Hiding a link does not protect a page. Anyone can type or share the address."
      },
      {
        "text": "The user table needs more columns, such as last login date and email address.",
        "why": "Not related to the access problem."
      },
      {
        "text": "Viewers should see a different menu colour so they know which pages are restricted.",
        "why": "Styling does not control access."
      }
    ],
    "explanation": "Test protected pages and their API calls directly, for each role, not only through the menu. Also check that the data behind the page is protected, not just the page shell."
  },
  {
    "id": "fb-duplicate",
    "difficulty": "intermediate",
    "topic": "Duplicate submission",
    "title": "Three orders from one checkout",
    "context": "Requirement: one click on Place order creates exactly one order.",
    "ui": {
      "url": "https://shop.example.test/orders",
      "title": "Order history",
      "table": {
        "head": [
          "Order",
          "Items",
          "Total",
          "Placed at"
        ],
        "rows": [
          [
            "ORD-1041",
            "2 items",
            "₹389.40",
            "10:02:11"
          ],
          [
            "ORD-1042",
            "2 items",
            "₹389.40",
            "10:02:11"
          ],
          [
            "ORD-1043",
            "2 items",
            "₹389.40",
            "10:02:12"
          ]
        ]
      }
    },
    "note": {
      "id": "TN-106",
      "steps": [
        "Add two items to the cart",
        "Click Place order three times in quick succession"
      ],
      "observed": "Three separate orders with identical contents were created."
    },
    "question": "Which defect does this show?",
    "options": [
      {
        "text": "There is no safeguard against duplicate submissions, such as disabling the button after a click.",
        "correct": true,
        "why": "Repeated clicks, slow networks and retries are normal. The application must prevent one action from creating several orders."
      },
      {
        "text": "Order numbers should be random instead of sequential, so duplicates are easier to spot in the history.",
        "why": "Sequential numbers are not the problem. The extra orders are."
      },
      {
        "text": "The order history table should be sortable by time so the duplicates appear together.",
        "why": "A feature idea, not related to the duplicates."
      },
      {
        "text": "The cart should empty more slowly after checkout, so the user sees the confirmation first.",
        "why": "Timing of the cart is not the cause."
      }
    ],
    "explanation": "Test double clicks, the browser back button and refreshing after submit. A good fix works on the server side too, so a repeated request cannot create a second order."
  },
  {
    "id": "fb-status",
    "difficulty": "intermediate",
    "topic": "API status codes",
    "title": "Invalid request answered with 200",
    "context": "API contract: invalid input returns 400 Bad Request with an error body.",
    "api": {
      "request": {
        "method": "POST",
        "path": "/api/customers",
        "body": {
          "name": "Rohan Mehta",
          "email": "not-an-email"
        }
      },
      "response": {
        "status": "200 OK",
        "body": {
          "error": "Invalid email address"
        }
      }
    },
    "note": {
      "id": "TN-107",
      "steps": [
        "Send a create-customer request with an invalid email address"
      ],
      "observed": "The error text is in the body, but the HTTP status is 200 OK."
    },
    "question": "Which defect does this show?",
    "options": [
      {
        "text": "The status code breaks the contract. A client error (400) is expected for invalid input.",
        "correct": true,
        "why": "Clients rely on the status code to detect failure. Returning 200 for a rejected request breaks the documented contract."
      },
      {
        "text": "The response body should be XML so that clients can parse the error more easily.",
        "why": "Nothing in the contract asks for XML."
      },
      {
        "text": "The request should have been sent as GET, because the email address is only being checked.",
        "why": "Creating data is normally done with POST, so the method is fine."
      },
      {
        "text": "The error message should be longer and also explain how to enter a valid address.",
        "why": "Message length is not the issue. The status contradicts the contract."
      }
    ],
    "explanation": "The right status code always comes from the contract for that API. Here the contract names 400, so 200 is a defect. In another API, the documented code might be different."
  },
  {
    "id": "fb-access-ui",
    "difficulty": "intermediate",
    "topic": "Access control",
    "title": "Restricted button is visible",
    "context": "Requirement: only Managers can export customer data. Support Agents must not see or use the Export action.",
    "ui": {
      "url": "https://crm.example.test/customers",
      "title": "Customers",
      "rows": [
        {
          "label": "Signed in as",
          "value": "Support Agent"
        }
      ],
      "table": {
        "head": [
          "Name",
          "City"
        ],
        "rows": [
          [
            "Rohan Mehta",
            "Pune"
          ],
          [
            "Meera Nair",
            "Kochi"
          ]
        ]
      },
      "action": "Export all customers"
    },
    "note": {
      "id": "TN-108",
      "steps": [
        "Sign in as a Support Agent",
        "Notice the Export all customers button",
        "Click it"
      ],
      "observed": "The button is shown. Clicking it returns HTTP 403 Forbidden and the message You do not have permission."
    },
    "question": "Which statement describes the defect?",
    "options": [
      {
        "text": "The UI shows an action this role cannot use, so UI and backend permissions are inconsistent.",
        "correct": true,
        "why": "The backend correctly denied the request, but the UI should also hide or disable actions the role cannot perform."
      },
      {
        "text": "The backend is wrong to return 403, because the Support Agent is a signed-in user.",
        "why": "Denying the request is correct. The inconsistency is in what the UI shows."
      },
      {
        "text": "Nothing is wrong, because the backend blocked the request and no data was exposed.",
        "why": "The backend did its job, but showing a button that always fails confuses users and suggests permissions are not applied consistently."
      },
      {
        "text": "The 403 response should include a technical stack trace, so that users can see exactly why it failed.",
        "why": "Stack traces expose internal details and should not be shown to users."
      }
    ],
    "explanation": "Permissions should be enforced on the backend and reflected in the UI. Remember the reverse risk too: a hidden button alone is never enough if the API would still accept the request."
  },
  {
    "id": "fb-idor",
    "difficulty": "advanced",
    "topic": "Object-level authorization",
    "title": "Someone else’s invoice",
    "context": "Requirement: customers can view only their own invoices.",
    "api": {
      "request": {
        "method": "GET",
        "path": "/api/invoices/9002",
        "headers": {
          "Authorization": "Bearer <token for customer 7>"
        }
      },
      "response": {
        "status": "200 OK",
        "body": {
          "id": 9002,
          "customerId": 12,
          "amount": "₹4,200.00",
          "status": "Paid"
        }
      }
    },
    "note": {
      "id": "TN-109",
      "steps": [
        "Sign in as customer 7",
        "Request invoice 9002, which belongs to customer 12"
      ],
      "observed": "The invoice of customer 12 is returned."
    },
    "question": "Which statement describes the defect?",
    "options": [
      {
        "text": "Object-level authorization is missing: changing the ID returns another customer’s invoice.",
        "correct": true,
        "why": "Authentication shows who the caller is. Authorization decides which records they may access, and that check is missing here."
      },
      {
        "text": "The user is authenticated, so a 200 response with the invoice data is correct.",
        "why": "Being signed in does not give access to every record."
      },
      {
        "text": "The amount should be returned as a number instead of a formatted string with a currency symbol.",
        "why": "Possibly worth a note, but it is not the most important finding."
      },
      {
        "text": "The API needs rate limiting so that one user cannot request many invoices in a short time.",
        "why": "A reasonable hardening topic, but it does not explain why customer 7 can read customer 12’s invoice."
      }
    ],
    "explanation": "Test with two accounts: request records that belong to the other account, for read, update and delete. Check lists and search results as well as single-record calls."
  },
  {
    "id": "fb-discount",
    "difficulty": "advanced",
    "topic": "Boundary values",
    "title": "Discount over 100%",
    "context": "Requirement: the discount percentage must be between 0 and 100.",
    "ui": {
      "url": "https://shop.example.test/cart",
      "title": "Apply discount",
      "fields": [
        {
          "label": "Discount %",
          "value": "150"
        }
      ],
      "rows": [
        {
          "label": "Subtotal",
          "value": "₹900.00"
        },
        {
          "label": "Discount (150%)",
          "value": "−₹1,350.00"
        },
        {
          "label": "Total",
          "value": "−₹450.00",
          "strong": true
        }
      ],
      "banner": {
        "tone": "pass",
        "text": "Discount applied"
      }
    },
    "note": {
      "id": "TN-110",
      "steps": [
        "Add items worth ₹900.00",
        "Enter 150 in Discount %",
        "Click Apply"
      ],
      "observed": "The discount was applied and the total became negative."
    },
    "question": "Which response shows the best testing judgement?",
    "options": [
      {
        "text": "Report the missing range validation, then test boundary values such as −1, 0, 100 and 101.",
        "correct": true,
        "why": "This finds the root cause (no range check) and explores the edges where such bugs usually sit."
      },
      {
        "text": "Report that the total is negative and stop, because 150 is just one example of the problem.",
        "why": "That describes one symptom. Without boundary tests you cannot tell how wide the problem is."
      },
      {
        "text": "Close it, because users will not enter a discount of 150 percent in normal use.",
        "why": "Users make mistakes and requests can be crafted. The business rule has to be enforced."
      },
      {
        "text": "Ask for negative totals to be displayed in brackets so they are easier to spot.",
        "why": "That changes how the problem looks, not the rule that is being broken."
      }
    ],
    "explanation": "Boundary testing checks just below, on and just above each limit, plus unusual types such as decimals and empty values. Check the API as well as the form."
  },
  {
    "id": "fb-lost-update",
    "difficulty": "advanced",
    "topic": "Concurrency",
    "title": "The price change disappeared",
    "context": "Requirement: saving a product must never silently overwrite changes made by someone else.",
    "ui": {
      "url": "https://shop.example.test/admin/products/P-17",
      "title": "Product P-17",
      "rows": [
        {
          "label": "Price",
          "value": "₹500"
        },
        {
          "label": "Stock",
          "value": "18"
        }
      ],
      "banner": {
        "tone": "pass",
        "text": "Product saved"
      }
    },
    "note": {
      "id": "TN-111",
      "steps": [
        "Tab A and Tab B both open P-17 (price ₹500, stock 20)",
        "Tab A: change the price to ₹550 and save",
        "Tab B: change the stock to 18 and save, leaving price untouched"
      ],
      "observed": "P-17 now shows price ₹500 and stock 18. The ₹550 price is gone."
    },
    "question": "Which defect does this show?",
    "options": [
      {
        "text": "A lost update: saving stale data overwrote another change, so concurrency control is missing.",
        "correct": true,
        "why": "Tab B saved the whole record from its old copy, replacing the newer price."
      },
      {
        "text": "Tab A failed to save the price, so the old price stayed in the database all along.",
        "why": "Tab A saved successfully. The price was later overwritten by Tab B."
      },
      {
        "text": "The stock field stored the wrong number, which also reset the price to its old value.",
        "why": "Stock shows 18, exactly what was entered."
      },
      {
        "text": "Users should be told not to open the same product in two tabs at the same time.",
        "why": "Relying on user behaviour is not a fix. Two people can edit the same product at once anyway."
      }
    ],
    "explanation": "Look for overwrite problems whenever two users or tabs can edit the same record. Typical protections are version numbers, timestamps or an update that changes only the edited fields."
  },
  {
    "id": "fb-crossmodule",
    "difficulty": "advanced",
    "topic": "Data consistency",
    "title": "Two modules disagree",
    "context": "Requirement: the Finance report revenue equals the sum of paid orders for the same period.",
    "ui": {
      "url": "https://app.example.test/finance/summary",
      "title": "Finance summary and Orders module",
      "table": {
        "head": [
          "Paid order",
          "Amount"
        ],
        "rows": [
          [
            "ORD-2001",
            "₹900"
          ],
          [
            "ORD-2002",
            "₹700"
          ],
          [
            "ORD-2003",
            "₹500"
          ]
        ]
      },
      "rows": [
        {
          "label": "Sum of paid orders (Orders module)",
          "value": "₹2,100"
        },
        {
          "label": "Revenue (Finance report)",
          "value": "₹2,400",
          "strong": true
        }
      ]
    },
    "note": {
      "id": "TN-112",
      "steps": [
        "Open the Orders module and list the paid orders for the period",
        "Open the Finance report for the same period"
      ],
      "observed": "The two modules show different totals."
    },
    "question": "What should you do first?",
    "options": [
      {
        "text": "Trace the figures: compare each paid order with the report data to find where they diverge.",
        "correct": true,
        "why": "Finding the first point of difference tells you which module, record or rule is responsible, and gives developers a precise report."
      },
      {
        "text": "Accept the Finance report, because finance reports are always checked and reliable.",
        "why": "No source is automatically right. The requirement says the two must match."
      },
      {
        "text": "Change the expected value in the test so that it matches what the report shows today.",
        "why": "That hides the problem instead of investigating it."
      },
      {
        "text": "Wait a day and check again, because the two modules will probably synchronise their figures later.",
        "why": "Only valid if the requirement allows delayed reporting. Check the requirement before assuming."
      }
    ],
    "explanation": "Cross-module checks find problems that single-module testing misses. Reduce the mismatch to one record or one rule, note the exact data and time, and report the smallest reproducing case."
  }
];
