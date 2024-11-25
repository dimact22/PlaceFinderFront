Feature: User Registration

  Scenario: Successful registration
    Given the user is on the registration page
    When the user attempts to register with the following details:
      | First Name | Last Name | Email            | Phone         | Password  |
      | John       | Doe       | test3@example.com | +380123456789 | SecurePass_123 | 
    Then the system should return status "Ok"
    And the registration system should return a token
