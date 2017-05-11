var searchList = function() {
    var value = $("#search").val();
    var param = {
        searchValue: value,
        flag: 'F'
    };
    if ($("div table[id=searchData]").empty()) {
        $.ajax({
            method: "GET",
            url: "saveTestData",
            data: param,
            success: function(data) {
                var jsondata = JSON.parse(data);
                $.each(jsondata, function(key, value) {
                    $("#right").append("<br/><table id='searchData' style='border-collapse:collapse; border-color: rgba(26,89,120,0.9); '></table>");
                    $.each(value, function(innerkey, innervalue) {
                        var appendData = "<tr><td style='color: #1d3c41; padding-top: 5px; padding-bottom: 5px; font-weight: bold; padding-left: 5px;'>" + innerkey.toUpperCase() + "</td><td style='color: #1d3c41;  padding-top: 5px; padding-bottom: 5px; padding-left: 5px;'>" + innervalue + "</td></tr>";
                        $("#searchData").append(appendData);
                    });
                });
            },
            error: function(xhr, status, error) {
                alert("error---" + error);
            }
        });
    }
}


var getTopperList = function() {
    $("#left").empty();
    $("#left").append("<table id='topperData' style='width:100%;'></table>");
    var param = {
        flag: 'TL'
    };
    $.ajax({
        method: "GET",
        url: "getQuestion",
        data: param,
        success: function(data) {
            var jsondata = JSON.parse(data);
            var count = 0;
            var category = "";
            var username = "";
            var marks = "";
            var time = "";
            $.each(jsondata, function(key, value) {
                if (count === 3)
                {
                    count = 0;
                }
                $.each(value, function(innerkey, innervalue) {
                    if (innerkey === "category")
                    {
                        category = innervalue;
                    }
                    else if (innerkey === "username")
                    {
                        username = innervalue;
                    }
                    else if (innerkey === "marks")
                    {
                        marks = innervalue;
                    }
                    else if (innerkey === "besttime")
                    {
                        time = innervalue;
                    }
                });
                if (count === 0)
                {
                    $("#topperData").append("<tr><td colspan='4' style='text-align:center;font-weight:bold;font-size:20px;padding-top:20px;padding-bottom:10px;'>" + category + "</td></tr><tr><td style='width:10%;font-weight:bold;'>S.N.</td><td style='width:30%;font-weight:bold;'>Name</td><td style='width:30%;font-weight:bold;'>Marks</td><td style='width:30%;font-weight:bold;'>Best Time</td></tr>");
                    count++;
                    $("#topperData").append("<tr><td style='width:10%;'>" + count + "</td><td style='width:30%;'>" + username + "</td><td style='width:30%;'>" + marks + "</td><td style='width:30%;'>" + time + "</td></tr>");
                }
                else
                {
                    count++;
                    $("#topperData").append("<tr><td style='width:10%;'>" + count + "</td><td style='width:30%;'>" + username + "</td><td style='width:30%;'>" + marks + "</td><td style='width:30%;'>" + time + "</td></tr>");
                }
            });
            piechartData();
        },
        error: function(xhr, status, error) {
            alert("error---" + error);
        }
    });
}

var piechartData = function() {
    var param = {
        flag: 'PC'
    };
    $.ajax({
        method: "GET",
        url: "getChartData",
        data: param,
        success: function(data) {
            console.log(data);
            var outerarray = [];
            $.each(JSON.parse(data), function(outerkey, outervalue) {
                var innerarray = [];
                $.each(outervalue, function(innerkey, innervalue) {
                    innerarray.push(innerkey);
                    innerarray.push(parseInt(innervalue));
                });
                console.log(innerarray.toString())
                outerarray.push(innerarray);
            });
            console.log(outerarray.toString())
            google.charts.load('current', {'packages': ['corechart']});
            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart);
            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
            function drawChart() {
                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Category');
                data.addColumn('number', 'TestCount');
                data.addRows(outerarray);
                var options = {'title': 'Tests given per Subject',
                    titleTextStyle: {
                        color: "#191970",
                        fontName: "Arial",
                        fontSize: 20,
                        bold: true,
                    },
                    'width': 600,
                    'height': 300,
                    'backgroundColor': '#E4F1FF',
                    'legend': {
                        textStyle: {fontSize: 15}
                    },
                    'is3D': true};

                // Instantiate and draw our chart, passing in some options.
                var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
                chart.draw(data, options);
            }
        },
        error: function(data) {
            alert(data);

        }
    });
}