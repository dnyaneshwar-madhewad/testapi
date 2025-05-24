✅ Functional Test Cases
Test Case ID	Description	Input Variation	Expected Result
TC001	Valid Request	All required fields valid	Success response with UTR
TC002	Missing TranID	TranID is empty	ER001: Improper JSON format
TC003	Invalid Corp_ID	Corp_ID not in system	ER003: Invalid Corp_ID
TC004	Missing Amount	Amount field missing	ER002: Schema validation failure
TC005	Invalid Amount Format	Amount = "Five Thousand"	ER002: Schema validation failure
TC006	Amount = 0	Amount is zero	ER012: Amount not valid
TC007	Amount > Daily Limit	Daily usage + amount > allowed	ER048: Daily transaction limit exhausted
TC008	Invalid Debit_Acct_No	Account doesn't exist	ER020: Request not valid for the given Debit Acct No
TC009	Insufficient Balance	Balance < requested amount	ER012: Transaction amount greater than available balance
TC010	Invalid IFSC	Wrong IFSC format	ER002: Schema validation failure or custom ERxxx
TC011	Invalid Mobile Format	Mobile has alphabets or <10 digits	ER002: Schema validation failure
TC012	Missing Ben_ID	Ben_ID is missing	ER002: Schema validation failure
TC013	Duplicate TranID	TranID already exists	ER013: Duplicate Transaction ID
TC014	Missing Mode_of_Pay	Payment mode not provided	ER002: Schema validation failure
TC015	Mode_of_Pay Not Allowed	Mode not enabled for corporate	ER049: Mode of payment not permitted
TC016	NEFT After Cutoff	Mode = NEFT, time past cutoff	ER101: Transaction on hold as cutoff time exceeded
TC017	Valid IMPS	Mode = IMPS, valid data	Success with immediate UTR
TC018	Valid RTGS	Mode = RTGS, valid data	Success with UTR
TC019	Digital Signature Missing	Signature block not present	ER002: Schema validation failure
TC020	Signature Invalid	Invalid or mismatched signature	ER017: Error occurred while validating signature
TC021	Unauthorized Access	Wrong client_id / secret	ER004: Technical Failure (Unauthorized)
TC022	Internal Timeout	Backend delay > timeout	ER006: Timeout Exception Occurred
TC023	ESB Database Error	Database error on fetch	ER018: Error occurred while accessing ESB database

✅ Performance Test Cases
Test Case ID	Description	Input Variation	Expected Result
TC101	High Volume Load	1000 requests in 5 minutes	API handles load or throttles gracefully
TC102	Concurrent Requests	Multiple users making requests simultaneously	No race condition or duplicate UTR

✅ Security Test Cases
Test Case ID	Description	Input Variation	Expected Result
TC201	Missing Authentication	No client ID / secret	ER004: Technical Failure (Unauthorized)
TC202	Invalid Maker/Checker/Approver	User not authorized for role	ER008: Invalid Corporate Hierarchy
TC203	Invalid Signature Tampering	Payload altered after signature	ER017: Signature verification failed

✅ Optional Business Rules (If applicable)
Test Case ID	Description	Input Variation	Expected Result
TC301	Amount Exceeds Approver Limit	Approver limit < amount	ER047: Transaction amount greater than Approver Amount Limit
TC302	Amount Format	Amount with more than 2 decimals	ER002: Schema validation failure
TC303	Same Debit and Credit Account	Debit Acct = Beneficiary Acct	ER002: Invalid business rule
