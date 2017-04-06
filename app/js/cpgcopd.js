function findPatients() {
    patientName = $("#searchpatient").val();
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
                for (j = 0; j < obsData.results.length; j++) {
                    visitText = obsData.results[j].display;
                    if(visitText.includes('CHRONIC OBSTRUCTIVE PULMONARY DISEASE')){
                        console.log(searchArray[i].uuid);
                    };
                }
            });
        }
    });
}
