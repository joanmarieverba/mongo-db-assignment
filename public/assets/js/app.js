// Grab the articles as a json
$.getJSON("/articles", function (data) {
    $("#notebox").hide();
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the information on the page
        
 //       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].url + "<br />" + data[i].summary + "<button data-id='" + data[i]._id + "'>SAVE</button> </p>");
 //       $("#articles").append(data[i].headline + "<button data-id='" + data[i]._id + "'>SAVE ARTICLE</button> <p>" + data[i].summary + "<p>");      
//      $("#articles").append("<a href='" + data[i].url + "'>" + data[i].headline + "</a>"  + "<button data-id='" + data[i]._id + "'>SAVE ARTICLE</button> <p>" + data[i].summary + "<p>");
 //       $("#articles").append(`</div><a href=${data[i].url}>${data[i].headline}</a><button data-id=${data[i]._id}>SAVE ARTICLE</button><p>${data[i].summary}<p>`);
        $("#articles").append(`<div class="panel panel-default">
        <div class="panel-heading">
        <h3 class="panel-title"><a href=${data[i].url}>${data[i].headline}</a><button class="firstbtn" data-id=${data[i]._id}>SAVE ARTICLE</button><p></h3></div>
            <div class="panel-body">${data[i].summary}<p></div></div>`);
}
});




$(".btn-primary").on("click", function(){
    $("#notebox").hide();
    $.get("/scrape", function(response){
        console.log(response);
        location.reload();
    })
})

$(".btn-info").on("click", function () {
    $("#notebox").hide();
    $.get("/", function (response) {
        console.log(response);
        location.reload();
    })
})


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.headline + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.headline);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


