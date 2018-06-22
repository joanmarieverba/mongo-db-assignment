// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the information on the page
  
        $("#articles").append(`<div class="panel panel-default">
        <div class="panel-heading">
        <h3 class="panel-title"><a href=${data[i].url}>${data[i].headline}</a>
        <button class="firstbtn" data-id=${data[i]._id}>SAVE ARTICLE</button><p></h3></div>
        <div class="panel-body">${data[i].summary}<p></div>
        <div class="panel-body">${data[i].note}<p></div></div>`);
    }
});

// click on scrape button
$(".btn-primary").on("click", function(){
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    $.get("/scrape", function(response){
        console.log(response);
        location.reload();
    });
});

//click on home button
$(".btn-info").on("click", function () {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    $.get("/", function (response) {
        console.log(response);
        location.reload();
    });
});

//click on saved articles button
$(".btn-success").on("click", function () {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    $("#articles").empty();
    // Grab the articles as a json
    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // return to true when working
            if (data[i].saved) {

                $("#articles").append(`<div class="panel panel-default">
                <div class="panel-heading">
                <h3 class="panel-title"><a href=${data[i].url}>${data[i].headline}</a>
                <button class="deletebtn" data-id=${data[i]._id}>DELETE FROM SAVED</button></h3></div>
                <div class="panel-body">${data[i].summary}<p></div>
                
                <div class="panel-body">${data[i].note}<p></div>

                <div class="panel-body">
                <form class="create-form inputbutton">
                <div class="form-group">
                <textarea id="submitNote" name="note" rows="1" cols="115"></textarea>
                <button class="notebtn" data-id=${data[i]._id}>ARTICLE NOTE</button></form><p></div></div>`);

            };
        };
      //  location.reload();
    });
})

// click on the save article buttom
$("body").on("click", ".firstbtn", function () {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    // Save the id
    let saveId = $(this).attr("data-id");
    console.log ("clicked on save article");
    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/saved/" + saveId
    })
        // With that done, nothing else to do
        .then(function (data) {
            console.log(data);
        })
        .catch (function (err) {
        // If an error occurred, send it to the client
        res.json(err);
        });
});

// click on the delete article from saved buttom
$("body").on("click", ".deletebtn", function () {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    // Save the id
    let holdId = $(this).attr("data-id");
    console.log("clicked on delete article");
    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/delete/" + holdId
    })
        // With that done, nothing else to do
        .then(function (data) {
            console.log(data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// click on the article note button
$("body").on("click", ".notebtn", function () {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    // Save the id 
    let noteId = $(this).attr("data-id");
    let inputNote= $(this).prev().val().trim();
    console.log("noteID ", noteId),
    console.log("inputnote ", inputNote);
    // store input note as an object
    let objNote = { note: inputNote };
    //clear input box
    $(this).prev().val("");

    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/articles/" + noteId,
        data: objNote
    })
        // check note information
        .then(function (data) {
            console.log("notedata", data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

