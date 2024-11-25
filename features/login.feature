Feature: User Login

  Scenario: Successful login
    When the user attempts to log in with the email "test@example.com" and password "SecurePass_123"
    Then the login system should return a token
