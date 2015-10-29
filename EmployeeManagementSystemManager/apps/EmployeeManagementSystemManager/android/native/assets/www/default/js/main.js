
/* JavaScript content from js/main.js in folder common */
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

	var rows = result.responseJSON.rows;
	var table = createTable(rows);
	$('#list_of_employee').html(table);
	altRows('alternatecolor');
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

function altRows(id) {
	if (document.getElementsByTagName) {
		var table = document.getElementById(id);
		var rows = table.getElementsByTagName("tr");
		rows[0].className = "headerrowcolor";
		for (i = 1; i < rows.length; i++) {
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
			+ '<tr><th>Employee Id</th><th>Employee Name</th><th>Actions</th></tr>';
	rows
			.forEach(function(row) {
				var data = row.key;
				table = table
						+ '<tr><td>'
						+ data.employee_id
						+ '</td><td>'
						+ data.employee_name
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
			"/adapters/ems/getEmployeeById", WLResourceRequest.GET);
	resourceRequest.sendFormParameters(params).then(detailsSuccess, detailsFailure);
}

function detailsSuccess(result) {
	busy.hide();
	alert(JSON.stringify(result));
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
/* JavaScript content from js/main.js in folder android */
// This method is invoked after loading the main HTML and successful initialization of the IBM MobileFirst Platform runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}