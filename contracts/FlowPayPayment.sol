// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FlowPayPayment {
    struct Payment {
        address sender;
        address receiver;
        uint256 amount;
        string note;
        uint256 timestamp;
    }

    Payment[] private payments;

    event PaymentSent(
        uint256 indexed paymentId,
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        string note,
        uint256 timestamp
    );

    function sendPayment(
        address payable receiver,
        string calldata note
    ) external payable {
        require(receiver != address(0), "Invalid receiver");
        require(receiver != msg.sender, "Cannot pay yourself");
        require(msg.value > 0, "Amount must be greater than zero");

        uint256 paymentId = payments.length;

        payments.push(
            Payment({
                sender: msg.sender,
                receiver: receiver,
                amount: msg.value,
                note: note,
                timestamp: block.timestamp
            })
        );

        (bool success, ) = receiver.call{value: msg.value}("");
        require(success, "Payment failed");

        emit PaymentSent(
            paymentId,
            msg.sender,
            receiver,
            msg.value,
            note,
            block.timestamp
        );
    }

    function getPayment(
        uint256 paymentId
    ) external view returns (Payment memory) {
        require(paymentId < payments.length, "Payment not found");
        return payments[paymentId];
    }

    function totalPayments() external view returns (uint256) {
        return payments.length;
    }
}
