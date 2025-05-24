var apim = require('apim');
var input = apim.getvariable('request.body');

var onboardedCorps = [
  { Corp_ID: "CORP001", TranIDs: ["TXN001"], Ben_IDs: ["BEN001"], Limits: { daily: 10000, weekly: 50000, monthly: 200000 }, ApprovedAmountLimit: 50000, DebitAccts: ["9876543210"], ActiveBenIDs: ["BEN001"], DeactivatedBenIDs: [], Hierarchy: "Level1" },
  // Add more corps as needed
];

// Mock DB / Cache for RefNo, UTRNo, RRN mappings (normally from DB)
var refNoMap = { "SP123": "CORP001" };
var utrNoMap = { "UTR123": "CORP001" };
var rrnMap = { "RRN123": "CORP001" };
var utrRefMap = { "UTR123": "SP123" };
var rrnRefMap = { "RRN123": "SP123" };

function errorResponse(tranId, corpId, errorCode, errorDesc) {
  return {
    Single_Payment_Corp_Resp: {
      Header: {
        TranID: tranId || "",
        Corp_ID: corpId || "",
        Maker_ID: "",
        Checker_ID: "",
        Approver_ID: "",
        Status: "FAILURE",
        Resp_cde: "",
        Error_Cde: errorCode,
        Error_Desc: errorDesc
      },
      Body: {},
      Signature: { Signature: "" }
    }
  };
}

function successResponse(tranId, corpId, benId, amount) {
  return {
    Single_Payment_Corp_Resp: {
      Header: {
        TranID: tranId,
        Corp_ID: corpId,
        Maker_ID: "",
        Checker_ID: "",
        Approver_ID: "",
        Status: "Initiated",
        Resp_cde: "99",
        Error_Cde: "",
        Error_Desc: ""
      },
      Body: {
        RefNo: "SP" + Math.floor(Math.random() * 1000000),
        UTRNo: "UTR" + Math.floor(Math.random() * 1000000),
        PONum: "PO" + Math.floor(Math.random() * 100000),
        Ben_Acct_No: "9876543210",
        channelpartnerrefno: "IMPS" + Math.floor(Math.random() * 100000),
        Amount: amount,
        RRN: "RRN" + Math.floor(Math.random() * 1000000),
        Txn_Time: new Date().toISOString().replace('T', ' ').split('.')[0],
        Ben_ID: benId
      },
      Signature: { Signature: "Acknowledged" }
    }
  };
}

// --- START SCRIPT ---

// ER001: Improper JSON Format
if (!input || !input.Single_Payment_Corp_Req) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse("", "", "ER001", "Improper JSON Format"));
  apim.setvariable('message.status.code', 400);
  return;
}

var req = input.Single_Payment_Corp_Req;
var header = req.Header;
var body = req.Body;
var signature = req.Signature;

// ER002: Schema Validation Failure
if (!header || !header.TranID || !header.Corp_ID || !header.Maker_ID || !header.Checker_ID || !header.Approver_ID ||
    !body || !body.Amount || !body.Debit_Acct_No || !body.Debit_Acct_Name || !body.Debit_IFSC || !body.Debit_Mobile ||
    !body.Debit_TrnParticulars || !body.Debit_PartTrnRmks || !body.Mode_of_Pay || !body.Remarks || !body.Ben_ID ||
    !signature || !signature.Signature) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header?.TranID, header?.Corp_ID, "ER002", "Schema Validation Failure - Missing Required Fields"));
  apim.setvariable('message.status.code', 422);
  return;
}

// Find Corp
var user = onboardedCorps.find(u => u.Corp_ID === header.Corp_ID);

// ER003: Invalid CorpId
if (!user) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER003", "Invalid CorpId"));
  apim.setvariable('message.status.code', 403);
  return;
}

// Simulate ER004: Technical Failure (Example: forced with special TranID for demo)
if (header.TranID === "TECHFAIL") {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER004", "Technical Failure"));
  apim.setvariable('message.status.code', 500);
  return;
}

// Simulate ER006: Timeout Exception Occurred (special TranID)
if (header.TranID === "TIMEOUT") {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER006", "Timeout Exception Occurred"));
  apim.setvariable('message.status.code', 504);
  return;
}

// ER008: Invalid Corporate Hierarchy (simulate if header has Hierarchy field and mismatches)
if (req.Header.Corporate_Hierarchy && req.Header.Corporate_Hierarchy !== user.Hierarchy) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER008", "Invalid Corporate Hierarchy"));
  apim.setvariable('message.status.code', 403);
  return;
}

// ER013: Duplicate Transaction Id (if TranID already processed)
if (!user.TranIDs.includes(header.TranID)) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER013", "Duplicate Transaction Id"));
  apim.setvariable('message.status.code', 409);
  return;
}

// ER038: Ben ID is not registered
if (!user.Ben_IDs.includes(body.Ben_ID)) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER038", "Ben ID is not registered"));
  apim.setvariable('message.status.code', 404);
  return;
}

