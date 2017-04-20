function findPatients() {
    patientName = $("#searchpatient").val();
    $("#hiddenPersons").text("");
    $("#searchTableBody").html("");
    $.ajax({
        url: "https://gw151.iu.xsede.org/openmrs/ws/rest/v1/person?q=" + patientName,
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/json; charset=x-user-defined");
        }
    }).done(function (data) {
        searchArray = data.results;
        for (i = 0; i < searchArray.length; i++) {
            $.ajax({
                url: "https://gw151.iu.xsede.org/openmrs/ws/rest/v1/obs?patient=" + searchArray[i].uuid,
                beforeSend: function (xhr) {
                    xhr.overrideMimeType("application/json; charset=x-user-defined");
                }
            }).done(function (obsData) {
                var persons = [];
                for (j = 0; j < obsData.results.length; j++) {
                    visitText = obsData.results[j].display;
                    if (visitText.includes('CHRONIC OBSTRUCTIVE PULMONARY DISEASE') && visitText.includes('Confirmed diagnosis')) {
                        url = this.url;
                        persons.push(url.substr(url.indexOf('=') + 1, url.length));
                    }
                    ;
                }
                persons = Array.from(new Set(persons));
                for (i = 0; i < persons.length; i++) {
                    $("#hiddenPersons").text($("#hiddenPersons").text() + ',' + persons[i]);
                    $.ajax({
                        url: "https://gw151.iu.xsede.org/openmrs/ws/rest/v1/person/" + persons[i],
                        beforeSend: function (xhr) {
                            xhr.overrideMimeType("application/json; charset=x-user-defined");
                        }
                    }).done(function (data) {
                        $("#searchTableBody").html($("#searchTableBody").html() + '<tr onclick="loadObs(\''+data.uuid+'\')"><td>' + data.display + '</td><td>' + data.age + '</td><td>' + data.gender + '</td><td>' + data.uuid + '</td></tr>');
                    });
                }
            });
        }
    });
}

$(document).ready(function () {
    var table = $('#searchTable').DataTable({
        info: false,
        searching: false,
        paging: false,
        ordering: false
    });
});

function loadObs(uuid) {
    console.log(uuid);
}
