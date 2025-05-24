// Load modules
var apim = require('apim');
var input = apim.getvariable('request.body');

// ===== Dummy User Data =====
var users = [
  { Corp_ID: "CORP001", TranIDs: ["TXN001"], Ben_IDs: ["BEN001"] },
  { Corp_ID: "CORP002", TranIDs: ["TXN002"], Ben_IDs: ["BEN002"] },
  { Corp_ID: "CORP003", TranIDs: ["TXN003"], Ben_IDs: ["BEN003"] },
  { Corp_ID: "CORP004", TranIDs: ["TXN004"], Ben_IDs: ["BEN004"] },
  { Corp_ID: "CORP005", TranIDs: ["TXN005"], Ben_IDs: ["BEN005"] },
  { Corp_ID: "CORP006", TranIDs: ["TXN006"], Ben_IDs: ["BEN006"] },
  { Corp_ID: "CORP007", TranIDs: ["TXN007"], Ben_IDs: ["BEN007"] },
  { Corp_ID: "CORP008", TranIDs: ["TXN008"], Ben_IDs: ["BEN008"] },
  { Corp_ID: "CORP009", TranIDs: ["TXN009"], Ben_IDs: ["BEN009"] },
  { Corp_ID: "CORP010", TranIDs: ["TXN010"], Ben_IDs: ["BEN010"] }
];

// ===== Error Response Utility =====
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

// ===== Success Response Utility =====
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

// ===== Validate JSON Structure =====
if (!input || !input.Single_Payment_Corp_Req) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse("", "", "ER001", "Invalid Request Format"));
  apim.setvariable('message.status.code', 400);
  return;
}

var req = input.Single_Payment_Corp_Req;
var header = req.Header;
var body = req.Body;
var signature = req.Signature;

// ===== Required Field Checks =====
if (!header || !header.TranID || !header.Corp_ID || !header.Maker_ID || !header.Checker_ID || !header.Approver_ID ||
    !body || !body.Amount || !body.Debit_Acct_No || !body.Debit_Acct_Name || !body.Debit_IFSC || !body.Debit_Mobile ||
    !body.Debit_TrnParticulars || !body.Debit_PartTrnRmks || !body.Mode_of_Pay || !body.Remarks || !body.Ben_ID ||
    !signature || !signature.Signature) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header?.TranID, header?.Corp_ID, "ER002", "Missing Required Fields"));
  apim.setvariable('message.status.code', 422);
  return;
}

// ===== Corp_ID Validation =====
var user = users.find(u => u.Corp_ID === header.Corp_ID);
if (!user) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER003", "Invalid CorpId"));
  apim.setvariable('message.status.code', 403);
  return;
}

// ===== Duplicate TranID Check =====
if (!user.TranIDs.includes(header.TranID)) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER013", "Duplicate Transaction ID"));
  apim.setvariable('message.status.code', 409);
  return;
}

// ===== Ben_ID Validation =====
if (!user.Ben_IDs.includes(body.Ben_ID)) {
  apim.output('application/json');
  apim.setvariable('message.body', errorResponse(header.TranID, header.Corp_ID, "ER038", "Ben ID is not registered"));
  apim.setvariable('message.status.code', 404);
  return;
}

// ===== Success =====
apim.output('application/json');
apim.setvariable('message.body', successResponse(header.TranID, header.Corp_ID, body.Ben_ID, body.Amount));
apim.setvariable('message.status.code', 200);