// ER045: Ben ID Provided is Deactivated
if (user.DeactivatedBenIDs.includes(body.Ben_ID)) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER045", "Ben ID Provided is Deactivated"));
  apim.setvariable('message.status.code', 403);
  return;
}

// ER046: Ben Id provided does not map to the CorpID
if (!user.ActiveBenIDs.includes(body.Ben_ID)) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER046", "Ben Id provided does not map to the CorpID"));
  apim.setvariable('message.status.code', 403);
  return;
}

// ER020: Request not valid for the given Debit Acct No
if (!user.DebitAccts.includes(body.Debit_Acct_No)) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER020", "Request not valid for the given Debit Acct No"));
  apim.setvariable('message.status.code', 422);
  return;
}

// ER049: The amount limits are not set for the entered Mode of Pay
// Simulate missing limit for Mode_of_Pay "NEFT" (just an example)
var modeOfPayLimits = { "IMPS": true, "NEFT": false, "RTGS": true };
if (!modeOfPayLimits[body.Mode_of_Pay]) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER049", "The amount limits are not set for the entered Mode of Pay"));
  apim.setvariable('message.status.code', 422);
  return;
}

// ER012: Transaction amount greater than Approver Amount Limit
if (body.Amount > user.ApprovedAmountLimit) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER012", "Transaction amount greater than Approver Amount Limit"));
  apim.setvariable('message.status.code', 422);
  return;
}

// ER047: DAILY, WEEKLY, MONTHLY LIMIT EXHAUSTED (simulate by simple checks)
// Here assume you have dailyTotal, weeklyTotal, monthlyTotal (mock values)
var dailyTotal = 9000;
var weeklyTotal = 40000;
var monthlyTotal = 180000;

if (dailyTotal + body.Amount > user.Limits.daily) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER047", "DAILY LIMIT EXHAUSTED"));
  apim.setvariable('message.status.code', 422);
  return;
}
if (weeklyTotal + body.Amount > user.Limits.weekly) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER047", "WEEKLY LIMIT EXHAUSTED"));
  apim.setvariable('message.status.code', 422);
  return;
}
if (monthlyTotal + body.Amount > user.Limits.monthly) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER047", "MONTHLY LIMIT EXHAUSTED"));
  apim.setvariable('message.status.code', 422);
  return;
}

// ER009: RefNo does not exist
if (body.RefNo && refNoMap[body.RefNo] !== header.Corp_ID) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER009", "RefNo does not exist"));
  apim.setvariable('message.status.code', 404);
  return;
}

// ER010: UTRNo does not exist
if (body.UTRNo && utrNoMap[body.UTRNo] !== header.Corp_ID) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER010", "UTRNo does not exist"));
  apim.setvariable('message.status.code', 404);
  return;
}

// ER011: RRN No does not exist
if (body.RRN && rrnMap[body.RRN] !== header.Corp_ID) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER011", "RRN No does not exist"));
  apim.setvariable('message.status.code', 404);
  return;
}

// ER019: UTR No and Ref No do not map to each other
if (body.UTRNo && body.RefNo && utrRefMap[body.UTRNo] !== body.RefNo) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER019", "UTR No and Ref No in the request do not map to each other"));
  apim.setvariable('message.status.code', 422);
  return;
}

// ER023: RRN No and Ref No do not map to each other
if (body.RRN && body.RefNo && rrnRefMap[body.RRN] !== body.RefNo) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER023", "RRN No and Ref No in the request do not map to each other"));
  apim.setvariable('message.status.code', 422);
  return;
}

// ER028: Transaction Id or Corp Id invalid (simulate if TranID does not start with "TXN")
if (!header.TranID.startsWith("TXN")) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER028", "Either Transaction Id or Corp Id is invalid."));
  apim.setvariable('message.status.code', 422);
  return;
}

// ER017: Error Occurred While Calling the Provider Service (simulate with special TranID)
if (header.TranID === "PROVFAIL") {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER017", "Error Occurred While Calling the Provider Service"));
  apim.setvariable('message.status.code', 502);
  return;
}

// ER018: Error Occurred While Accessing The ESB Database (simulate with special TranID)
if (header.TranID === "ESBFAIL") {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER018", "Error Occurred While Accessing The ESB Database"));
  apim.setvariable('message.status.code', 502);
  return;
}

// ER101: Transaction on hold as cut off time exceeded (simulate cutoff time check)
// Assume cutoff is 5 PM; request time after cutoff -> error
var now = new Date();
var cutoffHour = 17;
if (now.getHours() >= cutoffHour && body.Mode_of_Pay === "NEFT") {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER101", "Transaction on hold as cut off time exceeded. Will be processed on next working day."));
  apim.setvariable('message.status.code', 202);
  return;
}

// If all validations pass, respond with success
apim.output('application/json');
apim.setvariable('message.body', successResponse(header.TranID, header.Corp_ID, body.Ben_ID, body.Amount));
apim.setvariable('message.status.code', 200);

