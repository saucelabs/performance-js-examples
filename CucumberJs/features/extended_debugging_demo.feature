Feature: Is Performance captured?
    Check webpage performance

    Scenario: Extended debugging cucumber-js demo
        Given I am testing extended debugging on webpage
        Then I check for sauce:performance logs
        Then I assert that pageLoad is not degraded using sauce:performance custom command
        Then I assert that speedIndex is not degraded using sauce:performance custom command
