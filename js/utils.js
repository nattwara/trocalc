"use strict";

// Utilities Functions :

// insertLeadingZero(num)

function insertLeadingZero(num) {
    return (num < 10) ? num = "0" + num : num; // add zero in front of numbers < 10
}