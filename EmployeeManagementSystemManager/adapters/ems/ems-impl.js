function getEmployeePending() {
	var input = {
		method : "get",
		returnedContentType : "json",
		path : "/employee/find/status/pending",
	};

	return WL.Server.invokeHttp(input);
}

function getEmployeeById(employeeId) {
	WL.Logger.info("employeeId = " + employeeId);

	var input = {
		method : "get",
		returnedContentType : "json",
		path : "/employee/find/" + employeeId,
	};

	return WL.Server.invokeHttp(input);
}

function approval(employeeId) {
	WL.Logger.info("employeeId = " + employeeId);

	var content = {};
	content.employee_id = employeeId;
	content.status = "approved";

	var input = {
		method : "post",
		returnedContentType : "json",
		path : "/employee/update",
		body : {
			contentType : "application/json",
			content : JSON.stringify(content)
		},
		headers : {
			"Accept" : "application/json"
		}
	};

	return WL.Server.invokeHttp(input);
}

function reject(employeeId) {
	WL.Logger.info("employeeId = " + employeeId);

	var content = {};
	content.employee_id = employeeId;
	content.status = "rejected";

	var input = {
		method : "post",
		returnedContentType : "json",
		path : "/employee/update",
		body : {
			contentType : "application/json",
			content : JSON.stringify(content)
		},
		headers : {
			"Accept" : "application/json"
		}
	};

	return WL.Server.invokeHttp(input);
}