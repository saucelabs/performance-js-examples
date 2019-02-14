Feature: Is Performance captured?
    Check webpage performance

    Scenario: Extended debugging cucumber-js demos
        Given I am testing extended debugging on webpage
        Then I check for sauce:network logs
        Then I check for sauce:timing logs
        Then I check for sauce:performance logs
        Then I assert that pageLoad is not degraded using sauce:performance custom command
        Then I assert that pageWeight is not degraded using sauce:performance custom command
        Then I check for sauce:metrics logs
