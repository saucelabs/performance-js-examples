Feature: Is Performance captured?
    Check webpage performance

    Scenario: Extended debugging cucumber-js demo
        Given I am testing extended debugging on webpage
        Then I check for sauce:network logs
        Then I check for sauce:metrics logs
        Then I check for sauce:timing logs
        Then I check for sauce:performance logs
        Then I check for sauce:performance custom commands
