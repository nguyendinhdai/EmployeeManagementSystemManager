var busy;
function wlCommonInit() {
	busy = new WL.BusyIndicator();
	displayEmployeePending();
}

function reload() {
	busy.show();
	setTimeout(WL.Client.reloadApp, 5000);
}

function displayEmployeePending() {
	busy.show();

	var resourceRequest = new WLResourceRequest(
			"/adapters/ems/getEmployeePending", WLResourceRequest.GET);
	resourceRequest.send().then(displayEmployeePendingSuccess,
			displayEmployeePendingFailure);
}

function displayEmployeePendingSuccess(result) {
	busy.hide();
	viewLists();

	var rows = result.responseJSON.rows;
	var table = createTable(rows);
	$('#list_of_employee').html(table);
	altRows('alternatecolor', true);
}

function displayEmployeePendingFailure(result) {
	busy.hide();

	WL.SimpleDialog.show("Informations",
			"Have an error occour when list all of employee pending", [ {
				text : 'Close',
				handler : function() {
				}
			} ]);
}

function altRows(id, hasHeader) {
	if (document.getElementsByTagName) {
		var table = document.getElementById(id);
		var rows = table.getElementsByTagName("tr");

		var r = 0;
		if (hasHeader)
			rows[r].className = "headerrowcolor";
		else
			r = -1;

		for (i = r + 1; i < rows.length; i++) {
			if (i % 2 == 0) {
				rows[i].className = "evenrowcolor";
			} else {
				rows[i].className = "oddrowcolor";
			}
		}
	}
}

function createTable(rows) {
	var table = '<table class="altrowstable" id="alternatecolor" style="width: 100%;">';
	table = table
			+ '<tr><th>Employee Id</th><th>Employee Name</th><th>Status</th><th>Actions</th></tr>';
	rows
			.forEach(function(row) {
				var data = row.key;
				table = table
						+ '<tr><td>'
						+ data.employee_id
						+ '</td><td>'
						+ data.employee_name
						+ '</td><td>'
						+ data.status
						+ '</td><td><input type="button" value="Details" onclick="details(\''
						+ data.employee_id + '\')"/></td></tr>';
			});
	table = table + '</table>';
	return table;
}

function details(employeeId) {
	busy.show();

	var data = [ employeeId ];
	var params = {
		'params' : JSON.stringify(data)
	};
	var resourceRequest = new WLResourceRequest(
			"/adapters/ems/getEmployeeById", WLResourceRequest.POST);
	resourceRequest.sendFormParameters(params).then(detailsSuccess,
			detailsFailure);
}

function detailsSuccess(result) {
	busy.hide();
	var data = result.responseJSON;
	$('#employee_id').html(data.employee_id);
	$('#employee_name').html(data.employee_name);
	$('#employee_sex').html(data.employee_sex);
	$('#employee_dayofbirth').html(data.employee_dayofbirth);

	viewDetails();
	altRows("table_details_employee", false);
}

function viewDetails() {
	$("#details_of_employee").show();
	$("#list_of_employee").hide();
}

function viewLists() {
	$("#details_of_employee").hide();
	$("#list_of_employee").show();
}

function detailsFailure(result) {
	busy.hide();
	WL.SimpleDialog.show("Informations",
			"Have an error occour when get details employee", [ {
				text : 'Close',
				handler : function() {
				}
			} ]);
}

function approval() {
	busy.show();

	var employee_id = $('#employee_id').text();
	var data = [ employee_id ];
	var params = {
		'params' : JSON.stringify(data)
	};
	var resourceRequest = new WLResourceRequest("/adapters/ems/approval",
			WLResourceRequest.POST);
	resourceRequest.sendFormParameters(params).then(approvalSuccess,
			approvalFailure);
}

function approvalSuccess(result) {
	busy.hide();
	var reStatus = result.responseJSON.status;
	if (reStatus === 'updated')
		WL.SimpleDialog.show("Informations",
				"You have been approval the employee", [ {
					text : 'Close',
					handler : function() {
						displayEmployeePending();
					}
				} ]);
	else
		approvalFailure(result);
}

function approvalFailure(result) {
	busy.hide();
	WL.SimpleDialog.show("Informations",
			"Have an error occour when approval employee", [ {
				text : 'Close',
				handler : function() {
				}
			} ]);
}

function reject() {
	busy.show();

	var employee_id = $('#employee_id').text();
	var data = [ employee_id ];
	var params = {
		'params' : JSON.stringify(data)
	};
	var resourceRequest = new WLResourceRequest("/adapters/ems/reject",
			WLResourceRequest.POST);
	resourceRequest.sendFormParameters(params).then(rejectSuccess,
			rejectFailure);
}

function rejectSuccess(result) {
	busy.hide();
	var reStatus = result.responseJSON.status;
	if (reStatus === 'updated')
		WL.SimpleDialog.show("Informations",
				"You have been rejected the employee", [ {
					text : 'Close',
					handler : function() {
						displayEmployeePending();
					}
				} ]);
	else
		approvalFailure(result);
}

function rejectFailure(result) {
	busy.hide();
	WL.SimpleDialog.show("Informations",
			"Have an error occour when reject employee", [ {
				text : 'Close',
				handler : function() {
				}
			} ]);
}