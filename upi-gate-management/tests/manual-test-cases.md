# Experiment 08: Manual Test Cases for UPI Payment Gateway

## Test Case 1: User Registration/Login Module
| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result |
|-------|--------------|------------|-----------------|---------------|
| TC01 | Valid User Name | Enter "Rahul Sharma" in name field | Name accepted | Pass |
| TC02 | Empty User Name | Leave name field empty, click Pay | Error message shown | Pass |
| TC03 | Valid Email | Enter "user@example.com" | Email accepted | Pass |
| TC04 | Invalid Email | Enter "invalid-email" | Validation error | Pass |
| TC05 | Valid Mobile | Enter "+91 9876543210" | Mobile accepted | Pass |

## Test Case 2: Amount Module
| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result |
|-------|--------------|------------|-----------------|---------------|
| TC06 | Valid Amount | Enter 5000 | Amount accepted, GST calculated | Pass |
| TC07 | Zero Amount | Enter 0 | Error message | Pass |
| TC08 | Negative Amount | Enter -100 | Validation error | Pass |
| TC09 | Quick Amount | Click ₹5000 button | Amount set to 5000 | Pass |

## Test Case 3: UPI ID Validation
| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result |
|-------|--------------|------------|-----------------|---------------|
| TC10 | Valid UPI | Enter "user@okhdfcbank" | UPI accepted | Pass |
| TC11 | Invalid UPI (no @) | Enter "invalidupi" | Error message | Pass |
| TC12 | Empty UPI | Leave empty | Error message | Pass |

## Test Case 4: Payment Processing
| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result |
|-------|--------------|------------|-----------------|---------------|
| TC13 | Successful Payment | Enter valid details, click Pay | Success message, DB updated | Pass |
| TC14 | Payment Failure | System simulates failure | Failure message shown | Pass |
| TC15 | Timer Display | During payment | 2-minute timer visible | Pass |