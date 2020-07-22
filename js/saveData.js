function nkw_debug() {
	console.log("testnkw1");
}

function exportSelectedBuild() {
	let buildsList = document.cookie.split("; ");
	let selectedBuild = document.getElementsByName("A_SaveSlot")[0].value;
	let b_data = {};

	for(i=0;buildsList[i];i++){
		if (buildsList[i].substr(0,5) == selectedBuild){
			b_data[buildsList[i].substr(0,5)] = buildsList[i].substr(6,buildsList[i].length);
			break;
		}
	}

	txt = JSON.stringify(b_data);
	exportData();
}

function exportAllBuilds() {
	let buildsList = document.cookie.split("; ");
	let b_data = {};

	for(i=0;buildsList[i];i++){	
		b_data[buildsList[i].substr(0,5)] = buildsList[i].substr(6,buildsList[i].length);
	}

	txt = JSON.stringify(b_data);
	exportData();
}

function exportData() {
	let BuildData = document.createElement('a');
	BuildData.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt));
	BuildData.setAttribute('download', "exportData.calc");
	
	BuildData.style.display = 'none';
	document.body.appendChild(BuildData);
	BuildData.click();
	document.body.removeChild(BuildData);
}

function importData(loaded_data){
	document.getElementById("load_dialog").innerHTML = "Import builds from file?";
	$("#load_dialog").dialog({
		autoOpen: true,
		draggable: true,
		position: { my: "center top+100", at: "center top+100"},
		buttons: {
			"Yes": function() {
				$(this).dialog("close");
				
				let overwrite_all = false;
				let l_data = JSON.parse(loaded_data);
				
				let buildsList = document.cookie.split("; ");
				let b_data = {};
			
				for(i=0;buildsList[i];i++){	
					b_data[buildsList[i].substr(0,5)] = buildsList[i].substr(6,buildsList[i].length);
				}
				
				for (var key in l_data) {
					var d_action = "";
					if (b_data[key]) {
						// exist in b_data, prompt dialog
						
						if(!overwrite_all) {
							// overwrite_all is false
							document.getElementById("load_dialog").innerHTML = "Slot " + getSlotName(key) + " occupied, Overwrite?";
							$("#load_dialog").dialog({
								autoOpen: true,
								draggable: true,
								position: { my: "center top+100", at: "center top+100"},
								buttons: {
									"Overwrite": function() {
										// Overwrite
										document.getElementById("load_dialog").innerHTML = "Loading...";
										$(this).dialog("close");
										loadBuild(key, l_data[key]);
									},
									"Skip": function() {
										$(this).dialog("close");
										d_action = "continue"; 
										// Continue;
									},
									"Overwrite All": function() {
										// Overwrite All
										document.getElementById("load_dialog").innerHTML = "Loading...";
										$(this).dialog("close");
										overwrite_all = true;
										loadBuild(key, l_data[key]);
									},
									"Skip All": function() {
										$(this).dialog("close");
										d_action = "break"; 
										//break;
									}
								},
								width: "40%"
							});
						} else {
							// overwrite_all is true
							document.getElementById("load_dialog").innerHTML = "Loading...";
							loadBuild(key, l_data[key]);
						}
						
						if (d_action === "continue") {
							continue;
						}
						if (d_action === "break") {
							break;
						}
						
					} else { 
						// doesn't exist in b_data, load the new build
						document.getElementById("load_dialog").innerHTML = "Loading...";
						loadBuild(key, l_data[key]);
					}
				}
			},
			"No": function() {
				$(this).dialog("close");
				//return;
			}
		},
		width: "40%"
	});
}

function loadBuild(d_key, d_value){
	let exp_cookie = new Date();
	exp_cookie.setTime(exp_cookie.getTime()+(99000*1000*60*60*24));
	document.cookie = d_key + "=" + d_value + "; expires=" + exp_cookie.toGMTString();
	LoadCookie3();
}

function getSlotIndex(slot_key){
	
	for (var index in document.getElementsByName("A_SaveSlot")[0].options) {
		if (document.getElementsByName("A_SaveSlot")[0].options[index].value == slot_key) {
			return index;
		}
	}
	return -1;
}

function getSlotName(slot_key){
	if (getSlotElem(slot_key)) {
		return getSlotElem(slot_key).innerText;
	} else {
		return "ERROR, PLEASE CANCEL";
	}
}

function getSlotElem(slot_key){
	return document.getElementsByName("A_SaveSlot")[0][getSlotIndex(slot_key)];
}

function getSlotNum(slot_key){
	return getSlotIndex(slot_key);
}

function deleteCurrentBuild() {
	document.getElementById("load_dialog").innerHTML = "Delete " + getSlotName(document.getElementsByName("A_SaveSlot")[0].value) + " ?";
	$("#load_dialog").dialog({
		autoOpen: true,
		draggable: true,
		position: { my: "center top+100", at: "center top+100"},
		buttons: {
			"Yes": function() {
				$(this).dialog("close");
				let slot_val = document.getElementsByName("A_SaveSlot")[0].value;
				document.cookie = document.getElementsByName("A_SaveSlot")[0].value + "=;expires=Thu,01-Jan-70 00:00:01 GMT";
				document.getElementsByName("A_SaveSlot")[0][getSlotIndex(slot_val)].innerText = "Save" + getSlotNum(slot_val) + ": No Data";
			},
			"No": function() {
				$(this).dialog("close");
			}
		},
		width: "40%"
	});
}

function deleteAllBuild() {
	document.getElementById("load_dialog").innerHTML = "Delete all builds?";
	$("#load_dialog").dialog({
		autoOpen: true,
		draggable: true,
		position: { my: "center top+100", at: "center top+100"},
		buttons: {
			"Yes": function() {
				$(this).dialog("close");
				for (i = 0; i < document.getElementsByName("A_SaveSlot")[0].length; i++) {
					document.cookie = "num" + insertLeadingZero(i) + "=;expires=Thu,01-Jan-70 00:00:01 GMT";
					document.getElementsByName("A_SaveSlot")[0][i].innerText = "Save" + (i+1) + ": No Data";
				}
			},
			"No": function() {
				$(this).dialog("close");
			}
		},
		width: "40%"
	});
}

function handleFileSelect(evt) {
	let files = evt.target.files;
	let load_result = "";
	let reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			load_result = e.target.result;
			importData(load_result)
		};
	})(files[0]);
	reader.readAsText(files[0]);
	document.getElementById('myfile').value = null;
}

$(document).ready(() => {
	document.getElementById('myfile').addEventListener('change', handleFileSelect, false);
});