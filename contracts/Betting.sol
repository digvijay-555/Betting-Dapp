// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Betting {
    struct bet {
        uint256 bet_amount;
        uint8 team;
        address payable better;
    }

    address public owner;
    uint256 public min_bet_amt;
    string public team1_name;
    string public team2_name;

    constructor(uint256 minimum_bet) {
        owner = msg.sender;
        min_bet_amt = minimum_bet;
    }

    bool public Match_ended = false;
    uint256 public total_bets = 0;
    bet[] public bets;
    mapping(address => bool) public has_bet;
    uint256 public team1_bets_amt = 0;
    uint256 public team2_bets_amt = 0;
    uint8 public result;

    function setTeamNames(string memory _team1_name, string memory _team2_name) public onlyOwner {
        team1_name = _team1_name;
        team2_name = _team2_name;
    }

    function put_bet(uint8 _team) public payable {
        require(!Match_ended, "The betting is closed");
        require(_team == 1 || _team == 2, "Invalid team");
        require(msg.value >= min_bet_amt, "More stake needed");

        uint256 amount = msg.value;
        bets.push(bet(amount, _team, payable(msg.sender)));

        if (_team == 1) {
            team1_bets_amt += amount;
        }

        if (_team == 2) {
            team2_bets_amt += amount;
        }

        has_bet[msg.sender] = true;
        total_bets++;
    }

    function close_betting(uint8 _result) public onlyOwner {
        require(!Match_ended, "Betting already closed");
        require(_result == 1 || _result == 2, "Invalid result");
        Match_ended = true;
        result = _result;
    }

    function declare_results() public payable onlyOwner {
        require(Match_ended, "Betting is still open");

        uint256 winning_team_amt = (result == 1)
            ? team1_bets_amt
            : team2_bets_amt;
        uint256 losing_team_amt = (result == 1)
            ? team2_bets_amt
            : team1_bets_amt;

        for (uint256 i = 0; i < total_bets; i++) {
            if (bets[i].team == result) {
                uint256 ret_amt = (bets[i].bet_amount * losing_team_amt) /
                    winning_team_amt +
                    bets[i].bet_amount;
                bets[i].better.transfer(ret_amt);
            }
        }
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Not an owner");
        _;
    }
}